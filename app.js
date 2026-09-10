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
const resultStatus = document.querySelector("#resultStatus");
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
    homeAria:"ホームへ", mainNavAria:"メインナビゲーション", exploreNav:"聖地を探す", worksNav:"作品から探す", submitNav:"聖地申請",
    searchPlaceholder:"場所・シーンから検索", countryLabel:"国", prefectureLabel:"都道府県・地域", workLabel:"作品名", visitLabel:"訪問可否", workPlaceholder:"作品名を入力", reset:"リセット",
    heroHeading:"アニメの記憶を、<br /><em>地図の上へ。</em>", heroCopy:"提供データをもとに、作品・場面・実在の場所を記録する<br />聖地データベース。", worksStat:"作品", placesStat:"登録地点", prefecturesStat:"都道府県", scenesStat:"シーン", footerText:"データ探索プロトタイプ",
    exploreHeading:"聖地を探す", exploreDescription:"キーワードと条件を組み合わせて、行きたい聖地を探せます。", submissionHeading:"知っている聖地を<br /><em>申請する。</em>",
    submissionDescription:"未登録の場所や、より正確な情報があれば教えてください。根拠が分かるリンクや資料があると確認しやすくなります。", submissionDisclaimer:"申請内容は運営の確認待ちとして保存されます。個人情報は掲載せず、確認作業にのみ使用します。",
    allCountries:"すべての国", selectCountry:"先に国を選択", allPrefectures:"すべての都道府県・地域", regionUnavailable:"この国は地域情報が未登録です", allVisits:"すべて", visitFree:"自由訪問可能", visitConditional:"条件付き", visitExterior:"外観のみ", results:n=>`${n} 件の地点を表示中`, noResults:"条件に一致する地点がありません。別の言葉で検索してみてください。",
    openWorks:"作品候補を開く", closeWorks:"作品候補を閉じる", photoPending:"写真は準備中です", photoAfterReview:"確認後に追加されます", photoCredit:"写真提供：掲載情報",
    work:"登場作品", episode:"収録", category:"カテゴリ", coordinates:"座標", visit:"訪問可否", address:"住所", scene:"シーン", visitConditions:"訪問条件", source:"確認根拠", sourceLink:"公式情報を確認 ↗", map:"Google マップで確認 ↗", workData:w=>`「${w}」の作品データを表示`, checked:"最終確認日：", approvedCorrection:"承認済みの訂正情報", correctionSummary:"この情報の訂正・写真追加を申請する",
    correctionLabels:["申請内容","訂正・追加内容","確認できるURL","写真（任意）","連絡先（任意）"], submissionLabels:["作品名","聖地スポット名","都道府県","市区町村","座標","訪問可否","訪問条件","写真（任意）","登場シーン・補足","根拠となるURL・資料","連絡先（任意）"], correctionOption:"情報の訂正", imageOption:"写真の追加", send:"申請を送信する",
    lightAria:"ライトモードに切り替える", darkAria:"ダークモードに切り替える"
  },
  en: {
    homeAria:"Go to home", mainNavAria:"Main navigation", exploreNav:"Explore locations", worksNav:"Browse anime", submitNav:"Submit a location",
    searchPlaceholder:"Search by location or scene", countryLabel:"Country", prefectureLabel:"Prefecture / region", workLabel:"Anime title", visitLabel:"Visitor access", workPlaceholder:"Enter an anime title", reset:"Reset",
    heroHeading:"Anime memories,<br /><em>mapped to the real world.</em>", heroCopy:"A database connecting anime titles and scenes<br />with their real-world locations.", worksStat:"Titles", placesStat:"Locations", prefecturesStat:"Prefectures", scenesStat:"Scenes", footerText:"Prototype for data exploration",
    exploreHeading:"Explore locations", exploreDescription:"Combine keywords and filters to find locations you want to visit.", submissionHeading:"Share a location<br /><em>you know.</em>",
    submissionDescription:"Tell us about an unlisted location or a correction. A supporting official link or document helps us verify it.", submissionDisclaimer:"Submissions are stored for editorial review. Contact details are used only for verification and are never published.",
    allCountries:"All countries", selectCountry:"Select a country first", allPrefectures:"All prefectures / regions", regionUnavailable:"Regional data is not registered for this country", allVisits:"All", visitFree:"Open to visitors", visitConditional:"Conditional access", visitExterior:"Exterior only", results:n=>`Showing ${n} locations`, noResults:"No locations match these filters. Try another search.",
    openWorks:"Open title suggestions", closeWorks:"Close title suggestions", photoPending:"Photo coming soon", photoAfterReview:"Added after verification", photoCredit:"Photo supplied with listing",
    work:"Anime title", episode:"Episode", category:"Category", coordinates:"Coordinates", visit:"Visitor access", address:"Address", scene:"Scene", visitConditions:"Access conditions", source:"Evidence", sourceLink:"View official source ↗", map:"View on Google Maps ↗", workData:w=>`View data for “${w}”`, checked:"Last reviewed: ", approvedCorrection:"Approved community correction", correctionSummary:"Submit a correction or photo",
    correctionLabels:["Request type","Correction or addition","Supporting URL","Photo (optional)","Contact (optional)"], submissionLabels:["Anime title","Location name","Prefecture","City / ward","Coordinates","Visitor access","Access conditions","Photo (optional)","Scene and notes","Supporting URL or document","Contact (optional)"], correctionOption:"Information correction", imageOption:"Add a photo", send:"Send submission",
    lightAria:"Switch to light mode", darkAria:"Switch to dark mode"
  }
};
let currentLanguage = localStorage.getItem("anime-seichi-language") === "en" ? "en" : "ja";
const t = (key, ...args) => typeof translations[currentLanguage][key] === "function" ? translations[currentLanguage][key](...args) : translations[currentLanguage][key];
let activePrefecture = "";
let activeCountry = "";
let activeWork = "";
let activeVisit = "";
let workSuggestionsExpanded = false;
const places = window.places;
const workInfo = window.workInfo || {};
const supabaseClient = window.supabase.createClient(
  window.supabaseConfig.url,
  window.supabaseConfig.publishableKey
);
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
  const submissionLabels = submissionForm.querySelectorAll("label");
  translations[currentLanguage].submissionLabels.forEach((label, index) => { if (submissionLabels[index]) replaceLeadingText(submissionLabels[index], label); });
  const visitOptions = visitStatus.options;
  visitOptions[0].textContent = currentLanguage === "en" ? "Select an option" : "選択してください";
  visitOptions[1].textContent = t("visitFree");
  visitOptions[2].textContent = t("visitConditional");
  visitOptions[3].textContent = t("visitExterior");
  submissionForm.querySelector(".submit-button").childNodes[0].textContent = `${t("send")} `;
  renderFilters();
  setWorkSuggestions(false);
  renderPlaces();
  setTheme(document.body.dataset.theme || "light");
}

async function uploadSubmissionImage(file) {
  if (!file || !file.size) return "";
  if (!allowedImageTypes.includes(file.type)) throw new Error("写真はJPEG・PNG・WebPを選んでください。");
  if (file.size > 5 * 1024 * 1024) throw new Error("写真は5MB以下にしてください。");
  const extension = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
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
function regionsForCountry(country) {
  if (country === "日本") return prefectures.filter((prefecture) => prefectureOrder.some((item) => prefecture.includes(item)));
  return [...new Set(places.filter((place) => countryForPlace(place) === country).map((place) => place.city).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "ja"));
}
let prefectures = orderedPrefectures();
let works = unique("work");
const requestedWork = new URLSearchParams(window.location.search).get("work");
if (requestedWork && works.includes(requestedWork)) activeWork = requestedWork;

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
  countryFilter.innerHTML = `<option value="">${t("allCountries")}</option>${countries.map((country) => `<option value="${country}">${country}</option>`).join("")}`;
  countryFilter.value = activeCountry;
  const regions = regionsForCountry(activeCountry);
  if (!activeCountry) {
    prefectureFilter.innerHTML = `<option value="">${t("selectCountry")}</option>`;
    prefectureFilter.disabled = true;
  } else if (!regions.length) {
    prefectureFilter.innerHTML = `<option value="">${t("regionUnavailable")}</option>`;
    prefectureFilter.disabled = true;
  } else {
    prefectureFilter.innerHTML = `<option value="">${t("allPrefectures")}</option>${regions.map((prefecture) => `<option value="${prefecture}">${prefecture}</option>`).join("")}`;
    prefectureFilter.disabled = false;
  }
  prefectureFilter.value = activePrefecture;
  workFilter.value = activeWork;
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
    .filter((work) => work.toLocaleLowerCase("ja").includes(query));
  workSuggestions.innerHTML = "";
  if (!matchedWorks.length) {
    workSuggestions.hidden = true;
    workSuggestionsToggle.setAttribute("aria-expanded", "false");
    return;
  }
  matchedWorks.forEach((work) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = work;
    button.addEventListener("mousedown", (event) => {
      event.preventDefault();
      activeWork = work;
      workFilter.value = work;
      setWorkSuggestions(false);
      renderPlaces();
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

function renderPlaces() {
  const query = searchInput.value.trim().toLowerCase();
  const results = places.filter((place) => {
    const searchable = [place.name, place.prefecture, place.city, place.category, place.work, place.scene, place.visit].join(" ").toLowerCase();
    const matchesRegion = !activePrefecture || (activeCountry === "日本" ? place.prefecture === activePrefecture : place.city === activePrefecture);
    return (!activeCountry || countryForPlace(place) === activeCountry)
      && matchesRegion
      && (!activeWork || place.work.toLocaleLowerCase("ja").includes(activeWork.toLocaleLowerCase("ja")))
      && (!activeVisit || place.visit === activeVisit)
      && searchable.includes(query);
  });
  grid.innerHTML = "";
  resultStatus.textContent = t("results", results.length);
  if (!results.length) {
    grid.innerHTML = `<p class="empty-state">${t("noResults")}</p>`;
    return;
  }
  results.forEach((place, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `place-card ${place.color}`;
    card.style.setProperty("--delay", `${index * 55}ms`);
    card.innerHTML = `
      <span class="card-number">${String(index + 1).padStart(2, "0")}</span>
      <span class="card-location">${place.prefecture}・${place.city}</span>
      <strong>${place.name}</strong>
      <span class="card-work">${place.work}</span>
      <span class="card-arrow">↗</span>`;
    card.addEventListener("click", () => showDetail(place));
    grid.append(card);
  });
}

function showDetail(place) {
  const mapQuery = encodeURIComponent(`${place.name} ${place.address}`);
  const workFields = Object.entries(workInfo[place.work] || {}).filter(([, value]) => value !== "");
  const workDetail = workFields.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
  const workInfoPanel = workFields.length ? `<details class="work-details"><summary>${t("workData", place.work)}</summary><dl>${workDetail}</dl></details>` : "";
  const mapLink = place.privacyProtected ? "" : `<a class="map-link" href="${place.mapUrl || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`}" target="_blank" rel="noopener">${t("map")}</a>`;
  const imageUrl = safeImageUrl(place.imageUrl);
  const sourceUrl = safeImageUrl(place.sourceUrl);
  const imagePanel = imageUrl
    ? `<figure class="place-photo"><img src="${imageUrl}" alt="${place.name}" loading="lazy" /><figcaption>${t("photoCredit")}</figcaption></figure>`
    : `<div class="place-photo place-photo-empty" aria-label="${t("photoPending")}"><span>PHOTO</span><strong>${t("photoPending")}</strong><small>${t("photoAfterReview")}</small></div>`;
  dialogContent.innerHTML = `
    <p class="eyebrow">LOCATION DETAIL / ${place.id.toUpperCase()}</p>
    <div class="dialog-title-row"><div><p class="dialog-place">${place.prefecture}・${place.city}</p><h2>${place.name}</h2></div></div>
    ${imagePanel}
    <dl class="detail-grid">
      <div><dt>${t("work")}</dt><dd>${place.work}</dd></div>
      <div><dt>${t("episode")}</dt><dd>${place.episode}</dd></div>
      <div><dt>${t("category")}</dt><dd>${place.category}</dd></div>
      <div><dt>${t("coordinates")}</dt><dd>${place.coordinates}</dd></div>
      <div><dt>${t("visit")}</dt><dd>${place.visit}</dd></div>
      <div><dt>${t("address")}</dt><dd>${place.address}</dd></div>
      <div class="wide"><dt>${t("scene")}</dt><dd>${place.scene}</dd></div>
      ${place.visitConditions ? `<div class="wide"><dt>${t("visitConditions")}</dt><dd>${place.visitConditions}</dd></div>` : ""}
      ${sourceUrl ? `<div class="wide"><dt>${t("source")}</dt><dd><a href="${sourceUrl}" target="_blank" rel="noopener">${t("sourceLink")}</a></dd></div>` : ""}
    </dl>
    ${mapLink}
    ${workInfoPanel}
    ${place.communityUpdate ? `<aside class="community-update"><strong>${t("approvedCorrection")}</strong><p>${escapeHtml(place.communityUpdate)}</p></aside>` : ""}
    <p class="checked">${t("checked")}${place.checkedAt}</p>
    <details class="correction-panel">
      <summary>${t("correctionSummary")}</summary>
      <form class="correction-form" id="correctionForm">
        <label>申請内容<select name="requestType" required><option value="correction">情報の訂正</option><option value="image_addition">写真の追加</option></select></label>
        <label>訂正・追加内容<textarea name="details" rows="4" required placeholder="どの情報を、どのように直すべきか入力してください"></textarea></label>
        <label>確認できるURL<input name="source" type="url" required placeholder="公式サイトや地図など" /></label>
        <label>写真（任意）<input name="photoFile" type="file" accept="image/jpeg,image/png,image/webp" /><small>JPEG・PNG・WebP、5MBまで</small></label>
        <label>連絡先（任意）<input name="contact" type="email" /></label>
        <button class="submit-button" type="submit">申請を送信する <span>→</span></button>
        <p class="form-status" aria-live="polite"></p>
      </form>
    </details>`;
  document.querySelector("#correctionForm").addEventListener("submit", (event) => submitCorrection(event, place));
  const correctionLabels = document.querySelectorAll("#correctionForm label");
  translations[currentLanguage].correctionLabels.forEach((label, index) => { if (correctionLabels[index]) replaceLeadingText(correctionLabels[index], label); });
  const requestTypeOptions = document.querySelector("#correctionForm select[name=requestType]").options;
  requestTypeOptions[0].textContent = t("correctionOption");
  requestTypeOptions[1].textContent = t("imageOption");
  document.querySelector("#correctionForm .submit-button").childNodes[0].textContent = `${t("send")} `;
  dialog.showModal();
}

async function submitCorrection(event, place) {
  event.preventDefault();
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
    const { error } = await supabaseClient.from("spot_submissions").insert({
      submission_type: values.requestType,
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
      scene: values.details,
      source_url: values.source,
      contact_email: values.contact || null
    });
    if (error) throw error;
    form.reset();
    status.textContent = "申請を受け付けました。管理者が確認します。";
  } catch (error) {
    status.textContent = error.message || "送信できませんでした。時間をおいてもう一度試してください。";
  } finally {
    button.disabled = false;
  }
}

searchInput.addEventListener("input", renderPlaces);
searchBox.addEventListener("click", () => searchInput.focus());
countryFilter.addEventListener("change", () => { activeCountry = countryFilter.value; activePrefecture = ""; renderFilters(); renderPlaces(); });
prefectureFilter.addEventListener("change", () => { activePrefecture = prefectureFilter.value; renderPlaces(); });
workFilter.addEventListener("input", () => {
  activeWork = workFilter.value.trim();
  workSuggestionsExpanded = true;
  renderWorkSuggestions();
  renderPlaces();
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
visitFilter.addEventListener("change", () => { activeVisit = visitFilter.value; renderPlaces(); });
filterReset.addEventListener("click", () => {
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

function syncVisitConditions() {
  const required = visitStatus.value === "条件付き";
  visitConditionsField.hidden = !required;
  visitConditions.required = required;
  if (!required) visitConditions.value = "";
}

visitStatus.addEventListener("change", syncVisitConditions);

submissionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = submissionForm.querySelector("button[type=submit]");
  button.disabled = true;
  formStatus.textContent = "申請内容を送信しています…";
  const values = Object.fromEntries(new FormData(submissionForm));
  try {
    const imagePath = await uploadSubmissionImage(submissionForm.elements.photoFile.files[0]);
    const { error } = await supabaseClient.from("spot_submissions").insert({
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
