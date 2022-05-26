import * as yup from 'yup'

export type RequestSchemas<Body, Params = any, Query = any> = {
  params?: yup.ObjectSchema<Record<keyof Params, yup.AnySchema>>
  query?: yup.ObjectSchema<Record<keyof Query, yup.AnySchema>>
  body?: yup.ObjectSchema<Record<keyof Body, yup.AnySchema>>
}

// <keyof Body, AnySchema>
