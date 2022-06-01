import { Request, Response } from 'express'
import { pick } from 'lodash'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { HttpError } from '@api/middleware/error-handler.middleware'
import { ADMIN_JWT_PAYLOAD_KEYS, USER_JWT_PAYLOAD_KEYS } from '@api/constants'
import {
  LoginBody,
  LoginErrors,
  LoginRes,
  RefreshTokenRes,
} from '@common/request-types/auth.request-types'
import { prisma } from '@common/prisma'
import { JwtPayload, JwtPayloadWithoutDefaults } from '@common/types'
import { REFRESH_TOKEN_COOKIE_NAME } from '@common/constants'

export async function login(req: Request<{}, {}, LoginBody>, res: Response<LoginRes>) {
  const { email, password } = req.body

  const user = await prisma.user.findFirst({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      isAdmin: true,
      tokenVersion: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    throw new HttpError(422, LoginErrors.invalidCredentials)
  }

  const passwordIsValid = await bcrypt.compare(password, user.password)

  if (!passwordIsValid) {
    throw new HttpError(422, LoginErrors.invalidCredentials)
  }

  let jwtPayload: JwtPayloadWithoutDefaults

  if (user.isAdmin) {
    jwtPayload = pick(user, ADMIN_JWT_PAYLOAD_KEYS)
  } else {
    jwtPayload = pick(user, USER_JWT_PAYLOAD_KEYS)
  }

  const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' })
  const refreshToken = jwt.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    path: '/auth/refresh-token',
    httpOnly: true,
    sameSite: true,
    secure: true,
  })

  res.send({ accessToken })
}

export async function refreshToken(req: Request, res: Response<RefreshTokenRes>) {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME]

  if (!refreshToken) {
    throw new HttpError(401)
  }

  let jwtPayload: JwtPayload

  try {
    jwtPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as typeof jwtPayload
  } catch {
    throw new HttpError(401)
  }

  const user = await prisma.user.findFirst({ where: { id: jwtPayload.id } })

  if (!user) {
    throw new HttpError(401)
  }

  if (jwtPayload.tokenVersion !== user.tokenVersion) {
    throw new HttpError(401)
  }

  // Token is valid

  const newJwtPayload: JwtPayloadWithoutDefaults = pick(user, USER_JWT_PAYLOAD_KEYS)
  const accessToken = jwt.sign(newJwtPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' })

  res.send({ accessToken })
}
