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

// Update user

export type UpdateUserParams = { id: string }
export type UpdateUserBody = Partial<Pick<User, 'email' | 'password'>> & {
  currentPassword?: string
}
export enum UpdateUserErrors {
  emailIsTaken = 'EmailIsTaken',
  invalidCurrentPassword = 'InvalidCurrentPassword',
}

// Request user password reset

export type RequestPasswordResetBody = { email: string }
export enum RequestPasswordResetErrors {
  userNotFound = 'UserNotFound',
}

// User password reset

export type ResetPasswordBody = { email: string; password: string; passwordResetToken: string }
export enum ResetPasswordErrors {
  userNotFound = 'UserNotFound',
  invalidPasswordResetToken = 'InvalidPasswordResetToken',
}
