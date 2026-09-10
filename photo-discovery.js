// Wikimedia Commons のみを対象に、場所名で見つかった再利用可能な写真を表示します。
// Google マップの投稿写真など、利用条件を確認できない画像は取得しません。
window.placePhotoDiscovery = (() => {
  const storageKey = "anime-seichi-commons-photo-cache-v1";
  const bundledPhotos = window.placePhotos || {};
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch {}

  const safeUrl = (value = "") => {
    try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; }
    catch { return ""; }
  };
  const textOnly = (value = "") => String(value).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const normalized = (value = "") => String(value).normalize("NFKC").replace(/[\s・（）()「」『』/／\-－]/g, "").toLowerCase();
  const point = (value = "") => {
    const match = String(value).match(/(-?\d{1,2}\.\d+)\D+(-?\d{1,3}\.\d+)/);
    return match ? { lat: Number(match[1]), lon: Number(match[2]) } : null;
  };
  const distanceKm = (a, b) => {
    if (!a || !b || !Number.isFinite(a.lat) || !Number.isFinite(a.lon) || !Number.isFinite(b.lat) || !Number.isFinite(b.lon)) return Infinity;
    const radians = (number) => number * Math.PI / 180;
    const dLat = radians(b.lat - a.lat), dLon = radians(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  };
  const save = () => { try { localStorage.setItem(storageKey, JSON.stringify(cache)); } catch {} };

  async function find(place) {
    if (place?.id && bundledPhotos[place.id]) return bundledPhotos[place.id];
    if (!place?.id || cache[place.id] !== undefined) return cache[place.id] || null;
    const query = [place.name, place.city, place.prefecture].filter(Boolean).join(" ");
    const endpoint = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=8&prop=imageinfo%7Ccoordinates&iiprop=url%7Cextmetadata&iiurlwidth=1200&format=json&origin=*&gsrsearch=" + encodeURIComponent(query);
    try {
      const response = await fetch(endpoint, { signal: AbortSignal.timeout(10000) });
      const payload = await response.json();
      const target = point(place.coordinates);
      const nameKey = normalized(place.name).replace(/^(jr|東京都立|神奈川県立|市立|県立)/, "").slice(0, 18);
      const pages = Object.values(payload.query?.pages || {}).map((item) => {
        const info = item.imageinfo?.[0];
        const license = textOnly(info?.extmetadata?.LicenseShortName?.value);
        const photoPoint = item.coordinates?.[0] ? { lat: Number(item.coordinates[0].lat), lon: Number(item.coordinates[0].lon) } : null;
        const titleMatch = nameKey.length >= 4 && normalized(item.title).includes(nameKey);
        return { item, info, license, titleMatch, distance: distanceKm(target, photoPoint) };
      }).filter(({ info, license, titleMatch, distance }) => safeUrl(info?.url) && /^(CC|Public domain|PD|CC0)/i.test(license) && (titleMatch || distance <= 1));
      pages.sort((a, b) => (a.titleMatch === b.titleMatch ? a.distance - b.distance : a.titleMatch ? -1 : 1));
      const page = pages[0]?.item;
      const info = pages[0]?.info;
      if (!info) throw new Error("No reusable image");
      const license = textOnly(info.extmetadata?.LicenseShortName?.value) || "licensed image";
      const author = textOnly(info.extmetadata?.Artist?.value);
      const photo = {
        imageUrl: safeUrl(info.thumburl || info.url),
        photoCredit: `Wikimedia Commons · ${author ? `${author} · ` : ""}${license}`,
        photoSourceUrl: safeUrl(info.descriptionurl) || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`
      };
      cache[place.id] = photo;
      save();
      return photo;
    } catch {
      cache[place.id] = null;
      save();
      return null;
    }
  }

  return { find };
})();
