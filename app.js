const grid = document.querySelector("#placeGrid");
const searchInput = document.querySelector("#searchInput");
const searchBox = document.querySelector("#searchBox");
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
let activePrefecture = "";
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
let prefectures = orderedPrefectures();
let works = unique("work");

function updateStats() {
  works = unique("work");
  prefectures = orderedPrefectures();
  document.querySelector("#workCount").textContent = works.length;
  document.querySelector("#placeCount").textContent = places.length;
  document.querySelector("#prefectureCount").textContent = prefectures.length;
  document.querySelector("#sceneCount").textContent = places.length;
}

function renderFilters() {
  prefectureFilter.innerHTML = `<option value="">すべての都道府県</option>${prefectures.map((prefecture) => `<option value="${prefecture}">${prefecture}</option>`).join("")}`;
  prefectureFilter.value = activePrefecture;
  workFilter.value = activeWork;
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
  workSuggestionsToggle.setAttribute("aria-label", open ? "作品候補を閉じる" : "作品候補を開く");
  if (open) renderWorkSuggestions();
  else workSuggestions.hidden = true;
}

function renderPlaces() {
  const query = searchInput.value.trim().toLowerCase();
  const results = places.filter((place) => {
    const searchable = [place.name, place.prefecture, place.city, place.category, place.work, place.scene, place.visit].join(" ").toLowerCase();
    return (!activePrefecture || place.prefecture === activePrefecture)
      && (!activeWork || place.work.toLocaleLowerCase("ja").includes(activeWork.toLocaleLowerCase("ja")))
      && (!activeVisit || place.visit === activeVisit)
      && searchable.includes(query);
  });
  grid.innerHTML = "";
  resultStatus.textContent = `${results.length} 件の地点を表示中`;
  if (!results.length) {
    grid.innerHTML = '<p class="empty-state">条件に一致する地点がありません。別の言葉で検索してみてください。</p>';
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
  const workInfoPanel = workFields.length ? `<details class="work-details"><summary>「${place.work}」の作品データを表示</summary><dl>${workDetail}</dl></details>` : "";
  const mapLink = place.privacyProtected ? "" : `<a class="map-link" href="${place.mapUrl || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`}" target="_blank" rel="noopener">Google マップで確認 ↗</a>`;
  const imageUrl = safeImageUrl(place.imageUrl);
  const imagePanel = imageUrl
    ? `<figure class="place-photo"><img src="${imageUrl}" alt="${place.name}の写真" loading="lazy" /><figcaption>写真提供：掲載情報</figcaption></figure>`
    : `<div class="place-photo place-photo-empty" aria-label="写真は準備中です"><span>PHOTO</span><strong>写真は準備中です</strong><small>確認後に追加されます</small></div>`;
  dialogContent.innerHTML = `
    <p class="eyebrow">LOCATION DETAIL / ${place.id.toUpperCase()}</p>
    <div class="dialog-title-row"><div><p class="dialog-place">${place.prefecture}・${place.city}</p><h2>${place.name}</h2></div></div>
    ${imagePanel}
    <dl class="detail-grid">
      <div><dt>登場作品</dt><dd>${place.work}</dd></div>
      <div><dt>収録</dt><dd>${place.episode}</dd></div>
      <div><dt>カテゴリ</dt><dd>${place.category}</dd></div>
      <div><dt>座標</dt><dd>${place.coordinates}</dd></div>
      <div><dt>訪問可否</dt><dd>${place.visit}</dd></div>
      <div><dt>住所</dt><dd>${place.address}</dd></div>
      <div class="wide"><dt>シーン</dt><dd>${place.scene}</dd></div>
      ${place.visitConditions ? `<div class="wide"><dt>訪問条件</dt><dd>${place.visitConditions}</dd></div>` : ""}
    </dl>
    ${mapLink}
    ${workInfoPanel}
    ${place.communityUpdate ? `<aside class="community-update"><strong>承認済みの訂正情報</strong><p>${escapeHtml(place.communityUpdate)}</p></aside>` : ""}
    <p class="checked">最終確認日：${place.checkedAt}</p>
    <details class="correction-panel">
      <summary>この情報の訂正・写真追加を申請する</summary>
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
  themeToggle.setAttribute("aria-label", theme === "dark" ? "ライトモードに切り替える" : "ダークモードに切り替える");
  localStorage.setItem("anime-seichi-theme", theme);
}

setTheme(localStorage.getItem("anime-seichi-theme") || "light");
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
