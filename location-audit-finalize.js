// 分割して追加した地点を含め、監査情報がない地点を最終的に補完します。
(() => {
  (window.places || []).forEach((place) => {
    if (place.locationAudit) return;
    const coordinate = String(place.coordinates || "");
    const parts = coordinate.trim().split(/[,，]/).map((item) => item.trim());
    const exact = parts.length === 2 && parts.every((item) => /^[+-]?\d+(?:\.\d+)?$/.test(item)) && parts.map(Number).every((number) => Number.isFinite(number));
    const approximate = /前後|付近|\//.test(coordinate);
    place.locationAudit = {
      batch: "全件基本確認",
      registeredCoordinate: exact ? "登録地点（施設・景観）" : approximate ? "おおよその登録地点" : "座標要確認",
      filmingViewpoint: place.shootingViewpoint?.status === "verified" ? "確認済み" : place.shootingViewpoint?.status === "historical" ? "過去の実証のみ確認・現行未確認" : "未確認",
      reviewResult: exact ? "登録地点の座標として地図表示。撮影地点の座標とは区別する。" : approximate ? "概算座標として地図表示。正確な立ち位置は未確定。" : "座標の表記を確認するまで地図に表示しない。",
      nextStep: "作品の構図と安全な立ち位置を照合する"
    };
  });
})();
