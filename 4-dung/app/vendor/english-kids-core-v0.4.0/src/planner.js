import { availableLessons, validateCatalog } from './content.js';
import { assertDay } from './dates.js';
import { compareText, boundedArray, integer, invariant, unique } from './contracts.js';
import { validateReview } from './review.js';
import { shuffle } from './random.js';
/** Soft study recommendations, never locks the child out or penalizes missed days. */
export function buildDailyPlan(catalog, { today, reviews = [], completedLessonIds = [], maxCards = 10, maxNewCards = 4, seed = today } = {}) {
  validateCatalog(catalog); assertDay(today);
  integer(maxCards, 1, 30, 'maxCards'); integer(maxNewCards, 0, maxCards, 'maxNewCards');
  boundedArray(reviews, 'reviews').forEach(validateReview); unique(reviews.map(review => review.cardId), 'review card IDs');
  const cardIds = new Set(catalog.cards.map(card => card.id));
  const known = reviews.filter(review => cardIds.has(review.cardId));
  const due = known.filter(review => review.dueDay <= today).sort((a, b) => compareText(a.dueDay, b.dueDay) || a.stage - b.stage || compareText(a.cardId, b.cardId));
  const selectedReviewIds = due.slice(0, maxCards).map(review => review.cardId);
  const seen = new Set(known.map(review => review.cardId));
  const lessons = availableLessons(catalog, completedLessonIds);
  const candidates = [...new Set(lessons.flatMap(lesson => lesson.cardIds))].filter(cardId => !seen.has(cardId));
  const newCardIds = shuffle(candidates, `${seed}:new`).slice(0, Math.min(maxNewCards, maxCards - selectedReviewIds.length));
  const cardOrder = [...selectedReviewIds, ...newCardIds];
  invariant(new Set(cardOrder).size === cardOrder.length, 'plan contains duplicate cards');
  return { day: today, reviewCardIds: selectedReviewIds, newCardIds, cardOrder, remainingDue: Math.max(0, due.length - selectedReviewIds.length), lessonIds: lessons.filter(lesson => lesson.cardIds.some(cardId => newCardIds.includes(cardId))).map(lesson => lesson.id), suggestedBreakAfterMinutes: 10, emptyReason: cardOrder.length ? null : lessons.length ? 'nothing_due' : 'all_lessons_completed_or_locked' };
}
