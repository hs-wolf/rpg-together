import type { Db } from 'mongodb'
import { ObjectId } from 'mongodb'
import { User } from '@rpg-together/models'
import { MONGODB_COLLECTION_USERS } from '@rpg-together/utilities'
import type { IUsersRepository } from './usersRepositoryInterface'

export class UsersRepositoryMongoDB implements IUsersRepository {
  constructor(private mongoDB: Db) {}

  private _collection = this.mongoDB.collection(MONGODB_COLLECTION_USERS)

  async createUser(user: User) {
    const newUser = user
    const _id = new ObjectId()
    newUser.id = _id.toString()
    await this._collection.insertOne({ _id, ...newUser.toMap() })
    return newUser
  }

  async getUserByUsername(username: string) {
    const doc = await this._collection.findOne({ username })
    return User.fromMongoDB(doc)
  }

  async getUser(userId: string) {
    const doc = await this._collection.findOne({ id: userId })
    return User.fromMongoDB(doc)
  }

  async updateUser(user: User) {
    await this._collection.updateOne({ id: user.id }, { $set: user.toMap() })
  }

  async deleteUser(userId: string) {
    await this._collection.deleteOne({ id: userId })
  }
}
