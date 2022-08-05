// rust inspired
// can be replaced with Promise since both patterns heed from the same background (monad/monoid??)

import { logger } from "../../constants";

interface OptionMatcher {
  /**
   * Equals to Ok(...) branch in match {} block
   */
  isOk(): boolean
  
  /**
   * Equals to None branch in match {} block
   */
  isNone(): boolean
}

export interface Option<T> {
  /**
   * This property takes some liberty in implementing a Rust feature in Typescript,
   * which is not supposed to work as expected
   */
  match: OptionMatcher

  /**
   * Return result if the option is not None, else throws a generic error with the provided message
   * @param message Message expected to be seen when a None is encountered
   * @param errorCtor Custom error constructor to be used for this method. That error type will be thrown
   * instead of the generic `Error` class
   */
  expect<ErrorType>(message: string, errorCtor?: new (...args: any[]) => ErrorType): T;

  /**
   * Unwraps the value. If None is met, the provided default value is used instead
   * @param defaultValue Default value to be used when None is got
   */
  unwrapOr(defaultValue: T): T;

  /**
   * Unwraps the value. If None is met, callback will be evaluated and its returned value will be returned
   * for this method
   * @param callback Callback to be called when None is got
   */
  unwrapOrElse(callback: ()=>T): T;

  /**
   * Not in Rust. It is the same as unwrapOrElse but the result is asynchronous
   * @param asyncCallback 
   */
  unwrapOrElseAsync(asyncCallback: ()=> Promise<T>): Promise<T>;

  /**
   * Method for mapping the current option into wrapping a new type instead.
   * If the previous option contains a None, callback execution will not be considered.
   * @param callback 
   */
  map<NewType>(callback: (val: T)=>Option<NewType>): Option<NewType>;
}

class NormalOption<T> implements Option<T> {
  value: T
  match = {
    isOk(){ return true },
    isNone(){ return false }
  }

  constructor(value: T){ this.value = value }

  expect(_: string): T { return this.value }
  unwrapOr(_: T): T { return this.value }
  unwrapOrElse(_: () => T): T { return this.value }
  async unwrapOrElseAsync(_: () => Promise<T>): Promise<T> { return this.value }
  map<NewType>(callback?: (val: T)=>Option<NewType>): Option<NewType> { return callback(this.value) }
  toString(){ return `[object Some(${this.value.toString()})]` }
}

class EmptyOption implements Option<never> {
  match = {
    isOk(){ return false },
    isNone(){ return true }
  }

  expect<ErrorType>(message: string, errorCtor?: new (...args: any[]) => ErrorType): never {
    logger.error(`A None option was passed and expected. Error message: ${message}`)
    if(errorCtor) throw new errorCtor(message)
    throw new Error(message)
  }
  unwrapOr<T>(defaultValue: T): T { return defaultValue }
  unwrapOrElse<T>(callback: () => T): T { return callback() }
  async unwrapOrElseAsync<T>(asyncCallback: () => Promise<T>): Promise<T> {
    if(asyncCallback) return await asyncCallback()
    throw new TypeError("Unwrap callback must present")
  }
  map<T, NewType>(_: (_: T)=>Option<NewType>): Option<NewType> { return None }
  toString(){ return "[object None]" }
}

export function Some<T>(val: T): Option<T> { return new NormalOption(val) }
export const None: Option<never> = new EmptyOption()