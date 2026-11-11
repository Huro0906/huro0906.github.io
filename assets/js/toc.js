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

  // 소제목이 화면 위쪽 이 선(px)을 넘으면 그 소제목을 읽는 중으로 봅니다.
  const LINE = 48;
  let current = null;

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
    const doc = document.documentElement;
    const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= doc.scrollHeight - 2;
    let active = headings[0];
    for (const h of headings) {
      const top = h.getBoundingClientRect().top;
      if (top <= LINE || (atBottom && top < window.innerHeight)) active = h;
      else if (!atBottom) break;
    }
    setActive(active);
  };

  const observer = new IntersectionObserver(update, { rootMargin: `-${LINE}px 0px 0px 0px`, threshold: [0, 1] });
  headings.forEach((h) => observer.observe(h));
  const footer = document.querySelector('.site-footer');
  if (footer) observer.observe(footer);
  update();
})();
