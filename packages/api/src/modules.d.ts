import { REFRESH_TOKEN_COOKIE_NAME } from '@common/constants'
import { JwtPayload } from '@common/types'

declare module 'express' {
  export interface Request {
    jwtPayload?: JwtPayload
    cookies: {
      [REFRESH_TOKEN_COOKIE_NAME]?: string
    }
  }
}
