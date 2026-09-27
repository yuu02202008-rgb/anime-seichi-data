// Supabase の Publishable key はブラウザで使用する公開用のキーです。
window.supabaseConfig = {
  url: "https://vdroheixhpzeafemsjuc.supabase.co",
  publishableKey: "sb_publishable_yVimwRqq_DsL4ZAv5yhmtA_T3Ad1ZLg"
};

// Google Cloud で発行した「Street View Static API」用の公開キーを入れます。
// 公開キーは必ず、GitHub Pages のURLだけで使えるようGoogle Cloud側で制限してください。
window.mapImageConfig = {
  streetViewApiKey: "",
  // true にするのは、Google Cloud側で請求上限・URL制限を設定し、試験地点を選んだ後だけ。
  streetViewPreviewEnabled: false
};
