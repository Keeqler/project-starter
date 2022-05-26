import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import util from 'util'

import { HttpError } from '@api/middleware/error-handler'
import { sendMail } from '@api/services/mailer'
import { BUSINESS_NAME } from '@api/constants'
import { prisma } from '@common/prisma'
import {
  ConfirmUserErrors,
  ConfirmUserRes,
  ConfirmUserBody,
  CreateUserErrors,
  CreateUserRes,
  CreateUserBody,
  RequestUserPasswordResetBody,
  RequestUserPasswordResetErrors,
} from '@common/request-types/user.request-types'

const randomBytes = util.promisify(crypto.randomBytes)

export async function createUser(
  req: Request<{}, {}, CreateUserBody>,
  res: Response<CreateUserRes>,
) {
  const { email, password } = req.body

  // It's very unlikely that an user will try to register using a taken email
  // so I think it's a good idea to begin hashing the password before querying for a taken email.
  const hashedPassword = bcrypt.hash(password, 10)
  const emailIsTaken = await prisma.user.findFirst({ where: { email } })

  if (emailIsTaken) {
    throw new HttpError(422, CreateUserErrors.emailIsTaken)
  }

  const confirmationToken = (await randomBytes(32)).toString('hex')

  const user = await prisma.user.create({
    data: {
      email,
      password: await hashedPassword,
      confirmationToken,
    },
    select: {
      id: true,
      email: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  sendMail({
    to: email,
    subject: `Welcome! Please confirm your ${BUSINESS_NAME} account`,
    text: confirmationToken,
  })

  // TODO: shouldn't the compiler complain when "password" is included in the body?
  // for some reason that currently won't happen
  res.status(201).send(user)
}

export async function confirmUser(req: Request<ConfirmUserBody>, res: Response<ConfirmUserRes>) {
  const { confirmationToken } = req.body

  try {
    const user = await prisma.user.update({
      where: { confirmationToken },
      data: { confirmationToken: null },
      select: { email: true },
    })

    res.send(user)
  } catch {
    throw new HttpError(422, ConfirmUserErrors.invalidConfirmationToken)
  }
}

export async function requestUserPasswordReset(
  req: Request<RequestUserPasswordResetBody>,
  res: Response,
) {
  const { email } = req.body

  const passwordResetToken = (await randomBytes(32)).toString('hex')

  try {
    await prisma.user.update({
      where: { email },
      data: { passwordResetToken: await bcrypt.hash(passwordResetToken, 8) },
    })
  } catch {
    throw new HttpError(404, RequestUserPasswordResetErrors.userNotFound)
  }

  sendMail({
    to: email,
    subject: 'Password reset link',
    text: passwordResetToken,
  })

  res.send()
}
