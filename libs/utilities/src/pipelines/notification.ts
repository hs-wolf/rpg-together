import { NotificationContent } from '@rpg-together/models'
import { mongodbPipelineGetApplicationHeader } from '.'

export function mongodbPipelineGetNotification() {
  return [
    {
      $facet: {
        [NotificationContent.APPLIED_TO_YOUR_TABLE]: [
          {
            $match: { content: NotificationContent.APPLIED_TO_YOUR_TABLE },
          },
          mongodbPipelineGetApplicationHeader('data'),
        ],
        [NotificationContent.APPLICATION_ACCEPTED]: [
          {
            $match: { content: NotificationContent.APPLICATION_ACCEPTED },
          },
          mongodbPipelineGetApplicationHeader('data'),
        ],
        [NotificationContent.APPLICATION_DECLINED]: [
          {
            $match: { content: NotificationContent.APPLICATION_DECLINED },
          },
          mongodbPipelineGetApplicationHeader('data'),
        ],
      },
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
        data: {
          $concatArrays: Object.values(NotificationContent).map(content => `$${content}`),
        },
      },
    },
  ]
}
