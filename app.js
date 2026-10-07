const grid = document.querySelector("#placeGrid");
const searchInput = document.querySelector("#searchInput");
const searchBox = document.querySelector("#searchBox");
const countryFilter = document.querySelector("#countryFilter");
const prefectureFilter = document.querySelector("#prefectureFilter");
const workFilter = document.querySelector("#workFilter");
const workSuggestions = document.querySelector("#workSuggestions");
const workSuggestionsToggle = document.querySelector("#workSuggestionsToggle");
const visitFilter = document.querySelector("#visitFilter");
const filterReset = document.querySelector("#filterReset");
const filterSearch = document.querySelector("#filterSearch");
const resultStatus = document.querySelector("#resultStatus");
const challengeGrid = document.querySelector("#challengeGrid");
const challengeListStatus = document.querySelector("#challengeListStatus");
const dialog = document.querySelector("#placeDialog");
const dialogContent = document.querySelector("#dialogContent");
const submissionForm = document.querySelector("#submissionForm");
const formStatus = document.querySelector("#formStatus");
const visitStatus = document.querySelector("#visitStatus");
const visitConditionsField = document.querySelector("#visitConditionsField");
const visitConditions = document.querySelector("#visitConditions");
const themeToggle = document.querySelector("#themeToggle");
const themeToggleText = document.querySelector("#themeToggleText");
const siteHeader = document.querySelector(".site-header");
const mobileMenuToggle = document.querySelector("#mobileMenuToggle");
const mobileMenuText = document.querySelector("#mobileMenuText");
const languageSelect = document.querySelector("#languageSelect");
const translations = {
  ja: {
    homeAria:"ホームへ", mainNavAria:"メインナビゲーション", statsAria:"データ統計", languageAria:"言語を選択", privacyLink:"利用案内・プライバシー", exploreNav:"聖地を探す", worksNav:"作品から探す", mapNav:"地図・現在地から探す", submitNav:"聖地申請",
    searchPlaceholder:"場所・シーンから検索", countryLabel:"国", prefectureLabel:"都道府県・地域", workLabel:"作品名", visitLabel:"訪問可否", workPlaceholder:"作品名を入力", filterSearch:"検索する", reset:"リセット",
    heroHeading:"アニメの記憶を、<br /><em>地図の上へ。</em>", heroCopy:"提供データをもとに、作品・場面・実在の場所を記録する<br />聖地データベース。", worksStat:"作品", placesStat:"登録地点", prefecturesStat:"都道府県", scenesStat:"シーン", footerText:"データ探索プロトタイプ",
    exploreHeading:"聖地を探す", exploreDescription:"キーワードと条件を組み合わせて、行きたい聖地を探せます。", submissionHeading:"知っている聖地を<br /><em>申請する。</em>",
    submissionDescription:"未登録の場所や、より正確な情報があれば教えてください。根拠が分かるリンクや資料があると確認しやすくなります。", submissionDisclaimer:"申請内容は運営の確認待ちとして保存されます。個人情報は掲載せず、確認作業にのみ使用します。",
    allCountries:"すべての国", selectCountry:"先に国を選択", allPrefectures:"すべての都道府県・地域", regionUnavailable:"この国は地域情報が未登録です", allVisits:"すべて", visitFree:"自由訪問可能", visitConditional:"条件付き", visitExterior:"外観のみ", results:n=>`${n} 件の地点を表示中`, noResults:"条件に一致する地点がありません。別の言葉で検索してみてください。",
    openWorks:"作品候補を開く", closeWorks:"作品候補を閉じる", photoPending:"写真は準備中です", photoSearching:"写真を探しています", photoAdd:"写真を追加できます", photoAfterReview:"確認後に追加されます", photoCredit:"写真提供：掲載情報",
    work:"登場作品", episode:"収録", category:"カテゴリ", coordinates:"座標", visit:"訪問可否", address:"住所", scene:"シーン", visitConditions:"訪問条件", source:"確認根拠", sourceLink:"公式情報を確認 ↗", map:"Google マップで確認 ↗", workData:w=>`「${w}」の作品データを表示`, checked:"最終確認日：", approvedCorrection:"承認済みの訂正情報", correctionSummary:"この情報の訂正・写真追加を申請する",
    correctionLabels:["申請内容","訂正・追加内容","確認できるURL","写真（任意）","連絡先（任意）"], submissionLabels:["作品名","聖地スポット名","都道府県","市区町村","座標","訪問可否","訪問条件","写真（任意）","登場シーン・補足","根拠となるURL・資料","連絡先（任意）"], correctionOption:"情報の訂正", imageOption:"写真の追加", send:"申請を送信する",
    nearbyHeading:"現在地から探す", locate:"◎ 現在地から探す", clearLocation:"現在地をクリア", order:"表示順", defaultOrder:"登録順", nearOrder:"現在地から近い順", mapResults:"検索結果を地図に表示", mapNote:"距離は登録地点までの直線距離です。徒歩距離ではありません。橙は登録地点、青は確認済みの撮影地点です。訪問条件は各地点の詳細をご確認ください。現在地はこのページ内でのみ使用し、保存・投稿しません。地図表示には外部の地図サービスを使用します。", lightAria:"ライトモードに切り替える", darkAria:"ダークモードに切り替える"
  },
  en: {
    homeAria:"Go to home", mainNavAria:"Main navigation", statsAria:"Site statistics", languageAria:"Select language", privacyLink:"Guide & privacy", exploreNav:"Explore locations", worksNav:"Browse anime", mapNav:"Map & nearby", submitNav:"Submit a location",
    searchPlaceholder:"Search by location or scene", countryLabel:"Country", prefectureLabel:"Prefecture / region", workLabel:"Anime title", visitLabel:"Visitor access", workPlaceholder:"Enter an anime title", filterSearch:"Search locations", reset:"Reset",
    heroHeading:"Anime memories,<br /><em>mapped to the real world.</em>", heroCopy:"A database connecting anime titles and scenes<br />with their real-world locations.", worksStat:"Titles", placesStat:"Locations", prefecturesStat:"Prefectures", scenesStat:"Scenes", footerText:"Prototype for data exploration",
    exploreHeading:"Explore locations", exploreDescription:"Combine keywords and filters to find locations you want to visit.", submissionHeading:"Share a location<br /><em>you know.</em>",
    submissionDescription:"Tell us about an unlisted location or a correction. A supporting official link or document helps us verify it.", submissionDisclaimer:"Submissions are stored for editorial review. Contact details are used only for verification and are never published.",
    allCountries:"All countries", selectCountry:"Select a country first", allPrefectures:"All prefectures / regions", regionUnavailable:"Regional data is not registered for this country", allVisits:"All", visitFree:"Open to visitors", visitConditional:"Conditional access", visitExterior:"Exterior only", results:n=>`Showing ${n} locations`, noResults:"No locations match these filters. Try another search.",
    openWorks:"Open title suggestions", closeWorks:"Close title suggestions", photoPending:"Photo coming soon", photoSearching:"Looking for a photo", photoAdd:"You can add a photo", photoAfterReview:"Added after verification", photoCredit:"Photo supplied with listing",
    work:"Anime title", episode:"Episode", category:"Category", coordinates:"Coordinates", visit:"Visitor access", address:"Address", scene:"Scene", visitConditions:"Access conditions", source:"Evidence", sourceLink:"View official source ↗", map:"View on Google Maps ↗", workData:w=>`View data for “${w}”`, checked:"Last reviewed: ", approvedCorrection:"Approved community correction", correctionSummary:"Submit a correction or photo",
    correctionLabels:["Request type","Correction or addition","Supporting URL","Photo (optional)","Contact (optional)"], submissionLabels:["Anime title","Location name","Prefecture","City / ward","Coordinates","Visitor access","Access conditions","Photo (optional)","Scene and notes","Supporting URL or document","Contact (optional)"], correctionOption:"Information correction", imageOption:"Add a photo", send:"Send submission",
    nearbyHeading:"Explore nearby", locate:"◎ Use my location", clearLocation:"Clear location", order:"Sort", defaultOrder:"Registration order", nearOrder:"Nearest first", mapResults:"Show results on map", mapNote:"Distances are straight-line distances to the registered location, not walking distances. Orange marks registered locations and blue marks verified viewpoints. Check each location for visitor conditions. Your location is used only on this page and is not saved or submitted. The map uses an external map service.", lightAria:"Switch to light mode", darkAria:"Switch to dark mode"
  }
};
Object.assign(translations.ja, {
  browseNoLogin:"作品・聖地・地図の閲覧はログイン不要です。スタンプ、訪問履歴、お気に入り、写真・聖地・撮影地点の投稿にはログインが必要です。",
  submissionDisclaimer:"投稿はメール確認済みアカウントが必要です。内容は運営の確認待ちとして保存され、個人情報は公開しません。",
  participate:"参加する", myPage:"マイページ", filterAria:"聖地を絞り込む", mapAria:"地図・近くの聖地", nearbyAria:"現在地から聖地を探す", photoGuidance:"JPEG・PNG・WebP、5MBまで。権利を持つ写真だけ送信してください。", scenePlaceholder:"何話のどの場面か、分かる範囲で教えてください。", contactPlaceholder:"確認が必要な場合だけ使用します", formSelect:"選択してください", close:"閉じる", sceneImage:"作品内の場面", officialMaterial:"公式掲載素材", verifiedViewpoint:"確認済みの撮影地点", followLocalGuidance:"現地の案内に従ってください。", coordinatesLabel:"座標：", evidenceLabel:"確認根拠：", viewEvidence:"根拠を確認する", visitViewpointFirst:"撮影地点の利用条件を確認してから訪問してください。", viewpointUnconfirmed:"撮影地点未確認。登録されている場所の位置です。", level:"聖地レベル", scoreUnit:"点", favoriteAdded:"☆ お気に入りに追加", favoriteDone:"★ お気に入り済み", stampDone:"✓ スタンプを獲得済み", checkStamp:"現在地でスタンプを確認", locationUsedOnce:"この操作の時だけ現在地を照合します。位置情報は保存しません。", recordVisit:"◎ 訪問を記録する", visited:"✓ 訪問を記録済み", joinGame:"ゲームに参加", findViewpoint:"撮影地点を探そう", browseNoLogin:"閲覧はログイン不要です。お気に入り、訪問スタンプ、ゲームへの参加だけアカウントを使います。", email:"メールアドレス", password:"パスワード", showPassword:"表示", hidePassword:"隠す", minPassword:"8文字以上", signIn:"ログイン", signUp:"新規登録", logout:"ログアウト", logoutFailed:"ログアウトできませんでした。もう一度お試しください。", loggedOut:"ログアウトしました。", favorites:"お気に入り", collectedStamps:"獲得スタンプ", favoritePlaces:"お気に入りした聖地", collectionNote:"写真・地図・聖地情報の閲覧は、ログアウト後もそのまま利用できます。", loginNeededFavorite:"お気に入りにはゲーム参加が必要です。", loginNeededStamp:"スタンプを獲得するにはゲーム参加が必要です。", registeredJoined:"登録して参加を開始しました。", loggedInMessage:"ログインしました。", accountExists:"アカウントを作成できませんでした。すでに登録済みの場合はログインしてください。", authFailed:"ログインできませんでした。メールアドレスとパスワードを確認してください。", checkEmail:"確認メールを送信しました。メール内のリンクを開いてからログインしてください。", correctionType:"申請内容", correctionDetails:"訂正・追加内容", correctionViewpointHint:"撮影地点の場合は、見える景色・安全な立ち位置・現地の注意を入力してください。", viewpointCoordinatesOptional:"撮影地点の座標（任意）", supportingUrl:"確認できるURL", officialOrMap:"公式サイトや地図など", uploadLimit:"JPEG・PNG・WebP、5MBまで", viewpointOption:"撮影地点の提案"
});
Object.assign(translations.en, {
  browseNoLogin:"Browsing anime locations and maps is open to everyone. A confirmed account is required for stamps, visit history, favorites, and photo or location submissions.",
  submissionDisclaimer:"Submissions require a confirmed account and are held for review. Personal information is never published.",
  participate:"Join", myPage:"My page", filterAria:"Filter locations", mapAria:"Map and nearby locations", nearbyAria:"Find nearby locations", mapNearbyNote:"Distances are straight-line distances to registered locations, not walking distances. Orange markers show registered places; blue markers show verified viewpoints. Check each location's access conditions before visiting. Your location is used only on this page and is not saved or submitted. Map tiles are provided by an external map service.",
  submitWork:"Anime title", submitSpot:"Location name", submitPrefecture:"Prefecture", submitCity:"City / ward", submitCoordinates:"Coordinates", submitVisit:"Visitor access", submitConditions:"Access conditions", submitPhoto:"Photo (optional)", submitScene:"Scene and notes", submitSource:"Supporting URL or document", submitContact:"Contact (optional)",
  placeholderWork:"e.g. anime title", placeholderSpot:"e.g. station or shrine", placeholderPrefecture:"e.g. Kanagawa", placeholderCity:"e.g. Kamakura", placeholderConditions:"e.g. View from outside during opening hours; give priority to facility users.", photoGuidance:"JPEG, PNG, or WebP, up to 5 MB. Submit only photos you have the right to share.", scenePlaceholder:"Describe the episode or scene, if known.", contactPlaceholder:"Used only if we need to verify details", formSelect:"Select an option", close:"Close", sceneImage:"Scene from the anime", officialMaterial:"Officially published material", verifiedViewpoint:"Verified viewpoint", followLocalGuidance:"Follow on-site guidance.", coordinatesLabel:"Coordinates: ", evidenceLabel:"Evidence: ", viewEvidence:"View evidence", locationCheck:"Location data review", registeredCoordinate:"Registered coordinates: ", verdict:"Review: ", filmingLocation:"Filming viewpoint: ", officialCheck:"Official confirmation: ", nextCheck:"Next step: ", filmingResearch:"Filming viewpoint research", priority:"Priority: ", researchEvidence:"View research source", visitViewpointFirst:"Check access conditions for the viewpoint before visiting.", viewpointUnconfirmed:"Viewpoint not verified. This is the registered location.", level:"Anime location level", scoreUnit:" pts", favoriteAdded:"☆ Add to favorites", favoriteDone:"★ Added to favorites", stampDone:"✓ Stamp collected", checkStamp:"Check in at your current location", locationUsedOnce:"Your location is checked only for this action and is not saved.", recordVisit:"◎ Mark as visited", visited:"✓ Visit recorded", reviewAfter:"This submission is pending review. Personal information will not be published.", sceneImageStatus:"Scene-image status", correctionType:"Request type", correctionDetails:"Correction or addition", correctionViewpointHint:"For a viewpoint, describe the visible scene, a safe place to stand, and any local restrictions.", viewpointCoordinatesOptional:"Viewpoint coordinates (optional)", supportingUrl:"Supporting URL", officialOrMap:"Official website or map", uploadLimit:"JPEG, PNG, or WebP, up to 5 MB", submitButton:"Send submission", cancel:"Cancel", editCorrection:"Submit a correction or photo", submitted:"Your submission has been sent for review.", photoPendingNote:"Photo coming soon", addAfterReview:"Added after verification",
  joinGame:"Join the game", findViewpoint:"Find the viewpoint", browseNoLogin:"Browsing does not require an account. An account is only needed for favorites, visit stamps, and game participation.", email:"Email address", password:"Password", showPassword:"Show", hidePassword:"Hide", minPassword:"At least 8 characters", signIn:"Log in", signUp:"Create account", loggedIn:"Logged in", logout:"Log out", logoutFailed:"Could not log out. Please try again.", loggedOut:"You have logged out.", favorites:"Favorites", collectedStamps:"Stamps collected", favoritePlaces:"Favorite locations", collectionNote:"You can keep browsing photos, maps, and location details after logging out.", loginNeededFavorite:"Join the game to save favorites.", loginNeededStamp:"Join the game to collect stamps.", registeredJoined:"Account created. You are now participating.", loggedInMessage:"You are logged in.", joinButton:"Join", accountExists:"An account may already exist. Try logging in.", authFailed:"Could not log in. Check your email and password.", checkEmail:"Check your email to confirm your account.", openDetail:"View location details", submissionSent:"Submission sent for review.", correctionOption:"Information correction", imageOption:"Add a photo", viewpointOption:"Suggest a viewpoint"
});
Object.assign(translations.ja, {
  challengeNav:"撮影地点を探す", challengeHeading:"撮影地点を探す", challengeIntro:"作品の場面と現地を見比べ、安全な場所から同じ景色を探すチャレンジです。チャレンジの閲覧はログイン不要です。", challengeStepOne:"場面とヒントを見る", challengeStepTwo:"安全な場所から景色を探す", challengeStepThree:"現地でスタンプを獲得", challengePrivacy:"スタンプ確認時のみ位置情報を使います。現在地は保存しません。無理な移動や立入禁止場所への立入りはせず、現地の案内に従ってください。", challengeLoading:"公開中のチャレンジを確認しています…", challengeUnavailable:"チャレンジを読み込めません。データベースの更新が必要です。", challengeEmpty:"現在公開中のチャレンジはありません。安全性を確認したものから公開します。", challengeOpen:"聖地の詳細を見る", challengeAccess:"訪問時の注意", challengeEvidence:"安全確認の根拠を見る", challengeStampCollected:"スタンプ獲得済み", challengeRequiresLogin:"スタンプへの参加にはログインが必要です。", visits:"訪問した場所", visitPlaces:"訪問履歴", loginNeededVisit:"訪問履歴を保存するにはログインが必要です。", loginNeededSubmit:"投稿するにはログインが必要です。", verifyEmailRequired:"参加するにはメールアドレスの確認が必要です。確認メールのリンクを開いてからお試しください。", challengeSafetyNote:"チェックイン地点の正確な座標は公開しません。GPSの判定には誤差があるため、範囲外と表示された場合は安全な場所で再試行してください。", stampSuccess:"スタンプを獲得しました。", stampAlready:"このチャレンジのスタンプは獲得済みです。", stampOutside:"スタンプ範囲外です。安全な場所から再度お試しください。", stampInaccurate:"現在地の精度が不足しています。屋外で少し待ってから再度お試しください。", stampUnavailable:"現在地を確認できませんでした。ブラウザーの位置情報設定をご確認ください。", stampNotReady:"この地点は現在スタンプ対象ではありません。", challengeTranslationMissing:"翻訳準備中", saveFailed:"保存できませんでした。時間をおいて再度お試しください。"
});
Object.assign(translations.en, {
  challengeNav:"Find a viewpoint", challengeHeading:"Find the filming viewpoint", challengeIntro:"Compare an anime scene with the real place and look for the same view from a safe public location. Browsing challenges does not require an account.", challengeStepOne:"Read the scene and clue", challengeStepTwo:"Look from a safe public place", challengeStepThree:"Collect a stamp on site", challengePrivacy:"Your location is used only when you check in and is not stored. Do not trespass or enter restricted areas. Follow local guidance.", challengeLoading:"Checking for published challenges…", challengeUnavailable:"Challenges could not be loaded. A database update is required.", challengeEmpty:"There are no published challenges yet. We will publish them after checking safety.", challengeOpen:"View location details", challengeAccess:"Visitor guidance", challengeEvidence:"View safety source", challengeStampCollected:"Stamp collected", challengeRequiresLogin:"Log in to take part and collect stamps.", visits:"Places visited", visitPlaces:"Visit history", loginNeededVisit:"Log in to save your visit history.", loginNeededSubmit:"Log in to submit information.", verifyEmailRequired:"Confirm your email address before participating. Open the confirmation link and try again.", challengeSafetyNote:"Exact check-in coordinates are never public. GPS can be imprecise; if you are outside the check-in area, retry from a safe place.", stampSuccess:"Stamp collected.", stampAlready:"You already collected this challenge stamp.", stampOutside:"You are outside the check-in area. Retry from a safe public place.", stampInaccurate:"Your location is not accurate enough. Wait outdoors and try again.", stampUnavailable:"We could not verify your location. Check your browser's location settings.", stampNotReady:"This location is not currently eligible for a stamp.", challengeTranslationMissing:"Translation pending", saveFailed:"Could not save. Please try again later."
});
translations.ja.challengeStepsAria = "チャレンジの進め方";
translations.en.challengeStepsAria = "How the challenge works";
Object.assign(translations.ja, {
  submissionHistoryHeading: "投稿履歴",
  submissionHistoryEmpty: "まだ投稿はありません。",
  submissionHistoryUnavailable: "投稿状況を読み込めませんでした。",
  submissionPending: "確認待ち",
  submissionApproved: "承認済み",
  submissionReturned: "差し戻し",
  submissionNewSpot: "新しい聖地",
  submissionCorrection: "情報訂正",
  submissionImage: "写真追加",
  submissionViewpoint: "撮影地点の提案"
});
Object.assign(translations.en, {
  submissionHistoryHeading: "My submissions",
  submissionHistoryEmpty: "You have not submitted anything yet.",
  submissionHistoryUnavailable: "Could not load submission status.",
  submissionPending: "Under review",
  submissionApproved: "Approved",
  submissionReturned: "Needs changes",
  submissionNewSpot: "New location",
  submissionCorrection: "Correction",
  submissionImage: "Photo addition",
  submissionViewpoint: "Viewpoint proposal"
});
translations.ja.openStreetView = "Google ストリートビューで見る";
translations.en.openStreetView = "Open Google Street View";
translations.ja.locationWithheld = "安全とプライバシー保護のため位置情報を非公開にしています";
translations.en.locationWithheld = "Location details are withheld for safety and privacy.";
let currentLanguage = localStorage.getItem("anime-seichi-language") === "en" ? "en" : "ja";
const t = (key, ...args) => typeof translations[currentLanguage][key] === "function" ? translations[currentLanguage][key](...args) : translations[currentLanguage][key];
let activePrefecture = "";
let activeCountry = "";
let activeWork = "";
let activeVisit = "";
let workSuggestionsExpanded = false;
const places = window.places;
const workInfo = window.workInfo || {};
const locale = window.animeSeichiI18n || {};
const displayWork = (name) => locale.work?.(name, currentLanguage) || name;
const displayPlace = (place) => locale.place?.(place, currentLanguage) || place.name;
const displayPrefecture = (name) => locale.prefecture?.(name, currentLanguage) || name;
const displayCity = (place) => locale.city?.(place, currentLanguage) || place.city;
const displayAddress = (place) => place.privacyProtected ? t("locationWithheld") : locale.address?.(place, currentLanguage) || place.address;
const displayScene = (place) => locale.scene?.(place, currentLanguage) || place.scene;
const displayEpisode = (place) => locale.episode?.(place, currentLanguage) || place.episode;
const displayConditions = (place) => locale.visitConditions?.(place, currentLanguage) || place.visitConditions;
const displayVisit = (name) => locale.visit?.(name, currentLanguage) || name;
const displayCategory = (name) => locale.category?.(name, currentLanguage) || name;
const displayInfoValue = (work, field, value) => locale.infoValue?.(work, field, value, currentLanguage) || value;
const displayInfoLabel = (field) => locale.infoLabel?.(field, currentLanguage) || field;
const displayCredit = (value) => locale.credit?.(value, currentLanguage) || value;
const photoObserver = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
  entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
    const card = entry.target;
    photoObserver.unobserve(card);
    const place = card._placeForPhoto;
    if (!place || !card.isConnected || placeCardImage(place)) return;
    window.placePhotoDiscovery?.find(place).then((photo) => {
      if (!photo || !card.isConnected) return;
      Object.assign(place, photo);
      const slot = card.querySelector(".place-card-photo");
      if (slot) slot.outerHTML = cardPhotoMarkup(place);
    });
  });
}, { rootMargin: "260px 0px" });
const supabaseClient = window.supabase.createClient(
  window.supabaseConfig.url,
  window.supabaseConfig.publishableKey
);
const participationDialog = document.querySelector("#participationDialog");
const participationContent = document.querySelector("#participationContent");
const participationButton = document.querySelector("#participationButton");
let gameUser = null;
let gameFavorites = new Set();
let gameStamps = new Set();
let gameVisits = new Set();
let gameManualVisits = new Set();
let gameCheckins = new Set();
let gameSubmissions = [];
let gameSubmissionsUnavailable = false;
let gameChallenges = new Map();
let gameChallengesUnavailable = false;
let activePlace = null;

function participationMarkup(message = "") {
  const en = currentLanguage === "en";
  if (gameUser) {
    const favoriteItems = [...gameFavorites].map((placeId) => places.find((place) => place.id === placeId)).filter(Boolean);
    const visitedItems = [...gameVisits].map((placeId) => places.find((place) => place.id === placeId)).filter(Boolean);
    const favoritesPanel = favoriteItems.length
      ? `<section class="collection-list"><h3>${t("favoritePlaces")}</h3><div>${favoriteItems.map((place) => `<button class="collection-place" type="button" data-profile-place="${escapeHtml(place.id)}"><span>${escapeHtml(displayPlace(place))}</span><small>${escapeHtml(displayPrefecture(place.prefecture))}・${escapeHtml(displayWork(place.work))}</small></button>`).join("")}</div></section>`
      : "";
    const visitsPanel = visitedItems.length
      ? `<section class="collection-list"><h3>${t("visitPlaces")}</h3><div>${visitedItems.map((place) => `<button class="collection-place" type="button" data-profile-place="${escapeHtml(place.id)}"><span>${escapeHtml(displayPlace(place))}</span><small>${escapeHtml(displayPrefecture(place.prefecture))}・${escapeHtml(displayWork(place.work))}${gameCheckins.has(place.id) ? ` · ${t("challengeStampCollected")}` : ""}</small></button>`).join("")}</div></section>`
      : "";
    const verificationNote = isVerifiedParticipant() ? "" : `<p class="form-status" role="status">${t("verifyEmailRequired")}</p>`;
    const submissionCategoryLabel = (category) => ({
      new_spot: t("submissionNewSpot"), correction: t("submissionCorrection"),
      image_addition: t("submissionImage"), viewpoint: t("submissionViewpoint")
    })[category] || t("submissionCorrection");
    const submissionStatusLabel = (status) => ({
      pending: t("submissionPending"), approved: t("submissionApproved"), returned: t("submissionReturned")
    })[status] || status;
    const submissionsPanel = !isVerifiedParticipant() ? "" : `<section class="collection-list submission-history"><h3>${t("submissionHistoryHeading")}</h3>${gameSubmissionsUnavailable
      ? `<p role="status">${t("submissionHistoryUnavailable")}</p>`
      : gameSubmissions.length
        ? `<div>${gameSubmissions.map((submission) => `<article class="submission-history-item"><span class="submission-history-status ${escapeHtml(submission.status)}">${escapeHtml(submissionStatusLabel(submission.status))}</span><strong>${escapeHtml(submissionCategoryLabel(submission.category))}</strong><span>${escapeHtml(submission.place_name || "")}</span><time datetime="${escapeHtml(submission.created_at)}">${new Date(submission.created_at).toLocaleDateString(en ? "en-US" : "ja-JP")}</time></article>`).join("")}</div>`
        : `<p>${t("submissionHistoryEmpty")}</p>`}</section>`;
    return `<p class="eyebrow">YOUR COLLECTION</p><h2>${en ? "Game profile" : "ゲームに参加中"}</h2>
      <p>${escapeHtml(gameUser.email || (en ? "Logged in" : "ログイン中"))}</p>
      ${verificationNote}
      <div class="collection-summary"><div><strong>${gameFavorites.size}</strong><span>${t("favorites")}</span></div><div><strong>${gameVisits.size}</strong><span>${t("visits")}</span></div><div><strong>${gameStamps.size}</strong><span>${t("collectedStamps")}</span></div></div>
      ${favoritesPanel}${visitsPanel}${submissionsPanel}
      <p class="participation-note">${t("collectionNote")}</p>
      <button class="secondary-button" id="signOutButton" type="button">${t("logout")}</button>${message ? `<p class="form-status">${escapeHtml(translateMessage(message))}</p>` : ""}`;
  }
  return `<p class="eyebrow">JOIN THE GAME</p><h2>${t("findViewpoint")}</h2>
    <p>${t("browseNoLogin")}</p>
    <form class="participation-form" id="participationForm">
      <label>${t("email")}<input name="email" type="email" autocomplete="email" required /></label>
      <label>${t("password")}<span class="password-input"><input name="password" type="password" autocomplete="current-password" minlength="8" required /><button id="passwordVisibilityButton" type="button" aria-label="${t("showPassword")}">${t("showPassword")}</button></span><small>${t("minPassword")}</small></label>
      <div class="participation-actions"><button class="submit-button" name="intent" value="signin" type="submit">${t("signIn")}</button><button class="secondary-button" name="intent" value="signup" type="submit">${t("signUp")}</button></div>
      <p class="form-status" id="participationStatus" aria-live="polite">${escapeHtml(translateMessage(message))}</p>
    </form>`;
}
function translateMessage(message) {
  if (currentLanguage !== "en") return message;
  const messages = {"ログアウトできませんでした。もう一度お試しください。":t("logoutFailed"),"ログアウトしました。":t("loggedOut"),"お気に入りにはゲーム参加が必要です。":t("loginNeededFavorite"),"スタンプを獲得するにはゲーム参加が必要です。":t("loginNeededStamp"),"登録して参加を開始しました。":t("registeredJoined"),"ログインしました。":t("loggedInMessage"),"アカウントを作成できませんでした。すでに登録済みの場合はログインしてください。":t("accountExists"),"ログインできませんでした。メールアドレスとパスワードを確認してください。":t("authFailed"),"確認メールを送信しました。メール内のリンクから登録を完了してください。":t("checkEmail"),"このアカウントはサイト利用者としてログインしています。":t("loggedInMessage")};
  return messages[message] || message;
}
function isVerifiedParticipant() {
  return Boolean(gameUser?.email_confirmed_at || gameUser?.confirmed_at);
}
function requireParticipation(messageKey) {
  if (!gameUser) {
    if (!participationDialog.open) participationDialog.showModal();
    renderParticipation(t(messageKey));
    return false;
  }
  if (!isVerifiedParticipant()) {
    if (!participationDialog.open) participationDialog.showModal();
    renderParticipation(t("verifyEmailRequired"));
    return false;
  }
  return true;
}
function renderParticipation(message = "") {
  participationContent.innerHTML = participationMarkup(message);
  const form = document.querySelector("#participationForm");
  if (form) form.addEventListener("submit", submitParticipation);
  document.querySelectorAll("[data-profile-place]").forEach((button) => button.addEventListener("click", () => {
    const place = places.find((item) => item.id === button.dataset.profilePlace);
    if (!place) return;
    participationDialog.close();
    showDetail(place);
  }));
  document.querySelector("#passwordVisibilityButton")?.addEventListener("click", (event) => {
    const input = document.querySelector("#participationForm input[name=password]");
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    event.currentTarget.textContent = showing ? t("showPassword") : t("hidePassword");
    event.currentTarget.setAttribute("aria-label", showing ? t("showPassword") : t("hidePassword"));
  });
  document.querySelector("#signOutButton")?.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) return renderParticipation("ログアウトできませんでした。もう一度お試しください。");
    gameUser = null; gameFavorites = new Set(); gameStamps = new Set(); gameVisits = new Set(); gameManualVisits = new Set(); gameCheckins = new Set();
    participationButton.textContent = t("participate");
    renderParticipation("ログアウトしました。");
    renderPlaces();
  });
}
async function loadGameData() {
  if (!gameUser) return;
  const [favorites, stamps, visits, submissions] = await Promise.all([
    supabaseClient.from("user_favorites").select("place_id"),
    supabaseClient.from("visit_stamps").select("place_id"),
    supabaseClient.from("user_visits").select("place_id, visit_type"),
    supabaseClient.rpc("get_my_submission_status")
  ]);
  gameFavorites = new Set((favorites.data || []).map((row) => row.place_id));
  gameStamps = new Set((stamps.data || []).map((row) => row.place_id));
  const visitRows = visits.data || [];
  gameVisits = new Set(visitRows.map((row) => row.place_id));
  gameManualVisits = new Set(visitRows.filter((row) => row.visit_type === "self_reported").map((row) => row.place_id));
  gameCheckins = new Set(visitRows.filter((row) => row.visit_type === "gps_checkin").map((row) => row.place_id));
  gameSubmissionsUnavailable = Boolean(submissions.error);
  gameSubmissions = submissions.data || [];
}
async function refreshGameSession() {
  const { data } = await supabaseClient.auth.getSession();
  gameUser = data.session?.user || null;
  if (gameUser) await loadGameData();
  else { gameFavorites = new Set(); gameStamps = new Set(); gameVisits = new Set(); gameManualVisits = new Set(); gameCheckins = new Set(); gameSubmissions = []; gameSubmissionsUnavailable = false; }
  participationButton.textContent = gameUser ? t("myPage") : t("participate");
}
async function submitParticipation(event) {
  event.preventDefault();
  const button = event.submitter;
  const data = new FormData(event.currentTarget);
  const email = String(data.get("email") || "").trim();
  const password = String(data.get("password") || "");
  const status = document.querySelector("#participationStatus");
  status.textContent = "確認しています…";
  const signedUp = button?.value === "signup";
  const result = signedUp
    ? await supabaseClient.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}${window.location.pathname}` }
      })
    : await supabaseClient.auth.signInWithPassword({ email, password });
  if (result.error) {
    status.textContent = result.error.message.includes("Invalid login") ? "メールアドレスまたはパスワードを確認してください。" : `手続きを完了できませんでした。${result.error.message}`;
    return;
  }
  if (signedUp && !result.data.session) {
    status.textContent = "確認メールを送信しました。メール内のリンクを開いてからログインしてください。";
    return;
  }
  await refreshGameSession();
  if (gameUser) await supabaseClient.from("user_profiles").upsert({ user_id: gameUser.id }, { onConflict: "user_id", ignoreDuplicates: true });
  renderParticipation(signedUp && !isVerifiedParticipant() ? t("verifyEmailRequired") : signedUp ? "登録して参加を開始しました。" : "ログインしました。");
  renderChallengeGrid();
  renderPlaces();
}
async function loadGameChallenges() {
  challengeListStatus.textContent = t("challengeLoading");
  const { data, error } = await supabaseClient.from("viewpoint_challenges").select("id, place_id, title, title_en, hint, hint_en, access_notes, access_notes_en, evidence_url").eq("status", "published");
  gameChallengesUnavailable = Boolean(error);
  gameChallenges = new Map((data || []).map((challenge) => [challenge.place_id, challenge]));
  renderChallengeGrid();
}
function renderChallengeGrid() {
  if (!challengeGrid) return;
  if (gameChallengesUnavailable) {
    challengeListStatus.textContent = t("challengeUnavailable");
    challengeGrid.innerHTML = "";
    return;
  }
  const challenges = [...gameChallenges.values()].map((challenge) => ({ challenge, place: places.find((place) => place.id === challenge.place_id) })).filter((item) => item.place);
  challengeListStatus.textContent = "";
  if (!challenges.length) {
    challengeGrid.innerHTML = `<p class="challenge-empty">${t("challengeEmpty")}</p>`;
    return;
  }
  challengeGrid.innerHTML = challenges.map(({ challenge, place }) => {
    const title = currentLanguage === "en" ? challenge.title_en : challenge.title;
    const hint = currentLanguage === "en" ? challenge.hint_en : challenge.hint;
    const access = currentLanguage === "en" ? challenge.access_notes_en : challenge.access_notes;
    const evidence = safeImageUrl(challenge.evidence_url);
    return `<article class="challenge-card"><p class="eyebrow">${escapeHtml(displayWork(place.work))}</p><h3>${escapeHtml(title || t("challengeTranslationMissing"))}</h3><p class="challenge-place-name">${escapeHtml(displayPlace(place))} · ${escapeHtml(displayPrefecture(place.prefecture))}</p><p>${escapeHtml(hint || t("challengeTranslationMissing"))}</p>${access ? `<p class="challenge-card-access"><strong>${t("challengeAccess")}</strong> ${escapeHtml(access)}</p>` : ""}${evidence ? `<p><a href="${escapeHtml(evidence)}" target="_blank" rel="noopener">${t("challengeEvidence")} ↗</a></p>` : ""}<button class="secondary-button" data-challenge-place="${escapeHtml(place.id)}" type="button">${t("challengeOpen")}</button></article>`;
  }).join("");
}
async function toggleFavorite(placeId) {
  if (!requireParticipation("loginNeededFavorite")) return;
  const exists = gameFavorites.has(placeId);
  const result = exists
    ? await supabaseClient.from("user_favorites").delete().eq("place_id", placeId)
    : await supabaseClient.from("user_favorites").insert({ user_id: gameUser.id, place_id: placeId });
  if (result.error) return alert(t("saveFailed"));
  exists ? gameFavorites.delete(placeId) : gameFavorites.add(placeId);
  showDetail(places.find((place) => place.id === placeId));
}
async function toggleVisit(placeId, button) {
  if (!requireParticipation("loginNeededVisit")) return;
  const isRecorded = gameManualVisits.has(placeId);
  button.disabled = true;
  const result = isRecorded
    ? await supabaseClient.from("user_visits").delete().eq("place_id", placeId).eq("visit_type", "self_reported")
    : await supabaseClient.from("user_visits").insert({ user_id: gameUser.id, place_id: placeId, visit_type: "self_reported" });
  button.disabled = false;
  if (result.error) return alert(t("saveFailed"));
  if (isRecorded) gameManualVisits.delete(placeId);
  else gameManualVisits.add(placeId);
  if (gameManualVisits.has(placeId) || gameCheckins.has(placeId)) gameVisits.add(placeId);
  else gameVisits.delete(placeId);
  if (activePlace) showDetail(activePlace);
  if (participationDialog.open) renderParticipation();
}
function currentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation || !window.isSecureContext) return reject(new Error("secure"));
    navigator.geolocation.getCurrentPosition((position) => {
      if (!Number.isFinite(position.coords.accuracy) || position.coords.accuracy > 100) return reject(new Error("accuracy"));
      resolve(position.coords);
    }, reject, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
  });
}
async function claimStamp(place) {
  if (!requireParticipation("loginNeededStamp")) return;
  const button = document.querySelector("#claimStampButton");
  const status = document.querySelector("#stampStatus");
  if (!button) return;
  button.disabled = true; button.textContent = currentLanguage === "en" ? "Checking location…" : "現在地を確認しています…";
  try {
    const position = await currentPosition();
    const { data, error } = await supabaseClient.rpc("award_visit_stamp", { requested_place_id: place.id, current_latitude: position.latitude, current_longitude: position.longitude, reported_accuracy_m: position.accuracy });
    if (error) throw error;
    const result = Array.isArray(data) ? data[0] : data;
    const rawMessage = String(result?.message || "");
    const message = result?.awarded ? t("stampSuccess") : rawMessage.includes("精度") ? t("stampInaccurate") : rawMessage.includes("メール確認") ? t("verifyEmailRequired") : rawMessage.includes("範囲") ? t("stampOutside") : rawMessage.includes("対象外") ? t("stampNotReady") : t("stampAlready");
    if (result?.awarded) {
      gameStamps.add(place.id);
      gameCheckins.add(place.id);
      gameVisits.add(place.id);
    }
    showDetail(place);
    document.querySelector("#stampStatus").textContent = message;
    if (participationDialog.open) renderParticipation();
  } catch (error) {
    button.disabled = false; button.textContent = t("checkStamp");
    if (status) status.textContent = error.message === "accuracy" ? t("stampInaccurate") : error.message?.includes("メール確認") ? t("verifyEmailRequired") : error.message === "secure" ? t("stampUnavailable") : error.code === 1 ? (currentLanguage === "en" ? "Location permission was denied. You can enable it in your browser settings." : "位置情報が許可されませんでした。ブラウザーの設定から許可できます。") : t("stampUnavailable");
  }
}
const safeImageUrl = (value = "") => {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; }
  catch { return ""; }
};
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

function replaceLeadingText(element, value) {
  const textNode = [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  if (textNode) textNode.textContent = value;
}

function applyLanguage(language, save = true) {
  currentLanguage = language === "en" ? "en" : "ja";
  document.documentElement.lang = currentLanguage;
  languageSelect.value = currentLanguage;
  if (save) localStorage.setItem("anime-seichi-language", currentLanguage);
  document.querySelectorAll("[data-i18n]").forEach((element) => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach((element) => { element.innerHTML = t(element.dataset.i18nHtml); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => { element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel)); });
  participationButton.textContent = gameUser ? t("myPage") : t("participate");
  document.querySelector(".header-search")?.setAttribute("aria-label", t("filterAria"));
  document.querySelector("#map")?.setAttribute("aria-label", t("mapAria"));
  document.querySelector("#nearby")?.setAttribute("aria-label", t("nearbyAria"));
  document.querySelector("#nearbyMap")?.setAttribute("aria-label", currentLanguage === "en" ? "Map of anime locations" : "聖地の地図");
  document.querySelector(".nearby-note")?.setAttribute("data-i18n-note", "1");
  const nearbyText = { "#nearby h3":"nearbyHeading", "#locateButton":"locate", "#clearLocation":"clearLocation", "#fitPlaces":"mapResults", ".nearby-toolbar label":"order", ".nearby-note":"mapNote" };
  Object.entries(nearbyText).forEach(([selector, key]) => { const element = document.querySelector(selector); if (element) { if (selector === ".nearby-toolbar label") { const select = element.querySelector("select"); element.firstChild.textContent = `${t(key)} `; if (select) { select.options[0].textContent = t("defaultOrder"); select.options[1].textContent = t("nearOrder"); } } else element.textContent = t(key); } });
  const submissionLabels = submissionForm.querySelectorAll("label");
  translations[currentLanguage].submissionLabels.forEach((label, index) => { if (submissionLabels[index]) replaceLeadingText(submissionLabels[index], label); });
  const submissionPlaceholders = ["placeholderWork", "placeholderSpot", "placeholderPrefecture", "placeholderCity", null, null, "placeholderConditions", null, "scenePlaceholder", null, "contactPlaceholder"];
  submissionLabels.forEach((label, index) => { const input = label.querySelector("input, textarea"); const key = submissionPlaceholders[index]; if (input && key && t(key)) input.placeholder = t(key); });
  const photoHelp = submissionLabels[7]?.querySelector("small"); if (photoHelp) photoHelp.textContent = currentLanguage === "en" ? t("photoGuidance") : "JPEG・PNG・WebP、5MBまで。権利を持つ写真だけ送信してください。";
  const visitOptions = visitStatus.options;
  visitOptions[0].textContent = currentLanguage === "en" ? "Select an option" : "選択してください";
  visitOptions[1].textContent = t("visitFree");
  visitOptions[2].textContent = t("visitConditional");
  visitOptions[3].textContent = t("visitExterior");
  submissionForm.querySelector(".submit-button").childNodes[0].textContent = `${t("send")} `;
  if (dialog.open && activePlace) showDetail(activePlace);
  if (participationDialog.open) renderParticipation();
  renderChallengeGrid();
  renderFilters();
  setWorkSuggestions(false);
  renderPlaces();
  setTheme(document.body.dataset.theme || "light");
  window.dispatchEvent(new CustomEvent("anime-language-change", { detail: { language: currentLanguage } }));
}

async function uploadSubmissionImage(file) {
  if (!file || !file.size) return "";
  if (!requireParticipation("loginNeededSubmit")) throw new Error(t("loginNeededSubmit"));
  if (!allowedImageTypes.includes(file.type)) throw new Error("写真はJPEG・PNG・WebPを選んでください。");
  if (file.size > 5 * 1024 * 1024) throw new Error("写真は5MB以下にしてください。");
  const extension = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${gameUser.id}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabaseClient.storage.from("submission-images").upload(path, file, { contentType: file.type, upsert: false });
  if (error) {
    const message = String(error.message || "").toLowerCase();
    if (message.includes("bucket") || message.includes("not found")) {
      throw new Error("写真保存の初期設定がまだ完了していません。Supabaseで画像・訂正申請用SQLを実行してください。");
    }
    if (message.includes("row-level") || message.includes("policy") || message.includes("unauthorized")) {
      throw new Error("写真を保存する権限が設定されていません。Supabaseの画像保存ポリシーを確認してください。");
    }
    if (message.includes("mime") || message.includes("type")) {
      throw new Error("この画像形式はアップロードできません。JPEG・PNG・WebPを選んでください。");
    }
    if (message.includes("size") || message.includes("large")) {
      throw new Error("画像サイズが大きすぎます。5MB以下の写真を選んでください。");
    }
    throw new Error(`写真をアップロードできませんでした。${error.message || "時間をおいて再度お試しください。"}`);
  }
  return path;
}

const unique = (key) => [...new Set(places.map((place) => place[key]))];
const prefectureOrder = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
  "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];
function orderedPrefectures() {
  return unique("prefecture").sort((a, b) => {
    const aIndex = prefectureOrder.findIndex((prefecture) => a.includes(prefecture));
    const bIndex = prefectureOrder.findIndex((prefecture) => b.includes(prefecture));
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });
}
function countryForPlace(place) {
  return prefectureOrder.some((prefecture) => String(place.prefecture).includes(prefecture)) ? "日本" : place.prefecture;
}
function availableCountries() {
  return [...new Set(places.map(countryForPlace))].sort((a, b) => {
    if (a === "日本") return -1;
    if (b === "日本") return 1;
    return a.localeCompare(b, "ja");
  });
}
function displayCountry(country) {
  if (currentLanguage !== "en") return country;
  return ({ "日本":"Japan", "イギリス":"United Kingdom", "イタリア":"Italy", "フランス":"France" })[country] || country;
}
function regionsForCountry(country) {
  if (country === "日本") return prefectures.filter((prefecture) => prefectureOrder.some((item) => prefecture.includes(item)));
  return [...new Set(places.filter((place) => countryForPlace(place) === country).map((place) => place.city).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "ja"));
}
let prefectures = orderedPrefectures();
let works = unique("work");
const requestedWork = new URLSearchParams(window.location.search).get("work");
const requestedPlace = new URLSearchParams(window.location.search).get("place");
const knownWorkOrSeries = (value) => (places || []).some((place) => place.work === value || place.series === value);
const resolveWorkInput = (value) => {
  const input = String(value || "").trim().toLocaleLowerCase("en");
  return works.find((work) => work.toLocaleLowerCase("en") === input || displayWork(work).toLocaleLowerCase("en") === input) || String(value || "").trim();
};
if (requestedWork && knownWorkOrSeries(requestedWork)) activeWork = requestedWork;

function matchesActiveWork(place) {
  if (!activeWork) return true;
  const names = [place.work, place.series].filter(Boolean);
  // 作品カードや候補から選んだタイトルは、別作品を混ぜない完全一致で絞る。
  if (knownWorkOrSeries(activeWork)) return names.includes(activeWork);
  // 手入力時だけ、候補を探しやすい部分一致を使う。
  const query = activeWork.toLocaleLowerCase("ja");
  return names.some((name) => `${name} ${displayWork(name)}`.toLocaleLowerCase("ja").includes(query));
}

function updateStats() {
  works = unique("work");
  prefectures = orderedPrefectures();
  document.querySelector("#workCount").textContent = works.length;
  document.querySelector("#placeCount").textContent = places.length;
  document.querySelector("#prefectureCount").textContent = prefectures.length;
  document.querySelector("#sceneCount").textContent = places.length;
}

function renderFilters() {
  const countries = availableCountries();
  countryFilter.innerHTML = `<option value="">${t("allCountries")}</option>${countries.map((country) => `<option value="${country}">${displayCountry(country)}</option>`).join("")}`;
  countryFilter.value = activeCountry;
  const regions = regionsForCountry(activeCountry);
  if (!activeCountry) {
    prefectureFilter.innerHTML = `<option value="">${t("selectCountry")}</option>`;
    prefectureFilter.disabled = true;
  } else if (!regions.length) {
    prefectureFilter.innerHTML = `<option value="">${t("regionUnavailable")}</option>`;
    prefectureFilter.disabled = true;
  } else {
    prefectureFilter.innerHTML = `<option value="">${t("allPrefectures")}</option>${regions.map((prefecture) => `<option value="${prefecture}">${activeCountry === "日本" ? displayPrefecture(prefecture) : prefecture}</option>`).join("")}`;
    prefectureFilter.disabled = false;
  }
  prefectureFilter.value = activePrefecture;
  workFilter.value = activeWork ? displayWork(activeWork) : "";
  visitFilter.options[0].textContent = t("allVisits");
  visitFilter.options[1].textContent = t("visitFree");
  visitFilter.options[2].textContent = t("visitConditional");
  visitFilter.options[3].textContent = t("visitExterior");
  visitFilter.value = activeVisit;
}

function renderWorkSuggestions() {
  const query = workFilter.value.trim().toLocaleLowerCase("ja");
  const matchedWorks = [...works]
    .sort((a, b) => a.localeCompare(b, "ja"))
    .filter((work) => `${work} ${displayWork(work)}`.toLocaleLowerCase("ja").includes(query));
  workSuggestions.innerHTML = "";
  if (!matchedWorks.length) {
    workSuggestions.hidden = true;
    workSuggestionsToggle.setAttribute("aria-expanded", "false");
    return;
  }
  matchedWorks.forEach((work) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = displayWork(work);
    button.addEventListener("mousedown", (event) => {
      event.preventDefault();
      activeWork = work;
      workFilter.value = work;
      setWorkSuggestions(false);
      workFilter.value = displayWork(work);
    });
    workSuggestions.append(button);
  });
  workSuggestions.hidden = !workSuggestionsExpanded;
  workSuggestionsToggle.setAttribute("aria-expanded", String(workSuggestionsExpanded));
}

function setWorkSuggestions(open) {
  workSuggestionsExpanded = open;
  workSuggestionsToggle.textContent = open ? "⌃" : "⌄";
  workSuggestionsToggle.setAttribute("aria-expanded", String(open));
  workSuggestionsToggle.setAttribute("aria-label", open ? t("closeWorks") : t("openWorks"));
  if (open) renderWorkSuggestions();
  else workSuggestions.hidden = true;
}

function placeCardImage(place) {
  return safeImageUrl(place.imageUrl);
}

function cardPhotoMarkup(place) {
  const imageUrl = placeCardImage(place);
  if (!imageUrl) return `<span class="place-card-photo place-card-photo-empty" aria-hidden="true"><span>PHOTO</span><small>${t("photoSearching")}</small></span>`;
  const creditText = place.photoCredit || "";
  const credit = creditText ? `<small class="place-card-photo-credit">${escapeHtml(displayCredit(creditText))}</small>` : "";
  return `<span class="place-card-photo"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(displayPlace(place))}" loading="lazy" />${credit}</span>`;
}

function renderPlaces() {
  const query = searchInput.value.trim().toLowerCase();
  let results = places.filter((place) => {
    const searchable = [place.name, displayPlace(place), place.prefecture, displayPrefecture(place.prefecture), place.city, displayCity(place), place.category, displayCategory(place.category), place.work, displayWork(place.work), place.scene, place.visit, displayVisit(place.visit)].join(" ").toLowerCase();
    const matchesRegion = !activePrefecture || (activeCountry === "日本" ? place.prefecture === activePrefecture : place.city === activePrefecture);
    return (!activeCountry || countryForPlace(place) === activeCountry)
      && matchesRegion
      && matchesActiveWork(place)
      && (!activeVisit || place.visit === activeVisit)
      && searchable.includes(query);
  });
  results = window.nearby.order(results);
  window.nearby.render(results, showDetail);
  grid.innerHTML = "";
  resultStatus.textContent = resultStatus.classList.contains("search-complete") ? `${t("results", results.length)} · ${currentLanguage === "en" ? "Search complete" : "検索が完了しました"}` : t("results", results.length);
  if (!results.length) {
    grid.innerHTML = `<p class="empty-state">${t("noResults")}</p>`;
    return;
  }
  results.forEach((place, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `place-card ${place.color}`;
    card.style.setProperty("--delay", `${index * 55}ms`);
    const location = displayAddress(place);
    card.innerHTML = `
      ${cardPhotoMarkup(place)}
      <span class="place-card-body">
        <strong>${escapeHtml(displayPlace(place))}</strong>
        <span class="card-location"><span aria-hidden="true">●</span>${escapeHtml(location)}</span>
        ${window.nearby.distanceMarkup(place)}
        <span class="card-scene">${escapeHtml(displayScene(place) || (currentLanguage === "en" ? "Scene information is being prepared." : "登場シーンの情報は準備中です"))}</span>
        <span class="card-work">${escapeHtml(displayWork(place.work))}</span>
      </span>`;
    card.addEventListener("error", (event) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement)) return;
      image.parentElement.outerHTML = `<span class="place-card-photo place-card-photo-empty" aria-hidden="true"><span>PHOTO</span><small>${t("photoAdd")}</small></span>`;
    }, true);
    card.addEventListener("click", () => showDetail(place));
    grid.append(card);
    if (!placeCardImage(place) && photoObserver) {
      card._placeForPhoto = place;
      photoObserver.observe(card);
    }
  });
}

function showDetail(place) {
  activePlace = place;
  const point = window.nearby.coordinates(place);
  const useExactMapPoint = !place.privacyProtected && place.coordinateAccuracy !== "approximate";
  const mapQuery = encodeURIComponent(useExactMapPoint && point ? point.join(",") : `${displayPlace(place)} ${displayAddress(place)}`);
  const workFields = Object.entries(workInfo[place.work] || {}).filter(([, value]) => value !== "");
  const workDetail = workFields.map(([label, value]) => `<div><dt>${escapeHtml(displayInfoLabel(label))}</dt><dd>${escapeHtml(displayInfoValue(place.work, label, value))}</dd></div>`).join("");
  const workInfoPanel = workFields.length ? `<details class="work-details"><summary>${t("workData", displayWork(place.work))}</summary><dl>${workDetail}</dl></details>` : "";
  let externalMapUrl = useExactMapPoint ? place.mapUrl || `https://www.google.com/maps/search/?api=1&query=${mapQuery}` : `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  if (currentLanguage === "en") { try { const url = new URL(externalMapUrl); url.searchParams.set("hl", "en"); externalMapUrl = url.href; } catch {} }
  const mapLink = place.privacyProtected ? "" : `<a class="map-link" href="${externalMapUrl}" target="_blank" rel="noopener">${t("map")}</a>`;
  const streetViewPoint = place.coordinateAccuracy === "approximate" ? null : point;
  const streetViewUrl = !place.privacyProtected && streetViewPoint ? window.streetView?.urlFor(streetViewPoint, currentLanguage) : "";
  const streetViewLink = streetViewUrl ? `<a class="map-link street-view-link" href="${streetViewUrl}" target="_blank" rel="noopener">${t("openStreetView")}</a>` : "";
  const imageUrl = placeCardImage(place);
  const sourceUrl = safeImageUrl(place.sourceUrl);
  const photoSourceUrl = safeImageUrl(place.photoSourceUrl);
  const imageCredit = displayCredit(place.photoCredit || t("photoCredit"));
  const imagePanel = imageUrl
    ? `<figure class="place-photo"><img src="${imageUrl}" alt="${escapeHtml(displayPlace(place))}" loading="lazy" /><figcaption>${photoSourceUrl ? `<a href="${photoSourceUrl}" target="_blank" rel="noreferrer">${escapeHtml(imageCredit)}</a>` : escapeHtml(imageCredit)}</figcaption></figure>`
    : `<div class="place-photo place-photo-empty" aria-label="${t("photoPending")}"><span>PHOTO</span><strong>${t("photoPending")}</strong><small>${t("photoAfterReview")}</small></div>`;
  const sceneImage = place.sceneImage;
  const sceneImageUrl = safeImageUrl(sceneImage?.imageUrl);
  const sceneImageSourceUrl = safeImageUrl(sceneImage?.sourceUrl);
  const sceneImagePanel = sceneImageUrl
    ? `<figure class="scene-image"><p>${t("sceneImage")}</p><img src="${sceneImageUrl}" alt="${escapeHtml(sceneImage.alt || `${displayWork(place.work)} ${t("sceneImage")}`)}" loading="lazy" /><figcaption>${sceneImageSourceUrl ? `<a href="${sceneImageSourceUrl}" target="_blank" rel="noreferrer">${escapeHtml(sceneImage.credit || t("officialMaterial"))}</a>` : escapeHtml(sceneImage.credit || t("officialMaterial"))}</figcaption></figure>`
    : "";
  const sceneImageResearch = place.sceneImageResearch;
  const sceneImageResearchPanel = sceneImageResearch && currentLanguage !== "en" ? `<div class="wide"><dt>作品内の場面画像</dt><dd><strong>${escapeHtml(sceneImageResearch.status)}</strong><br><small>${escapeHtml(sceneImageResearch.note)}</small></dd></div>` : "";
  const viewpoint = place.shootingViewpoint;
  const filmingResearch = place.filmingResearch;
  const displayViewpointField = (field, value) => locale.viewpointField?.(field, value, currentLanguage) || value;
  const viewpointPanel = viewpoint ? `<div class="wide shooting-viewpoint"><dt>${currentLanguage === "en" ? "Filming viewpoint" : "撮影地点"}</dt><dd><strong>${escapeHtml(viewpoint.label ? locale.viewpoint?.(viewpoint.label, currentLanguage) || viewpoint.label : t("verifiedViewpoint"))}</strong>${viewpoint.address && !place.privacyProtected ? `<br>${escapeHtml(displayViewpointField("address", viewpoint.address))}` : ""}<br>${escapeHtml(viewpoint.access ? displayViewpointField("access", viewpoint.access) : t("followLocalGuidance"))}${viewpoint.coordinates && !place.privacyProtected ? `<br><span>${t("coordinatesLabel")}${escapeHtml(viewpoint.coordinates)}</span>` : currentLanguage === "en" ? `<br><small>Exact viewpoint coordinates have not been verified.</small>` : `<br><small>撮影立ち位置の正確な座標は未確認です。</small>`}${viewpoint.mapUrl && !place.privacyProtected ? `<br><a href="${safeImageUrl(viewpoint.mapUrl)}" target="_blank" rel="noopener">${currentLanguage === "en" ? "Open viewpoint area in Google Maps" : "撮影場所の地図を開く"}</a>` : ""}${viewpoint.evidence ? `<br><small>${currentLanguage === "en" ? "Evidence: " : "確認根拠："}${escapeHtml(displayViewpointField("evidence", viewpoint.evidence))}</small>` : ""}${viewpoint.sourceUrl ? `<br><a href="${safeImageUrl(viewpoint.sourceUrl)}" target="_blank" rel="noopener">${t("viewEvidence")}</a>` : ""}</dd></div>` : "";
  const level = place.seichiLevel && window.animeSeichiResearchCriteria?.levels?.[place.seichiLevel];
  const levelLabels = {"S：目的地になる聖地":"S: Destination-worthy anime location", "A：訪問価値が高い聖地":"A: Highly rewarding location to visit", "B：作品ゆかりの聖地":"B: Anime-related location", "C：調査候補":"C: Research candidate"};
  const levelReason = currentLanguage !== "en" ? (place.seichiLevelReason || level?.description || "") : place.seichiLevelReason?.startsWith("暫定 ")
    ? `Provisional score: ${place.seichiScore}/100. Popularity and engagement data has not been collected, so it contributes 0 points. The score is based on evidence, on-site experience, visitability, and coordinate accuracy.`
    : "This location is rated using available evidence, on-site experience, visitor access, and coordinate accuracy.";
  const assessment = place.seichiAssessment;
  const photoAudit = place.photoAudit;
  const visited = gameVisits.has(place.id);
  const audit = place.locationAudit;
  const challenge = gameChallenges.get(place.id);
  const favoriteButton = `<button class="secondary-button favorite-button" id="favoriteButton" type="button">${gameFavorites.has(place.id) ? t("favoriteDone") : t("favoriteAdded")}</button>`;
  const challengeTitle = challenge && (currentLanguage === "en" ? challenge.title_en : challenge.title) || (challenge ? t("challengeTranslationMissing") : "");
  const challengeHint = challenge && (currentLanguage === "en" ? challenge.hint_en : challenge.hint) || (challenge ? t("challengeTranslationMissing") : "");
  const challengeAccess = challenge && (currentLanguage === "en" ? challenge.access_notes_en : challenge.access_notes) || (challenge ? t("challengeTranslationMissing") : "");
  const challengeEvidenceUrl = challenge ? safeImageUrl(challenge.evidence_url) : "";
  const gamePanel = challenge ? `<aside class="game-challenge"><p class="eyebrow">VIEWPOINT CHALLENGE</p><h3>${escapeHtml(challengeTitle)}</h3><p>${escapeHtml(challengeHint)}</p>${challengeAccess ? `<p><strong>${t("challengeAccess")}:</strong> ${escapeHtml(challengeAccess)}</p>` : ""}${challengeEvidenceUrl ? `<p><a href="${escapeHtml(challengeEvidenceUrl)}" target="_blank" rel="noopener">${t("challengeEvidence")} ↗</a></p>` : ""}${gameStamps.has(place.id) ? `<strong>${t("stampDone")}</strong>` : `<button class="secondary-button" id="claimStampButton" type="button">${t("checkStamp")}</button>`}<small>${t("locationUsedOnce")}</small><small>${t("challengeSafetyNote")}</small><p class="stamp-status" id="stampStatus" role="status" aria-live="polite"></p></aside>` : "";
  const auditPanel = audit && currentLanguage !== "en" ? `<div class="wide"><dt>位置情報の確認</dt><dd><strong>${escapeHtml(audit.batch)}</strong><br>現在の座標：${escapeHtml(audit.registeredCoordinate)}<br>判定：${escapeHtml(audit.reviewResult)}<br>撮影地点：${escapeHtml(viewpoint?.label || audit.filmingViewpoint)}${audit.officialCheck ? `<br><small>公式確認：${escapeHtml(audit.officialCheck)}</small>` : ""}<br><small>次の確認：${escapeHtml(audit.nextStep)}</small></dd></div>` : "";
  dialogContent.innerHTML = `
    <p class="eyebrow">LOCATION DETAIL / ${place.id.toUpperCase()}</p>
      <div class="dialog-title-row"><div><p class="dialog-place">${displayPrefecture(place.prefecture)}${currentLanguage === "en" ? ", " : "・"}${displayCity(place)}</p><h2>${displayPlace(place)}</h2></div></div>
    ${imagePanel}
    ${sceneImagePanel}
    <dl class="detail-grid">
      <div><dt>${t("work")}</dt><dd>${displayWork(place.work)}</dd></div>
      <div><dt>${t("episode")}</dt><dd>${escapeHtml(displayEpisode(place))}</dd></div>
      <div><dt>${t("category")}</dt><dd>${displayCategory(place.category)}</dd></div>
      <div><dt>${t("coordinates")}</dt><dd>${place.privacyProtected ? t("locationWithheld") : place.coordinateAccuracy === "approximate" ? (currentLanguage === "en" ? "Approximate area; not an exact viewpoint." : "概略地点です。撮影位置を示すものではありません。") : escapeHtml(place.coordinates || "—")}</dd></div>
      <div><dt>${t("visit")}</dt><dd>${displayVisit(place.visit)}</dd></div>
      <div><dt>${t("address")}</dt><dd>${displayAddress(place)}</dd></div>
      ${level ? `<div><dt>${t("level")}</dt><dd><strong>${escapeHtml(currentLanguage === "en" ? levelLabels[level.label] || "Anime location" : level.label)}${Number.isFinite(place.seichiScore) ? ` (${place.seichiScore}${t("scoreUnit")})` : ""}</strong><br><small>${escapeHtml(levelReason)}</small></dd></div>` : ""}
      ${assessment ? `<div><dt>${currentLanguage === "en" ? "Location rating" : "聖地レベル判定"}</dt><dd><strong>${escapeHtml(currentLanguage === "en" ? assessment.status === "判定済み" ? "Reviewed" : "Provisional rating" : assessment.status)}</strong><br><small>${escapeHtml(currentLanguage !== "en" ? assessment.summary : assessment.summary.includes("非公開") ? "Rated C because the location is private or requires special consideration." : `Current evidence gives it a ${place.seichiLevel} rating (${place.seichiScore} points). Reassess after checking public response and the filming viewpoint.`)}</small></dd></div>` : ""}
      ${photoAudit ? `<div><dt>${currentLanguage === "en" ? "Location photo" : "地点写真"}</dt><dd><strong>${escapeHtml(currentLanguage !== "en" ? photoAudit.status : photoAudit.status === "掲載可" ? "Cleared for listing" : "Under review")}</strong><br><small>${escapeHtml(currentLanguage !== "en" ? photoAudit.summary : photoAudit.status === "掲載可" ? "The listed photo has been checked for reuse conditions." : "Photo candidates are added only after checking copyright, location match, and photography rules.")}</small></dd></div>` : ""}
      <div class="wide"><dt>${t("scene")}</dt><dd>${escapeHtml(displayScene(place) || "—")}</dd></div>
    ${sceneImageResearchPanel}
      ${auditPanel}
      ${viewpointPanel}
      ${filmingResearch && currentLanguage !== "en" ? `<div class="wide"><dt>撮影地点の調査</dt><dd><strong>${escapeHtml(filmingResearch.status)}${filmingResearch.priority ? `（優先度：${escapeHtml(filmingResearch.priority)}）` : ""}</strong><br>${escapeHtml(filmingResearch.note)}${filmingResearch.sourceUrl ? `<br><a href="${safeImageUrl(filmingResearch.sourceUrl)}" target="_blank" rel="noopener">調査の根拠を見る</a>` : ""}</dd></div>` : ""}
      ${place.visitConditions ? `<div class="wide"><dt>${t("visitConditions")}</dt><dd>${escapeHtml(displayConditions(place))}</dd></div>` : ""}
      ${sourceUrl ? `<div class="wide"><dt>${t("source")}</dt><dd><a href="${sourceUrl}" target="_blank" rel="noopener">${t("sourceLink")}</a></dd></div>` : ""}
    </dl>
    ${window.nearby.distanceMarkup(place)}
    <p class="nearby-note">${viewpoint?.status === "verified" ? t("visitViewpointFirst") : t("viewpointUnconfirmed")}</p>
    <div class="detail-actions">${favoriteButton}<button class="secondary-button visit-log-button" id="visitLogButton" type="button">${visited ? t("visited") : t("recordVisit")}</button></div>
    ${gamePanel}
    ${mapLink}
    ${streetViewLink}
    ${workInfoPanel}
    ${place.communityUpdate ? `<aside class="community-update"><strong>${t("approvedCorrection")}</strong><p>${escapeHtml(place.communityUpdate)}</p></aside>` : ""}
    <p class="checked">${t("checked")}${place.checkedAt}</p>
    <details class="correction-panel">
      <summary>${t("correctionSummary")}</summary>
      <form class="correction-form" id="correctionForm">
        <label>${t("correctionType")}<select name="requestType" required><option value="correction">${t("correctionOption")}</option><option value="image_addition">${t("imageOption")}</option><option value="viewpoint">${t("viewpointOption")}</option></select></label>
        <label>${t("correctionDetails")}<textarea name="details" rows="4" required placeholder="${t("correctionViewpointHint")}"></textarea></label>
        <label>${t("viewpointCoordinatesOptional")}<input name="viewpointCoordinates" inputmode="decimal" placeholder="e.g. 35.30666, 139.50217" /></label>
        <label>${t("supportingUrl")}<input name="source" type="url" required placeholder="${t("officialOrMap")}" /></label>
        <label>${t("photoPending")}<input name="photoFile" type="file" accept="image/jpeg,image/png,image/webp" /><small>${t("uploadLimit")}</small></label>
        <label>${t("correctionLabels")[4]}<input name="contact" type="email" /></label>
        <button class="submit-button" type="submit">${t("send")} <span>→</span></button>
        <p class="form-status" aria-live="polite"></p>
      </form>
    </details>`;
  document.querySelector("#correctionForm").addEventListener("submit", (event) => submitCorrection(event, place));
  document.querySelector("#favoriteButton")?.addEventListener("click", () => toggleFavorite(place.id));
  document.querySelector("#claimStampButton")?.addEventListener("click", () => claimStamp(place));
  const correctionLabels = document.querySelectorAll("#correctionForm label");
  translations[currentLanguage].correctionLabels.forEach((label, index) => { if (correctionLabels[index]) replaceLeadingText(correctionLabels[index], label); });
  const requestTypeOptions = document.querySelector("#correctionForm select[name=requestType]").options;
  requestTypeOptions[0].textContent = t("correctionOption");
  requestTypeOptions[1].textContent = t("imageOption");
  document.querySelector("#correctionForm .submit-button").childNodes[0].textContent = `${t("send")} `;
  document.querySelector("#visitLogButton").addEventListener("click", (event) => toggleVisit(place.id, event.currentTarget));
  dialog.showModal();
}

async function submitCorrection(event, place) {
  event.preventDefault();
  if (!requireParticipation("loginNeededSubmit")) return;
  const form = event.currentTarget;
  const button = form.querySelector("button[type=submit]");
  const status = form.querySelector(".form-status");
  const values = Object.fromEntries(new FormData(form));
  const file = form.elements.photoFile.files[0];
  if (values.requestType === "image_addition" && !file) {
    status.textContent = "写真の追加を選んだ場合は、写真を選択してください。";
    return;
  }
  button.disabled = true;
  status.textContent = "申請を送信しています…";
  try {
    const imagePath = await uploadSubmissionImage(file);
    const isViewpointProposal = values.requestType === "viewpoint";
    const { error } = await supabaseClient.from("spot_submissions").insert({
      submitted_by: gameUser.id,
      submission_type: isViewpointProposal ? "correction" : values.requestType,
      target_place_id: place.id,
      target_place_name: place.name,
      work: place.work,
      spot: place.name,
      prefecture: place.prefecture,
      city: place.city || null,
      coordinates: place.coordinates || null,
      visit_status: ["自由訪問可能", "条件付き", "外観のみ"].includes(place.visit) ? place.visit : null,
      visit_conditions: place.visitConditions || null,
      image_path: imagePath || null,
      scene: isViewpointProposal ? `[撮影地点の提案] 座標：${values.viewpointCoordinates || "未入力"}\n${values.details}` : values.details,
      source_url: values.source,
      contact_email: values.contact || null
    });
    if (error) throw error;
    form.reset();
    status.textContent = "申請を受け付けました。管理者が確認します。";
    await loadGameData();
    if (participationDialog.open) renderParticipation();
  } catch (error) {
    status.textContent = error.message || "送信できませんでした。時間をおいてもう一度試してください。";
  } finally {
    button.disabled = false;
  }
}

searchInput.addEventListener("input", () => {});
searchInput.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); filterSearch.click(); } });
searchBox.addEventListener("click", () => searchInput.focus());
countryFilter.addEventListener("change", () => { activeCountry = countryFilter.value; activePrefecture = ""; renderFilters(); });
prefectureFilter.addEventListener("change", () => { activePrefecture = prefectureFilter.value; });
workFilter.addEventListener("input", () => {
  activeWork = workFilter.value.trim();
  workSuggestionsExpanded = true;
  renderWorkSuggestions();
});
workFilter.addEventListener("focus", () => setWorkSuggestions(true));
workFilter.addEventListener("keydown", (event) => { if (event.key === "Escape") setWorkSuggestions(false); });
workSuggestionsToggle.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  setWorkSuggestions(!workSuggestionsExpanded);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".work-filter")) setWorkSuggestions(false);
});
visitFilter.addEventListener("change", () => { activeVisit = visitFilter.value; });
filterSearch.addEventListener("click", () => {
  activeWork = resolveWorkInput(workFilter.value) || activeWork;
  activeVisit = visitFilter.value;
  activePrefecture = prefectureFilter.value;
  setWorkSuggestions(false);
  renderPlaces();
  resultStatus.classList.remove("search-complete");
  resultStatus.textContent = `${t("results", places.filter((place) => {
    const searchable = [place.name, displayPlace(place), place.prefecture, displayPrefecture(place.prefecture), place.city, displayCity(place), place.category, displayCategory(place.category), place.work, displayWork(place.work), place.scene, place.visit, displayVisit(place.visit)].join(" ").toLowerCase();
    const matchesRegion = !activePrefecture || (activeCountry === "日本" ? place.prefecture === activePrefecture : place.city === activePrefecture);
    return (!activeCountry || countryForPlace(place) === activeCountry) && matchesRegion && matchesActiveWork(place) && (!activeVisit || place.visit === activeVisit) && searchable.includes(searchInput.value.trim().toLowerCase());
  }).length)} · ${currentLanguage === "en" ? "Search complete" : "検索が完了しました"}`;
  requestAnimationFrame(() => resultStatus.classList.add("search-complete"));
  requestAnimationFrame(() => {
    if (siteHeader.classList.contains("is-open")) setMobileMenu(false);
    resultStatus.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
filterReset.addEventListener("click", () => {
  resultStatus.classList.remove("search-complete");
  activeCountry = "";
  activePrefecture = "";
  activeWork = "";
  activeVisit = "";
  searchInput.value = "";
  renderFilters();
  renderPlaces();
});
document.querySelector("#dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener("close", () => {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("place")) return;
  url.searchParams.delete("place");
  history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
});
participationButton.addEventListener("click", async () => { await refreshGameSession(); renderParticipation(); participationDialog.showModal(); });
challengeGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-challenge-place]");
  if (!button) return;
  const place = places.find((item) => item.id === button.dataset.challengePlace);
  if (place) showDetail(place);
});
document.querySelector("#participationClose").addEventListener("click", () => participationDialog.close());
participationDialog.addEventListener("click", (event) => { if (event.target === participationDialog) participationDialog.close(); });
supabaseClient.auth.onAuthStateChange(() => { setTimeout(() => refreshGameSession().then(() => { renderChallengeGrid(); renderPlaces(); if (participationDialog.open) renderParticipation(); }), 0); });

function syncVisitConditions() {
  const required = visitStatus.value === "条件付き";
  visitConditionsField.hidden = !required;
  visitConditions.required = required;
  if (!required) visitConditions.value = "";
}

visitStatus.addEventListener("change", syncVisitConditions);

submissionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireParticipation("loginNeededSubmit")) return;
  const button = submissionForm.querySelector("button[type=submit]");
  button.disabled = true;
  formStatus.textContent = "申請内容を送信しています…";
  const values = Object.fromEntries(new FormData(submissionForm));
  try {
    const imagePath = await uploadSubmissionImage(submissionForm.elements.photoFile.files[0]);
    const { error } = await supabaseClient.from("spot_submissions").insert({
      submitted_by: gameUser.id,
      submission_type: "new_spot",
      work: values.work,
      spot: values.spot,
      prefecture: values.prefecture,
      city: values.city || null,
      coordinates: values.coordinates,
      visit_status: values.visitStatus,
      visit_conditions: values.visitConditions || null,
      image_path: imagePath || null,
      scene: values.scene,
      source_url: values.source,
      contact_email: values.contact || null
    });
    if (error) throw error;
    submissionForm.reset();
    syncVisitConditions();
    formStatus.textContent = "申請を受け付けました。確認後、掲載可否を判断します。";
    await loadGameData();
    if (participationDialog.open) renderParticipation();
  } catch (error) {
    formStatus.textContent = error.message || "送信できませんでした。時間をおいてもう一度試してください。";
  } finally {
    button.disabled = false;
  }
});

async function loadApprovedSubmissions() {
  const { data, error } = await supabaseClient.rpc("get_approved_spots");
  if (error || !data?.length) return;
  data.forEach((item, index) => {
    if (places.some((place) => place.id === `submission-${item.id}` || (place.work === item.work && place.name === item.spot))) return;
    places.push({
      id: `submission-${item.id}`,
      name: item.spot,
      prefecture: item.prefecture,
      city: item.city || "",
      category: "ユーザー申請",
      work: item.work,
      scene: item.scene,
      episode: "承認済み申請",
      confidence: "B",
      checkedAt: new Date(item.created_at).toLocaleDateString("ja-JP"),
      coordinates: item.coordinates || "未登録",
      address: `${item.prefecture}${item.city || ""}`,
      nearestStation: "未登録",
      visit: item.visit_status || "未登録",
      visitConditions: item.visit_conditions || "",
      imageUrl: item.image_url || "",
      privacyProtected: false,
      mapUrl: "",
      color: ["green", "purple", "orange", "blue"][index % 4]
    });
  });
  updateStats();
  renderFilters();
  renderPlaces();
}

async function loadApprovedCorrections() {
  const { data, error } = await supabaseClient.rpc("get_approved_spot_updates");
  if (error || !data?.length) return;
  data.forEach((item) => {
    const place = places.find((candidate) => candidate.id === item.target_place_id);
    if (!place) return;
    if (item.correction_text) place.communityUpdate = item.correction_text;
    if (item.image_url) place.imageUrl = item.image_url;
  });
  renderPlaces();
}

updateStats();
renderFilters();
renderPlaces();
if (requestedPlace) {
  const place = places.find((candidate) => candidate.id === requestedPlace);
  if (place) {
    document.querySelector("#places")?.scrollIntoView({ block: "start" });
    showDetail(place);
  }
}
loadApprovedSubmissions().then(loadApprovedCorrections);

function setTheme(theme) {
  document.body.dataset.theme = theme;
  themeToggleText.textContent = theme === "dark" ? "DARK MODE" : "LIGHT MODE";
  themeToggle.firstElementChild.textContent = theme === "dark" ? "☾" : "☀";
  themeToggle.setAttribute("aria-label", theme === "dark" ? t("lightAria") : t("darkAria"));
  localStorage.setItem("anime-seichi-theme", theme);
}

setTheme(localStorage.getItem("anime-seichi-theme") || "light");
languageSelect.addEventListener("change", () => applyLanguage(languageSelect.value));
applyLanguage(currentLanguage, false);
themeToggle.addEventListener("click", () => setTheme(document.body.dataset.theme === "dark" ? "light" : "dark"));

function setMobileMenu(open) {
  siteHeader.classList.toggle("is-open", open);
  mobileMenuToggle.setAttribute("aria-expanded", String(open));
  mobileMenuText.textContent = open ? "CLOSE" : "MENU";
  mobileMenuToggle.lastElementChild.textContent = open ? "−" : "＋";
}

mobileMenuToggle.addEventListener("click", () => setMobileMenu(!siteHeader.classList.contains("is-open")));
setMobileMenu(false);
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    setMobileMenu(false);
    requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
  });
});

window.addEventListener("nearbychange", renderPlaces);

Promise.all([refreshGameSession(), loadGameChallenges()]).then(() => renderPlaces());
