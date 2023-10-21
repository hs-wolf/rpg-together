import { MONGODB_COLLECTION_TABLES } from '..'
import { mongodbPipelineGetUserHeader } from '.'

export function mongodbPipelineGetTableHeader(field: string) {
  return [
    {
      $lookup: {
        from: MONGODB_COLLECTION_TABLES,
        localField: `${field}.id`,
        foreignField: 'id',
        pipeline: [
          {
            $project: {
              _id: 0,
              id: 1,
              title: 1,
              banner: 1,
              owner: 1,
              acceptMessageId: 1,
            },
          },
          ...mongodbPipelineGetUserHeader('owner'),
        ],
        as: field,
      },
    }, {
      $unwind: {
        path: `$${field}`,
        preserveNullAndEmptyArrays: true,
      },
    },
  ]
}
