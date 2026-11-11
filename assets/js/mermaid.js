import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs';

// mermaid 코드 블록이 있는 페이지에서만 불러옵니다. 버전을 바꾸면 THIRD_PARTY_NOTICES.md 도 함께 고칩니다.
const root = document.documentElement;
const blocks = [...document.querySelectorAll('pre.mermaid')];

const token = (name) => getComputedStyle(root).getPropertyValue(name).trim();

// 색은 main.css 의 토큰에서 읽어 라이트와 다크 모드에 맞춥니다.
const config = () => {
  const dark = root.dataset.theme === 'dark';
  return {
    startOnLoad: false,
    securityLevel: 'strict',
    // 글자를 HTML 대신 SVG text 로 그려서 본문 문단(.prose p) 스타일이 다이어그램에 섞이지 않게 합니다.
    htmlLabels: false,
    flowchart: { htmlLabels: false },
    theme: dark ? 'dark' : 'default',
    themeVariables: {
      darkMode: dark,
      background: token('--paper'),
      fontFamily: token('--font-body'),
      primaryColor: token('--surface'),
      mainBkg: token('--surface'),
      nodeBorder: token('--border'),
      nodeTextColor: token('--ink'),
      clusterBkg: token('--bg'),
      clusterBorder: token('--border'),
      titleColor: token('--ink'),
      primaryTextColor: token('--ink'),
      primaryBorderColor: token('--border'),
      secondaryColor: token('--paper'),
      secondaryTextColor: token('--ink'),
      secondaryBorderColor: token('--border'),
      tertiaryColor: token('--bg'),
      tertiaryTextColor: token('--ink'),
      tertiaryBorderColor: token('--border'),
      lineColor: token('--border'),
      textColor: token('--ink'),
      edgeLabelBackground: token('--paper'),
    },
  };
};

// 처음 그리기 전에 원문을 저장해 두고, 다시 그릴 때마다 원문으로 되돌립니다.
for (const block of blocks) block.dataset.source = block.textContent;

const draw = async () => {
  mermaid.initialize(config());
  for (const block of blocks) {
    block.removeAttribute('data-processed');
    block.textContent = block.dataset.source;
  }
  await mermaid.run({ nodes: blocks, suppressErrors: true });
};

// 테마 버튼을 빠르게 여러 번 눌러도 그리기가 겹치지 않도록 차례대로 실행합니다.
let queue = Promise.resolve();
const schedule = () => {
  queue = queue.then(draw).catch((error) => console.warn('Mermaid 다이어그램을 그리지 못했습니다.', error));
};

if (blocks.length) {
  schedule();
  new MutationObserver(schedule).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
}
