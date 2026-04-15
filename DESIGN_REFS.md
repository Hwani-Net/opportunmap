# OpportuMap — Design References

> 작성일: 2026-04-15 | 용도: Step 0 디자인 레퍼런스

---

## 1. Google Calendar (Web)
**URL**: https://calendar.google.com  
**검증 상태**: 확인됨

**잘 된 점**
- Day/Week/Month/Agenda 뷰 간 1-click 전환. 월→일 "micro/macro" 드릴다운 패턴
- 카테고리별 색상 라벨 + 현재일 subtle shading — 정보 밀도가 높아도 스캔 용이
- 이벤트 클릭 시 모달 대신 사이드 패널 팝업 → 맥락 유지

**OpportuMap 채택 포인트**
- 공모전 카테고리(해커톤/예창패/지원금)별 고유 색상 라벨
- 월→마감일 드릴다운 패턴
- 이벤트 클릭 시 오버레이 패널 (전환 없이 상세 확인)

---

## 2. Calendly (슬롯 피커 UI)
**URL**: https://calendly.com  
**검증 상태**: 확인됨

**잘 된 점**
- 불가능한 날짜는 아예 숨김 — 선택 가능 항목만 표시 (정보 부담 최소화)
- 월간 미니캘린더 + 하단 일별 리스트 동시 표시 (compact dual-pane)
- 현재 선택일 강조: 원형 accent color, 나머지는 중립

**OpportuMap 채택 포인트**
- 마감 지난 공모전은 자동 dimming/숨김
- 마감 임박(7일 이내) 날짜에 accent dot 강조
- 상단 미니캘린더 + 하단 마감일 리스트 듀얼패널 레이아웃

---

## 3. Linear (프로젝트 관리 SaaS)
**URL**: https://linear.app  
**검증 상태**: 확인됨

**잘 된 점**
- 3-variable 색상 시스템(base/accent/contrast) — 일관성 유지가 쉬움
- Inter Display(제목) + Inter(본문) 조합으로 계층 명확
- "Neutral and timeless" 철학: chrome 최소화, 텍스트 대비 강화
- 다크모드 완성도: LCH 색공간 기반으로 자동 생성

**OpportuMap 채택 포인트**
- CSS 변수 3개(--color-base, --color-accent, --color-surface)로 전체 테마 통제
- 카드/이벤트 텍스트 대비: 최소 WCAG AA(4.5:1) 유지
- 다크모드 Day 1 지원 (Firebase + Tailwind CSS variables 조합)

---

## 4. Notion Calendar (Web)
**URL**: https://calendar.notion.so  
**검증 상태**: 확인됨

**잘 된 점**
- 이벤트 블록이 타임라인에 시각적으로 "쌓임" — 중복 일정 직관적 표현
- 폰트 크기 작지만 색상 태그로 보완 (카테고리 인식)
- 주간 뷰 + 우측 미니 월간 패널 동시 표시

**OpportuMap 채택 포인트**
- 주간 뷰에서 마감일이 겹칠 경우 블록 병렬 표시
- 우측 상시 미니 달력 (현재 위치 앵커)
- 이벤트 높이 = 중요도 또는 남은 기간 비례 (시각 차별화)

---

## 5. 콘테스트코리아 Calendar (국내 경쟁 서비스)
**URL**: https://www.contestkorea.com/sub/calendar.php?int_gbn=1  
**검증 상태**: 확인됨

**잘 된 점** (현재 실사용 서비스 기준)
- 월/연간 전환 토글 존재
- 필터: 대상/지역/주최/상금 드롭다운 (카테고리 분류 체계 참고 가능)

**문제점 (OpportuMap이 개선할 지점)**
- 이벤트 전부 동일한 파란 링크 — 카테고리 구분 없음
- 타이포그래피 단일 계층 — h1~body 구분 없음
- 필터 사이드바 과밀: 드롭다운 4개 중첩 → 인지 부담
- 이미지/아이콘 없음 — 텍스트 나열만

---

## 핵심 채택 패턴

| 패턴 | 출처 | 적용 위치 |
|------|------|----------|
| 카테고리 색상 라벨 | Google Calendar | 이벤트 카드, 캘린더 dot |
| 마감 임박 accent 강조 | Calendly | 캘린더 날짜 셀 |
| 3-variable CSS 색상 시스템 | Linear | 전체 테마 |
| 듀얼패널 (미니캘린더 + 리스트) | Calendly + Notion | 메인 레이아웃 |
| 사이드 패널 이벤트 상세 | Google Calendar | 이벤트 클릭 UX |
| 뷰 전환 (월/주/리스트) | Google Calendar | 상단 Nav |

---

## Anti-Patterns (금지)

- **보라색+분홍 그라디언트 히어로** — AI 클리셰 (design_rubric.md 기준 -3점)
- **blur circle 배경 장식** — 콘테스트 앱에 부적합
- **이벤트 전부 동일 색상** — 콘테스트코리아의 실패 사례
- **4개+ 드롭다운 필터 중첩** — 인지 부담, pill/chip 필터로 대체
- **loading="lazy" 사용** — PITFALLS P-001
- **타이포그래피 단일 계층** — 최소 h1/h2/body/caption 4단 계층 필수
- **모달 이벤트 상세** — 맥락 이탈. 사이드 패널 또는 인라인 확장으로 대체

