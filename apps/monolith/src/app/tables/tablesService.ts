import type {
  TableCreateBody,
  TableUpdateBody,
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

  async createTable(ownerId: string, bannerFile: Express.Multer.File, body: TableCreateBody) {
    const currentDate = new Date()

    let newTable = Table.fromMap({ ...body })
    newTable.banner = DEFAULT_TABLE_BANNER
    newTable.creationDate = currentDate
    newTable.lastUpdateDate = currentDate

    let newBannerUrl = ''
    let newAcceptMessage = AcceptMessage.fromMap({ message: body.acceptMessage })
    newAcceptMessage.creationDate = currentDate
    newAcceptMessage.lastUpdateDate = currentDate

    try {
      const existingTables = await this.getTablesFromUser(ownerId)
      if (existingTables.length >= LIMIT_OF_TABLES) {
        throw new ApiError(
          ResponseCodes.BAD_REQUEST,
          ResponseMessages.TABLES_LIMIT_REACHED,
        )
      }

      const owner = await new UsersService().getUser(ownerId)
      newTable.owner = { id: owner.id, avatar: owner.avatar, username: owner.username }

      newBannerUrl = await new UploadService().uploadTableFile(_id, bannerFile, TABLE_FILE_TYPES.BANNER)
      newAcceptMessage = await this._acceptMessageRepo.createAcceptMessage(newAcceptMessage)
      newTable.acceptMessageId = newAcceptMessage.id

      throw new ApiError(ResponseCodes.INTERNAL_ERROR,
        'testing error')

      newTable = await this._tablesRepo.createTable(newTable)

      if (newTable.flairs) {
        await Promise.all(
          newTable.flairs.map(flair =>
            new FlairsService().changeNumberOfUses(flair, 'increase'),
          ),
        )
      }

      await new AlgoliaService().createTable(newTable)

      return newTable
    }
    catch (error) {
      if (newBannerUrl.length)
        await new UploadService().deleteTableFile(newTable.id, TABLE_FILE_TYPES.BANNER)
      if (newAcceptMessage.id)
        await this._acceptMessageRepo.deleteAcceptMessage(newAcceptMessage.id)
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
    table: Table | string,
    request: TableUpdateBody,
  ): Promise<Table> {
    try {
      const currentDate = new Date()

      const oldTable
        = typeof table === 'string' ? await this.getTable(table) : table
      const newTable = Table.fromMap({ ...oldTable, ...request })
      newTable.lastUpdateDate = currentDate
      await this._tablesRepo.updateTable(newTable)

      const newAcceptMessage = await this._acceptMessageRepo.getAcceptMessage(newTable.acceptMessageId)
      newAcceptMessage.message = request.acceptMessage
      newAcceptMessage.lastUpdateDate = currentDate
      await this._acceptMessageRepo.updateAcceptMessage(newAcceptMessage)

      const flairsToDecrease = oldTable.flairs.length
        ? oldTable.flairs.filter(flair => !newTable.flairs.includes(flair))
        : []
      const flairsToIncrease = newTable.flairs.length
        ? newTable.flairs.filter(flair => !oldTable.flairs.includes(flair))
        : []
      await Promise.all([
        ...flairsToDecrease.map(flair =>
          new FlairsService().changeNumberOfUses(flair, 'decrease'),
        ),
        ...flairsToIncrease.map(flair =>
          new FlairsService().changeNumberOfUses(flair, 'increase'),
        ),
      ])

      new AlgoliaService().updateTable(newTable)
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
      await new UploadService().deleteTableFile(tableToDelete.id, TABLE_FILE_TYPES.ALL)
      await new AlgoliaService().deleteTable(tableToDelete.id)
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
