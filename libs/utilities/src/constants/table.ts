export const DEFAULT_TABLE_BANNER
  = 'https://placehold.co/1280x720?text=Banner'
export const DEFAULT_TABLE_BANNER_NAME = 'banner.png'
export const LIMIT_OF_TABLES = 3
export const TABLE_TITLE_MAX_LENGTH = 128
export const TABLE_DESCRIPTION_MAX_LENGTH = 512
export const TABLE_ACCEPT_MESSAGE_MAX_LENGTH = 512
export const TABLE_BANNER_MAX_SIZE_IN_MB = 15

export const DEFAULT_ANNOUNCEMENT_NAME = 'image'

export const APPLICATION_MESSAGE_MAX_LENGTH = 1024

export const TABLE_DEFAULTS = {
  LIMIT: 3,
  BANNER_URL: 'https://placehold.co/1280x720?text=Banner',
  BANNER_NAME: 'banner',
  BANNER_EXT: 'jpg',
  BANNER_MAX_SIZE_IN_MB: 10,
  TITLE_MAX_LENGTH: 128,
  DESCRIPTION_MAX_LENGTH: 128,
  ACCEPT_MESSAGE_MAX_LENGTH: 128,
}

export enum TABLE_FILE_TYPES {
  ALL,
  BANNER,
}
