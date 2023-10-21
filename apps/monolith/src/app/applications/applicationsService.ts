import type {
  AcceptMessage,
  ApplicationCreateBody,
  ApplicationUpdateBody,
} from '@rpg-together/models'
import {
  ApiError,
  Application,
  ApplicationStatus,
  ResponseCodes,
  ResponseMessages,
} from '@rpg-together/models'
import type { IAcceptMessageRepository, IApplicationsRepository } from '@rpg-together/repositories'
import {
  AcceptMessageRepositoryMongoDB,
  ApplicationsRepositoryMongoDB,
} from '@rpg-together/repositories'
import {
  LIMIT_OF_APPLICATIONS,
  apiErrorHandler,
} from '@rpg-together/utilities'
import { mongoDB } from '../../mongodb'
import { NotificationsService } from '../notifications/notificationsService'
import { TablesService } from '../tables/tablesService'

export class ApplicationsService {
  constructor(applicationsRepo?: IApplicationsRepository, acceptMessageRepo?: IAcceptMessageRepository) {
    this._applicationsRepo
      = applicationsRepo ?? new ApplicationsRepositoryMongoDB(mongoDB)
    this._acceptMessageRepo = acceptMessageRepo ?? new AcceptMessageRepositoryMongoDB(mongoDB)
  }

  private _applicationsRepo: IApplicationsRepository
  private _acceptMessageRepo: IAcceptMessageRepository

  async createApplication(
    applicantId: string,
    body: ApplicationCreateBody,
  ): Promise<Application> {
    try {
      const existingApplications = await this.getApplicationsFromUser(
        applicantId,
      )
      if (existingApplications.length >= LIMIT_OF_APPLICATIONS) {
        throw new ApiError(
          ResponseCodes.BAD_REQUEST,
          ResponseMessages.APPLICATIONS_LIMIT_REACHED,
        )
      }
      if (
        existingApplications.some(
          application => application.table.id === body.table.id,
        )
      ) {
        throw new ApiError(
          ResponseCodes.BAD_REQUEST,
          ResponseMessages.ALREADY_APPLIED_TO_TABLE,
        )
      }
      const table = await new TablesService().getTable(body.table.id)
      if (table.owner.id === applicantId) {
        throw new ApiError(
          ResponseCodes.BAD_REQUEST,
          ResponseMessages.APPLICATING_TO_SELF,
        )
      }
      const currentDate = new Date()
      let newApplication = Application.fromMap({ ...body })
      newApplication.table = {
        id: body.table.id,
        owner: { id: table.owner.id },
      }
      newApplication.applicant = { id: applicantId }
      newApplication.status = ApplicationStatus.WAITING
      newApplication.creationDate = currentDate
      newApplication.lastUpdateDate = currentDate
      newApplication = await this._applicationsRepo.createApplication(
        newApplication,
      )
      new NotificationsService().notifyNewApplication(
        table.owner.id,
        newApplication.id,
      )
      return newApplication
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async getApplicationsFromUser(userId: string): Promise<Application[]> {
    try {
      return await this._applicationsRepo.getApplicationsFromUser(userId)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async getApplicationsFromTable(tabledId: string): Promise<Application[]> {
    try {
      return await this._applicationsRepo.getApplicationsFromTable(tabledId)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async getApplicationFromUserAndTable(
    userId: string,
    tableId: string,
  ): Promise<Application> {
    try {
      const application
        = await this._applicationsRepo.getApplicationFromUserAndTable(
          userId,
          tableId,
        )
      if (!application) {
        throw new ApiError(
          ResponseCodes.NOT_FOUND,
          ResponseMessages.APPLICATION_NOT_FOUND,
        )
      }
      return application
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async getApplication(id: string): Promise<Application> {
    try {
      const application = await this._applicationsRepo.getApplication(id)
      if (!application) {
        throw new ApiError(
          ResponseCodes.NOT_FOUND,
          ResponseMessages.APPLICATION_NOT_FOUND,
        )
      }
      return application
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async updateApplication(
    application: Application | string,
    request: ApplicationUpdateBody,
  ): Promise<Application> {
    try {
      const oldApplication
        = typeof application === 'string'
          ? await this.getApplication(application)
          : application
      const newApplication = Application.fromMap({
        ...oldApplication,
        ...request,
      })
      newApplication.lastUpdateDate = new Date()
      await this._applicationsRepo.updateApplication(newApplication)
      return newApplication
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async changeApplicationStatus(
    applicationId: string,
    tableOwnerId: string,
    status: ApplicationStatus,
  ): Promise<void> {
    try {
      const application = await this.getApplication(applicationId)
      const table = await new TablesService().getTable(application.table.id)
      if (table.owner.id !== tableOwnerId) {
        let message = ''
        switch (status) {
          case ApplicationStatus.ACCEPTED:
            message = ResponseMessages.COULD_NOT_ACCEPT_APPLICATION
            break
          case ApplicationStatus.DECLINED:
            message = ResponseMessages.COULD_NOT_DECLINE_APPLICATION
            break
          default:
            message = ResponseMessages.INVALID_APPLICATION_STATUS
            break
        }
        throw new ApiError(ResponseCodes.UNAUTHORIZED, message)
      }
      await this.updateApplication(application, { status })
      if (status === ApplicationStatus.ACCEPTED) {
        new NotificationsService().notifyApplicationAccepted(
          application.applicant.id,
          application.id,
        )
      }
      if (status === ApplicationStatus.DECLINED) {
        new NotificationsService().notifyApplicationDeclined(
          application.applicant.id,
          application.id,
        )
      }
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async deleteApplicationsFromUser(userId: string) {
    try {
      const applicationsToDelete = await this.getApplicationsFromUser(userId)
      await Promise.all(
        applicationsToDelete.map(application =>
          this.deleteApplication(application),
        ),
      )
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async deleteApplicationsFromTable(tableId: string) {
    try {
      const applicationsToDelete = await this.getApplicationsFromTable(tableId)
      await Promise.all(
        applicationsToDelete.map(application =>
          this.deleteApplication(application),
        ),
      )
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async deleteApplication(application: Application | string) {
    try {
      const applicationToDelete
        = typeof application === 'string'
          ? await this.getApplication(application)
          : application
      await this._applicationsRepo.deleteApplication(applicationToDelete.id)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async getApplicationAcceptMessage(application: Application): Promise<AcceptMessage> {
    try {
      if (application.status !== ApplicationStatus.ACCEPTED) {
        throw new ApiError(
          ResponseCodes.UNAUTHORIZED,
          ResponseMessages.APPLICATION_NOT_ACCEPTED,
        )
      }
      const acceptMessage = await this._acceptMessageRepo.getAcceptMessage(application.table.acceptMessageId)
      if (!acceptMessage) {
        throw new ApiError(
          ResponseCodes.NOT_FOUND,
          ResponseMessages.ACCEPT_MESSAGE_NOT_FOUND,
        )
      }
      return acceptMessage
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }
}
