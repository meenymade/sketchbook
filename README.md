# 갤러리 사용 가이드

## 폴더 구조

```
gallery/
├── index.html         (건드릴 필요 없음)
├── styles.css          (디자인, 건드릴 필요 없음)
├── app.js              (렌더링 로직, 건드릴 필요 없음)
├── works-data.js        ← 작업물 추가할 때 이 파일만 수정
└── works/
    ├── piece-01-drift.html
    ├── piece-02-counter.html
    └── piece-03-grid.html   (샘플 작업물 3개. 마음대로 지우거나 참고만 해도 됨)
```

## 새 작업물 추가하는 법

1. 만든 html 파일을 `works/` 폴더 안에 넣습니다. (예: `works/my-new-piece.html`)
2. `works-data.js`를 열어서 `WORKS` 배열 맨 아래에 항목을 하나 추가합니다.

```js
{
  number: "04",
  title: "작업물 제목",
  tag: "Visual",              // Visual / Interactive / App 등 자유롭게
  year: "2026",
  description: "한두 문장 설명.",
  url: "works/my-new-piece.html"
}
```

3. 저장하고 `index.html`을 새로고침하면 갤러리에 바로 나타납니다.

이후로는 Claude에게 "works 폴더에 이 html 파일 넣고, 갤러리에 '제목: OO, 태그: Visual'로 추가해줘" 라고 요청하면 매번 이 작업을 대신 해줄 수 있습니다.

## 로컬에서 미리보기

`index.html` 파일을 더블클릭해서 브라우저로 열면 바로 확인할 수 있습니다.

---

## 호스팅 추천 (유지비 0원 기준)

개인 갤러리처럼 트래픽이 많지 않은 정적 사이트는 아래 세 곳 모두 **완전 무료**로 운영할 수 있습니다. 서버 관리가 필요 없고, 월 비용도 없습니다.

### 1순위 — GitHub Pages
- 완전 무료, 트래픽 제한도 넉넉함
- `gallery` 폴더를 GitHub 저장소에 올리기만 하면 자동으로 웹사이트가 됩니다
- Claude Code를 쓰면 "이 폴더 GitHub에 올리고 Pages로 배포해줘" 한 마디로 연결 가능
- 주소는 `내아이디.github.io/저장소이름` 형태 (커스텀 도메인 연결도 가능)

**순서 요약**
1. github.com에서 새 저장소 생성 (public)
2. `gallery` 폴더 안의 파일들을 저장소에 업로드 (웹 브라우저에서 드래그앤드롭으로도 가능)
3. 저장소 Settings → Pages → Branch를 `main`으로 설정하고 저장
4. 몇 분 뒤 `https://내아이디.github.io/저장소이름` 으로 접속 확인

### 2순위 — Netlify
- 가입 후 폴더를 웹사이트에 그냥 드래그앤드롭하면 몇 초 만에 배포됨 (git 몰라도 됨)
- 무료 플랜으로 개인 사이트 운영에 충분
- `내프로젝트.netlify.app` 주소를 무료로 받고, 커스텀 도메인도 연결 가능

**순서 요약**
1. netlify.com 가입
2. 대시보드에서 "Deploy manually" 영역에 `gallery` 폴더 통째로 드래그앤드롭
3. 바로 주소 생성됨. 이후 파일이 바뀔 때마다 다시 드래그앤드롭하거나 GitHub 연동으로 자동화 가능

### 3순위 — Cloudflare Pages
- GitHub Pages와 거의 동일한 방식, 무료, 속도가 조금 더 빠른 편
- 이미 Cloudflare를 쓰고 있다면 고려할 만함

### 커스텀 도메인을 쓰고 싶다면
`내이름.com` 같은 도메인은 연 1~2만원 정도로 구매 가능하고 (가비아, 후이즈, Namecheap 등), 위 세 서비스 모두 무료로 연결할 수 있습니다. 도메인 비용 외에는 추가 유지비가 없습니다.

**결론:** git이 아예 낯설다면 Netlify 드래그앤드롭으로 시작하고, 나중에 Claude Code로 자동화하고 싶어지면 GitHub Pages로 옮기는 걸 추천합니다.
