import mongoose, { Schema, type Model } from 'mongoose'

export const EVENT_CATEGORIES = ['cours', 'atelier', 'conference', 'networking'] as const

export type EventCategory = (typeof EVENT_CATEGORIES)[number]

export interface IEvent {
  title: string
  description: string
  date: Date
  location: string
  category: EventCategory
  capacity: number
  createdAt: Date
  updatedAt: Date
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: EVENT_CATEGORIES,
        message: 'Category must be one of: cours, atelier, conference, networking',
      },
    },
    capacity: {
      type: Number,
      default: 30,
      min: [1, 'Capacity must be greater than 0'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const record = ret as unknown as Record<string, unknown>
        delete record.__v
        return record
      },
    },
  }
)

export const Event: Model<IEvent> = mongoose.model<IEvent>('Event', eventSchema)

export default Event
