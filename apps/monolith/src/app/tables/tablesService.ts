import { Singleton } from 'typescript-ioc';
import { ApiError, ResponseCodes, Table, TableCreationBody, TableUpdateBody } from '@rpg-together/models';
import { ITablesRepository, TablesRepositoryFirestore } from '@rpg-together/repos';
import { apiErrorHandler } from '@rpg-together/utils';

@Singleton
export class TablesService {
  private _tablesRepo: ITablesRepository;

  constructor(tablesRepo: ITablesRepository) {
    this._tablesRepo = tablesRepo ?? new TablesRepositoryFirestore();
  }

  async getTable(id: string): Promise<Table> {
    try {
      const table = await this._tablesRepo.getTable(id);
      if (!table) {
        throw new ApiError(ResponseCodes.NOT_FOUND, `Table with id ${id} not found.`);
      }
      return table;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async createTable(body: TableCreationBody): Promise<Table> {
    try {
      let newTable = Table.fromMap({ ...body });
      newTable = await this._tablesRepo.createTable(newTable);
      return newTable;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async updateTable(id: string, body: TableUpdateBody): Promise<Table> {
    try {
      const oldTable = await this.getTable(id);
      const newTable = Table.fromMap({ ...oldTable, ...body });
      await this._tablesRepo.updateTable(newTable);
      return newTable;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async deleteTable(id: string) {
    try {
      await this._tablesRepo.deleteTable(id);
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}
