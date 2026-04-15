# 페인포인트 분석 (2026-04-15)

총 이터레이션: 18회  
분석 기준: 소스코드 직접 분석 + UX 시나리오 시뮬레이션

---

## ITER-01: 대학생 첫 방문자

### 발견된 페인포인트

- **PP-001** [Critical]: 히어로 섹션·온보딩·가이드 전무. Header에는 "OpportuMap" 로고만 있고 서비스 설명이 없음. `Header.tsx`에 슬로건/설명 문구가 없어 3초 안에 "이게 뭔 사이트인가"를 파악 불가.
- **PP-002** [High]: 랜딩 시 기본 뷰가 캘린더(데스크톱). 공모전을 처음 접하는 사람에게 캘린더는 이미 익숙한 공고가 있다는 전제를 요구. 리스트가 더 직관적이나 기본값이 캘린더.
- **PP-003** [High]: 인기 공모전, 마감 임박 공모전을 즉시 볼 수 없음. `filterContests`는 `applicationEnd asc` 정렬이지만, "지금 당장 눈에 띄는 추천" 섹션이 없음. 메트릭 카드(진행 중 N건 등)는 수치만 있고 클릭해도 아무 동작 없음.
- **PP-004** [Medium]: "공모전", "해커톤", "예창패", "지원금" 카테고리 레이블이 처음 보는 사람에게 무슨 의미인지 툴팁/설명 없음. "예창패"는 특히 비전공자에게 낯선 용어.

### 심각도: Critical(1), High(2), Medium(1)

### 개선 제안
- Header 하단 또는 FilterBar 위에 1줄 서비스 설명 추가: "공모전·해커톤·창업지원금을 한곳에서"
- 메트릭 카드에 클릭 시 해당 조건 필터 자동 적용 기능 추가
- 카테고리 버튼에 hover 툴팁 추가

---

## ITER-02: 취업준비생 — 스펙 쌓기용 공모전 탐색

### 발견된 페인포인트

- **PP-005** [High]: 검색이 헤더에만 있고 `hidden md:block`으로 모바일에서 완전히 숨겨짐(`Header.tsx:27`). 모바일 취준생은 검색 기능 자체를 발견 못할 수 있음.
- **PP-006** [High]: 검색은 title + organizer만 매칭(`useContests.ts:63-68`). field(분야), target(대상), summary 내용으로는 검색 불가. "마케팅 공모전 대학생"으로 검색하면 title에 "마케팅"이 없는 공고는 누락.
- **PP-007** [Medium]: 검색 결과에 하이라이팅 없음. `ContestCard.tsx`는 매칭된 키워드를 강조하지 않아서 "왜 이 결과가 나왔는가"가 불분명.
- **PP-008** [Medium]: D-day 뱃지가 7일 이하일 때만 표시(`ContestCard.tsx:52`). D-14, D-30 범위도 중요한데 표시 안 됨. 마감까지 여유가 있는 공모전은 urgency를 느낄 수 없음.
- **PP-009** [Low]: 상금 정보가 카드 우측 하단에 작게 표시됨. 취준생에게는 상금/혜택이 1차 필터 기준인데 카드에서 시각적 강조가 부족.

### 심각도: High(2), Medium(2), Low(1)

### 개선 제안
- 모바일 헤더에 검색 아이콘 버튼 추가 → 탭하면 검색바 펼침
- filterContests에 field, summary 검색 범위 확장
- D-day를 D-1~7(red), D-8~14(orange), D-15~30(yellow) 3단계로 확장

---

## ITER-03: 예비창업자 — 예창패/지원금 탐색

### 발견된 페인포인트

- **PP-010** [High]: "예창패" 카테고리명이 `CATEGORY_LABEL`에서 "예창패"로만 표기(`types/contest.ts:29`). 정식명 "예비창업패키지"를 모르면 이 카테고리가 자신에게 해당하는지 알 수 없음.
- **PP-011** [High]: Contest 타입에 `eligibility` 필드가 있으나(`types/contest.ts:18`) 모달에서 표시되지 않음(`ContestDetailModal.tsx` 전체 어디에도 eligibility 렌더링 없음). 지원 자격이 핵심 정보인데 숨겨져 있음.
- **PP-012** [High]: 팀 구성 여부(개인/팀), 업력 조건, 투자 여부 등 startup/grant 특화 필드가 Contest 타입에 없음. 예창패 신청 시 필수 확인 정보를 서비스에서 확인 불가.
- **PP-013** [Medium]: 지원 일정(공고 → 서류 → 발표 → 최종)이 applicationStart/End 2개만 있음. 다단계 일정이 필요한 grant/startup에서 정보 부족.

### 심각도: High(3), Medium(1)

### 개선 제안
- CATEGORY_LABEL에 "예비창업패키지(예창패)" 형태로 변경 또는 툴팁 추가
- ContestDetailModal에 eligibility 필드 렌더링 추가 (현재 데이터는 있으나 UI 누락)
- Contest 타입에 teamRequired: boolean, maxMembers: number 필드 추가 검토

---

## ITER-04: 모바일 사용자 (375px 뷰포트)

### 발견된 페인포인트

- **PP-014** [Critical]: 검색바가 `hidden md:block`(`Header.tsx:27`)으로 모바일에서 완전 숨김. 모바일 사용자는 검색 기능을 아예 사용할 수 없음.
- **PP-015** [High]: FilterBar의 select 드롭다운 3개(분야/대상/지역)가 모바일에서 `flex items-center gap-2`로 나란히 배치되어 375px에서 넘침 발생 가능. `flex-wrap`이 있으나 select 요소 자체 최소 너비로 줄바꿈이 불규칙.
- **PP-016** [High]: Header px-8(32px) 좌우 패딩이 모바일에서도 동일 적용(`Header.tsx:15`). 메인 콘텐츠는 `px-4 md:px-8`로 반응형인데 헤더만 고정 px-8. 375px에서 로고-로그인 버튼 간격 매우 좁아짐.
- **PP-017** [Medium]: CalendarView가 모바일 기본 뷰로 나올 수 있음(useFilters에서 isMobile 감지하나 window.innerWidth 체크가 초기 렌더 시점에만 실행됨, SSR/resize 미반영). FullCalendar dayGridMonth는 375px에서 글자 잘림 심각.
- **PP-018** [Medium]: ContestCard의 터치 타겟이 전체 카드이긴 하나, 최소 높이 지정 없음. 카드 내 텍스트가 짧으면 터치 영역이 44px 미만일 수 있음.

### 심각도: Critical(1), High(2), Medium(2)

### 개선 제안
- Header에 모바일 검색 아이콘 버튼 필수 추가
- Header 패딩을 `px-4 md:px-8`로 통일
- FilterBar를 모바일에서 2열 grid 또는 스크롤 가능한 chip 형태로 변경
- useFilters의 isMobile 감지를 resize 이벤트 또는 CSS 미디어쿼리 기반으로 개선

---

## ITER-05: 검색 기능 UX 심층 분석

### 발견된 페인포인트

- **PP-019** [Critical]: 검색바가 모바일에서 숨김(PP-014와 동일 근본 원인). 검색은 발견 가능성(discoverability)의 핵심 기능.
- **PP-020** [High]: 검색 범위가 title + organizer만(`useContests.ts:64-67`). summary, field 배열, target 배열 검색 미지원. 사용자가 "AI 공모전" 검색 시 title에 "AI"가 없고 field에만 "AI/SW"가 있는 공고는 누락.
- **PP-021** [High]: 한글 초성 검색 미구현. "공모" → "ㄱㅁ" 검색 불가. Korean IME 특성상 타이핑 중간 상태(조합 중)에서도 300ms debounce가 발동해 불필요한 필터링 발생.
- **PP-022** [Medium]: 검색어 입력 후 결과가 0건일 때 "검색 결과가 없습니다" 메시지는 있으나(`ListView.tsx:13-18`), 필터가 함께 적용된 경우 "필터 때문인지 검색어 때문인지" 구분 안 됨. 예: 카테고리 1개만 선택 + 검색어 → 결과 0 → 원인 불분명.
- **PP-023** [Low]: 검색어 클리어(X) 버튼 없음. SearchBar에 clear 버튼이 없어 전체 지우기 불편.

### 심각도: Critical(1), High(2), Medium(1), Low(1)

### 개선 제안
- filterContests에 summary, field.join(' '), target.join(' ') 포함한 full-text 검색
- SearchBar에 value가 있을 때 X(clear) 버튼 추가
- 결과 0건 시 "필터 초기화하기" 링크 포함한 구체적 안내 메시지

---

## ITER-06: 캘린더 → 공고 상세 플로우

### 발견된 페인포인트

- **PP-024** [High]: 모달에서 이전/다음 공고 이동 불가. `ContestDetailModal.tsx`는 단일 contest만 받음. 캘린더에서 이벤트 클릭 → 모달 → 닫기 → 다시 캘린더에서 클릭 반복해야 함.
- **PP-025** [High]: 모달이 `max-w-lg`(512px)로 고정. 모바일 375px에서 모달이 거의 전화면을 차지하나, 스크롤 가능 영역이 `max-h-[85vh]`로 제한되어 긴 checklist가 있으면 하단 "지원하기" 버튼이 스크롤 아래로 숨겨질 위험.
- **PP-026** [Medium]: 모달 배경 클릭으로 닫힘(`onClick={onClose}` on wrapper div). 모달 내 스크롤 중 실수로 배경 클릭 가능. 특히 모바일에서 스와이프 동작과 혼동.
- **PP-027** [Medium]: 모달에서 "지원하기" 버튼이 외부 URL로 이동하나, 새 탭에서 열릴 때 현재 페이지 상태(필터, 스크롤 위치)가 URL에 저장되어 있어 뒤로가기 시 복원됨(장점). 그러나 모달이 여전히 열려있는 상태로 돌아옴 — URL에 detail param이 남아있기 때문.

### 심각도: High(2), Medium(2)

### 개선 제안
- 모달에 이전/다음 탐색 버튼 추가 (현재 filtered 배열 기준 prev/next)
- 모달 하단 CTA 버튼을 sticky position으로 고정하여 항상 보이게
- 모바일에서 모달을 bottom sheet 방식으로 변경 검토

---

## ITER-07: 리스트 뷰 → 지원 완료 플로우

### 발견된 페인포인트

- **PP-028** [High]: 카드에서 "지원하기" 원클릭 불가. ContestCard 클릭 → 모달 오픈 → "지원하기" 클릭의 2단계 필요. 카드 자체에 외부링크 버튼이 없음.
- **PP-029** [High]: 카드에 표시되는 정보가 너무 제한적: 카테고리, 제목, 주최, 마감일, 상금만 표시. field(분야), target(대상) 정보가 카드에 없어서 "내게 맞는 공고인가" 판단에 모달 열기가 필수.
- **PP-030** [Medium]: ListView가 단순 `grid gap-3` 단일 컬럼(`ListView.tsx:25`). 데스크톱에서 와이드 화면을 낭비함. ContestCard가 가로로 길게 표시되어 정보 밀도가 낮음.
- **PP-031** [Medium]: 리스트 정렬 옵션 없음. 마감일순(현재 기본)만 있고 등록일순, 상금순, 카테고리순 정렬 불가.

### 심각도: High(2), Medium(2)

### 개선 제안
- ContestCard에 "지원하기" 아이콘 버튼 추가 (카드 우측 상단, 외부링크)
- 카드에 field 태그(chip) 1-2개 추가 표시
- ListView를 md 이상에서 2컬럼 그리드로 변경

---

## ITER-08: 빈 상태 / 에러 상태

### 발견된 페인포인트

- **PP-032** [High]: 에러 상태 UI가 너무 빈약(`HomePage.tsx:48-57`). "데이터를 불러올 수 없습니다" + ⚠️ 이모지만 있고, 재시도 버튼 없음. 사용자가 새로고침 외에 할 수 있는 행동이 없음.
- **PP-033** [Medium]: 필터 결과 0건 시 ListView와 CalendarView 메시지가 다름. ListView: "검색 결과가 없습니다 / 필터를 조정하거나..."(`ListView.tsx:13-18`), CalendarView: "조건에 맞는 공고가 없습니다 / 필터를 조정해 보세요"(`CalendarView.tsx:44-49`). 메시지 톤/내용 불일치.
- **PP-034** [Medium]: 로딩 스켈레톤이 리스트 뷰에서만 구현됨(`HomePage.tsx:104-116`). 캘린더 뷰 로딩 시에는 스피너만 표시. 캘린더 스켈레톤 없음.
- **PP-035** [Low]: 빈 상태 이모지(📭, 🔍)가 사용됨. 이모지는 OS/플랫폼별 렌더링이 다르고, CLAUDE.md 규칙에도 이모지 사용 자제 원칙이 있음. 커스텀 SVG 일러스트로 교체 권장.

### 심각도: High(1), Medium(2), Low(1)

### 개선 제안
- 에러 상태에 "다시 시도" 버튼 추가 (window.location.reload 또는 subscribeContests 재호출)
- 빈 상태 메시지 통일 + "필터 초기화" 버튼 포함

---

## ITER-09: 공고 상세 정보 충분성

### 발견된 페인포인트

- **PP-036** [Critical]: `eligibility` 필드가 Contest 타입에 있으나(`types/contest.ts:18`) ContestDetailModal에서 렌더링되지 않음(PP-011과 동일). 지원 자격이 상세 모달에서 보이지 않는 것은 핵심 정보 누락.
- **PP-037** [High]: 관련 공모전 추천 없음. 모달 하단에 "같은 분야 다른 공모전" 추천 섹션이 없어서 탐색 흐름이 끊김.
- **PP-038** [High]: 체크리스트(`checklist`)가 모달 내에서 인터랙티브 체크박스로 구현됐으나(`ContestDetailModal.tsx:155-164`), 체크 상태가 저장되지 않음(로컬스토리지 미사용). 모달 닫고 다시 열면 체크 초기화.
- **PP-039** [Medium]: 공고 준비 기간 추정 정보 없음. "이 공모전은 보통 2-3주 준비 필요" 같은 가이드 없음.
- **PP-040** [Medium]: FAQ 섹션 없음. 자주 묻는 질문(팀 구성 가능 여부, 중복 지원 가능 여부 등) 정보 없음.

### 심각도: Critical(1), High(2), Medium(2)

### 개선 제안
- ContestDetailModal에 eligibility 섹션 즉시 추가 (데이터는 이미 있음)
- 체크리스트 상태를 localStorage에 저장 (key: `checklist-${contest.id}`)
- 관련 공모전: 같은 category 또는 field 공고 2-3개를 모달 하단에 표시

---

## ITER-10: 온보딩 / 가치 제안 명확성

### 발견된 페인포인트

- **PP-041** [Critical]: 서비스 가치 제안(Value Proposition)이 전혀 없음. 헤더에 "OpportuMap" 텍스트만 있고, 왜 이 서비스를 써야 하는지 설명이 없음. Footer에서야 "공모전·해커톤·창업지원 통합 캘린더"라는 설명이 나옴(페이지 최하단).
- **PP-042** [High]: 첫 방문자를 위한 튜토리얼, 가이드, 온보딩 플로우 전무. 캘린더 범례(legend)만 있고 사용 방법 안내 없음.
- **PP-043** [High]: 메트릭 카드(진행 중 N건, 이번 주 마감 N건, 새로 등록 N건)가 페이지 하단에 위치(`HomePage.tsx:129`). 이 통계가 서비스 가치를 증명하는 숫자인데 스크롤 아래에 있어서 첫 인상에 활용 안 됨.
- **PP-044** [Low]: 로고에 아이콘/파비콘 없음. 브랜드 식별성 부족.

### 심각도: Critical(1), High(2), Low(1)

### 개선 제안
- Header 또는 페이지 최상단에 서브타이틀 1줄 추가: "공모전·해커톤·창업지원금을 한눈에"
- 메트릭 카드를 Header 바로 아래(FilterBar 위)로 이동
- 첫 방문자 감지(localStorage) 후 간단한 툴팁 가이드 표시

---

## ITER-11: 알림 / 북마크 기능 부재

### 발견된 페인포인트

- **PP-045** [High]: 북마크(관심 공모전 저장) 기능 없음. useAuth로 Firebase Auth는 구현됐으나 사용자별 저장 기능이 없음. 관심 공모전을 매번 다시 검색해야 함.
- **PP-046** [High]: 마감 임박 알림(푸시/이메일) 없음. 관심 공모전 마감 D-3 알림 등 능동적 알림 기능 전무.
- **PP-047** [Medium]: 지원 완료 표시 없음. 내가 이미 지원한 공모전과 아닌 것을 구분할 수 없음. "이미 지원함" 뱃지 없음.
- **PP-048** [Medium]: 로그인을 해도 개인화된 기능이 없음. 현재 로그인은 Admin 접근용으로만 활용됨. 일반 사용자에게 로그인 유인이 없음.

### 심각도: High(2), Medium(2)

### 개선 제안
- localStorage 기반 북마크(로그인 불필요) 먼저 구현, 이후 Firestore 동기화
- 북마크한 공모전 필터 버튼 추가 ("내 관심 공모전만 보기")
- 로그인 사용자에게 북마크 클라우드 저장 인센티브 제공

---

## ITER-12: 데이터 신뢰성 / 최신성

### 발견된 페인포인트

- **PP-049** [High]: 공고 데이터 최신성 표시 없음. 카드/모달에 "마지막 업데이트" 표시가 없어서 정보가 최신인지 알 수 없음. createdAt 필드는 있으나(`types/contest.ts:22`) 사용자에게 노출 안 됨.
- **PP-050** [High]: 출처 URL(sourceUrl)이 모달에만 있고 카드에는 없음. 공고 원문 확인을 위해 반드시 모달을 열어야 함.
- **PP-051** [Medium]: 만료된 공고(applicationEnd < now) 처리가 `showPast` 필터로만 제어됨. 만료 공고를 실수로 포함한 경우 사용자가 지원 불가 공고에 시간 낭비.
- **PP-052** [Medium]: 데이터 수동 입력 방식(Admin 페이지)으로 인한 오탈자, 날짜 오류 가능성. 자동화된 크롤링/검증 시스템 없음.

### 심각도: High(2), Medium(2)

### 개선 제안
- 카드/모달에 createdAt 기반 "N일 전 등록" 표시 추가
- 만료 공고에 "마감됨" 오버레이 또는 그레이아웃 처리

---

## ITER-13: 색상 / 접근성 / 가독성

### 발견된 페인포인트

- **PP-053** [High]: 카테고리 4색(파랑 #3B5BDB, 초록 #0CA678, 주황 #E8590C, 빨강 #E03131)이 색약(적녹색약) 사용자에게 주황/빨강 구분 어려움. startup(주황)과 grant(빨강)이 유사하게 보일 수 있음(`constants/index.ts:7-11`).
- **PP-054** [High]: 텍스트 색상 #9CA3AF(회색)이 흰 배경에서 대비율 약 2.85:1로 WCAG AA 기준(4.5:1) 미달. ContestCard의 organizer 텍스트(`ContestCard.tsx:61`), FilterBar 건수 표시(`FilterBar.tsx:66`) 등 다수 위치에서 사용.
- **PP-055** [Medium]: focus indicator는 `focus:ring-2 focus:ring-[#3B5BDB]`로 구현됐으나 일부 요소(ContestCard의 article 태그)에서는 `focus:outline-none focus:ring-2`로 outline 제거 후 ring만 사용. ring이 충분히 보이는지 브라우저별 확인 필요.
- **PP-056** [Medium]: 카테고리 필터 버튼의 비활성 상태가 `border: 1.5px solid ${colors.main}30`으로 30% 투명도. 저시력 사용자에게 테두리가 거의 보이지 않을 수 있음.

### 심각도: High(2), Medium(2)

### 개선 제안
- #9CA3AF 대신 #6B7280(대비율 4.63:1) 이상 사용
- 카테고리 색상에 색약 친화적 팔레트 적용 또는 아이콘/패턴 보조 구분
- 비활성 카테고리 버튼 테두리 opacity를 50% 이상으로 조정

---

## ITER-14: 필터 발견 가능성 (Discoverability)

### 발견된 페인포인트

- **PP-057** [High]: 필터 적용 상태 표시 불충분. isFiltered 상태일 때 "초기화" 링크만 나타남(`FilterBar.tsx:69-77`). 현재 몇 개 필터가 활성화됐는지 숫자/뱃지로 표시 안 됨. 헤더 영역에서 "필터 3개 적용 중" 같은 summary 없음.
- **PP-058** [High]: 분야(field), 대상(target), 지역(region) 필터가 select 드롭다운으로만 구현. 드롭다운은 터치 인터페이스에서 UX가 나쁨. 특히 모바일에서 OS 기본 select UI가 나타남.
- **PP-059** [Medium]: 필터 바가 ViewToggle 버튼 아래에 위치하는데, 뷰 전환 버튼이 오른쪽 정렬이고 FilterBar가 그 아래 별도 행으로 분리됨. 필터 바가 캘린더/리스트 위 공간을 많이 차지해 콘텐츠 시작이 늦어짐.
- **PP-060** [Low]: "마감 포함" 체크박스 레이블이 작고 필터 그룹 끝에 위치. 발견하기 어려움. 기본적으로 마감 공고가 숨겨져 있는데 이를 모르는 사용자는 공고가 적다고 오해.

### 심각도: High(2), Medium(1), Low(1)

### 개선 제안
- 필터 활성 개수 뱃지: "필터 (2)" 형태로 표시
- 모바일에서 분야/대상/지역 필터를 bottom sheet 또는 chip 방식으로 교체
- "마감 포함" 토글을 더 눈에 띄는 위치로 이동

---

## ITER-15: 재방문자 경험

### 발견된 페인포인트

- **PP-061** [High]: URL params로 필터 상태가 유지되는 점은 장점이나, 북마크/히스토리 기능이 없어서 "저번에 봤던 그 공모전"을 다시 찾기 어려움.
- **PP-062** [High]: 이전 방문 시 설정했던 필터 선호도가 저장되지 않음. 매번 방문할 때마다 기본 필터(전체 카테고리, 검색 없음)에서 시작.
- **PP-063** [Medium]: "새로 등록" 메트릭은 있으나 마지막 방문 이후 새로 추가된 공고를 하이라이트하는 기능 없음. "내가 마지막으로 방문한 이후 5건 추가됨" 같은 정보 없음.
- **PP-064** [Low]: URL 공유 시 `?view=list&categories=contest,hackathon` 형태로 필터가 포함됨(useFilters.ts 구현 덕분). 이는 장점이나, 공유된 URL로 접근한 새 방문자에게 "왜 이 필터가 적용됐는가" 설명이 없음.

### 심각도: High(2), Medium(1), Low(1)

### 개선 제안
- localStorage에 마지막 필터 상태 저장 후 재방문 시 복원
- 새로운 공고 표시: localStorage의 lastVisit timestamp와 createdAt 비교하여 "New" 뱃지

---

## ITER-16: 캘린더 이벤트 밀집 문제

### 발견된 페인포인트

- **PP-065** [High]: `dayMaxEvents={3}`로 설정되어 하루 4개 이상 이벤트는 "+N more" 표시(`CalendarView.tsx:89`). "+N more" 클릭 시 FullCalendar 기본 popover가 열리는데, 이 popover의 스타일이 앱 디자인과 불일치(FullCalendar 기본 CSS).
- **PP-066** [High]: 공고 기간이 applicationStart → applicationEnd로 표시되어 기간이 긴 공고(1-3개월)는 캘린더 전체를 덮음. 특히 grant/startup 공고는 기간이 길어 캘린더가 복잡해짐.
- **PP-067** [Medium]: 주간 리스트 뷰(`listWeek`)가 버튼 텍스트 "주간"으로 제공되나, 기본 뷰가 월간이라 대부분 사용자가 이 기능을 모름. 리스트 뷰와 캘린더 주간 뷰의 관계가 명확하지 않음.
- **PP-068** [Low]: 캘린더에서 이벤트 클릭 시 `onSelectContest` 호출 전에 FullCalendar 기본 이벤트 동작(링크 이동 등)이 발생할 수 있음. eventClick에서 `info.jsEvent.preventDefault()` 누락 여부 확인 필요.

### 심각도: High(2), Medium(1), Low(1)

### 개선 제안
- 긴 기간 공고는 마감일만 단일 이벤트로 표시하고 기간은 모달에서 확인하는 방식 검토
- dayMaxEvents를 4-5로 늘리거나 동적으로 조정
- eventClick에 `info.jsEvent.preventDefault()` 명시적 추가

---

## ITER-17: 공유 / 소셜 기능

### 발견된 페인포인트

- **PP-069** [High]: 특정 공모전 딥링크 미구현. App.tsx에 `/contest/:id` 라우트 없음(`App.tsx:9-11`). URL로 특정 공모전을 직접 공유 불가. 현재는 `?detail=contestId` 쿼리 파라미터 방식이지만 공유 시 필터 상태도 함께 포함되어 URL이 지저분함.
- **PP-070** [High]: OG(Open Graph) 메타태그가 모든 페이지 동일. index.html의 정적 OG 태그만 있고 공모전별 동적 OG 생성 없음. 카카오톡/SNS 공유 시 공모전 제목/설명 미리보기 불가.
- **PP-071** [Medium]: 공유 버튼 없음. 모달에 "지원하기", "원문" 버튼만 있고 "공유하기" 버튼 없음. URL 복사나 네이티브 공유 API 미사용.
- **PP-072** [Low]: 캘린더 이벤트를 구글 캘린더/iCal로 내보내기 불가. FullCalendar의 iCal export 기능 미활성화.

### 심각도: High(2), Medium(1), Low(1)

### 개선 제안
- 모달에 "링크 복사" 버튼 추가 (`navigator.clipboard.writeText(window.location.href)`)
- `/contest/:id` 라우트 추가 및 해당 페이지에서 OG 메타태그 동적 생성 (react-helmet 등)

---

## ITER-18: 성능 / 초기 로딩

### 발견된 페인포인트

- **PP-073** [High]: FullCalendar 라이브러리(@fullcalendar/react + plugins 3개)가 번들에 포함됨. FullCalendar 자체가 약 200-300KB. 캘린더 뷰를 사용하지 않는 모바일 사용자(기본 리스트 뷰)도 이 번들을 다운로드해야 함. lazy import 미적용.
- **PP-074** [High]: Firestore `onSnapshot` 실시간 구독이 페이지 진입 즉시 시작됨(`useContests.ts:28-39`). 콜드 스타트 시 Firestore 연결 지연으로 초기 로딩이 느릴 수 있음. 오프라인 캐시(persistentLocalCache) 미설정.
- **PP-075** [Medium]: Plus Jakarta Sans 폰트를 index.css 또는 public/index.html에서 `<link rel="preload">`로 로드하는지 확인 필요. 폰트 로딩 지연 시 FOUC(Flash of Unstyled Content) 발생 가능.
- **PP-076** [Low]: 이미지 없는 텍스트 전용 UI라 이미지 최적화 이슈는 없음. 그러나 향후 공모전 썸네일 이미지 추가 시 Next.js Image 또는 `loading="eager"` 전략 필요(P-001 참조).

### 심각도: High(2), Medium(1), Low(1)

### 개선 제안
- CalendarView를 `React.lazy()` + `Suspense`로 동적 임포트
- Firestore persistentLocalCache 활성화로 오프라인/콜드스타트 성능 개선
- Plus Jakarta Sans를 `<link rel="preconnect">` + `font-display: swap` 적용

---

## 종합: 상위 10개 페인포인트 (구현 우선순위 순)

| 순위 | ID | 페인포인트 | 심각도 | 구현 난이도 | 예상 효과 |
|-----|-----|-----------|------|-----------|---------|
| 1 | PP-014/019 | 모바일에서 검색바 완전 숨김 (hidden md:block) | Critical | Low | 모바일 사용자 검색 가능 |
| 2 | PP-036/011 | eligibility 필드 모달 미렌더링 (데이터 있으나 UI 누락) | Critical | Low | 지원 자격 즉시 확인 가능 |
| 3 | PP-001/041 | 서비스 가치 제안 전무 — 3초 내 이해 불가 | Critical | Low | 첫 방문자 이탈 감소 |
| 4 | PP-053/054 | 텍스트 대비율 WCAG AA 미달 (#9CA3AF 다수 사용) | High | Low | 접근성 및 가독성 향상 |
| 5 | PP-028/029 | 카드에서 직접 지원 불가, 분야 정보 누락 | High | Low | 탐색→지원 전환율 향상 |
| 6 | PP-038 | 체크리스트 상태 미저장 (모달 닫으면 초기화) | High | Low | 반복 사용자 편의 향상 |
| 7 | PP-065/066 | 캘린더 긴 기간 공고 밀집 — 가독성 저하 | High | Medium | 캘린더 뷰 가독성 개선 |
| 8 | PP-073 | FullCalendar lazy import 미적용 — 번들 비대 | High | Low | 초기 로딩 속도 개선 |
| 9 | PP-069/070 | 딥링크 미구현, OG 태그 정적 — 공유 불가 | High | Medium | SNS 바이럴 가능 |
| 10 | PP-045 | 북마크 기능 없음 (localStorage 기반 구현 가능) | High | Medium | 재방문 및 잔존율 향상 |

---

## 빠른 수정 (Quick Wins — 코드 5줄 이내)

| ID | 수정 내용 | 파일 | 예상 시간 |
|----|----------|------|---------|
| PP-036 | ContestDetailModal에 eligibility 렌더링 추가 | ContestDetailModal.tsx | 10분 |
| PP-014 | Header 모바일 검색 아이콘 버튼 추가 | Header.tsx | 20분 |
| PP-054 | #9CA3AF → #6B7280 전체 교체 | 전체 tsx | 10분 |
| PP-008 | D-day 뱃지 D-14, D-30 범위 확장 | ContestCard.tsx | 10분 |
| PP-032 | 에러 상태에 재시도 버튼 추가 | HomePage.tsx | 15분 |
| PP-023 | SearchBar에 clear(X) 버튼 추가 | SearchBar.tsx | 15분 |
| PP-073 | CalendarView lazy import 적용 | HomePage.tsx | 10분 |
| PP-010 | "예창패" → "예비창업패키지" 레이블 변경 | types/contest.ts | 5분 |
