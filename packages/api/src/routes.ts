import { Router } from 'express'

import {
  confirmUser,
  createUser,
  requestPasswordReset,
  resetPassword,
} from '@api/controllers/user.controller'
import { login } from '@api/controllers/auth.controller'
import { applySchemas } from '@api/middleware/input-validator'
import {
  confirmUserSchemas,
  createUserSchemas,
  requestPasswordResetSchemas,
  resetPasswordSchemas,
} from '@common/validators/user.validators'
import { loginSchemas } from '@common/validators/auth.validators'

export const routes = Router()

routes.post('/users', applySchemas(createUserSchemas), createUser)
routes.post('/users/activate', applySchemas(confirmUserSchemas), confirmUser)
routes.post(
  '/users/password-reset-request',
  applySchemas(requestPasswordResetSchemas),
  requestPasswordReset,
)
routes.post('/users/password-reset', applySchemas(resetPasswordSchemas), resetPassword)

routes.post('/auth', applySchemas(loginSchemas), login)
