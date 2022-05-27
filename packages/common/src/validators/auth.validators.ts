import * as yup from 'yup'

import { RequestSchemas } from '@common/types'
import { LoginBody } from '@common/request-types/auth.request-types'

export const loginSchemas: RequestSchemas<LoginBody> = {
  body: yup.object().shape({
    email: yup.string().required().email().trim().lowercase(),
    password: yup.string().required().min(8).max(100),
  }),
}
