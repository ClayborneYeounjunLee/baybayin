# Baybay (바이바이) — A Web App for Learning the Tagalog Baybayin Script

> **Master all 59 characters of Baybayin, the ancient Philippine script, "one character at a time"** — now as a **Duolingo-style game**: hearts, combos and streaks on top of flashcard practice, 6-choice quizzes, focused review of missed characters, a character chart, pronunciation playback (TTS), an activity heatmap, and error-rate statistics. Korean/English UI, dark mode, zero build step. Usable as a guest, with **Google sign-in + Firestore cloud sync** across devices.
> Baybayin is an **abugida**: consonants carry an inherent `a` vowel that changes with kudlit (dot) marks and the virama (final-consonant mark).

🔗 **Live:** https://baybayin.clayborne.dev/
📦 **Repository:** https://github.com/ClayborneYeounjunLee/baybayin

---

## 🎮 v2 — Duolingo-style renewal (2026-07)

`index.html` is now the app itself: a complete visual/UX renewal in the same bold style as its sibling app [Kanade](https://kanade.clayborne.dev/) (Jua · M PLUS Rounded 1c webfonts, plus **Noto Sans Tagalog** for the Baybayin glyphs), designed in Claude Design and shipped as plain static files.

**Screens (9):** intro · home · study setup · practice · quiz · review · result · character chart · my page

### Gamification
- ❤️ **5 hearts per quiz session** — a wrong answer costs one heart; running out ends the session early.
- 🔥 **Combo** counter with a saved best-combo record, plus the daily **study streak**.
- Session progress bar and a result screen with a per-card recap.

### Carried over from v1
- Full **59-card** Baybayin set (3 vowels / 14 basic consonants / 14 kudlit i·e / 14 kudlit u·o / 14 virama finals).
- **KO/EN** toggle, **dark mode** (auto-detect + manual), **TTS** via the Web Speech API — Filipino (`fil-PH`) voice reading the **romanization** (TTS cannot read Baybayin glyphs themselves).
- **Noto Sans Tagalog** web font so the U+1700 block renders everywhere (most systems have no Baybayin font).
- **Keyboard shortcuts:** Space/Enter = reveal/next, X = "didn't know", 1–6 = quiz choices.
- Review rule: characters **seen ≥ 3 times with an error rate ≥ 30%**.

### Accounts & sync
- **Google sign-in (Firebase Auth)** with `signInWithPopup` → automatic `signInWithRedirect` fallback when popups are blocked.
- Signed-in data syncs to **Cloud Firestore** — the **same `baybay_users/{uid}` document as v1**, so records continue seamlessly between v1 and v2 and across devices. Writes are debounced (2s) and flushed on tab hide / page leave / session end; the SDK's persistent local cache queues offline writes.
- Entry is **local-mirror-first**: a returning cloud user boots straight into home from a localStorage mirror, then the Firestore copy (cache → server, with timeouts) syncs in the background — no loading screen.
- **First sign-in promotes this device's guest records** to the cloud (nick becomes your Google display name); signing out returns you to your untouched guest profile.
- **Guest mode** still works fully without an account: data stays in this device's `localStorage`. On first run v2 also **imports v1 guest records (`baybay-guest`) read-only**; it never writes back to v1 keys.

### Tech (v2)
| Category | Details |
|---|---|
| **Runtime** | `dc-runtime.js` — declarative `<x-dc>` template + `DCLogic` component runtime; loads React 18.3.1 UMD from unpkg with SRI-pinned `<script>` tags |
| **Data** | `baybay-duo-data.js` — Baybayin data · KO/EN strings · utils ported unchanged from v1, exposed as `window.__BAYBAY_DATA` |
| **Fonts** | Google Fonts: **Jua** 400 · **M PLUS Rounded 1c** 500/700/800 · **Noto Sans Tagalog** (Baybayin glyph fallback in every font stack) |
| **Auth / DB** | Firebase JS SDK **v12.14.0** (gstatic ESM, dynamic `import()`) — Google sign-in + Firestore `baybay_users/{uid}` shared with v1; forced long polling + persistent local cache (same hardening as v1) |
| **Speech** | Web Speech API (`SpeechSynthesis`) — `fil-PH` voice (exact match → `fil`/`tl` prefix fallback), rate 0.85, reads the romanization |
| **Storage** | Guest: `localStorage` (`baybay-duo-*` keys, table below). Signed in: Firestore + a localStorage mirror for instant entry |
| **Build** | None — static files, serve as-is |

| localStorage key | Purpose |
|---|---|
| `baybay-duo-guest` | Guest study profile (`nick`, `stats`, `activity`, `bestCombo`) |
| `baybay-duo-cloud` | Local mirror of the signed-in profile (instant boot before Firestore responds) |
| `baybay-duo-mode` | `"guest"` or `"cloud"` — decides the entry path on the next visit |
| `baybay-duo-setup` | Study settings (parts, question format, hard mode, time limit) |
| `baybay-duo-lang` / `baybay-duo-theme` / `baybay-duo-sound` | UI preferences |

### File structure
```
baybayin/
├── index.html              # v2 app — Duolingo-style renewal (this is what baybayin.clayborne.dev serves)
├── dc-runtime.js           # declarative-component runtime used by index.html
├── baybay-duo-data.js      # Baybayin data + i18n module (window.__BAYBAY_DATA)
├── 바이바이인_암기카드.html   # v1 "classic" app — still served; keeps Google sign-in + Firestore sync
├── 계획서.md                # original planning document (Korean)
└── README.md               # this document
```

> **v1 stays available** at [baybayin.clayborne.dev/바이바이인_암기카드.html](https://baybayin.clayborne.dev/%EB%B0%94%EC%9D%B4%EB%B0%94%EC%9D%B4%EC%9D%B8_%EC%95%94%EA%B8%B0%EC%B9%B4%EB%93%9C.html) — it uses the same Firestore document, so progress carries over both ways. **Everything below this line documents v1.**

---

# 📚 v1 (classic) documentation

## ✨ Key Features

- **🃏 Practice mode** — Flip through flashcards and self-grade whether you knew each one. Three question formats supported: `character → sound`, `sound → character`, and `random mix`.
- **❓ Quiz mode** — Six-choice multiple choice. Instant color-coded feedback for correct/incorrect answers. Turn on **Hard mode (3/5/7-second time limit)** and any question not answered in time counts as wrong.
- **🔁 Review mode** — Automatically collects only the characters you have studied 3 or more times but **missed at least 30% of the time**, sorted by highest error rate for focused review. Re-study them in either card or quiz format.
- **🗂️ Character chart** — Five tabs: vowels, basic consonants, kudlit i/e, kudlit u/o, and finals (virama). Toggle between `character chart`/`sound chart` views, plus a hint toggle (dims the sound/character).
- **🔊 Pronunciation playback** — Tap a character in the chart to hear its Filipino (`fil-PH`) pronunciation via the Web Speech API.
- **📊 My Page** — Total cards studied, overall accuracy, days studied, study streak, a **GitHub-contribution-style study activity heatmap (last 17 weeks)**, and a **per-character error-rate heatmap**.
- **☁️ Sign-in / Guest** — Sign in with Google to store your study history in the cloud (Firestore) and continue across devices. You can also use **guest mode** without signing in, storing data on this device only.
- **🌐 Korean / English toggle & 🌙 dark mode** — Fully localized UI, light/dark themes (auto-detects system setting with manual override).
- **⌨️ Keyboard support** — Practice: `Space`/`Enter` (reveal answer / "I knew it"), `X` ("I didn't know") / Quiz: number keys `1~6` to select.
- **📱 Mobile web app optimized** — `safe-area-inset` handling, iOS add-to-home-screen (`apple-mobile-web-app-*`), max-width 520px portrait layout.

---

## 🧱 Tech Stack / Languages

| Category | Details |
|---|---|
| Language | **Pure HTML + CSS + vanilla JavaScript** (no framework) |
| App format | Markup, CSS, and JS all inlined in a **single HTML file** |
| JS modules | Main script is an **ES module** (`<script type="module">`); Firebase SDK loaded via dynamic `import()` |
| Build tools | **None** (runs directly in the browser with no bundler or transpiler) |
| Auth/DB SDK | **Firebase JS SDK `12.14.0`** — `firebase-app` / `firebase-auth` / `firebase-firestore` loaded from the `gstatic.com` ESM CDN |
| Fonts | Body text uses the system font stack (`Pretendard`, `Apple SD Gothic Neo`, `Noto Sans KR`, etc.); **Baybayin characters use the Google Fonts `Noto Sans Tagalog` web font** |
| Speech | Built-in browser **Web Speech API** (`SpeechSynthesis`) |
| Icons | No external images — **inline SVG data URI** favicon plus a Unicode Baybayin character (`ᜊ`) |

### Why embed Noto Sans Tagalog?

Baybayin characters (`ᜃ`, `ᜊ`, `ᜈ` …) have no default font on most devices and would render as **empty boxes (□)**. So the web font is set via the CSS variable `--baybayin-font: "Noto Sans Tagalog", ...` and loaded in `<head>` like this.

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tagalog&display=swap" rel="stylesheet">
```

### CDN / external load list

```
https://fonts.googleapis.com / fonts.gstatic.com        → Noto Sans Tagalog web font
https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js
https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js
https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js
```

---

## 🏗️ System Architecture

### Single file · screen-switching (SPA) approach

The entire v1 app lives in one file, `바이바이인_암기카드.html`. There is no router — the app works by **toggling classes on 9 screen `<div>`s** to show and hide them.

```
loading → auth → home → study → practice → quiz → result → charts → mypage
```

The `showScreen(name)` function iterates over the `SCREENS` array, keeping only the target screen visible and adding `.hidden` to the rest.

### Boot flow (initialization order)

1. An inline script in `<head>` reads `baybay-theme` from `localStorage` (or the OS dark-mode setting) and pre-applies the theme **without any flash**.
2. Module script entry → `restoreSetup()` (restore previous study settings) → `applyLang()` (apply language) → show loading screen.
3. `initFirebase()` attempts to dynamically load the Firebase SDK.
   - **On success:** `onAuthStateChanged` watches the sign-in state → if signed in, `startCloud()`; otherwise if the user was previously a guest, `startGuest()`; else show the sign-in screen.
   - **On failure (e.g. network):** disable the Google button → fall back to guest-only mode.

### Core modules · functions

| Area | Key functions |
|---|---|
| Screen switching | `showScreen()`, `visible()`, `enterApp()` |
| Data layer | `record()` (study logging), `scheduleSave()` / `flushSave()` (**2-second debounced saving**), `freshProfile()` |
| Auth | `startGuest()`, `startCloud()`, `applyCloud()`, `syncFromCloud()`, `profileFromSeed()` |
| Session engine | `startSession()`, `renderPractice()` / `revealPractice()` / `gradePractice()`, `renderQuiz()` / `buildOptions()` / `answerQuiz()`, `showResult()` |
| Review | `remindCards()` (error-rate filter), `renderReview()` |
| Character chart | `renderCharts()`, `chartSections()`, `speak()` (TTS) |
| My Page | `renderMypage()`, `heatCell()` (error-rate heatmap), `calcStreak()` / `calcTotals()` |
| i18n/theme | `tr()`, `applyLang()`, `applyTheme()` / `setTheme()` |

### State management

- State is managed with **module-scoped variables**, no framework: `mode` (`cloud`/`guest`), `uid`, `profile`, `session` (current study session), `studyTab` / `partsSel` / `studyMode` / `hardLimit` (study settings), `L` (language), and the theme.
- All user data is consolidated into a single `profile` object, and saves are **debounced by 2 seconds** (`scheduleSave`) rather than firing on every card, minimizing writes. On tab switch (`visibilitychange`) or page exit (`pagehide`), `flushSave()` runs immediately.

### Study session logic highlights

- **Practice:** Shuffle the selected cards → decide the question direction (`char`/`sound`) per card → after revealing the answer, grade with "knew it" / "didn't know"; missed cards can be re-studied from the results screen.
- **Quiz:** `buildOptions()` picks 5 wrong answers from the current deck while avoiding duplicate romanizations to build the 6-choice question (topping up from the full pool if short). Hard mode uses a 50ms-interval timer to shrink the progress bar; hitting zero auto-marks the answer wrong.
- **Review criteria:** `REMIND_MIN_SEEN = 3` (studied 3 or more times) and `REMIND_MIN_RATE = 0.3` (error rate of 30% or higher).

---

## 🗂️ Data

All study data is **hardcoded as JS arrays with no external files**. The format is `[character, romanization, Korean, (optional) note]`, and the `mk()` helper converts entries into `{ char, roma, kor, note, cat }` objects.

### Part breakdown (59 characters total)

| Part key (`cat`) | Name | Count | Description |
|---|---|---|---|
| `vowel` | Vowels (Patinig) | 3 | `ᜀ a`, `ᜁ i/e`, `ᜂ u/o` |
| `basic` | Basic consonants + a | 14 | `ᜃ ka` … `ᜑ ha` (base consonant forms with the inherent vowel `a`) |
| `kudlitI` | Kudlit i/e (dot above) | 14 | `ᜃᜒ ki` … `ᜑᜒ hi` |
| `kudlitU` | Kudlit u/o (dot below) | 14 | `ᜃᜓ ku` … `ᜑᜓ hu` |
| `virama` | Finals / bare consonants (virama ᜔) | 14 | `ᜃ᜔ k` … `ᜑ᜔ h` (introduced during the Spanish colonial era) |

> Total = 3 + 14 + 14 + 14 + 14 = **59 characters**. The `POOLS` object holds the per-part arrays, and `FULL_POOL` is the flattened full list.

### Actual data snippet

```js
const VOWELS = [
  ["ᜀ","a","아"], ["ᜁ","i","이","e(에)로도"], ["ᜂ","u","우","o(오)로도"]
];
const BASIC = [ // basic consonants + a
  ["ᜃ","ka","카"], ["ᜄ","ga","가"], ["ᜅ","nga","응아"], ["ᜆ","ta","타"], ["ᜇ","da","다","ra(라)로도"],
  ["ᜈ","na","나"], ["ᜉ","pa","파"], ["ᜊ","ba","바"], /* … */
];
// mk() converts these into an array of { char, roma, kor, note, cat } objects (kor = Korean phonetic reading)
const mk = (arr, cat) => arr.map(e => ({ char: e[0], roma: e[1], kor: e[2], note: e[3] || "", cat }));
```

- The **note** field holds alternate pronunciations (e.g. `ᜇ` can be `da` or `ra`). In English mode these are translated via the `NOTE_TR` mapping table (`"ra(라)로도" → "also 'ra'"`, etc.).
- The **localization dictionary** is a static UI string dictionary stored in the `T = { ko: {...}, en: {...} }` object, looked up with the `tr(key)` function.

---

## 💾 Storage / DB

This app has a **dual storage structure where the storage location depends on the sign-in method**.

### 1) Cloud — Firebase Firestore (signed-in users)

| Item | Value |
|---|---|
| Firebase project | `japanese-site-a0af9` (**shared with the Japanese sibling app Kanade — same project reused**) |
| Firestore collection | **`baybay_users`** (document ID = Firebase user `uid`) |
| Auth | Google sign-in (`GoogleAuthProvider`, popup → redirect fallback on failure) |
| Offline | Offline caching/queueing via `persistentLocalCache` + `experimentalForceLongPolling` |

> Kanade (the kana app) uses the `users` collection, so this app is separated into `baybay_users` to keep the two apps' records from mixing. The Firebase web config values (the `AIza…` apiKey, etc.) are included in the source, but these are **publicly shareable client identifiers, not secret keys** — actual access control is handled by Firestore security rules.

**Recommended Firestore security rules** (each user can read/write only their own document):

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

**User document schema (`baybay_users/{uid}`):**

```js
{
  nick:     "홍길동",              // display name (Google displayName; "홍길동" is a placeholder name like "John Doe")
  created:  "2026-06-14",          // sign-up date (YYYY-MM-DD)
  stats:    {                      // per-character stats (key = baybayin character)
    "ᜃ": { s: 12, w: 3 }          // s = times seen, w = times wrong
  },
  activity: {                      // cards studied per day (for the contribution-grass/streak charts)
    "2026-06-14": 40
  }
}
```

### 2) Local — localStorage (guests & settings)

In guest mode, the entire profile is stored as JSON in the browser's `localStorage`. Signed-in users also keep their settings/theme/language locally.

| localStorage key | Purpose |
|---|---|
| `baybay-guest` | Full guest profile (JSON: `nick`/`created`/`stats`/`activity`) |
| `baybay-mode` | Last sign-in method (`"cloud"` / `"guest"`) — auto-restored on return visits |
| `baybay-setup` | Last study settings (selected parts, question format, hard mode, time limit) |
| `baybay-theme` | Theme (`"light"` / `"dark"`) |
| `baybay-lang` | Language (`"ko"` / `"en"`) |

### Guest · offline fallback

- If the Firebase SDK fails to load (network issues, etc.), the Google button is disabled and the app **falls back to guest-only mode**.
- On sign-in, the app first enters immediately using the **Firestore local cache** (`getDocFromCache`), then fetches and syncs the latest server copy in the background (6–20 second timeout).
- For first-time sign-ins, the existing guest profile (`baybay-guest`) is used as a **seed** to create the cloud document.

---

## 🌐 External APIs · Dependencies

| Dependency | Purpose | Key required / location |
|---|---|---|
| **Firebase Auth** | Google social sign-in | Web config values (the public `apiKey`, etc.) are inlined in `FIREBASE_CONFIG` at the top of the source. No separate secret key needed |
| **Firebase Firestore** | Cloud storage of study history | Uses the same project config as above |
| **Google Fonts (Noto Sans Tagalog)** | Rendering Baybayin characters | No key needed (public CDN) |
| **Web Speech API (`SpeechSynthesis`)** | Character pronunciation playback (`fil-PH`) | No key needed (built into the browser). Falls back to the default voice if the device lacks a Filipino voice |

> ⚠️ On devices without a Filipino (`fil-PH`) TTS voice (especially some iOS devices), pronunciation may not play or may use a different voice. Since TTS cannot read Baybayin characters themselves, the app reads out the romanizations (`ka`, `ki` …).

---

## ▶️ Running Locally

There is no build step at all. **Just serve it with a static server.** (Because of ES modules and Firebase loading, a local server is recommended over opening via `file://` directly.)

```bash
# from the repo folder
python -m http.server 8000
# or
npx serve .
```

> ⚠️ Changed in v2: `index.html` used to be a redirect stub pointing to the classic app. It is now the v2 app itself; open `바이바이인_암기카드.html` directly for v1.

> There is no `package.json`, so there is no dependency-installation step like `npm install`. Guest mode works offline, but fonts/Firebase require an internet connection.

---

## 🚀 Deployment

Served as static files by the Caddy container on `clayborne.dev` (see the routing table in the server's ops notes) — deploying is just `git pull` in the app directory; there is no build or restart step.

1. Domain: **https://baybayin.clayborne.dev/** (wildcard DNS + automatic Let's Encrypt TLS via Caddy).
2. To use Google sign-in, the serving domain must be listed under **Authentication → Authorized domains** in the Firebase console.

---

## 📁 File Structure (v1 part of the repo)

```
baybayin/
├── 바이바이인_암기카드.html   # ⭐ the entire v1 app ("Baybayin flashcards"; single HTML+CSS+JS file, ~1,510 lines)
└── 계획서.md                # planning/design document ("plan"; scheme to replicate Kanade's structure, data tables, etc.)
```

| File | One-line description |
|---|---|
| `바이바이인_암기카드.html` | The v1 body containing everything: 9 screens, data (59 characters), session engine, Firebase/guest storage, localization, and dark mode |
| `계획서.md` | Korean planning document outlining what to reuse/replace from the Japanese sibling app Kanade |

> Note: before v2, `index.html` was a thin entry point that redirected here via `<script>` and `<meta refresh>`.

---

## 🔗 Related Apps (sibling app)

- This app is a sibling app built by reusing the structure of **Kanade (kana flashcards)**, a Japanese kana learning app — screen layout, sign-in, statistics (contribution graph), dark mode, and Korean/English toggle logic are shared, replacing only the **character data, font, TTS language, and branding** for Baybayin. Firebase uses the same project as well, with only the collection (`baybay_users`) separated.
- Hub / portfolio: https://clayborne.dev/
