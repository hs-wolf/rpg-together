import { MONGODB_COLLECTION_USERS } from '.';

export const DEFAULT_USER_AVATAR =
  'https://firebasestorage.googleapis.com/v0/b/rpg-together-44d2e.appspot.com/o/defaults%2Fdefault-profile-picture.jpg?alt=media&token=b292a338-3c0e-452f-a0ca-74ed86f49016';

export const DEFAULT_USER_AVATAR_NAME = 'avatar';

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
