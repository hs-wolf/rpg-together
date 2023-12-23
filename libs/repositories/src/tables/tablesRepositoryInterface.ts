import type { Table } from '@rpg-together/models'
import type { ObjectId } from 'mongodb'

export interface ITablesRepository {
  createTable(table: Table, objectId: ObjectId): Promise<Table | null>

  getTablesFromUser(userId: string): Promise<Table[]>

  getTable(tableId: string): Promise<Table | null>

  updateTable(table: Table): Promise<void>

  deleteTable(tableId: string): Promise<void>
}
