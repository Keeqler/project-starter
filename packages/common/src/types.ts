import { User } from '@prisma/client'
import * as yup from 'yup'
import jwt from 'jsonwebtoken'

export type RequestSchemas<Body, Params = any, Query = any> = {
  params?: yup.ObjectSchema<Record<keyof Params, yup.AnySchema>>
  query?: yup.ObjectSchema<Record<keyof Query, yup.AnySchema>>
  body?: yup.ObjectSchema<Record<keyof Body, yup.AnySchema>>
}

export type JwtPayloadWithoutDefaults = Pick<
  User,
  'id' | 'email' | 'tokenVersion' | 'createdAt' | 'updatedAt'
> & { isAdmin?: string }

export type JwtPayload = JwtPayloadWithoutDefaults & jwt.JwtPayload
