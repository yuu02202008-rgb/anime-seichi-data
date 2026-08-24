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
let selectedStatus = "pending";

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
  adminStatus.textContent = `${data.length} 件の申請`;
  submissionList.innerHTML = data.length ? data.map((item) => `
    <article class="submission-item">
      <div class="submission-item-head"><span class="status-badge ${item.status}">${item.status}</span><span>${new Date(item.created_at).toLocaleString("ja-JP")}</span></div>
      <h2>${escapeHtml(item.spot)}</h2><p class="submission-work">${escapeHtml(item.work)} / ${escapeHtml(item.prefecture)} ${escapeHtml(item.city || "")}</p>
      <dl><div><dt>座標</dt><dd>${escapeHtml(item.coordinates || "未登録")}</dd></div><div><dt>訪問可否</dt><dd>${escapeHtml(item.visit_status || "未登録")}</dd></div>${item.visit_conditions ? `<div><dt>訪問条件</dt><dd>${escapeHtml(item.visit_conditions)}</dd></div>` : ""}<div><dt>シーン・補足</dt><dd>${escapeHtml(item.scene)}</dd></div><div><dt>根拠URL</dt><dd><a href="${safeUrl(item.source_url)}" target="_blank" rel="noopener">資料を開く ↗</a></dd></div>${item.contact_email ? `<div><dt>連絡先</dt><dd>${escapeHtml(item.contact_email)}</dd></div>` : ""}</dl>
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

async function showDashboard() {
  if (!(await isAdmin())) { authStatus.textContent = "このアカウントには管理者権限がありません。"; return; }
  loginPanel.hidden = true; dashboard.hidden = false; renderTabs(); refreshSubmissions();
}

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
  const { error } = await client.from("spot_submissions").update({ status: button.dataset.action, admin_note: adminNote, reviewed_at: new Date().toISOString() }).eq("id", id);
  if (error) { adminStatus.textContent = "更新できませんでした。"; return; } refreshSubmissions();
});

client.auth.getSession().then(({ data: { session } }) => { if (session) showDashboard(); });
