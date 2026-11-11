import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import * as c from '../src/index.js';
const fixture = process.argv[2] ?? 'curriculum-v5-330.json';
assert.ok(['curriculum-v5-330.json','curriculum-v7-365.json'].includes(fixture),'unsupported fixture');
const file=new URL(`../integration/fixtures/${fixture}`,import.meta.url);
const bytes=readFileSync(file); const data=JSON.parse(bytes);
const before=JSON.stringify(data); const adapted=c.adaptCurriculumCatalog(data);
const simulations=[];
for(const review of adapted.report.quickReviews){
 const completedLessonIds=data.lessons.filter(lesson=>lesson.unit_id===review.unitId).map(lesson=>lesson.id);
 const {plan}=c.buildCurriculumQuickReview(data,review.unitId,{completedLessonIds});
 let state=c.createChapterReviewSession(plan,{sessionId:`verified-${review.unitId}`,profileId:'synthetic-integration-profile'});
 state=c.transitionChapterReview(state,{type:'begin'});
 for(let index=0;index<3;index++){
  const question=state.queue[state.cursor];
  if(index===1)state=c.transitionChapterReview(state,{type:'hint',questionId:question.id});
  state=c.transitionChapterReview(state,{type:'answer',questionId:question.id,response:question.correctOptionId,at:'2026-11-08T02:00:00.000Z',timeZone:'Asia/Ho_Chi_Minh',durationMs:2000});
  const restored=c.restoreCurriculumReviewSnapshot(c.exportChapterReviewSnapshot(state),data,state.profileId);
  assert.deepEqual(restored,state);
  state=c.transitionChapterReview(restored,{type:'next'});
 }
 assert.equal(state.status,'completed');assert.equal(state.events.length,0);
 assert.equal(state.result.unassistedFirstPass.correct,2);assert.equal(state.result.assistedFirstPass.correct,1);
 simulations.push({unitId:review.unitId,lessonId:review.lessonId,activityId:review.activityId,questionIds:c.curriculumQuestionOutcomes(state).map(outcome=>outcome.questionId),reviewCompleted:state.result.reviewCompleted,unaidedCorrect:2,supportedCorrect:1,snapshotRoundTrips:3,fabricatedCardEvents:state.events.length,audio:plan.source.audio,timed:plan.timed});
}
const challenges=data.lessons.flatMap(lesson=>lesson.activities.filter(activity=>activity.type==='interactive_challenge'));
for(const challenge of challenges){assert.equal(c.gradeInteractiveChallenge(challenge,challenge.answer).correct,true);assert.equal(c.gradeInteractiveChallenge(challenge,null,{shortened:true}).autoGraded,false);}
assert.equal(JSON.stringify(data),before);
const result={integration:'standalone-core-with-real-authored-content',sourceSchemaVersion:data.schema_version,sourceContentVersion:data.content_version,sourceSha256:createHash('sha256').update(bytes).digest('hex'),sourceUnchanged:true,containsRealChildProgress:false,catalog:{cards:adapted.catalog.cards.length,lessons:adapted.catalog.lessons.length,units:adapted.chapters.length},quickReviewsSimulated:simulations.length,quickQuestionsSimulated:simulations.reduce((sum,s)=>sum+s.questionIds.length,0),snapshotRoundTrips:simulations.reduce((sum,s)=>sum+s.snapshotRoundTrips,0),structuredChallengesVerified:challenges.length,originalAppTouched:false,renderedUIVerified:false,realAudioVerified:false,simulations};
writeFileSync(new URL(fixture === 'curriculum-v7-365.json' ? '../verification/curriculum-integration-v7.json' : '../verification/curriculum-integration.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
