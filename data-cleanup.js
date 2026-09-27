// 元データへ混ざっていた「該当なし・別作品名」の補足を、実際の登場作品へ修正します。
// 場所の説明文と一致する作品へ統合し、画面・検索結果には補足表記を出しません。
(() => {
  const corrections = new Map([
    ["プラスティック・メモリーズ（該当なし・花咲くいろは）", "花咲くいろは"],
    ["ガールズ＆パンツァー（該当なし・サクラクエスト）", "サクラクエスト"]
  ]);

  (window.places || []).forEach((place) => {
    if (corrections.has(place.work)) place.work = corrections.get(place.work);
    if (place.id === "place-6" && place.name === "東京都立武蔵野北高等学校") place.coordinates = "35.7198, 139.5573";

    // 現地の公式情報で住所・利用条件を確認できた地点を補正する。
    if (place.id === "place-1" || place.id === "place-149") {
      place.mapGroup = "kamakura-kokomae-crossing";
      place.visit = "条件付き";
      place.visitConditions = "踏切・車道には立ち入らないでください。周辺の通行と住民の生活を優先し、撮影は安全な歩道・指定場所から行います。";
      place.seichiLevel = "S";
      place.seichiLevelReason = "作品を代表する景観として認知が高く、自治体が安全な撮影エリアを案内している。ただし訪問時は地域の通行を最優先にする。";
    }
    if (place.id === "place-143") {
      place.visit = "条件付き";
      place.visitConditions = "館内の見学は開館時間・休館日に従ってください。図書館利用者の妨げにならないよう、撮影可否は現地表示を確認します。";
    }
    if (place.id === "place-144" || place.id === "place-171") {
      place.visit = "条件付き";
      place.visitConditions = "駅構内・ホームへ入る場合は有効な乗車券または入場券が必要です。鉄道利用者の妨げにならないように訪問します。";
    }
    if (place.id === "place-150") {
      place.visit = "条件付き";
      place.visitConditions = "館内へ入るには入場料が必要です。営業時間・入場予約の有無は公式サイトで確認してください。";
      place.sourceUrl = "https://www.enosui.com/access.php";
    }
    // 第1回の位置情報確認で、施設の公式所在地・利用条件を照合できた地点。
    if (place.id === "place-5") {
      place.visit = "条件付き";
      place.visitConditions = "体育館の利用・撮影可否は施設の案内に従ってください。イベント開催時や利用者の妨げになる撮影はしません。";
      place.sourceUrl = "https://www.city.fujisawa.kanagawa.jp/shisetsu/annai/sports/001.html";
    }
    if (place.id === "place-13") {
      place.visit = "条件付き";
      place.visitConditions = "展望台・館内の利用は営業時間と施設案内に従ってください。自家用車は周辺の有料駐車場を利用します。";
      place.sourceUrl = "https://www.city.hakodate.hokkaido.jp/hakosuku-map/info/2026022400176/";
    }
    if (place.id === "place-14") {
      place.visit = "条件付き";
      place.visitConditions = "館内の見学・撮影は公開時間、休館日、現地の案内に従ってください。";
      place.sourceUrl = "https://joruri-cms.city.hakodate.hokkaido.jp/docs/2014010800251/";
    }
    if (place.id === "place-11") {
      place.visit = "条件付き";
      place.visitConditions = "展望台は混雑時に安全案内が出る場合があります。立入禁止区域や施設案内に従ってください。";
      place.sourceUrl = "https://www.city.hakodate.hokkaido.jp/citizensvoice/docs/2024092000043/";
    }
    if (place.id === "place-24") {
      place.visit = "条件付き";
      place.visitConditions = "海岸の岩場には危険な箇所があります。天候・波の状況と現地表示を確認し、立入禁止区域には入りません。";
      place.sourceUrl = "https://www.town.hachijo.tokyo.jp/kanko-bunka/kanko/hjk-map/hjk-oogagou/";
    }
    if (place.id === "place-26") {
      place.visit = "条件付き";
      place.visitConditions = "展望台・館内の撮影は施設の案内と営業時間に従ってください。作品の再現撮影は、通常の来場者の通行を妨げない範囲で行います。";
      place.sourceUrl = "https://www.locationbox.metro.tokyo.lg.jp/catalog/2307/";
    }
    if (place.id === "place-27") {
      place.visit = "条件付き";
      place.visitConditions = "区役所の窓口・業務の妨げにならないよう、敷地内の撮影可否と立入範囲は現地で確認してください。";
      place.sourceUrl = "https://www.metro.tokyo.lg.jp/tosei/iken-sodan/sodan/ichiran";
    }
    if (place.id === "place-2") {
      place.visit = "外観のみ";
      place.visitConditions = "学校敷地内には立ち入らず、授業・通行・近隣住民の生活を妨げない範囲で見学します。";
      place.sourceUrl = "https://www.pen-kanagawa.ed.jp/kamakura-h/index.html";
    }
    if (place.id === "place-4") {
      place.visit = "条件付き";
      place.visitConditions = "体育館の利用・撮影可否は施設窓口と開催中の行事に従ってください。";
      place.sourceUrl = "https://www.city.hiratsuka.kanagawa.jp/koen/page-c_00811.html";
    }
    if (place.id === "place-6") {
      place.visit = "外観のみ";
      place.visitConditions = "学校敷地内には立ち入らず、見学会など学校が案内する機会以外の撮影は行いません。";
      place.sourceUrl = "https://www.metro.ed.jp/musashinokita-h/our_school/";
    }
    if (place.id === "place-7") {
      place.visit = "外観のみ";
      place.visitConditions = "学校敷地内には立ち入らず、授業・部活動・通行の妨げにならないよう訪問します。";
      place.sourceUrl = "https://nst-h.school/guide/";
    }

    // 「前後」「付近」はおおよその位置を表すメモなので、地図用には数値だけを使う。
    // 元の表記は残して、画面側で概算地点と分かるようにする。
    const approximate = String(place.coordinates || "").match(/^([+-]?\d+(?:\.\d+)?)(?:前後|付近),\s*([+-]?\d+(?:\.\d+)?)(?:前後|付近)$/);
    if (approximate) {
      place.coordinatesOriginal = place.coordinates;
      place.coordinates = `${approximate[1]}, ${approximate[2]}`;
      place.coordinateAccuracy = "approximate";
    }

    // 続編・映画などで題名が変わる青ブタ作品は、作品一覧では1つのシリーズとして扱う。
    if (String(place.work || "").startsWith("青春ブタ野郎")) place.series = "青春ブタ野郎シリーズ";

    // 調査済みの撮影地点だけを紐付ける。座標がないものは地図にピンを出さない。
    const viewpoint = window.shootingViewpoints?.[place.id];
    if (viewpoint) place.shootingViewpoint = viewpoint;
  });

  // 2地点を1件に入れていたため、現在地検索で使える座標をそれぞれ分ける。
  const combinedBeach = (window.places || []).find((place) => place.id === "place-3");
  if (combinedBeach) {
    combinedBeach.name = "鵠沼海岸";
    combinedBeach.coordinates = "35.316999, 139.461308";
    combinedBeach.address = "神奈川県藤沢市鵠沼海岸4丁目付近";
    combinedBeach.nearestStation = "鵠沼海岸駅";
    combinedBeach.scene = "単行本31巻ラストで描かれる海辺の候補地点";

    const tsujidoBeach = {
      ...combinedBeach,
      id: "place-3-tsujido",
      name: "辻堂海岸",
      coordinates: "35.319290, 139.443840",
      address: "神奈川県藤沢市辻堂西海岸付近",
      nearestStation: "辻堂駅",
      scene: "映画での海辺シーンの候補地点",
      locationAudit: undefined
    };
    window.places.push(tsujidoBeach);
  }

  // 桃原西公園と渡具知ビーチも、地図では別地点として扱う。
  const combinedOkinawa = (window.places || []).find((place) => place.id === "place-10");
  if (combinedOkinawa) {
    combinedOkinawa.name = "桃原西公園";
    combinedOkinawa.coordinates = "26.3197, 127.7667";
    combinedOkinawa.address = "沖縄県中頭郡北谷町桃原付近";
    combinedOkinawa.nearestStation = "";
    combinedOkinawa.scene = "作品に登場する海辺・公園の候補地点";
    combinedOkinawa.coordinateAccuracy = "approximate";

    const toguchiBeach = {
      ...combinedOkinawa,
      id: "place-10-toguchi",
      name: "渡具知ビーチ",
      coordinates: "26.36496, 127.73756",
      address: "沖縄県中頭郡読谷村渡具知付近",
      scene: "作品に登場する海辺の候補地点",
      locationAudit: undefined
    };
    window.places.push(toguchiBeach);
  }

  // 第1回の撮影地点調査。候補は公開用の撮影地点座標にせず、根拠を追加調査します。
  const filmingResearch = {
    "place-3": { status: "候補を確認", note: "鵠沼・辻堂の海岸は作品の場面候補として紹介されているが、同一構図の立ち位置は未確定。", sourceUrl: "https://www.mapple.net/original/458597/" },
    "place-8": { status: "候補を確認", note: "神社は映画の場面に似た候補として紹介されている。公式な撮影地点の発表は未確認。", sourceUrl: "https://jpcmap.com/entame/slamdunk/movie" },
    "place-10": { status: "候補を確認", note: "公園・海岸は作品の場面候補として紹介されているが、撮影地点の座標は未確定。", sourceUrl: "https://www.mapple.net/original/458597/" },
    "place-3-tsujido": { status: "候補を確認", note: "海岸の場面候補。撮影地点の正確な立ち位置は未確定。", sourceUrl: "https://www.mapple.net/original/458597/" },
    "place-10-toguchi": { status: "候補を確認", note: "海岸の場面候補。安全な立ち位置と構図を追加で確認する。", sourceUrl: "https://www.mapple.net/original/458597/" }
  };
  ["place-11", "place-12", "place-13", "place-14", "place-15", "place-16", "place-17", "place-18", "place-19"].forEach((id) => {
    filmingResearch[id] = { status: "場所対応を確認", note: "函館を舞台にした作品の場所として紹介されている。作品と同じ構図の立ち位置は未確定。", sourceUrl: "https://www.mapple.net/original/470408/" };
  });
  filmingResearch["place-20"] = { status: "場所対応を確認", note: "作品内で訪れる寺として紹介されている。構図・撮影地点は未確定。", sourceUrl: "https://conan-map.com/spots/00f800" };
  filmingResearch["place-21"] = { status: "場所対応を確認", note: "作品内で訪れる寺として紹介されている。構図・撮影地点は未確定。", sourceUrl: "https://conan-diary.com/%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%80%8C%E8%BF%B7%E5%AE%AE%E3%81%AE%E5%8D%81%E5%AD%97%E8%B7%AF%E3%80%8D%E8%81%96%E5%9C%B0%E5%B7%A1%E7%A4%BC%E3%80%90%E4%BA%AC%E9%83%BD%E5%B8%82%EF%BC%89/" };
  filmingResearch["place-23"] = { status: "場所対応を確認", note: "八丈島の港として紹介されている。撮影地点の正確な立ち位置は未確定。", sourceUrl: "https://wondermu.jp/conan-black-iron-submarine/" };
  filmingResearch["place-24"] = { status: "場所対応を確認", note: "八丈島の海岸として紹介されている。安全な立ち位置と構図は未確定。", sourceUrl: "https://wondermu.jp/conan-black-iron-submarine/" };
  filmingResearch["place-25"] = { status: "構図候補", note: "港の待合所屋上から、作品に近い画角を得られるという紹介がある。施設の利用可否・立入範囲は現地で確認が必要。", sourceUrl: "https://wondermu.jp/conan-black-iron-submarine/" };
  filmingResearch["place-28"] = { status: "場所対応を確認", note: "渋谷の風景として作品に登場する。交差点・歩道からの見学にとどめ、車道へ入らない。", sourceUrl: "https://www.mapple.net/original/517990/" };
  filmingResearch["place-31"] = { status: "構図候補", note: "建物の屋上は通常入れないため、外観見学または公開展望施設からの景観確認が候補。", sourceUrl: "https://www.mapple.net/original/517990/" };
  filmingResearch["place-61"] = { status: "場所対応を確認", note: "作品内の神社のモデルとして紹介されている。参拝者を優先し、境内の撮影可否は現地で確認する。", sourceUrl: "https://musubi10.com/aonohako-seichi/" };
  filmingResearch["place-62"] = { status: "場所対応を確認", note: "オープニングの駅ホームの候補として紹介されている。ホームでは安全線の内側に入り、鉄道利用者を妨げない。", sourceUrl: "https://musubi10.com/aonohako-seichi/" };
  filmingResearch["place-69"] = { status: "場所対応を確認", note: "第4話に登場する体育館として紹介されている。屋内利用・撮影は施設の案内に従う。", sourceUrl: "https://screenpilgrimage.com/ja/title/blue-box/" };
  filmingResearch["place-70"] = { status: "場所対応を確認", note: "作品に登場する駅として紹介されている。通行・鉄道利用者を優先する。", sourceUrl: "https://screenpilgrimage.com/ja/title/blue-box/" };
  filmingResearch["place-78"] = { status: "場所対応を確認", note: "第8話に登場する体育館として紹介されている。屋内利用・撮影は施設の案内に従う。", sourceUrl: "https://screenpilgrimage.com/ja/title/blue-box/" };
  // アオのハコは話数と実在地点の対応一覧を一括照合。各地点の撮影構図は個別確認を継続する。
  (window.places || []).filter((place) => place.work === "アオのハコ").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "話数と実在地点の対応一覧で確認。構図・安全な立ち位置・施設内の撮影可否は個別に確認する。",
        sourceUrl: "https://www.animepilgrimage.com/ja/maps/anime/9ZIN8PmoDf4FEvUSDUQB/blue-box"
      };
    }
  });
  // SLAM DUNKも、登録済みの全地点を作品との対応一覧で照合する。
  (window.places || []).filter((place) => place.work === "SLAM DUNK").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "作品・映画の舞台として紹介されている。構図と安全な立ち位置は個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.mapple.net/original/458597/"
      };
    }
  });
  // 名探偵コナンも、作品別の巡礼資料で登録地点を一括照合する。
  (window.places || []).filter((place) => place.work === "名探偵コナン").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "作品の舞台として登録地点を照合。構図・安全な立ち位置・施設内の撮影可否は個別に確認する。",
        sourceUrl: "https://conan-map.com/"
      };
    }
  });
  // 超かぐや姫！は立川周辺を中心とした舞台一覧でまとめて照合する。
  (window.places || []).filter((place) => place.work === "超かぐや姫！").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "立川周辺を中心とする舞台・ロケ地の一覧で確認。商業施設・駅・学校・私有地は現地の撮影可否を確認してから撮影地点として公開する。",
        sourceUrl: "https://libert.co.jp/pilgrimage-guild/cosmicprincesskaguya-anime-pilgrimage/"
      };
    }
  });
  // ハナヤマタは鎌倉・江ノ電沿線の舞台探訪資料でまとめて照合する。
  (window.places || []).filter((place) => place.work === "ハナヤマタ").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "鎌倉・江ノ電沿線の舞台として照合。学校・神社・駅・住宅地では、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://anime-tourism.jp/t/225//"
      };
    }
  });
  // たまゆらは竹原市・観光協会が公開する公式巡礼マップでまとめて照合する。
  (window.places || []).filter((place) => place.work === "たまゆら").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "竹原市・観光協会の公式巡礼マップで照合。保存地区・寺社・店舗・港では、撮影可否と通行を優先して確認する。",
        sourceUrl: "https://www.takeharakankou.jp/pamphlet-cat/map/"
      };
    }
  });
  // 正反対な君と僕は、話数別の舞台一覧で地点対応をまとめて照合する。
  (window.places || []).filter((place) => place.work === "正反対な君と僕").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "話数別の舞台一覧で照合。学校・住宅地・交通機関・店舗では、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://screenpilgrimage.com/ja/title/seihantai/"
      };
    }
  });
  // Wake Up, Girls！は仙台を中心とした舞台探訪マップでまとめて照合する。
  (window.places || []).filter((place) => place.work === "Wake Up, Girls！").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "仙台を中心とする舞台探訪マップで照合。駅・商店街・施設では、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://anime-tourism.jp//t/116/"
      };
    }
  });
  // あの花は秩父市の公式舞台探訪マップで登録地点をまとめて照合する。
  (window.places || []).filter((place) => place.work === "あの日見た花の名前を僕達はまだ知らない。").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "秩父市の舞台探訪マップで照合。住宅地・寺社・学校・河川周辺では、構図と安全な立ち位置、撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://navi.city.chichibu.lg.jp/wp/wp-content/uploads/2023/04/a233d27fa3f3eb320c5924e8e6443496.pdf"
      };
    }
  });
  // 花咲くいろはは金沢市の観光公式情報で、湯涌温泉を中心とする登録地点を照合する。
  (window.places || []).filter((place) => place.work === "花咲くいろは").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "金沢市の観光公式情報で、湯涌温泉を中心とする舞台を照合。温泉街・寺社・橋・店舗・道路では、構図と安全な立ち位置、撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.kanazawa-kankoukyoukai.or.jp/article/detail_629.html"
      };
    }
  });
  // いなり、こんこん、恋いろは。は京都市が配布した探訪マップを根拠に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "いなり、こんこん、恋いろは。").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "京都市の探訪マップで、伏見稲荷を中心とする作品内の実在する建物・街並みを照合。神社境内・駅・住宅地では、混雑や立入範囲を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.value-press.com/pressrelease/123844"
      };
    }
  });
  // ガールズバンドクライは川崎市観光協会のスタンプツアー案内を根拠に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "ガールズバンドクライ").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "川崎市が舞台であることと、劇中に登場する川崎駅周辺の施設を観光協会の案内で照合。駅・商業施設・店舗・道路では、営業や通行を妨げない構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.k-kankou.jp/event/detail.html?CN=418431"
      };
    }
  });
  // 青春ブタ野郎シリーズは藤沢市観光協会の公式スタンプラリーを基準に、シリーズ全体の登録地点を照合する。
  (window.places || []).filter((place) => place.work.startsWith("青春ブタ野郎")).forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "藤沢市内の街並みと一部鎌倉市を舞台とするシリーズの公式スタンプラリーを基準に照合。駅・海岸・学校・商業施設・住宅地では、話数に対応する構図と安全な立ち位置、撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.fujisawa-kanko.jp/event/aobutafujisawa202608.html"
      };
    }
  });
  // 呪術廻戦は話数・地域をまたぐ舞台一覧を基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "呪術廻戦").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "話数付きの舞台一覧と照合。駅・商店街・交差点・商業施設が中心のため、通行を妨げない安全な立ち位置と、同じ構図になる撮影地点を個別に確認してから公開する。",
        sourceUrl: "https://www.animepilgrimage.com/ja/maps/anime/0krqHxVPwJzgjw4B5AJN/jujutsu-kaisen-1"
      };
    }
  });
  // 呪術廻戦は公式「渋谷事変マップ」に明記された渋谷の地点から照合を進める。
  const jujutsuShibuyaIds = new Set(["place-123", "place-124", "place-125", "place-126", "place-127", "place-128", "place-129"]);
  (window.places || []).filter((place) => jujutsuShibuyaIds.has(place.id)).forEach((place) => {
    filmingResearch[place.id] = {
      status: "場所対応を確認",
      note: "TVアニメ公式の「渋谷事変マップ」に掲載された地点として照合。駅・歩道橋・商業施設では、通行を妨げない立ち位置と、施設内の撮影可否を個別に確認してから撮影地点として公開する。",
      sourceUrl: "https://jujutsukaisen.jp/shibuyaincidentnow/timetable.php"
    };
  });
  // ふらいんぐうぃっちは弘前観光コンベンション協会の舞台めぐりマップで登録地点を照合する。
  (window.places || []).filter((place) => place.work === "ふらいんぐうぃっち").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "弘前の公式舞台めぐりマップで照合。公園・庭園・神社・農地・生活道路では、開園時間や私有地・農作業への配慮を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.hirosaki-kanko.or.jp/userfiles/file/UNIQ_c9b2c5854ebc9c18a877033d13cddcbb.pdf"
      };
    }
  });
  // 負けヒロインが多すぎる！はTVアニメ公式の聖地巡礼マップを基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "負けヒロインが多すぎる！").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "TVアニメ公式の豊橋駅エリア・豊橋市周辺エリアの聖地巡礼マップを基準に照合。駅・書店・飲食店・図書館・海岸・神社では、営業時間や参拝・通行の妨げにならない立ち位置を確認してから撮影地点として公開する。",
        sourceUrl: "https://makeine-anime.com/special/map/"
      };
    }
  });
  // 南鎌倉高校女子自転車部は公式の鎌倉市内聖地巡礼企画を基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "南鎌倉高校女子自転車部").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "鎌倉市内で実施された公式の聖地巡礼企画を基準に照合。自転車で通行する道路、駅、海岸、寺社では、歩行者・車両・参拝者の安全を優先し、停車位置と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://minakama-anime.jp/news/"
      };
    }
  });
  // 凪のあすからは熊野市観光協会の公式案内・聖地マップを基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "凪のあすから").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "熊野市で配布される公式聖地マップを基準に照合。海岸・無人駅・集落・熊野古道周辺では、天候・列車運行・私有地・自然環境への配慮を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.kumano-kankou.info/%E5%87%AA%E3%81%AE%E3%81%82%E3%81%99%E3%81%8B%E3%82%89-%E7%86%8A%E9%87%8E%E5%B8%82/%E5%87%AA%E3%81%AE%E3%81%82%E3%81%99%E3%81%8B%E3%82%89-%E7%86%8A%E9%87%8E%E5%B8%822026/%E5%87%AA%E3%81%AE%E3%81%82%E3%81%99%E3%81%8B%E3%82%89-%E7%86%8A%E9%87%8E%E5%B8%82/"
      };
    }
  });
  // 君の名は。は話数付きロケ地マップで全登録地点を照合し、飛騨古川の地点は市公式案内で補強する。
  (window.places || []).filter((place) => place.work === "君の名は。").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "ロケ地マップで照合。駅・図書館・神社・展望公園・階段・商業施設では、開館時間、参拝、通行を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.animepilgrimage.com/ja/maps/anime/dmrJFiEnWhEOYhhISwFi/your-name"
      };
    }
  });
  const yourNameHidaIds = new Set(["place-95", "place-96", "place-97", "place-98", "place-99", "place-100", "place-101"]);
  (window.places || []).filter((place) => yourNameHidaIds.has(place.id)).forEach((place) => {
    filmingResearch[place.id] = {
      status: "場所対応を確認",
      note: "飛騨市公式のモデル地を巡る案内で照合。駅構内・図書館・神社・店舗では、営業時間・利用者・参拝者を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
      sourceUrl: "https://www.hida-kankou.jp/courses/73"
    };
  });
  // 有頂天家族は公式の京都探訪マップを基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "有頂天家族").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "公式の京都探訪マップで、出町柳や四条を中心とする実在の建物・街並みを照合。寺社・商店街・河川敷・飲食店では、参拝者・通行・営業を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://uchoten-anime.com/news/archives/772/"
      };
    }
  });
  // ATRI -My Dear Moments- は銚子市の公式聖地巡礼案内を基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "ATRI -My Dear Moments-").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "銚子市の公式聖地巡礼案内を基準に照合。鉄道施設・灯台・展望施設・神社・学校周辺では、営業時間、立入範囲、通学・参拝を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.city.choshi.chiba.jp/content/000048061.pdf"
      };
    }
  });
  // 暗殺教室は話数付きの聖地巡礼マップを基準に、八王子と京都の登録地点を照合する。
  (window.places || []).filter((place) => place.work === "暗殺教室").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "八王子駅周辺と京都の修学旅行編を含む聖地巡礼マップで照合。駅・寺社・坂道・橋・映画村では、参拝・通行・施設の営業を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://anime-tourism.jp//t/366/"
      };
    }
  });
  // ぐらんぶるは話数付きロケ地マップで、伊東市川奈と宮古島の登録地点を照合する。
  (window.places || []).filter((place) => place.work === "ぐらんぶる").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "伊東市川奈と宮古島の話数付きロケ地マップで照合。駅・港・防波堤・ダイビング施設・海岸・空港周辺では、海況、立入範囲、営業、安全を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.animepilgrimage.com/ja/maps/anime/ioOXlHX29aVhPwnrSHCM/grand-blue-dreaming"
      };
    }
  });
  // 東京リベンジャーズは話数付きロケ地マップを基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "東京リベンジャーズ").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "話数付きロケ地マップで照合。駅・歩道橋・商業施設・公園・神社・海岸周辺では、通行、参拝、営業を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.animepilgrimage.com/ja/maps/anime/0eav7fRw7FpJyEOwfQKl/tokyo-revengers"
      };
    }
  });
  // タコピーの原罪は話数付きロケ地マップを基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "タコピーの原罪").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "話数付きロケ地マップで、道南・青森・東京・舞浜の登録地点を照合。駅・フェリーターミナル・公園・商店・歩道橋・テーマパーク周辺では、通行、営業、施設規約を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.animepilgrimage.com/ja/maps/anime/xfD3SAgNnScPXtkyEpGo/takopis-original-sin"
      };
    }
  });
  // 色づく世界の明日からは長崎市公式のスポットめぐりを基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "色づく世界の明日から").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "長崎市公式のスポットめぐりで照合。坂道・公園・橋・展望台・学校周辺では、歩行者・近隣住民・生徒を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.at-nagasaki.jp/course/iroduku"
      };
    }
  });
  // ゆるキャン△は山梨県公式のモデル地マップを基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "ゆるキャン△").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "山梨県公式のモデル地マップで照合。キャンプ場・湖畔・展望地・山道・商店では、予約、天候、火気、駐車、自然環境への配慮を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.yamanashi-kankou.jp.id200959.cas.iijcdn.jp/special/sp_yurucamp_map/index.html"
      };
    }
  });
  // 天気の子は話数付きロケ地マップを基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "天気の子").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "話数付きロケ地マップで照合。駅・坂道・神社・商業施設・公園・屋上周辺では、公式の訪問時のお願いと施設ルールを優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.animepilgrimage.com/ja/maps/anime/NpEZnChVAaNhV5wOpnTr/weathering-with-you"
      };
    }
  });
  // ラブライブ！サンシャイン!!は沼津市公式のロケ地巡り案内を基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "ラブライブ！サンシャイン!!").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "沼津市公式のロケ地巡り案内で照合。駅・港・海岸・学校・水族館・寺社・商店では、通行、営業、海況、参拝を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://numazukanko.jp/course/50030"
      };
    }
  });
  // 四畳半神話大系は京都の聖地巡礼マップを基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "四畳半神話大系").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "京都市内の聖地巡礼マップで照合。大学・学生寮・寺社・商店街・橋・交差点では、大学利用者・参拝者・通行・営業を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://anime-tourism.jp//t/24/"
      };
    }
  });
  // グラスリップは坂井市の舞台モデル紹介を基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "グラスリップ").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "坂井市三国町の舞台モデル紹介で照合。駅・海岸・橋・神社・博物館・住宅地周辺では、海況、参拝、通行、開館時間を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://prtimes.jp/main/html/rd/p/000000073.000081038.html"
      };
    }
  });
  // けいおん！は話数付きロケ地マップで京都・豊郷の登録地点を照合する。
  (window.places || []).filter((place) => place.work === "けいおん！").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "話数付きロケ地マップで豊郷・京都の登録地点を照合。旧校舎・駅・寺社・公園・橋・店舗では、公開時間、参拝、通行、営業を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.animepilgrimage.com/ja/maps/anime/nDcjBFyJt97tX0kT9a3i/k-on"
      };
    }
  });
  // 豊郷小学校旧校舎群は滋賀県公式観光サイトの案内でもモデル地として確認する。
  if (filmingResearch["place-322"]) {
    filmingResearch["place-322"] = {
      ...filmingResearch["place-322"],
      note: "滋賀県公式観光サイトで『けいおん！』の舞台モデルとして案内される豊郷小学校旧校舎群。見学時間と現地の案内に従い、校舎内外の構図と撮影可否を個別に確認してから撮影地点として公開する。",
      sourceUrl: "https://ja.biwako-visitors.jp/spot/detail/228"
    };
  }
  // ラブライブ！は秋葉原・神田の登録地点を地図資料で照合する。
  (window.places || []).filter((place) => place.work === "ラブライブ！").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "秋葉原・神田のロケ地資料で登録地点を照合。神社・参道・駅・橋・商業施設・飲食店では、参拝、通行、営業時間、店舗ルールを優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://animemap.seikas.com/ja/series/lovelive/"
      };
    }
  });
  // 神田明神は東京都公式観光サイトでも作品の聖地として案内される。
  ["place-354", "place-543"].forEach((id) => {
    if (filmingResearch[id]) {
      filmingResearch[id] = {
        ...filmingResearch[id],
        note: "東京都公式観光サイトで『ラブライブ！』の聖地として案内される神田明神。参拝者を優先し、境内・参道の案内と撮影ルールに従って、構図と撮影可否を確認してから撮影地点として公開する。",
        sourceUrl: "https://www.gotokyo.org/jp/spot/1771/index.html"
      };
    }
  });
  // ヤマノススメは飯能市の舞台探訪マップを基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "ヤマノススメ").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "飯能市の舞台探訪マップで登録地点を照合。駅・公園・寺院・商店街・河原・橋では、通行、参拝、増水、営業時間を優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://hanno-tourism.jp/news/%E3%80%8E%E3%83%A4%E3%83%9E%E3%83%8E%E3%82%B9%E3%82%B9%E3%83%A1next-summit%E3%80%8F%E9%A3%AF%E8%83%BD%E8%88%9E%E5%8F%B0%E6%8E%A2%E8%A8%AA%E3%83%9E%E3%83%83%E3%83%97%E9%85%8D%E5%B8%83%E4%B8%AD%E3%81%A7"
      };
    }
  });
  // 天覧山は登山口・山頂ともに天候と登山道の安全確認を明記する。
  ["place-482", "place-483"].forEach((id) => {
    if (filmingResearch[id]) {
      filmingResearch[id] = {
        ...filmingResearch[id],
        note: "飯能市の舞台探訪マップで案内される天覧山周辺。登山道の通行状況、天候、日没時刻を確認し、歩行者を優先して構図と撮影可否を確認してから撮影地点として公開する。"
      };
    }
  });
  // たまこまーけっとは話数付きロケ地マップで京都の登録地点を照合する。
  (window.places || []).filter((place) => place.work === "たまこまーけっと").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "話数付きロケ地マップで京都市内の登録地点を照合。商店街・店舗・駅・橋・河川敷・文化施設・公園では、通行、営業時間、増水、施設ルールを優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://www.animepilgrimage.com/ja/maps/series/Tn6d64DaKDY4PyE6ELxg/tamako-market"
      };
    }
  });
  // 出町桝形商店街は商店街自身が作品の舞台と案内している。
  if (filmingResearch["place-488"]) {
    filmingResearch["place-488"] = {
      ...filmingResearch["place-488"],
      note: "出町桝形商店街は商店街自身が『たまこまーけっと』の舞台と案内する生活商店街。買い物客・営業中の店舗を優先し、通行を妨げない範囲で構図と撮影可否を確認してから撮影地点として公開する。",
      sourceUrl: "https://masugata.demachi.jp/"
    };
  }
  // Free! は岩美町と作品公式が案内するロケ参考地マップを基準に登録地点を照合する。
  (window.places || []).filter((place) => place.work === "Free!").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "岩美町と作品公式が案内するロケ参考地マップで照合。駅・神社・展望台・漁港・隧道・砂丘では、参拝、通行、海況、天候、駐車、現地の撮影ルールを優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://fs.iwatobi-sc.com/special/iwami/"
      };
    }
  });
  // ケロロ軍曹は西東京・都心のロケ地マップで登録地点を照合する。
  (window.places || []).filter((place) => place.work === "ケロロ軍曹").forEach((place) => {
    if (!filmingResearch[place.id]) {
      filmingResearch[place.id] = {
        status: "場所対応を確認",
        note: "西東京・新宿・銀座のロケ地マップで登録地点を照合。神社・駅・商業施設・公園・劇場・展望施設では、参拝、通行、営業、施設ルールを優先し、構図と撮影可否を個別に確認してから撮影地点として公開する。",
        sourceUrl: "https://screenpilgrimage.com/ja/title/keroro/"
      };
    }
  });
  // 田無神社は公式コラボが実施された地点として確認する。
  if (filmingResearch["place-1214"]) {
    filmingResearch["place-1214"] = {
      ...filmingResearch["place-1214"],
      note: "田無神社は『ケロロ軍曹』との公式コラボを実施した地点。参拝者を優先し、境内の案内と撮影ルールに従って、構図と撮影可否を確認してから撮影地点として公開する。",
      sourceUrl: "https://www.tanashijinja.or.jp/info/info/10547.html"
    };
  }
  (window.places || []).forEach((place) => { if (filmingResearch[place.id]) place.filmingResearch = filmingResearch[place.id]; });
})();
