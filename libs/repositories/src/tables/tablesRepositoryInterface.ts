import type { Table, TableUpdateBody } from '@rpg-together/models'
import type { ObjectId } from 'mongodb'

export interface ITablesRepository {
  createTable(table: Table, objectId: ObjectId): Promise<Table | null>

  getTablesFromUser(userId: string): Promise<Table[]>

  getTable(tableId: string): Promise<Table | null>

  updateTable(tableId: string, body: TableUpdateBody): Promise<void>

  deleteTable(tableId: string): Promise<void>
}
