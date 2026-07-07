window.__BAYBAY_DATA = (function(){
/* baybay-duo-data.js
   바이바이 원본(baybayin/바이바이인_암기카드.html)에서 그대로 이식한 데이터 · 유틸 모듈.
   바이바이인 문자 데이터, KO/EN 번역, 문자표 레이아웃, 복습 기준, 데모 프로필 생성기. */

/* ═════════ 데이터: [문자, 로마자, 한글, 비고] (원본 그대로) ═════════
   바이바이인 = 아부기다. 자음에 기본 모음 'a'가 붙어 있고,
   쿠들릿(점)을 위(i/e)·아래(u/o)에 찍어 모음을 바꾸고, 비라마(✝)로 받침을 만든다. */
const VOWELS = [
  ["ᜀ","a","아"],["ᜁ","i","이","e(에)로도"],["ᜂ","u","우","o(오)로도"]
];
const BASIC = [ // 기본 자음 + a
  ["ᜃ","ka","카"],["ᜄ","ga","가"],["ᜅ","nga","응아"],["ᜆ","ta","타"],["ᜇ","da","다","ra(라)로도"],
  ["ᜈ","na","나"],["ᜉ","pa","파"],["ᜊ","ba","바"],["ᜋ","ma","마"],["ᜌ","ya","야"],
  ["ᜎ","la","라"],["ᜏ","wa","와"],["ᜐ","sa","사"],["ᜑ","ha","하"]
];
const KUDLIT_I = [ // 위에 쿠들릿 → i/e 소리
  ["ᜃᜒ","ki","키"],["ᜄᜒ","gi","기"],["ᜅᜒ","ngi","응이"],["ᜆᜒ","ti","티"],["ᜇᜒ","di","디","ri(리)로도"],
  ["ᜈᜒ","ni","니"],["ᜉᜒ","pi","피"],["ᜊᜒ","bi","비"],["ᜋᜒ","mi","미"],["ᜌᜒ","yi","이"],
  ["ᜎᜒ","li","리"],["ᜏᜒ","wi","위"],["ᜐᜒ","si","시"],["ᜑᜒ","hi","히"]
];
const KUDLIT_U = [ // 아래에 쿠들릿 → u/o 소리
  ["ᜃᜓ","ku","쿠"],["ᜄᜓ","gu","구"],["ᜅᜓ","ngu","응우"],["ᜆᜓ","tu","투"],["ᜇᜓ","du","두","ru(루)로도"],
  ["ᜈᜓ","nu","누"],["ᜉᜓ","pu","푸"],["ᜊᜓ","bu","부"],["ᜋᜓ","mu","무"],["ᜌᜓ","yu","유"],
  ["ᜎᜓ","lu","루"],["ᜏᜓ","wu","우"],["ᜐᜓ","su","수"],["ᜑᜓ","hu","후"]
];
const VIRAMA = [ // 비라마(크루스 쿠들릿) → 모음 제거, 받침/순수 자음
  ["ᜃ᜔","k","ㄱ"],["ᜄ᜔","g","ㄱ"],["ᜅ᜔","ng","ㅇ"],["ᜆ᜔","t","ㄷ"],["ᜇ᜔","d","ㄷ","r(ㄹ)로도"],
  ["ᜈ᜔","n","ㄴ"],["ᜉ᜔","p","ㅂ"],["ᜊ᜔","b","ㅂ"],["ᜋ᜔","m","ㅁ"],["ᜌ᜔","y","y"],
  ["ᜎ᜔","l","ㄹ"],["ᜏ᜔","w","w"],["ᜐ᜔","s","ㅅ"],["ᜑ᜔","h","ㅎ"]
];

// cat = 파트 키(catName으로 번역). note = 한국어 원문(noteText로 번역)
const mk = (arr, cat) => arr.map(e => ({ char: e[0], roma: e[1], kor: e[2], note: e[3] || "", cat }));
const POOLS = {
  vowel:   mk(VOWELS,   "vowel"),
  basic:   mk(BASIC,    "basic"),
  kudlitI: mk(KUDLIT_I, "kudlitI"),
  kudlitU: mk(KUDLIT_U, "kudlitU"),
  virama:  mk(VIRAMA,   "virama")
};
const FULL_POOL = Object.values(POOLS).flat();

// 비고(note) 한국어 원문 → 영어
const NOTE_TR = {
  "e(에)로도":"also 'e'",
  "o(오)로도":"also 'o'",
  "ra(라)로도":"also 'ra'",
  "ri(리)로도":"also 'ri'",
  "ru(루)로도":"also 'ru'",
  "r(ㄹ)로도":"also 'r'"
};

/* ═════════ 학습 파트 · 표 레이아웃 (원본 그대로) ═════════ */
const PART_GROUPS = [
  { cat: "main", items: [["vowel","pVowel"],["basic","pBasic"],["kudlitI","pKudlitI"],["kudlitU","pKudlitU"],["virama","pVirama"]] }
];
const chunkRows = (n, per) => {
  const rows = [];
  for (let i = 0; i < n; i += per) rows.push(Array.from({length: per}, (_, j) => i + j < n ? i + j : null));
  return rows;
};
const CHART_TABS = [["vowel","cat_vowel"],["basic","cat_basic"],["kudlitI","cat_kudlitI"],["kudlitU","cat_kudlitU"],["virama","cat_virama"]];
const STAT_SECTIONS = ["vowel","basic","kudlitI","kudlitU","virama"];
const REMIND_MIN_SEEN = 3, REMIND_MIN_RATE = 0.3;

/* ═════════ 유틸 ═════════ */
function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
const pad2 = n => String(n).padStart(2, "0");
const dateKey = d => d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
const todayKey = () => dateKey(new Date());

/* ═════════ 다국어 (원본 전체 + 게임화 신규 키 — 키 집합은 카나데 v2와 동일) ═════════ */
const T = {
  ko: {
    brandSub:"바이바이",
    tagline:"바이바이인, 글자 하나하나 천천히 ✍️",
    googleBtn:"Google로 시작하기",
    authStart:"이 기기에서 바로 시작하기",
    loginBusy:"Google 로그인 창을 여는 중…",
    fbLoading:"로그인 준비 중이에요. 잠시 후 다시 눌러 주세요.",
    loginFail:"로그인에 실패했어요: ",
    moduleFail:"로그인 모듈을 불러오지 못했어요. 게스트로 이용해 주세요.",
    cloudMeta:"클라우드 동기화",
    authHint:"게스트는 이 기기에만 저장, Google 로그인은 클라우드에 저장돼 기기 간에 이어져요.",
    toDark:"다크 모드로 전환", toLight:"라이트 모드로 전환",
    greetLine1:"안녕하세요,", greetHonorific:"님",
    heroSub:"오늘도 글자 하나하나, 천천히 익혀봐요.",
    qsToday:"오늘 학습", qsStreak:"연속 학습일", qsAcc:"전체 정답률",
    studyName:"학습하기", studyDesc:"연습 · 퀴즈 · 복습을 한 곳에서",
    chartsName:"문자표", chartsDesc:"모음 · 자음 · 쿠들릿 · 받침",
    myName:"마이페이지", myDesc:"학습 기록 · 오답률 · 로그아웃",
    segPractice:"🃏 연습", segQuiz:"❓ 퀴즈", segReview:"🔁 복습",
    labelParts:"학습할 파트", labelMode:"출제 방식",
    modeChar:"글자 → 발음", modeSound:"발음 → 글자", modeRandom:"랜덤 믹스",
    labelHard:"하드 모드", hardName:"⏱ 제한시간", hardDesc:"시간 안에 못 고르면 오답 처리",
    totalPre:"총 ", totalPost:"장의 카드가 랜덤 순서로 나와요",
    beginPractice:"연습 시작", beginQuiz:"퀴즈 시작",
    reviewIntro:"3회 이상 학습했는데 오답률이 30% 이상인 글자를 모아 집중 복습합니다. 오답률 높은 순으로 보여드려요.",
    quitTitle:"그만하기", revealBtn:"정답 보기",
    revealHint:"카드를 누르거나 스페이스/엔터로 정답 보기",
    gradeHint:"스페이스/엔터 = 알았어요 · X = 몰랐어요",
    dunnoBtn:"✗ 몰랐어요", knowBtn:"✓ 알았어요",
    quizKbdHint:"키보드 1〜6으로도 선택할 수 있어요",
    restartAllBtn:"전체 다시 (재셔플)", toSetupBtn:"학습 설정으로", homeBtn:"홈으로",
    resultPracticeTitle:"연습 완료!", resultQuizTitle:"퀴즈 완료!",
    heartsOutTitle:"하트가 다 떨어졌어요!",
    heartsOutSub:"괜찮아요 — 틀린 글자만 다시 도전해봐요!",
    scoreKnew:"알았어요", scoreDunno:"몰랐어요",
    scoreCorrect:"정답", scoreWrong:"오답", scoreRate:"오답률", scoreCombo:"최고 콤보",
    comboSuffix:" 콤보!",
    retryWrongPractice:"📝 저장한 카드만 다시 학습", retryWrongQuiz:"💪 틀린 것만 다시 퀴즈",
    reviewPracticeBtn:"🃏 카드로 복습하기", reviewQuizBtn:"❓ 퀴즈로 복습하기",
    reviewEmpty:"아직 복습이 필요한 글자가 없어요 🌿 연습 · 퀴즈를 진행하면 기록이 쌓이고, 3회 이상 학습 + 오답률 30% 이상인 글자가 여기에 모입니다.",
    ctypeChar:"문자 표", ctypeSound:"발음 표", hintName:"힌트 표시",
    hintDescChar:"글자 아래에 발음을 흐리게 표시", hintDescSound:"발음 아래에 글자를 흐리게 표시",
    chartSpeakHint:"🔊 글자를 누르면 읽어줘요",
    statTotal:"총 학습 카드", statAcc:"전체 정답률", statDays:"학습한 날", statStreak:"연속 학습일",
    activityTitle:"🌱 학습 활동 (최근 17주)", legendLess:"적음", legendMore:"많음",
    errTitle:"📊 글자별 오답률",
    langName:"🌐 English mode", langDesc:"끄면 한국어로 표시",
    darkName:"🌙 다크 모드", darkDesc:"어두운 곳에서 눈이 편한 테마",
    soundName:"🔊 사운드 이펙트", soundDesc:"정답 · 오답 · 콤보 효과음",
    logoutBtn:"로그아웃",
    unseen:"미학습", guest:"게스트", learner:"학습자",
    guestLocal:"게스트 · 이 기기에만 저장", since:"시작일",
    streakSuffix:"일 연속",
    moaLink:"◈ 모아 허브로",
    pVowel:"모음 3", pBasic:"기본 14", pKudlitI:"kudlit i 14", pKudlitU:"kudlit u 14", pVirama:"받침 14",
    cat_main:"바이바이인 문자",
    cat_vowel:"모음", cat_basic:"기본 (a)", cat_kudlitI:"kudlit i/e", cat_kudlitU:"kudlit u/o", cat_virama:"받침 (비라마)"
  },
  en: {
    brandSub:"Baybayin Flashcards",
    tagline:"Baybayin — one character at a time ✍️",
    googleBtn:"Continue with Google",
    authStart:"Start on this device",
    loginBusy:"Opening Google sign-in…",
    fbLoading:"Sign-in is still loading — try again in a moment.",
    loginFail:"Sign-in failed: ",
    moduleFail:"Couldn't load the sign-in module. Please continue as guest.",
    cloudMeta:"Cloud sync",
    authHint:"Guest data stays on this device; sign in with Google to sync across devices.",
    toDark:"Switch to dark mode", toLight:"Switch to light mode",
    greetLine1:"Hello,", greetHonorific:"",
    heroSub:"One character a day, slow and steady.",
    qsToday:"Today", qsStreak:"Day streak", qsAcc:"Accuracy",
    studyName:"Study", studyDesc:"Practice · Quiz · Review in one place",
    chartsName:"Chart", chartsDesc:"Vowels · Consonants · Kudlit · Virama",
    myName:"My Page", myDesc:"History · Errors · Logout",
    segPractice:"🃏 Practice", segQuiz:"❓ Quiz", segReview:"🔁 Review",
    labelParts:"Parts to study", labelMode:"Question type",
    modeChar:"Glyph → Reading", modeSound:"Reading → Glyph", modeRandom:"Random mix",
    labelHard:"Hard mode", hardName:"⏱ Time limit", hardDesc:"Counts as wrong if time runs out",
    totalPre:"", totalPost:" cards in random order",
    beginPractice:"Start practice", beginQuiz:"Start quiz",
    reviewIntro:"Characters studied 3+ times with an error rate of 30%+ are gathered here for focused review, sorted by highest error rate.",
    quitTitle:"Quit", revealBtn:"Show answer",
    revealHint:"Tap the card or press Space/Enter to reveal",
    gradeHint:"Space/Enter = Knew it · X = Didn't know",
    dunnoBtn:"✗ Didn't know", knowBtn:"✓ Knew it",
    quizKbdHint:"You can also pick with keys 1–6",
    restartAllBtn:"Restart all (reshuffle)", toSetupBtn:"Back to setup", homeBtn:"Home",
    resultPracticeTitle:"Practice done!", resultQuizTitle:"Quiz done!",
    heartsOutTitle:"Out of hearts!",
    heartsOutSub:"No worries — retry just the ones you missed!",
    scoreKnew:"Knew", scoreDunno:"Didn't",
    scoreCorrect:"Correct", scoreWrong:"Wrong", scoreRate:"Error %", scoreCombo:"Best combo",
    comboSuffix:" combo!",
    retryWrongPractice:"📝 Restudy saved cards", retryWrongQuiz:"💪 Retry wrong ones",
    reviewPracticeBtn:"🃏 Review with cards", reviewQuizBtn:"❓ Review with quiz",
    reviewEmpty:"No characters need review yet 🌿 Do some practice or quizzes to build up records. Characters studied 3+ times with a 30%+ error rate appear here.",
    ctypeChar:"Characters", ctypeSound:"Readings", hintName:"Show hint",
    hintDescChar:"Show the reading faintly under each character", hintDescSound:"Show the character faintly under each reading",
    chartSpeakHint:"🔊 Tap a character to hear it",
    statTotal:"Total cards", statAcc:"Accuracy", statDays:"Days studied", statStreak:"Day streak",
    activityTitle:"🌱 Activity (last 17 weeks)", legendLess:"Less", legendMore:"More",
    errTitle:"📊 Error rate by character",
    langName:"🌐 한국어 (Korean)", langDesc:"Turn off for Korean",
    darkName:"🌙 Dark mode", darkDesc:"Easy on the eyes in the dark",
    soundName:"🔊 Sound effects", soundDesc:"Correct · wrong · combo sounds",
    logoutBtn:"Logout",
    unseen:"Unseen", guest:"Guest", learner:"Learner",
    guestLocal:"Guest · saved on this device only", since:"since",
    streakSuffix:"-day streak",
    moaLink:"◈ Back to moa hub",
    pVowel:"Vowels 3", pBasic:"Basic 14", pKudlitI:"kudlit i 14", pKudlitU:"kudlit u 14", pVirama:"Virama 14",
    cat_main:"Baybayin",
    cat_vowel:"Vowels", cat_basic:"Basic (a)", cat_kudlitI:"kudlit i/e", cat_kudlitU:"kudlit u/o", cat_virama:"Final (virama)"
  }
};

/* ═════════ 데모 프로필 (디자인 리뷰용 — 잔디·오답률·복습 목록이 채워져 보이도록, 59장 기준) ═════════ */
function makeDemoProfile(){
  const stats = {}, activity = {};
  const today = new Date();
  // 오늘 포함 7일 연속 스트릭
  for (let i = 0; i < 7; i++){
    const d = new Date(today); d.setDate(d.getDate() - i);
    activity[dateKey(d)] = i === 0 ? 24 : 8 + Math.floor(Math.random() * 42);
  }
  // 최근 17주에 드문드문 활동
  for (let i = 8; i < 119; i++){
    if (Math.random() < 0.45){
      const d = new Date(today); d.setDate(d.getDate() - i);
      activity[dateKey(d)] = 3 + Math.floor(Math.random() * 62);
    }
  }
  // 글자별 기록: 절반쯤 학습, 일부는 복습 대상(오답률 30%+)이 되도록 (stats 키 = char)
  FULL_POOL.forEach(c => {
    if (Math.random() < 0.55){
      const s = 3 + Math.floor(Math.random() * 12);
      let w = Math.random() < 0.25
        ? Math.ceil(s * (0.3 + Math.random() * 0.4))
        : Math.floor(s * Math.random() * 0.25);
      if (w > s) w = s;
      stats[c.char] = { s, w };
    }
  });
  const created = new Date(today); created.setDate(created.getDate() - 118);
  return { nick: "이연준", created: dateKey(created), stats, activity, bestCombo: 12 };
}

return { VOWELS, BASIC, KUDLIT_I, KUDLIT_U, VIRAMA, POOLS, FULL_POOL, NOTE_TR, PART_GROUPS, chunkRows, CHART_TABS, STAT_SECTIONS, REMIND_MIN_SEEN, REMIND_MIN_RATE, shuffle, pad2, dateKey, todayKey, T, makeDemoProfile };
})();
