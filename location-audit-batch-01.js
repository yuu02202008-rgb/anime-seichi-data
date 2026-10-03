// 第1回：既存データの位置情報確認（place-1〜place-30）。
// ここでは「登録されている座標」が施設・景観の地点かを整理し、撮影地点の座標とは混同しません。
(() => {
  const batch = (window.places || []).filter((place) => {
    const number = Number(String(place.id || "").replace("place-", ""));
    return Number.isInteger(number) && number >= 1 && number <= 30;
  });
  batch.forEach((place) => {
    const hasApproximateCoordinate = /前後|付近|\//.test(String(place.coordinates || ""));
    place.locationAudit = {
      batch: "第1回（1〜30件）",
      registeredCoordinate: hasApproximateCoordinate ? "おおよその登録地点" : "登録地点（施設・景観）",
      filmingViewpoint: place.shootingViewpoint?.status === "verified" ? "確認済み" : place.shootingViewpoint?.status === "historical" ? "過去の実証のみ確認・現行未確認" : "未確認",
      nextStep: place.shootingViewpoint?.status === "verified" ? "利用条件を再確認する" : "現行の撮影場所・安全な立ち位置・利用条件を確認する",
      reviewResult: hasApproximateCoordinate ? "概算座標として地図表示。正確な立ち位置は未確定。" : "登録地点の座標として地図表示。撮影地点の座標とは区別する。"
    };
  });
  const officialChecks = {
    "place-2": "神奈川県立鎌倉高等学校の公式情報で所在地を確認",
    "place-4": "平塚市の施設情報で総合体育館を確認",
    "place-5": "藤沢市の施設情報で秋葉台文化体育館の所在地を確認",
    "place-6": "東京都立武蔵野北高等学校の公式情報で所在地を確認",
    "place-7": "能代科学技術高等学校の公式情報で学校情報を確認",
    "place-13": "函館市の施設情報で五稜郭タワーの所在地を確認",
    "place-14": "函館市の施設情報で旧函館区公会堂の所在地・公開条件を確認",
    "place-11": "函館市の案内で函館山展望台の安全上の注意を確認",
    "place-24": "八丈町の観光案内で南原千畳岩海岸を確認",
    "place-26": "東京都のロケーション情報で東京スカイツリーの所在地・利用条件を確認",
    "place-27": "東京都の窓口案内で墨田区役所の所在地を確認"
  };
  batch.forEach((place) => {
    if (officialChecks[place.id]) place.locationAudit.officialCheck = officialChecks[place.id];
  });
  window.locationAuditBatch01Count = batch.length;
})();
