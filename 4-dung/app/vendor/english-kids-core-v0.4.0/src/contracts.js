/** Runtime contracts. No account data or child names are required. */
export const VERSION = 1;
export const GRADES = Object.freeze(['again', 'hard', 'good', 'easy']);
export function invariant(condition, message) {
  if (!condition) throw new TypeError(message);
}
export function record(value, name = 'value') {
  invariant(value !== null && typeof value === 'object' && !Array.isArray(value), `${name} must be an object`);
  const proto = Object.getPrototypeOf(value);
  invariant(proto === Object.prototype || proto === null, `${name} must be plain data`);
  return value;
}
export function id(value, name = 'id') {
  invariant(typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,95}$/.test(value), `${name} must be a safe non-empty ID`);
  invariant(!['__proto__', 'prototype', 'constructor'].includes(value), `${name} is reserved`);
  return value;
}
export function text(value, name = 'text', max = 1000) {
  invariant(typeof value === 'string' && value.trim().length > 0 && value.length <= max, `${name} must be non-empty text of at most ${max} characters`);
  return value;
}
export function integer(value, min, max, name = 'number') {
  invariant(Number.isSafeInteger(value) && value >= min && value <= max, `${name} must be an integer from ${min} to ${max}`);
  return value;
}
export function unique(values, name = 'IDs') {
  invariant(new Set(values).size === values.length, `${name} must be unique`);
}
export function boundedArray(value, name, max = 10000) {
  invariant(Array.isArray(value) && value.length <= max, `${name} must be an array of at most ${max} items`);
  return value;
}

/** Locale-independent ordering for replicated event IDs and ISO timestamps. */
export function compareText(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
