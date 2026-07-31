/**
 * Returns the internal [[Class]] tag of a value, e.g. '[object Object]'.
 */
export const getTag = (value: unknown): string => {
  return Object.prototype.toString.call(value);
};

/**
 * Detects a plain object: an object literal, Object.create(null),
 * or an instance built by the Object constructor. Excludes class
 * instances, arrays, and other exotic objects.
 */
export const isPlainObjectTag = (value: unknown): boolean => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (getTag(value) !== '[object Object]') {
    return false;
  }

  const proto = Object.getPrototypeOf(value);

  if (proto === null) {
    return true;
  }

  const ctor = Object.hasOwn(proto, 'constructor')
    ? (proto as { constructor: unknown }).constructor
    : undefined;

  return (
    typeof ctor === 'function' &&
    ctor instanceof ctor &&
    Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object)
  );
};
