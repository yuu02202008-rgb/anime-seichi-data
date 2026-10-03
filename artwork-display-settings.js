// 横長のキービジュアルは、タイトル文字よりキャラクターが見える位置を優先する。
(() => {
  // ATRIはアーカイブ画像ではなく、アニプレックス掲載の公式キービジュアルを最優先にする。
  if (window.officialSources?.["ATRI -My Dear Moments-"]) {
    window.officialSources["ATRI -My Dear Moments-"].artworkCandidates = [{
      image: "https://www.aniplex.co.jp/SYS/CONTENTS/keyvisual_atri/w700",
      credit: "©ATRI ANIME PROJECT / Aniplex"
    }];
  }

  const settings = {
    "経験済みなキミと、付き合うことになった話。": "right",
    "ラブライブ！虹ヶ咲学園スクールアイドル同好会": "right",
    "ガールズ＆パンツァー": "right",
    "Fate/Grand Order": "right"
  };

  Object.entries(settings).forEach(([work, coverPosition]) => {
    const source = window.officialSources?.[work];
    if (!source?.artworkCandidates) return;
    source.artworkCandidates.forEach((candidate) => { candidate.coverPosition = coverPosition; });
  });
})();
