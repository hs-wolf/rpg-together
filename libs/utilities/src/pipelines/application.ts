import { MONGODB_COLLECTION_APPLICATIONS } from '..'
import { mongodbPipelineGetTableHeader, mongodbPipelineGetUserHeader } from '.'

export function mongodbPipelineGetApplicationHeader(field: string, asField?: string) {
  return [
    {
      $lookup: {
        from: MONGODB_COLLECTION_APPLICATIONS,
        localField: `${field}.id`,
        foreignField: 'id',
        pipeline: [
          {
            $project: {
              _id: 0,
              id: 1,
              applicant: 1,
              table: 1,
            },
          },
          ...mongodbPipelineGetUserHeader('applicant'),
          ...mongodbPipelineGetTableHeader('table'),
        ],
        as: asField,
      },
    }, {
      $unwind: {
        path: `$${asField}`,
        preserveNullAndEmptyArrays: true,
      },
    },
  ]
}
