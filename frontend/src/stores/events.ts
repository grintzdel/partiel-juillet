import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api, ApiError } from '@/services/api'
import type { CreateEventInput, EventItem } from '@/types/event'

export const useEventsStore = defineStore('events', () => {
  const events = ref<EventItem[]>([])
  const current = ref<EventItem | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function toMessage(err: unknown, fallback: string): string {
    return err instanceof ApiError ? err.message : fallback
  }

  async function fetchEvents(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      events.value = await api.get<EventItem[]>('/events')
    } catch (err) {
      error.value = toMessage(err, 'Impossible de charger les événements.')
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string): Promise<void> {
    loading.value = true
    error.value = null
    current.value = null
    try {
      current.value = await api.get<EventItem>(`/events/${id}`)
    } catch (err) {
      error.value = toMessage(err, 'Événement introuvable.')
    } finally {
      loading.value = false
    }
  }

  async function createEvent(input: CreateEventInput): Promise<EventItem | null> {
    loading.value = true
    error.value = null
    try {
      const created = await api.post<EventItem>('/events', input)
      events.value = [...events.value, created]
      return created
    } catch (err) {
      error.value = toMessage(err, 'Création impossible.')
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteEvent(id: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await api.del(`/events/${id}`)
      events.value = events.value.filter((event) => event._id !== id)
      return true
    } catch (err) {
      error.value = toMessage(err, 'Suppression impossible.')
      return false
    } finally {
      loading.value = false
    }
  }

  return { events, current, loading, error, fetchEvents, fetchById, createEvent, deleteEvent }
})
