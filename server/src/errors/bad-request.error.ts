import { AppError } from './app.error';

export class BadRequest extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
