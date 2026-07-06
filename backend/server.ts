import 'dotenv/config'
import createApp from './app'
import { connectDB } from './config/db'

const PORT = process.env.PORT || 3000

async function start(): Promise<void> {
  try {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error('MONGODB_URI is not defined')
    }

    await connectDB(uri)

    const app = createApp()
    app.listen(PORT, () => {
      console.log(`[server] EventHub EEMI API running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('[server] Failed to start:', err)
    process.exit(1)
  }
}

start()
