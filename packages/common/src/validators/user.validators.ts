import * as yup from 'yup'

import { RequestSchemas } from '@common/types'
import {
  ConfirmUserBody,
  CreateUserBody,
  RequestPasswordResetBody,
  ResetPasswordBody,
  UpdateUserBody,
  UpdateUserParams,
} from '@common/request-types/user.request-types'

export const createUserSchemas: RequestSchemas<CreateUserBody> = {
  body: yup.object().shape({
    email: yup.string().required().email().trim().lowercase(),
    password: yup.string().required().min(8).max(100),
  }),
}

export const confirmUserSchemas: RequestSchemas<ConfirmUserBody> = {
  body: yup.object().shape({
    confirmationToken: yup.string().required().length(64),
  }),
}

export const updateUserSchemas: RequestSchemas<UpdateUserBody, UpdateUserParams> = {
  params: yup.object().shape({
    id: yup.number().required(),
  }),
  body: yup.object().shape(
    {
      email: yup.string().email().trim().lowercase(),
      password: yup
        .string()
        .min(8)
        .max(100)
        .when('currentPassword', {
          is: (value: string) => !!value,
          then: yup.string().required(),
        }),
      currentPassword: yup
        .string()
        .min(8)
        .max(100)
        .when('password', {
          is: (value: string) => !!value,
          then: yup.string().required(),
        }),
    },
    [
      ['currentPasword', 'password'],
      ['password', 'currentPassword'],
    ],
  ),
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
