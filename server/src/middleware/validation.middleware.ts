import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { BadRequest } from '../errors/bad-request.error';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.body) {
      throw new BadRequest('Request body is required');
    }
    
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      const errors = result.error.issues || [];
      const errorMessages = errors.map(e => `${e.path.join('.')}: ${e.message}`);
      throw new BadRequest(`Validation failed: ${errorMessages.join(', ')}`);
    }
    
    req.body = result.data;
    next();
  };
};