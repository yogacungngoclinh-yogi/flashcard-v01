# Change log

## 0.4.0 · 2026-11-08

Expanded verified schema support to 1.4.1 and 1.4.2. Full finalized v7 compatibility: 365 lessons, 60 units, 320 targets, 60 quick reviews/180 questions and 16 structured challenges. Added provenance-reference validation without mastery inference, focus-stage memory tips/glossary, and explicit mixed-language handling.

169 tests pass. Full v7 simulation includes 180 validated snapshot round trips; both supplied v5/v7 JSON schemas pass. Original source files and app remain untouched. Two four-event source sequences stay intact, while five optional post-course cards are not additional numbered lessons. Prior release archives are preserved.

## 0.3.0 · 2026-11-08

Added a narrow adapter for finalized curriculum v5/schema 1.4.0, preserving source unit/lesson/card/question IDs. Added question-scoped review outcomes rather than invented per-word mastery, age/shortening-aware observation paths, source snapshot restoration, structured challenge grading and view models.

157 tests pass. All 10 real authored quick reviews (30 questions) run in the standalone core; 30 snapshot round trips and 10 structured challenges verify. The author-supplied JSON schema validates with zero errors. Includes a byte-identical input fixture and reproducible integration report. Original app and prior release archives remain untouched.

## 0.2.0 · 2026-11-08

Added an independent chapter quick-review core with introduced-content filtering, focused recap, five-round authored activity contract, exact versus adult-observation assessment, optional hints, skipped/deferred rounds, finite retries, assisted/unassisted reporting, display-safe question view models, reduced-motion/audio-availability cues, and validated replay snapshots for same-round resume.

126 tests passed. Includes 56 new chapter-review checks plus the previous 70 core checks. Source syntax checks and both synthetic demos passed. No app integration, rendered UI, real audio, production storage adapter or full curriculum adapter has been verified.

The original 0.1.0 release archive is preserved separately.

## 0.1.0 · 2026-11-08

Initial independent dependency-free core with content/asset validation, bilingual answer normalization, activities, spaced review, daily plans, session controls, event merge/import/export, reporting and responsive hints. 70 tests passed. Saved separately as the initial preparation checkpoint.
