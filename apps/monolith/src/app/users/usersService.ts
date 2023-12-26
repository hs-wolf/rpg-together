import { ObjectId } from 'mongodb'
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
import type { ICRUDRepository } from '@rpg-together/repositories'
import {
  CRUDRepositoryMongoDB,
} from '@rpg-together/repositories'
import { MONGODB_COLLECTION_USERS, apiErrorHandler } from '@rpg-together/utilities'
import { mongoDB } from '../../mongodb'
import { TablesService } from '../tables/tablesService'
import { UploadService } from '../upload/uploadService'

export class UsersService {
  private _tablesService = new TablesService()
  private _uploadService = new UploadService()
  private _usersCRUDRepo: ICRUDRepository<User>

  constructor(usersRepo?: ICRUDRepository<User>) {
    this._usersCRUDRepo = usersRepo ?? new CRUDRepositoryMongoDB<User>(mongoDB, MONGODB_COLLECTION_USERS)
  }

  async createUser(body: UserCreateBody): Promise<User> {
    try {
      const currentDate = new Date()
      const newUser = User.fromMap(body)
      newUser.id = new ObjectId().toString()
      newUser.creationDate = currentDate
      newUser.lastUpdateDate = currentDate
      await this._usersCRUDRepo.create(newUser.toMap())
      return newUser
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      const user = await this._usersCRUDRepo.get({ id })
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

  async updateUser(id: string, body: UserUpdateBody): Promise<User> {
    try {
      if (body.username)
        await this.checkUserExists(body.username, body.email)

      const oldUser = await this.getUser(id)
      const newUser = User.fromMap({ ...oldUser, ...body })
      newUser.lastUpdateDate = new Date()
      await this._usersCRUDRepo.update({ id }, newUser)

      const tablesService = new TablesService()
      const userTables = await (tablesService.getTablesFromUser(id))
      const owner = {
        id,
        avatar: newUser.avatar,
        username: newUser.username,
      }
      userTables.forEach((table) => {
        // tablesService.updateTable(table.id, { owner })
      })

      return newUser
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async deleteUser(id: string) {
    try {
      await this._tablesService.deleteTablesFromUser(id)
      await this._uploadService.deleteAllUserFiles(id)
      await this._usersCRUDRepo.delete({ id })
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async checkUserExists(username: string, email: string) {
    try {
      const userByName = await this._usersCRUDRepo.get({ username })
      if (userByName) {
        throw new ApiError(
          ResponseCodes.BAD_REQUEST,
          ResponseMessages.USERNAME_TAKEN,
        )
      }
      const userByEmail = await this._usersCRUDRepo.get({ email })
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
