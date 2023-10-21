import process from 'node:process'
import type { Db } from 'mongodb'
import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.MONGODB_URI ?? ''
const database = process.env.MONGODB_DB ?? ''

// eslint-disable-next-line import/no-mutable-exports
export let mongoClient: MongoClient
// eslint-disable-next-line import/no-mutable-exports
export let mongoDB: Db

export async function ConnectMongoDB() {
  try {
    mongoClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
    await mongoClient.connect()
    mongoDB = mongoClient.db(database)
    await mongoDB.command({ ping: 1 })
    // eslint-disable-next-line no-console
    console.log('Successfully connected to MongoDB.')
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log('Failed to connect to MongoDB.', error)
  }
}
