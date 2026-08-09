export type Result<T, E> = Success<T> | Failure<E>;

export interface Success<T> {
  readonly ok: true;
  readonly value: T;
}

export interface Failure<E> {
  readonly ok: false;
  readonly error: E;
}

export function ok<T>(value: T): Success<T> {
  return {
    ok: true,
    value,
  };
}

export function fail<E>(error: E): Failure<E> {
  return {
    ok: false,
    error,
  };
}

export function isOk<T, E>(
  result: Result<T, E>,
): result is Success<T> {
  return result.ok;
}

export function isFailure<T, E>(
  result: Result<T, E>,
): result is Failure<E> {
  return !result.ok;
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value;
  }

  throw result.error;
}
