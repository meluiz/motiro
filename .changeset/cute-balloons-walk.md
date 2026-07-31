---
"@motiro/guard": minor
---

Initial release of @motiro/guard — a composable layer of type guards and runtime validation.
Includes:

- `isString`, `isNumber`, `isBoolean`, `isBigInt`, `isSymbol` — primitive type guards
- `isNull`, `isUndefined`, `isNil` — nullish checks (`isNil` matches both `null` and `undefined`)
- `isDefined` — narrows away `null` and `undefined`, ideal as an array filter
- `isInteger`, `isSafeInteger` — integer checks
- `isNumberFinite` — finite number check without coercion
- `isPositive`, `isNegative`, `isZero` — sign checks
- `isObjectLike`, `isObject`, `isPlainObject` — object checks at increasing strictness
- `isArray`, `isFunction`, `isDate`, `isRegExp`, `isError` — built-in type guards
- `isPromise`, `isThenable` — native promise vs. any thenable
- `isMap`, `isSet`, `isWeakMap`, `isWeakSet` — collection guards
- `isEmptyString`, `isEmptyArray`, `isEmptyObject` — per-type emptiness checks
- `isOneOf` — union guard, passes if any input guard passes
- `isArrayOf` — array whose every element satisfies a guard
- `isShape` — validates an object against a map of guards
- `isLiteral` — strict equality against a set of literals
- `isInstanceOf` — typed `instanceof` wrapper
- `isNonEmptyArray` — non-empty array, optionally element-checked
- `not`, `optional`, `nullable` — negate a guard / wrap to also accept `undefined` or `null`
- `Guard`, `GuardType`, `GuardShape`, `InferShape` — type utilities for typing your own guards
