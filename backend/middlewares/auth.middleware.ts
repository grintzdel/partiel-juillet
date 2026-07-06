import type { RequestHandler } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'

interface AuthTokenPayload extends JwtPayload {
  sub: string
  email: string
}

const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ error: 'Missing or malformed token' })
    return
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    res.status(500).json({ error: 'Internal server error' })
    return
  }

  try {
    const payload = jwt.verify(token, secret) as AuthTokenPayload
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export default requireAuth
