import { MONGODB_COLLECTION_USERS } from '..';

export const mongodbPipelineGetUserHeader = (fieldName: string) => ({
  $lookup: {
    from: MONGODB_COLLECTION_USERS,
    localField: `${fieldName}.id`,
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
    as: fieldName,
  },
});
