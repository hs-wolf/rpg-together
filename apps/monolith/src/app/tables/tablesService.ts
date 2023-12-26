import type {
  TableCreateBody,
  TableUpdateBody,
  TableUpdateBodyRequest,
} from '@rpg-together/models'
import {
  AcceptMessage,
  ApiError,
  ResponseCodes,
  ResponseMessages,
  Table,
} from '@rpg-together/models'
import type { IAcceptMessageRepository, ITablesRepository } from '@rpg-together/repositories'
import {
  AcceptMessageRepositoryMongoDB, TablesRepositoryMongoDB,
} from '@rpg-together/repositories'
import {
  DEFAULT_TABLE_BANNER,
  LIMIT_OF_TABLES,
  TABLE_FILE_TYPES,
  apiErrorHandler,
} from '@rpg-together/utilities'
import type { SaveObjectResponse } from '@algolia/client-search'
import { ObjectId } from 'mongodb'
import { mongoDB } from '../../mongodb'
import { UsersService } from '../users/usersService'
import { FlairsService } from '../flairs/flairsService'
import { UploadService } from '../upload/uploadService'
import { AlgoliaService } from '../algolia/algoliaService'

export class TablesService {
  constructor(tablesRepo?: ITablesRepository, acceptMessageRepo?: IAcceptMessageRepository) {
    this._tablesRepo = tablesRepo ?? new TablesRepositoryMongoDB(mongoDB)
    this._acceptMessageRepo = acceptMessageRepo ?? new AcceptMessageRepositoryMongoDB(mongoDB)
  }

  private _tablesRepo: ITablesRepository
  private _acceptMessageRepo: IAcceptMessageRepository

  private _usersService = new UsersService()
  private _uploadService = new UploadService()
  private _algoliaService = new AlgoliaService()

  async createTable(ownerId: string, body: TableCreateBody, bannerFile?: Express.Multer.File) {
    const newId = new ObjectId()
    const currentDate = new Date()
    let newBannerUrl = ''
    let newAcceptMessage = AcceptMessage.fromMap({ message: body.acceptMessage })
    newAcceptMessage.creationDate = currentDate
    newAcceptMessage.lastUpdateDate = currentDate
    const newTableBody = Table.fromMap({ ...body })
    newTableBody.id = newId.toString()
    newTableBody.banner = DEFAULT_TABLE_BANNER
    newTableBody.creationDate = currentDate
    newTableBody.lastUpdateDate = currentDate
    let createdTable: Table
    let algoliaResponse: SaveObjectResponse
    try {
      const existingTables = await this.getTablesFromUser(ownerId)
      if (existingTables.length >= LIMIT_OF_TABLES) {
        throw new ApiError(
          ResponseCodes.BAD_REQUEST,
          ResponseMessages.TABLES_LIMIT_REACHED,
        )
      }
      if (bannerFile) {
        newBannerUrl = await this._uploadService.uploadTableFile(newId.toString(), bannerFile, TABLE_FILE_TYPES.BANNER)
        newTableBody.banner = newBannerUrl
      }
      newAcceptMessage = await this._acceptMessageRepo.createAcceptMessage(newAcceptMessage)
      newTableBody.acceptMessageId = newAcceptMessage.id
      const owner = await this._usersService.getUser(ownerId)
      newTableBody.owner = { id: owner.id, avatar: owner.avatar, username: owner.username }
      createdTable = await this._tablesRepo.createTable(newTableBody, newId)
      algoliaResponse = await this._algoliaService.createTable(newTableBody)
      return createdTable
    }
    catch (error) {
      if (newBannerUrl)
        await this._uploadService.deleteTableFile(newId.toString(), TABLE_FILE_TYPES.BANNER)
      if (newAcceptMessage.id)
        await this._acceptMessageRepo.deleteAcceptMessage(newAcceptMessage.id)
      if (createdTable.id)
        await this._tablesRepo.deleteTable(createdTable.id)
      if (algoliaResponse.objectID)
        await this._algoliaService.deleteTable(algoliaResponse.objectID)
      apiErrorHandler(error)
    }
  }

  async getTablesFromUser(userId: string): Promise<Table[]> {
    try {
      const tables = await this._tablesRepo.getTablesFromUser(userId)
      return tables
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async getTable(id: string): Promise<Table> {
    try {
      const table = await this._tablesRepo.getTable(id)
      if (!table) {
        throw new ApiError(
          ResponseCodes.NOT_FOUND,
          ResponseMessages.TABLE_NOT_FOUND,
        )
      }
      return table
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async updateTable(
    tableId: string,
    body: TableUpdateBodyRequest,
    bannerFile?: Express.Multer.File,
  ): Promise<Table> {
    const currentDate = new Date()
    const { acceptMessage, ...newTableBody }: TableUpdateBodyRequest & TableUpdateBody = body
    let newBannerUrl = ''

    try {
      newTableBody.lastUpdateDate = currentDate

      if (bannerFile) {
        newBannerUrl = await this._uploadService.uploadTableFile(tableId, bannerFile, TABLE_FILE_TYPES.BANNER)
        newTableBody.banner = newBannerUrl
      }

      if (acceptMessage) {
        const newAcceptMessage = await this.getTableAcceptMessageByTable(tableId)
        await this._acceptMessageRepo.updateAcceptMessage(newAcceptMessage.id, { message: body.acceptMessage, lastUpdateDate: currentDate })
      }
      const newTable = Table.fromMap({ ...newTableBody })
      await this._tablesRepo.updateTable(tableId, newTableBody)
      await this._algoliaService.updateTable(newTable)
      return newTable
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async deleteTablesFromUser(userId: string) {
    try {
      const tablesToDelete = await this.getTablesFromUser(userId)
      await Promise.all(tablesToDelete.map(table => this.deleteTable(table)))
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async deleteTable(table: Table | string) {
    try {
      const tableToDelete
        = typeof table === 'string' ? await this.getTable(table) : table
      await this._tablesRepo.deleteTable(tableToDelete.id)
      if (tableToDelete.flairs.length) {
        await Promise.all(
          tableToDelete.flairs.map(flair =>
            new FlairsService().changeNumberOfUses(flair, 'decrease'),
          ),
        )
      }
      await this._uploadService.deleteTableFile(tableToDelete.id, TABLE_FILE_TYPES.ALL)
      await this._algoliaService.deleteTable(tableToDelete.id)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async getTableAcceptMessageByTable(tableId: string): Promise<AcceptMessage> {
    try {
      const acceptMessage = await this._acceptMessageRepo.getAcceptMessage(tableId)
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

  async getTableAcceptMessage(table: Table): Promise<AcceptMessage> {
    try {
      const acceptMessage = await this._acceptMessageRepo.getAcceptMessage(table.acceptMessageId)
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
