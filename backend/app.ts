import express, { type Express } from 'express'
import cors from './middlewares/cors.middleware'
import logger from './middlewares/logger.middleware'
import { errorHandler, notFound } from './middlewares/error.middleware'
import authRoutes from './routes/auth.routes'
import eventRoutes from './routes/event.routes'

export function createApp(): Express {
  const app = express()

  app.use(cors)
  app.use(express.json())
  app.use(logger)

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/events', eventRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}

export default createApp
