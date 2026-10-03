// Google Maps Platform の正式な Street View Static API を使うための表示補助です。
// APIキー・費用上限・URL制限を設定し、試験地点を選んだ後だけ有効にします。
// ストリートビュー画像を保存・キャプチャーして再利用しません。
window.streetView = (() => {
  const safeKey = () => window.mapImageConfig?.streetViewPreviewEnabled === true
    ? String(window.mapImageConfig?.streetViewApiKey || "").trim()
    : "";
  const coordinates = (value = "") => {
    const match = String(value).match(/(-?\d{1,2}\.\d+)\D+(-?\d{1,3}\.\d+)/);
    return match ? `${match[1]},${match[2]}` : "";
  };

  function imageFor(place) {
    const key = safeKey();
    const location = coordinates(place?.coordinates);
    // 全カードを読み込むと費用が発生するため、試験対象に明示した地点だけ使う。
    if (!key || !location || place?.streetViewPreview !== true) return "";
    const params = new URLSearchParams({ size: "640x400", location, fov: "90", pitch: "0", key });
    return `https://maps.googleapis.com/maps/api/streetview?${params}`;
  }

  function isStreetView(url) {
    return String(url || "").startsWith("https://maps.googleapis.com/maps/api/streetview?");
  }

  return { imageFor, isStreetView };
})();
