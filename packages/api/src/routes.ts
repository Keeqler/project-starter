import { Router } from 'express'

import { confirmUser, createUser, requestUserPasswordReset } from '@api/controllers/user.controller'
import { applySchemas } from '@api/middleware/input-validator'
import {
  confirmUserSchemas,
  createUserSchemas,
  requestUserPasswordResetSchemas,
} from '@common/validators/user.validators'

export const routes = Router()

routes.post('/users', applySchemas(createUserSchemas), createUser)
routes.post('/users/activate', applySchemas(confirmUserSchemas), confirmUser)
routes.post(
  '/users/request-password-reset',
  applySchemas(requestUserPasswordResetSchemas),
  requestUserPasswordReset,
)
