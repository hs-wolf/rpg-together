import { Table } from '@rpg-together/models';

export interface ITablesRepository {
  getTable(id: string): Promise<Table | null>;

  createTable(table: Table): Promise<Table | null>;

  updateTable(table: Table): Promise<void>;

  deleteTable(id: string): Promise<void>;
}
