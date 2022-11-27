import { Singleton } from 'typescript-ioc';
import { ApiError, ResponseCodes, ResponseMessages, Flair, FlairCreationBody, FlairUpdateBody } from '@rpg-together/models';
import { IFlairsRepository, FlairsRepositoryFirestore } from '@rpg-together/repos';
import { apiErrorHandler } from '@rpg-together/utils';

@Singleton
export class FlairsService {
  private _flairsRepo: IFlairsRepository;

  constructor(flairsRepo: IFlairsRepository) {
    this._flairsRepo = flairsRepo ?? new FlairsRepositoryFirestore();
  }

  async changeNumberOfUses(flairId: string, action: 'increase' | 'decrease'): Promise<void> {
    try {
      const flair = await this.getFlair(flairId);
      flair.numberOfUses = action === 'increase' ? flair.numberOfUses + 1 : flair.numberOfUses - 1;
      if (flair.numberOfUses < 0) {
        flair.numberOfUses = 0;
      }
      this.updateFlair(flair);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async getAllFlairs(): Promise<Flair[]> {
    try {
      const flairs = await this._flairsRepo.getAllFlairs();
      return flairs;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async getFlair(flairId: string): Promise<Flair> {
    try {
      const flair = await this._flairsRepo.getFlair(flairId);
      if (!flair) {
        throw new ApiError(ResponseCodes.NOT_FOUND, ResponseMessages.FLAIR_NOT_FOUND);
      }
      return flair;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async createFlair(body: FlairCreationBody): Promise<Flair> {
    try {
      const currentDate = new Date();
      let newFlair = Flair.fromMap({ ...body });
      newFlair.numberOfUses = 0;
      newFlair.creationDate = currentDate;
      newFlair.lastUpdateDate = currentDate;
      newFlair = await this._flairsRepo.createFlair(newFlair);
      return newFlair;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async updateFlair(flair: Flair | string, body?: FlairUpdateBody): Promise<Flair> {
    try {
      const oldFlair = typeof flair === 'string' ? await this.getFlair(flair) : flair;
      const newFlair = Flair.fromMap({ ...oldFlair, ...body });
      newFlair.lastUpdateDate = new Date();
      await this._flairsRepo.updateFlair(newFlair);
      return newFlair;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async deleteFlair(flairId: string) {
    try {
      await this._flairsRepo.deleteFlair(flairId);
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}