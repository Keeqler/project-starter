/* eslint-disable no-unused-vars */
import { User } from '@prisma/client'

// Create user

export type CreateUserBody = Pick<User, 'email' | 'password'>
export type CreateUserRes = Pick<User, 'id' | 'email' | 'isAdmin' | 'createdAt' | 'updatedAt'>
export enum CreateUserErrors {
  emailIsTaken = 'EmailIsTaken',
}

// Confirm user

export type ConfirmUserBody = { confirmationToken: string }
export type ConfirmUserRes = { email: string }
export enum ConfirmUserErrors {
  invalidConfirmationToken = 'InvalidConfirmationToken',
}

// Request user password reset

export type RequestUserPasswordResetBody = { email: string }
export enum RequestUserPasswordResetErrors {
  userNotFound = 'UserNotFound',
}
