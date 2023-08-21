import { Db, ObjectId } from 'mongodb';
import { ITablesRepository } from './tablesRepositoryInterface';
import { Table } from '@rpg-together/models';
import { MONGODB_COLLECTION_TABLES, MONGODB_COLLECTION_USERS } from '@rpg-together/utils';

export class TablesRepositoryMongoDB implements ITablesRepository {
  constructor(private mongoDB: Db) {}

  private _collection = this.mongoDB.collection(MONGODB_COLLECTION_TABLES);

  async createTable(table: Table) {
    const newTable = table;
    const _id = new ObjectId();
    newTable.id = _id.toString();
    await this._collection.insertOne({ _id, ...newTable.toMap() });
    return newTable;
  }

  async getTablesFromUser(userId: string) {
    const docs = await this._collection.aggregate([{ $match: { owner: { id: userId } } }, this._getOwnerPipeline]).toArray();
    return docs.map((doc) => Table.fromMongoDB(doc)).filter((table) => table) as Table[];
  }

  async getTable(id: string) {
    const docs = await this._collection.aggregate([{ $match: { id } }, this._getOwnerPipeline]).toArray();
    return Table.fromMongoDB(docs[0]);
  }

  async updateTable(table: Table) {
    await this._collection.updateOne({ id: table.id }, { $set: table.toMap() });
  }

  async deleteTable(id: string) {
    await this._collection.deleteOne({ id });
  }

  private _getOwnerPipeline = {
    $lookup: {
      from: MONGODB_COLLECTION_USERS,
      localField: 'owner.id',
      foreignField: 'id',
      pipeline: [
        {
          $project: {
            _id: 0,
            id: 1,
            username: 1,
            avatar: 1,
          },
        },
      ],
      as: 'owner',
    },
  };
}
