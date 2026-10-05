const places = window.places || [];
const workInfo = window.workInfo || {};
const officialSources = window.officialSources || {};
const animeArtwork = window.animeArtwork || {};
const locale = window.animeSeichiI18n || {};
const displayWork = (name) => locale.work?.(name, language) || name;
const displayPlace = (place) => locale.place?.(place, language) || place.name;
const displayPrefecture = (name) => locale.prefecture?.(name, language) || name;
const displayCity = (place) => locale.city?.(place, language) || place.city;
const displayScene = (place) => locale.scene?.(place, language) || place.scene;
const displayInfoValue = (work, field, value) => locale.infoValue?.(work, field, value, language) || value;
const displayVisit = (name) => locale.visit?.(name, language) || name;
const displayCredit = (credit) => locale.credit?.(credit, language) || credit;
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
  ja: { places:"聖地を探す", works:"作品から探す", challenge:"撮影地点を探す", mapNav:"地図・現在地から探す", submit:"聖地申請", heading:"作品から探す", description:"作品を選ぶと、その作品に登録されている聖地をまとめて確認できます。", placeholder:"作品名を検索", footer:"作品別データ一覧", titles:n=>`${n} 作品を表示中`, spots:n=>`${n} 地点`, prefs:n=>`${n} 都道府県`, details:"聖地を見る", story:"作品紹介", studio:"アニメーション制作", author:"作者", access:"訪問可否", scene:"登場シーン", map:"Google マップで見る ↗", filter:"この作品の聖地だけを表示", officialSite:"公式サイトを見る ↗", noResults:"一致する作品がありません。", level:"聖地レベル", levelSort:"聖地レベル順", registered:"登録", missingStory:"作品紹介は準備中です。", placeDetails:"聖地詳細 →", imageWaiting:"写真を探しています", addPhoto:"写真を追加できます", artWaiting:"作品画像を準備中", close:"閉じる", footerLink:"利用案内・プライバシー", home:"ホームへ", mainNav:"メインナビゲーション", worksList:"作品一覧", languageAria:"言語を選択", darkMode:"ダークモードに切り替える", lightMode:"ライトモードに切り替える" },
  en: { places:"Explore locations", works:"Browse anime", challenge:"Find a viewpoint", mapNav:"Map & nearby", submit:"Submit a location", heading:"Browse by anime", description:"Select a title to view all registered real-world locations for that anime.", placeholder:"Search anime titles", footer:"Locations grouped by anime", titles:n=>`Showing ${n} anime titles`, spots:n=>`${n} locations`, prefs:n=>`${n} prefectures`, details:"View locations", story:"About this anime", studio:"Animation studio", author:"Creator", access:"Visitor access", scene:"Scene", map:"View on Google Maps ↗", filter:"Show only this anime on the main page", officialSite:"Visit official site ↗", noResults:"No anime titles match your search.", level:"Location level", levelSort:"By location level", registered:"Registered", missingStory:"Anime summary unavailable.", placeDetails:"View location details →", imageWaiting:"Looking for a photo", addPhoto:"You can add a photo", artWaiting:"Artwork coming soon", close:"Close", footerLink:"Guide & privacy", home:"Go to home", mainNav:"Main navigation", worksList:"Anime titles", languageAria:"Select language", darkMode:"Switch to dark mode", lightMode:"Switch to light mode" }
};
let language = localStorage.getItem("anime-seichi-language") === "en" ? "en" : "ja";
const t = (key, value) => typeof copy[language][key] === "function" ? copy[language][key](value) : copy[language][key];
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[character]);
const normalize = (value = "") => String(value).normalize("NFKC").toLocaleLowerCase("ja").replace(/[ァ-ヶ]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0x60)).replace(/\s/g, "");
const supabaseClient = window.supabase?.createClient(
  window.supabaseConfig?.url,
  window.supabaseConfig?.publishableKey
);
let groups = [];
const levelRank = (level) => ({ S:4, A:3, B:2, C:1 })[level] || 0;
const compareSpotsByLevel = (a, b) => levelRank(b.seichiLevel) - levelRank(a.seichiLevel) || (b.seichiScore || 0) - (a.seichiScore || 0) || a.name.localeCompare(b.name, "ja");
const groupLevelSummary = (spots) => {
  const sorted = [...spots].sort(compareSpotsByLevel);
  return { level:sorted[0]?.seichiLevel || "C", score:sorted[0]?.seichiScore || 0, highCount:spots.filter((spot) => ["S", "A"].includes(spot.seichiLevel)).length };
};

function rebuildGroups() {
  groups = [...places.reduce((map, place) => {
    const groupName = place.series || place.work;
    if (!map.has(groupName)) map.set(groupName, []);
    map.get(groupName).push(place);
    return map;
  }, new Map())].map(([name, spots]) => ({ name, spots, ...groupLevelSummary(spots), info:workInfo[name] || workInfo[spots[0]?.work] || {}, titles:[...new Set(spots.map((spot) => spot.work))], prefectures:[...new Set(spots.map((spot) => spot.prefecture).filter(Boolean))] }))
    .sort((a, b) => (a.info["作品名カナ"] || a.name).localeCompare(b.info["作品名カナ"] || b.name, "ja"));
}

rebuildGroups();

function artworkCandidates(workName) {
  const source = officialSources[workName] || {};
  if (source.artworkDisabled) return [];
  const candidates = [
    ...(source.artworkCandidates || []),
    ...(source.artworkUrl ? [{ image: source.artworkUrl, credit: source.artworkCredit || "Artwork" }] : []),
    ...(animeArtwork[workName] ? [animeArtwork[workName]] : [])
  ];
  return candidates.filter((candidate, index, all) => candidate?.image && all.findIndex((item) => item.image === candidate.image) === index);
}

function searchable(work) {
  return normalize([work.name, displayWork(work.name), ...work.titles, ...work.titles.map(displayWork), work.info["作品名カナ"], work.info["作品名略称"]].filter(Boolean).join(" "));
}

function render() {
  const query = normalize(search.value);
  const visible = groups.filter((work) => !query || searchable(work).includes(query));
  result.textContent = visible.length ? t("titles", visible.length) : t("noResults");
  grid.innerHTML = visible.map((work, index) => {
    const genres = [work.info["ジャンル1"], work.info["ジャンル2"]].filter(Boolean).join(" / ");
    const prefectures = work.prefectures.slice(0, 4).map(displayPrefecture).join(language === "en" ? ", " : "・") + (work.prefectures.length > 4 ? ` +${work.prefectures.length - 4}` : "");
    const candidates = artworkCandidates(work.name);
    const artwork = candidates[0];
    const artMarkup = artwork?.image ? `<span class="work-card-art${artwork.coverPosition === "right" ? " work-card-art-focus-right" : ""}"><img src="${escapeHtml(artwork.image)}" alt="${escapeHtml(`${displayWork(work.name)} artwork`)}" loading="lazy" referrerpolicy="no-referrer" data-artwork-work="${escapeHtml(work.name)}" data-artwork-index="0" /><small>${escapeHtml(displayCredit(artwork.credit || "Artwork"))}</small></span>` : `<span class="work-card-art work-card-art-placeholder" aria-label="${t("artWaiting")}"><span>ASD</span></span>`;
    return `<button class="work-card" type="button" data-work="${escapeHtml(work.name)}" style="--delay:${Math.min(index, 12) * 25}ms">${artMarkup}<span class="work-card-number">${String(index + 1).padStart(3, "0")}</span><span class="work-card-meta">${t("level")} ${escapeHtml(work.level)}</span><strong>${escapeHtml(displayWork(work.name))}</strong><span class="work-card-prefectures">${escapeHtml(prefectures)}</span><span class="work-card-stats"><b>${t("registered")} ${t("spots", work.spots.length)}</b></span><span class="work-card-action">${t("details")} →</span></button>`;
  }).join("");
}

function mapUrl(place) {
  const mayUseExactCoordinates = !place.privacyProtected && place.coordinateAccuracy !== "approximate";
  let result = "";
  if (mayUseExactCoordinates) { try { const url = new URL(place.mapUrl); if (["https:", "http:"].includes(url.protocol)) result = url.href; } catch {} }
  if (!result) result = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([displayPlace(place), displayCity(place), mayUseExactCoordinates ? place.coordinates : ""].filter(Boolean).join(" "))}`;
  if (language === "en") { try { const url = new URL(result); url.searchParams.set("hl", "en"); return url.href; } catch {} }
  return result;
}

function safeImageUrl(value = "") {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }
}

function spotCardImage(place) {
  return safeImageUrl(place.imageUrl);
}

function spotPhotoMarkup(place) {
  const imageUrl = spotCardImage(place);
  if (!imageUrl) return `<span class="work-spot-photo work-spot-photo-empty" aria-hidden="true"><span>PHOTO</span><small>${t("imageWaiting")}</small></span>`;
  const creditText = place.photoCredit || "";
  const credit = creditText ? `<small>${escapeHtml(displayCredit(creditText))}</small>` : "";
  return `<span class="work-spot-photo"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(displayPlace(place))}" loading="lazy" />${credit}</span>`;
}

function discoverSpotPhotos(spots) {
  if (!window.placePhotoDiscovery || typeof IntersectionObserver === "undefined") return;
  const observer = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
      const card = entry.target;
      observer.unobserve(card);
      const spot = spots.find((item) => item.id === card.dataset.spotId);
      if (!spot || spotCardImage(spot)) return;
      window.placePhotoDiscovery.find(spot).then((photo) => {
        if (!photo || !card.isConnected) return;
        Object.assign(spot, photo);
        const slot = card.querySelector(".work-spot-photo");
        if (slot) slot.outerHTML = spotPhotoMarkup(spot);
      });
    });
  }, { rootMargin: "220px 0px" });
  dialogContent.querySelectorAll("[data-spot-id]").forEach((card) => observer.observe(card));
}

function openWork(name, updateHash = true) {
  const work = groups.find((item) => item.name === name);
  if (!work) return;
  const info = work.info;
  const official = officialSources[work.name];
  const metadata = [[t("studio"), displayInfoValue(work.name, "アニメーション制作会社", info["アニメーション制作会社"])], [t("author"), displayInfoValue(work.name, "作者", info["作者"])]].filter(([, value]) => value && value !== "該当なし");
  const spots = [...work.spots].sort(compareSpotsByLevel);
  const synopsis = displayInfoValue(work.name, "ストーリー", info["ストーリー"]);
  dialogContent.innerHTML = `<p class="eyebrow">ANIME LOCATION INDEX / ${t("levelSort")}</p><div class="work-dialog-title"><h2>${escapeHtml(displayWork(work.name))}</h2><div><b>${t("spots", spots.length)}</b></div></div>${synopsis ? `<section class="work-summary"><h3>${t("story")}</h3><p>${escapeHtml(synopsis)}</p></section>` : ""}${metadata.length ? `<dl class="work-metadata">${metadata.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>` : ""}<div class="work-links">${official?.siteUrl ? `<a class="map-link" href="${escapeHtml(official.siteUrl)}" target="_blank" rel="noreferrer">${t("officialSite")}</a>` : ""}<a class="map-link work-filter-link" href="index.html?work=${encodeURIComponent(work.name)}#places">${t("filter")} →</a></div><div class="work-spot-list">${spots.map((spot) => `<article class="work-spot-item" data-spot-id="${escapeHtml(spot.id)}">${spotPhotoMarkup(spot)}<div class="work-spot-body"><small>${t("level")} ${escapeHtml(spot.seichiLevel || "C")}${Number.isFinite(spot.seichiScore) ? ` / ${spot.seichiScore} ${language === "en" ? "pts" : "点"}` : ""}</small><small>${escapeHtml([displayPrefecture(spot.prefecture), displayCity(spot)].filter(Boolean).join(" · "))}</small>${spot.work !== work.name ? `<small class="work-spot-series-title">${escapeHtml(displayWork(spot.work))}</small>` : ""}<h3><a class="work-spot-detail-link" href="index.html?place=${encodeURIComponent(spot.id)}#places">${escapeHtml(displayPlace(spot))}</a></h3><p>${escapeHtml(displayScene(spot) || spot.episode || "—")}</p><div class="work-spot-bottom"><span>${escapeHtml(displayVisit(spot.visit || "—"))}</span><a href="index.html?place=${encodeURIComponent(spot.id)}#places">${t("placeDetails")}</a>${spot.privacyProtected ? "" : `<a href="${escapeHtml(mapUrl(spot))}" target="_blank" rel="noreferrer">${t("map")}</a>`}</div></div></article>`).join("")}</div>`;
  discoverSpotPhotos(spots);
  if (!dialog.open) dialog.showModal();
  if (updateHash) history.replaceState(null, "", `#work=${encodeURIComponent(work.name)}`);
}

function applyLanguage(next) {
  language = next === "en" ? "en" : "ja";
  document.documentElement.lang = language;
  document.title = language === "en" ? "Browse anime | ANIME SEICHI DATA" : "作品から探す | ANIME SEICHI DATA";
  languageSelect.value = language;
  localStorage.setItem("anime-seichi-language", language);
  document.querySelectorAll("[data-text]").forEach((element) => { element.textContent = t(element.dataset.text); });
  document.querySelectorAll("[data-text-aria]").forEach((element) => { element.setAttribute("aria-label", t(element.dataset.textAria)); });
  search.placeholder = t("placeholder");
  const openName = dialog.open ? decodeURIComponent(location.hash.replace(/^#work=/, "")) : "";
  render();
  if (openName) openWork(openName, false);
}

function setTheme(theme) {
  const dark = theme === "dark";
  document.body.dataset.theme = dark ? "dark" : "light";
  localStorage.setItem("anime-seichi-theme", dark ? "dark" : "light");
  themeText.textContent = language === "en" ? (dark ? "DARK MODE" : "LIGHT MODE") : (dark ? "ダークモード" : "ライトモード");
  themeToggle.firstElementChild.textContent = dark ? "☾" : "☀";
  themeToggle.setAttribute("aria-label", t(dark ? "lightMode" : "darkMode"));
}

search.addEventListener("input", render);
grid.addEventListener("click", (event) => { const card = event.target.closest("[data-work]"); if (card) openWork(card.dataset.work); });
grid.addEventListener("error", (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.dataset.artworkWork) return;
  const candidates = artworkCandidates(image.dataset.artworkWork);
  const nextIndex = Number(image.dataset.artworkIndex || 0) + 1;
  const next = candidates[nextIndex];
  if (next?.image) {
    image.dataset.artworkIndex = String(nextIndex);
    image.src = next.image;
    const credit = image.parentElement?.querySelector("small");
    if (credit) credit.textContent = displayCredit(next.credit || "Artwork");
    return;
  }
  image.parentElement?.classList.add("work-card-art-placeholder");
  image.remove();
}, true);
document.querySelector("#workDialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
dialogContent.addEventListener("error", (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  image.parentElement.outerHTML = `<span class="work-spot-photo work-spot-photo-empty" aria-hidden="true"><span>PHOTO</span><small>${t("addPhoto")}</small></span>`;
}, true);
dialog.addEventListener("close", () => history.replaceState(null, "", location.pathname + location.search));
languageSelect.addEventListener("change", () => applyLanguage(languageSelect.value));
themeToggle.addEventListener("click", () => setTheme(document.body.dataset.theme === "dark" ? "light" : "dark"));
menuToggle.addEventListener("click", () => { const open = mobileMenu.hidden; mobileMenu.hidden = !open; menuToggle.setAttribute("aria-expanded", String(open)); menuToggle.lastElementChild.textContent = open ? "−" : "＋"; });

async function loadApprovedSubmissions() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.rpc("get_approved_spots");
    if (error || !data?.length) return;
    let added = false;
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
      added = true;
    });
    if (!added) return;
    rebuildGroups();
    render();
  } catch {
    // 作品一覧は、通信できない場合も登録済みデータだけで表示する。
  }
}

setTheme(localStorage.getItem("anime-seichi-theme") || "light");
applyLanguage(language);
loadApprovedSubmissions().finally(() => {
  if (location.hash.startsWith("#work=")) openWork(decodeURIComponent(location.hash.slice(6)), false);
});
