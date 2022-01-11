import { isLeft } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

export function decodeIoTs<T, O, I>(validator: t.Type<T, O, I>, input: I): T {
  const result = validator.decode(input);

  if (isLeft(result)) {
    throw new Error(result.left.toString());
  }

  return input as unknown as T;
}
