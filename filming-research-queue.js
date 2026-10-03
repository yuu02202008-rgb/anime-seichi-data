// 全地点を撮影地点調査の対象として管理します。未確認の地点を確定地点として扱いません。
(() => {
  (window.places || []).forEach((place) => {
    if (place.privacyProtected) {
      place.filmingResearch = {
        status: "非公開管理",
        priority: "保護",
        note: "住宅地・私有地などの保護のため、正確な撮影地点は公開せず、訪問を促す情報にも使用しない。"
      };
      return;
    }
    if (place.shootingViewpoint?.status === "verified") {
      place.filmingResearch = place.filmingResearch || {};
      place.filmingResearch.status = "確認済み";
      place.filmingResearch.note = place.filmingResearch.note || "現行の根拠と利用条件を確認した撮影地点です。";
      place.filmingResearch.priority = "完了";
      return;
    }
    if (place.shootingViewpoint?.status === "historical") {
      place.filmingResearch = {
        ...(place.filmingResearch || {}),
        status: "要再確認",
        priority: "高",
        note: "過去の実証実験で撮影エリアの設置を確認。現在の設置・利用条件は未確認のため、撮影地点として案内しない。"
      };
      return;
    }
    if (place.filmingResearch) {
      place.filmingResearch.priority = "高";
      return;
    }
    const coordinateStatus = place.locationAudit?.registeredCoordinate || "";
    const priority = coordinateStatus === "座標要確認" || coordinateStatus === "おおよその登録地点" ? "最優先" : "通常";
    place.filmingResearch = {
      status: "未着手",
      priority,
      note: priority === "最優先"
        ? "登録地点の座標も含め、作品の構図・安全な立ち位置・根拠を確認する。"
        : "作品の構図・安全な立ち位置・根拠を確認する。"
    };
  });
})();
