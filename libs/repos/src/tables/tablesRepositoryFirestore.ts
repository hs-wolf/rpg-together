import { getFirestore } from 'firebase-admin/firestore';
import { ITablesRepository } from './tablesRepositoryInterface';
import { Table } from '@rpg-together/models';
import { FIREBASE_COLLECTION_TABLES } from '@rpg-together/utils';

export class TablesRepositoryFirestore implements ITablesRepository {
  private firestore = getFirestore();
  private collRef = this.firestore.collection(FIREBASE_COLLECTION_TABLES);

  async getTablesFromUser(userId: string) {
    const query = this.collRef.where('ownerId', '==', userId);
    const querySnapshot = await query.get();
    if (querySnapshot.docs.length) {
      return querySnapshot.docs.map((snapshot) => Table.fromFirestore(snapshot)).filter((table) => table) as Table[];
    }
    return [];
  }

  async getTable(tableId: string) {
    const snapshot = await this.collRef.doc(tableId).get();
    return Table.fromFirestore(snapshot);
  }

  async createTable(table: Table) {
    if (table.id) {
      await this.collRef.doc(table.id).set(table.toMap());
      return table;
    }
    const newTable = await (await this.collRef.add(table.toMap())).get();
    return Table.fromFirestore(newTable);
  }

  async updateTable(table: Table) {
    await this.collRef.doc(table.id).update(table.toMap());
  }

  async deleteTable(tableId: string) {
    await this.collRef.doc(tableId).delete();
  }
}
