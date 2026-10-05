// API キーや画像 API を使わず、利用者が選んだときだけ Google Maps を開きます。
window.streetView = (() => {
  function urlFor(point, language = "ja") {
    if (!Array.isArray(point) || point.length !== 2 || point.some((value) => !Number.isFinite(value))) return "";
    if (Math.abs(point[0]) > 90 || Math.abs(point[1]) > 180) return "";
    const url = new URL("https://www.google.com/maps/@");
    url.searchParams.set("api", "1");
    url.searchParams.set("map_action", "pano");
    url.searchParams.set("viewpoint", `${point[0]},${point[1]}`);
    if (language === "en") url.searchParams.set("hl", "en");
    return url.href;
  }

  return { urlFor };
})();
