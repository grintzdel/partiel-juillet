import type { RequestHandler } from 'express'

function parseOrigins(raw: string | undefined): string[] {
  if (!raw || raw.trim() === '' || raw.trim() === '*') {
    return ['*']
  }
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

const allowedOrigins = parseOrigins(process.env.CORS_ORIGIN)

const cors: RequestHandler = (req, res, next) => {
  const requestOrigin = req.headers.origin

  if (allowedOrigins.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*')
  } else if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin)
    res.setHeader('Vary', 'Origin')
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }

  next()
}

export default cors
