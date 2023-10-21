import type { Flair } from '@rpg-together/models'

export interface IFlairsRepository {
  createFlair(flair: Flair): Promise<Flair | null>

  getAllFlairs(): Promise<Flair[]>

  getFlair(flairId: string): Promise<Flair | null>

  updateFlair(flair: Flair): Promise<void>

  deleteFlair(flairId: string): Promise<void>
}
