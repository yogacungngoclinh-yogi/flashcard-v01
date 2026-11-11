/* English Kids Core v0.4.0. Generated from unchanged vendor source. See vendor README-VI.md. */
(function(root){'use strict';
const factories={"./contracts.js": function(load) {
/** Runtime contracts. No account data or child names are required. */
const VERSION = 1;
const GRADES = Object.freeze(['again', 'hard', 'good', 'easy']);
function invariant(condition, message) {
  if (!condition) throw new TypeError(message);
}
function record(value, name = 'value') {
  invariant(value !== null && typeof value === 'object' && !Array.isArray(value), `${name} must be an object`);
  const proto = Object.getPrototypeOf(value);
  invariant(proto === Object.prototype || proto === null, `${name} must be plain data`);
  return value;
}
function id(value, name = 'id') {
  invariant(typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,95}$/.test(value), `${name} must be a safe non-empty ID`);
  invariant(!['__proto__', 'prototype', 'constructor'].includes(value), `${name} is reserved`);
  return value;
}
function text(value, name = 'text', max = 1000) {
  invariant(typeof value === 'string' && value.trim().length > 0 && value.length <= max, `${name} must be non-empty text of at most ${max} characters`);
  return value;
}
function integer(value, min, max, name = 'number') {
  invariant(Number.isSafeInteger(value) && value >= min && value <= max, `${name} must be an integer from ${min} to ${max}`);
  return value;
}
function unique(values, name = 'IDs') {
  invariant(new Set(values).size === values.length, `${name} must be unique`);
}
function boundedArray(value, name, max = 10000) {
  invariant(Array.isArray(value) && value.length <= max, `${name} must be an array of at most ${max} items`);
  return value;
}

/** Locale-independent ordering for replicated event IDs and ISO timestamps. */
function compareText(a, b) { return a < b ? -1 : a > b ? 1 : 0; }

return {VERSION,GRADES,invariant,record,id,text,integer,unique,boundedArray,compareText};
},
"./dates.js": function(load) {
const { invariant, integer } = load("./contracts.js");
const DAY = 86400000;
function assertDay(value) {
  invariant(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value), 'day must be YYYY-MM-DD');
  const time = Date.parse(`${value}T00:00:00.000Z`);
  invariant(Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value, 'day must be a real calendar date');
  return value;
}
function assertInstant(value) {
  invariant(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value), 'instant must be canonical UTC ISO text');
  invariant(Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value, 'instant must be a real UTC timestamp');
  return value;
}
function addDays(day, count) {
  assertDay(day); integer(count, -365000, 365000, 'count');
  const result = new Date(Date.parse(`${day}T00:00:00Z`) + count * DAY).toISOString().slice(0, 10);
  return assertDay(result);
}
function daysBetween(start, end) {
  assertDay(start); assertDay(end);
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / DAY);
}
/** Caller must choose a time zone; local calendar days are not UTC dates. */
function dayInZone(instant, timeZone) {
  assertInstant(instant);
  invariant(typeof timeZone === 'string' && timeZone.length > 0, 'timeZone is required');
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(instant));
  const get = (type) => parts.find(part => part.type === type).value;
  return assertDay(`${get('year')}-${get('month')}-${get('day')}`);
}

return {assertDay,assertInstant,addDays,daysBetween,dayInZone};
},
"./random.js": function(load) {
const { invariant } = load("./contracts.js");
/** Deterministic content ordering, not cryptography. Never use for auth or tokens. */
function seededRandom(seed) {
  invariant(typeof seed === 'string' && seed.length > 0, 'seed must be non-empty text');
  let state = 2166136261;
  for (const char of seed) state = Math.imul(state ^ char.codePointAt(0), 16777619) >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(items, seed) {
  invariant(Array.isArray(items), 'items must be an array');
  const result = [...items];
  const rng = seededRandom(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

return {seededRandom,shuffle};
},
"./answers.js": function(load) {
const { invariant, text } = load("./contracts.js");
/** Preserve Vietnamese accents by default: 'ma', 'má', 'mà' are not the same. */
function normalizeAnswer(value, { locale = 'en', ignorePunctuation = true } = {}) {
  invariant(typeof value === 'string' && value.length <= 2000, 'answer must be text of at most 2000 characters');
  invariant(['en', 'vi'].includes(locale), 'locale must be en or vi');
  let result = value.normalize('NFC').toLocaleLowerCase(locale).trim().replace(/\s+/gu, ' ');
  if (ignorePunctuation) result = result.replace(/[.!?,;:]+$/gu, '').trim();
  return result;
}
function checkAnswer(answer, accepted, options = {}) {
  invariant(Array.isArray(accepted) && accepted.length > 0 && accepted.length <= 30, 'accepted answers must contain 1–30 entries');
  const normalized = normalizeAnswer(answer, options);
  const valid = accepted.map((value) => normalizeAnswer(text(value, 'accepted answer', 2000), options));
  invariant(valid.every(Boolean), 'accepted answers cannot be punctuation only');
  return { correct: normalized.length > 0 && valid.includes(normalized), normalized };
}

return {normalizeAnswer,checkAnswer};
},
"./content.js": function(load) {
const { boundedArray, id, integer, invariant, record, text, unique, VERSION } = load("./contracts.js");
function validateCatalog(catalog) {
  record(catalog, 'catalog');
  invariant(catalog.schemaVersion === VERSION, 'unsupported catalog schemaVersion');
  const cards = boundedArray(catalog.cards, 'cards');
  const lessons = boundedArray(catalog.lessons, 'lessons', 2000);
  invariant(cards.length > 0, 'catalog requires at least one card');
  const cardIds = cards.map((card) => {
    record(card, 'card'); id(card.id); id(card.topicId, 'topicId');
    text(card.en, 'English label', 200); text(card.vi, 'Vietnamese label', 200);
    integer(card.level, 1, 10, 'level');
    if (card.imageId != null) id(card.imageId, 'imageId');
    if (card.audioId != null) id(card.audioId, 'audioId');
    if (card.acceptedAnswers != null) {
      boundedArray(card.acceptedAnswers, 'acceptedAnswers', 30).forEach(value => text(value, 'accepted answer', 200));
    }
    return card.id;
  });
  unique(cardIds, 'card IDs');
  const knownCards = new Set(cardIds);
  const lessonIds = lessons.map((lesson) => {
    record(lesson, 'lesson'); id(lesson.id); text(lesson.title, 'lesson title', 200);
    integer(lesson.estimatedMinutes, 1, 60, 'estimatedMinutes');
    boundedArray(lesson.cardIds, 'lesson card IDs', 100).forEach(cardId => invariant(knownCards.has(cardId), `unknown card ${cardId}`));
    invariant(lesson.cardIds.length > 0, 'lesson must contain cards'); unique(lesson.cardIds, 'lesson card IDs');
    boundedArray(lesson.prerequisiteIds ?? [], 'prerequisites', 100).forEach(value => id(value, 'prerequisite ID'));
    unique(lesson.prerequisiteIds ?? [], 'prerequisite IDs');
    return lesson.id;
  });
  unique(lessonIds, 'lesson IDs');
  const byId = new Map(lessons.map(lesson => [lesson.id, lesson]));
  const visiting = new Set(); const visited = new Set();
  function visit(lessonId) {
    invariant(!visiting.has(lessonId), 'lesson prerequisites contain a cycle');
    if (visited.has(lessonId)) return;
    invariant(byId.has(lessonId), `unknown prerequisite ${lessonId}`);
    visiting.add(lessonId);
    for (const prerequisiteId of byId.get(lessonId).prerequisiteIds ?? []) visit(prerequisiteId);
    visiting.delete(lessonId); visited.add(lessonId);
  }
  for (const lessonId of lessonIds) visit(lessonId);
  return catalog;
}
function availableLessons(catalog, completedLessonIds = []) {
  validateCatalog(catalog);
  boundedArray(completedLessonIds, 'completedLessonIds');
  const completed = new Set(completedLessonIds);
  return catalog.lessons.filter(lesson => !completed.has(lesson.id) && (lesson.prerequisiteIds ?? []).every(value => completed.has(value)));
}

return {validateCatalog,availableLessons};
},
"./review.js": function(load) {
const { GRADES, id, integer, invariant, record } = load("./contracts.js");
const { addDays, assertDay } = load("./dates.js");
const INTERVALS = Object.freeze([0, 1, 3, 7, 14, 30, 60]);
function validateReview(review) {
  record(review, 'review'); id(review.cardId, 'cardId'); assertDay(review.dueDay);
  if (review.lastDay !== null) assertDay(review.lastDay);
  integer(review.stage, 0, 6, 'stage'); integer(review.attempts, 0, 1000000, 'attempts');
  integer(review.lapses, 0, review.attempts, 'lapses');
  return review;
}
function newReview(cardId, today) {
  id(cardId, 'cardId'); assertDay(today);
  return { cardId, stage: 0, attempts: 0, lapses: 0, dueDay: today, lastDay: null };
}
/** Transparent heuristic, not a clinically/educationally validated mastery score. */
function scheduleReview(previous, grade, today) {
  validateReview(previous); assertDay(today);
  invariant(GRADES.includes(grade), 'unknown review grade');
  invariant(previous.lastDay === null || today >= previous.lastDay, 'cannot schedule before the last review day');
  // Repetition on one day cannot rapidly promote a card to a long interval.
  const advance = previous.lastDay === today && previous.stage > 0 ? 0 : (grade === 'easy' ? 2 : 1);
  const stage = grade === 'again' ? 0 : grade === 'hard' ? Math.max(1, previous.stage) : Math.min(6, previous.stage + advance);
  const intervalDays = grade === 'again' ? 0 : grade === 'hard' ? 1 : INTERVALS[stage];
  return { cardId: previous.cardId, stage, attempts: previous.attempts + 1, lapses: previous.lapses + (grade === 'again' ? 1 : 0), dueDay: addDays(today, intervalDays), lastDay: today };
}
function isDue(review, today) {
  validateReview(review); assertDay(today);
  return review.dueDay <= today;
}

return {validateReview,newReview,scheduleReview,isDue};
},
"./activities.js": function(load) {
const { id, integer, invariant } = load("./contracts.js");
const { normalizeAnswer } = load("./answers.js");
const { validateCatalog } = load("./content.js");
const { shuffle } = load("./random.js");
function createChoiceActivity(catalog, cardId, { language = 'en', count = 4, seed = cardId } = {}) {
  validateCatalog(catalog); id(cardId); integer(count, 2, 6, 'choice count');
  invariant(['en', 'vi'].includes(language), 'language must be en or vi');
  const target = catalog.cards.find(card => card.id === cardId);
  invariant(target, 'target card does not exist');
  const seen = new Set([normalizeAnswer(target[language], { locale: language })]);
  const pool = shuffle(catalog.cards.filter(card => card.id !== cardId), seed).filter(card => {
    const label = normalizeAnswer(card[language], { locale: language });
    if (seen.has(label)) return false;
    seen.add(label); return true;
  });
  // Match level/topic first without allowing ambiguous duplicate labels.
  pool.sort((a, b) => Number(b.topicId === target.topicId) - Number(a.topicId === target.topicId) || Math.abs(a.level - target.level) - Math.abs(b.level - target.level));
  invariant(pool.length >= count - 1, 'not enough distinct answers for this choice count');
  const options = shuffle([target, ...pool.slice(0, count - 1)], `${seed}:options`).map(card => ({ id: card.id, label: card[language] }));
  return { type: 'choice', cardId, language, prompt: target[language === 'en' ? 'vi' : 'en'], imageId: target.imageId ?? null, options, correctOptionId: cardId };
}
function createMatchingActivity(catalog, cardIds, seed = 'matching') {
  validateCatalog(catalog);
  invariant(Array.isArray(cardIds) && cardIds.length >= 2 && cardIds.length <= 8 && new Set(cardIds).size === cardIds.length, 'matching requires 2–8 unique card IDs');
  const cards = cardIds.map(cardId => {
    const card = catalog.cards.find(item => item.id === cardId);
    invariant(card, `unknown card ${cardId}`); return card;
  });
  for (const language of ['en', 'vi']) invariant(new Set(cards.map(card => normalizeAnswer(card[language], { locale: language }))).size === cards.length, 'matching labels must be distinct');
  return { type: 'matching', left: shuffle(cards, `${seed}:left`).map(card => ({ id: card.id, label: card.en })), right: shuffle(cards, `${seed}:right`).map(card => ({ id: card.id, label: card.vi })) };
}

return {createChoiceActivity,createMatchingActivity};
},
"./progress.js": function(load) {
const { compareText, boundedArray, GRADES, id, integer, invariant, record, VERSION } = load("./contracts.js");
const { assertDay, assertInstant, dayInZone } = load("./dates.js");
const { newReview, scheduleReview } = load("./review.js");
const MAX_EVENTS = 50000;
function validateEvent(event) {
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
function mergeEvents(...lists) {
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
function replayProgress(events, profileId) {
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
function exportProgress(events, profileId) {
  id(profileId, 'profileId');
  return JSON.stringify({ schemaVersion: VERSION, profileId, events: mergeEvents(events).filter(event => event.profileId === profileId) }, null, 2);
}
function importProgress(serialized, expectedProfileId) {
  id(expectedProfileId, 'expectedProfileId');
  invariant(typeof serialized === 'string' && serialized.length <= 20000000, 'backup must be text no larger than 20 million characters');
  const data = record(JSON.parse(serialized), 'backup');
  invariant(data.schemaVersion === VERSION, 'unsupported progress schemaVersion');
  invariant(data.profileId === expectedProfileId, 'backup belongs to a different profile');
  const events = mergeEvents(data.events);
  invariant(events.every(event => event.profileId === expectedProfileId), 'mixed profiles in backup');
  return events;
}

return {validateEvent,mergeEvents,replayProgress,exportProgress,importProgress};
},
"./planner.js": function(load) {
const { availableLessons, validateCatalog } = load("./content.js");
const { assertDay } = load("./dates.js");
const { compareText, boundedArray, integer, invariant, unique } = load("./contracts.js");
const { validateReview } = load("./review.js");
const { shuffle } = load("./random.js");
/** Soft study recommendations, never locks the child out or penalizes missed days. */
function buildDailyPlan(catalog, { today, reviews = [], completedLessonIds = [], maxCards = 10, maxNewCards = 4, seed = today } = {}) {
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

return {buildDailyPlan};
},
"./session.js": function(load) {
const { boundedArray, GRADES, id, invariant, record, unique } = load("./contracts.js");
const { assertInstant, dayInZone } = load("./dates.js");
const { validateEvent } = load("./progress.js");
function createSession({ id: sessionId, profileId, cardIds }) {
  id(sessionId, 'session ID'); id(profileId, 'profile ID');
  invariant(sessionId.length <= 88, 'session ID must leave room for an event suffix');
  boundedArray(cardIds, 'cardIds', 30).forEach(value => id(value, 'cardId'));
  invariant(cardIds.length > 0, 'session requires cards'); unique(cardIds, 'cardIds');
  return { id: sessionId, profileId, cardIds: [...cardIds], cursor: 0, status: 'active', phase: 'question', events: [] };
}
/** Returns new plain state. The UI must persist the emitted event atomically. */
function transitionSession(state, action) {
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

return {createSession,transitionSession};
},
"./reports.js": function(load) {
const { assertDay, addDays } = load("./dates.js");
const { id, integer } = load("./contracts.js");
const { mergeEvents, replayProgress } = load("./progress.js");
function summarizeProgress(events, { profileId, today, days = 7, goalCards = 5 }) {
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

return {summarizeProgress};
},
"./assets.js": function(load) {
const { validateCatalog } = load("./content.js");
const { boundedArray, id, invariant, record, text, unique, VERSION } = load("./contracts.js");
/** Only content-relative paths. Origin selection remains the host app's job. */
function safeAssetPath(path) {
  text(path, 'asset path', 500);
  invariant(!/[\\?#%\s:\u0000-\u001f\u007f]/u.test(path) && !path.startsWith('/'), 'asset path must be relative and unencoded');
  invariant(path.split('/').every(part => /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(part) && part !== '.' && part !== '..'), 'invalid asset path segment');
  invariant(/\.(png|jpg|jpeg|webp|avif|svg|mp3|ogg|wav|m4a)$/i.test(path), 'unsupported asset extension');
  return path;
}
function validateAssetManifest(manifest) {
  record(manifest, 'manifest'); invariant(manifest.schemaVersion === VERSION, 'unsupported asset schemaVersion');
  boundedArray(manifest.assets, 'assets', 30000).forEach(asset => {
    record(asset, 'asset'); id(asset.id, 'asset ID'); safeAssetPath(asset.path);
    invariant(['image', 'audio'].includes(asset.type), 'asset type must be image or audio');
    if (asset.type === 'image') { text(asset.altEn, 'altEn', 500); text(asset.altVi, 'altVi', 500); }
    invariant(typeof asset.sha256 === 'string' && /^[a-f0-9]{64}$/.test(asset.sha256), 'sha256 must be lowercase hex');
    if (asset.type === 'image') invariant(/\.(png|jpg|jpeg|webp|avif|svg)$/i.test(asset.path), 'image file type mismatch');
    if (asset.type === 'audio') invariant(/\.(mp3|ogg|wav|m4a)$/i.test(asset.path), 'audio file type mismatch');
  });
  unique(manifest.assets.map(asset => asset.id), 'asset IDs');
  unique(manifest.assets.map(asset => asset.path.toLowerCase()), 'asset paths on case-insensitive filesystems');
  return manifest;
}
function auditContentAssets(catalog, manifest) {
  validateCatalog(catalog); validateAssetManifest(manifest);
  const assets = new Map(manifest.assets.map(asset => [asset.id, asset]));
  const missing = []; const wrongTypes = [];
  for (const card of catalog.cards) for (const [field, type] of [['imageId', 'image'], ['audioId', 'audio']]) {
    if (card[field] == null) continue;
    const asset = assets.get(card[field]);
    if (!asset) missing.push({ cardId: card.id, assetId: card[field], type });
    else if (asset.type !== type) wrongTypes.push({ cardId: card.id, assetId: card[field], expected: type, actual: asset.type });
  }
  return { ok: missing.length === 0 && wrongTypes.length === 0, missing, wrongTypes };
}

return {safeAssetPath,validateAssetManifest,auditContentAssets};
},
"./layout.js": function(load) {
const { invariant } = load("./contracts.js");
/** Advisory values only. Final host layout still needs real browser/device QA. */
function layoutHints({ width, fontScale = 1, reducedMotion = false, coarsePointer = true }) {
  invariant(Number.isFinite(width) && width > 0, 'width must be positive');
  invariant(Number.isFinite(fontScale) && fontScale >= 1 && fontScale <= 4, 'fontScale must be from 1 to 4');
  invariant(typeof reducedMotion === 'boolean' && typeof coarsePointer === 'boolean', 'input preferences must be booleans');
  const gap = 16; const padding = width < 360 ? 12 : 24;
  const minCard = 160 * fontScale;
  const columns = Math.max(1, Math.min(5, Math.floor((width - padding * 2 + gap) / (minCard + gap))));
  return { columns, gap, padding, minimumTargetPx: coarsePointer ? 48 : 44, animationDurationMs: reducedMotion ? 0 : 160, maxContentWidth: 1280, preferStackedControls: width / fontScale < 600 };
}

return {layoutHints};
},
"./chapter-review.js": function(load) {
const { boundedArray, compareText, id, integer, invariant, record, text, unique, VERSION } = load("./contracts.js");
const { validateCatalog } = load("./content.js");
const { validateReview } = load("./review.js");
const { createChoiceActivity } = load("./activities.js");
const { checkAnswer, normalizeAnswer } = load("./answers.js");
const { assertInstant, dayInZone } = load("./dates.js");
const { validateEvent } = load("./progress.js");
const { shuffle } = load("./random.js");

/** Chapter metadata is separate so the existing app's catalog need not change. */
function validateChapter(catalog, chapter) {
  validateCatalog(catalog); record(chapter, 'chapter'); id(chapter.id, 'chapter ID'); text(chapter.title, 'chapter title', 200);
  boundedArray(chapter.lessonIds, 'chapter lesson IDs', 100).forEach(value => id(value, 'lesson ID'));
  invariant(chapter.lessonIds.length > 0, 'chapter must contain at least one lesson'); unique(chapter.lessonIds, 'chapter lesson IDs');
  const lessons = new Map(catalog.lessons.map(lesson => [lesson.id, lesson]));
  chapter.lessonIds.forEach(lessonId => invariant(lessons.has(lessonId), `unknown chapter lesson ${lessonId}`));
  const allowedCards = new Set(chapter.lessonIds.flatMap(lessonId => lessons.get(lessonId).cardIds));
  const authored = boundedArray(chapter.reviewItems ?? [], 'authored review items', 100);
  unique(authored.map(item => item.id), 'authored review item IDs');
  for (const item of authored) {
    record(item, 'review item'); id(item.id, 'review item ID');
    invariant(allowedCards.has(item.cardId), 'authored question card must belong to this chapter');
    invariant(['context', 'order', 'application'].includes(item.type), 'unknown authored question type');
    text(item.prompt, 'question prompt', 1000); text(item.instructionVi, 'question instruction', 500);
    invariant(['en', 'vi'].includes(item.language), 'question language must be en or vi');
    if (item.hint != null) text(item.hint, 'question hint', 500);
    if (item.explanationVi != null) text(item.explanationVi, 'question explanation', 1000);
    if (item.type === 'context') {
      boundedArray(item.options, 'context options', 6); invariant(item.options.length >= 2, 'context needs at least two options');
      item.options.forEach(option => { id(option.id, 'option ID'); text(option.label, 'option label', 200); });
      unique(item.options.map(option => option.id), 'context option IDs');
      unique(item.options.map(option => normalizeAnswer(option.label, { locale: item.language })), 'context option labels');
      invariant(item.options.some(option => option.id === item.correctOptionId), 'context answer must be one of the options');
    } else if (item.type === 'order') {
      boundedArray(item.tokens, 'order tokens', 12); invariant(item.tokens.length >= 2, 'order question needs at least two tokens');
      item.tokens.forEach(token => { id(token.id, 'token ID'); text(token.text, 'token text', 100); });
      unique(item.tokens.map(token => token.id), 'token IDs');
      boundedArray(item.expectedTokenIds, 'expected token IDs', 12); unique(item.expectedTokenIds, 'expected token IDs');
      invariant(item.expectedTokenIds.length === item.tokens.length && item.expectedTokenIds.every(value => item.tokens.some(token => token.id === value)), 'expected order must include every token exactly once');
    } else if (item.assessment === 'adult_observation') {
      invariant(item.acceptedAnswers == null, 'adult observation cannot have exact-answer keys');
    } else {
      invariant(item.assessment === 'exact', 'application must explicitly choose exact or adult_observation assessment');
      boundedArray(item.acceptedAnswers, 'application answers', 30); invariant(item.acceptedAnswers.length > 0, 'application needs accepted answers');
      item.acceptedAnswers.forEach(value => invariant(normalizeAnswer(text(value, 'accepted answer', 200), { locale: item.language }).length > 0, 'accepted answer cannot be punctuation only'));
    }
  }
  return chapter;
}
function chapterReviewReadiness(catalog, chapter, completedLessonIds = []) {
  validateChapter(catalog, chapter); boundedArray(completedLessonIds, 'completedLessonIds').forEach(value => id(value, 'completed lesson ID'));
  const completed = new Set(completedLessonIds);
  const missingLessonIds = chapter.lessonIds.filter(lessonId => !completed.has(lessonId));
  return { ready: missingLessonIds.length === 0, completedLessons: chapter.lessonIds.length - missingLessonIds.length, totalLessons: chapter.lessonIds.length, missingLessonIds };
}
function chapterCards(catalog, chapter) {
  const lessonMap = new Map(catalog.lessons.map(lesson => [lesson.id, lesson]));
  const ids = [...new Set(chapter.lessonIds.flatMap(lessonId => lessonMap.get(lessonId).cardIds))];
  const cardMap = new Map(catalog.cards.map(card => [card.id, card]));
  return ids.map(cardId => cardMap.get(cardId));
}
/** Prioritize only the selected chapter. Variety is deterministic; no timers or penalties. */
function buildChapterQuickReview(catalog, chapter, { reviews = [], completedLessonIds = [], introducedCardIds, questionCount = 5, focusCount = 4, seed = chapter?.id } = {}) {
  validateChapter(catalog, chapter); text(seed, 'review seed', 200); integer(questionCount, 1, 12, 'questionCount'); integer(focusCount, 1, 6, 'focusCount');
  boundedArray(reviews, 'reviews').forEach(validateReview); unique(reviews.map(review => review.cardId), 'review card IDs');
  const reviewMap = new Map(reviews.map(review => [review.cardId, review]));
  const allCards = chapterCards(catalog, chapter);
  const completed = new Set(completedLessonIds);
  if (introducedCardIds !== undefined) boundedArray(introducedCardIds, 'introduced card IDs').forEach(value => id(value, 'introduced card ID'));
  const introduced = new Set(introducedCardIds ?? [...catalog.lessons.filter(lesson => completed.has(lesson.id)).flatMap(lesson => lesson.cardIds), ...reviews.filter(review => review.attempts > 0).map(review => review.cardId)]);
  const cards = allCards.filter(card => introduced.has(card.id));
  invariant(cards.length > 0, 'chapter review needs introduced cards; pass explicit introducedCardIds or completed lesson history');
  const candidates = shuffle(cards, `${seed}:cards`);
  const priority = card => {
    const review = reviewMap.get(card.id);
    if (!review || review.attempts === 0) return 2;
    if (review.stage === 0) return 0;
    if (review.lapses > 0 && review.stage <= 2) return 1;
    return 3;
  };
  candidates.sort((a, b) => priority(a) - priority(b) || (reviewMap.get(a.id)?.stage ?? 0) - (reviewMap.get(b.id)?.stage ?? 0));
  const authoredItems = (chapter.reviewItems ?? []).filter(item => introduced.has(item.cardId));
  const intendedPattern = ['recognition', 'recognition', 'context', 'order', 'application'];
  const authoredTypes = new Set(authoredItems.map(item => item.type));
  const missingAuthoredTypes = ['context', 'order', 'application'].filter(type => !authoredTypes.has(type));
  const selected = candidates.slice(0, questionCount);
  // Five-question shape is possible even for a short chapter when all authored types exist.
  if (questionCount >= 5 && missingAuthoredTypes.length === 0) while (selected.length < 5) selected.push(candidates[selected.length % candidates.length]);
  const localCatalog = { schemaVersion: VERSION, cards, lessons: [] };
  const questions = selected.map((card, index) => {
    const intendedType = intendedPattern[index] ?? 'recognition';
    const authored = authoredItems.find(item => item.type === intendedType);
    const questionId = `q${index + 1}`;
    if (authored) return { ...structuredClone(authored), authoredItemId: authored.id, id: questionId, hideLearningLabel: true, tokens: authored.tokens ? shuffle(authored.tokens, `${seed}:${questionId}:tokens`) : undefined, options: authored.options ? shuffle(authored.options, `${seed}:${questionId}:options`) : undefined };
    const direction = index === 1 ? 'vi' : 'en';
    const distinct = new Set(cards.map(item => normalizeAnswer(item[direction], { locale: direction }))).size;
    if (intendedType === 'recognition' && distinct >= 2) {
      const activity = createChoiceActivity(localCatalog, card.id, { language: direction, count: Math.min(4, distinct), seed: `${seed}:${questionId}` });
      return { ...activity, id: questionId, intendedType, hideLearningLabel: true, instructionVi: direction === 'en' ? 'Chọn từ tiếng Anh đúng nhé.' : 'Chọn nghĩa tiếng Việt đúng nhé.' };
    }
    return { id: questionId, intendedType, hideLearningLabel: true, type: 'recall', cardId: card.id, language: 'en', prompt: card.vi, imageId: card.imageId ?? null, instructionVi: 'Em nhớ từ tiếng Anh nào?', acceptedAnswers: [card.en, ...(card.acceptedAnswers ?? [])] };
  });
  const focusCards = candidates.slice(0, focusCount).map(card => ({ cardId: card.id, en: card.en, vi: card.vi, imageId: card.imageId ?? null, audioId: card.audioId ?? null, reason: priority(card) <= 1 ? 'practice-again' : priority(card) === 2 ? 'not-practiced' : 'chapter-recap' }));
  const chapterCardIds = new Set(cards.map(card => card.id));
  const recipe = { questionCount, focusCount, seed, completedLessonIds: [...completedLessonIds], introducedCardIds: cards.map(card => card.id), reviews: reviews.filter(review => chapterCardIds.has(review.cardId)).map(({ cardId, stage, attempts, lapses, dueDay, lastDay }) => ({ cardId, stage, attempts, lapses, dueDay, lastDay })) };
  return { schemaVersion: VERSION, recipe, chapterId: chapter.id, title: chapter.title, readiness: chapterReviewReadiness(catalog, chapter, completedLessonIds), focusCards, questions, initialQuestionCount: questions.length, maximumQuestionCount: questions.length * 2, suggestedMinutes: Math.max(2, Math.min(8, Math.ceil(questions.length * 0.5))), retryLimitPerQuestion: 1, intendedPattern, missingAuthoredTypes, completeFiveStepPattern: questions.length === 5 && questions.map(question => question.type).join(',') === 'choice,choice,context,order,application', timed: false };
}
/** UI/audio intent only. Host must provide actual animation/audio implementations. */
function chapterFeedbackCue({ correct, reducedMotion = false, soundEnabled = true, soundAvailable = false, isRetry = false }) {
  invariant([correct, reducedMotion, soundEnabled, soundAvailable, isRetry].every(value => typeof value === 'boolean'), 'feedback preferences must be booleans');
  return {
    tone: correct ? 'celebrate' : 'encourage',
    messageVi: correct ? (isRetry ? 'Em nhớ được rồi! Giỏi lắm.' : 'Đúng rồi! Em làm tốt lắm.') : 'Mình xem lại đáp án rồi thử thêm một lần nhé.',
    messageEn: correct ? (isRetry ? 'You remembered it! Well done.' : 'That is right! Well done.') : 'Let us look at the answer and try once more.',
    visualCue: correct ? 'small-sparkle' : 'friendly-hint',
    animation: reducedMotion ? 'none' : correct ? 'gentle-pop' : 'gentle-highlight',
    animationDurationMs: reducedMotion ? 0 : 180,
    soundCue: soundEnabled && soundAvailable ? (correct ? 'soft-success' : 'soft-hint') : null,
    requiresLiveAnnouncement: true
  };
}
function createChapterReviewSession(plan, { sessionId, profileId, mode = 'chapter-end' }) {
  record(plan, 'plan'); invariant(plan.schemaVersion === VERSION, 'unsupported chapter review plan');
  id(sessionId, 'session ID'); id(profileId, 'profile ID'); invariant(sessionId.length <= 80, 'session ID must leave room for question suffixes');
  invariant(['chapter-end', 'practice'].includes(mode), 'mode must be chapter-end or practice');
  invariant(mode === 'practice' || plan.readiness.ready, 'finish the chapter lessons before starting chapter-end review, or choose practice mode');
  invariant(Array.isArray(plan.questions) && plan.questions.length >= 1 && plan.questions.length <= 12, 'plan must contain 1–12 questions');
  // Only consume plans made by buildChapterQuickReview inside the host trust boundary.
  return { schemaVersion: VERSION, sessionId, profileId, mode, plan, queue: plan.questions.map(question => ({ ...question, isRetry: false, originalQuestionId: question.id })), cursor: 0, status: 'active', phase: 'focus', hintUsed: false, visibleHint: null, attempts: [], events: [], feedback: null, result: null, journal: [] };
}
function currentQuestion(state) { return state.queue[state.cursor]; }
function evaluate(question, response) {
  if (['choice', 'context'].includes(question.type)) {
    invariant(typeof response === 'string' && question.options.some(option => option.id === response), 'response must be a displayed option ID');
    return response === question.correctOptionId;
  }
  if (question.type === 'order') {
    boundedArray(response, 'ordered token IDs', 12); unique(response, 'ordered token IDs');
    invariant(response.length === question.tokens.length && response.every(value => question.tokens.some(token => token.id === value)), 'response must include every displayed token exactly once');
    return response.every((value, index) => value === question.expectedTokenIds[index]);
  }
  invariant(['recall', 'application'].includes(question.type), 'unknown question type');
  return checkAnswer(response, question.acceptedAnswers, { locale: question.language }).correct;
}
function answerText(question) {
  if (['choice', 'context'].includes(question.type)) return question.options.find(option => option.id === question.correctOptionId).label;
  if (question.type === 'order') return question.expectedTokenIds.map(value => question.tokens.find(token => token.id === value).text).join(' ');
  return question.acceptedAnswers[0];
}
function dedupeQuestionIds(attempts) { return [...new Set(attempts.map(attempt => attempt.originalQuestionId))].sort(compareText); }
function summarizeChapterReview(state) {
  record(state, 'state');
  const first = state.attempts.filter(attempt => !attempt.isRetry && attempt.assessed);
  const firstCorrect = first.filter(attempt => attempt.correct).length;
  const last = new Map();
  state.attempts.filter(attempt => attempt.assessed).forEach(attempt => last.set(attempt.originalQuestionId, attempt));
  const practiceAgainCardIds = [...new Set([...last.values()].filter(attempt => attempt.assessed && !attempt.correct).map(attempt => attempt.cardId).filter(Boolean))].sort(compareText);
  const deferredCardIds = [...new Set(state.attempts.filter(attempt => attempt.skipped || attempt.observation === 'defer').map(attempt => attempt.cardId).filter(Boolean))].sort(compareText);
  const observations = state.attempts.filter(attempt => attempt.observation).map(({ cardId, questionId, observation }) => ({ cardId, questionId, observation }));
  const recoveredCardIds = [...new Set(state.attempts.filter(attempt => attempt.isRetry && attempt.correct).map(attempt => attempt.cardId).filter(Boolean))].sort(compareText);
  const reviewCompleted = state.status === 'completed';
  const unassisted = first.filter(attempt => !attempt.usedHint);
  const assisted = first.filter(attempt => attempt.usedHint);
  return { chapterId: state.plan.chapterId, sessionId: state.sessionId, reviewCompleted, mode: state.mode, firstPassAnswered: first.length, firstPassTotal: state.plan.questions.length, firstPassCorrect: firstCorrect, firstPassAccuracy: first.length ? firstCorrect / first.length : null, unassistedFirstPass: { answered: unassisted.length, correct: unassisted.filter(attempt => attempt.correct).length }, assistedFirstPass: { answered: assisted.length, correct: assisted.filter(attempt => attempt.correct).length }, totalAttempts: state.attempts.filter(attempt => attempt.assessed).length, roundsCompleted: state.attempts.length, skippedRounds: state.attempts.filter(attempt => attempt.skipped).length, deferredCardIds, observations, assistedAttempts: state.attempts.filter(attempt => attempt.assessed && attempt.usedHint).length, unassistedAttempts: state.attempts.filter(attempt => attempt.assessed && !attempt.usedHint).length, recoveredCardIds, practiceAgainCardIds, deferredQuestionIds: dedupeQuestionIds(state.attempts.filter(attempt => attempt.skipped || attempt.observation === 'defer')), recoveredQuestionIds: dedupeQuestionIds(state.attempts.filter(attempt => attempt.isRetry && attempt.correct)), durationMs: state.attempts.reduce((sum, attempt) => sum + (attempt.durationMs ?? 0), 0), practiceAgainQuestionIds: [...last.values()].filter(attempt => !attempt.correct).map(attempt => attempt.originalQuestionId).sort(compareText), completionKey: reviewCompleted ? `${state.sessionId}:chapter-review` : null, messageVi: reviewCompleted && first.length === 0 ? 'Đã kết thúc lượt ôn. Em có thể quay lại các câu đã để dành sau nhé.' : reviewCompleted ? ([...last.values()].some(attempt => !attempt.correct) ? 'Em đã ôn xong! Mình có vài câu để luyện thêm lần sau.' : 'Em đã ôn xong chương này. Nghỉ một chút nhé!') : 'Phần ôn chưa hoàn thành. Em có thể quay lại sau.' };
}
/** Valid inputs are state from createChapterReviewSession and host-generated actions. */
function reduceChapterReview(state, action) {
  record(state, 'state'); record(action, 'action');
  invariant(['begin', 'answer', 'hint', 'observe', 'skip', 'next', 'pause', 'resume', 'exit'].includes(action.type), 'unknown chapter review action');
  if (['completed', 'exited'].includes(state.status)) return state;
  if (action.type === 'pause' && state.status === 'active') return { ...state, status: 'paused' };
  if (action.type === 'resume' && state.status === 'paused') return { ...state, status: 'active' };
  if (action.type === 'exit') { const next = { ...state, status: 'exited' }; return { ...next, result: summarizeChapterReview(next) }; }
  if (state.status !== 'active') return state;
  if (action.type === 'begin' && state.phase === 'focus') return { ...state, phase: 'question' };
  if (action.type === 'hint' && state.phase === 'question') {
    const question = currentQuestion(state);
    invariant(action.questionId === question.id, 'stale hint for a different chapter question');
    return { ...state, hintUsed: true, visibleHint: question.hint ?? (question.assessment === 'adult_observation' ? 'Em có thể nhờ người lớn cùng thực hành.' : `Mình cùng nhớ lại: ${answerText(question)}`) };
  }
  if (['skip', 'observe'].includes(action.type) && state.phase === 'question') {
    const question = currentQuestion(state);
    invariant(action.questionId === question.id, 'stale observation or skip for a different question');
    if (action.type === 'observe') {
      invariant(question.assessment === 'adult_observation', 'observation is only for an adult-observed task');
      invariant(['independent', 'supported', 'defer'].includes(action.observation), 'unknown adult observation');
    }
    const attempt = { questionId: question.id, originalQuestionId: question.originalQuestionId, cardId: question.cardId, correct: null, assessed: false, skipped: action.type === 'skip', observation: action.type === 'observe' ? action.observation : null, isRetry: question.isRetry, usedHint: state.hintUsed };
    return { ...state, phase: 'feedback', feedback: { tone: 'encourage', messageVi: action.type === 'skip' ? 'Mình để dành câu này cho lần sau nhé.' : 'Đã ghi nhận quan sát của người lớn. Cùng tiếp tục nhé.', correct: null, answer: null, soundCue: null, animation: 'none', requiresLiveAnnouncement: true, retryScheduled: false }, attempts: [...state.attempts, attempt] };
  }
  if (action.type === 'answer' && state.phase === 'question') {
    const question = currentQuestion(state);
    invariant(action.questionId === question.id, 'stale answer for a different chapter question');
    assertInstant(action.at); integer(action.durationMs, 0, 600000, 'durationMs');
    invariant(question.assessment !== 'adult_observation', 'open or spoken tasks require adult observation, not automatic grading');
    const correct = evaluate(question, action.response);
    const event = { id: `${state.sessionId}.${question.id}`, profileId: state.profileId, sessionId: state.sessionId, cardId: question.cardId, at: action.at, day: dayInZone(action.at, action.timeZone), timeZone: action.timeZone, grade: correct ? (state.hintUsed ? 'hard' : 'good') : 'again', durationMs: action.durationMs };
    if (question.cardId) validateEvent(event);
    else invariant(question.assessmentScope === 'question', 'questions without card IDs must explicitly use question-only assessment');
    const lastTimedAttempt = [...state.attempts].reverse().find(attempt => attempt.at);
    invariant(!lastTimedAttempt || action.at >= lastTimedAttempt.at, 'event timestamps must be nondecreasing within a review session');
    const queue = !correct && !question.isRetry ? [...state.queue, { ...question, id: `${question.originalQuestionId}.retry`, isRetry: true }] : state.queue;
    const feedback = { ...chapterFeedbackCue({ correct, reducedMotion: action.reducedMotion ?? false, soundEnabled: action.soundEnabled ?? true, soundAvailable: action.soundAvailable ?? false, isRetry: question.isRetry }), correct, answer: answerText(question), explanationVi: question.explanationVi ?? (correct ? `Đáp án là: ${answerText(question)}.` : `Đáp án đúng là: ${answerText(question)}. Em xem lại nhé.`), retryScheduled: !correct && !question.isRetry };
    if (!correct && question.isRetry) {
      feedback.messageVi = 'Mình đã xem lại từ này. Em có thể luyện thêm vào lần sau nhé.';
      feedback.messageEn = 'We reviewed this word. You can practice it again next time.';
    }
    const attempt = { questionId: question.id, originalQuestionId: question.originalQuestionId, cardId: question.cardId, correct, assessed: true, skipped: false, isRetry: question.isRetry, usedHint: state.hintUsed, at: action.at, timeZone: action.timeZone, day: event.day, durationMs: action.durationMs };
    return { ...state, queue, phase: 'feedback', feedback, attempts: [...state.attempts, attempt], events: question.cardId ? [...state.events, event] : state.events };
  }
  if (action.type === 'next' && state.phase === 'feedback') {
    if (state.cursor + 1 < state.queue.length) return { ...state, cursor: state.cursor + 1, phase: 'question', hintUsed: false, visibleHint: null, feedback: null };
    const next = { ...state, status: 'completed', phase: 'summary', feedback: null };
    return { ...next, result: summarizeChapterReview(next) };
  }
  return state;
}

/** Safe display DTO: does not expose correct-answer keys until feedback/hint is requested. */
function chapterQuestionView(state) {
  record(state, 'state');
  if (state.phase === 'focus') return { phase: 'focus', focusCards: structuredClone(state.plan.focusCards), memoryTip: structuredClone(state.plan.memoryTip ?? null), supportGlossary: structuredClone(state.plan.supportGlossary ?? []) };
  if (state.phase === 'summary') return { phase: 'summary', result: structuredClone(state.result) };
  const question = currentQuestion(state);
  return { phase: state.phase, status: state.status, questionId: question.id, type: question.type, assessment: question.assessment ?? 'exact', prompt: question.prompt, instructionVi: question.instructionVi, language: question.language, promptLanguage: question.promptLanguage ?? question.language, imageId: question.imageId ?? null, hideLearningLabel: true, options: question.options ? structuredClone(question.options) : undefined, tokens: question.tokens ? structuredClone(question.tokens) : undefined, hint: state.visibleHint, feedback: state.feedback ? structuredClone(state.feedback) : null, answered: state.attempts.length, queued: state.queue.length, timed: false };
}

/** Transition journal is local-only and lets the host persist after each interaction. */
function transitionChapterReview(state, action) {
  const next = reduceChapterReview(state, action);
  if (next === state) return state;
  const saved = { type: action.type };
  const keys = action.type === 'answer' ? ['questionId', 'response', 'at', 'timeZone', 'durationMs', 'reducedMotion', 'soundEnabled', 'soundAvailable'] : action.type === 'observe' ? ['questionId', 'observation'] : ['hint', 'skip'].includes(action.type) ? ['questionId'] : [];
  for (const key of keys) if (action[key] !== undefined) saved[key] = structuredClone(action[key]);
  invariant(state.journal.length < 512, 'session journal limit reached; preserve progress rather than dropping history');
  return { ...next, journal: [...state.journal, saved] };
}
function exportChapterReviewSnapshot(state) {
  record(state, 'state');
  const serialized = JSON.stringify({ schemaVersion: 1, snapshotType: 'chapter-review', sessionId: state.sessionId, profileId: state.profileId, mode: state.mode, planSignature: JSON.stringify(state.plan), recipe: state.plan.recipe, journal: state.journal });
  invariant(serialized.length <= 262144, 'snapshot exceeds the supported limit; preserve existing storage and use an explicit migration');
  return serialized;
}
/** Trusted plan must come from current validated catalog/chapter and original options. */
function restoreChapterReviewSnapshot(serialized, trustedPlan, expectedProfileId) {
  id(expectedProfileId, 'expected profile ID');
  invariant(typeof serialized === 'string' && serialized.length <= 262144, 'snapshot must be text no larger than 262144 characters');
  const saved = record(JSON.parse(serialized), 'snapshot');
  invariant(saved.schemaVersion === 1 && saved.snapshotType === 'chapter-review', 'unsupported chapter review snapshot');
  invariant(saved.profileId === expectedProfileId, 'snapshot belongs to a different profile');
  invariant(saved.planSignature === JSON.stringify(trustedPlan), 'chapter plan changed; preserve the old snapshot for an explicit migration');
  boundedArray(saved.journal, 'snapshot journal', 512);
  let state = createChapterReviewSession(trustedPlan, { sessionId: saved.sessionId, profileId: saved.profileId, mode: saved.mode });
  for (const action of saved.journal) {
    const next = transitionChapterReview(state, action);
    invariant(next !== state, 'snapshot contains an impossible or duplicate transition');
    state = next;
  }
  return state;
}

/** Rebuild the original plan from validated content plus bounded plain recipe data. */
function restoreChapterReviewFromContent(serialized, catalog, chapter, expectedProfileId) {
  invariant(typeof serialized === 'string' && serialized.length <= 262144, 'snapshot must be text no larger than 262144 characters');
  const saved = record(JSON.parse(serialized), 'snapshot');
  record(saved.recipe, 'saved review recipe');
  const plan = buildChapterQuickReview(catalog, chapter, saved.recipe);
  return restoreChapterReviewSnapshot(serialized, plan, expectedProfileId);
}

return {validateChapter,chapterReviewReadiness,buildChapterQuickReview,chapterFeedbackCue,createChapterReviewSession,summarizeChapterReview,chapterQuestionView,transitionChapterReview,exportChapterReviewSnapshot,restoreChapterReviewSnapshot,restoreChapterReviewFromContent};
},
"./curriculum-adapter.js": function(load) {
const { boundedArray, compareText, id, integer, invariant, record, text, unique, VERSION } = load("./contracts.js");
const { validateCatalog } = load("./content.js");
const { chapterReviewReadiness, restoreChapterReviewSnapshot } = load("./chapter-review.js");
const { normalizeAnswer } = load("./answers.js");

const SUPPORTED_CURRICULUM_SCHEMAS = Object.freeze(['1.4.0', '1.4.1', '1.4.2']);
const VOCAB_FIELDS = ['new_vocabulary_ids', 'focus_vocabulary_ids', 'review_vocabulary_ids'];
const LANGUAGE_FIELDS = ['new_language_target_ids', 'focus_language_target_ids', 'review_language_target_ids'];
const ANSWER_MODES = ['selected_ids', 'ordered_ids', 'pairs', 'groups'];
const dedupe = values => [...new Set(values)];
function refs(values, known, label) {
  boundedArray(values ?? [], label, 1000).forEach(value => invariant(known.has(value), `unknown ${label}: ${value}`));
}
function validateChoice(question) {
  record(question, 'choice'); id(question.id, 'question ID');
  invariant(question.type === 'choice' && question.scoring === 'exact_option_id', 'only explicit exact-option choices can be auto-graded');
  text(question.prompt ?? question.prompt_vi ?? question.prompt_en, 'choice prompt', 2000);
  boundedArray(question.options, 'choice options', 10); invariant(question.options.length >= 2, 'choice needs two or more options');
  question.options.forEach(option => { id(option.id, 'option ID'); text(option.text, 'option text', 1000); });
  unique(question.options.map(option => option.id), 'option IDs');
  unique(question.options.map(option => normalizeAnswer(option.text, { locale: 'en' })), 'option labels');
  invariant(question.options.some(option => option.id === question.answer_option_id), 'choice answer references a missing option');
  if (question.feedback_vi != null) text(question.feedback_vi, 'feedback', 2000);
}
function validateStructuredAnswer(answer, items, expected = null) {
  record(answer, 'structured answer');
  const keys = Object.keys(answer); invariant(keys.length === 1 && ANSWER_MODES.includes(keys[0]), 'answer must use exactly one supported structured mode');
  const mode = keys[0]; const ids = new Set(items.map(item => item.id));
  if (expected) invariant(mode === Object.keys(expected)[0], 'response mode differs from the challenge');
  const checkIds = (values, label) => { boundedArray(values, label, 100); values.forEach(value => invariant(ids.has(value), `unknown item ${value}`)); unique(values, label); };
  if (mode === 'selected_ids' || mode === 'ordered_ids') {
    checkIds(answer[mode], mode);
    if (!expected) invariant(answer[mode].length > 0, 'answer key cannot be empty');
    if (mode === 'ordered_ids') invariant(answer[mode].length === items.length, 'ordered answer must use every item');
  } else if (mode === 'pairs') {
    boundedArray(answer.pairs, 'pairs', 50); const used = [];
    for (const pair of answer.pairs) { invariant(Array.isArray(pair) && pair.length === 2, 'a pair must have two item IDs'); checkIds(pair, 'pair'); used.push(...pair); }
    unique(used, 'paired IDs'); invariant(used.length === items.length, 'pairs must use every item once');
  } else {
    record(answer.groups, 'groups'); const groupIds = Object.keys(answer.groups); groupIds.forEach(value => id(value, 'group ID'));
    invariant(groupIds.length >= 2 && groupIds.length <= 20, 'grouping needs 2–20 groups');
    if (expected) invariant(JSON.stringify(groupIds.sort()) === JSON.stringify(Object.keys(expected.groups).sort()), 'response groups differ from the challenge');
    const used = []; for (const groupId of groupIds) { checkIds(answer.groups[groupId], 'group items'); used.push(...answer.groups[groupId]); }
    unique(used, 'grouped IDs'); invariant(used.length === items.length, 'groups must use every item once');
  }
  return mode;
}
function validateInteractiveChallenge(challenge) {
  record(challenge, 'challenge'); id(challenge.id, 'challenge ID');
  invariant(challenge.type === 'interactive_challenge' && challenge.scoring === 'structured_answer', 'challenge must declare structured_answer scoring');
  text(challenge.instructions_vi, 'challenge instructions', 3000);
  boundedArray(challenge.items, 'challenge items', 100); invariant(challenge.items.length >= 2, 'challenge needs at least two items');
  challenge.items.forEach(item => { id(item.id, 'item ID'); text(item.text_en, 'item English text', 1000); text(item.text_vi, 'item Vietnamese text', 1000); });
  unique(challenge.items.map(item => item.id), 'challenge item IDs');
  const mode = validateStructuredAnswer(challenge.answer, challenge.items);
  if (mode === 'groups') {
    record(challenge.group_labels, 'group labels');
    for (const key of Object.keys(challenge.answer.groups)) text(challenge.group_labels[key], 'group label', 200);
  }
  invariant(challenge.adaptation_policy?.shortened_task_scoring === 'adult_observation', 'shortened challenges must remain adult-observed');
  return challenge;
}
function inspectCurriculum(curriculum) {
  record(curriculum, 'curriculum'); invariant(SUPPORTED_CURRICULUM_SCHEMAS.includes(curriculum.schema_version), 'adapter supports curriculum schemas 1.4.0, 1.4.1, 1.4.2 only');
  text(curriculum.content_version, 'content version', 200);
  const units = boundedArray(curriculum.units, 'units', 1000);
  const vocabulary = boundedArray(curriculum.vocabulary, 'vocabulary', 10000);
  const targets = boundedArray(curriculum.language_targets, 'language targets', 10000);
  const lessons = boundedArray(curriculum.lessons, 'lessons', 2000);
  const stories = boundedArray(curriculum.stories ?? [], 'stories', 1000);
  const supplementary = boundedArray(curriculum.supplementary_cards ?? [], 'supplementary cards', 10000);
  for (const [label, list] of [['unit',units],['vocabulary',vocabulary],['language target',targets],['lesson',lessons],['story',stories],['supplementary card',supplementary]]) {
    list.forEach(item => { record(item, label); id(item.id, `${label} ID`); }); unique(list.map(item => item.id), `${label} IDs`);
  }
  const unitIds = new Set(units.map(unit => unit.id)); const vocabIds = new Set(vocabulary.map(card => card.id)); const targetIds = new Set(targets.map(card => card.id));
  unique([...vocabIds, ...targetIds], 'combined card IDs');
  const storyIds = new Set(stories.map(story => story.id)); const supplementaryIds = new Set(supplementary.map(card => card.id));
  for (const unit of units) { text(unit.title_vi, 'unit title', 200); refs(unit.vocabulary_ids, vocabIds, 'unit vocabulary'); refs(unit.language_target_ids, targetIds, 'unit target'); }
  for (const card of vocabulary) { invariant(unitIds.has(card.unit_id), 'vocabulary unit does not exist'); text(card.en, 'English label', 200); text(card.vi, 'Vietnamese label', 200); }
  for (const card of targets) { invariant(unitIds.has(card.unit_id), 'language target unit does not exist'); text(card.model_en, 'English model', 200); text(card.model_vi, 'Vietnamese model', 200); }
  const sourceLessons = new Map(lessons.map(lesson => [lesson.id,lesson]));
  const days = new Set(lessons.map(lesson => lesson.day)); unique(lessons.map(lesson => lesson.day), 'lesson days');
  const activityIds = []; const questionIds = []; const activityTypes = new Set(); const reviews = []; const challenges = [];
  for (const lesson of lessons) {
    integer(lesson.day, 1, 10000, 'lesson day'); invariant(unitIds.has(lesson.unit_id), 'lesson unit does not exist'); text(lesson.title_vi, 'lesson title', 200);
    for (const field of VOCAB_FIELDS) refs(lesson[field], vocabIds, field);
    for (const field of LANGUAGE_FIELDS) refs(lesson[field], targetIds, field);
    refs(lesson.supplementary_card_ids, supplementaryIds, 'supplementary cards');
    if (lesson.story_id != null) invariant(storyIds.has(lesson.story_id), 'lesson story does not exist');
    if (lesson.prerequisite_day != null) invariant(days.has(lesson.prerequisite_day) && lesson.prerequisite_day < lesson.day, 'lesson prerequisite must be an earlier known day');
    for (const activity of boundedArray(lesson.activities, 'activities', 100)) {
      id(activity.id, 'activity ID'); activityIds.push(activity.id); activityTypes.add(activity.type);
      if (activity.type === 'choice') validateChoice(activity);
      if (activity.type === 'quick_review') {
        invariant(activity.timer_required === false, 'quick review must not require a timer');
        if(activity.memory_tip!=null){record(activity.memory_tip,'memory tip');text(activity.memory_tip.en,'memory tip English',2000);text(activity.memory_tip.vi,'memory tip Vietnamese',2000);}
        if(activity.support_glossary!=null)boundedArray(activity.support_glossary,'support glossary',100).forEach(pair=>{invariant(Array.isArray(pair)&&pair.length===2,'glossary entry must be an English/Vietnamese pair');pair.forEach(value=>text(value,'glossary text',500));});
        invariant(activity.shortened_attempt_scoring === 'adult_observation', 'shortened review must be adult-observed');
        boundedArray(activity.questions, 'quick review questions', 12); invariant(activity.questions.length > 0, 'quick review requires questions');
        activity.questions.forEach(question => {
          validateChoice(question); questionIds.push(question.id);
          if (question.source_references != null) {
            const sources=record(question.source_references,'question source references');
            refs(sources.source_vocabulary_ids,vocabIds,'question source vocabulary');
            refs(sources.source_language_target_ids,targetIds,'question source targets');
            refs(sources.source_story_ids,storyIds,'question source stories');
            refs(sources.source_lesson_ids,new Set(sourceLessons.keys()),'question source lessons');
            invariant((sources.source_lesson_ids??[]).every(sourceId=>sourceLessons.get(sourceId).day<=lesson.day),'review provenance cannot refer to a future lesson');
            if(sources.evidence_en!=null)text(sources.evidence_en,'source evidence',5000);
            invariant(question.mastery_policy==='practice_only_do_not_infer_word_mastery_from_broad_context','provenance must not be converted to word mastery');
          }
        });
        reviews.push({ unitId: lesson.unit_id, lessonId: lesson.id, activityId: activity.id, questionCount: activity.questions.length });
      }
      if (activity.type === 'interactive_challenge') { validateInteractiveChallenge(activity); challenges.push({unitId:lesson.unit_id,lessonId:lesson.id,activityId:activity.id}); }
      if (['speaking_manual','offline_project'].includes(activity.type)) invariant(activity.scoring === 'adult_observation', 'open or speaking work must stay adult-observed');
    }
  }
  unique(activityIds, 'activity IDs'); unique(questionIds, 'quick review question IDs'); unique([...activityIds,...questionIds], 'nested activity/question IDs');
  return { schemaVersion: curriculum.schema_version, contentVersion: curriculum.content_version, units: units.length, vocabularyCards: vocabulary.length, languageTargets: targets.length, lessons: lessons.length, quickReviews: reviews, interactiveChallenges: challenges, activityTypes: [...activityTypes].sort(), validationScope: 'unit/lesson target references and supported scoring contracts; not complete editorial, visual or audio QA' };
}
function adaptCurriculumCatalog(curriculum) {
  const report = inspectCurriculum(curriculum);
  const cards = [...curriculum.vocabulary.map(card => ({ id:card.id, topicId:card.unit_id, en:card.en, vi:card.vi, level:1, ...(card.image_id ? {imageId:card.image_id} : {}) })), ...curriculum.language_targets.map(card => ({ id:card.id, topicId:card.unit_id, en:card.model_en, vi:card.model_vi, level:1 }))];
  const byDay = new Map(curriculum.lessons.map(lesson => [lesson.day,lesson.id]));
  const lessons = curriculum.lessons.map(lesson => {
    const cardIds = dedupe([...VOCAB_FIELDS,...LANGUAGE_FIELDS].flatMap(field => lesson[field] ?? []));
    invariant(cardIds.length > 0, `lesson ${lesson.id} has no supported vocabulary/language targets`);
    const minutes = lesson.duration_minutes?.ages_8_10?.[0] ?? lesson.duration_minutes?.ages_5_7?.[0]; integer(minutes,1,60,'estimated lesson minutes');
    return {id:lesson.id,title:lesson.title_vi,estimatedMinutes:minutes,cardIds,prerequisiteIds:lesson.prerequisite_day == null ? [] : [byDay.get(lesson.prerequisite_day)]};
  });
  const catalog = {schemaVersion:VERSION,cards,lessons}; validateCatalog(catalog);
  const chapters = curriculum.units.map(unit => ({id:unit.id,title:unit.title_vi,lessonIds:curriculum.lessons.filter(lesson=>lesson.unit_id===unit.id).map(lesson=>lesson.id)}));
  return {catalog,chapters,report,source:{schemaVersion:curriculum.schema_version,contentVersion:curriculum.content_version,idsPreserved:true,levelMeaning:'structural placeholder 1, not an assessed proficiency level',audio:'No audio IDs are invented. Source audio remains unavailable unless separately implemented.'}};
}
function buildCurriculumQuickReview(curriculum, unitId, {completedLessonIds = [], introducedLessonIds = [], ageBand = 'ages_8_10', shortened = false} = {}) {
  const adapted = adaptCurriculumCatalog(curriculum); id(unitId,'unit ID');
  const chapter = adapted.chapters.find(value=>value.id===unitId); invariant(chapter,'unknown curriculum unit');
  invariant(['ages_5_7','ages_8_10'].includes(ageBand),'unsupported age band'); invariant(typeof shortened==='boolean','shortened must be boolean');
  const lessonIds = new Set(curriculum.lessons.map(lesson=>lesson.id)); refs(completedLessonIds,lessonIds,'completed lessons'); refs(introducedLessonIds,lessonIds,'introduced lessons');
  const candidates = curriculum.lessons.filter(lesson=>lesson.unit_id===unitId).flatMap(lesson=>lesson.activities.filter(activity=>activity.type==='quick_review').map(activity=>({lesson,activity}))).sort((a,b)=>a.lesson.day-b.lesson.day);
  if (!candidates.length) return {available:false,reason:'no_authored_quick_review',unitId,plan:null};
  invariant(candidates.length===1,'multiple quick reviews in this unit need an explicit selector');
  const {lesson,activity}=candidates[0];
  invariant(activity.questions.every(question => !question.text_variant_required && !question.story_id), 'this quick review requires story delivery not supported by the narrow adapter');
  const introduced=new Set([...completedLessonIds,...introducedLessonIds]);
  if (!introduced.has(lesson.id)) return {available:true,reason:'review_lesson_not_introduced',unitId,sourceLessonId:lesson.id,plan:null};
  const adultObserved = shortened || ageBand==='ages_5_7';
  const questions=activity.questions.map(question=>({id:question.id,type:adultObserved?'application':'choice',assessment:adultObserved?'adult_observation':'exact',assessmentScope:'question',cardId:null,language:null,promptLanguage:'mixed_en_vi',prompt:question.prompt??question.prompt_vi??question.prompt_en,instructionVi:activity.instructions_vi??'Ôn lại nội dung của chương.',options:question.options.map(option=>({id:option.id,label:option.text})),...(adultObserved?{}:{correctOptionId:question.answer_option_id}),hint:activity.memory_cue_vi??'Em có thể xem lại phần ghi nhớ cùng người lớn.',explanationVi:question.feedback_vi??null,imageId:null,hideLearningLabel:true,...(question.source_references?{sourceReferences:structuredClone(question.source_references),masteryPolicy:question.mastery_policy}:{}),sourceQuestionId:question.id,sourceActivityId:activity.id,sourceLessonId:lesson.id,sourceUnitId:unitId}));
  const cardMap=new Map(adapted.catalog.cards.map(card=>[card.id,card]));
  const focusIds=dedupe([...(lesson.focus_language_target_ids??[]),...(lesson.focus_vocabulary_ids??[])]);
  const focusCards=focusIds.slice(0,4).map(cardId=>{const card=cardMap.get(cardId);return {cardId,en:card.en,vi:card.vi,imageId:card.imageId??null,audioId:null,reason:'chapter-recap'};});
  const recipe={adapter:'curriculum-quick-review-v1',unitId,completedLessonIds:[...completedLessonIds],introducedLessonIds:[...introducedLessonIds],ageBand,shortened};
  const plan={schemaVersion:VERSION,chapterId:unitId,title:chapter.title,readiness:chapterReviewReadiness(adapted.catalog,chapter,completedLessonIds),focusCards,questions,initialQuestionCount:questions.length,maximumQuestionCount:questions.length*2,retryLimitPerQuestion:1,timed:false,suggestedMinutes:null,completeFiveStepPattern:false,missingAuthoredTypes:['five-round-overlay-not-applied'],recipe,source:{schemaVersion:curriculum.schema_version,contentVersion:curriculum.content_version,unitId,lessonId:lesson.id,activityId:activity.id,questionIds:questions.map(question=>question.id),durationHintSeconds:activity.duration_seconds??null,timerRequired:false,audio:null,assessment:adultObserved?'adult_observation':'exact_option_id',ageAdaptationVi:activity.age_adaptation_vi??null,shortenedAttemptScoring:activity.shortened_attempt_scoring,targetMapping:'question-only; source does not assign a unique vocabulary/language target to each question'},memoryTip:structuredClone(activity.memory_tip??lesson.memory_tip??curriculum.units.find(unit=>unit.id===unitId)?.memory_tip??null),...(activity.support_glossary?{supportGlossary:structuredClone(activity.support_glossary)}:{})};
  return {available:true,reason:null,unitId,plan};
}
function restoreCurriculumReviewSnapshot(serialized,curriculum,expectedProfileId) {
  invariant(typeof serialized==='string'&&serialized.length<=262144,'snapshot is too large'); const saved=record(JSON.parse(serialized),'snapshot'); const recipe=record(saved.recipe,'adapter recipe');
  invariant(recipe.adapter==='curriculum-quick-review-v1','unsupported adapter snapshot');
  const adapted=buildCurriculumQuickReview(curriculum,recipe.unitId,recipe); invariant(adapted.plan,'snapshot no longer has an available authored review');
  return restoreChapterReviewSnapshot(serialized,adapted.plan,expectedProfileId);
}
function curriculumQuestionOutcomes(state) {
  invariant(state.plan?.recipe?.adapter==='curriculum-quick-review-v1','not a curriculum review session');
  return state.attempts.map(attempt=>({unitId:state.plan.source.unitId,lessonId:state.plan.source.lessonId,activityId:state.plan.source.activityId,questionId:attempt.originalQuestionId,attemptId:attempt.questionId,assessed:attempt.assessed,correct:attempt.correct,usedHint:attempt.usedHint,skipped:attempt.skipped,observation:attempt.observation??null,isRetry:attempt.isRetry,durationMs:attempt.durationMs??null}));
}
function canonicalAnswer(answer) {
  const mode=Object.keys(answer)[0];
  if(mode==='ordered_ids')return JSON.stringify(answer.ordered_ids);
  if(mode==='selected_ids')return JSON.stringify([...answer.selected_ids].sort(compareText));
  if(mode==='pairs')return JSON.stringify(answer.pairs.map(pair=>[...pair].sort(compareText)).sort((a,b)=>compareText(JSON.stringify(a),JSON.stringify(b))));
  return JSON.stringify(Object.keys(answer.groups).sort(compareText).map(group=>[group,[...answer.groups[group]].sort(compareText)]));
}
function gradeInteractiveChallenge(challenge,response,{shortened=false,ageBand='ages_8_10'}={}) {
  validateInteractiveChallenge(challenge); invariant(typeof shortened==='boolean','shortened must be boolean'); invariant(['ages_5_7','ages_8_10'].includes(ageBand),'unsupported age band');
  if(shortened||ageBand==='ages_5_7')return {autoGraded:false,assessment:'adult_observation',correct:null,feedbackVi:challenge.adult_fallback_vi??null};
  validateStructuredAnswer(response,challenge.items,challenge.answer);
  return {autoGraded:true,assessment:'structured_answer',correct:canonicalAnswer(response)===canonicalAnswer(challenge.answer),feedbackVi:challenge.feedback_vi??null};
}
function interactiveChallengeView(challenge,{shortened=false,ageBand='ages_8_10'}={}) {
  validateInteractiveChallenge(challenge); invariant(typeof shortened==='boolean','shortened must be boolean'); invariant(['ages_5_7','ages_8_10'].includes(ageBand),'unsupported age band');
  return {id:challenge.id,titleVi:challenge.title_vi??null,mechanic:challenge.mechanic,instructionsVi:challenge.instructions_vi,items:structuredClone(challenge.items),groupLabels:challenge.group_labels?structuredClone(challenge.group_labels):null,answerMode:Object.keys(challenge.answer)[0],assessment:shortened||ageBand==='ages_5_7'?'adult_observation':'structured_answer',requiresDrag:false,requiresMicrophone:false,timed:false,audio:null};
}

return {SUPPORTED_CURRICULUM_SCHEMAS,validateInteractiveChallenge,inspectCurriculum,adaptCurriculumCatalog,buildCurriculumQuickReview,restoreCurriculumReviewSnapshot,curriculumQuestionOutcomes,gradeInteractiveChallenge,interactiveChallengeView};
}};
const cache=Object.create(null);
function load(id){if(cache[id])return cache[id];if(!factories[id])throw new Error('Unknown module '+id);return cache[id]=factories[id](load);}
root.EnglishKidsCore=Object.assign({},load("./contracts.js"),load("./dates.js"),load("./random.js"),load("./answers.js"),load("./content.js"),load("./review.js"),load("./activities.js"),load("./progress.js"),load("./planner.js"),load("./session.js"),load("./reports.js"),load("./assets.js"),load("./layout.js"),load("./chapter-review.js"),load("./curriculum-adapter.js"));
})(typeof window!=='undefined'?window:globalThis);
