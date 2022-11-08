import { getFirestore } from 'firebase-admin/firestore';
import { ITablesRepository } from './tablesRepositoryInterface';
import { Table } from '@rpg-together/models';
import { FIREBASE_COLLECTION_TABLES } from '@rpg-together/utils';

export class TablesRepositoryFirestore implements ITablesRepository {
  private firestore = getFirestore();
  private collRef = this.firestore.collection(FIREBASE_COLLECTION_TABLES);

  async getTable(id: string) {
    const snapshot = await this.collRef.doc(id).get();
    return Table.fromFirestore(snapshot);
  }

  async createTable(table: Table) {
    const newTable = await (await this.collRef.add(table.toMap())).get();
    return Table.fromFirestore(newTable);
  }

  async updateTable(table: Table) {
    await this.collRef.doc(table.id).update(table.toMap());
  }

  async deleteTable(id: string) {
    await this.collRef.doc(id).delete();
  }
}
