import { NotificationContent } from '@rpg-together/models'
import { mongodbPipelineGetApplicationHeader } from '.'

export function mongodbPipelineGetNotification() {
  return [
    {
      $match: {
        content: {
          $in: [
            NotificationContent.APPLIED_TO_YOUR_TABLE,
            NotificationContent.APPLICATION_ACCEPTED,
            NotificationContent.APPLICATION_DECLINED,
          ],
        },
      },
    },
    ...mongodbPipelineGetApplicationHeader('data', '_temporaryApplication'),
    {
      $set: {
        data: {
          $mergeObjects: [
            '$_temporaryApplication',
          ],
        },
      },
    },
    {
      $unset: [
        '_temporaryApplication',
      ],
    },
    {
      $project: {
        _id: 0,
        id: 1,
        userId: 1,
        type: 1,
        content: 1,
        read: 1,
        creationDate: 1,
        lastUpdateDate: 1,
        data: 1,
      },
    },
  ]
}
