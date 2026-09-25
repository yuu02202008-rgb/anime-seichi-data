// 訪問記録は端末内だけに保存します。現在地や行動履歴を外部へ送信しません。
window.visitLog = (() => {
  const key = "anime-seichi-visited-v1";
  const read = () => { try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); } catch { return new Set(); } };
  const save = (values) => localStorage.setItem(key, JSON.stringify([...values]));
  return {
    has: (id) => read().has(id),
    toggle: (id) => { const values = read(); values.has(id) ? values.delete(id) : values.add(id); save(values); return values.has(id); },
    count: () => read().size
  };
})();
