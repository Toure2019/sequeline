import { Request, Response, NextFunction } from 'express'

import logger from '../util/logger'

interface Error {
  context: string;
  stack: object;
  message?: string;
  status?: number;
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export default async (error: Error, req: Request, res: Response, next: NextFunction) => {
  const errorContext = error.context || 'NoContext'
  const errorMessage = error.message || 'An error occured'
  const errorStatus = error.status || 500

  logger.error(`[${errorContext}] ${errorMessage} `, error.stack)

  res.status(errorStatus).json({ message: errorMessage })
}
