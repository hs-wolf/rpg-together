import { Document } from 'mongodb';
import { SupportedLanguages } from '.';

export class Flair {
  constructor(
    public id: string,
    public type: FlairTypes,
    public name: string,
    public labels: Record<SupportedLanguages, string>,
    public numberOfUses: number,
    public creationDate: Date,
    public lastUpdateDate: Date
  ) {}

  static fromMongoDB(doc: Document | null): Flair | null {
    if (!doc) {
      return null;
    }
    return Flair.fromMap({ ...doc });
  }

  static fromMap(map: Record<string, unknown>) {
    return new Flair(
      map['id'] as string,
      map['type'] as FlairTypes,
      map['name'] as string,
      map['labels'] as Record<SupportedLanguages, string>,
      map['numberOfUses'] as number,
      map['creationDate'] as Date,
      map['lastUpdateDate'] as Date
    );
  }

  toMap(): Omit<Flair, 'toMap'> {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      labels: this.labels,
      numberOfUses: this.numberOfUses,
      creationDate: this.creationDate,
      lastUpdateDate: this.lastUpdateDate,
    };
  }
}

export enum FlairTypes {
  SYSTEM = 'SYSTEM',
  LANGUAGES = 'LANGUAGES',
  RATINGS = 'RATINGS',
  VACANCIES = 'VACANCIES',
  GENRES = 'GENRES',
  CUSTOM = 'CUSTOM',
}

export type FlairCreationBody = Partial<Pick<Flair, 'type' | 'name' | 'labels'>>;
export type FlairCreationBodyRequest = Pick<FlairCreationBody, 'type' | 'name' | 'labels'>;

export type FlairUpdateBody = Partial<Pick<Flair, 'type' | 'name' | 'labels' | 'numberOfUses' | 'lastUpdateDate'>>;
export type FlairUpdateBodyRequest = Pick<FlairUpdateBody, 'type' | 'name' | 'labels'>;
