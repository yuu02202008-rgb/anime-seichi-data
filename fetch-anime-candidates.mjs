import fs from "node:fs";

const month = new Date().getUTCMonth() + 1;
const season = month <= 3 ? "WINTER" : month <= 6 ? "SPRING" : month <= 9 ? "SUMMER" : "FALL";
const seasonYear = new Date().getUTCFullYear();
const query = `query ($season: MediaSeason!, $seasonYear: Int!) { Page(page: 1, perPage: 24) { media(type: ANIME, format: TV, countryOfOrigin: JP, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC) { id title { native romaji english } startDate { year month day } season seasonYear episodes genres siteUrl description(asHtml: false) coverImage { large color } } } }`;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options = {}, attempts = 3) {
  let response;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    response = await fetch(url, options);
    if (response.ok) return response;
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === attempts - 1) return response;
    await wait((attempt + 1) * 2500);
  }
  return response;
}

const response = await fetchWithRetry("https://graphql.anilist.co", {
  method: "POST",
  headers: { "content-type": "application/json", accept: "application/json", "user-agent": "AnimeSeichiData candidate collector/1.0" },
  body: JSON.stringify({ query, variables: { season, seasonYear } })
});
const payload = await response.json();
if (!response.ok || payload.errors?.length) throw new Error(`AniList request failed: ${response.status}`);
const candidates = (payload.data?.Page?.media || []).map((media) => ({
  anilistId: media.id,
  title: media.title.native || media.title.romaji || media.title.english,
  titleRomaji: media.title.romaji || "",
  titleEnglish: media.title.english || "",
  startDate: [media.startDate?.year, media.startDate?.month, media.startDate?.day].filter(Boolean).join("-") || "未定",
  season: [media.seasonYear, media.season].filter(Boolean).join(" "),
  episodes: media.episodes || null,
  genres: media.genres || [],
  sourceUrl: media.siteUrl || "",
  dataSource: "AniList",
  description: String(media.description || "").replace(/\s+/g, " ").trim(),
  coverImage: media.coverImage?.large || "",
  color: media.coverImage?.color || ""
}));
fs.writeFileSync(new URL("./anime-candidates.js", import.meta.url), `// AniList公開APIから週次取得した候補。自動公開はしません。\nwindow.animeCandidates = ${JSON.stringify(candidates, null, 2)};\n`);
console.log(`Saved ${candidates.length} anime candidates.`);
