import type { Db } from 'mongodb'
import { ObjectId } from 'mongodb'
import type { AcceptMessageUpdateBody } from '@rpg-together/models'
import { AcceptMessage } from '@rpg-together/models'
import {
  MONGODB_COLLECTION_ACCEPT_MESSAGES,
} from '@rpg-together/utilities'
import type { IAcceptMessageRepository } from './acceptMessageRepositoryInterface'

export class AcceptMessageRepositoryMongoDB implements IAcceptMessageRepository {
  constructor(private mongoDB: Db) {}

  private _collection = this.mongoDB.collection(MONGODB_COLLECTION_ACCEPT_MESSAGES)

  async createAcceptMessage(acceptMessage: AcceptMessage) {
    const newAcceptMessage = acceptMessage
    const _id = new ObjectId()
    newAcceptMessage.id = _id.toString()
    await this._collection.insertOne({ _id, ...newAcceptMessage.toMap() })
    return newAcceptMessage
  }

  async getAcceptMessage(acceptMessageId: string) {
    const doc = await this._collection.findOne({ id: acceptMessageId })
    return AcceptMessage.fromMongoDB(doc)
  }

  async updateAcceptMessage(acceptMessageId: string, acceptMessageUpdateBody: AcceptMessageUpdateBody) {
    await this._collection.updateOne({ id: acceptMessageId }, { $set: acceptMessageUpdateBody })
  }

  async deleteAcceptMessage(acceptMessageId: string) {
    await this._collection.deleteOne({ id: acceptMessageId })
  }
}
