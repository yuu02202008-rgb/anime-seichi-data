// アニメ本編の場面画像は、公式がWeb掲載を許可した素材または権利者の許諾を得た素材のみ登録する。
// `imageUrl` は掲載を許可された画像URL、`credit` は権利表記、`sourceUrl` は許諾・公式掲載元を記録する。
// 許可が確認できない本編キャプチャー、SNS転載画像、ファン投稿画像は登録しない。
window.sceneImages = {
};

// すべての掲載作品を対象に、場面画像の利用可否を管理する。
// 画像の公開可否は作品単位で確認し、公式素材の掲載条件または権利者許諾を確認できるまで「掲載許諾未確認」とする。
window.sceneImageResearch = {};
[...new Set((window.places || []).map((place) => place.work))].forEach((work) => {
  window.sceneImageResearch[work] = {
    status: "掲載許諾未確認",
    note: "公式の場面画像・キービジュアルが公開されていても、本サイトへの再掲載可否は別途確認が必要です。掲載条件または権利者の許諾を確認できるまで画像は表示しません。"
  };
});

// 場面画像を地点データへ反映する。
(window.places || []).forEach((place) => {
  const sceneImage = window.sceneImages[place.id];
  if (sceneImage) place.sceneImage = sceneImage;
  place.sceneImageResearch = window.sceneImageResearch[place.work];
});
