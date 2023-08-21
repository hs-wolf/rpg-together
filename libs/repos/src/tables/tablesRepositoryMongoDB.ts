import { Db, ObjectId } from 'mongodb';
import { ITablesRepository } from './tablesRepositoryInterface';
import { Table } from '@rpg-together/models';
import { MONGODB_COLLECTION_TABLES, mongodbPipelineGetUserHeader } from '@rpg-together/utils';

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
    const docs = await this._collection
      .aggregate([{ $match: { owner: { id: userId } } }, mongodbPipelineGetUserHeader('owner')])
      .toArray();
    return docs.map((doc) => Table.fromMongoDB(doc)).filter((table) => table) as Table[];
  }

  async getTable(tableId: string) {
    const docs = await this._collection
      .aggregate([{ $match: { id: tableId } }, mongodbPipelineGetUserHeader('owner')])
      .toArray();
    return Table.fromMongoDB(docs[0]);
  }

  async updateTable(table: Table) {
    await this._collection.updateOne({ id: table.id }, { $set: table.toMap() });
  }

  async deleteTable(tableId: string) {
    await this._collection.deleteOne({ id: tableId });
  }
}
