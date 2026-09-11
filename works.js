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
const supabaseClient = window.supabase?.createClient(
  window.supabaseConfig?.url,
  window.supabaseConfig?.publishableKey
);
let groups = [];

function rebuildGroups() {
  groups = [...places.reduce((map, place) => {
    if (!map.has(place.work)) map.set(place.work, []);
    map.get(place.work).push(place);
    return map;
  }, new Map())].map(([name, spots]) => ({ name, spots, info:workInfo[name] || {}, prefectures:[...new Set(spots.map((spot) => spot.prefecture).filter(Boolean))] }))
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
  return normalize([work.name, work.info["作品名カナ"], work.info["作品名略称"]].filter(Boolean).join(" "));
}

function render() {
  const query = normalize(search.value);
  const visible = groups.filter((work) => !query || searchable(work).includes(query));
  result.textContent = visible.length ? t("titles", visible.length) : t("noResults");
  grid.innerHTML = visible.map((work, index) => {
    const genres = [work.info["ジャンル1"], work.info["ジャンル2"]].filter(Boolean).join(" / ");
    const prefectures = work.prefectures.slice(0, 4).join("・") + (work.prefectures.length > 4 ? ` +${work.prefectures.length - 4}` : "");
    const candidates = artworkCandidates(work.name);
    const artwork = candidates[0];
    const artMarkup = artwork?.image ? `<span class="work-card-art"><img src="${escapeHtml(artwork.image)}" alt="${escapeHtml(`${work.name} artwork`)}" loading="lazy" referrerpolicy="no-referrer" data-artwork-work="${escapeHtml(work.name)}" data-artwork-index="0" /><small>${escapeHtml(artwork.credit || "Artwork")}</small></span>` : `<span class="work-card-art work-card-art-placeholder" aria-label="作品画像を準備中"><span>ASD</span></span>`;
    return `<button class="work-card" type="button" data-work="${escapeHtml(work.name)}" style="--delay:${Math.min(index, 12) * 25}ms">${artMarkup}<span class="work-card-number">${String(index + 1).padStart(3, "0")}</span><span class="work-card-meta">${escapeHtml(genres || "ANIMATION")}</span><strong>${escapeHtml(work.name)}</strong><span class="work-card-prefectures">${escapeHtml(prefectures)}</span><span class="work-card-stats"><b>${t("spots", work.spots.length)}</b></span><span class="work-card-action">${t("details")} →</span></button>`;
  }).join("");
}

function mapUrl(place) {
  try { const url = new URL(place.mapUrl); if (["https:", "http:"].includes(url.protocol)) return url.href; } catch {}
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([place.name, place.address, place.coordinates].filter(Boolean).join(" "))}`;
}

function safeImageUrl(value = "") {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }
}

function spotCardImage(place) {
  return safeImageUrl(place.imageUrl) || window.streetView?.imageFor(place) || "";
}

function spotPhotoMarkup(place) {
  const imageUrl = spotCardImage(place);
  if (!imageUrl) return `<span class="work-spot-photo work-spot-photo-empty" aria-hidden="true"><span>PHOTO</span><small>写真を探しています</small></span>`;
  const creditText = place.photoCredit || (window.streetView?.isStreetView(imageUrl) ? "Google Maps · Street View" : "");
  const credit = creditText ? `<small>${escapeHtml(creditText)}</small>` : "";
  return `<span class="work-spot-photo"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(place.name)}" loading="lazy" />${credit}</span>`;
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
  const metadata = [[t("studio"), info["アニメーション制作会社"]], [t("author"), info["作者"]]].filter(([, value]) => value && value !== "該当なし");
  const spots = [...work.spots].sort((a, b) => `${a.prefecture}${a.city}${a.name}`.localeCompare(`${b.prefecture}${b.city}${b.name}`, "ja"));
  dialogContent.innerHTML = `<p class="eyebrow">ANIME LOCATION INDEX</p><div class="work-dialog-title"><h2>${escapeHtml(work.name)}</h2><div><b>${t("spots", spots.length)}</b></div></div>${info["ストーリー"] ? `<section class="work-summary"><h3>${t("story")}</h3><p>${escapeHtml(info["ストーリー"])}</p></section>` : ""}${metadata.length ? `<dl class="work-metadata">${metadata.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>` : ""}<div class="work-links">${official?.siteUrl ? `<a class="map-link" href="${escapeHtml(official.siteUrl)}" target="_blank" rel="noreferrer">${t("officialSite")}</a>` : ""}<a class="map-link work-filter-link" href="index.html?work=${encodeURIComponent(work.name)}#places">${t("filter")} →</a></div><div class="work-spot-list">${spots.map((spot) => `<article class="work-spot-item" data-spot-id="${escapeHtml(spot.id)}">${spotPhotoMarkup(spot)}<div class="work-spot-body"><small>${escapeHtml([spot.prefecture, spot.city].filter(Boolean).join("・"))}</small><h3>${escapeHtml(spot.name)}</h3><p>${escapeHtml(spot.scene || spot.episode || "—")}</p><div class="work-spot-bottom"><span>${escapeHtml(spot.visit || "—")}</span>${spot.privacyProtected ? "" : `<a href="${escapeHtml(mapUrl(spot))}" target="_blank" rel="noreferrer">${t("map")}</a>`}</div></div></article>`).join("")}</div>`;
  discoverSpotPhotos(spots);
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
    if (credit) credit.textContent = next.credit || "Artwork";
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
  image.parentElement.outerHTML = `<span class="work-spot-photo work-spot-photo-empty" aria-hidden="true"><span>PHOTO</span><small>写真を追加できます</small></span>`;
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
