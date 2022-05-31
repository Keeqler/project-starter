import { NextFunction, Request, Response } from 'express'
import * as yup from 'yup'

type RequestSchemas = {
  params?: yup.ObjectSchema<Record<string, yup.AnySchema>>
  query?: yup.ObjectSchema<Record<string, yup.AnySchema>>
  body?: yup.ObjectSchema<Record<string, yup.AnySchema>>
}

export function applySchemas(schemas: RequestSchemas) {
  async function middleware(req: Request, res: Response, next: NextFunction) {
    for (const _inputName of Object.keys(schemas)) {
      const inputName = _inputName as keyof RequestSchemas
      const schema = schemas[inputName] as yup.AnyObjectSchema

      try {
        let input: Record<string, unknown> = req[inputName]

        if (!input || !Object.keys(input).length) {
          return res.status(400).send({ error: `Request ${inputName} missing.` })
        }

        input = schema.cast(input, { assert: false, stripUnknown: true })
        input = await schema.validate(input, {
          abortEarly: false,
          stripUnknown: true,
          strict: true,
        })
        req[inputName] = input
      } catch (error) {
        next(error)
      }
    }

    next()
  }

  return middleware
}
