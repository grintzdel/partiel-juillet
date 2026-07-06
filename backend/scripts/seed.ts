import 'dotenv/config'
import bcrypt from 'bcrypt'
import { connectDB, disconnectDB } from '../config/db'
import User from '../models/User.model'
import Event from '../models/Event.model'

const SALT_ROUNDS = 10
const TEST_USER_EMAIL = process.env.SEED_USER_EMAIL || 'test@eventhub.dev'
const TEST_USER_PASSWORD = process.env.SEED_USER_PASSWORD || 'Password123!'

function daysFromNow(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not defined')
  }

  await connectDB(uri)

  // --- Utilisateur de test (upsert idempotent) ---
  const passwordHash = await bcrypt.hash(TEST_USER_PASSWORD, SALT_ROUNDS)
  await User.updateOne(
    { email: TEST_USER_EMAIL },
    { $set: { name: 'Test User', passwordHash } },
    { upsert: true }
  )
  console.log(`[seed] User ready: ${TEST_USER_EMAIL} / ${TEST_USER_PASSWORD}`)

  // --- Événements (reset puis insertion d'un jeu d'exemple frais) ---
  await Event.deleteMany({})
  await Event.insertMany([
    {
      title: 'Cours : Introduction à TypeScript',
      description: 'Les bases du typage statique appliquées à un projet Node.js réel.',
      date: daysFromNow(3),
      location: 'EEMI - Salle 204',
      category: 'cours',
      capacity: 30,
    },
    {
      title: 'Atelier : Déploiement avec Docker',
      description: 'Conteneuriser et déployer une application full-stack pas à pas.',
      date: daysFromNow(7),
      location: 'EEMI - Lab Info',
      category: 'atelier',
      capacity: 20,
    },
    {
      title: 'Conférence : L’avenir du web',
      description: 'Table ronde avec des professionnels du secteur sur les tendances 2026.',
      date: daysFromNow(14),
      location: 'EEMI - Amphi A',
      category: 'conference',
      capacity: 120,
    },
    {
      title: 'Networking : Afterwork alumni',
      description: 'Rencontre informelle entre étudiants et anciens de l’école autour d’un verre.',
      date: daysFromNow(10),
      location: 'Le Perchoir, Paris',
      category: 'networking',
      capacity: 50,
    },
  ])

  const count = await Event.countDocuments()
  console.log(`[seed] Events ready: ${count} events inserted.`)

  await disconnectDB()
}

main().catch((err) => {
  console.error('[seed] Failed:', err)
  process.exit(1)
})
