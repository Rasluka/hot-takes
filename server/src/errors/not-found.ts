import { AppError } from './app-error';

export class NotFound extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}
