// Hồ sơ nhiều bé · khu phụ huynh (báo cáo tuần, mục tiêu, sao lưu, offline) · ghi âm nói theo.
// Dùng các hàm có sẵn của index.html: nho, ghiNho, khoa, sang, veTrangChu, phat, tiengDung, tiengSai, docSao, docTuNho, KHU...
(function () {
  const g = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const lay = (k, mac) => { try { return JSON.parse(localStorage.getItem(k)) ?? mac; } catch { return mac; } };
  const luu = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const ngayStr = off => { const d = new Date(); d.setDate(d.getDate() - (off || 0)); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
  const THU = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  document.head.insertAdjacentHTML("beforeend", `<style>
.hs-chip{background:var(--the);border-radius:99px;box-shadow:0 4px 0 rgba(59,47,74,.12);padding:6px 14px;font-size:18px;font-weight:800;margin-left:auto;white-space:nowrap}
.hs-chip+.viet{margin-left:8px}
.mt{display:flex;align-items:center;gap:10px;background:var(--the);border-radius:20px;box-shadow:0 4px 0 rgba(59,47,74,.12);padding:6px 14px;margin:0 0 8px;font-weight:800;font-size:16px}
.mt .nen{flex:1;height:12px;background:#eee3d2;border-radius:99px;overflow:hidden}
.mt .nen i{display:block;height:100%;background:#4CAF50;border-radius:99px;transition:width .4s}
.pp-link{color:var(--phu);font-size:14px;font-weight:700;padding:4px 10px;text-decoration:underline}
.hs-luoi{flex:1;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:14px;align-content:start;padding:10px 2px}
.hs-o{background:var(--the);border-radius:28px;box-shadow:var(--bong);padding:18px 8px;display:flex;flex-direction:column;align-items:center;gap:4px;border:5px solid transparent;font-weight:800;font-size:22px}
.hs-o b{font-size:64px;line-height:1}
.hs-o small{font-size:14px;color:var(--phu)}
.hs-o.chon{border-color:#FFB74D;background:#FFF1D6}
.hs-o.them{background:transparent;box-shadow:none;border:4px dashed #cfc3b0;color:var(--phu)}
.pp-khung{flex:1;overflow-y:auto;max-width:640px;width:100%;margin:0 auto;display:flex;flex-direction:column;gap:12px;padding:4px 2px 24px;user-select:text}
.pp-the{background:var(--the);border-radius:22px;box-shadow:0 4px 0 rgba(59,47,74,.12);padding:14px 16px}
.pp-the h3{margin:0 0 8px;font-size:20px}
.pp-the p{margin:4px 0;font-size:16px;line-height:1.35;color:var(--chu)}
.pp-the small{color:var(--phu);font-size:14px;font-weight:600}
.pp-cot{display:flex;align-items:flex-end;gap:8px;height:120px;margin:8px 0 2px}
.pp-cot div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;font-size:13px;font-weight:800;color:var(--phu)}
.pp-cot i{display:block;width:100%;background:#FFB74D;border-radius:8px 8px 0 0;min-height:3px}
.pp-cot div.nay i{background:#4CAF50}
.pp-so{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.pp-so span{background:#FFF1D6;border-radius:99px;padding:4px 12px;font-weight:800;font-size:15px}
.pp-nut{background:#7E57C2;color:#fff;border-radius:99px;padding:8px 16px;font-weight:800;font-size:16px;margin:4px 6px 4px 0}
.pp-nut.xam{background:#90A4AE}.pp-nut.do{background:#E53935}
.pp-chon{display:flex;gap:8px;flex-wrap:wrap}
.pp-chon button{background:#eee3d2;border-radius:99px;padding:6px 16px;font-weight:800;font-size:16px}
.pp-chon button.chon{background:#4CAF50;color:#fff}
.pp-cong{font-size:34px;font-weight:800;text-align:center;margin:20px 0}
.pp-cong button{background:var(--the);border-radius:18px;box-shadow:0 4px 0 rgba(59,47,74,.12);padding:10px 22px;margin:6px;font-size:28px;font-weight:800}
.pp-the textarea{width:100%;height:70px;border-radius:12px;border:2px solid #e5dccd;padding:8px;font-size:13px;user-select:text}
.pp-tien{height:14px;background:#eee3d2;border-radius:99px;overflow:hidden;margin:6px 0}
.pp-tien i{display:block;height:100%;background:#4CAF50;width:0}
.ghi-nut.dang{background:#E53935!important}
</style>`);
  document.body.insertAdjacentHTML("beforeend", `
<section class="man" id="hs">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><h1>Ai đang học nào? 👋</h1></div>
  <div class="hs-luoi" id="hs-luoi"></div>
</section>
<section class="man" id="pp">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><h1>🔒 Khu phụ huynh</h1></div>
  <div class="pp-khung" id="pp-khung"></div>
</section>`);
  document.querySelectorAll("#hs [data-ve],#pp [data-ve]").forEach(b => b.onclick = veTrangChu);

  // ============ HỒ SƠ NHIỀU BÉ ============
  const ICON = ["🧒", "👧", "👦", "🦊", "🐼", "🦁", "🐰", "🐸", "🐯", "🐨"];
  const dsHs = () => { const d = lay("ho-so-ds", null); return d && d.length ? d : [{ id: HS_MAC, ten: "Bé", icon: "🧒" }]; };
  const hsNay = () => dsHs().find(h => h.id === hoSo) || dsHs()[0];
  function doiHs(id) {
    hoSo = id; try { localStorage.setItem("ho-so", id); } catch {}
    tuoi = nho("tuoi", "5"); khu = nho("khu-" + tuoi, KHU[tuoi][0][0]);
    veTrangChu();
  }
  function veHs() {
    const sao = n => Object.values(lay("sao" + (n === HS_MAC ? "" : "@" + n), {})).reduce((a, b) => a + b, 0);
    g("hs-luoi").innerHTML = dsHs().map(h => `<button class="hs-o ${h.id === hoSo ? "chon" : ""}" data-hs="${h.id}"><b>${h.icon}</b>${esc(h.ten)}<small>⭐ ${sao(h.id)}</small></button>`).join("")
      + `<button class="hs-o them" data-them="1"><b>➕</b>Thêm bé</button>`;
    sang("hs");
  }
  g("hs-luoi").onclick = e => {
    const o = e.target.closest(".hs-o"); if (!o) return;
    if (o.dataset.them) {
      const ten = (prompt("Tên của bé là gì?") || "").trim().slice(0, 12); if (!ten) return;
      const ds = dsHs(), id = "b" + Date.now().toString(36); ds.push({ id, ten, icon: ICON[ds.length % ICON.length] }); luu("ho-so-ds", ds);
      return doiHs(id);
    }
    doiHs(o.dataset.hs);
  };
  window.veChipHs = function () {
    const h = hsNay();
    let c = g("hs-chip");
    if (!c) { c = document.createElement("button"); c.id = "hs-chip"; c.className = "hs-chip"; c.onclick = veHs; g("bt-viet").before(c); }
    c.textContent = h.icon + " " + h.ten;
  };

  // ============ NHẬT KÝ HỌC + MỤC TIÊU ============
  let chamCuoi = 0;
  ["pointerdown", "keydown"].forEach(ev => document.addEventListener(ev, () => { chamCuoi = Date.now(); }, { passive: true }));
  const nk = () => lay(khoaHs("nhat-ky"), {});
  function ghiNk(loai, n) {
    const o = nk(), ng = ngayStr(0), r = o[ng] || (o[ng] = { gi: 0, d: 0, s: 0, n: 0 });
    r[loai] = (r[loai] || 0) + (n || 1);
    const gioi = Object.keys(o).sort().slice(-60); Object.keys(o).forEach(k => { if (!gioi.includes(k)) delete o[k]; });
    luu(khoaHs("nhat-ky"), o);
  }
  window.ghiNk = ghiNk;
  setInterval(() => {  // cộng thời gian học: đang mở app, có chạm trong 25 giây, và không ở trang chủ / khu phụ huynh
    if (document.visibilityState !== "visible" || Date.now() - chamCuoi > 25000) return;
    const man = document.querySelector(".man.hien"); if (!man || ["trang-chu", "hs", "pp"].includes(man.id)) return;
    ghiNk("gi", 5);
    window.veMucTieu && veMucTieu(true);
  }, 5000);
  const mucTieu = () => +nho("muc-tieu", "10") || 10;
  window.veMucTieu = function (nhe) {
    let m = g("mt");
    if (!m) { m = document.createElement("div"); m.id = "mt"; m.className = "mt"; g("khu").before(m); }
    const ph = Math.floor((nk()[ngayStr(0)]?.gi || 0) / 60), mt = mucTieu();
    m.innerHTML = `<span>${ph >= mt ? "🎉" : "🎯"} Hôm nay: ${ph}/${mt} phút</span><div class="nen"><i style="width:${Math.min(100, ph / mt * 100)}%"></i></div>`;
  };

  // ============ KHU PHỤ HUYNH ============
  function cong() {
    const a = 3 + Math.floor(Math.random() * 6), b = 4 + Math.floor(Math.random() * 6), dung = a + b;
    const ds = [...new Set([dung, dung + 1, dung - 2, dung + 3])].sort(() => Math.random() - .5);
    g("pp-khung").innerHTML = `<div class="pp-cong">Dành cho người lớn<br>${a} + ${b} = ?<br>${ds.map(x => `<button data-kq="${x}">${x}</button>`).join("")}</div>`;
    g("pp-khung").onclick = e => { const k = e.target.closest("[data-kq]"); if (!k) return; +k.dataset.kq === dung ? vePp() : (tiengSai(), cong()); };
    sang("pp");
  }
  g("pp-khung").addEventListener("click", e => {
    const t = e.target.closest("[data-pp]"); if (!t) return;
    const l = t.dataset.pp;
    if (l === "mt") { ghiNho("muc-tieu", t.dataset.v); vePp(); }
    else if (l === "ten") { const h = hsNay(), ten = (prompt("Đổi tên bé:", h.ten) || "").trim().slice(0, 12); if (ten) { const ds = dsHs(); ds.find(x => x.id === h.id).ten = ten; luu("ho-so-ds", ds); vePp(); } }
    else if (l === "xoa") xoaHs();
    else if (l === "xuat") xuat();
    else if (l === "chep") chepMa();
    else if (l === "nap") napMa();
    else if (l === "tep") g("pp-tep").click();
    else if (l === "off") taiOffline();
    else if (l === "cai") caiApp();
    else if (l === "reset") { if (confirm("Xoá TOÀN BỘ tiến độ của bé " + hsNay().ten + "? Không khôi phục được.")) { ["sao", "lo-trinh", "tu-nho", "nhat-ky"].forEach(k => localStorage.removeItem(khoaHs(k))); vePp(); } }
  });
  function vePp() {
    const h = hsNay(), o = nk(), hn = ngayStr(0);
    const ngay = Array.from({ length: 7 }, (_, i) => { const s = ngayStr(6 - i), r = o[s] || {}, d = new Date(s + "T00:00:00"); return { s, th: THU[d.getDay()], gi: r.gi || 0, d: r.d || 0, sai: r.s || 0, n: r.n || 0 }; });
    const tong = ngay.reduce((a, x) => a + x.gi, 0), dungT = ngay.reduce((a, x) => a + x.d, 0), saiT = ngay.reduce((a, x) => a + x.sai, 0), noiT = ngay.reduce((a, x) => a + x.n, 0);
    const maxGi = Math.max(60, ...ngay.map(x => x.gi)), soNgay = ngay.filter(x => x.gi >= 60).length;
    const tn = docTuNho(), tuMap = new Map(TU_VUNG.flatMap(c => c.tu.map(t => [t.id, t])));
    const thuoc = Object.entries(tn).filter(([id, v]) => tuMap.has(id) && v.h >= 4).length, dangHoc = Object.keys(tn).filter(id => tuMap.has(id)).length - thuoc;
    const kho = Object.entries(tn).filter(([id, v]) => tuMap.has(id) && (v.s || 0) >= 1 && (v.h || 0) <= 2).sort((a, b) => (b[1].s || 0) - (a[1].s || 0)).slice(0, 8).map(([id]) => tuMap.get(id));
    const sao = Object.values(docSao()).reduce((a, b) => a + b, 0), lt = lay(khoaHs("lo-trinh"), {});
    const chinhXac = dungT + saiT ? Math.round(dungT / (dungT + saiT) * 100) : null;
    const nhieuBe = dsHs().length > 1;
    g("pp-khung").onclick = null;
    g("pp-khung").innerHTML = `
<div class="pp-the"><h3>${h.icon} ${esc(h.ten)} — 7 ngày qua</h3>
  <div class="pp-cot">${ngay.map(x => `<div class="${x.s === hn ? "nay" : ""}"><span>${x.gi ? Math.max(1, Math.round(x.gi / 60)) : ""}</span><i style="height:${Math.round(x.gi / maxGi * 90)}px"></i>${x.th}</div>`).join("")}</div>
  <small>Số phút học mỗi ngày (chỉ tính lúc bé thật sự chạm vào màn hình).</small>
  <div class="pp-so"><span>📅 ${soNgay}/7 ngày có học</span><span>⏱️ ${Math.round(tong / 60)} phút</span><span>✅ ${chinhXac === null ? "chưa có bài" : chinhXac + "% câu đúng"}</span><span>🎙️ ${noiT} lần nói</span></div>
  <div class="pp-so"><span>🌱 ${thuoc} từ đã thuộc</span><span>📖 ${dangHoc} từ đang học</span><span>⭐ ${sao} sao</span><span>🎖️ ${lt.xong || 0}/100 ngày</span></div></div>
<div class="pp-the"><h3>🎯 Mục tiêu mỗi ngày</h3><div class="pp-chon">${[5, 10, 15, 20].map(m => `<button data-pp="mt" data-v="${m}" class="${m === mucTieu() ? "chon" : ""}">${m} phút</button>`).join("")}</div>
  <small>Bé thấy thanh tiến độ ngay trang chủ.</small></div>
<div class="pp-the"><h3>💪 Từ bé còn yếu</h3>${kho.length ? `<p>${kho.map(t => `<b>${esc(t.en)}</b> (${esc(t.vi)})`).join(" · ")}</p><small>Bé ôn bằng nút “💪 Từ khó” trong Lộ trình / Từ vựng.</small>` : "<p>Chưa có từ nào sai nhiều. Tốt lắm!</p>"}</div>
<div class="pp-the"><h3>💾 Sao lưu / chuyển sang máy khác</h3>
  <p>Tiến độ lưu ngay trên máy này. Xoá dữ liệu trình duyệt hoặc đổi máy sẽ mất, nên hãy sao lưu thỉnh thoảng.</p>
  <button class="pp-nut" data-pp="xuat">⬇️ Tải file sao lưu</button><button class="pp-nut" data-pp="chep">📋 Sao chép mã</button><button class="pp-nut xam" data-pp="tep">📂 Nạp từ file</button>
  <textarea id="pp-ma" placeholder="Dán mã sao lưu vào đây rồi bấm Nạp mã"></textarea><button class="pp-nut xam" data-pp="nap">📥 Nạp mã</button>
  <input type="file" id="pp-tep" accept=".json,application/json" style="display:none"></div>
<div class="pp-the"><h3>📲 Học offline &amp; cài ra màn hình</h3>
  <p id="pp-off-tt">Đang kiểm tra…</p><div class="pp-tien"><i id="pp-off-bar"></i></div>
  <button class="pp-nut" data-pp="off">📥 Tải sẵn hình + tiếng (~50 MB)</button><button class="pp-nut xam" data-pp="cai">📲 Cài ra màn hình chính</button><p><small id="pp-cai-tt"></small></p></div>
<div class="pp-the"><h3>👤 Hồ sơ</h3><button class="pp-nut xam" data-pp="ten">✏️ Đổi tên bé</button>${nhieuBe ? `<button class="pp-nut do" data-pp="xoa">🗑️ Xoá hồ sơ này</button>` : ""}<button class="pp-nut do" data-pp="reset">♻️ Xoá tiến độ</button></div>`;
    g("pp-tep").onchange = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { g("pp-ma").value = r.result; napMa(); }; r.readAsText(f); };
    sang("pp"); capNhatOffline();
  }
  function xoaHs() {
    const h = hsNay(); if (dsHs().length < 2 || !confirm("Xoá hồ sơ của bé " + h.ten + " và toàn bộ tiến độ?")) return;
    ["sao", "lo-trinh", "tu-nho", "nhat-ky", "tuoi", "khu-5", "khu-10", "an-viet", "muc-tieu"].forEach(k => localStorage.removeItem(khoaHs(k)));
    luu("ho-so-ds", dsHs().filter(x => x.id !== h.id)); doiHs(dsHs()[0].id);
  }
  // ---- sao lưu ----
  const gom = () => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return { app: "be-hoc-tieng-anh", ngay: ngayStr(0), data: o }; };
  const maHoa = () => btoa(unescape(encodeURIComponent(JSON.stringify(gom()))));
  function xuat() {
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([maHoa()], { type: "application/json" }));
    a.download = "be-hoc-sao-luu-" + ngayStr(0) + ".json"; document.body.appendChild(a); a.click(); a.remove();
  }
  function chepMa() {
    const m = maHoa(); g("pp-ma").value = m;
    (navigator.clipboard ? navigator.clipboard.writeText(m) : Promise.reject()).then(() => alert("Đã sao chép mã sao lưu. Dán vào máy mới rồi bấm Nạp mã."), () => { g("pp-ma").select(); alert("Hãy chọn và sao chép mã trong ô bên dưới."); });
  }
  function napMa() {
    try {
      const s = g("pp-ma").value.trim(); if (!s) return alert("Chưa có mã để nạp.");
      const o = JSON.parse(decodeURIComponent(escape(atob(s))));
      if (o.app !== "be-hoc-tieng-anh" || !o.data) throw 0;
      if (!confirm("Nạp tiến độ từ bản sao lưu ngày " + o.ngay + "? Tiến độ hiện tại trên máy này sẽ bị thay.")) return;
      Object.entries(o.data).forEach(([k, v]) => { try { localStorage.setItem(k, v); } catch {} });
      alert("Đã nạp xong!"); location.reload();
    } catch { alert("Mã không đúng. Hãy sao chép lại đầy đủ."); }
  }
  // ---- offline + cài app ----
  async function capNhatOffline() {
    const tt = g("pp-off-tt"); if (!tt) return;
    if (!("caches" in window)) { tt.textContent = "Trình duyệt này chưa hỗ trợ học offline."; return; }
    try {
      const ds = await (await fetch("offline.json")).json(), c = await caches.open("be-hoc-v1"), co = (await c.keys()).filter(r => /\/(hinh|am-thanh)\//.test(r.url)).length;
      g("pp-off-bar").style.width = Math.min(100, co / ds.files.length * 100) + "%";
      tt.textContent = co >= ds.files.length ? "✅ Đã tải đủ — bé học được cả khi không có mạng." : `Đã lưu ${co}/${ds.files.length} file. Bấm “Tải sẵn” khi có wifi để học offline đầy đủ.`;
    } catch { tt.textContent = "Chưa kiểm tra được (cần mạng lần đầu)."; }
    const k = g("pp-cai-tt"); if (k) k.textContent = /iphone|ipad/i.test(navigator.userAgent) ? "iPhone/iPad: bấm nút Chia sẻ trong Safari → “Thêm vào MH chính”." : (cheCai ? "" : "Android/máy tính: mở menu trình duyệt → “Cài đặt ứng dụng”.");
  }
  let cheCai = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); cheCai = e; });
  function caiApp() { if (cheCai) { cheCai.prompt(); cheCai = null; } else alert(/iphone|ipad/i.test(navigator.userAgent) ? "Bấm nút Chia sẻ trong Safari, rồi chọn “Thêm vào MH chính”." : "Mở menu của trình duyệt và chọn “Cài đặt ứng dụng” / “Thêm vào màn hình chính”."); }
  let dangTai = false;
  async function taiOffline() {
    if (dangTai) return; if (!("caches" in window) || !navigator.serviceWorker) return alert("Trình duyệt này chưa hỗ trợ học offline.");
    dangTai = true; const tt = g("pp-off-tt"), bar = g("pp-off-bar");
    try {
      const ds = (await (await fetch("offline.json")).json()).files, c = await caches.open("be-hoc-v1");
      const co = new Set((await c.keys()).map(r => new URL(r.url).pathname)), can = ds.filter(f => !co.has(new URL(f, location.href).pathname));
      let xong = ds.length - can.length, i = 0;
      const chay = async () => { while (i < can.length) { const f = can[i++]; try { const r = await fetch(f); if (r.ok) await c.put(new Request(new URL(f, location.href).href), r); } catch {} xong++; if (xong % 20 === 0 || xong === ds.length) { bar.style.width = (xong / ds.length * 100) + "%"; tt.textContent = `Đang tải… ${xong}/${ds.length} file`; } } };
      await Promise.all([chay(), chay(), chay(), chay()]);
    } catch { tt.textContent = "Tải bị gián đoạn, hãy thử lại khi có mạng."; }
    dangTai = false; capNhatOffline();
  }
  document.addEventListener("click", e => { if (e.target.closest("#vao-pp")) cong(); });

  // ============ GHI ÂM: BÉ NÓI THEO ============
  let ghi = null, amBe = null;
  function ghiAmNoi(nut, mau, nhan) {
    if (ghi) { ghi.stop(); return; }                                    // đang ghi → bấm lần nữa là xong
    const chu = nut.textContent; nhan = nhan || chu;
    if (!navigator.mediaDevices || !window.MediaRecorder) { nut.textContent = "😢 Máy này chưa ghi âm được"; setTimeout(() => nut.textContent = nhan, 2500); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mr = new MediaRecorder(stream), buf = []; let het = 0;
      mr.ondataavailable = e => buf.push(e.data);
      mr.onstop = () => {
        clearTimeout(het); stream.getTracks().forEach(t => t.stop()); ghi = null; nut.classList.remove("dang");
        ghiNk("n"); nut.textContent = "🎧 Nghe con nói…";
        if (amBe) amBe.pause();
        am.pause(); amBe = new Audio(URL.createObjectURL(new Blob(buf, { type: mr.mimeType })));
        const mauNoi = () => { nut.textContent = "🔊 Giọng mẫu…"; const a = phat(mau[0], mau[1]); a.onended = () => { nut.textContent = nhan; }; };
        amBe.onended = () => setTimeout(mauNoi, 400); amBe.onerror = mauNoi; amBe.play().catch(mauNoi);
      };
      ghi = mr; mr.start(); nut.classList.add("dang"); nut.textContent = "⏹️ Nói xong thì bấm";
      het = setTimeout(() => mr.state === "recording" && mr.stop(), 8000);
    }).catch(() => { nut.textContent = "🎙️ Cho phép micro nhé"; setTimeout(() => nut.textContent = nhan, 2500); });
  }
  // Nút trong màn Nói chuyện / Tình huống
  document.querySelector("#gt-hoc .hanh").insertAdjacentHTML("afterbegin", `<button class="nut-to ghi-nut" id="gt-ghi" style="background:#7E57C2">🎙️ Con nói đi</button>`);
  g("gt-ghi").onclick = () => { chuoiAm++; const l = bai.luot[luot]; ghiAmNoi(g("gt-ghi"), [l.id + "-a", l.a], "🎙️ Con nói đi"); };
  // Nút trong thẻ từ vựng
  document.querySelector("#hoc .dieu-khien").insertAdjacentHTML("beforeend", `<button class="nut-tron ghi-nut" id="hoc-ghi" aria-label="Con nói theo" style="background:#7E57C2;color:#fff">🎙️</button>`);
  g("hoc-ghi").onclick = () => { const tu = chuDe.tu[viTri]; ghiAmNoi(g("hoc-ghi"), [tu.id, tu.en], "🎙️"); };
  // Dừng ghi khi rời màn hình khác
  new MutationObserver(() => { if (ghi && !g("gt-hoc").classList.contains("hien") && !g("hoc").classList.contains("hien")) ghi.stop(); }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"] });
  veTrangChu();
})();
