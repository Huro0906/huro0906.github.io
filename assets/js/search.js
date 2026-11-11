(() => {
  const dialog = document.querySelector('[data-search]');
  if (!dialog) return;
  const input = dialog.querySelector('[data-search-input]');
  const list = dialog.querySelector('[data-search-results]');
  const status = dialog.querySelector('[data-search-status]');

  // Fuse.js 는 검색 팝업을 처음 열 때만 불러옵니다. 버전을 바꾸면 THIRD_PARTY_NOTICES.md 도 함께 고칩니다.
  const FUSE_URL = 'https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.min.js';
  const MAX_RESULTS = 8;
  const SNIPPET_RADIUS = 40;
  const MESSAGES = {
    loading: '검색 색인을 불러오는 중입니다.',
    empty: '찾을 낱말을 입력하세요.',
    none: '일치하는 글이 없습니다.',
    error: '검색 색인을 불러오지 못했습니다. 잠시 뒤 다시 열어 주세요.',
  };

  let loading = null;
  let fuse = null;
  let results = [];
  let selected = -1;

  const loadFuse = () => new Promise((resolve, reject) => {
    if (window.Fuse) {
      resolve(window.Fuse);
      return;
    }
    const script = document.createElement('script');
    script.src = FUSE_URL;
    script.crossOrigin = 'anonymous';
    script.async = true;
    script.addEventListener('load', () => (window.Fuse ? resolve(window.Fuse) : reject(new Error('Fuse.js 를 찾지 못했습니다.'))));
    script.addEventListener('error', () => reject(new Error('Fuse.js 를 불러오지 못했습니다.')));
    document.head.append(script);
  });

  const loadIndex = async () => {
    const res = await fetch(dialog.dataset.indexUrl, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`검색 색인 응답 ${res.status}`);
    return res.json();
  };

  // 색인과 Fuse.js 를 한 번만 준비합니다. 실패하면 다음에 팝업을 열 때 다시 시도합니다.
  const prepare = () => {
    if (!loading) {
      loading = Promise.all([loadIndex(), loadFuse()]).then(([items, Fuse]) => {
        fuse = new Fuse(items, {
          keys: [
            { name: 'title', weight: 0.45 },
            { name: 'tags', weight: 0.2 },
            { name: 'categories', weight: 0.1 },
            { name: 'series', weight: 0.05 },
            { name: 'content', weight: 0.2 },
          ],
          ignoreLocation: true,
          threshold: 0.3,
          minMatchCharLength: 1,
        });
      }).catch((error) => {
        loading = null;
        throw error;
      });
    }
    return loading;
  };

  const setStatus = (text) => {
    status.textContent = text;
    status.hidden = !text;
  };

  const select = (index) => {
    const items = list.children;
    if (!items.length) {
      selected = -1;
      input.removeAttribute('aria-activedescendant');
      return;
    }
    selected = (index + items.length) % items.length;
    for (let i = 0; i < items.length; i++) items[i].setAttribute('aria-selected', String(i === selected));
    const current = items[selected];
    input.setAttribute('aria-activedescendant', current.id);
    current.scrollIntoView({ block: 'nearest' });
  };

  const go = (index) => {
    const item = results[index];
    if (item) window.location.assign(item.url);
  };

  // 일치한 낱말 주변의 본문을 잘라 보여 줍니다. 본문에 없으면 요약을 씁니다.
  const snippetOf = (item, query) => {
    const content = item.content || '';
    const at = content.toLowerCase().indexOf(query.toLowerCase());
    if (at < 0) return item.summary || content.slice(0, SNIPPET_RADIUS * 2);
    const start = Math.max(0, at - SNIPPET_RADIUS);
    const end = Math.min(content.length, at + query.length + SNIPPET_RADIUS);
    return `${start > 0 ? '…' : ''}${content.slice(start, end)}${end < content.length ? '…' : ''}`;
  };

  const metaOf = (item) => {
    const parts = [item.date.replaceAll('-', '.')];
    if (item.categories?.length) parts.push(item.categories.join(', '));
    if (item.tags?.length) parts.push(item.tags.map((t) => `#${t}`).join(' '));
    return parts.join(' · ');
  };

  const render = () => {
    const query = input.value.trim();
    results = [];
    if (!fuse) {
      list.replaceChildren();
      select(-1);
      return;
    }
    if (!query) {
      list.replaceChildren();
      select(-1);
      input.setAttribute('aria-expanded', 'false');
      setStatus(MESSAGES.empty);
      return;
    }
    results = fuse.search(query, { limit: MAX_RESULTS }).map((r) => r.item);
    list.replaceChildren(...results.map((item, i) => {
      const li = document.createElement('li');
      li.className = 'search-result';
      li.id = `search-result-${i}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      const title = document.createElement('span');
      title.className = 'search-result-title';
      title.textContent = item.title;
      const meta = document.createElement('span');
      meta.className = 'search-result-meta';
      meta.textContent = metaOf(item);
      const snippet = document.createElement('span');
      snippet.className = 'search-result-snippet';
      snippet.textContent = snippetOf(item, query);
      li.append(title, meta, snippet);
      li.addEventListener('click', () => go(i));
      li.addEventListener('mousemove', () => {
        if (selected !== i) select(i);
      });
      return li;
    }));
    input.setAttribute('aria-expanded', String(results.length > 0));
    setStatus(results.length ? '' : MESSAGES.none);
    select(0);
  };

  const open = () => {
    if (dialog.open) return;
    dialog.showModal();
    input.focus();
    input.select();
    if (fuse) {
      render();
      return;
    }
    list.replaceChildren();
    select(-1);
    setStatus(MESSAGES.loading);
    prepare().then(render, () => {
      list.replaceChildren();
      select(-1);
      setStatus(MESSAGES.error);
    });
  };

  input.addEventListener('input', render);
  input.addEventListener('keydown', (event) => {
    // 한글 조합 중에 누른 Enter 와 방향키는 조합을 끝내는 데 쓰이므로 건너뜁니다.
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (list.children.length) select(selected + (event.key === 'ArrowDown' ? 1 : -1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (selected >= 0) go(selected);
    }
  });

  for (const button of document.querySelectorAll('[data-search-open]')) {
    button.addEventListener('click', open);
  }
  dialog.querySelector('[data-search-close]')?.addEventListener('click', () => dialog.close());

  // 대화 상자 바깥의 어두운 영역을 누르면 닫습니다.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      const inside = event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
      if (!inside) dialog.close();
    }
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (dialog.open) dialog.close();
      else open();
    }
  });
})();
