import process from 'node:process'
import type { Table } from '@rpg-together/models'
import {
  ALGOLIA_TABLES_INDEX,
  apiErrorHandler,
} from '@rpg-together/utilities'
import algolia from 'algoliasearch'
import type { SaveObjectResponse } from '@algolia/client-search'

const apiKey = process.env.ALGOLIA_API_ADMIN_KEY ?? ''
const appId = process.env.ALGOLIA_APPLICATION_ID ?? ''

export class AlgoliaService {
  private client = algolia(appId as string, apiKey as string)
  private tablesIndex = this.client.initIndex(ALGOLIA_TABLES_INDEX)

  async createTable(table: Table): Promise<SaveObjectResponse> {
    try {
      const response = await this.tablesIndex.saveObject(table.toAlgoliaMap())
      return response
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async updateTable(table: Table): Promise<void> {
    try {
      await this.tablesIndex.partialUpdateObject(table.toAlgoliaMap())
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async deleteTable(tableId: string): Promise<void> {
    try {
      await this.tablesIndex.deleteObject(tableId)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }
}
