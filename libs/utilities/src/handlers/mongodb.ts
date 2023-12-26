import type { Collection, Document, ObjectId } from 'mongodb'

/**
 * This is a handler for MongoDB CRUD operations.
 * It behaves like an abstraction function but with the option to include custom change before making operations.
 * @param {Collection} collection MongoDB Collection instance.
 * @returns
 */
export function mongodbCRUDHandler<T extends Document>(collection: Collection<T>) {
  /**
   * `forceId` It changes the provided document _id and id properties.
   */
  type CustomCreateOptions = Partial<{
    forceId: ObjectId
  }>
  /**
   * `filtered` Makes the result come with no MongoDB's additional properties.
   */
  type CustomReadOptions = Partial<{
    filtered: boolean
  }>
  /**
   * `filtered` Makes the result come with no MongoDB's additional properties.
   */
  type CustomUpdateOptions = Partial<{
    placeholder: boolean
  }>
  return {
    /**
     * Create a document in a MongoDB collection.
     * @param {Document} document The object to be created.
     * @param {CustomCreateOptions} [options] Optional options to change how the document should be treated before creation.
     * @param {InsertOneOptions} [mongodbOptions] Optional MongoDB's InsertOneOptions.
     * @returns {Promise<InsertOneResult<Document>>} MongoDB's InsertOneResult.
     */
    // async create(document: OptionalUnlessRequiredId<T>, options?: CustomCreateOptions, mongodbOptions?: InsertOneOptions): Promise<InsertOneResult<Document>> {
    //   const optionalIdDocument = { ...document }
    //   if (options?.forceId) {
    //     optionalIdDocument._id = options.forceId
    //     optionalIdDocument.id = options.forceId.toString()
    //   }
    //   const result = await collection.insertOne(optionalIdDocument, mongodbOptions)
    //   return result
    // },
    /**
     * Get a document in a MongoDB collection.
     * @param {Filter<T>} filter The filter schema that will filter the documents.
     * @param {CustomReadOptions} [options] Optional options to change how the document should be treated after It's found.
     * @param {FindOptions} [mongodbOptions] Optional MongoDB's FindOptions.
     * @returns {Promise<T | null>} The document searched or null.
     */
    // async read<T>(filter?: Filter<T>, options: CustomReadOptions = { filtered: true }, mongodbOptions?: FindOptions): Promise<T | null> {
    //   const result = await collection.findOne<T>(filter as Filter<Document>, mongodbOptions)
    //   if (result) {
    //     if (options?.filtered)
    //       delete (result as Document)._id
    //   }
    //   return result
    // },
    /**
     * Update a document in a MongoDB collection.
     * @param {Filter<T>} filter The filter schema that will filter the documents.
     * @param {CustomUpdateOptions} [options] Optional options to change how the document should be treated after It's found.
     * @param {UpdateOptions} [mongodbOptions] Optional MongoDB's FindOptions.
     * @returns {Promise<UpdateResult<Document>>} The document searched or null.
     */
    // async update<T>(filter: Filter<T>, document: UpdateFilter<T>, options?: CustomUpdateOptions, mongodbOptions?: UpdateOptions): Promise<UpdateResult<Document>> {
    //   const result = await collection.updateOne(filter as Filter<Document>, document, mongodbOptions)
    //   return result
    // },
  }
}
