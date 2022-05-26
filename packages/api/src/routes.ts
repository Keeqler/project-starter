import { Router } from 'express'

import {
  confirmUser,
  createUser,
  requestPasswordReset,
  resetPassword,
} from '@api/controllers/user.controller'
import { applySchemas } from '@api/middleware/input-validator'
import {
  confirmUserSchemas,
  createUserSchemas,
  requestPasswordResetSchemas,
  resetPasswordSchemas,
} from '@common/validators/user.validators'

export const routes = Router()

routes.post('/users', applySchemas(createUserSchemas), createUser)
routes.post('/users/activate', applySchemas(confirmUserSchemas), confirmUser)
routes.post(
  '/users/password-reset-request',
  applySchemas(requestPasswordResetSchemas),
  requestPasswordReset,
)
routes.post('/users/password-reset', applySchemas(resetPasswordSchemas), resetPassword)
