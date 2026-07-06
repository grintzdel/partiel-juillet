// Wrapper fetch typé autour de l'API EventHub.
// Base URL : VITE_API_URL si défini, sinon chemin relatif /api (proxy Vite).

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '/api'

// Clé de stockage du token, partagée avec le store auth.
export const TOKEN_STORAGE_KEY = 'eventhub_token'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Extrait un message lisible depuis le corps d'erreur du backend.
function extractError(body: unknown, status: number): ApiError {
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>
    if (typeof record.error === 'string') {
      return new ApiError(record.error, status)
    }
    // express-validator renvoie { errors: [{ msg, path }] }
    if (Array.isArray(record.errors) && record.errors.length > 0) {
      const first = record.errors[0] as Record<string, unknown>
      if (typeof first.msg === 'string') {
        return new ApiError(first.msg, status)
      }
    }
  }
  return new ApiError(`Erreur ${status}`, status)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...options.headers,
      },
    })
  } catch {
    throw new ApiError('Impossible de joindre le serveur.', 0)
  }

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const body: unknown = isJson ? await response.json() : null

  if (!response.ok) {
    throw extractError(body, response.status)
  }

  return body as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, payload: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(payload) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
