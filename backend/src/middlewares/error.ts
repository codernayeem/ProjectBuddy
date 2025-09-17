import { Request, Response, NextFunction } from 'express';
import { createErrorResponse } from '../utils/helpers';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Default error
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  res.status(statusCode).json(createErrorResponse(message, error.message));
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(createErrorResponse('Endpoint not found'));
};