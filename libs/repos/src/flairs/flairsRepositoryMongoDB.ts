import { Db, ObjectId } from 'mongodb';
import { Flair } from '@rpg-together/models';
import { MONGODB_COLLECTION_APPLICATIONS } from '@rpg-together/utils';
import { IFlairsRepository } from './flairsRepositoryInterface';

export class FlairsRepositoryMongoDB implements IFlairsRepository {
  constructor(private mongoDB: Db) {}

  private _collection = this.mongoDB.collection(MONGODB_COLLECTION_APPLICATIONS);

  async createFlair(flair: Flair) {
    const newFlair = flair;
    const _id = new ObjectId();
    newFlair.id = _id.toString();
    await this._collection.insertOne({ _id, ...newFlair.toMap() });
    return newFlair;
  }

  async getAllFlairs() {
    const docs = await this._collection.find().toArray();
    return docs.map((doc) => Flair.fromMongoDB(doc)).filter((flair) => flair) as Flair[];
  }

  async getFlair(flairId: string) {
    const doc = await this._collection.findOne({ id: flairId });
    return Flair.fromMongoDB(doc);
  }

  async updateFlair(flair: Flair) {
    await this._collection.updateOne({ id: flair.id }, { $set: flair.toMap() });
  }

  async deleteFlair(flairId: string) {
    await this._collection.deleteOne({ id: flairId });
  }
}
