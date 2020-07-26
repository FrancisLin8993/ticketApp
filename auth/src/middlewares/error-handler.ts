/**
 * Error handler as a middleware of the service
 */
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: 'sth went wrong' }],
  });
};
