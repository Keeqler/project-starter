import { Request, Response, NextFunction } from 'express'
import { ValidationError } from 'yup'

export class HttpError {
  status: number
  message: string

  constructor(status: number, message?: string) {
    this.status = status
    this.message = message || ''
  }
}

export async function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof HttpError) {
    const resBody = error.message ? { error: error.message } : null
    return res.status(error.status).send(resBody)
  }

  if (error instanceof ValidationError) {
    const errors: Record<string, string[]> = {}

    error.inner.forEach(valError => {
      errors[(valError.path as string) || (valError.type as string)] = valError.errors
    })

    return res.status(422).send(errors)
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(error)
  }

  res.sendStatus(500)
}
