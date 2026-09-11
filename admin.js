const client = window.supabase.createClient(
  window.supabaseConfig.url,
  window.supabaseConfig.publishableKey
);
const loginPanel = document.querySelector("#loginPanel");
const dashboard = document.querySelector("#dashboard");
const authForm = document.querySelector("#authForm");
const authStatus = document.querySelector("#authStatus");
const submissionList = document.querySelector("#submissionList");
const statusTabs = document.querySelector("#statusTabs");
const adminStatus = document.querySelector("#adminStatus");
const reviewTabs = document.querySelector("#reviewTabs");
const spotReviewPanel = document.querySelector("#spotReviewPanel");
const animeReviewPanel = document.querySelector("#animeReviewPanel");
const animeCandidateList = document.querySelector("#animeCandidateList");
const animeCandidateStatus = document.querySelector("#animeCandidateStatus");
const animeQueueList = document.querySelector("#animeQueueList");
const animeQueueStatus = document.querySelector("#animeQueueStatus");
const animeCandidateYear = document.querySelector("#animeCandidateYear");
const animeCandidateSeason = document.querySelector("#animeCandidateSeason");
const loadAnimeCandidates = document.querySelector("#loadAnimeCandidates");
let selectedStatus = "pending";
let submissionById = new Map();
let queuedAnimeIds = new Set();
let activeReview = "spots";
let displayedCandidates = Array.isArray(window.animeCandidates) ? window.animeCandidates : [];

const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
const safeUrl = (value = "") => {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : "#"; }
  catch { return "#"; }
};

async function isAdmin() {
  const { data, error } = await client.rpc("is_admin");
  return !error && data === true;
}

async function refreshSubmissions() {
  adminStatus.textContent = "申請を読み込んでいます…";
  const { data, error } = await client.from("spot_submissions").select("*").eq("status", selectedStatus).order("created_at", { ascending: false });
  if (error) { adminStatus.textContent = "申請を読み込めませんでした。"; return; }
  const submissions = await Promise.all(data.map(async (item) => {
    if (!item.image_path) return item;
    const { data: signed } = await client.storage.from("submission-images").createSignedUrl(item.image_path, 900);
    return { ...item, signed_image_url: signed?.signedUrl || "" };
  }));
  submissionById = new Map(submissions.map((item) => [item.id, item]));
  adminStatus.textContent = `${submissions.length} 件の申請`;
  submissionList.innerHTML = submissions.length ? submissions.map((item) => `
    <article class="submission-item">
      <div class="submission-item-head"><span class="status-badge ${item.status}">${item.submission_type === "correction" ? "情報訂正" : item.submission_type === "image_addition" ? "写真追加" : "新規聖地"} / ${item.status}</span><span>${new Date(item.created_at).toLocaleString("ja-JP")}</span></div>
      <h2>${escapeHtml(item.spot)}</h2><p class="submission-work">${escapeHtml(item.work)} / ${escapeHtml(item.prefecture)} ${escapeHtml(item.city || "")}</p>
      ${item.target_place_name ? `<p class="submission-target">対象：${escapeHtml(item.target_place_name)}（${escapeHtml(item.target_place_id || "")}）</p>` : ""}
      ${item.signed_image_url ? `<img class="admin-submission-image" src="${safeUrl(item.signed_image_url)}" alt="申請された写真" />` : ""}
      <dl><div><dt>座標</dt><dd>${escapeHtml(item.coordinates || "未登録")}</dd></div><div><dt>訪問可否</dt><dd>${escapeHtml(item.visit_status || "未登録")}</dd></div>${item.visit_conditions ? `<div><dt>訪問条件</dt><dd>${escapeHtml(item.visit_conditions)}</dd></div>` : ""}<div><dt>写真</dt><dd>${item.image_path ? "画像ファイルあり" : item.image_url ? `<a href="${safeUrl(item.image_url)}" target="_blank" rel="noopener">写真を開く ↗</a>` : "未登録"}</dd></div><div><dt>申請内容・補足</dt><dd>${escapeHtml(item.scene)}</dd></div><div><dt>根拠URL</dt><dd><a href="${safeUrl(item.source_url)}" target="_blank" rel="noopener">資料を開く ↗</a></dd></div>${item.contact_email ? `<div><dt>連絡先</dt><dd>${escapeHtml(item.contact_email)}</dd></div>` : ""}</dl>
      <label>管理メモ<textarea data-note="${item.id}" rows="2" placeholder="確認内容や差し戻し理由を記録">${escapeHtml(item.admin_note || "")}</textarea></label>
      <div class="review-actions"><button data-action="approved" data-id="${item.id}" type="button">承認</button><button data-action="returned" data-id="${item.id}" type="button">差し戻し</button></div>
    </article>`).join("") : '<p class="empty-state">この状態の申請はありません。</p>';
}

function renderTabs() {
  statusTabs.innerHTML = "";
  [["pending", "確認待ち"], ["approved", "承認済み"], ["returned", "差し戻し"]].forEach(([status, label]) => {
    const button = document.createElement("button"); button.type = "button"; button.textContent = label; button.className = status === selectedStatus ? "filter active" : "filter";
    button.addEventListener("click", () => { selectedStatus = status; renderTabs(); refreshSubmissions(); }); statusTabs.append(button);
  });
}

function renderReviewTabs() {
  reviewTabs.innerHTML = "";
  [["spots", "聖地承認"], ["anime", "アニメ承認・調査"]].forEach(([id, label]) => {
    const button = document.createElement("button");
    button.type = "button"; button.textContent = label;
    button.className = id === activeReview ? "filter active" : "filter";
    button.addEventListener("click", () => {
      activeReview = id;
      spotReviewPanel.hidden = id !== "spots";
      animeReviewPanel.hidden = id !== "anime";
      renderReviewTabs();
    });
    reviewTabs.append(button);
  });
}

function setupCandidateControls() {
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 2000; year -= 1) {
    const option = document.createElement("option"); option.value = String(year); option.textContent = `${year}年`; animeCandidateYear.append(option);
  }
  const month = new Date().getMonth() + 1;
  animeCandidateSeason.value = month <= 3 ? "WINTER" : month <= 6 ? "SPRING" : month <= 9 ? "SUMMER" : "FALL";
}

async function loadSeasonCandidates() {
  const year = Number(animeCandidateYear.value);
  const season = animeCandidateSeason.value;
  loadAnimeCandidates.disabled = true;
  animeCandidateStatus.textContent = `${year}年${season}の候補を取得しています…`;
  const query = `query ($season: MediaSeason!, $seasonYear: Int!) { Page(page: 1, perPage: 24) { media(type: ANIME, format: TV, countryOfOrigin: JP, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC) { id title { native romaji english } startDate { year month day } season seasonYear genres siteUrl description(asHtml: false) coverImage { large color } } } }`;
  try {
    const response = await fetch("https://graphql.anilist.co", { method:"POST", headers:{ "content-type":"application/json", accept:"application/json" }, body:JSON.stringify({ query, variables:{ season, seasonYear:year } }) });
    const payload = await response.json();
    if (!response.ok || payload.errors?.length) throw new Error("AniList error");
    displayedCandidates = (payload.data?.Page?.media || []).map((media) => ({ anilistId:media.id, title:media.title.native || media.title.romaji || media.title.english, titleRomaji:media.title.romaji || "", titleEnglish:media.title.english || "", startDate:[media.startDate?.year, media.startDate?.month, media.startDate?.day].filter(Boolean).join("-") || "未定", season:[media.seasonYear, media.season].filter(Boolean).join(" "), genres:media.genres || [], sourceUrl:media.siteUrl || "", dataSource:"AniList", description:String(media.description || "").replace(/\s+/g," ").trim(), coverImage:media.coverImage?.large || "", color:media.coverImage?.color || "" }));
    animeCandidateStatus.textContent = `${year}年${season}の候補 ${displayedCandidates.length}件`;
    renderAnimeCandidates();
  } catch {
    animeCandidateStatus.textContent = "候補を取得できませんでした。少し時間を空けて再度お試しください。";
  } finally { loadAnimeCandidates.disabled = false; }
}

async function showDashboard() {
  if (!(await isAdmin())) { authStatus.textContent = "このアカウントには管理者権限がありません。"; return; }
  loginPanel.hidden = true; dashboard.hidden = false; renderReviewTabs(); renderTabs(); refreshSubmissions(); refreshAnimeQueue(); renderAnimeCandidates();
}

function candidateMarkup(candidate) {
  const queued = queuedAnimeIds.has(candidate.anilistId);
  const genres = (candidate.genres || []).slice(0, 3).join("・");
  return `<article class="anime-candidate-item"><div class="anime-candidate-art">${candidate.coverImage ? `<img src="${safeUrl(candidate.coverImage)}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : ""}</div><div><p class="eyebrow">${escapeHtml(candidate.season || "UPCOMING")} / ${escapeHtml(candidate.dataSource || "Anime data")}</p><h3>${escapeHtml(candidate.title)}</h3><p>${escapeHtml([candidate.startDate, genres].filter(Boolean).join(" / "))}</p><div class="review-actions">${candidate.sourceUrl ? `<a class="secondary-button" href="${safeUrl(candidate.sourceUrl)}" target="_blank" rel="noopener">作品データを見る ↗</a>` : ""}<button data-anime-action="queue" data-anime-id="${candidate.anilistId}" type="button" ${queued ? "disabled" : ""}>${queued ? "調査キュー追加済み" : "聖地調査キューに追加"}</button></div></div></article>`;
}

function renderAnimeCandidates() {
  const candidates = displayedCandidates;
  animeCandidateStatus.textContent = candidates.length ? `${candidates.length} 件の候補（週次更新）` : "候補データを準備中です。";
  animeCandidateList.innerHTML = candidates.length ? candidates.map(candidateMarkup).join("") : '<p class="empty-state">次回の候補取得を待っています。</p>';
}

async function refreshAnimeQueue() {
  animeQueueStatus.textContent = "聖地調査キューを読み込んでいます…";
  const { data, error } = await client.from("anime_research_queue").select("*").order("created_at", { ascending: false });
  if (error) { animeQueueStatus.textContent = "調査キューを使うには、専用の設定を一度だけ追加してください。"; animeQueueList.innerHTML = ""; return; }
  queuedAnimeIds = new Set(data.map((item) => item.anilist_id));
  animeQueueStatus.textContent = `${data.length} 件を調査中。自動調査の結果は「確認待ち」の下書きとして届きます。`;
  animeQueueList.innerHTML = data.length ? data.map((item) => {
    const researchStatus = item.research_status || "queued";
    const label = ({ queued:"自動調査待ち", processing:"自動調査中", drafted:`下書き ${item.drafted_spot_count || 0} 件作成`, no_match:"根拠を確認できず", failed:"再調査待ち" })[researchStatus] || researchStatus;
    return `<article class="anime-queue-item"><div>${item.cover_image ? `<img src="${safeUrl(item.cover_image)}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : ""}</div><div><span class="status-badge ${escapeHtml(item.status)}">${escapeHtml(item.status)}</span><span class="status-badge">${escapeHtml(label)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml([item.start_date, item.season, (item.genres || []).slice(0, 3).join("・")].filter(Boolean).join(" / "))}</p>${item.research_error ? `<p class="form-status">${escapeHtml(item.research_error)}</p>` : ""}<div class="review-actions queue-actions"><a class="secondary-button" href="https://www.google.com/search?q=${encodeURIComponent(`${item.title} アニメ 聖地`)}" target="_blank" rel="noopener">聖地候補を調べる ↗</a><button class="queue-delete-button" data-queue-action="delete" data-queue-id="${escapeHtml(item.id)}" data-queue-title="${escapeHtml(item.title)}" type="button">キューから削除</button></div></div></article>`;
  }).join("") : '<p class="empty-state">調査中の作品はありません。</p>';
  renderAnimeCandidates();
}

animeCandidateList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-anime-action=queue]"); if (!button) return;
  const candidate = displayedCandidates.find((item) => String(item.anilistId) === button.dataset.animeId); if (!candidate) return;
  button.disabled = true; button.textContent = "追加しています…";
  const { error } = await client.from("anime_research_queue").insert({ anilist_id:candidate.anilistId, title:candidate.title, title_romaji:candidate.titleRomaji, title_english:candidate.titleEnglish, start_date:candidate.startDate, season:candidate.season, genres:candidate.genres || [], cover_image:candidate.coverImage, official_url:candidate.sourceUrl, description:candidate.description });
  if (error) { animeCandidateStatus.textContent = "追加できませんでした。調査キュー用の設定を確認してください。"; button.disabled = false; button.textContent = "聖地調査キューに追加"; return; }
  await refreshAnimeQueue();
});

animeQueueList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-queue-action=delete]");
  if (!button) return;
  const title = button.dataset.queueTitle || "この作品";
  if (!window.confirm(`「${title}」を聖地調査キューから削除しますか？`)) return;
  button.disabled = true;
  button.textContent = "削除しています…";
  const { error } = await client.from("anime_research_queue").delete().eq("id", button.dataset.queueId);
  if (error) {
    animeQueueStatus.textContent = "削除できませんでした。管理者としてログインしているか確認してください。";
    button.disabled = false;
    button.textContent = "キューから削除";
    return;
  }
  await refreshAnimeQueue();
});

setupCandidateControls();
loadAnimeCandidates.addEventListener("click", loadSeasonCandidates);

authForm.addEventListener("submit", async (event) => {
  event.preventDefault(); authStatus.textContent = "ログインしています…";
  const { email, password } = Object.fromEntries(new FormData(authForm));
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) { authStatus.textContent = error.message; return; } showDashboard();
});

document.querySelector("#signUpButton").addEventListener("click", async () => {
  if (!authForm.reportValidity()) return;
  authStatus.textContent = "アカウントを登録しています…";
  const { email, password } = Object.fromEntries(new FormData(authForm));
  const { error } = await client.auth.signUp({ email, password });
  authStatus.textContent = error ? error.message : "登録確認メールを送信しました。メールを確認してからログインしてください。";
});

document.querySelector("#signOutButton").addEventListener("click", async () => { await client.auth.signOut(); dashboard.hidden = true; loginPanel.hidden = false; authForm.reset(); });
submissionList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]"); if (!button) return;
  const id = button.dataset.id; const adminNote = document.querySelector(`[data-note="${id}"]`).value;
  const item = submissionById.get(id);
  const update = { status: button.dataset.action, admin_note: adminNote, reviewed_at: new Date().toISOString() };
  button.disabled = true;
  if (button.dataset.action === "approved" && item?.image_path && !item.image_url) {
    const { data: file, error: downloadError } = await client.storage.from("submission-images").download(item.image_path);
    if (downloadError) { adminStatus.textContent = "画像を公開用に移せませんでした。"; button.disabled = false; return; }
    const extension = item.image_path.split(".").pop();
    const publicPath = `${item.submission_type || "new_spot"}/${id}.${extension}`;
    const { error: uploadError } = await client.storage.from("spot-images").upload(publicPath, file, { contentType: file.type, upsert: true });
    if (uploadError) { adminStatus.textContent = "画像を公開用に保存できませんでした。"; button.disabled = false; return; }
    update.image_url = client.storage.from("spot-images").getPublicUrl(publicPath).data.publicUrl;
  }
  const { error } = await client.from("spot_submissions").update(update).eq("id", id);
  if (error) { adminStatus.textContent = "更新できませんでした。"; return; } refreshSubmissions();
});

client.auth.getSession().then(({ data: { session } }) => { if (session) showDashboard(); });
