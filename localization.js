/* Shared Japanese / English display names. English anime names use established international release titles where available. */
(() => {
  const works = {
    "名探偵コナン":"Detective Conan", "超かぐや姫！":"Cosmic Princess Kaguya!", "アオのハコ":"Blue Box", "君の名は。":"Your Name.", "呪術廻戦":"Jujutsu Kaisen", "ぼっち・ざ・ろっく！":"BOCCHI THE ROCK!", "青春ブタ野郎はバニーガール先輩の夢を見ない":"Rascal Does Not Dream of Bunny Girl Senpai", "青春ブタ野郎はゆめみる少女の夢を見ない":"Rascal Does Not Dream of a Dreaming Girl", "青春ブタ野郎はおでかけシスターの夢を見ない":"Rascal Does Not Dream of a Sister Venturing Out", "青春ブタ野郎はランドセルガールの夢を見ない":"Rascal Does Not Dream of a Knapsack Kid", "青春ブタ野郎はサンタクロースの夢を見ない":"Rascal Does Not Dream of Santa Claus", "青春ブタ野郎シリーズ":"Rascal Does Not Dream series",
    "ゆるキャン△":"Laid-Back Camp", "色づく世界の明日から":"Iroduku: The World in Colors", "けいおん！":"K-ON!", "暗殺教室":"Assassination Classroom", "天気の子":"Weathering With You", "ラブライブ！":"Love Live!", "秒速5センチメートル":"5 Centimeters per Second", "宇宙よりも遠い場所":"A Place Further than the Universe", "その着せ替え人形は恋をする":"My Dress-Up Darling", "あの日見た花の名前を僕達はまだ知らない。":"anohana: The Flower We Saw That Day", "四月は君の嘘":"Your Lie in April", "新世紀エヴァンゲリオン":"Neon Genesis Evangelion", "ガールズ＆パンツァー":"Girls und Panzer", "らき☆すた":"Lucky Star", "氷菓":"Hyouka", "花咲くいろは":"Hanasaku Iroha", "響け！ユーフォニアム":"Sound! Euphonium", "ハイキュー!!":"Haikyu!!", "文豪ストレイドッグス":"Bungo Stray Dogs", "デジモンアドベンチャー":"Digimon Adventure", "月がきれい":"Tsuki ga Kirei", "心が叫びたがってるんだ。":"The Anthem of the Heart", "空の青さを知る人よ":"Her Blue Sky", "サマーウォーズ":"Summer Wars", "おおかみこどもの雨と雪":"Wolf Children", "スーパーカブ":"Super Cub", "君は放課後インソムニア":"Insomniacs After School", "ゾンビランドサガ":"ZOMBIE LAND SAGA", "夏目友人帳":"Natsume's Book of Friends", "からかい上手の高木さん":"Teasing Master Takagi-san", "ラブライブ！サンシャイン!!":"Love Live! Sunshine!!", "ヤマノススメ":"Encouragement of Climb", "たまこまーけっと":"Tamako Market", "小林さんちのメイドラゴン":"Miss Kobayashi's Dragon Maid", "境界の彼方":"Beyond the Boundary", "有頂天家族":"The Eccentric Family", "四畳半神話大系":"The Tatami Galaxy", "アイドルマスター シンデレラガールズ":"THE IDOLM@STER CINDERELLA GIRLS", "ソードアート・オンライン":"Sword Art Online", "ワンパンマン":"One-Punch Man", "推しの子":"Oshi no Ko", "魔法少女まどか☆マギカ":"Puella Magi Madoka Magica", "星空へ架かる橋":"A Bridge to the Starry Skies", "ご注文はうさぎですか？":"Is the Order a Rabbit?", "中二病でも恋がしたい！":"Love, Chunibyo & Other Delusions!", "君と僕。":"Kimi to Boku.", "恋する小惑星":"Asteroid in Love", "プラスティック・メモリーズ":"Plastic Memories", "サクラクエスト":"Sakura Quest", "世界征服〜謀略のズヴィズダー〜":"World Conquest Zvezda Plot", "のんのんびより":"Non Non Biyori", "一週間フレンズ。":"One Week Friends", "僕だけがいない街":"ERASED", "ひそねとまそたん":"Dragon Pilot: Hisone and Masotan", "約束のネバーランド":"The Promised Neverland", "七つの大罪":"The Seven Deadly Sins", "ハイスコアガール":"Hi Score Girl", "風夏":"Fuuka", "大家さんは思春期！":"Ooya-san wa Shishunki!", "寄宿学校のジュリエット":"Boarding School Juliet", "ステラのまほう":"Magic of Stella", "ガヴリールドロップアウト":"Gabriel DropOut", "映像研には手を出すな！":"Keep Your Hands Off Eizouken!", "うちのメイドがウザすぎる！":"UzaMaid!", "デュラララ!!":"Durarara!!", "やはり俺の青春ラブコメはまちがっている。":"My Teen Romantic Comedy SNAFU", "たまゆら":"Tamayura", "サマータイムレンダ":"Summer Time Rendering", "放課後ていぼう日誌":"Diary of Our Days at the Breakwater", "やくならマグカップも":"Let's Make a Mug Too", "理系が恋に落ちたので証明してみた。":"Science Fell in Love, So I Tried to Prove It", "スキップとローファー":"Skip and Loafer", "オッドタクシー":"ODDTAXI", "ラブライブ！虹ヶ咲学園スクールアイドル同好会":"Love Live! Nijigasaki High School Idol Club", "イジらないで、長瀞さん":"Don't Toy with Me, Miss Nagatoro", "古見さんは、コミュ症です。":"Komi Can't Communicate", "女子高生の無駄づかい":"Wasteful Days of High School Girls", "ラーメン大好き小泉さん":"Ms. Koizumi Loves Ramen Noodles", "邪神ちゃんドロップキック":"Dropkick on My Devil!", "私に天使が舞い降りた！":"Wataten!: An Angel Flew Down to Me", "三ツ星カラーズ":"Mitsuboshi Colors", "スロウスタート":"Slow Start", "ふらいんぐうぃっち":"Flying Witch", "かぐや様は告らせたい〜天才たちの恋愛頭脳戦〜":"Kaguya-sama: Love Is War", "五等分の花嫁":"The Quintessential Quintuplets", "僕の心のヤバイやつ":"The Dangers in My Heart", "彼女、お借りします":"Rent-a-Girlfriend", "トニカクカワイイ":"TONIKAWA: Over The Moon For You", "恋は世界征服のあとで":"Love After World Domination", "夫婦以上、恋人未満。":"More than a Married Couple, but Not Lovers.", "阿波連さんははかれない":"Aharen-san wa Hakarenai", "お隣の天使様にいつの間にか駄目人間にされていた件":"The Angel Next Door Spoils Me Rotten", "経験済みなキミと、付き合うことになった話。":"Our Dating Story", "魔王城でおやすみ":"Sleepy Princess in the Demon Castle", "白聖女と黒牧師":"Saint Cecilia and Pastor Lawrence", "凪のあすから":"Nagi-Asu: A Lull in the Sea", "グラスリップ":"Glasslip", "いなり、こんこん、恋いろは。":"Inari Konkon Koi Iroha", "南鎌倉高校女子自転車部":"Minami Kamakura High School Girls Cycling Club", "ハナヤマタ":"Hanayamata", "負けヒロインが多すぎる！":"Makeine: Too Many Losing Heroines!", "ガールズバンドクライ":"Girls Band Cry", "逃げ上手の若君":"The Elusive Samurai", "ぐらんぶる":"Grand Blue Dreaming", "正反対な君と僕":"You and I Are Polar Opposites", "君のことが大大大大大好きな100人の彼女":"The 100 Girlfriends Who Really, Really, Really, Really, Really Love You", "ヤニねこ":"Yanineko", "東京リベンジャーズ":"Tokyo Revengers", "氷の城壁":"The Ramparts of Ice", "わたしの幸せな結婚":"My Happy Marriage", "タコピーの原罪":"Takopi's Original Sin", "どこよりも遠い場所にいる君へ":"To You in the Beyond", "ケロロ軍曹":"Sgt. Frog", "クレヨンしんちゃん":"Crayon Shin-chan",
    "ATRI -My Dear Moments-":"ATRI -My Dear Moments-", "CLANNAD":"CLANNAD", "Do It Yourself!! -どぅー・いっと・ゆあせるふ-":"Do It Yourself!!", "Fate/Grand Order":"Fate/Grand Order", "Free!":"Free!", "Just Because!":"Just Because!", "K":"K", "NEW GAME!":"NEW GAME!", "PING PONG（ピンポン THE ANIMATION）":"PING PONG THE ANIMATION", "SHIROBAKO":"SHIROBAKO", "SLAM DUNK":"SLAM DUNK", "STEINS;GATE":"STEINS;GATE", "TARI TARI":"TARI TARI", "Wake Up, Girls！":"Wake Up, Girls!", "ガールズ＆パンツァー（該当なし・サクラクエスト）":"Girls und Panzer", "セスタス -The Roman Fighter-":"Cestvs: The Roman Fighter", "プラスティック・メモリーズ（該当なし・花咲くいろは）":"Plastic Memories", "ユーリ!!! on ICE":"Yuri!!! on ICE"
  };
  Object.assign(works, {
    "ATRI -My Dear Moments-":"ATRI -My Dear Moments-", "CLANNAD":"CLANNAD", "Do It Yourself!! -どぅー・いっと・ゆあせるふ-":"Do It Yourself!!", "Fate/Grand Order":"Fate/Grand Order", "Free!":"Free!", "Just Because!":"Just Because!", "K":"K", "NEW GAME!":"NEW GAME!", "PING PONG（ピンポン THE ANIMATION）":"PING PONG THE ANIMATION", "SHIROBAKO":"SHIROBAKO", "SLAM DUNK":"SLAM DUNK", "STEINS;GATE":"STEINS;GATE", "TARI TARI":"TARI TARI", "Wake Up, Girls！":"Wake Up, Girls!", "ガールズ＆パンツァー（該当なし・サクラクエスト）":"Girls und Panzer", "セスタス -The Roman Fighter-":"Cestvs: The Roman Fighter", "プラスティック・メモリーズ（該当なし・花咲くいろは）":"Plastic Memories", "ユーリ!!! on ICE":"Yuri!!! on ICE"
  });
  const prefectures = {"北海道":"Hokkaido","青森県":"Aomori","岩手県":"Iwate","宮城県":"Miyagi","秋田県":"Akita","山形県":"Yamagata","福島県":"Fukushima","茨城県":"Ibaraki","栃木県":"Tochigi","群馬県":"Gunma","埼玉県":"Saitama","千葉県":"Chiba","東京都":"Tokyo","神奈川県":"Kanagawa","新潟県":"Niigata","富山県":"Toyama","石川県":"Ishikawa","福井県":"Fukui","山梨県":"Yamanashi","長野県":"Nagano","岐阜県":"Gifu","静岡県":"Shizuoka","愛知県":"Aichi","三重県":"Mie","滋賀県":"Shiga","京都府":"Kyoto","大阪府":"Osaka","兵庫県":"Hyogo","奈良県":"Nara","和歌山県":"Wakayama","鳥取県":"Tottori","島根県":"Shimane","岡山県":"Okayama","広島県":"Hiroshima","山口県":"Yamaguchi","徳島県":"Tokushima","香川県":"Kagawa","愛媛県":"Ehime","高知県":"Kochi","福岡県":"Fukuoka","佐賀県":"Saga","長崎県":"Nagasaki","熊本県":"Kumamoto","大分県":"Oita","宮崎県":"Miyazaki","鹿児島県":"Kagoshima","沖縄県":"Okinawa"};
  const translatedLocationValue = (field, value) => window.animeSeichiLocationEnglish?.[field]?.[value];
  const visit = {"自由訪問可能":"Open to visitors","条件付き":"Conditional access","外観のみ":"Exterior only","未登録":"Not recorded"};
  const categories = {"聖地スポット":"Sacred-site location","ユーザー申請":"Community submission"};
  const placeNames = {
    "江ノ島電鉄「鎌倉高校前1号踏切」":"Enoshima Electric Railway: Kamakura-kōkō-mae No. 1 Railroad Crossing",
    "神奈川県立鎌倉高等学校":"Kanagawa Prefectural Kamakura High School",
    "鵠沼海岸 / 辻堂海岸":"Kugenuma Beach / Tsujido Beach",
    "トッケイセキュリティ平塚総合体育館":"Tokkei Security Hiratsuka General Gymnasium",
    "秋葉台文化体育館":"Akibadai Cultural Gymnasium",
    "東京都立武蔵野北高等学校":"Tokyo Metropolitan Musashino Kita High School",
    "能代科学技術高校（旧・能代工業高校）":"Noshiro Science and Technology High School (formerly Noshiro Technical High School)",
    "森子大物忌（もりこおおものいみ）神社":"Moriko Omonomi Shrine",
    "広島経済大学 石田記念体育館":"Hiroshima University of Economics, Ishida Memorial Gymnasium",
    "桃原西公園 / 渡具知ビーチ":"Tōbaru-nishi Park / Toguchi Beach"
  };
  const translatedPlaceName = (place) => {
    const translated = window.animeSeichiPlaceEnglishById?.[place.id];
    return typeof translated === "string" ? translated : translated?.name;
  };
  const translatedPlaceField = (place, field) => {
    const source = place?.[field];
    const translated = window.animeSeichiLocationEnglish?.[field]?.[source];
    return typeof translated === "string" ? translated : undefined;
  };
  const cities = {"鎌倉市":"Kamakura","藤沢市":"Fujisawa","平塚市":"Hiratsuka","武蔵野市":"Musashino","能代市":"Noshiro","由利本荘市":"Yurihonjō","広島市":"Hiroshima","北谷町":"Chatan","読谷村":"Yomitan"};
  const scenes = {
    "アニメ初期OPで桜木花道が電車を待つシーン":"Opening sequence: Hanamichi Sakuragi waits for a train.",
    "陵南高校のモデル":"The model for Ryonan High School.",
    "単行本31巻ラスト / 映画での海辺シーン":"The final scene of manga volume 31 / seaside scenes in the film.",
    "単行本31巻ラストで描かれる海辺の候補地点":"Candidate beach location depicted at the end of manga volume 31.",
    "映画での海辺シーンの候補地点":"Candidate location for the beach scene in the film.",
    "作品に登場する海辺・公園の候補地点":"Candidate beach and park locations featured in the work.",
    "作品に登場する海辺の候補地点":"Candidate beach location featured in the work.",
    "IH県予選「湘北 vs 陵南」":"Inter-high prefectural preliminaries: Shohoku vs. Ryonan.",
    "IH県予選「湘北 vs 海南大附属」":"Inter-high prefectural preliminaries: Shohoku vs. Kainan.",
    "湘北高校の校舎・校門のモデル":"The model for Shohoku High School's building and entrance.",
    "山王工業高校のモデル":"The model for Sannoh Industry Affiliated High School.",
    "映画『THE FIRST』沢北栄治の参拝シーン山王のエース沢北が「":"A shrine visit by Eiji Sawakita in THE FIRST SLAM DUNK.",
    "インターハイ「湘北 vs 山王工業」の舞台":"The setting for Shohoku vs. Sannoh Industry in the inter-high tournament.",
    "映画『THE FIRST』リョータの幼少期・秘密基地":"Ryota's childhood hideout in THE FIRST SLAM DUNK."
  };
  const placeDetails = {
    "place-1": {address:"Kanagawa, Kamakura, Koshigoe 1-chome"},
    "place-2": {address:"Kanagawa, Kamakura, Shichirigahama 2-21-1"},
    "place-3": {address:"Kanagawa, Fujisawa, Kugenuma Kaigan 4-chome"},
    "place-4": {address:"Kanagawa, Hiratsuka, Ohara 1-1"},
    "place-5": {address:"Kanagawa, Fujisawa, Endo 2000-1"},
    "place-6": {address:"Tokyo, Musashino, Yahatacho 2-3-10"},
    "place-7": {address:"Akita, Noshiro, Hannyamachi 3-1"},
    "place-8": {address:"Akita, Yurihonjo, Moriko, Yaotome-shita 99-1"},
    "place-9": {address:"Hiroshima, Hiroshima, Asaminami-ku Gion 5-37-1"},
    "place-10": {address:"Okinawa, Chatan, Tōbaru"}
  };
  const credits = {
    "TVアニメ公式サイト":"Official TV anime website",
    "TVアニメ『ぐらんぶる』公式サイト":"Grand Blue Dreaming TV Anime Official Website",
    "Wikimedia Commons · そらみみ · CC BY-SA 4.0":"Wikimedia Commons · Soramimi · CC BY-SA 4.0",
    "Wikimedia Commons · くろふね · CC BY-SA 4.0":"Wikimedia Commons · Kurofune · CC BY-SA 4.0",
    "Wikimedia Commons · 特急東海 · CC0":"Wikimedia Commons · Tokkyū Tōkai · CC0",
    "©長岡マキ子・magako／KADOKAWA／キミゼロ製作委員会":"© Makiko Nagaoka · magako / KADOKAWA / Our Dating Story Production Committee"
  };
  const englishAddress = (place) => {
    const englishSourceAddress = typeof place.address === "string" && !/[ぁ-ヿ一-龯]/.test(place.address) ? place.address : undefined;
    const address = place.english?.address || place.addressEn || placeDetails[place.id]?.address || translatedPlaceField(place, "address") || englishSourceAddress;
    if (!address) return [prefectures[place.prefecture] || place.prefecture, place.english?.city || place.cityEn || cities[place.city] || translatedPlaceField(place, "city") || place.city].filter(Boolean).join(", ");
    const prefecture = prefectures[place.prefecture];
    return prefecture && !address.toLowerCase().includes(prefecture.toLowerCase()) ? `${prefecture}, ${address}` : address;
  };
  const infoLabels = {"連載開始時期":"Serialization began","連載終了時期":"Serialization ended","アニメ初放送":"Anime premiere","原作出版社":"Original publisher","連載誌":"Magazine","アニメーション制作会社":"Animation studio","作品名":"Title","作品名カナ":"Title reading","作品名略称":"Also known as","ジャンル1":"Genre","ジャンル2":"Genre","作者":"Creator","作者カナ":"Creator reading","主人公":"Main character","主人公カナ":"Main character reading","主要人物1":"Main character","主要人物1カナ":"Name reading","主要人物2":"Main character","主要人物2カナ":"Name reading","主要人物3":"Main character","主要人物3カナ":"Name reading","ストーリー":"Synopsis","漫画":"Manga","アニメ":"Anime","映画":"Film","Youtube":"YouTube","その他":"Other"};
  window.animeSeichiI18n = {
    work: (name, lang) => lang === "en" ? (works[name] || name) : name,
    place: (place, lang) => lang === "en" ? (place.english?.name || place.nameEn || translatedPlaceName(place) || placeNames[place.name] || place.name) : place.name,
    prefecture: (name, lang) => lang === "en" ? (prefectures[name] || translatedLocationValue("prefecture", name) || name) : name,
    city: (place, lang) => lang === "en" ? (place.english?.city || place.cityEn || cities[place.city] || translatedPlaceField(place, "city") || place.city) : place.city,
    address: (place, lang) => lang === "en" ? englishAddress(place) : (place.address || [place.prefecture, place.city].filter(Boolean).join("")),
    scene: (place, lang) => lang === "en" ? (place.english?.scene || place.sceneEn || scenes[place.scene] || translatedPlaceField(place, "scene") || place.scene) : place.scene,
    episode: (place, lang) => lang === "en" ? (place.english?.episode || place.episodeEn || translatedPlaceField(place, "episode") || place.episode) : place.episode,
    nearestStation: (place, lang) => lang === "en" ? (place.english?.nearestStation || place.nearestStationEn || translatedPlaceField(place, "nearestStation") || place.nearestStation) : place.nearestStation,
    visitConditions: (place, lang) => lang === "en" ? (place.english?.visitConditions || place.visitConditionsEn || translatedPlaceField(place, "visitConditions") || place.visitConditions) : place.visitConditions,
    visit: (name, lang) => lang === "en" ? (visit[name] || name) : name,
    category: (name, lang) => lang === "en" ? (categories[name] || translatedLocationValue("category", name) || name) : name,
    viewpoint: (label, lang) => lang === "en" ? (translatedLocationValue("viewpoint", label) || label) : label,
    viewpointField: (field, value, lang) => lang === "en" ? (translatedLocationValue(`viewpoint${field[0].toUpperCase()}${field.slice(1)}`, value) || value) : value,
    infoLabel: (name, lang) => lang === "en" ? (infoLabels[name] || name) : name,
    credit: (value, lang) => lang === "en" ? (credits[value] || (/[ぁ-ヿ一-龯]/.test(value) ? "Image credit from the original source" : value)) : value,
    infoValue: (work, field, value, lang) => {
      if (lang !== "en") return value;
      const translated = window.animeSeichiWorkEnglish?.[work]?.[field];
      if (translated) return translated;
      return typeof value === "string" && /[ぁ-ヿ一-龯]/.test(value) ? "English translation is being prepared." : value;
    },
    addWorkTitles: (entries) => Object.assign(works, entries)
  };
})();
