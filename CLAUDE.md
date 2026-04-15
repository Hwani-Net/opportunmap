# OpportuMap — Project Rules

> 이 파일이 글로벌 CLAUDE.md보다 우선합니다.

## 프로젝트 개요
공모전/해커톤/예창패/지원금 통합 캘린더 웹 서비스.
Firebase 기반. PRD: `PRD.md` 참조.

## 파이프라인 (11단계, 순서 엄수)

| Step | 이름 | 동작 |
|------|------|------|
| 0 | 디자인 | Stitch MCP → DESIGN.md 산출 |
| 1 | 코드작성 | 기능 구현 또는 버그 수정 |
| 2 | 린트 | ESLint + TypeScript 에러 0 |
| 3 | 테스트 | 유닛 + E2E 테스트 통과 |
| 4 | 커밋 | Conventional Commits 형식 |
| 5 | 품질루프 | 5패스(기능/보안/성능/UX/페인포인트) × 2라운드 saturation |
| 6 | 스크린샷 | Playwright 주요 화면 캡처 |
| 7 | 교차검수 | 외부 모델 코드 리뷰 (Codex + GPT-4.1) |
| 8 | 빌드 | `npm run build` 에러 0 |
| 9 | 배포 | Firebase Hosting deploy |
| 10 | 스모크테스트 | 라이브 URL HTTP 200 + 주요 기능 동작 확인 |
| 11 | 검증 | Playwright 스크린샷 + 디자인 5패스 × 2라운드 saturation |

### 품질루프 상세 (Step 5)
| Pass | 관점 | 검토 항목 |
|------|------|----------|
| 1 | 기능 | 테스트 통과, 빌드 성공 |
| 2 | 보안 | OWASP Top 10, 시크릿 노출 |
| 3 | 성능 | 불필요한 반복, 메모리 누수, 번들 크기 |
| 4 | UX/접근성 | 버튼·링크 동작, 네비게이션, 폼, a11y |
| 5 | 페인포인트 | 사용자가 막히는 곳 관점 |

### 통과 기준
- 각 단계 FAIL → 자동 수정 → 재시도. skip 금지.
- 품질루프: 2라운드 연속 ALL PASS일 때만 통과 (saturation)
- 교차검수: 외부 모델 평균 7/10 미만이면 FAIL
- 배포 후 검증 없이 보고 금지
- 에러 억제 금지: try-catch로 에러 숨기기, throw 제거 시 FAIL
- 로컬 최적화 방지: 코드 존재 ≠ 시스템 연결. 라우트/네비/import E2E 검증
- Step 5, 7 증거 파일 없으면 deploy 차단

## 기술 스택 (plan에서 확정)
- Hosting: Firebase Hosting
- Framework: TBD (plan에서 결정)
- DB: Firestore
- Auth: Firebase Auth (Google)
