import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { createErrorResponse } from '../utils/helpers';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      res.status(400).json(createErrorResponse('Validation error', errorMessage));
      return;
    }

    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      res.status(400).json(createErrorResponse('Query validation error', errorMessage));
      return;
    }

    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.params);
    
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      res.status(400).json(createErrorResponse('Parameter validation error', errorMessage));
      return;
    }

    next();
  };
};