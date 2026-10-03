// 写真の公開可否を分けて管理します。自動検索候補は確認が済むまで「確認待ち」です。
(() => {
  const approved = window.placePhotos || {};
  (window.places || []).forEach((place) => {
    const photo = approved[place.id];
    place.photoAudit = photo
      ? { status: "掲載可", summary: "再利用条件を確認した写真を掲載しています。" }
      : { status: "確認待ち", summary: "写真候補は著作権・場所の一致・撮影可否を確認してから掲載します。" };
  });
})();
