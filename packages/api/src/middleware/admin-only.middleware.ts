import { NextFunction, Request, Response } from 'express'

import { HttpError } from './error-handler.middleware'

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if (!req.jwtPayload?.isAdmin) {
    throw new HttpError(403)
  }

  next()
}
