(() => {
  const byId = (id) => document.getElementById(id);
  let origin = null;
  let map;
  let spotLayer;
  let userMarker;
  let latestResults = [];
  let showDetail = () => {};

  const coordinates = (place) => {
    if (place.privacyProtected) return null;
    const values = String(place.coordinates || "").split(/[,，]/).map((value) => Number(value.trim()));
    return values.length === 2 && values.every(Number.isFinite) && Math.abs(values[0]) <= 90 && Math.abs(values[1]) <= 180 ? values : null;
  };
  const distance = (first, second) => {
    const radians = (value) => value * Math.PI / 180;
    const part = Math.sin(radians(second[0] - first[0]) / 2) ** 2 + Math.cos(radians(first[0])) * Math.cos(radians(second[0])) * Math.sin(radians(second[1] - first[1]) / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, part)));
  };
  const formatDistance = (value) => value < 1 ? `約${Math.round(value * 1000)}m` : `約${value.toFixed(1)}km`;
  const escape = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);

  function ensureMap() {
    if (map) return true;
    if (!window.L) {
      byId("mapStatus").textContent = "地図を読み込めませんでした。近い順の一覧は利用できます。";
      return false;
    }
    map = L.map("nearbyMap", { scrollWheelZoom: false }).setView([36.2, 138.3], 5);
    L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
      minZoom: 2, maxZoom: 18,
      attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">国土地理院</a>'
    }).addTo(map);
    spotLayer = L.layerGroup().addTo(map);
    return true;
  }

  function paintNearbyCards(results) {
    const container = byId("nearbyResults");
    if (!origin) {
      container.innerHTML = '<p class="nearby-empty">現在地を使うと、ここに近い聖地を5件だけ表示します。</p>';
      return;
    }
    const nearest = results.filter(coordinates).sort((a, b) => distance(origin, coordinates(a)) - distance(origin, coordinates(b))).slice(0, 5);
    container.innerHTML = nearest.length ? nearest.map((place, index) => {
      const point = coordinates(place);
      return `<button class="nearby-card" type="button" data-place-id="${escape(place.id)}"><span class="nearby-rank">${String(index + 1).padStart(2, "0")}</span><span><b>${escape(place.name)}</b><small>${escape(place.work)} · ${formatDistance(distance(origin, point))}</small></span><span class="nearby-arrow">→</span></button>`;
    }).join("") : '<p class="nearby-empty">この条件に合う、座標が確認できた聖地はありません。</p>';
    container.querySelectorAll("[data-place-id]").forEach((button) => button.addEventListener("click", () => {
      const place = results.find((item) => item.id === button.dataset.placeId);
      if (!place) return;
      const point = coordinates(place);
      if (map && point) map.setView(point, 16);
      showDetail(place);
    }));
  }

  function render(results, detail) {
    latestResults = results;
    showDetail = detail;
    paintNearbyCards(results);
    if (!ensureMap()) return;
    spotLayer.clearLayers();
    // 現在地を許可する前は、全国の地点を出さない。地図上の点の意味が分かりにくくなるため。
    const visible = origin ? results.filter(coordinates).slice(0, 350) : [];
    visible.forEach((place) => {
      const point = coordinates(place);
      const marker = L.circleMarker(point, { radius: 6, color: "#ea5d2a", fillColor: "#ff6b35", fillOpacity: .9, weight: 2 });
      marker.bindPopup(`<strong>${escape(place.name)}</strong><br><small>${escape(place.work)}${origin ? ` · ${formatDistance(distance(origin, point))}` : ""}</small>`);
      marker.on("click", () => showDetail(place));
      marker.addTo(spotLayer);
    });
    byId("mapStatus").textContent = origin ? `${visible.length}件を地図に表示中。作品名や地域で絞ると、地図も一緒に更新されます。` : "現在地を使うと、近くの聖地だけを地図に表示します。";
  }

  function locate() {
    if (!navigator.geolocation || !window.isSecureContext) {
      byId("locationStatus").textContent = "現在地はHTTPSの公開サイトで利用できます。公開ページを開いてお試しください。";
      return;
    }
    const button = byId("locateButton");
    button.disabled = true;
    byId("locationStatus").textContent = "現在地を確認しています。ブラウザで許可してください。";
    navigator.geolocation.getCurrentPosition((position) => {
      origin = [position.coords.latitude, position.coords.longitude];
      button.disabled = false;
      byId("clearLocation").hidden = false;
      byId("locationStatus").textContent = `現在地から近い順に表示しています。精度は約${Math.round(position.coords.accuracy)}mです。`;
      if (ensureMap()) {
        if (userMarker) map.removeLayer(userMarker);
        userMarker = L.marker(origin).addTo(map).bindPopup("現在地");
        map.setView(origin, 14);
      }
      window.dispatchEvent(new Event("nearbychange"));
    }, (error) => {
      button.disabled = false;
      byId("locationStatus").textContent = error.code === 1 ? "位置情報が許可されていません。ブラウザのサイト設定で許可してから、もう一度お試しください。" : "現在地を取得できませんでした。もう一度お試しください。";
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  }

  byId("locateButton").addEventListener("click", locate);
  byId("clearLocation").addEventListener("click", () => {
    origin = null;
    if (map && userMarker) map.removeLayer(userMarker);
    userMarker = null;
    byId("clearLocation").hidden = true;
    byId("locationStatus").textContent = "現在地をクリアしました。現在地は保存していません。";
    window.dispatchEvent(new Event("nearbychange"));
  });
  byId("fitPlaces").addEventListener("click", () => {
    if (!ensureMap()) return;
    const points = latestResults.filter(coordinates).slice(0, 350).map(coordinates);
    if (points.length) map.fitBounds(L.latLngBounds(points), { padding: [30, 30], maxZoom: 14 });
  });
  window.nearby = {
    coordinates,
    order: (results) => origin ? [...results].sort((a, b) => (coordinates(a) ? distance(origin, coordinates(a)) : Infinity) - (coordinates(b) ? distance(origin, coordinates(b)) : Infinity)) : results,
    render,
    distanceMarkup: (place) => origin && coordinates(place) ? `<span class="card-distance">現在地から${formatDistance(distance(origin, coordinates(place)))}（直線）</span>` : ""
  };
})();
