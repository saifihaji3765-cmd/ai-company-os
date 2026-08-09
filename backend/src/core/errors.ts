export type ErrorCode =
  | "INTERNAL_ERROR"
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "DEPENDENCY_ERROR";

export interface ApplicationErrorOptions {
  readonly code: ErrorCode;
  readonly message: string;
  readonly statusCode: number;
  readonly cause?: unknown;
  readonly details?: Readonly<Record<string, unknown>>;
}

export class ApplicationError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(options: ApplicationErrorOptions) {
    super(options.message, { cause: options.cause });

    this.name = "ApplicationError";
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.details = options.details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isApplicationError(
  error: unknown,
): error is ApplicationError {
  return error instanceof ApplicationError;
}

export function toApplicationError(error: unknown): ApplicationError {
  if (isApplicationError(error)) {
    return error;
  }

  return new ApplicationError({
    code: "INTERNAL_ERROR",
    message: "An unexpected internal error occurred.",
    statusCode: 500,
    cause: error,
  });
}
