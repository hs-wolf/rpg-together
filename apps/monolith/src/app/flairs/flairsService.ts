import { Singleton } from 'typescript-ioc';
import { ApiError, ResponseCodes, Flair, FlairCreationBody, FlairUpdateBody } from '@rpg-together/models';
import { IFlairsRepository, FlairsRepositoryFirestore } from '@rpg-together/repos';
import { apiErrorHandler } from '@rpg-together/utils';

@Singleton
export class FlairsService {
  private _flairsRepo: IFlairsRepository;

  constructor(flairsRepo: IFlairsRepository) {
    this._flairsRepo = flairsRepo ?? new FlairsRepositoryFirestore();
  }

  async getFlair(id: string): Promise<Flair> {
    try {
      const flair = await this._flairsRepo.getFlair(id);
      if (!flair) {
        throw new ApiError(ResponseCodes.NOT_FOUND, `Flair with id ${id} not found.`);
      }
      return flair;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async createFlair(body: FlairCreationBody): Promise<Flair> {
    try {
      let newFlair = Flair.fromMap({ ...body });
      newFlair = await this._flairsRepo.createFlair(newFlair);
      return newFlair;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async updateFlair(id: string, body: FlairUpdateBody): Promise<Flair> {
    try {
      const oldFlair = await this.getFlair(id);
      const newFlair = Flair.fromMap({ ...oldFlair, ...body });
      await this._flairsRepo.updateFlair(newFlair);
      return newFlair;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async deleteFlair(id: string) {
    try {
      await this._flairsRepo.deleteFlair(id);
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}
