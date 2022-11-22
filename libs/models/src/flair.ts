import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';

export class Flair {
  constructor(
    public id: string,
    public type: FlairTypes,
    public name: string,
    public labels: { [key: string]: string },
    public numberOfUses: number,
    public creationDate: Date,
    public lastUpdateDate: Date
  ) {}

  static fromFirestore(snapshot: DocumentSnapshot<DocumentData>) {
    return !snapshot || !snapshot.exists ? null : Flair.fromMap({ ...snapshot.data(), id: snapshot.id });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromMap(map: any) {
    return new Flair(map.id, map.type, map.name, map.labels, map.numberOfUses, map.creationDate, map.lastUpdateDate);
  }

  toMap() {
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

export type FlairUpdateBody = Partial<Pick<Flair, 'type' | 'name' | 'labels'>>;
