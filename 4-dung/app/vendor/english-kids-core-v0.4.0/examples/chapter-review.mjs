// Synthetic demonstration. No UI, audio, network or actual child data.
import { catalog } from '../test/fixtures.js';
import { richChapter } from '../test/chapter-fixtures.js';
import { buildChapterQuickReview, createChapterReviewSession, transitionChapterReview, chapterQuestionView } from '../src/index.js';
const plan = buildChapterQuickReview(catalog, richChapter, { completedLessonIds: ['lesson.animals'] });
let state = createChapterReviewSession(plan, { sessionId:'chapter-demo', profileId:'demo-profile' });
state = transitionChapterReview(state, { type:'begin' });
const firstDisplay = chapterQuestionView(state);
while (state.status === 'active') {
  const question = state.queue[state.cursor];
  // Demo-only access to the answer key. A child-facing UI must use chapterQuestionView.
  const response = ['choice','context'].includes(question.type) ? question.correctOptionId : question.type === 'order' ? question.expectedTokenIds : question.acceptedAnswers[0];
  if (state.cursor === 2) state = transitionChapterReview(state, { type:'hint', questionId:question.id });
  state = transitionChapterReview(state, { type:'answer', questionId:question.id, response, at:'2026-11-08T02:00:00.000Z', timeZone:'Asia/Ho_Chi_Minh', durationMs:3000, reducedMotion:true, soundEnabled:false });
  state = transitionChapterReview(state, { type:'next' });
}
console.log(JSON.stringify({ questionTypes:plan.questions.map(question=>question.type), completeFiveStepPattern:plan.completeFiveStepPattern, firstDisplay, result:state.result, note:'Synthetic core demo only. No rendered UI, animation, speech or audio.' }, null, 2));
