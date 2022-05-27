import { Request, Response } from 'express'
import { pick } from 'lodash'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { HttpError } from '@api/middleware/error-handler'
import { prisma } from '@common/prisma'
import { LoginBody, LoginErrors, LoginRes } from '@common/request-types/auth.request-types'
import { JwtPayload } from '@common/types'

export async function login(req: Request<{}, {}, LoginBody>, res: Response<LoginRes>) {
  const { email, password } = req.body

  const user = await prisma.user.findFirst({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      isAdmin: true,
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

  const jwtPayload: JwtPayload = pick(user, ['id', 'email', 'createdAt', 'updatedAt'])
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '7d' })

  res.send({ jwt: token })
}
