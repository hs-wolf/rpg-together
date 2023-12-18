import type { Document } from 'mongodb'
import type { UserHeader } from '.'

export class Table {
  constructor(
    public id: string,
    public owner: UserHeader,
    public title: string,
    public description: string,
    public banner: string,
    public flairs: string[],
    public acceptMessageId: string,
    public creationDate: Date,
    public lastUpdateDate: Date,
  ) {}

  static fromMongoDB(doc: Document | null): Table | null {
    if (!doc)
      return null

    return Table.fromMap({ ...doc })
  }

  static fromMap(map: Table | Record<string, unknown>) {
    return new Table(
      map.id as string,
      map.owner as UserHeader,
      map.title as string,
      map.description as string,
      map.banner as string,
      map.flairs as string[],
      map.acceptMessageId as string,
      new Date(map.creationDate as Date),
      new Date(map.lastUpdateDate as Date),
    )
  }

  toMap(): Omit<Table, 'toMap' | 'toAlgoliaMap'> {
    return {
      id: this.id,
      owner: this.owner,
      title: this.title,
      description: this.description,
      banner: this.banner,
      flairs: this.flairs,
      acceptMessageId: this.acceptMessageId,
      creationDate: this.creationDate,
      lastUpdateDate: this.lastUpdateDate,
    }
  }

  toAlgoliaMap(): Omit<Table, 'toMap' | 'toAlgoliaMap'> & { objectID: string } {
    return {
      objectID: this.id,
      id: this.id,
      owner: this.owner,
      title: this.title,
      description: this.description,
      banner: this.banner,
      flairs: this.flairs,
      acceptMessageId: this.acceptMessageId,
      creationDate: this.creationDate,
      lastUpdateDate: this.lastUpdateDate,
    }
  }
}

export type TableHeader = Partial<
  Pick<Table, 'id' | 'owner' | 'title' | 'banner' | 'acceptMessageId'>
>

export type TableCreateBody = Partial<
  Pick<Table, 'title' | 'description' | 'banner' | 'flairs' | 'acceptMessageId'>
  & { acceptMessage: string }>

export type TableCreateBodyRequest = Pick<
  TableCreateBody,
  'title' | 'description' | 'banner' | 'flairs'>
& { acceptMessage: string }

export type TableUpdateBody = Partial<
  Pick<
    Table,
    | 'owner'
    | 'title'
    | 'description'
    | 'banner'
    | 'flairs'
    | 'lastUpdateDate'
  > & { acceptMessage: string }
>

export type TableUpdateBodyRequest = Partial<Pick<
  TableUpdateBody,
  'title' | 'description' | 'banner' | 'flairs'
> & { acceptMessage: string }>
