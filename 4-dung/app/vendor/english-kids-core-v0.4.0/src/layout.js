import { invariant } from './contracts.js';
/** Advisory values only. Final host layout still needs real browser/device QA. */
export function layoutHints({ width, fontScale = 1, reducedMotion = false, coarsePointer = true }) {
  invariant(Number.isFinite(width) && width > 0, 'width must be positive');
  invariant(Number.isFinite(fontScale) && fontScale >= 1 && fontScale <= 4, 'fontScale must be from 1 to 4');
  invariant(typeof reducedMotion === 'boolean' && typeof coarsePointer === 'boolean', 'input preferences must be booleans');
  const gap = 16; const padding = width < 360 ? 12 : 24;
  const minCard = 160 * fontScale;
  const columns = Math.max(1, Math.min(5, Math.floor((width - padding * 2 + gap) / (minCard + gap))));
  return { columns, gap, padding, minimumTargetPx: coarsePointer ? 48 : 44, animationDurationMs: reducedMotion ? 0 : 160, maxContentWidth: 1280, preferStackedControls: width / fontScale < 600 };
}
