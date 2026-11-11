import { boundedArray, id, integer, invariant, record, text, unique, VERSION } from './contracts.js';
export function validateCatalog(catalog) {
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
export function availableLessons(catalog, completedLessonIds = []) {
  validateCatalog(catalog);
  boundedArray(completedLessonIds, 'completedLessonIds');
  const completed = new Set(completedLessonIds);
  return catalog.lessons.filter(lesson => !completed.has(lesson.id) && (lesson.prerequisiteIds ?? []).every(value => completed.has(value)));
}
