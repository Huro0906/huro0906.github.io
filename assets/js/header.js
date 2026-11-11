(() => {
  const wrap = document.querySelector('.site-header-wrap');
  const header = wrap && wrap.querySelector('.site-header');
  if (!header) return;
  const root = document.documentElement;
  // 헤더와 그 아래 내용 사이에 두는 간격(px)입니다.
  const GAP = 12;

  // 목차와 소제목 위치가 헤더 높이를 따르도록, 헤더를 잴 때마다 두 CSS 변수를 다시 씁니다.
  // --header-offset: 화면 위에서 헤더 아래 간격까지의 거리입니다. 헤더가 고정되지 않으면 GAP 만 남깁니다.
  // --header-space: 헤더가 문서 흐름에서 차지하는 높이(margin-top 포함)입니다.
  const measure = () => {
    const style = getComputedStyle(wrap);
    const height = header.getBoundingClientRect().height;
    const sticky = style.position === 'sticky';
    const top = parseFloat(style.top) || 0;
    const marginTop = parseFloat(style.marginTop) || 0;
    const offset = sticky ? Math.ceil(top + height + GAP) : GAP;
    root.style.setProperty('--header-offset', `${offset}px`);
    root.style.setProperty('--header-space', `${Math.round((marginTop + height) * 100) / 100}px`);
  };

  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(header);
  window.matchMedia('(max-width: 600px)').addEventListener('change', measure);
  window.addEventListener('resize', measure);
  if (document.fonts) document.fonts.ready.then(measure);
  measure();
})();
