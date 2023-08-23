import { MONGODB_COLLECTION_TABLES } from '..'
import { mongodbPipelineGetUserHeader } from '.'

export function mongodbPipelineGetTableHeader(fieldName: string) {
  return {
    $lookup: {
      from: MONGODB_COLLECTION_TABLES,
      localField: `${fieldName}.id`,
      foreignField: 'id',
      pipeline: [
        {
          $project: {
            _id: 0,
            owner: 1,
            title: 1,
            banner: 1,
          },
        },
        mongodbPipelineGetUserHeader('owner'),
      ],
      as: fieldName,
    },
  }
}
