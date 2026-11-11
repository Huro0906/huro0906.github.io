# 서드파티 고지

이 블로그는 외부 Hugo 테마를 쓰지 않고 `layouts/` 와 `assets/` 에 있는 자체 테마로 만듭니다. 아래 표는 테마를 만들면서 참고했거나, 사이트가 실행 중에 불러오는 외부 프로젝트와 그 라이선스를 정리한 것입니다.

| 프로젝트 | 버전 | 라이선스 | 쓰는 방식 |
| --- | --- | --- | --- |
| [Blowfish](https://github.com/nunocoracao/blowfish) | 해당 없음 | MIT | 홈 첫 화면(profile 레이아웃)의 구성만 참고했습니다. |
| [Tokyo Night](https://github.com/folke/tokyonight.nvim) | 해당 없음 | MIT | 색 토큰에 tokyonight-day, tokyonight-night 팔레트의 색 값을 씁니다. |
| [Fuse.js](https://github.com/krisk/Fuse) | 7.1.0 | Apache-2.0 | 검색 팝업을 처음 열 때 jsDelivr 에서 불러옵니다. |
| [Mermaid](https://github.com/mermaid-js/mermaid) | 11.4.1 | MIT | mermaid 코드 블록이 있는 글에서만 jsDelivr 에서 불러옵니다. |
| [Galmuri](https://github.com/quiple/galmuri) | 2.40.3 | OFL-1.1 | 제목과 라벨의 픽셀 글꼴로 jsDelivr 에서 불러옵니다. |
| [Pretendard](https://github.com/orioncactus/pretendard) | 1.3.9 | OFL-1.1 | 본문 글꼴로 jsDelivr 에서 불러옵니다. |

## Blowfish

- 저장소: https://github.com/nunocoracao/blowfish
- 라이선스: MIT License
- Blowfish 의 profile 홈 레이아웃이 프로필 사진, 이름, 한 줄 소개, 링크를 가운데에 모아 보여 주는 구성을 참고했습니다.
- Blowfish 의 템플릿, 스타일시트, 스크립트, 이미지 파일은 이 저장소에 복사하지 않았습니다. 해당 구성은 `layouts/_partials/hero.html` 과 `assets/css/main.css` 에 새로 작성했습니다.

## Tokyo Night

- 저장소: https://github.com/folke/tokyonight.nvim
- 라이선스: MIT License
- `assets/css/main.css` 의 색 토큰과 `assets/css/chroma.css` 의 코드 강조 색에 tokyonight-day 와 tokyonight-night 팔레트의 색 값을 씁니다. 명암비를 맞추려고 바꾼 값은 `assets/css/main.css` 의 주석에 이유를 적었습니다.

## Fuse.js

- 저장소: https://github.com/krisk/Fuse
- 버전: 7.1.0
- 라이선스: Apache License 2.0
- 불러오는 주소: `https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.min.js` (`assets/js/search.js`)
- 파일을 이 저장소에 포함하지 않고, 방문자의 브라우저가 검색 팝업을 처음 열 때 내려받습니다.

## Mermaid

- 저장소: https://github.com/mermaid-js/mermaid
- 버전: 11.4.1
- 라이선스: MIT License
- 불러오는 주소: `https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs` (`assets/js/mermaid.js`)
- 파일을 이 저장소에 포함하지 않고, mermaid 코드 블록이 있는 글을 열 때만 방문자의 브라우저가 내려받습니다.

## Galmuri

- 저장소: https://github.com/quiple/galmuri
- 버전: 2.40.3
- 라이선스: SIL Open Font License 1.1
- 불러오는 주소: `https://cdn.jsdelivr.net/npm/galmuri@2.40.3/dist/galmuri.css` (`layouts/_partials/head.html`)

## Pretendard

- 저장소: https://github.com/orioncactus/pretendard
- 버전: 1.3.9
- 라이선스: SIL Open Font License 1.1
- 불러오는 주소: `https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css` (`layouts/_partials/head.html`)
