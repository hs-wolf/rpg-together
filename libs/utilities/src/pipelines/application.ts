import { MONGODB_COLLECTION_APPLICATIONS } from '..'
import { mongodbPipelineGetTableHeader, mongodbPipelineGetUserHeader } from '.'

export function mongodbPipelineGetApplicationHeader(fieldName: string) {
  return {
    $lookup: {
      from: MONGODB_COLLECTION_APPLICATIONS,
      localField: `${fieldName}.id`,
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
        mongodbPipelineGetUserHeader('applicant'),
        mongodbPipelineGetTableHeader('table'),
      ],
      as: fieldName,
    },
  }
}
