import { Db, ObjectId } from 'mongodb';
import { IApplicationsRepository } from './applicationsRepositoryInterface';
import { Application } from '@rpg-together/models';
import {
  MONGODB_COLLECTION_APPLICATIONS,
  mongodbPipelineGetTableHeader,
  mongodbPipelineGetUserHeader,
} from '@rpg-together/utils';

export class ApplicationsRepositoryMongoDB implements IApplicationsRepository {
  constructor(private mongoDB: Db) {}

  private _collection = this.mongoDB.collection(MONGODB_COLLECTION_APPLICATIONS);

  async createApplication(application: Application) {
    const newApplication = application;
    const _id = new ObjectId();
    newApplication.id = _id.toString();
    await this._collection.insertOne({ _id, ...newApplication.toMap() });
    return newApplication;
  }

  async getApplicationsFromTable(tableId: string) {
    const docs = await this._collection
      .aggregate([
        { $match: { table: { id: tableId } } },
        mongodbPipelineGetTableHeader('table'),
        mongodbPipelineGetUserHeader('applicant'),
      ])
      .toArray();
    return docs.map((doc) => Application.fromMongoDB(doc)).filter((table) => table) as Application[];
  }

  async getApplicationsFromUser(userId: string) {
    const docs = await this._collection
      .aggregate([
        { $match: { applicant: { id: userId } } },
        mongodbPipelineGetTableHeader('table'),
        mongodbPipelineGetUserHeader('applicant'),
      ])
      .toArray();
    return docs.map((doc) => Application.fromMongoDB(doc)).filter((table) => table) as Application[];
  }

  async getApplicationFromTableAndUser(tableId: string, userId: string) {
    const docs = await this._collection
      .aggregate([
        { $match: { table: { id: tableId }, applicant: { id: userId } } },
        mongodbPipelineGetTableHeader('table'),
        mongodbPipelineGetUserHeader('applicant'),
      ])
      .toArray();
    return Application.fromMongoDB(docs[0]);
  }

  async getApplication(applicationId: string) {
    const docs = await this._collection
      .aggregate([
        { $match: { id: applicationId } },
        mongodbPipelineGetTableHeader('table'),
        mongodbPipelineGetUserHeader('applicant'),
      ])
      .toArray();
    return Application.fromMongoDB(docs[0]);
  }

  async updateApplication(application: Application) {
    await this._collection.updateOne({ id: application.id }, { $set: application.toMap() });
  }

  async deleteApplication(applicationId: string) {
    await this._collection.deleteOne({ id: applicationId });
  }
}
