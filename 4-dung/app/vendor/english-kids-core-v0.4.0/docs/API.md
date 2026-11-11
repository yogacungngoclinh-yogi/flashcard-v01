# Public API, v0.4.0

Import from `src/index.js`. All domain operations are synchronous and dependency-free. No DOM, browser storage, filesystem, network, current-clock lookup, randomness from global Math.random, account or billing access occurs inside the core. Functions validate inputs with TypeError except native JSON/Intl failures. Caller supplies dates, time zone and deterministic seeds.

## Main entry points

| Function | Purpose |
| --- | --- |
| validateCatalog(catalog) | Fail on invalid bilingual content or prerequisite graphs. Returns original catalog; does not mutate it. |
| availableLessons(catalog, completedLessonIds) | Return uncompleted lessons whose prerequisites are complete. |
| normalizeAnswer(text, options) | Normalize case, Unicode NFC and whitespace; preserve accents/internal punctuation. |
| checkAnswer(answer, accepted, options) | Return `{correct, normalized}` for explicitly accepted text. |
| createChoiceActivity(catalog, cardId, options) | Build distinct-answer choices, 2–6 options. Requires enough distinct catalog answers. |
| createMatchingActivity(catalog, cardIds, seed) | Build bilingual matching exercise of 2–8 distinct cards. |
| newReview(cardId, today) | Create a card review state due today. |
| scheduleReview(previous, grade, today) | Return new state for `again`, `hard`, `good`, `easy`. Same-day repeats do not keep promoting stage. |
| isDue(review, today) | Check the due day. |
| buildDailyPlan(catalog, options) | Reviews first, then available unseen cards, with a 1–30 card cap and 0–cap new-card allowance. |
| createSession({id, profileId, cardIds}) | Create trusted in-memory session state. Use a globally unique opaque session ID no more than 88 characters. |
| transitionSession(state, action) | Apply answer/next/pause/resume/finish without mutating state. Unsupported actions fail; repeated/late actions no-op. |
| validateEvent(event) | Validate one practice event, including its explicit time zone. |
| mergeEvents(...lists) | Deduplicate exact events and sort stably. Conflicting content for an equal ID fails. |
| replayProgress(events, profileId) | Reconstruct spaced-review state for a single profile, independent of arrival order. |
| exportProgress(events, profileId) | Export allowlisted progress fields as plain JSON. |
| importProgress(json, expectedProfileId) | Validate schema/profile and return deduplicated events. Does not persist or overwrite anything. |
| summarizeProgress(events, options) | Day series, count-based daily goal, optional streak and practice-feedback success rate. |
| validateAssetManifest(manifest) | Check asset IDs, safe relative paths, extensions, required alt text and hash syntax. Does not read asset bytes. |
| auditContentAssets(catalog, manifest) | Report missing asset references and mismatched image/audio types. |
| layoutHints(options) | Advisory columns, touch targets, spacing and animation preferences. Does not render responsive UI. |
| dayInZone(instant, timeZone) | Convert canonical UTC timestamp to a chosen IANA time zone's day. |
| addDays(day, count), daysBetween(start, end) | Calendar arithmetic independent of DST. |
| shuffle(items, seed), seededRandom(seed) | Reproducible practice order only; not secure random generation. |

The exported validation helpers are implementation conveniences, not a replacement for backend authorization or full untrusted-session validation. Persist canonical events rather than accepting arbitrary computed `reviews` or `session` objects from outside the trust boundary.

## Known intentional behavior

- A planner only introduces cards listed in an available lesson. Complete prerequisite lessons explicitly in the host; learning one card does not complete a lesson.
- Unknown historical card IDs remain in progress exports/replay; planning ignores them. Host decides how to display retired curriculum content.
- Review schedule starts with 1, 3, 7, 14, 30 and 60-day stages. `again` becomes due the same day; this does not mean an unbounded session loop. `hard` becomes due tomorrow.
- Streak is display-only and does not reset at the start of today if yesterday was active. No rewards, penalties or access changes follow from a streak.
- A later event after travel may have an earlier local day. Review state keeps its latest local day to avoid moving the schedule backwards; reporting preserves the event's original day.
- `summarizeProgress` filters out local calendar days later than the supplied `today`. Dates across travel may therefore appear on different displayed days. A future full app should offer a consistent display/reporting time zone without rewriting source events.
- One unknown/corrupt event fails a merge or import rather than silently discarding history.
- Event IDs are not signatures. Never regard them as proof an event came from a trusted device.

Chapter quick-review APIs, scoring boundaries and snapshot persistence are documented in `CHAPTER-REVIEW.md`.

The finalized curriculum 1.4.0–1.4.2 adapter APIs and real-data validation are documented in `CURRICULUM-ADAPTER.md`.
