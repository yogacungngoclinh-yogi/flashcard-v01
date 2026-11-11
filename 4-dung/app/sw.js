// Source-linked speaking cues release: 20261109-speaking11. Preserve the existing media cache.
// Chạy offline: trang + mã = mạng trước (có thì lấy bản mới), hình + tiếng = bộ nhớ trước.
const KHO = "be-hoc-v1";
const LOI = ["./", "index.html", "manifest.webmanifest", "tu-vung.js", "chu-cai.js", "giao-tiep.js", "tinh-huong.js", "mau-cau.js", "truyen.js", "thoi-gian.js", "them.js", "phu-huynh.js", "mo-rong.js", "ngu-phap.js", "daily-launch-core.js", "daily-launch.js", "daily-launch.css", "english-kids-core.bundle.js", "curriculum-365-data.js", "english365-assets.js", "curriculum-365-player.js", "curriculum-365-home.js", "curriculum-365-player.css", "curriculum-365-home.css", "icon/icon-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(KHO).then(c => Promise.all(LOI.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });

async function cat(resp, range) {  // trả 206 từ bản đầy đủ trong bộ nhớ (audio cần Range)
  const buf = await resp.arrayBuffer(), m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  const a = m[1] ? +m[1] : 0, b = m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
  return new Response(buf.slice(a, b + 1), { status: 206, headers: { "Content-Type": resp.headers.get("Content-Type") || "audio/mpeg", "Content-Range": `bytes ${a}-${b}/${buf.byteLength}`, "Content-Length": String(b - a + 1) } });
}
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  const phuongTien = /\/(hinh|am-thanh)\//.test(u.pathname);
  e.respondWith((async () => {
    const c = await caches.open(KHO);
    if (phuongTien) {
      const co = await c.match(u.pathname.startsWith("/") ? new Request(u.origin + u.pathname) : r);
      if (co) return r.headers.get("range") ? cat(co.clone(), r.headers.get("range")) : co;
      const mang = await fetch(new Request(u.origin + u.pathname)).catch(() => null);   // tải bản đầy đủ (bỏ Range)
      if (!mang || !mang.ok) return mang || Response.error();
      c.put(new Request(u.origin + u.pathname), mang.clone());
      return r.headers.get("range") ? cat(mang, r.headers.get("range")) : mang;
    }
    try {
      const mang = await fetch(r);
      if (mang.ok) c.put(new Request(u.origin + u.pathname), mang.clone());
      return mang;
    } catch {
      return (await c.match(new Request(u.origin + u.pathname))) || (await c.match("index.html")) || Response.error();
    }
  })());
});
