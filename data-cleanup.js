// 元データへ混ざっていた「該当なし・別作品名」の補足を、実際の登場作品へ修正します。
// 場所の説明文と一致する作品へ統合し、画面・検索結果には補足表記を出しません。
(() => {
  const corrections = new Map([
    ["プラスティック・メモリーズ（該当なし・花咲くいろは）", "花咲くいろは"],
    ["ガールズ＆パンツァー（該当なし・サクラクエスト）", "サクラクエスト"]
  ]);

  (window.places || []).forEach((place) => {
    if (corrections.has(place.work)) place.work = corrections.get(place.work);
  });
})();
