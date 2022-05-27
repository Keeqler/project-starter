import * as yup from 'yup'
import { User } from '@prisma/client'

export type RequestSchemas<Body, Params = any, Query = any> = {
  params?: yup.ObjectSchema<Record<keyof Params, yup.AnySchema>>
  query?: yup.ObjectSchema<Record<keyof Query, yup.AnySchema>>
  body?: yup.ObjectSchema<Record<keyof Body, yup.AnySchema>>
}

export type JwtPayload = Pick<User, 'id' | 'email' | 'createdAt' | 'updatedAt'> & {
  isAdmin?: string
}
