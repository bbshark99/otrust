import { isLeft, getOrElse } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/PathReporter';

export function decodeIoTs<T, O, I>(validator: t.Type<T, O, I>, input: I): T {
  const result = validator.decode(input);
  const decoded = getOrElse(() => result as unknown as T)(result);

  if (isLeft(result)) {
    throw new Error(PathReporter.report(result).join('\n'));
  }

  return decoded;
}

export function encodeIoTs<T, O, I>(validator: t.Type<T, O, I>, input: T): O {
  const result = validator.encode(input);
  return result;
}
