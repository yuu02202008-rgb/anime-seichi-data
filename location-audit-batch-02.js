// 第2回：元データの次の30地点を、登録地点と撮影地点に分けて確認するための台帳です。
(() => {
  const batch = (window.places || []).slice(30, 60);
  batch.forEach((place) => {
    const hasApproximateCoordinate = /前後|付近|\//.test(String(place.coordinates || ""));
    place.locationAudit = {
      batch: "第2回（次の30件）",
      registeredCoordinate: hasApproximateCoordinate ? "おおよその登録地点" : "登録地点（施設・景観）",
      filmingViewpoint: "未確認",
      reviewResult: hasApproximateCoordinate ? "概算座標として地図表示。正確な立ち位置は未確定。" : "登録地点の座標として地図表示。撮影地点の座標とは区別する。",
      nextStep: "作品の構図と安全な立ち位置を照合する"
    };
  });
  window.locationAuditBatch02Count = batch.length;
})();
