# 이것저것

[Hugo](https://gohugo.io/) 0.169.0 extended 로 만드는 개인 블로그입니다. 외부 테마 없이 `layouts/` 와 `assets/` 에 있는 자체 테마를 씁니다.

## 로컬에서 실행하기

```bash
hugo server
```

`http://localhost:1313/` 에서 미리 볼 수 있습니다. 초안까지 보려면 `hugo server -D` 를 실행합니다.

## 빌드하기

배포 workflow 와 같은 플래그로 빌드합니다. 폐기 예정 설정이나 함수를 쓰면 경고 때문에 빌드가 실패합니다.

```bash
hugo --gc --minify --panicOnWarning
```

결과물은 `public/` 에 생성되며, 이 디렉터리는 git 이 추적하지 않습니다.

## 글 쓰기

글은 `content/posts/` 에 Markdown 파일로 둡니다. 글 주소는 `/posts/<slug>/` 입니다.

```toml
+++
title = '글 제목'
date = 2026-11-11T20:00:00+09:00
slug = 'my-first-post'
tags = ['hugo', '블로그']
categories = ['기록']
+++

본문을 여기에 씁니다.
```

## 배포

`main` 브랜치에 push 하면 GitHub Actions(`.github/workflows/pages-deploy.yml`)가 사이트를 빌드해서 GitHub Pages 에 배포합니다.
