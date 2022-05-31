// Login

export type LoginBody = { email: string; password: string }
export type LoginRes = { accessToken: string }
export enum LoginErrors {
  invalidCredentials = 'InvalidCredentials',
}

export type RefreshTokenRes = { accessToken: string }
