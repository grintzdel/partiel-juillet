import type { EventCategory } from '@/constants/categories'

export type { EventCategory }

export interface EventItem {
  _id: string
  title: string
  description: string
  date: string
  location: string
  category: EventCategory
  capacity: number
  createdAt: string
  updatedAt: string
}

export interface CreateEventInput {
  title: string
  description: string
  date: string
  location: string
  category: EventCategory
  capacity: number
}

export interface AuthUser {
  _id: string
  name: string
  email: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}
