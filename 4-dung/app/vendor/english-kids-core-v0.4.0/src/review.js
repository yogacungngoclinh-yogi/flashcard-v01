import { GRADES, id, integer, invariant, record } from './contracts.js';
import { addDays, assertDay } from './dates.js';
const INTERVALS = Object.freeze([0, 1, 3, 7, 14, 30, 60]);
export function validateReview(review) {
  record(review, 'review'); id(review.cardId, 'cardId'); assertDay(review.dueDay);
  if (review.lastDay !== null) assertDay(review.lastDay);
  integer(review.stage, 0, 6, 'stage'); integer(review.attempts, 0, 1000000, 'attempts');
  integer(review.lapses, 0, review.attempts, 'lapses');
  return review;
}
export function newReview(cardId, today) {
  id(cardId, 'cardId'); assertDay(today);
  return { cardId, stage: 0, attempts: 0, lapses: 0, dueDay: today, lastDay: null };
}
/** Transparent heuristic, not a clinically/educationally validated mastery score. */
export function scheduleReview(previous, grade, today) {
  validateReview(previous); assertDay(today);
  invariant(GRADES.includes(grade), 'unknown review grade');
  invariant(previous.lastDay === null || today >= previous.lastDay, 'cannot schedule before the last review day');
  // Repetition on one day cannot rapidly promote a card to a long interval.
  const advance = previous.lastDay === today && previous.stage > 0 ? 0 : (grade === 'easy' ? 2 : 1);
  const stage = grade === 'again' ? 0 : grade === 'hard' ? Math.max(1, previous.stage) : Math.min(6, previous.stage + advance);
  const intervalDays = grade === 'again' ? 0 : grade === 'hard' ? 1 : INTERVALS[stage];
  return { cardId: previous.cardId, stage, attempts: previous.attempts + 1, lapses: previous.lapses + (grade === 'again' ? 1 : 0), dueDay: addDays(today, intervalDays), lastDay: today };
}
export function isDue(review, today) {
  validateReview(review); assertDay(today);
  return review.dueDay <= today;
}
