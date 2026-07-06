import 'dotenv/config'
import { connectDB, disconnectDB } from '../config/db'
import User from '../models/User.model'
import Event from '../models/Event.model'

/**
 * "Migration" MongoDB : Mongoose crée les collections à la volée, il n'y a donc
 * pas de migration SQL classique. Le seul état de schéma à synchroniser sont les
 * index déclarés dans les modèles (ex: l'index unique sur User.email).
 * `syncIndexes()` crée les index manquants et supprime ceux qui ne sont plus
 * déclarés. Le script est rejouable sans risque.
 */
async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not defined')
  }

  await connectDB(uri)

  console.log('[db:sync] Synchronizing indexes...')
  await User.syncIndexes()
  await Event.syncIndexes()
  console.log('[db:sync] Indexes are up to date.')

  await disconnectDB()
}

main().catch((err) => {
  console.error('[db:sync] Failed:', err)
  process.exit(1)
})
