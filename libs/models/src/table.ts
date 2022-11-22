import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';

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
    public flairs: string[],
    public acceptMessage: string,
    public creationDate: Date,
    public lastUpdateDate: Date
  ) {}

  static fromFirestore(snapshot: DocumentSnapshot<DocumentData>) {
    return !snapshot || !snapshot.exists ? null : Table.fromMap({ ...snapshot.data(), id: snapshot.id });
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

export type TableCreateBody = Partial<Pick<Table, 'title' | 'description' | 'banner' | 'flairs' | 'acceptMessage'>>;

export type TableUpdateBody = Partial<Pick<Table, 'title' | 'description' | 'banner' | 'flairs' | 'acceptMessage'>>;
