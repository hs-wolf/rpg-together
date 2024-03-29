import { MONGODB_COLLECTION_USERS } from '..'

export function mongodbPipelineGetUserHeader(field: string) {
  return [
    {
      $lookup: {
        from: MONGODB_COLLECTION_USERS,
        localField: `${field}.id`,
        foreignField: 'id',
        pipeline: [
          {
            $project: {
              _id: 0,
              id: 1,
              username: 1,
              avatar: 1,
            },
          },
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
