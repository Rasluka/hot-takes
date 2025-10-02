export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isExpected: boolean;

  constructor(message: string, statusCode: number, isExpected = true) {
    super(message);
    this.statusCode = statusCode;
    this.isExpected = isExpected;
  }
}
