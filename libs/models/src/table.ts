import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';
import { Document } from 'mongodb';
import { UserHeader } from '.';

export class Table {
  constructor(
    public id: string,
    public owner: UserHeader,
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

  static fromMongoDB(doc: Document | null): Table | null {
    if (!doc) {
      return null;
    }
    return Table.fromMap({ ...doc });
  }

  static fromMap(map: Record<string, unknown>) {
    return new Table(
      map['id'] as string,
      map['owner'] as UserHeader,
      map['title'] as string,
      map['description'] as string,
      map['banner'] as string,
      map['flairs'] as string[],
      map['acceptMessage'] as string,
      map['creationDate'] as Date,
      map['lastUpdateDate'] as Date
    );
  }

  toMap(): Omit<Table, 'toMap'> {
    return {
      id: this.id,
      owner: this.owner,
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
