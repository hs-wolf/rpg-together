export type CRUDFilter<T> = { [K in keyof T]?: any; }

export interface ICRUDRepository<T> {
  create(document: Partial<T>): Promise<void>

  createMany(documents: Partial<T>[]): Promise<void>

  get(filter: CRUDFilter<T>): Promise<T | null>

  getMany(filter?: CRUDFilter<T>): Promise<T[] | null>

  update(filter: CRUDFilter<T>, document: Partial<T>): Promise<void>

  updateMany(filter: CRUDFilter<T>, document: Partial<T>): Promise<void>

  delete(filter: CRUDFilter<T>): Promise<void>

  deleteMany(filter: CRUDFilter<T>): Promise<void>
}
