import 'dotenv/config'
import 'express-async-errors'

import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

import { errorHandler } from '@api/middleware/error-handler'
import { routes } from '@api/routes'

import '@api/aliases'

export const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.WEB_URL : process.env.WEB_URL,
  }),
)
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }))
app.use(helmet())
app.use(express.json())
app.use(routes)
app.use(errorHandler)

const port = process.env.API_PORT ?? 3333

app.listen(port, () => console.log(`Listening to ${port}`))
