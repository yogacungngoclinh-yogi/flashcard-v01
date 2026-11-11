import { boundedArray, compareText, id, integer, invariant, record, text, unique, VERSION } from './contracts.js';
import { validateCatalog } from './content.js';
import { chapterReviewReadiness, restoreChapterReviewSnapshot } from './chapter-review.js';
import { normalizeAnswer } from './answers.js';

export const SUPPORTED_CURRICULUM_SCHEMAS = Object.freeze(['1.4.0', '1.4.1', '1.4.2']);
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
export function validateInteractiveChallenge(challenge) {
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
export function inspectCurriculum(curriculum) {
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
export function adaptCurriculumCatalog(curriculum) {
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
export function buildCurriculumQuickReview(curriculum, unitId, {completedLessonIds = [], introducedLessonIds = [], ageBand = 'ages_8_10', shortened = false} = {}) {
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
export function restoreCurriculumReviewSnapshot(serialized,curriculum,expectedProfileId) {
  invariant(typeof serialized==='string'&&serialized.length<=262144,'snapshot is too large'); const saved=record(JSON.parse(serialized),'snapshot'); const recipe=record(saved.recipe,'adapter recipe');
  invariant(recipe.adapter==='curriculum-quick-review-v1','unsupported adapter snapshot');
  const adapted=buildCurriculumQuickReview(curriculum,recipe.unitId,recipe); invariant(adapted.plan,'snapshot no longer has an available authored review');
  return restoreChapterReviewSnapshot(serialized,adapted.plan,expectedProfileId);
}
export function curriculumQuestionOutcomes(state) {
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
export function gradeInteractiveChallenge(challenge,response,{shortened=false,ageBand='ages_8_10'}={}) {
  validateInteractiveChallenge(challenge); invariant(typeof shortened==='boolean','shortened must be boolean'); invariant(['ages_5_7','ages_8_10'].includes(ageBand),'unsupported age band');
  if(shortened||ageBand==='ages_5_7')return {autoGraded:false,assessment:'adult_observation',correct:null,feedbackVi:challenge.adult_fallback_vi??null};
  validateStructuredAnswer(response,challenge.items,challenge.answer);
  return {autoGraded:true,assessment:'structured_answer',correct:canonicalAnswer(response)===canonicalAnswer(challenge.answer),feedbackVi:challenge.feedback_vi??null};
}
export function interactiveChallengeView(challenge,{shortened=false,ageBand='ages_8_10'}={}) {
  validateInteractiveChallenge(challenge); invariant(typeof shortened==='boolean','shortened must be boolean'); invariant(['ages_5_7','ages_8_10'].includes(ageBand),'unsupported age band');
  return {id:challenge.id,titleVi:challenge.title_vi??null,mechanic:challenge.mechanic,instructionsVi:challenge.instructions_vi,items:structuredClone(challenge.items),groupLabels:challenge.group_labels?structuredClone(challenge.group_labels):null,answerMode:Object.keys(challenge.answer)[0],assessment:shortened||ageBand==='ages_5_7'?'adult_observation':'structured_answer',requiresDrag:false,requiresMicrophone:false,timed:false,audio:null};
}
