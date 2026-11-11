import { compareText, boundedArray, GRADES, id, integer, invariant, record, VERSION } from './contracts.js';
import { assertDay, assertInstant, dayInZone } from './dates.js';
import { newReview, scheduleReview } from './review.js';
const MAX_EVENTS = 50000;
export function validateEvent(event) {
  record(event, 'event'); id(event.id, 'event ID'); id(event.profileId, 'anonymous profile ID');
  id(event.cardId, 'cardId'); id(event.sessionId, 'sessionId'); assertInstant(event.at);
  assertDay(event.day);
  invariant(typeof event.timeZone === 'string' && event.day === dayInZone(event.at, event.timeZone), 'event day must agree with timestamp and timeZone');
  invariant(GRADES.includes(event.grade), 'unknown grade');
  integer(event.durationMs, 0, 600000, 'durationMs');
  return event;
}
function canonical(event) {
  // Explicit allowlist discards accidental fields such as child names or audio recordings.
  validateEvent(event);
  return { id: event.id, profileId: event.profileId, cardId: event.cardId, sessionId: event.sessionId, at: event.at, day: event.day, timeZone: event.timeZone, grade: event.grade, durationMs: event.durationMs };
}
/** Merge is deterministic and idempotent. Conflicting equal IDs fail instead of losing data. */
export function mergeEvents(...lists) {
  invariant(lists.length >= 1 && lists.length <= 20, 'merge needs 1–20 event lists');
  const byId = new Map();
  for (const list of lists) {
    for (const raw of boundedArray(list, 'events', MAX_EVENTS)) {
      const event = canonical(raw);
      const prior = byId.get(event.id);
      invariant(!prior || JSON.stringify(prior) === JSON.stringify(event), `conflicting event ID ${event.id}`);
      byId.set(event.id, event);
      invariant(byId.size <= MAX_EVENTS, `event limit exceeded (${MAX_EVENTS})`);
    }
  }
  return [...byId.values()].sort((a, b) => compareText(a.at, b.at) || compareText(a.id, b.id));
}
export function replayProgress(events, profileId) {
  id(profileId, 'profileId');
  const reviews = new Map();
  const history = mergeEvents(events).filter(event => event.profileId === profileId);
  for (const event of history) {
    const previous = reviews.get(event.cardId) ?? newReview(event.cardId, event.day);
    // Travel/time-zone changes can move a later instant to an earlier local day.
    // Keep review dates monotonic, while reports preserve the original event day.
    const reviewDay = previous.lastDay && previous.lastDay > event.day ? previous.lastDay : event.day;
    reviews.set(event.cardId, scheduleReview(previous, event.grade, reviewDay));
  }
  return { schemaVersion: VERSION, profileId, reviews: [...reviews.values()].sort((a, b) => compareText(a.cardId, b.cardId)), eventCount: history.length };
}
export function exportProgress(events, profileId) {
  id(profileId, 'profileId');
  return JSON.stringify({ schemaVersion: VERSION, profileId, events: mergeEvents(events).filter(event => event.profileId === profileId) }, null, 2);
}
export function importProgress(serialized, expectedProfileId) {
  id(expectedProfileId, 'expectedProfileId');
  invariant(typeof serialized === 'string' && serialized.length <= 20000000, 'backup must be text no larger than 20 million characters');
  const data = record(JSON.parse(serialized), 'backup');
  invariant(data.schemaVersion === VERSION, 'unsupported progress schemaVersion');
  invariant(data.profileId === expectedProfileId, 'backup belongs to a different profile');
  const events = mergeEvents(data.events);
  invariant(events.every(event => event.profileId === expectedProfileId), 'mixed profiles in backup');
  return events;
}
