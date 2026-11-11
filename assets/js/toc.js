(() => {
  const toc = document.querySelector('[data-toc]');
  if (!toc) return;
  const details = toc.querySelector('details');
  const links = new Map();
  for (const a of toc.querySelectorAll('a[href^="#"]')) {
    links.set(decodeURIComponent(a.hash.slice(1)), a);
  }
  const headings = [...document.querySelectorAll('.prose h2[id], .prose h3[id]')].filter((h) => links.has(h.id));
  if (!headings.length) return;

  // 넓은 화면에서는 목차를 항상 펼치고, 좁은 화면에서는 접은 상태로 시작합니다.
  const wide = window.matchMedia('(min-width: 1100px)');
  const syncOpen = () => { details.open = wide.matches; };
  syncOpen();
  wide.addEventListener('change', syncOpen);

  // 소제목이 판정선을 넘으면 그 소제목을 읽는 중으로 봅니다.
  // 판정선은 헤더 높이를 따르는 --header-offset 에 8px 를 더한 값이고, 헤더 높이가 바뀔 수 있어 매번 다시 읽습니다.
  // 소수점 높이 때문에 판정이 빗나가지 않도록 2px 여유를 둡니다.
  const SLACK = 2;
  const readLine = () => {
    const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-offset'));
    return (Number.isFinite(offset) ? offset : 0) + 8 + SLACK;
  };

  let current = null;
  let queued = false;
  const setActive = (heading) => {
    if (heading === current) return;
    if (current) {
      const prev = links.get(current.id);
      prev.classList.remove('is-active');
      prev.removeAttribute('aria-current');
    }
    current = heading;
    const link = links.get(heading.id);
    link.classList.add('is-active');
    link.setAttribute('aria-current', 'true');
  };

  const update = () => {
    queued = false;
    const line = readLine();
    const doc = document.documentElement;
    // 페이지 끝에 닿으면 끝까지 올라오지 못한 소제목도 읽는 중으로 보도록, 화면 안의 마지막 소제목을 고릅니다.
    const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= doc.scrollHeight - 2;
    let active = headings[0];
    for (const h of headings) {
      const top = h.getBoundingClientRect().top;
      if (top <= line || (atBottom && top < window.innerHeight)) active = h;
      else if (!atBottom) break;
    }
    setActive(active);
  };

  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  toc.addEventListener('click', (event) => {
    if (event.target.closest('a[href^="#"]')) schedule();
  });
  update();
})();
