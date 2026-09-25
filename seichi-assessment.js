// 聖地レベルは、人気の推測ではなく、現在登録されている根拠・体験・訪問性・座標精度から暫定判定する。
// SNS反応は未取得のため人気点は加算しない。反応データを確認後に管理者が再判定する。
(() => {
  const scenicWords = /富士山|山|岳|展望|海|浜|海岸|港|湖|川|滝|神社|寺|城|公園|タワー|橋|駅|商店街|美術館|博物館|水族館|砂丘|温泉|学校/;
  const coordinatePoints = (place) => {
    const result = place.locationAudit?.reviewResult || "";
    if (result.includes("登録地点の座標として")) return 10;
    if (result.includes("概算座標")) return 5;
    return 0;
  };
  const accessPoints = (place) => ({ "自由訪問可能":15, "条件付き":8, "外観のみ":4 })[place.visit] || 0;
  const evidencePoints = (place) => {
    const status = place.filmingResearch?.status;
    if (place.shootingViewpoint?.status === "verified" || status === "確認済み") return 30;
    if (status === "場所対応を確認") return 22;
    if (status === "構図候補" || status === "候補を確認") return 16;
    return 8;
  };
  const experiencePoints = (place) => scenicWords.test(`${place.name} ${place.scene}`) ? 15 : 8;
  const levelFor = (score, isProtected) => {
    if (isProtected) return "C";
    // SNS反応をまだ加点しないため、暫定判定は70点満点の範囲で区分する。
    if (score >= 62) return "A";
    if (score >= 45) return "B";
    return "C";
  };
  (window.places || []).forEach((place) => {
    const scoreBreakdown = { "作品との一致":evidencePoints(place), "体験価値":experiencePoints(place), "人気・反応":0, "訪問しやすさ":accessPoints(place), "根拠・安全性":coordinatePoints(place) };
    const score = Object.values(scoreBreakdown).reduce((total, value) => total + value, 0);
    const protectedPlace = place.filmingResearch?.status === "非公開管理" || place.privacyProtected;
    const level = place.seichiLevel === "S" ? "S" : levelFor(score, protectedPlace);
    place.seichiLevel = level;
    place.seichiScore = score;
    place.seichiScoreBreakdown = scoreBreakdown;
    place.seichiLevelReason = `暫定 ${score}点／100点。人気・反応は未取得のため0点で、根拠・体験・訪問性・座標精度から算出。`;
    place.seichiAssessment = { status:level === "S" ? "判定済み" : "暫定判定", summary:protectedPlace ? "非公開または配慮が必要な地点のためC判定です。" : `現在の根拠で${level}判定（${score}点）。SNS反応と撮影地点の追加確認後に見直します。` };
  });
})();
