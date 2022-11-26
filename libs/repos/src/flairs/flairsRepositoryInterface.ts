import { Flair } from '@rpg-together/models';

export interface IFlairsRepository {
  getAllFlairs(): Promise<Flair[]>;

  getFlair(id: string): Promise<Flair | null>;

  createFlair(flair: Flair): Promise<Flair | null>;

  updateFlair(flair: Flair): Promise<void>;

  deleteFlair(id: string): Promise<void>;
}
