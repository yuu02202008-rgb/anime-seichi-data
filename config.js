// Supabase の Publishable key はブラウザで使用する公開用のキーです。
window.supabaseConfig = {
  url: "https://bmpzajngptofkcekpdga.supabase.co",
  publishableKey: "sb_publishable_TM4x7mvw9VFrmulQFRTvfA_JSAIlKFc"
};

// Google Cloud で発行した「Street View Static API」用の公開キーを入れます。
// 公開キーは必ず、GitHub Pages のURLだけで使えるようGoogle Cloud側で制限してください。
window.mapImageConfig = {
  streetViewApiKey: ""
};
