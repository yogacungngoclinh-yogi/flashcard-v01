import { assertDay, addDays } from './dates.js';
import { id, integer } from './contracts.js';
import { mergeEvents, replayProgress } from './progress.js';
export function summarizeProgress(events, { profileId, today, days = 7, goalCards = 5 }) {
  id(profileId, 'profileId'); assertDay(today);
  integer(days, 1, 366, 'days'); integer(goalCards, 1, 100, 'goalCards');
  const history = mergeEvents(events).filter(event => event.profileId === profileId && event.day <= today);
  const byDay = new Map();
  for (const event of history) {
    const row = byDay.get(event.day) ?? { cards: new Set(), attempts: 0, successful: 0, durationMs: 0 };
    row.cards.add(event.cardId); row.attempts++; row.successful += event.grade === 'again' ? 0 : 1; row.durationMs += event.durationMs;
    byDay.set(event.day, row);
  }
  const active = new Set(byDay.keys());
  let cursor = active.has(today) ? today : addDays(today, -1); let streak = 0;
  while (active.has(cursor)) { streak++; cursor = addDays(cursor, -1); }
  const series = Array.from({ length: days }, (_, index) => {
    const day = addDays(today, index - days + 1); const row = byDay.get(day);
    return { day, uniqueCards: row?.cards.size ?? 0, attempts: row?.attempts ?? 0, successfulAttempts: row?.successful ?? 0, durationMs: row?.durationMs ?? 0 };
  });
  const todayRow = series[series.length - 1];
  const reviews = replayProgress(history, profileId).reviews;
  return { days: series, streakDays: streak, todayGoal: { target: goalCards, completed: todayRow.uniqueCards, reached: todayRow.uniqueCards >= goalCards }, totalCardsPracticed: reviews.length, dueCards: reviews.filter(review => review.dueDay <= today).length, practiceSuccessRate: history.length ? history.filter(event => event.grade !== 'again').length / history.length : null };
}
