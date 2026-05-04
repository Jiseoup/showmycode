# Portfolio Viewer

GitHub Private 레포지토리를 면접관에게 안전하게 공유할 수 있는 소스 코드 뷰어입니다.

## Features

- 파일 트리 + 소스 코드 뷰어 (신택스 하이라이팅)
- 커밋 히스토리
- Pull Request 목록
- 다크모드 지원
- GitHub PAT 서버사이드 보호 (클라이언트 노출 없음)

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Shiki](https://shiki.style/) (신택스 하이라이팅)
- [Vercel](https://vercel.com/) (배포)

---

## Getting Started

### 1. 레포지토리 클론

```bash
git clone https://github.com/your-username/showmycode.git
cd showmycode
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력합니다.

```bash
cp .env.example .env.local
```

```env
GITHUB_PAT=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=your-github-username
GITHUB_REPOS=repo-name-1,repo-name-2
```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

---

## GitHub PAT 발급 방법

1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens**
2. Repository access: 공개할 레포만 선택
3. Permissions 설정
   - **Contents**: Read-only
   - **Pull requests**: Read-only
4. 생성된 토큰을 `.env.local`의 `GITHUB_PAT`에 입력

> PAT는 절대 커밋하지 마세요. `.env.local`은 `.gitignore`에 포함되어 있습니다.

---

## Deployment (Vercel)

1. [Vercel](https://vercel.com)에 레포지토리 연결
2. 대시보드 → Settings → Environment Variables에 아래 3개 등록

| Key            | Value                        |
| -------------- | ---------------------------- |
| `GITHUB_PAT`   | GitHub Personal Access Token |
| `GITHUB_OWNER` | GitHub 유저명                |
| `GITHUB_REPOS` | 쉼표로 구분된 레포 이름 목록 |

3. Deploy

---

## 오픈소스 전환 체크리스트

### 보안

- [ ] `.env.local`이 `.gitignore`에 포함되어 있는지 확인
- [ ] `.env.example` 파일 생성 (실제 값 없이 키 이름만 포함)
- [ ] git log에 PAT 등 민감한 정보가 없는지 확인 (`git log --all`)
- [ ] `GITHUB_OWNER`, `GITHUB_REPOS` 환경 변수로만 제어되는지 확인

### 코드 정리

- [ ] 하드코딩된 개인 정보 제거 (이름, 이메일, URL 등)
- [ ] 불필요한 `console.log` 제거
- [ ] TypeScript 타입 오류 없는지 확인 (`npm run build`)
- [ ] 사용하지 않는 패키지 제거 (`npm prune`)

### 문서화

- [ ] `README.md` 작성 (이 파일)
- [ ] `.env.example` 작성
- [ ] `CONTRIBUTING.md` 작성 (기여 방법 안내)
- [ ] `LICENSE` 파일 추가 (MIT 권장)
- [ ] 주요 컴포넌트에 JSDoc 주석 추가

### GitHub 설정

- [ ] 레포지토리 Public으로 전환
- [ ] `Description` 및 `Topics` 태그 입력 (예: `nextjs`, `github-api`, `portfolio`)
- [ ] Issue 템플릿 추가 (`.github/ISSUE_TEMPLATE/`)
- [ ] PR 템플릿 추가 (`.github/pull_request_template.md`)
- [ ] `About` 섹션에 데모 URL 입력

### 선택 사항

- [ ] 데모 사이트 배포 후 README에 링크 추가
- [ ] 스크린샷 또는 GIF 데모 추가
- [ ] GitHub Actions CI 설정 (빌드 자동 검증)
