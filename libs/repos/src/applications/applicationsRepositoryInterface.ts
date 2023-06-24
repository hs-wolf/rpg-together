import { Application } from '@rpg-together/models';

export interface IApplicationsRepository {
  createApplication(application: Application): Promise<Application | null>;

  getApplication(applicationId: string): Promise<Application | null>;

  getApplicationsFromUser(userId: string): Promise<Application[]>;

  getApplicationsFromTable(tableId: string): Promise<Application[]>;

  getApplicationFromTableAndUser(tableId: string, userId: string): Promise<Application | null>;

  updateApplication(application: Application): Promise<void>;

  deleteApplication(applicationId: string): Promise<void>;
}
