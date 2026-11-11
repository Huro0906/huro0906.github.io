(() => {
  const bar = document.querySelector('[data-progress]');
  if (!bar) return;
  const root = bar.parentElement;
  // 막대는 매끄럽게 늘지 않고 1/STEPS 칸씩 계단처럼 늘어납니다.
  const STEPS = 40;
  let queued = false;

  const update = () => {
    queued = false;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 1;
    const value = Math.round(ratio * STEPS) / STEPS;
    root.style.setProperty('--progress', String(value));
    bar.dataset.value = String(value);
  };

  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
})();
