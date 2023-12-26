import type { Db, Document, Filter, OptionalUnlessRequiredId } from 'mongodb'
import { ObjectId } from 'mongodb'
import type { CRUDFilter, ICRUDRepository } from './CRUDRepositoryInterface'

export class CRUDRepositoryMongoDB<T extends Document> implements ICRUDRepository<T> {
  constructor(private mongoDB: Db, private collectionName: string) {}

  private _collection = this.mongoDB.collection<T>(this.collectionName)

  async create(document: Partial<T>): Promise<void> {
    const doc = { ...document } as OptionalUnlessRequiredId<T>
    if (doc.id)
      doc._id = new ObjectId(doc.id)
    await this._collection.insertOne(doc)
  }

  async createMany(documents: Partial<T>[]): Promise<void> {
    const docs = documents as OptionalUnlessRequiredId<T>[]
    docs.forEach((doc) => {
      if (doc.id)
        doc._id = new ObjectId(doc.id)
    })
    await this._collection.insertMany(docs)
  }

  async get(filter: CRUDFilter<T>): Promise<T | null> {
    const mongodbFilter = filter as Filter<T>
    return await this._collection.findOne<T>(mongodbFilter)
  }

  async getMany(filter?: CRUDFilter<T>): Promise<T[] | null> {
    const mongodbFilter = filter as Filter<T>
    const cursor = this._collection.find<T>(mongodbFilter)
    return await cursor.toArray()
  }

  async update(filter: CRUDFilter<T>, document: Partial<T>): Promise<void> {
    const mongodbFilter = filter as Filter<T>
    await this._collection.updateOne(mongodbFilter, { $set: document })
  }

  async updateMany(filter: CRUDFilter<T>, document: Partial<T>): Promise<void> {
    const mongodbFilter = filter as Filter<T>
    await this._collection.updateMany(mongodbFilter, { $set: document })
  }

  async delete(filter: CRUDFilter<T>): Promise<void> {
    const mongodbFilter = filter as Filter<T>
    await this._collection.deleteOne(mongodbFilter)
  }

  async deleteMany(filter: CRUDFilter<T>): Promise<void> {
    const mongodbFilter = filter as Filter<T>
    await this._collection.deleteMany(mongodbFilter)
  }
}
