import { id, integer, invariant } from './contracts.js';
import { normalizeAnswer } from './answers.js';
import { validateCatalog } from './content.js';
import { shuffle } from './random.js';
export function createChoiceActivity(catalog, cardId, { language = 'en', count = 4, seed = cardId } = {}) {
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
export function createMatchingActivity(catalog, cardIds, seed = 'matching') {
  validateCatalog(catalog);
  invariant(Array.isArray(cardIds) && cardIds.length >= 2 && cardIds.length <= 8 && new Set(cardIds).size === cardIds.length, 'matching requires 2–8 unique card IDs');
  const cards = cardIds.map(cardId => {
    const card = catalog.cards.find(item => item.id === cardId);
    invariant(card, `unknown card ${cardId}`); return card;
  });
  for (const language of ['en', 'vi']) invariant(new Set(cards.map(card => normalizeAnswer(card[language], { locale: language }))).size === cards.length, 'matching labels must be distinct');
  return { type: 'matching', left: shuffle(cards, `${seed}:left`).map(card => ({ id: card.id, label: card.en })), right: shuffle(cards, `${seed}:right`).map(card => ({ id: card.id, label: card.vi })) };
}
