export const catalog = {
  schemaVersion: 1,
  cards: [
    { id: 'animal.dog', topicId: 'animals', en: 'dog', vi: 'con chó', level: 1, imageId: 'animal.dog.image' },
    { id: 'animal.cat', topicId: 'animals', en: 'cat', vi: 'con mèo', level: 1 },
    { id: 'animal.bird', topicId: 'animals', en: 'bird', vi: 'con chim', level: 1 },
    { id: 'animal.fish', topicId: 'animals', en: 'fish', vi: 'con cá', level: 1 },
    { id: 'color.red', topicId: 'colors', en: 'red', vi: 'màu đỏ', level: 1 },
    { id: 'color.blue', topicId: 'colors', en: 'blue', vi: 'màu xanh dương', level: 1 }
  ],
  lessons: [
    { id: 'lesson.animals', title: 'Động vật quanh em', estimatedMinutes: 5, cardIds: ['animal.dog', 'animal.cat', 'animal.bird', 'animal.fish'], prerequisiteIds: [] },
    { id: 'lesson.colors', title: 'Màu sắc', estimatedMinutes: 4, cardIds: ['color.red', 'color.blue'], prerequisiteIds: ['lesson.animals'] }
  ]
};
export const event = (override = {}) => ({ id: 'event.1', profileId: 'profile.demo', cardId: 'animal.dog', sessionId: 'session.1', at: '2026-11-08T02:00:00.000Z', day: '2026-11-08', timeZone: 'Asia/Ho_Chi_Minh', grade: 'good', durationMs: 10000, ...override });
export const manifest = { schemaVersion: 1, assets: [{ id: 'animal.dog.image', path: 'animals/dog.png', type: 'image', altEn: 'A dog', altVi: 'Một con chó', sha256: 'a'.repeat(64) }] };
export const copy = value => structuredClone(value);
