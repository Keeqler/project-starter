export const BUSINESS_NAME = 'ProjectStarter'
export const USER_JWT_PAYLOAD_KEYS = [
  'id',
  'email',
  'tokenVersion',
  'createdAt',
  'updatedAt',
] as const

export const ADMIN_JWT_PAYLOAD_KEYS = [...USER_JWT_PAYLOAD_KEYS, 'isAdmin'] as const
