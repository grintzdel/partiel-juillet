import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals'
import type { Express } from 'express'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import createApp from '../app'
import Event from '../models/Event.model'

let mongoServer: MongoMemoryServer
let app: Express
let token: string

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret'
  process.env.JWT_EXPIRES_IN = '1h'

  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())

  app = createApp()

  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test User', email: 'test@eemi.com', password: 'secret123' })

  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@eemi.com', password: 'secret123' })

  token = login.body.token
})

afterEach(async () => {
  await Event.deleteMany({})
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('GET /api/events', () => {
  it('returns 200 and the list of events', async () => {
    await Event.create({
      title: 'Vue Workshop',
      description: 'A hands-on workshop on Vue.js',
      date: new Date('2026-01-12'),
      location: 'EEMI',
      category: 'workshop',
    })

    const res = await request(app).get('/api/events')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].title).toBe('Vue Workshop')
    expect(res.body[0].capacity).toBe(30)
  })

  it('filters events by category via ?category=', async () => {
    await Event.create([
      { title: 'React Course', description: 'Introduction to React', date: new Date('2026-02-01'), location: 'EEMI', category: 'course' },
      { title: 'Meetup', description: 'Networking between students', date: new Date('2026-02-02'), location: 'EEMI', category: 'networking' },
    ])

    const res = await request(app).get('/api/events?category=course')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].category).toBe('course')
  })
})

describe('POST /api/events', () => {
  it('returns 400 when data is invalid (title too short)', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Ab',
        description: 'short',
        date: '2026-01-12',
        location: 'EEMI',
        category: 'workshop',
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Invalid data')
    expect(Array.isArray(res.body.details)).toBe(true)
  })

  it('returns 401 without a JWT token', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({
        title: 'Vue Workshop',
        description: 'A hands-on workshop on Vue.js',
        date: '2026-01-12',
        location: 'EEMI',
        category: 'workshop',
      })

    expect(res.status).toBe(401)
  })

  it('creates an event with a valid token (201)', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Vue Workshop',
        description: 'A hands-on workshop on Vue.js',
        date: '2026-01-12',
        location: 'EEMI',
        category: 'workshop',
      })

    expect(res.status).toBe(201)
    expect(res.body._id).toBeDefined()
    expect(res.body.title).toBe('Vue Workshop')
    expect(res.body.capacity).toBe(30)
  })
})
