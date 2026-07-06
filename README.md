# Baybay (바이바이) — A Web App for Learning the Tagalog Baybayin Script

> A single-file web app for mastering all 59 characters of **Baybayin**, the ancient Philippine script, through flashcards, quizzes, and review sessions.
> Baybayin is an **abugida** writing system in which consonants carry an inherent `a` vowel that changes with kudlit (dot) marks and the virama (final-consonant mark) — this app is designed to teach it slowly, one character at a time.

🔗 **Live demo:** https://clayborneyeounjunlee.github.io/baybayin/

> When you visit the live link, `index.html` immediately redirects to the actual app file (`바이바이인_암기카드.html`, "Baybayin flashcards").

---

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

The entire app lives in one file, `바이바이인_암기카드.html`. There is no router — the app works by **toggling classes on 9 screen `<div>`s** to show and hide them.

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

Open `http://localhost:8000/` in your browser → `index.html` redirects to the actual app (`바이바이인_암기카드.html`).

> There is no `package.json`, so there is no dependency-installation step like `npm install`. Guest mode works offline, but fonts/Firebase require an internet connection.

---

## 🚀 Deployment

Static hosting on **GitHub Pages** (no separate server or build).

1. In the repository's `Settings → Pages`, set the branch to `main` and the folder to `/ (root)`.
2. Commit/push and it goes live at `https://<username>.github.io/baybayin/`.
3. To use Google sign-in, add the GitHub Pages domain (`clayborneyeounjunlee.github.io`) under **Authentication → Authorized domains** in the Firebase console.

Current deployment URL: **https://clayborneyeounjunlee.github.io/baybayin/**

---

## 📁 File Structure

```
baybayin/
├── index.html              # entry point — immediately redirects to the actual app file (one-shot wrapper)
├── 바이바이인_암기카드.html   # ⭐ the entire app ("Baybayin flashcards"; single HTML+CSS+JS file, ~1,510 lines)
├── 계획서.md                # planning/design document ("plan"; scheme to replicate Kanade's structure, data tables, etc.)
└── README.md               # this document
```

| File | One-line description |
|---|---|
| `index.html` | Thin entry point that redirects to `바이바이인_암기카드.html` via `<script>` and `<meta refresh>` |
| `바이바이인_암기카드.html` | The main body containing everything: 9 screens, data (59 characters), session engine, Firebase/guest storage, localization, and dark mode |
| `계획서.md` | Korean planning document outlining what to reuse/replace from the Japanese sibling app Kanade |

---

## 🔗 Related Apps (moa hub · sibling app)

- The **◈ button** at the top right of the home screen leads to **moa**, a personal app collection hub → https://clayborneyeounjunlee.github.io/moa/
- This app is a sibling app built by reusing roughly 90% of the code from **Kanade (kana flashcards)**, a Japanese kana learning app. It shares the screen layout, sign-in, statistics (contribution graph), dark mode, and Korean/English toggle logic, replacing only 4 things for Baybayin: **character data, font, TTS language, and branding**. Firebase uses the same project as well, with only the collection (`baybay_users`) separated.
