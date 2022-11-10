import { Flair } from './flair';

export class Table {
  constructor(
    public id: string,
    public ownerId: string,
    public ownerHeader: {
      username: string;
      avatar: string;
    },
    public title: string,
    public description: string,
    public banner: string,
    public flairs: Flair[],
    public acceptMessage: string,
    public creationDate: Date,
    public lastUpdateDate: Date
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromFirestore(snapshot: any) {
    if (!snapshot || !snapshot.exists) {
      return null;
    }
    return Table.fromMap({ ...snapshot.data(), id: snapshot.id });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromMap(map: any) {
    return new Table(
      map.id,
      map.ownerId,
      map.ownerHeader,
      map.title,
      map.description,
      map.banner,
      map.flairs,
      map.acceptMessage,
      map.creationDate,
      map.lastUpdateDate
    );
  }

  toMap() {
    return {
      id: this.id,
      ownerId: this.ownerId,
      ownerHeader: this.ownerHeader,
      title: this.title,
      description: this.description,
      banner: this.banner,
      flairs: this.flairs,
      acceptMessage: this.acceptMessage,
      creationDate: this.creationDate,
      lastUpdateDate: this.lastUpdateDate,
    };
  }
}

export type TableCreateRequest = Partial<
  Pick<Table, 'ownerId' | 'title' | 'description' | 'banner' | 'flairs' | 'acceptMessage'>
>;

export type TableUpdateRequest = Partial<Pick<Table, 'title' | 'description' | 'banner' | 'flairs' | 'acceptMessage'>>;
