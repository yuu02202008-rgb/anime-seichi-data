/*
 * GitHub Actionsから実行する、承認前の聖地候補作成ツールです。
 * 公開データには書き込まず、spot_submissions の pending 下書きだけを作ります。
 */
const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "OPENAI_API_KEY"];
for (const key of required) {
  if (!process.env[key]) throw new Error(`${key} is not configured.`);
}

const baseUrl = process.env.SUPABASE_URL.replace(/\/$/, "");
const supabaseHeaders = {
  apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  "content-type": "application/json",
  prefer: "return=representation"
};

const allowedVisitStatus = new Set(["自由訪問可能", "条件付き", "外観のみ"]);
const schema = {
  type: "object",
  additionalProperties: false,
  required: ["spots"],
  properties: {
    spots: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["spot", "country", "region", "city", "coordinates", "visit_status", "visit_conditions", "scene", "source_url"],
        properties: {
          spot: { type: "string" },
          country: { type: "string" },
          region: { type: "string" },
          city: { type: "string" },
          coordinates: { type: "string" },
          visit_status: { type: "string" },
          visit_conditions: { type: "string" },
          scene: { type: "string" },
          source_url: { type: "string" }
        }
      }
    }
  }
};

async function supabase(path, options = {}) {
  const response = await fetch(`${baseUrl}/rest/v1/${path}`, { ...options, headers: { ...supabaseHeaders, ...(options.headers || {}) } });
  if (!response.ok) throw new Error(`Supabase request failed: ${response.status} ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}

function responseText(payload) {
  if (payload.output_text) return payload.output_text;
  return (payload.output || []).flatMap((item) => item.content || [])
    .filter((content) => content.type === "output_text")
    .map((content) => content.text || "").join("");
}

async function researchAnime(anime) {
  const input = `作品「${anime.title}」のアニメ聖地を調査してください。\n\n厳守事項:\n- Web検索を使い、作品と実在場所の対応を直接説明している信頼できるページだけを根拠にする。\n- 推測、ファンの曖昧な言及、出典なしのまとめだけでは候補に入れない。\n- 確認できない場合は spots を空配列にする。\n- 日本国外も対象にしてよい。region は日本なら都道府県、国外なら州・県・地域名。\n- 座標と訪問可否は根拠が確認できる場合だけ記入し、それ以外は空文字にする。\n- source_url には候補ごとに対応する根拠ページのURLを必ず入れる。\n- scene には「どの場面・どのような対応か」を日本語で簡潔に書く。\n\n作品データURL: ${anime.official_url || "なし"}`;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: "gpt-5-mini",
      tools: [{ type: "web_search", search_context_size: "medium" }],
      input,
      text: { format: { type: "json_schema", name: "seichi_research", strict: true, schema } }
    })
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status} ${JSON.stringify(payload)}`);
  return JSON.parse(responseText(payload));
}

async function createDrafts(anime, spots) {
  const validSpots = spots.filter((spot) => spot.spot && spot.region && /^https?:\/\//.test(spot.source_url));
  if (!validSpots.length) return 0;
  const drafts = validSpots.map((spot) => ({
    status: "pending",
    submission_type: "new_spot",
    work: anime.title,
    spot: spot.spot.trim(),
    prefecture: spot.region.trim(),
    city: spot.city.trim() || null,
    coordinates: spot.coordinates.trim() || null,
    visit_status: allowedVisitStatus.has(spot.visit_status) ? spot.visit_status : null,
    visit_conditions: spot.visit_conditions.trim() || null,
    scene: spot.scene.trim() || "AI自動調査による候補。承認前に根拠を確認してください。",
    source_url: spot.source_url.trim(),
    admin_note: "AI自動調査の下書きです。根拠URL・場所・訪問条件を確認してから承認してください。"
  }));
  await supabase("spot_submissions", { method: "POST", body: JSON.stringify(drafts) });
  return drafts.length;
}

const queue = await supabase("anime_research_queue?select=id,title,official_url&status=eq.researching&research_status=eq.queued&order=created_at.asc&limit=3");
console.log(`Processing ${queue.length} queued anime record(s).`);

for (const anime of queue) {
  await supabase(`anime_research_queue?id=eq.${anime.id}`, { method: "PATCH", body: JSON.stringify({ research_status: "processing", research_error: null }) });
  try {
    const result = await researchAnime(anime);
    const count = await createDrafts(anime, result.spots || []);
    await supabase(`anime_research_queue?id=eq.${anime.id}`, { method: "PATCH", body: JSON.stringify({ research_status: count ? "drafted" : "no_match", drafted_spot_count: count, researched_at: new Date().toISOString() }) });
    console.log(`${anime.title}: ${count} draft(s) created.`);
  } catch (error) {
    await supabase(`anime_research_queue?id=eq.${anime.id}`, { method: "PATCH", body: JSON.stringify({ research_status: "failed", research_error: String(error.message).slice(0, 500), researched_at: new Date().toISOString() }) });
    console.error(`${anime.title}: ${error.message}`);
  }
}
