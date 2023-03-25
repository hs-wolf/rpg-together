import { Application } from '@rpg-together/models';

export interface IApplicationsRepository {
  getApplicationsFromUser(userId: string): Promise<Application[]>;

  getApplicationsFromTable(userId: string): Promise<Application[]>;

  getApplication(applicationId: string): Promise<Application | null>;

  createApplication(application: Application): Promise<Application | null>;

  updateApplication(application: Application): Promise<void>;

  deleteApplication(applicationId: string): Promise<void>;
}
