// Login

export type LoginBody = { email: string; password: string }
export type LoginRes = { jwt: string }
export enum LoginErrors {
  invalidCredentials = 'InvalidCredentials',
}
