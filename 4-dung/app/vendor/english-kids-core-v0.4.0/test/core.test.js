import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../src/index.js';
import { catalog, event, manifest, copy } from './fixtures.js';

// Content and calendar boundaries.
test('validates the bilingual content fixture without mutation', () => {
  const input = copy(catalog); assert.equal(core.validateCatalog(input), input); assert.deepEqual(input, catalog);
});
test('rejects duplicate card identifiers', () => { const c = copy(catalog); c.cards.push(c.cards[0]); assert.throws(() => core.validateCatalog(c), /unique/); });
test('rejects prototype-key identifiers', () => { assert.throws(() => core.id('constructor'), /reserved/); assert.throws(() => core.id('__proto__')); });
test('rejects empty labels', () => { const c = copy(catalog); c.cards[0].vi = ' '; assert.throws(() => core.validateCatalog(c)); });
test('rejects unknown lesson cards', () => { const c = copy(catalog); c.lessons[0].cardIds.push('missing'); assert.throws(() => core.validateCatalog(c), /unknown card/); });
test('rejects missing prerequisites', () => { const c = copy(catalog); c.lessons[0].prerequisiteIds = ['missing']; assert.throws(() => core.validateCatalog(c), /unknown prerequisite/); });
test('rejects cycles', () => { const c = copy(catalog); c.lessons[0].prerequisiteIds = ['lesson.colors']; assert.throws(() => core.validateCatalog(c), /cycle/); });
test('unlocks lessons only after prerequisites', () => {
  assert.deepEqual(core.availableLessons(catalog).map(l => l.id), ['lesson.animals']);
  assert.deepEqual(core.availableLessons(catalog, ['lesson.animals']).map(l => l.id), ['lesson.colors']);
});
test('handles leap days and year boundaries', () => {
  assert.equal(core.addDays('2028-02-28', 1), '2028-02-29'); assert.equal(core.addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(core.daysBetween('2026-11-01', '2026-11-08'), 7);
});
test('rejects impossible dates and normalized-overflow instants', () => {
  assert.throws(() => core.assertDay('2026-02-29')); assert.throws(() => core.assertDay('2026-2-01'));
  assert.throws(() => core.assertInstant('2026-02-30T00:00:00.000Z'));
});
test('maps instants into explicitly selected time zones', () => {
  assert.equal(core.dayInZone('2026-11-08T18:00:00.000Z', 'Asia/Ho_Chi_Minh'), '2026-11-09');
  assert.equal(core.dayInZone('2026-11-08T01:00:00.000Z', 'America/Los_Angeles'), '2026-11-07');
});
test('is stable across DST fall-back', () => {
  assert.equal(core.dayInZone('2026-11-01T08:30:00.000Z', 'America/Los_Angeles'), '2026-11-01');
  assert.equal(core.dayInZone('2026-11-01T09:30:00.000Z', 'America/Los_Angeles'), '2026-11-01');
});
test('requires an explicit valid timezone', () => { assert.throws(() => core.dayInZone('2026-11-08T00:00:00.000Z')); assert.throws(() => core.dayInZone('2026-11-08T00:00:00.000Z', 'nowhere')); });

// Answers and activity generation.
test('normalizes whitespace, case and trailing sentence punctuation', () => { assert.equal(core.checkAnswer('  DOG! ', ['dog']).correct, true); });
test('normalizes NFC Vietnamese without removing meaningful accents', () => {
  assert.equal(core.checkAnswer('con cho\u0301', ['con chó'], { locale: 'vi' }).correct, true);
  assert.equal(core.checkAnswer('ma', ['má'], { locale: 'vi' }).correct, false);
  assert.equal(core.checkAnswer('da', ['đa'], { locale: 'vi' }).correct, false);
});
test('handles explicit aliases and rejects empty answers', () => { assert.equal(core.checkAnswer('kitty', ['cat', 'kitty']).correct, true); assert.equal(core.checkAnswer(' ', ['dog']).correct, false); });
test('does not pretend fuzzy spelling is correct', () => { assert.equal(core.checkAnswer('dgo', ['dog']).correct, false); });
test('does not discard internal apostrophes or hyphens', () => { assert.notEqual(core.normalizeAnswer("can't"), core.normalizeAnswer('cant')); assert.notEqual(core.normalizeAnswer('x-ray'), core.normalizeAnswer('xray')); });
test('rejects punctuation-only accepted answers', () => { assert.throws(() => core.checkAnswer('.', ['...'])); });
test('seeded shuffle is deterministic and non-mutating', () => { const values = [1, 2, 3, 4, 5]; assert.deepEqual(core.shuffle(values, 'seed'), core.shuffle(values, 'seed')); assert.deepEqual(values, [1,2,3,4,5]); });
test('random outputs always lie in [0,1)', () => { const rng = core.seededRandom('sample'); for (let i = 0; i < 10000; i++) { const x = rng(); assert.ok(x >= 0 && x < 1); } });
test('choice activities contain one correct answer and unique labels', () => {
  const activity = core.createChoiceActivity(catalog, 'animal.dog', { seed: 'day-1' });
  assert.equal(activity.options.length, 4); assert.equal(activity.options.filter(x => x.id === activity.correctOptionId).length, 1);
  assert.equal(new Set(activity.options.map(x => x.label)).size, 4); assert.equal(activity.prompt, 'con chó');
});
test('supports Vietnamese answer choices', () => { const a = core.createChoiceActivity(catalog, 'animal.dog', { language: 'vi' }); assert.equal(a.prompt, 'dog'); assert.ok(a.options.some(x => x.label === 'con chó')); });
test('prevents duplicate visible distractor answers', () => { const c = copy(catalog); c.cards[1].en = 'dog'; const a = core.createChoiceActivity(c, 'animal.dog'); assert.equal(a.options.filter(x => x.label === 'dog').length, 1); });
test('fails clearly if insufficient distinct choices exist', () => { assert.throws(() => core.createChoiceActivity(catalog, 'animal.dog', { count: 7 })); const c = copy(catalog); c.cards.forEach(x => x.en = 'dog'); assert.throws(() => core.createChoiceActivity(c, 'animal.dog'), /not enough/); });
test('creates bilingual matching pairs with identical ID sets', () => { const a = core.createMatchingActivity(catalog, ['animal.dog','animal.cat','animal.bird']); assert.deepEqual(a.left.map(x => x.id).sort(), a.right.map(x => x.id).sort()); });
test('rejects ambiguous or duplicate matching pairs', () => { assert.throws(() => core.createMatchingActivity(catalog, ['animal.dog','animal.dog'])); const c = copy(catalog); c.cards[1].vi = c.cards[0].vi; assert.throws(() => core.createMatchingActivity(c, ['animal.dog','animal.cat'])); });

// Scheduling and daily planning.
test('starts a review due today', () => { assert.equal(core.newReview('animal.dog','2026-11-08').dueDay, '2026-11-08'); });
test('good review schedules tomorrow without mutating previous state', () => { const r = core.newReview('animal.dog','2026-11-08'); const next = core.scheduleReview(r,'good','2026-11-08'); assert.equal(next.dueDay,'2026-11-09'); assert.equal(r.attempts,0); });
test('again returns a card to same-day review', () => { const r = core.scheduleReview(core.newReview('animal.dog','2026-11-08'),'again','2026-11-08'); assert.equal(r.dueDay,'2026-11-08'); assert.equal(r.lapses,1); });
test('same-day repetition does not inflate the spacing stage', () => { let r = core.newReview('animal.dog','2026-11-08'); for(let i=0;i<20;i++) r=core.scheduleReview(r,'good','2026-11-08'); assert.equal(r.stage,1); assert.equal(r.dueDay,'2026-11-09'); });
test('review stages cap at six', () => { let r = core.newReview('animal.dog','2026-11-08'); for(let i=0;i<10;i++) r=core.scheduleReview(r,'easy',core.addDays('2026-11-08',i)); assert.equal(r.stage,6); });
test('rejects backwards review days and unknown grades', () => { const r = core.scheduleReview(core.newReview('animal.dog','2026-11-08'),'good','2026-11-08'); assert.throws(() => core.scheduleReview(r,'good','2026-11-07')); assert.throws(() => core.scheduleReview(r,'perfect','2026-11-08')); });
test('daily plan puts overdue reviews before new content', () => {
  const r = core.newReview('animal.dog','2026-11-06'); const plan = core.buildDailyPlan(catalog,{today:'2026-11-08',reviews:[r],maxCards:3,maxNewCards:2});
  assert.equal(plan.cardOrder[0],'animal.dog'); assert.equal(plan.cardOrder.length,3); assert.equal(new Set(plan.cardOrder).size,3);
});
test('daily plan respects zero new-card limit', () => { assert.equal(core.buildDailyPlan(catalog,{today:'2026-11-08',maxNewCards:0}).cardOrder.length,0); });
test('daily plan does not select locked lessons', () => { const plan = core.buildDailyPlan(catalog,{today:'2026-11-08'}); assert.ok(plan.newCardIds.every(x=>x.startsWith('animal.'))); });
test('daily plan reports a review backlog without extending session size', () => { const reviews = catalog.cards.map(c=>core.newReview(c.id,'2026-11-07')); const plan = core.buildDailyPlan(catalog,{today:'2026-11-08',reviews,maxCards:2,maxNewCards:0}); assert.equal(plan.cardOrder.length,2); assert.equal(plan.remainingDue,4); });
test('rejects duplicate reviews', () => { const r = core.newReview('animal.dog','2026-11-08'); assert.throws(() => core.buildDailyPlan(catalog,{today:'2026-11-08',reviews:[r,r]})); });
test('ignores removed catalog cards when planning, preserving original progress data', () => { const r = core.newReview('removed','2026-11-08'); assert.ok(!core.buildDailyPlan(catalog,{today:'2026-11-08',reviews:[r]}).cardOrder.includes('removed')); assert.equal(r.cardId,'removed'); });

// Offline-safe event replay and backups.
test('event merge is idempotent, deterministic and immutable', () => { const a=event(); const b=event({id:'event.2',at:'2026-11-08T03:00:00.000Z'}); assert.deepEqual(core.mergeEvents([a,b],[a]),core.mergeEvents([b],[a])); assert.equal(core.mergeEvents([a,a]).length,1); });
test('rejects conflicting repeated event IDs instead of silently discarding', () => { assert.throws(()=>core.mergeEvents([event(),event({grade:'again'})]),/conflicting/); });
test('drops fields outside the progress allowlist', () => { const merged=core.mergeEvents([event({childName:'DO NOT SAVE',recording:'DO NOT SAVE'})]); assert.equal('childName' in merged[0],false); assert.equal('recording' in merged[0],false); });
test('rejects an event day inconsistent with the timestamp and timezone', () => { assert.throws(()=>core.validateEvent(event({day:'2026-11-07'}))); });
test('replay keeps profiles separate', () => { const data=[event(),event({id:'event.2',profileId:'other'})]; assert.equal(core.replayProgress(data,'profile.demo').eventCount,1); });
test('replay produces identical results regardless of upload order', () => { const a=event(); const b=event({id:'event.2',at:'2026-11-09T02:00:00.000Z',day:'2026-11-09'}); assert.deepEqual(core.replayProgress([b,a],'profile.demo'),core.replayProgress([a,b],'profile.demo')); });
test('time-zone travel cannot make review scheduling throw backwards-day errors', () => { const a=event({at:'2026-11-08T12:00:00.000Z',timeZone:'Pacific/Kiritimati',day:'2026-11-09'}); const b=event({id:'event.2',at:'2026-11-08T13:00:00.000Z',timeZone:'America/Los_Angeles',day:'2026-11-08'}); assert.equal(core.replayProgress([a,b],'profile.demo').reviews[0].lastDay,'2026-11-09'); });
test('progress backup round trips with only the requested profile', () => { const value=core.exportProgress([event(),event({id:'event.2',profileId:'other'})],'profile.demo'); assert.deepEqual(core.importProgress(value,'profile.demo'),[event()]); });
test('rejects wrong-profile and unsupported version imports', () => { const value=core.exportProgress([event()],'profile.demo'); assert.throws(()=>core.importProgress(value,'other')); const data=JSON.parse(value); data.schemaVersion=2; assert.throws(()=>core.importProgress(JSON.stringify(data),'profile.demo')); });
test('rejects mixed profile imports, invalid JSON and extreme durations', () => { assert.throws(()=>core.importProgress(JSON.stringify({schemaVersion:1,profileId:'profile.demo',events:[event({profileId:'other'})]}),'profile.demo')); assert.throws(()=>core.importProgress('{','profile.demo')); assert.throws(()=>core.validateEvent(event({durationMs:600001}))); });

// Session transitions: repeated and interrupted flows.
const session=()=>core.createSession({id:'session.demo',profileId:'profile.demo',cardIds:['animal.dog','animal.cat']});
const answer=(cardId='animal.dog')=>({type:'answer',cardId,grade:'good',at:'2026-11-08T02:00:00.000Z',timeZone:'Asia/Ho_Chi_Minh',durationMs:5000});
test('answer/feedback/next/finish flow emits one event per card', () => { let s=session(); s=core.transitionSession(s,answer()); assert.equal(s.phase,'feedback'); s=core.transitionSession(s,{type:'next'}); s=core.transitionSession(s,answer('animal.cat')); s=core.transitionSession(s,{type:'next'}); assert.equal(s.status,'finished'); assert.equal(s.events.length,2); });
test('double answer clicks cannot award twice', () => { let s=core.transitionSession(session(),answer()); const next=core.transitionSession(s,answer()); assert.equal(next,s); assert.equal(next.events.length,1); });
test('double next click cannot skip a question', () => { let s=core.transitionSession(session(),answer()); s=core.transitionSession(s,{type:'next'}); const next=core.transitionSession(s,{type:'next'}); assert.equal(next.cursor,1); assert.equal(next.phase,'question'); });
test('pause/resume preserves question and ignores answers while paused', () => { const s=core.transitionSession(session(),{type:'pause'}); assert.equal(core.transitionSession(s,answer()),s); assert.equal(core.transitionSession(s,{type:'resume'}).status,'active'); });
test('pause during feedback preserves feedback state', () => { let s=core.transitionSession(session(),answer()); s=core.transitionSession(s,{type:'pause'}); s=core.transitionSession(s,{type:'resume'}); assert.equal(s.phase,'feedback'); assert.equal(s.events.length,1); });
test('finished session rejects late async answer without side effects', () => { const s=core.transitionSession(session(),{type:'finish'}); assert.equal(core.transitionSession(s,answer()),s); });
test('stale answer for previous card throws instead of scoring next card', () => { let s=core.transitionSession(session(),answer()); s=core.transitionSession(s,{type:'next'}); assert.throws(()=>core.transitionSession(s,answer()),/stale/); });
test('unknown actions and oversize session IDs fail', () => { assert.throws(()=>core.transitionSession(session(),{type:'skip_all'})); assert.throws(()=>core.createSession({id:'s'.repeat(89),profileId:'p',cardIds:['a']})); });

// Parent summaries, assets and layout advice.
test('empty summary has no invented success rate', () => { const r=core.summarizeProgress([],{profileId:'profile.demo',today:'2026-11-08'}); assert.equal(r.practiceSuccessRate,null); assert.equal(r.streakDays,0); assert.equal(r.days.length,7); });
test('daily goal counts unique cards rather than repeated attempts', () => { const r=core.summarizeProgress([event(),event({id:'event.2'})],{profileId:'profile.demo',today:'2026-11-08',goalCards:2}); assert.equal(r.todayGoal.completed,1); assert.equal(r.todayGoal.reached,false); });
test('streak stays active through today when last study was yesterday', () => { const r=core.summarizeProgress([event({at:'2026-11-07T02:00:00.000Z',day:'2026-11-07'})],{profileId:'profile.demo',today:'2026-11-08'}); assert.equal(r.streakDays,1); });
test('future events do not inflate present summary', () => { const r=core.summarizeProgress([event({at:'2026-11-09T02:00:00.000Z',day:'2026-11-09'})],{profileId:'profile.demo',today:'2026-11-08'}); assert.equal(r.totalCardsPracticed,0); });
test('asset manifest validates and links cards by stable IDs', () => { assert.equal(core.validateAssetManifest(manifest),manifest); assert.equal(core.auditContentAssets(catalog,manifest).ok,true); });
test('asset audit reports missing and mismatched resources', () => { assert.equal(core.auditContentAssets(catalog,{schemaVersion:1,assets:[]}).missing.length,1); const m=copy(manifest); m.assets[0].type='audio'; m.assets[0].path='animals/dog.mp3'; assert.equal(core.auditContentAssets(catalog,m).wrongTypes.length,1); });
test('rejects traversal, external URLs, querystrings and encoded paths', () => { for(const path of ['../dog.png','/dog.png','https://evil/dog.png','a\\dog.png','a/%2e%2e/dog.png','a/dog.png?x=1','a/./dog.png']) assert.throws(()=>core.safeAssetPath(path),path); });
test('rejects case-insensitive path collisions', () => { const m=copy(manifest); m.assets.push({...m.assets[0],id:'other',path:'animals/DOG.PNG'}); assert.throws(()=>core.validateAssetManifest(m),/unique/); });
test('responsive hints stay usable at narrow widths and text enlargement', () => { assert.equal(core.layoutHints({width:320}).columns,1); assert.equal(core.layoutHints({width:320,fontScale:2}).columns,1); assert.ok(core.layoutHints({width:1440}).columns>1); });
test('respects reduced motion and coarse-pointer targets', () => { const r=core.layoutHints({width:768,reducedMotion:true}); assert.equal(r.animationDurationMs,0); assert.equal(r.minimumTargetPx,48); });
test('rejects invalid sizing input', () => { assert.throws(()=>core.layoutHints({width:NaN})); assert.throws(()=>core.layoutHints({width:0})); assert.throws(()=>core.layoutHints({width:400,fontScale:0})); });
test('content accepts bounded explicit answer aliases and audio identifiers', () => { const c=copy(catalog); c.cards[0].acceptedAnswers=['dog','puppy']; c.cards[0].audioId='animal.dog.audio'; assert.equal(core.validateCatalog(c),c); });
test('due check includes today and overdue days, excludes future', () => { const r=core.newReview('animal.dog','2026-11-08'); assert.equal(core.isDue(r,'2026-11-08'),true); assert.equal(core.isDue(r,'2026-11-09'),true); assert.equal(core.isDue(r,'2026-11-07'),false); });
