import { Inject, Singleton } from 'typescript-ioc';
import { UsersService } from '../users/usersService';
import { TablesService } from '../tables/tablesService';
import { NotificationsService } from '../notifications/notificationsService';
import {
  ApiError,
  ResponseCodes,
  ResponseMessages,
  Application,
  ApplicationCreateBody,
  ApplicationUpdateBody,
  ApplicationStatus,
} from '@rpg-together/models';
import { IApplicationsRepository, ApplicationsRepositoryFirestore } from '@rpg-together/repos';
import { apiErrorHandler, LIMIT_OF_APPLICATIONS } from '@rpg-together/utils';

@Singleton
export class ApplicationsService {
  @Inject
  private usersService: UsersService;
  @Inject
  private tablesService: TablesService;
  @Inject
  private notificationsService: NotificationsService;

  private _applicationsRepo: IApplicationsRepository;

  constructor(applicationsRepo: IApplicationsRepository) {
    this._applicationsRepo = applicationsRepo ?? new ApplicationsRepositoryFirestore();
  }

  async createApplication(applicantId: string, body: ApplicationCreateBody): Promise<Application> {
    try {
      const existingApplications = await this.getApplicationsFromUser(applicantId);
      if (existingApplications.length >= LIMIT_OF_APPLICATIONS) {
        throw new ApiError(ResponseCodes.BAD_REQUEST, ResponseMessages.APPLICATIONS_LIMIT_REACHED);
      }
      if (existingApplications.some((application) => application.tableId === body.tableId)) {
        throw new ApiError(ResponseCodes.BAD_REQUEST, ResponseMessages.ALREADY_APPLIED_TO_TABLE);
      }
      const table = await this.tablesService.getTable(body.tableId ?? '');
      if (table.owner.id === applicantId) {
        throw new ApiError(ResponseCodes.BAD_REQUEST, ResponseMessages.APPLICATING_TO_SELF);
      }
      const applicant = await this.usersService.getUser(applicantId);
      const currentDate = new Date();
      const newApplication = Application.fromMap({ ...body });
      newApplication.applicantId = applicantId;
      newApplication.applicantHeader = { avatar: applicant.avatar, username: applicant.username };
      newApplication.tableHeader = { banner: table.banner, title: table.title };
      newApplication.status = ApplicationStatus.WAITING;
      newApplication.creationDate = currentDate;
      newApplication.lastUpdateDate = currentDate;
      const [application] = await Promise.all([
        this._applicationsRepo.createApplication(newApplication),
        this.notificationsService.notifyNewApplication(table.owner.id, {
          yourTableId: table.id,
          yourTableApplicantId: applicant.id,
        }),
      ]);
      return application;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async getApplication(id: string): Promise<Application> {
    try {
      const application = await this._applicationsRepo.getApplication(id);
      if (!application) {
        throw new ApiError(ResponseCodes.NOT_FOUND, ResponseMessages.APPLICATION_NOT_FOUND);
      }
      return application;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async getApplicationsFromUser(userId: string): Promise<Application[]> {
    try {
      return await this._applicationsRepo.getApplicationsFromUser(userId);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async getApplicationsFromTable(tabledId: string): Promise<Application[]> {
    try {
      return await this._applicationsRepo.getApplicationsFromTable(tabledId);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async getApplicationFromTableAndUser(tableId: string, userId: string): Promise<Application> {
    try {
      return await this._applicationsRepo.getApplicationFromTableAndUser(tableId, userId);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async updateApplication(application: Application | string, request: ApplicationUpdateBody): Promise<Application> {
    try {
      const oldApplication = typeof application === 'string' ? await this.getApplication(application) : application;
      const applicant = await this.usersService.getUser(oldApplication.applicantId);
      const newApplication = Application.fromMap({
        ...oldApplication,
        ...request,
      });
      newApplication.applicantHeader = { username: applicant.username, avatar: applicant.avatar };
      newApplication.lastUpdateDate = new Date();
      await this._applicationsRepo.updateApplication(newApplication);
      return newApplication;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async changeApplicationStatus(applicationId: string, tableOwnerId: string, status: ApplicationStatus): Promise<void> {
    try {
      const application = await this.getApplication(applicationId);
      const table = await this.tablesService.getTable(application.tableId);
      if (table.owner.id !== tableOwnerId) {
        let message = '';
        switch (status) {
          case ApplicationStatus.ACCEPTED:
            message = ResponseMessages.COULD_NOT_ACCEPT_APPLICATION;
            break;
          case ApplicationStatus.DECLINED:
            message = ResponseMessages.COULD_NOT_DECLINE_APPLICATION;
            break;
          default:
            message = ResponseMessages.INVALID_APPLICATION_STATUS;
            break;
        }
        throw new ApiError(ResponseCodes.UNAUTHORIZED, message);
      }
      await this.updateApplication(application, { status });
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async deleteApplication(application: Application | string) {
    try {
      const applicationToDelete = typeof application === 'string' ? await this.getApplication(application) : application;
      await this._applicationsRepo.deleteApplication(applicationToDelete.id);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async deleteApplicationsFromUser(userId: string) {
    try {
      const applicationsToDelete = await this.getApplicationsFromUser(userId);
      await Promise.all(applicationsToDelete.map((application) => this.deleteApplication(application)));
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async deleteApplicationsFromTable(tableId: string) {
    try {
      const applicationsToDelete = await this.getApplicationsFromTable(tableId);
      await Promise.all(applicationsToDelete.map((application) => this.deleteApplication(application)));
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}
