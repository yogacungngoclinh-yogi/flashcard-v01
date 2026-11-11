// Runnable integration sketch using synthetic data only. No network or persistence.
import { catalog } from '../test/fixtures.js';
import { buildDailyPlan, createChoiceActivity, createSession, transitionSession, replayProgress, summarizeProgress } from '../src/index.js';
const today = '2026-11-08';
const plan = buildDailyPlan(catalog, { today, maxCards: 4, maxNewCards: 4, seed: 'demo-day' });
let session = createSession({ id: 'demo-session', profileId: 'demo-profile', cardIds: plan.cardOrder });
const activities = plan.cardOrder.map(cardId => createChoiceActivity(catalog, cardId, { seed: `${today}:${cardId}` }));
for (const cardId of session.cardIds) {
  session = transitionSession(session, { type: 'answer', cardId, grade: 'good', at: '2026-11-08T02:00:00.000Z', timeZone: 'Asia/Ho_Chi_Minh', durationMs: 5000 });
  session = transitionSession(session, { type: 'next' });
}
console.log(JSON.stringify({ plan, firstActivity: activities[0], completed: session.status, progress: replayProgress(session.events, session.profileId), report: summarizeProgress(session.events, { profileId: session.profileId, today, goalCards: 4 }) }, null, 2));
