(() => {
  const root = document.documentElement;
  const KEY = 'theme';

  const apply = (button, theme) => {
    const dark = theme === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? '라이트 모드로 바꾸기' : '다크 모드로 바꾸기');
    button.textContent = dark ? '라이트' : '다크';
  };

  const init = () => {
    const button = document.querySelector('[data-theme-toggle]');
    if (!button) return;
    apply(button, root.dataset.theme);
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        root.dataset.theme = 'dark';
      } else {
        delete root.dataset.theme;
      }
      try {
        localStorage.setItem(KEY, next);
      } catch (e) {}
      apply(button, next);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
