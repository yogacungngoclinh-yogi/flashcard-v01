import { boundedArray, compareText, id, integer, invariant, record, text, unique, VERSION } from './contracts.js';
import { validateCatalog } from './content.js';
import { validateReview } from './review.js';
import { createChoiceActivity } from './activities.js';
import { checkAnswer, normalizeAnswer } from './answers.js';
import { assertInstant, dayInZone } from './dates.js';
import { validateEvent } from './progress.js';
import { shuffle } from './random.js';

/** Chapter metadata is separate so the existing app's catalog need not change. */
export function validateChapter(catalog, chapter) {
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
export function chapterReviewReadiness(catalog, chapter, completedLessonIds = []) {
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
export function buildChapterQuickReview(catalog, chapter, { reviews = [], completedLessonIds = [], introducedCardIds, questionCount = 5, focusCount = 4, seed = chapter?.id } = {}) {
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
export function chapterFeedbackCue({ correct, reducedMotion = false, soundEnabled = true, soundAvailable = false, isRetry = false }) {
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
export function createChapterReviewSession(plan, { sessionId, profileId, mode = 'chapter-end' }) {
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
export function summarizeChapterReview(state) {
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
export function chapterQuestionView(state) {
  record(state, 'state');
  if (state.phase === 'focus') return { phase: 'focus', focusCards: structuredClone(state.plan.focusCards), memoryTip: structuredClone(state.plan.memoryTip ?? null), supportGlossary: structuredClone(state.plan.supportGlossary ?? []) };
  if (state.phase === 'summary') return { phase: 'summary', result: structuredClone(state.result) };
  const question = currentQuestion(state);
  return { phase: state.phase, status: state.status, questionId: question.id, type: question.type, assessment: question.assessment ?? 'exact', prompt: question.prompt, instructionVi: question.instructionVi, language: question.language, promptLanguage: question.promptLanguage ?? question.language, imageId: question.imageId ?? null, hideLearningLabel: true, options: question.options ? structuredClone(question.options) : undefined, tokens: question.tokens ? structuredClone(question.tokens) : undefined, hint: state.visibleHint, feedback: state.feedback ? structuredClone(state.feedback) : null, answered: state.attempts.length, queued: state.queue.length, timed: false };
}

/** Transition journal is local-only and lets the host persist after each interaction. */
export function transitionChapterReview(state, action) {
  const next = reduceChapterReview(state, action);
  if (next === state) return state;
  const saved = { type: action.type };
  const keys = action.type === 'answer' ? ['questionId', 'response', 'at', 'timeZone', 'durationMs', 'reducedMotion', 'soundEnabled', 'soundAvailable'] : action.type === 'observe' ? ['questionId', 'observation'] : ['hint', 'skip'].includes(action.type) ? ['questionId'] : [];
  for (const key of keys) if (action[key] !== undefined) saved[key] = structuredClone(action[key]);
  invariant(state.journal.length < 512, 'session journal limit reached; preserve progress rather than dropping history');
  return { ...next, journal: [...state.journal, saved] };
}
export function exportChapterReviewSnapshot(state) {
  record(state, 'state');
  const serialized = JSON.stringify({ schemaVersion: 1, snapshotType: 'chapter-review', sessionId: state.sessionId, profileId: state.profileId, mode: state.mode, planSignature: JSON.stringify(state.plan), recipe: state.plan.recipe, journal: state.journal });
  invariant(serialized.length <= 262144, 'snapshot exceeds the supported limit; preserve existing storage and use an explicit migration');
  return serialized;
}
/** Trusted plan must come from current validated catalog/chapter and original options. */
export function restoreChapterReviewSnapshot(serialized, trustedPlan, expectedProfileId) {
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
export function restoreChapterReviewFromContent(serialized, catalog, chapter, expectedProfileId) {
  invariant(typeof serialized === 'string' && serialized.length <= 262144, 'snapshot must be text no larger than 262144 characters');
  const saved = record(JSON.parse(serialized), 'snapshot');
  record(saved.recipe, 'saved review recipe');
  const plan = buildChapterQuickReview(catalog, chapter, saved.recipe);
  return restoreChapterReviewSnapshot(serialized, plan, expectedProfileId);
}
