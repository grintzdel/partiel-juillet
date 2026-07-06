import mongoose from 'mongoose'

export async function connectDB(uri: string): Promise<typeof mongoose> {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined')
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
  console.log(`[db] Connected to MongoDB (${mongoose.connection.name})`)
  return mongoose
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect()
  console.log('[db] Disconnected from MongoDB')
}
