// Google Maps Platform の正式な Street View Static API を使うための表示補助です。
// APIキーが未設定の間は何も表示せず、既存の写真・Wikimedia Commons 検索を優先します。
window.streetView = (() => {
  const safeKey = () => String(window.mapImageConfig?.streetViewApiKey || "").trim();
  const coordinates = (value = "") => {
    const match = String(value).match(/(-?\d{1,2}\.\d+)\D+(-?\d{1,3}\.\d+)/);
    return match ? `${match[1]},${match[2]}` : "";
  };

  function imageFor(place) {
    const key = safeKey();
    const location = coordinates(place?.coordinates);
    if (!key || !location) return "";
    const params = new URLSearchParams({ size: "640x400", location, fov: "90", pitch: "0", key });
    return `https://maps.googleapis.com/maps/api/streetview?${params}`;
  }

  function isStreetView(url) {
    return String(url || "").startsWith("https://maps.googleapis.com/maps/api/streetview?");
  }

  return { imageFor, isStreetView };
})();
