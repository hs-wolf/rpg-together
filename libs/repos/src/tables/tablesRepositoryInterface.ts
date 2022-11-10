import { Table } from '@rpg-together/models';

export interface ITablesRepository {
  getTablesFromUser(userId: string): Promise<Table[]>;

  getTable(tableId: string): Promise<Table | null>;

  createTable(table: Table): Promise<Table | null>;

  updateTable(table: Table): Promise<void>;

  deleteTable(tableId: string): Promise<void>;
}
