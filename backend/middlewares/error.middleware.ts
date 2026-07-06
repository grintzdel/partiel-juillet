import type { ErrorRequestHandler, RequestHandler } from 'express'

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Resource not found' })
}

interface MongooseLikeError {
  name?: string
  code?: number
  value?: unknown
  errors?: Record<string, { message: string }>
  keyValue?: Record<string, unknown>
  status?: number
  statusCode?: number
  message?: string
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const e = err as MongooseLikeError

  if (e.name === 'ValidationError' && e.errors) {
    const details = Object.values(e.errors).map((detail) => detail.message)
    res.status(400).json({ error: 'Invalid data', details })
    return
  }

  if (e.name === 'CastError') {
    res.status(400).json({ error: `Invalid identifier: ${String(e.value)}` })
    return
  }

  if (e.code === 11000) {
    const field = Object.keys(e.keyValue || {}).join(', ')
    res.status(409).json({ error: `Value already in use for: ${field}` })
    return
  }

  const status = e.status || e.statusCode || 500
  const message = status === 500 ? 'Internal server error' : e.message

  if (status === 500) {
    console.error('[error]', err)
  }

  res.status(status).json({ error: message })
}
