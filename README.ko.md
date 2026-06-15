<div align="center">
  <img src="app/icon.svg" width="120" />
  <h1>showmycode</h1>
  <p>
    <a href="README.md">English</a> | <b>한국어</b>
  </p>
</div>

자격 증명 노출 없이 비공개 GitHub 레포지토리를 안전하게 공유하세요.

**showmycode**는 특정 비공개 레포지토리에 대한 읽기 전용 접근을 제공하는 셀프 호스팅 코드 뷰어입니다.  
면접관, 협업자, 리뷰어에게 하나의 링크만 공유하면, GitHub 계정이나 PAT 없이도 코드, 커밋, 풀 리퀘스트를 탐색할 수 있습니다.

**[라이브 데모](https://showmycode.vercel.app)**

![demo](media/demo.gif)

## ✨ 주요 기능

- 📂 **코드 뷰어** — 파일 트리 브라우저와 구문 강조 (Shiki 기반 20개 이상 언어 지원)
- 📜 **커밋 히스토리** — 페이지네이션된 커밋 목록과 커밋별 상세 diff 뷰
- 🔀 **풀 리퀘스트** — PR 목록, 개요, 커밋, 변경된 파일 탭
- 🌿 **브랜치 셀렉터** — 브랜치를 전환하여 다른 코드 상태 탐색
- 🌙 **다크 모드** — 라이트/다크 테마 전환
- 🌐 **다국어 지원** — 한국어, 영어 인터페이스
- 📱 **모바일 지원** — 320px까지 완전 반응형 레이아웃
- 🔐 **접근 제어** — HMAC-SHA256 쿠키 인증 기반 선택적 공유 토큰
- 🛡️ **자격 증명 보호** — GitHub PAT는 서버 측에서만 사용되며 뷰어에게 노출되지 않음

## 🚀 나만의 사이트 배포하기

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jiseoup/showmycode&env=GITHUB_PAT,GITHUB_OWNER,GITHUB_REPOS,SHARE_TOKEN&envDescription=Required%20environment%20variables&envLink=https://github.com/Jiseoup/showmycode#environment-setup)

위 버튼을 클릭하면 이 레포지토리가 자동으로 복제되고, 환경 변수를 입력한 뒤 바로 Vercel에 배포할 수 있습니다.

## ⚙️ 환경 변수 설정

`.env.example`을 `.env.local`로 복사하고 값을 입력합니다:

```bash
cp .env.example .env.local
```

| 변수명             | 설명                                             | 필수 | 기본값 |
| ------------------ | ------------------------------------------------ | ---- | ------ |
| `GITHUB_PAT`       | Fine-grained GitHub 개인 액세스 토큰 (읽기 전용) | Yes  | —      |
| `GITHUB_OWNER`     | GitHub 사용자명 또는 조직명                      | Yes  | —      |
| `GITHUB_REPOS`     | 노출할 레포지토리 이름 (쉼표로 구분)             | Yes  | —      |
| `FILE_TREE_DEPTH`  | 파일 트리 기본 펼침 깊이 (`0` = 모두 접힘)       | No   | `0`    |
| `COMMITS_PER_PAGE` | 페이지당 커밋 수 (최대 `100`)                    | No   | `20`   |
| `PULLS_PER_PAGE`   | 페이지당 풀 리퀘스트 수 (최대 `100`)             | No   | `10`   |
| `SHARE_TOKEN`      | 공유 링크 접근 토큰 (비우면 공개 모드)           | No   | —      |

### 🔑 GitHub PAT 발급 방법

1. [GitHub Settings > Fine-grained tokens](https://github.com/settings/personal-access-tokens)로 이동
2. **Generate new token** 클릭
3. **Repository access**에서 공유할 레포지토리만 선택
4. 권한 설정:
   - **Contents** — Read-only
   - **Pull requests** — Read-only
5. 생성된 토큰을 `GITHUB_PAT`에 입력

> **주의:** PAT를 절대 커밋하지 마세요. `.env.local`은 `.gitignore`에 포함되어 있습니다.

## 🔒 접근 제어

showmycode는 `SHARE_TOKEN` 설정 여부에 따라 두 가지 모드를 지원합니다:

### 공개 모드 (`SHARE_TOKEN` 미설정)

모든 페이지에 인증 없이 접근할 수 있습니다. 데모 사이트나 오픈 포트폴리오에 적합합니다.

### 토큰 모드 (`SHARE_TOKEN` 설정)

모든 페이지에 인증이 필요합니다. 두 가지 방법으로 인증할 수 있습니다:

1. **공유 링크** — URL에 `?token=<SHARE_TOKEN>`을 추가합니다. 토큰이 검증되고, 보안 쿠키가 설정된 후, URL에서 토큰이 제거된 상태로 리다이렉트됩니다.

   ```
   https://your-domain.com/?token=your-secret-token
   ```

2. **수동 입력** — 유효한 토큰이 없는 방문자는 토큰 입력 페이지로 리다이렉트됩니다.

인증 후 30일간 `httpOnly` 쿠키로 세션이 유지됩니다.  
쿠키에는 원본 토큰이 아닌 HMAC-SHA256 다이제스트가 저장되므로, 쿠키가 유출되더라도 공유 토큰이 직접 노출되지 않습니다.

## 🏁 시작하기

```bash
git clone https://github.com/Jiseoup/showmycode.git
cd showmycode
npm install
cp .env.example .env.local  # 값을 입력하세요
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 앱을 확인할 수 있습니다.

### 사용 가능한 스크립트

```bash
npm run dev             # 개발 서버 시작
npm run build           # 프로덕션 빌드
npm run start           # 프로덕션 서버 시작
npm run lint            # ESLint 실행
npm run lint:fix        # ESLint --fix 실행
npm run format          # Prettier 실행 (Tailwind 클래스 정렬 포함)
npm run format:check    # 포맷 검사 (CI에서 사용)
npm run typecheck       # tsc --noEmit 실행
```

## 🛠️ 기술 스택

- [Next.js 16](https://nextjs.org/) (App Router, React 19)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Shiki](https://shiki.style/) (구문 강조)
- [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)
- [Vercel](https://vercel.com/) (배포)

## 🔍 작동 방식

```
뷰어 → showmycode (서버 컴포넌트) → GitHub API (PAT 사용)
```

모든 GitHub API 호출은 서버 측에서 이루어집니다. PAT는 브라우저에 전달되지 않습니다.  
레포지토리 접근은 `GITHUB_REPOS`에 나열된 레포로 제한되며, 목록에 없는 레포는 404를 반환합니다.

GitHub 응답은 60초 동안 캐시되므로, 뷰어에게 표시되는 데이터는 최대 1분까지 지연될 수 있습니다.

## 🤝 기여하기

기여를 환영합니다! 브랜치, 커밋 메시지, PR 프로세스에 대한 가이드라인은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고해주세요.

## 📄 라이선스

[MIT](LICENSE) © 2026 JISUB LIM
