import { invariant, integer } from './contracts.js';
const DAY = 86400000;
export function assertDay(value) {
  invariant(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value), 'day must be YYYY-MM-DD');
  const time = Date.parse(`${value}T00:00:00.000Z`);
  invariant(Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value, 'day must be a real calendar date');
  return value;
}
export function assertInstant(value) {
  invariant(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value), 'instant must be canonical UTC ISO text');
  invariant(Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value, 'instant must be a real UTC timestamp');
  return value;
}
export function addDays(day, count) {
  assertDay(day); integer(count, -365000, 365000, 'count');
  const result = new Date(Date.parse(`${day}T00:00:00Z`) + count * DAY).toISOString().slice(0, 10);
  return assertDay(result);
}
export function daysBetween(start, end) {
  assertDay(start); assertDay(end);
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / DAY);
}
/** Caller must choose a time zone; local calendar days are not UTC dates. */
export function dayInZone(instant, timeZone) {
  assertInstant(instant);
  invariant(typeof timeZone === 'string' && timeZone.length > 0, 'timeZone is required');
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(instant));
  const get = (type) => parts.find(part => part.type === type).value;
  return assertDay(`${get('year')}-${get('month')}-${get('day')}`);
}
