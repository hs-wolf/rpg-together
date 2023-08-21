import { MONGODB_COLLECTION_TABLES, mongodbPipelineGetUserHeader } from '.';

export const DEFAULT_TABLE_BANNER =
  'https://firebasestorage.googleapis.com/v0/b/rpg-together-44d2e.appspot.com/o/defaults%2Fdefault-table-banner.png?alt=media&token=5a59520c-94f5-486d-8391-c8c8af2fb548';

export const DEFAULT_TABLE_BANNER_NAME = 'banner';

export const LIMIT_OF_TABLES = 3;

export const TABLE_TITLE_MAX_LENGTH = 128;
export const TABLE_DESCRIPTION_MAX_LENGTH = 512;
export const TABLE_ACCEPT_MESSAGE_MAX_LENGTH = 512;

export const APPLICATION_MESSAGE_MAX_LENGTH = 1024;

export const mongodbPipelineGetTableHeader = (fieldName: string) => ({
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
});
