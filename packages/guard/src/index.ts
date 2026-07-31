export type { Guard, GuardShape, GuardType, InferShape } from './combinators';

export {
  isArrayOf,
  isInstanceOf,
  isLiteral,
  isNonEmptyArray,
  isOneOf,
  isShape,
  not,
  nullable,
  optional,
} from './combinators';
export {
  isEmptyArray,
  isEmptyObject,
  isEmptyString,
} from './emptiness';
export {
  isInteger,
  isNegative,
  isNumberFinite,
  isPositive,
  isSafeInteger,
  isZero,
} from './numeric';
export {
  isArray,
  isDate,
  isError,
  isFunction,
  isMap,
  isObject,
  isObjectLike,
  isPlainObject,
  isPromise,
  isRegExp,
  isSet,
  isThenable,
  isWeakMap,
  isWeakSet,
} from './objects';
export {
  isBigInt,
  isBoolean,
  isDefined,
  isNil,
  isNull,
  isNumber,
  isString,
  isSymbol,
  isUndefined,
} from './primitives';
