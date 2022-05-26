import * as yup from 'yup'

import { RequestSchemas } from '@common/types'
import { ConfirmUserBody, CreateUserBody } from '@common/request-types/user.request-types'

export const createUserSchemas: RequestSchemas<CreateUserBody> = {
  body: yup.object().shape({
    email: yup.string().required().max(40).email().trim().lowercase(),
    password: yup.string().required().min(6).max(100),
  }),
}

export const confirmUserSchemas: RequestSchemas<{}, ConfirmUserBody> = {
  body: yup.object().shape({
    confirmationToken: yup.string().required().length(64),
  }),
}
