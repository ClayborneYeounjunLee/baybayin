# Baybay · 바이바이 — 따갈로그 바이바이인(Baybayin) 문자 학습 웹앱

> 필리핀 고대문자 **바이바이인(Baybayin)** 59자를 플래시카드 · 퀴즈 · 복습으로 익히는 단일 파일 웹앱.
> 자음에 기본 모음 `a`가 붙어 있고 쿠들릿(점)과 비라마(받침 표시)로 모음이 바뀌는 **아부기다(abugida)** 문자 체계를, 한 글자 한 글자 천천히 배우도록 설계했습니다.

🔗 **라이브 데모:** https://clayborneyeounjunlee.github.io/baybayin/

> 라이브 링크로 접속하면 `index.html`이 곧바로 실제 앱 파일(`바이바이인_암기카드.html`)로 리다이렉트합니다.

---

## ✨ 주요 기능

- **🃏 연습(Practice) 모드** — 플래시카드를 넘기며 스스로 알았는지/몰랐는지 채점. `글자 → 발음`, `발음 → 글자`, `랜덤 믹스` 세 가지 출제 방식 지원.
- **❓ 퀴즈(Quiz) 모드** — 6지선다 객관식. 정답/오답을 색으로 즉시 피드백. **하드 모드(제한시간 3·5·7초)** 를 켜면 시간 안에 못 고른 문제는 오답 처리.
- **🔁 복습(Review) 모드** — 3회 이상 학습했지만 **오답률이 30% 이상**인 글자만 자동으로 모아, 오답률 높은 순으로 집중 복습. 카드/퀴즈 두 방식으로 재학습 가능.
- **🗂️ 문자표(Chart)** — 모음 · 기본 자음 · 쿠들릿 i/e · 쿠들릿 u/o · 받침(비라마) 5개 탭. `문자 표`/`발음 표` 전환, 힌트(발음/글자 흐리게 표시) 토글.
- **🔊 발음 듣기** — 문자표에서 글자를 누르면 Web Speech API로 필리핀어(`fil-PH`) 발음을 읽어줌.
- **📊 마이페이지** — 총 학습 카드 수, 전체 정답률, 학습한 날, 연속 학습일(streak), **GitHub 잔디 스타일 학습 활동 히트맵(최근 17주)**, **글자별 오답률 히트맵**.
- **☁️ 로그인 / 게스트** — Google 로그인 시 학습 기록을 클라우드(Firestore)에 저장해 여러 기기에서 이어서 학습. 로그인 없이 **게스트 모드**로 이 기기에만 저장하는 것도 가능.
- **🌐 한국어 / English 토글 & 🌙 다크 모드** — 전체 UI 다국어 지원, 라이트/다크 테마(시스템 설정 자동 감지 + 수동 전환).
- **⌨️ 키보드 지원** — 연습: `Space`/`Enter`(정답 보기·알았어요), `X`(몰랐어요) / 퀴즈: 숫자키 `1~6`으로 선택.
- **📱 모바일 웹앱 최적화** — `safe-area-inset` 대응, iOS 홈화면 추가(`apple-mobile-web-app-*`), 최대 폭 520px 세로형 레이아웃.

---

## 🧱 기술 스택 / 언어

| 구분 | 내용 |
|---|---|
| 언어 | **순수 HTML + CSS + 바닐라 JavaScript** (프레임워크 없음) |
| 앱 형태 | **단일 HTML 파일** 안에 마크업 · CSS · JS 전부 인라인 |
| JS 모듈 | 메인 스크립트는 **ES 모듈**(`<script type="module">`), Firebase SDK를 동적 `import()`로 로드 |
| 빌드 도구 | **없음** (번들러 · 트랜스파일러 없이 그대로 브라우저에서 실행) |
| 인증/DB SDK | **Firebase JS SDK `12.14.0`** — `firebase-app` / `firebase-auth` / `firebase-firestore`를 `gstatic.com` ESM CDN에서 로드 |
| 폰트 | 본문은 시스템 폰트 스택(`Pretendard`, `Apple SD Gothic Neo`, `Noto Sans KR` 등), **바이바이인 글자는 Google Fonts `Noto Sans Tagalog` 웹폰트** |
| 음성 | 브라우저 내장 **Web Speech API**(`SpeechSynthesis`) |
| 아이콘 | 외부 이미지 없이 **인라인 SVG data URI** 파비콘 + 유니코드 바이바이인 글자(`ᜊ`) |

### 왜 Noto Sans Tagalog를 임베드하나?

바이바이인 글자(`ᜃ`, `ᜊ`, `ᜈ` …)는 대부분 기기에 기본 폰트가 없어 **빈 네모(□)로 표시**됩니다. 그래서 CSS 변수 `--baybayin-font: "Noto Sans Tagalog", ...`로 웹폰트를 지정하고, `<head>`에서 아래처럼 로드합니다.

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tagalog&display=swap" rel="stylesheet">
```

### CDN / 외부 로드 목록

```
https://fonts.googleapis.com / fonts.gstatic.com        → Noto Sans Tagalog 웹폰트
https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js
https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js
https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js
```

---

## 🏗️ 시스템 구조

### 단일 파일 · 화면 전환(SPA) 방식

앱 전체가 `바이바이인_암기카드.html` 한 파일입니다. 라우터 없이 **9개의 화면 `<div>`를 클래스 토글로 보였다/숨겼다** 하는 방식으로 동작합니다.

```
loading → auth → home → study → practice → quiz → result → charts → mypage
```

`showScreen(name)` 함수가 `SCREENS` 배열을 돌며 해당 화면만 남기고 나머지에 `.hidden`을 붙입니다.

### 부팅 흐름 (초기화 순서)

1. `<head>`의 인라인 스크립트가 `localStorage`의 `baybay-theme`(또는 OS 다크모드 설정)를 읽어 **깜빡임 없이** 테마를 선적용.
2. 모듈 스크립트 진입 → `restoreSetup()`(이전 학습 설정 복원) → `applyLang()`(언어 적용) → 로딩 화면 표시.
3. `initFirebase()`로 Firebase SDK 동적 로드 시도.
   - **성공 시:** `onAuthStateChanged`로 로그인 상태 감시 → 로그인돼 있으면 `startCloud()`, 아니면 이전에 게스트였으면 `startGuest()`, 그 외엔 로그인 화면.
   - **실패 시(네트워크 등):** Google 버튼 비활성화 → 게스트 전용으로 폴백.

### 핵심 모듈 · 함수

| 영역 | 주요 함수 |
|---|---|
| 화면 전환 | `showScreen()`, `visible()`, `enterApp()` |
| 데이터 계층 | `record()`(학습 기록), `scheduleSave()` / `flushSave()`(**2초 디바운스 저장**), `freshProfile()` |
| 인증 | `startGuest()`, `startCloud()`, `applyCloud()`, `syncFromCloud()`, `profileFromSeed()` |
| 세션 엔진 | `startSession()`, `renderPractice()` / `revealPractice()` / `gradePractice()`, `renderQuiz()` / `buildOptions()` / `answerQuiz()`, `showResult()` |
| 복습 | `remindCards()`(오답률 필터), `renderReview()` |
| 문자표 | `renderCharts()`, `chartSections()`, `speak()`(TTS) |
| 마이페이지 | `renderMypage()`, `heatCell()`(오답률 히트맵), `calcStreak()` / `calcTotals()` |
| 다국어/테마 | `tr()`, `applyLang()`, `applyTheme()` / `setTheme()` |

### 상태 관리

- 프레임워크 없이 **모듈 스코프 변수**로 상태를 관리합니다: `mode`(`cloud`/`guest`), `uid`, `profile`, `session`(현재 학습 세션), `studyTab` / `partsSel` / `studyMode` / `hardLimit`(학습 설정), `L`(언어), 테마.
- 사용자 데이터는 `profile` 객체 한 곳에 모으고, 카드를 넘길 때마다가 아니라 **2초 디바운스**(`scheduleSave`)로 저장해 쓰기를 아낍니다. 탭 전환(`visibilitychange`)·페이지 이탈(`pagehide`) 시엔 즉시 `flushSave()`.

### 학습 세션 로직 하이라이트

- **연습:** 선택한 카드를 셔플 → 카드마다 출제 방향(`char`/`sound`)을 결정 → 정답 공개 후 알았어요/몰랐어요로 채점, 오답은 결과 화면에서 다시 학습 가능.
- **퀴즈:** `buildOptions()`가 현재 덱에서 중복 로마자를 피해 오답 5개를 뽑아 6지선다 구성(부족하면 전체 풀에서 보충). 하드 모드는 50ms 간격 타이머로 진행 바를 줄이고 0이 되면 자동 오답.
- **복습 기준:** `REMIND_MIN_SEEN = 3`(3회 이상 학습) 그리고 `REMIND_MIN_RATE = 0.3`(오답률 30% 이상).

---

## 🗂️ 데이터

모든 학습 데이터는 **외부 파일 없이 JS 배열로 하드코딩**되어 있습니다. 형식은 `[문자, 로마자, 한글, (선택)비고]`이며, `mk()` 헬퍼가 이를 `{ char, roma, kor, note, cat }` 객체로 변환합니다.

### 파트 구성 (총 59자)

| 파트 키(`cat`) | 이름 | 개수 | 설명 |
|---|---|---|---|
| `vowel` | 모음 (Patinig) | 3 | `ᜀ a`, `ᜁ i/e`, `ᜂ u/o` |
| `basic` | 기본 자음 + a | 14 | `ᜃ ka` … `ᜑ ha` (자음의 기본형, 모음 `a` 포함) |
| `kudlitI` | 쿠들릿 i/e (위 점) | 14 | `ᜃᜒ ki` … `ᜑᜒ hi` |
| `kudlitU` | 쿠들릿 u/o (아래 점) | 14 | `ᜃᜓ ku` … `ᜑᜓ hu` |
| `virama` | 받침 / 순수 자음 (비라마 ᜔) | 14 | `ᜃ᜔ k` … `ᜑ᜔ h` (스페인 식민기 도입) |

> 합계 = 3 + 14 + 14 + 14 + 14 = **59자**. `POOLS` 객체가 파트별 배열을 담고, `FULL_POOL`이 이를 평탄화한 전체 목록입니다.

### 실제 데이터 스니펫

```js
const VOWELS = [
  ["ᜀ","a","아"], ["ᜁ","i","이","e(에)로도"], ["ᜂ","u","우","o(오)로도"]
];
const BASIC = [ // 기본 자음 + a
  ["ᜃ","ka","카"], ["ᜄ","ga","가"], ["ᜅ","nga","응아"], ["ᜆ","ta","타"], ["ᜇ","da","다","ra(라)로도"],
  ["ᜈ","na","나"], ["ᜉ","pa","파"], ["ᜊ","ba","바"], /* … */
];
// mk()로 { char, roma, kor, note, cat } 객체 배열로 변환
const mk = (arr, cat) => arr.map(e => ({ char: e[0], roma: e[1], kor: e[2], note: e[3] || "", cat }));
```

- **비고(note)** 필드는 대체 발음을 담습니다(예: `ᜇ`는 `da` 또는 `ra`). 영어 모드에서는 `NOTE_TR` 매핑 테이블(`"ra(라)로도" → "also 'ra'"` 등)로 번역됩니다.
- **다국어 사전**은 `T = { ko: {...}, en: {...} }` 객체에 담긴 정적 UI 문자열 딕셔너리이며 `tr(key)` 함수로 조회합니다.

---

## 💾 저장소 / DB

이 앱은 **로그인 방식에 따라 저장 위치가 달라지는 이중 구조**입니다.

### 1) 클라우드 — Firebase Firestore (로그인 사용자)

| 항목 | 값 |
|---|---|
| Firebase 프로젝트 | `japanese-site-a0af9` (일본어 자매앱 Kanade와 **동일 프로젝트 재사용**) |
| Firestore 컬렉션 | **`baybay_users`** (문서 ID = Firebase 사용자 `uid`) |
| 인증 | Google 로그인 (`GoogleAuthProvider`, 팝업 → 실패 시 리다이렉트 폴백) |
| 오프라인 | `persistentLocalCache` + `experimentalForceLongPolling`으로 오프라인 캐시/큐잉 지원 |

> Kanade(가나 앱)는 `users` 컬렉션을 쓰므로, `baybay_users`로 분리해 두 앱의 기록이 섞이지 않습니다. Firebase 웹 설정값(`AIza…` apiKey 등)은 소스에 포함돼 있으나 이는 **비밀키가 아니라 공개 가능한 클라이언트 식별자**이며, 실제 접근 제어는 Firestore 보안 규칙이 담당합니다.

**권장 Firestore 보안 규칙** (본인 문서만 읽기/쓰기):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /baybay_users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

**사용자 문서 스키마 (`baybay_users/{uid}`):**

```js
{
  nick:     "홍길동",              // 표시 이름 (Google displayName)
  created:  "2026-06-14",          // 가입일 (YYYY-MM-DD)
  stats:    {                      // 글자별 통계 (키 = 바이바이인 글자)
    "ᜃ": { s: 12, w: 3 }          // s = 학습 횟수(seen), w = 오답 횟수(wrong)
  },
  activity: {                      // 날짜별 학습 카드 수 (잔디/streak 계산용)
    "2026-06-14": 40
  }
}
```

### 2) 로컬 — localStorage (게스트 & 설정)

게스트 모드에서는 프로필 전체가 브라우저 `localStorage`에 JSON으로 저장됩니다. 로그인 사용자도 설정/테마/언어는 로컬에 둡니다.

| localStorage 키 | 용도 |
|---|---|
| `baybay-guest` | 게스트 프로필 전체(JSON: `nick`/`created`/`stats`/`activity`) |
| `baybay-mode` | 마지막 로그인 방식(`"cloud"` / `"guest"`) — 재방문 시 자동 복귀 |
| `baybay-setup` | 마지막 학습 설정(선택 파트·출제 방식·하드모드·제한시간) |
| `baybay-theme` | 테마(`"light"` / `"dark"`) |
| `baybay-lang` | 언어(`"ko"` / `"en"`) |

### 게스트 · 오프라인 폴백

- Firebase SDK 로드에 실패하면(네트워크 문제 등) Google 버튼을 끄고 **게스트 전용 모드로 폴백**합니다.
- 로그인 시 먼저 **Firestore 로컬 캐시**(`getDocFromCache`)로 즉시 입장한 뒤, 백그라운드에서 서버 최신본을 가져와 동기화합니다(타임아웃 6~20초).
- 처음 로그인하는 사용자는 기존 게스트 프로필(`baybay-guest`)을 **시드(seed)** 로 삼아 클라우드 문서를 만듭니다.

---

## 🌐 외부 API · 의존성

| 의존성 | 용도 | 키 필요 여부 / 위치 |
|---|---|---|
| **Firebase Auth** | Google 소셜 로그인 | 웹 설정값(공개용 `apiKey` 등)이 소스 상단 `FIREBASE_CONFIG`에 인라인. 별도 비밀키 불필요 |
| **Firebase Firestore** | 학습 기록 클라우드 저장 | 위와 동일 프로젝트 설정 사용 |
| **Google Fonts (Noto Sans Tagalog)** | 바이바이인 글자 렌더링 | 키 불필요(공개 CDN) |
| **Web Speech API (`SpeechSynthesis`)** | 글자 발음 재생(`fil-PH`) | 키 불필요(브라우저 내장). 기기에 필리핀어 음성이 없으면 기본 음성으로 폴백 |

> ⚠️ 필리핀어(`fil-PH`) TTS 음성이 없는 기기(특히 일부 iOS)에서는 발음이 나오지 않거나 다른 음성으로 대체될 수 있습니다. 바이바이인 글자 자체는 TTS가 못 읽으므로, 로마자(`ka`, `ki` …)를 읽어주는 방식입니다.

---

## ▶️ 로컬 실행 방법

빌드 과정이 전혀 없습니다. **정적 서버로 열기만 하면** 됩니다. (ES 모듈/Firebase 로드 때문에 `file://` 직접 열기보다 로컬 서버 권장.)

```bash
# 저장소 폴더에서
python -m http.server 8000
# 또는
npx serve .
```

브라우저에서 `http://localhost:8000/` 접속 → `index.html`이 실제 앱(`바이바이인_암기카드.html`)으로 리다이렉트합니다.

> `package.json`이 없으므로 `npm install` 같은 의존성 설치 단계는 없습니다. 게스트 모드는 오프라인에서도 동작하지만, 폰트/Firebase는 인터넷 연결이 필요합니다.

---

## 🚀 배포

**GitHub Pages** 정적 호스팅입니다(별도 서버·빌드 없음).

1. 저장소 `Settings → Pages`에서 브랜치를 `main`, 폴더를 `/ (root)`로 지정.
2. 커밋/푸시하면 `https://<username>.github.io/baybayin/`으로 공개됩니다.
3. Google 로그인을 쓰려면 Firebase 콘솔의 **Authentication → 승인된 도메인**에 GitHub Pages 도메인(`clayborneyeounjunlee.github.io`)을 추가해야 합니다.

현재 배포 주소: **https://clayborneyeounjunlee.github.io/baybayin/**

---

## 📁 파일 구조

```
baybayin/
├── index.html              # 진입점 — 실제 앱 파일로 즉시 리다이렉트(1회성 래퍼)
├── 바이바이인_암기카드.html   # ⭐ 실제 앱 전체 (HTML+CSS+JS 단일 파일, 약 1,510줄)
├── 계획서.md                # 기획/설계 문서 (Kanade 구조 복제 계획, 데이터 표 등)
└── README.md               # 이 문서
```

| 파일 | 한 줄 설명 |
|---|---|
| `index.html` | `<script>`와 `<meta refresh>`로 `바이바이인_암기카드.html`로 리다이렉트하는 얇은 진입점 |
| `바이바이인_암기카드.html` | 화면 9개 · 데이터(59자) · 세션 엔진 · Firebase/게스트 저장 · 다국어 · 다크모드까지 전부 담긴 본체 |
| `계획서.md` | 일본어 자매앱 Kanade에서 무엇을 재사용/교체할지 정리한 한국어 기획 문서 |

---

## 🔗 관련 앱 (모아 허브 · 형제 앱)

- 홈 화면 우상단의 **◈ 버튼**은 개인 앱 모음 허브 **모아(moa)** 로 이동합니다 → https://clayborneyeounjunlee.github.io/moa/
- 이 앱은 일본어 가나 학습 앱 **Kanade(가나 암기카드)** 의 코드를 약 90% 재사용해 만든 형제 앱입니다. 화면 구성 · 로그인 · 통계(잔디) · 다크모드 · 한/영 전환 로직을 공유하며, **글자 데이터 · 폰트 · TTS 언어 · 브랜딩** 4가지만 바이바이인용으로 교체했습니다. Firebase도 같은 프로젝트를 쓰되 컬렉션(`baybay_users`)만 분리했습니다.
