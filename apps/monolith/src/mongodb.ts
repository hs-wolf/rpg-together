import { Db, MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI ?? '';
const database = process.env.MONGODB_DB ?? '';

export let mongoClient: MongoClient;
export let mongoDB: Db;

export async function ConnectMongoDB() {
  try {
    mongoClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await mongoClient.connect();
    mongoDB = mongoClient.db(database);
    await mongoDB.command({ ping: 1 });
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.log('Failed to connect to MongoDB.', error);
  }
}
