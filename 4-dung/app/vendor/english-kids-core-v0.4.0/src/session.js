import { boundedArray, GRADES, id, invariant, record, unique } from './contracts.js';
import { assertInstant, dayInZone } from './dates.js';
import { validateEvent } from './progress.js';
export function createSession({ id: sessionId, profileId, cardIds }) {
  id(sessionId, 'session ID'); id(profileId, 'profile ID');
  invariant(sessionId.length <= 88, 'session ID must leave room for an event suffix');
  boundedArray(cardIds, 'cardIds', 30).forEach(value => id(value, 'cardId'));
  invariant(cardIds.length > 0, 'session requires cards'); unique(cardIds, 'cardIds');
  return { id: sessionId, profileId, cardIds: [...cardIds], cursor: 0, status: 'active', phase: 'question', events: [] };
}
/** Returns new plain state. The UI must persist the emitted event atomically. */
export function transitionSession(state, action) {
  record(state, 'state'); record(action, 'action');
  if (action.type === 'pause' && state.status === 'active') return { ...state, status: 'paused' };
  if (action.type === 'resume' && state.status === 'paused') return { ...state, status: 'active' };
  if (action.type === 'finish' && ['active', 'paused'].includes(state.status)) return { ...state, status: 'finished' };
  if (action.type === 'answer' && state.status === 'active' && state.phase === 'question') {
    invariant(action.cardId === state.cardIds[state.cursor], 'stale answer for a different card');
    invariant(GRADES.includes(action.grade), 'unknown grade'); assertInstant(action.at);
    const event = { id: `${state.id}.${state.cursor}`, profileId: state.profileId, sessionId: state.id, cardId: action.cardId, at: action.at, day: dayInZone(action.at, action.timeZone), timeZone: action.timeZone, grade: action.grade, durationMs: action.durationMs };
    validateEvent(event);
    return { ...state, phase: 'feedback', events: [...state.events, event] };
  }
  if (action.type === 'next' && state.status === 'active' && state.phase === 'feedback') {
    const cursor = state.cursor + 1;
    return cursor === state.cardIds.length ? { ...state, status: 'finished' } : { ...state, cursor, phase: 'question' };
  }
  // Repeated button clicks, paused answers and late async events are harmless no-ops.
  invariant(['pause', 'resume', 'finish', 'answer', 'next'].includes(action.type), 'unknown session action');
  return state;
}
