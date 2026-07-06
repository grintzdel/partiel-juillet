import type { RequestHandler } from 'express'
import type { FilterQuery } from 'mongoose'
import Event, { type EventCategory, type IEvent } from '../models/Event.model'

interface ListEventsQuery {
  category?: string
  q?: string
}

interface CreateEventBody {
  title: string
  description: string
  date: string
  location: string
  category: string
  capacity?: number
}

export const listEvents: RequestHandler<unknown, unknown, unknown, ListEventsQuery> = async (req, res, next) => {
  try {
    const { category, q } = req.query
    const filter: FilterQuery<IEvent> = {}

    if (category) {
      filter.category = category
    }

    if (q) {
      const regex = new RegExp(q.trim(), 'i')
      filter.$or = [{ title: regex }, { description: regex }]
    }

    const events = await Event.find(filter).sort({ date: 1 })
    res.status(200).json(events)
  } catch (err) {
    next(err)
  }
}

export const getEvent: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      res.status(404).json({ error: 'Event not found' })
      return
    }
    res.status(200).json(event)
  } catch (err) {
    next(err)
  }
}

export const createEvent: RequestHandler<unknown, unknown, CreateEventBody> = async (req, res, next) => {
  try {
    const { title, description, date, location, category, capacity } = req.body
    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      location,
      category: category as EventCategory,
      capacity,
    })
    res.status(201).json(event)
  } catch (err) {
    next(err)
  }
}

export const deleteEvent: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) {
      res.status(404).json({ error: 'Event not found' })
      return
    }
    res.status(200).json({ message: 'Event deleted', _id: event._id })
  } catch (err) {
    next(err)
  }
}
