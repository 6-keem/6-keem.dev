// easeInOutCubic
const easing = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function smoothScrollTo(targetY: number, durationMs = 900) {
  if (typeof window === 'undefined') return;
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (distance === 0) return;
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / durationMs, 1);
    window.scrollTo(0, startY + distance * easing(t));
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
