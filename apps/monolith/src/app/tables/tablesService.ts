import { Inject, Singleton } from 'typescript-ioc';
import { UsersService } from '../users/usersService';
import { FlairsService } from '../flairs/flairsService';
import { ApiError, ResponseCodes, ResponseMessages, Table, TableCreateBody, TableUpdateBody } from '@rpg-together/models';
import { ITablesRepository, TablesRepositoryFirestore } from '@rpg-together/repos';
import { apiErrorHandler } from '@rpg-together/utils';

@Singleton
export class TablesService {
  @Inject
  private usersService: UsersService;
  @Inject
  private flairsService: FlairsService;

  private _tablesRepo: ITablesRepository;

  constructor(tablesRepo: ITablesRepository) {
    this._tablesRepo = tablesRepo ?? new TablesRepositoryFirestore();
  }

  async getTablesFromUser(userId: string): Promise<Table[]> {
    try {
      const tables = await this._tablesRepo.getTablesFromUser(userId);
      return tables;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async getTable(id: string): Promise<Table> {
    try {
      const table = await this._tablesRepo.getTable(id);
      if (!table) {
        throw new ApiError(ResponseCodes.NOT_FOUND, ResponseMessages.TABLE_NOT_FOUND);
      }
      return table;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async createTable(ownerId: string, body: TableCreateBody): Promise<Table> {
    try {
      const owner = await this.usersService.getUser(ownerId);
      const currentDate = new Date();
      let newTable = Table.fromMap({ ...body });
      newTable.ownerId = ownerId;
      newTable.ownerHeader = { avatar: owner.avatar, username: owner.username };
      newTable.creationDate = currentDate;
      newTable.lastUpdateDate = currentDate;
      newTable = await this._tablesRepo.createTable(newTable);
      await Promise.all(newTable.flairs.map((flair) => this.flairsService.changeNumberOfUses(flair, 'increase')));
      return newTable;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async updateTable(table: Table | string, request: TableUpdateBody): Promise<Table> {
    try {
      const oldTable = typeof table === 'string' ? await this.getTable(table) : table;
      const owner = await this.usersService.getUser(oldTable.ownerId);
      const newTable = Table.fromMap({
        ...oldTable,
        ...request,
      });
      newTable.ownerHeader = { username: owner.username, avatar: owner.avatar };
      newTable.lastUpdateDate = new Date();
      await this._tablesRepo.updateTable(newTable);
      const flairsToDecrease = oldTable.flairs.filter((flair) => !newTable.flairs.includes(flair));
      const flairsToIncrease = newTable.flairs.filter((flair) => !oldTable.flairs.includes(flair));
      await Promise.all([
        ...flairsToDecrease.map((flair) => this.flairsService.changeNumberOfUses(flair, 'decrease')),
        ...flairsToIncrease.map((flair) => this.flairsService.changeNumberOfUses(flair, 'increase')),
      ]);
      return newTable;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async deleteTable(table: Table | string) {
    try {
      const tableToDelete = typeof table === 'string' ? await this.getTable(table) : table;
      await this._tablesRepo.deleteTable(tableToDelete.id);
      await Promise.all(tableToDelete.flairs.map((flair) => this.flairsService.changeNumberOfUses(flair, 'decrease')));
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async deleteTablesFromUser(userId: string) {
    try {
      const tablesToDelete = await this.getTablesFromUser(userId);
      await Promise.all(tablesToDelete.map((table) => this.deleteTable(table)));
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}
