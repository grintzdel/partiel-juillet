import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, ApiError, TOKEN_STORAGE_KEY } from '@/services/api'
import type { AuthResponse, AuthUser } from '@/types/event'

const USER_STORAGE_KEY = 'eventhub_user'

function loadUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(loadUser())
  const token = ref<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY))
  const error = ref<string | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))

  function persist(response: AuthResponse): void {
    user.value = response.user
    token.value = response.token
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user))
  }

  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password })
      persist(response)
      return true
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Connexion impossible.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(name: string, email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<AuthResponse>('/auth/register', { name, email, password })
      persist(response)
      return true
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Inscription impossible.'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout(): void {
    user.value = null
    token.value = null
    error.value = null
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  return { user, token, error, loading, isAuthenticated, login, register, logout }
})
