import { Router } from 'express'

import { createUser } from '@api/controllers/user.controller'
import { applySchemas } from '@api/middleware/input-validator'
import { createUserSchemas } from '@common/validators/user.validators'

export const routes = Router()

routes.post('/users', applySchemas(createUserSchemas), createUser)
