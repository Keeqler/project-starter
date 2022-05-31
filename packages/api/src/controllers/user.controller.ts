import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import util from 'util'

import { HttpError } from '@api/middleware/error-handler.middleware'
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
  RequestPasswordResetBody,
  RequestPasswordResetErrors,
  ResetPasswordBody,
  ResetPasswordErrors,
  UpdateUserParams,
  UpdateUserBody,
  UpdateUserErrors,
} from '@common/request-types/user.request-types'
import { User } from '@prisma/client'

const randomBytes = util.promisify(crypto.randomBytes)

export async function createUser(
  req: Request<{}, {}, CreateUserBody>,
  res: Response<CreateUserRes>,
) {
  const { email, password } = req.body

  const emailIsTaken = await prisma.user.findFirst({ where: { email } })

  if (emailIsTaken) {
    throw new HttpError(422, CreateUserErrors.emailIsTaken)
  }

  const confirmationToken = (await randomBytes(32)).toString('hex')

  const user = await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
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

export async function confirmUser(
  req: Request<{}, {}, ConfirmUserBody>,
  res: Response<ConfirmUserRes>,
) {
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

export async function updateUser(
  req: Request<UpdateUserParams, {}, UpdateUserBody>,
  res: Response,
) {
  const id = Number(req.params.id)
  const { email, password, currentPassword } = req.body

  if (!req.jwtPayload) {
    console.log('here')
    throw new HttpError(500)
  }

  if (Number(id) !== req.jwtPayload.id) {
    throw new HttpError(403)
  }

  const user = await prisma.user.findFirst({
    where: { id },
    select: { password: true, tokenVersion: true },
  })

  if (!user) {
    throw new HttpError(500)
  }

  const data: Partial<Pick<User, 'email' | 'password' | 'tokenVersion'>> = {}

  if (email) {
    const emailIsTaken = !!(await prisma.user.findFirst({ where: { email } }))

    if (emailIsTaken) {
      throw new HttpError(422, UpdateUserErrors.emailIsTaken)
    }

    data.email = email
  }

  if (password && currentPassword) {
    const passwordsMatch = await bcrypt.compare(currentPassword, user.password)

    if (!passwordsMatch) {
      throw new HttpError(422, UpdateUserErrors.invalidCurrentPassword)
    }

    data.password = await bcrypt.hash(password, 10)
  }

  if (email || password) {
    data.tokenVersion = user.tokenVersion + 1
  }

  await prisma.user.update({ where: { id }, data })

  res.send(204)
}

export async function requestPasswordReset(
  req: Request<{}, {}, RequestPasswordResetBody>,
  res: Response,
) {
  const { email } = req.body

  const passwordResetToken = (await randomBytes(32)).toString('hex')

  try {
    await prisma.user.update({
      where: { email },
      data: { passwordResetToken: await bcrypt.hash(passwordResetToken, 7) },
    })
  } catch {
    throw new HttpError(404, RequestPasswordResetErrors.userNotFound)
  }

  sendMail({
    to: email,
    subject: 'Password reset link',
    text: passwordResetToken,
  })

  res.send()
}

export async function resetPassword(req: Request<{}, {}, ResetPasswordBody>, res: Response) {
  const { email, passwordResetToken, password } = req.body

  const user = await prisma.user.findFirst({ where: { email } })

  if (!user) {
    throw new HttpError(404, ResetPasswordErrors.userNotFound)
  }

  const resetTokenIsValid =
    user.passwordResetToken && (await bcrypt.compare(passwordResetToken, user.passwordResetToken))

  if (!resetTokenIsValid) {
    throw new HttpError(422, ResetPasswordErrors.invalidPasswordResetToken)
  }

  await prisma.user.update({
    where: { email },
    data: { password: await bcrypt.hash(password, 10), passwordResetToken: null },
  })

  res.send()
}
