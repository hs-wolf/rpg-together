import type { Table } from '@rpg-together/models'

export enum AppDirections {
  RTL = 'rtl',
  LTR = 'ltr',
}

export enum SnackType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}
export interface ISnack {
  type: SnackType
  message: string
}

export interface AdvancedSelectOption {
  id?: string
  name: string
  label: string
}

export interface SearchCache {
  tables: Table[]
  query: string
  flairs: string[]
  currentSearchPage: number
  noMoreTables: boolean
}
