import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { prisma } from '@common/prisma'
import { JwtPayload } from '@common/types'
import { HttpError } from './error-handler.middleware'

export async function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new HttpError(401, 'Authentication required.')
  }

  const [bearer, token] = req.headers.authorization?.split(' ') as (string | undefined)[]

  if (!bearer || !(bearer.toLowerCase() === 'bearer') || !token) {
    throw new HttpError(401, 'Bad authorization header.')
  }

  let payload: JwtPayload

  try {
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as JwtPayload
  } catch (error) {
    throw new HttpError(401, 'Invalid access token.')
  }

  const user = await prisma.user.findFirst({
    where: { id: payload.id },
    select: { tokenVersion: true },
  })

  if (!user) {
    throw new HttpError(401, 'User not found')
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    throw new HttpError(401, 'Invalid access token.')
  }

  req.jwtPayload = payload

  next()
}
