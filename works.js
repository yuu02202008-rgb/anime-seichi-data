const places = window.places || [];
const workInfo = window.workInfo || {};
const officialSources = window.officialSources || {};
const animeArtwork = window.animeArtwork || {};
const grid = document.querySelector("#worksGrid");
const search = document.querySelector("#worksSearch");
const result = document.querySelector("#worksResult");
const dialog = document.querySelector("#workDialog");
const dialogContent = document.querySelector("#workDialogContent");
const languageSelect = document.querySelector("#worksLanguageSelect");
const themeToggle = document.querySelector("#worksThemeToggle");
const themeText = document.querySelector("#worksThemeText");
const menuToggle = document.querySelector("#worksMenuToggle");
const mobileMenu = document.querySelector("#worksMobileMenu");

const copy = {
  ja: { places:"聖地を探す", works:"作品から探す", submit:"聖地申請", heading:"作品から探す", description:"作品を選ぶと、その作品に登録されている聖地をまとめて確認できます。", placeholder:"作品名を検索", footer:"作品別データ一覧", titles:n=>`${n} 作品を表示中`, spots:n=>`${n} 地点`, prefs:n=>`${n} 都道府県`, details:"聖地を見る", story:"作品紹介", studio:"アニメーション制作", author:"作者", access:"訪問可否", scene:"登場シーン", map:"Google マップで見る ↗", filter:"この作品の聖地だけを表示", officialSite:"公式サイトを見る ↗", noResults:"一致する作品がありません。" },
  en: { places:"Explore locations", works:"Browse anime", submit:"Submit a location", heading:"Browse by anime", description:"Select a title to view all registered real-world locations for that anime.", placeholder:"Search anime titles", footer:"Locations grouped by anime", titles:n=>`Showing ${n} anime titles`, spots:n=>`${n} locations`, prefs:n=>`${n} prefectures`, details:"View locations", story:"About this anime", studio:"Animation studio", author:"Creator", access:"Visitor access", scene:"Scene", map:"View on Google Maps ↗", filter:"Show only this anime on the main page", officialSite:"Visit official site ↗", noResults:"No anime titles match your search." }
};
let language = localStorage.getItem("anime-seichi-language") === "en" ? "en" : "ja";
const t = (key, value) => typeof copy[language][key] === "function" ? copy[language][key](value) : copy[language][key];
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[character]);
const normalize = (value = "") => String(value).normalize("NFKC").toLocaleLowerCase("ja").replace(/[ァ-ヶ]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0x60)).replace(/\s/g, "");
const groups = [...places.reduce((map, place) => {
  if (!map.has(place.work)) map.set(place.work, []);
  map.get(place.work).push(place);
  return map;
}, new Map())].map(([name, spots]) => ({ name, spots, info:workInfo[name] || {}, prefectures:[...new Set(spots.map((spot) => spot.prefecture).filter(Boolean))] }))
  .sort((a, b) => (a.info["作品名カナ"] || a.name).localeCompare(b.info["作品名カナ"] || b.name, "ja"));

function searchable(work) {
  return normalize([work.name, work.info["作品名カナ"], work.info["作品名略称"]].filter(Boolean).join(" "));
}

function render() {
  const query = normalize(search.value);
  const visible = groups.filter((work) => !query || searchable(work).includes(query));
  result.textContent = visible.length ? t("titles", visible.length) : t("noResults");
  grid.innerHTML = visible.map((work, index) => {
    const genres = [work.info["ジャンル1"], work.info["ジャンル2"]].filter(Boolean).join(" / ");
    const prefectures = work.prefectures.slice(0, 4).join("・") + (work.prefectures.length > 4 ? ` +${work.prefectures.length - 4}` : "");
    const official = officialSources[work.name];
    const artwork = official?.artworkDisabled ? null : (official?.artworkUrl ? { image:official.artworkUrl, credit:"OFFICIAL" } : animeArtwork[work.name]);
    const artMarkup = artwork?.image ? `<span class="work-card-art"><img src="${escapeHtml(artwork.image)}" alt="${escapeHtml(`${work.name} artwork`)}" loading="lazy" referrerpolicy="no-referrer" /><small>${escapeHtml(artwork.credit || "AniList")}</small></span>` : `<span class="work-card-art work-card-art-placeholder" data-artwork-work="${escapeHtml(work.name)}" aria-label="作品画像を読み込み中"><span>ASD</span></span>`;
    return `<button class="work-card" type="button" data-work="${escapeHtml(work.name)}" style="--delay:${Math.min(index, 12) * 25}ms">${artMarkup}<span class="work-card-number">${String(index + 1).padStart(3, "0")}</span><span class="work-card-meta">${escapeHtml(genres || "ANIMATION")}</span><strong>${escapeHtml(work.name)}</strong><span class="work-card-prefectures">${escapeHtml(prefectures)}</span><span class="work-card-stats"><b>${t("spots", work.spots.length)}</b><b>${t("prefs", work.prefectures.length)}</b></span><span class="work-card-action">${t("details")} →</span></button>`;
  }).join("");
}

function mapUrl(place) {
  try { const url = new URL(place.mapUrl); if (["https:", "http:"].includes(url.protocol)) return url.href; } catch {}
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([place.name, place.address, place.coordinates].filter(Boolean).join(" "))}`;
}

function openWork(name, updateHash = true) {
  const work = groups.find((item) => item.name === name);
  if (!work) return;
  const info = work.info;
  const official = officialSources[work.name];
  const metadata = [[t("studio"), info["アニメーション制作会社"]], [t("author"), info["作者"]]].filter(([, value]) => value && value !== "該当なし");
  const spots = [...work.spots].sort((a, b) => `${a.prefecture}${a.city}${a.name}`.localeCompare(`${b.prefecture}${b.city}${b.name}`, "ja"));
  dialogContent.innerHTML = `<p class="eyebrow">ANIME LOCATION INDEX</p><div class="work-dialog-title"><h2>${escapeHtml(work.name)}</h2><div><b>${t("spots", spots.length)}</b><b>${t("prefs", work.prefectures.length)}</b></div></div>${info["ストーリー"] ? `<section class="work-summary"><h3>${t("story")}</h3><p>${escapeHtml(info["ストーリー"])}</p></section>` : ""}${metadata.length ? `<dl class="work-metadata">${metadata.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>` : ""}<div class="work-links">${official ? `<a class="map-link" href="${escapeHtml(official.siteUrl)}" target="_blank" rel="noreferrer">${t("officialSite")}</a>` : ""}<a class="map-link work-filter-link" href="index.html?work=${encodeURIComponent(work.name)}#places">${t("filter")} →</a></div><div class="work-spot-list">${spots.map((spot) => `<article class="work-spot-item"><div><small>${escapeHtml([spot.prefecture, spot.city].filter(Boolean).join("・"))}</small><h3>${escapeHtml(spot.name)}</h3></div><dl><div><dt>${t("access")}</dt><dd>${escapeHtml(spot.visit || "—")}</dd></div><div><dt>${t("scene")}</dt><dd>${escapeHtml(spot.scene || spot.episode || "—")}</dd></div></dl>${spot.privacyProtected ? "" : `<a href="${escapeHtml(mapUrl(spot))}" target="_blank" rel="noreferrer">${t("map")}</a>`}</article>`).join("")}</div>`;
  if (!dialog.open) dialog.showModal();
  if (updateHash) history.replaceState(null, "", `#work=${encodeURIComponent(work.name)}`);
}

function applyLanguage(next) {
  language = next === "en" ? "en" : "ja";
  document.documentElement.lang = language;
  languageSelect.value = language;
  localStorage.setItem("anime-seichi-language", language);
  document.querySelectorAll("[data-text]").forEach((element) => { element.textContent = t(element.dataset.text); });
  search.placeholder = t("placeholder");
  const openName = dialog.open ? decodeURIComponent(location.hash.replace(/^#work=/, "")) : "";
  render();
  if (openName) openWork(openName, false);
}

function setTheme(theme) {
  const dark = theme === "dark";
  document.body.dataset.theme = dark ? "dark" : "light";
  localStorage.setItem("anime-seichi-theme", dark ? "dark" : "light");
  themeText.textContent = dark ? "DARK MODE" : "LIGHT MODE";
  themeToggle.firstElementChild.textContent = dark ? "☾" : "☀";
  themeToggle.setAttribute("aria-label", dark ? "ライトモードに切り替える" : "ダークモードに切り替える");
}

search.addEventListener("input", render);
grid.addEventListener("click", (event) => { const card = event.target.closest("[data-work]"); if (card) openWork(card.dataset.work); });
document.querySelector("#workDialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener("close", () => history.replaceState(null, "", location.pathname + location.search));
languageSelect.addEventListener("change", () => applyLanguage(languageSelect.value));
themeToggle.addEventListener("click", () => setTheme(document.body.dataset.theme === "dark" ? "light" : "dark"));
menuToggle.addEventListener("click", () => { const open = mobileMenu.hidden; mobileMenu.hidden = !open; menuToggle.setAttribute("aria-expanded", String(open)); menuToggle.lastElementChild.textContent = open ? "−" : "＋"; });

setTheme(localStorage.getItem("anime-seichi-theme") || "light");
applyLanguage(language);
if (location.hash.startsWith("#work=")) openWork(decodeURIComponent(location.hash.slice(6)), false);
