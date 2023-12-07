import type {
  UserCreateBody,
  UserUpdateBody,
} from '@rpg-together/models'
import {
  ApiError,
  ResponseCodes,
  ResponseMessages,
  User,
} from '@rpg-together/models'
import type { IUsersRepository } from '@rpg-together/repositories'
import {
  UsersRepositoryMongoDB,
} from '@rpg-together/repositories'
import { apiErrorHandler } from '@rpg-together/utilities'
import { mongoDB } from '../../mongodb'
import { TablesService } from '../tables/tablesService'
import { UploadService } from '../upload/uploadService'

export class UsersService {
  constructor(usersRepo?: IUsersRepository) {
    this._usersRepo = usersRepo ?? new UsersRepositoryMongoDB(mongoDB)
  }

  private _usersRepo: IUsersRepository

  async createUser(body: UserCreateBody): Promise<User> {
    try {
      const currentDate = new Date()
      let newUser = User.fromMap({ ...body })
      newUser.creationDate = currentDate
      newUser.lastUpdateDate = currentDate
      newUser = await this._usersRepo.createUser(newUser)
      return newUser
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      const user = await this._usersRepo.getUser(id)
      if (!user) {
        throw new ApiError(
          ResponseCodes.NOT_FOUND,
          ResponseMessages.USER_NOT_FOUND,
        )
      }
      return user
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async updateUser(userId: string, body: UserUpdateBody): Promise<User> {
    try {
      if (body.username)
        await this.checkUserExists(body.username, body.email)

      const oldUser = await this.getUser(userId)
      const newUser = User.fromMap({ ...oldUser, ...body })
      newUser.lastUpdateDate = new Date()
      await this._usersRepo.updateUser(newUser)
      return newUser
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async deleteUser(userId: string) {
    try {
      await new TablesService().deleteTablesFromUser(userId)
      await new UploadService().deleteAllUserFiles(userId)
      await this._usersRepo.deleteUser(userId)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async checkUserExists(username: string, email: string) {
    try {
      const userByName = await this._usersRepo.getUserByUsername(username)
      if (userByName) {
        throw new ApiError(
          ResponseCodes.BAD_REQUEST,
          ResponseMessages.USERNAME_TAKEN,
        )
      }
      const userByEmail = await this._usersRepo.getUserByEmail(email)
      if (userByEmail) {
        throw new ApiError(
          ResponseCodes.BAD_REQUEST,
          ResponseMessages.EMAIL_TAKEN,
        )
      }
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }
}
