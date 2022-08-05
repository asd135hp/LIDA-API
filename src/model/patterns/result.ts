// Rust inspired

type OkFunc<T> = (val: T) => void
type ErrFunc<E> = (err: E) => void
type OkFuncAsync<T> = (val: T) => Promise<void>
type ErrFuncAsync<E> = (err: E) => Promise<void>

export interface Result<T, E> {
  handleResult(
    ok: OkFunc<T>,
    error: ErrFunc<E>
  ): void;

  handleResultAsync(
    ok: OkFuncAsync<T>,
    error: ErrFuncAsync<E>
  ): Promise<void>;
}

class Success<T> implements Result<T, never> {
  val: T

  constructor(val: T){
    this.val = val
  }

  handleResult(ok: OkFunc<T>, _: ErrFunc<never>): void {
    ok && ok(this.val)
  }

  async handleResultAsync(ok: OkFuncAsync<T>, _: ErrFuncAsync<never>): Promise<void> {
    ok && (await ok(this.val))
  }
}

class Failure<E> implements Result<never, E> {
  err: E

  constructor(error: E){
    this.err = error
  }

  handleResult(_: OkFunc<never>, error: ErrFunc<E>): void {
    error && error(this.err)
  }

  async handleResultAsync(_: OkFuncAsync<never>, error: ErrFuncAsync<E>): Promise<void> {
    error && await error(this.err)
  }
}

export function Ok<T>(val: T): Result<T, never> { return new Success(val) }
export function Err<E>(err: E): Result<never, E> { return new Failure(err) }