import { invariant, text } from './contracts.js';
/** Preserve Vietnamese accents by default: 'ma', 'má', 'mà' are not the same. */
export function normalizeAnswer(value, { locale = 'en', ignorePunctuation = true } = {}) {
  invariant(typeof value === 'string' && value.length <= 2000, 'answer must be text of at most 2000 characters');
  invariant(['en', 'vi'].includes(locale), 'locale must be en or vi');
  let result = value.normalize('NFC').toLocaleLowerCase(locale).trim().replace(/\s+/gu, ' ');
  if (ignorePunctuation) result = result.replace(/[.!?,;:]+$/gu, '').trim();
  return result;
}
export function checkAnswer(answer, accepted, options = {}) {
  invariant(Array.isArray(accepted) && accepted.length > 0 && accepted.length <= 30, 'accepted answers must contain 1–30 entries');
  const normalized = normalizeAnswer(answer, options);
  const valid = accepted.map((value) => normalizeAnswer(text(value, 'accepted answer', 2000), options));
  invariant(valid.every(Boolean), 'accepted answers cannot be punctuation only');
  return { correct: normalized.length > 0 && valid.includes(normalized), normalized };
}
