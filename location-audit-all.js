// 全登録地点の基本監査。作品の構図・撮影位置が確認できたことを意味しません。
// 既に個別確認した第1・第2回の結果は上書きしません。
(() => {
  const numericCoordinate = (value) => {
    const parts = String(value || "").trim().split(/[,，]/).map((item) => item.trim());
    if (parts.length !== 2 || parts.some((item) => !/^[+-]?\d+(?:\.\d+)?$/.test(item))) return false;
    const [latitude, longitude] = parts.map(Number);
    return Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
  };
  (window.places || []).forEach((place) => {
    if (place.locationAudit) return;
    const coordinate = String(place.coordinates || "");
    const approximate = /前後|付近|\//.test(coordinate);
    const exact = numericCoordinate(coordinate);
    const registeredCoordinate = exact ? "登録地点（施設・景観）" : approximate ? "おおよその登録地点" : "座標要確認";
    const reviewResult = exact
      ? "登録地点の座標として地図表示。撮影地点の座標とは区別する。"
      : approximate
        ? "概算座標として地図表示。正確な立ち位置は未確定。"
        : "座標の表記を確認するまで地図に表示しない。";
    place.locationAudit = {
      batch: "全件基本確認",
      registeredCoordinate,
      filmingViewpoint: "未確認",
      reviewResult,
      nextStep: exact ? "作品の構図と安全な立ち位置を照合する" : "公式所在地または安全にアクセスできる地点を確認する"
    };
  });
})();
