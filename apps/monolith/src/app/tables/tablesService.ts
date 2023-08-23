import { Inject, Singleton } from 'typescript-ioc'
import type {
  TableCreateBody,
  TableUpdateBody,
} from '@rpg-together/models'
import {
  ApiError,
  ResponseCodes,
  ResponseMessages,
  Table,
} from '@rpg-together/models'
import type { ITablesRepository } from '@rpg-together/repositories'
import {
  TablesRepositoryMongoDB,
} from '@rpg-together/repositories'
import {
  DEFAULT_TABLE_BANNER,
  LIMIT_OF_TABLES,
  apiErrorHandler,
} from '@rpg-together/utilities'
import { mongoDB } from '../../mongodb'
import type { FlairsService } from '../flairs/flairsService'
import type { UploadService } from '../upload/uploadService'

@Singleton
export class TablesService {
  constructor(tablesRepo: ITablesRepository) {
    this._tablesRepo = tablesRepo ?? new TablesRepositoryMongoDB(mongoDB)
  }

  private _tablesRepo: ITablesRepository

  @Inject
  private flairsService: FlairsService

  @Inject
  private uploadService: UploadService

  async createTable(ownerId: string, body: TableCreateBody): Promise<Table> {
    try {
      const existingTables = await this.getTablesFromUser(ownerId)
      if (existingTables.length >= LIMIT_OF_TABLES) {
        throw new ApiError(
          ResponseCodes.BAD_REQUEST,
          ResponseMessages.TABLES_LIMIT_REACHED,
        )
      }
      const currentDate = new Date()
      let newTable = Table.fromMap({ ...body })
      newTable.owner = { id: ownerId }
      newTable.banner = newTable.banner
        ? newTable.banner
        : DEFAULT_TABLE_BANNER
      newTable.creationDate = currentDate
      newTable.lastUpdateDate = currentDate
      newTable = await this._tablesRepo.createTable(newTable)
      if (newTable.flairs) {
        await Promise.all(
          newTable.flairs.map(flair =>
            this.flairsService.changeNumberOfUses(flair, 'increase'),
          ),
        )
      }
      return newTable
    }
    catch (error) {
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
      const oldTable
        = typeof table === 'string' ? await this.getTable(table) : table
      const newTable = Table.fromMap({ ...oldTable, ...request })
      newTable.lastUpdateDate = new Date()
      await this._tablesRepo.updateTable(newTable)
      const flairsToDecrease = oldTable.flairs.length
        ? oldTable.flairs.filter(flair => !newTable.flairs.includes(flair))
        : []
      const flairsToIncrease = newTable.flairs.length
        ? newTable.flairs.filter(flair => !oldTable.flairs.includes(flair))
        : []
      await Promise.all([
        ...flairsToDecrease.map(flair =>
          this.flairsService.changeNumberOfUses(flair, 'decrease'),
        ),
        ...flairsToIncrease.map(flair =>
          this.flairsService.changeNumberOfUses(flair, 'increase'),
        ),
      ])
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
            this.flairsService.changeNumberOfUses(flair, 'decrease'),
          ),
        )
      }
      await this.uploadService.deleteAllTableFiles(tableToDelete.id)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }
}
