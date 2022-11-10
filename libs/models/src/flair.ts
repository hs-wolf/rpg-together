export enum FlairTypes {
  SYSTEM = 'SYSTEM',
  LANGUAGES = 'LANGUAGES',
  RATINGS = 'RATINGS',
  VACANCIES = 'VACANCIES',
  GENRES = 'GENRES',
  CUSTOM = 'CUSTOM',
}

export class Flair {
  constructor(
    public id: string,
    public type: FlairTypes,
    public name: string,
    public labels: { [key: string]: string },
    public users: number,
    public creationDate: string,
    public lastUpdateDate: string
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromFirestore(snapshot: any) {
    if (!snapshot || !snapshot.exists) {
      return null;
    }
    return Flair.fromMap({ ...snapshot.data(), id: snapshot.id });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromMap(map: any) {
    return new Flair(map.id, map.type, map.name, map.labels, map.users, map.creationDate, map.lastUpdateDate);
  }

  toMap() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      labels: this.labels,
      users: this.users,
      creationDate: this.creationDate,
      lastUpdateDate: this.lastUpdateDate,
    };
  }
}

export type FlairCreationBody = Partial<Pick<Flair, 'type' | 'name' | 'labels' | 'users'>>;

export type FlairUpdateBody = Partial<Pick<Flair, 'type' | 'name' | 'labels' | 'users'>>;
