import * as yup from 'yup'

import { RequestSchemas } from '@common/types'
import {
  ConfirmUserBody,
  CreateUserBody,
  RequestPasswordResetBody,
  ResetPasswordBody,
} from '@common/request-types/user.request-types'

export const createUserSchemas: RequestSchemas<CreateUserBody> = {
  body: yup.object().shape({
    email: yup.string().required().max(40).email().trim().lowercase(),
    password: yup.string().required().min(8).max(100),
  }),
}

export const confirmUserSchemas: RequestSchemas<ConfirmUserBody> = {
  body: yup.object().shape({
    confirmationToken: yup.string().required().length(64),
  }),
}

export const requestPasswordResetSchemas: RequestSchemas<RequestPasswordResetBody> = {
  body: yup.object().shape({
    email: yup.string().required().email().trim().lowercase(),
  }),
}

export const resetPasswordSchemas: RequestSchemas<ResetPasswordBody> = {
  body: yup.object().shape({
    email: yup.string().required().email().trim().lowercase(),
    password: yup.string().required().min(8).max(100),
    passwordResetToken: yup.string().required().length(64),
  }),
}
