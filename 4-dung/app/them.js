// them.js — Truyện karaoke, Bài đọc, Mẫu câu, Điền từ, Lộ trình mỗi ngày.
// Dùng lại hàm của index.html (phat, tron, phao, tiengDung, tiengSai, sang, docSao, ghiSao, napAm, phatLanLuot, hinhTu, anhGt, $).
// Chỉ đưa ra ngoài: veKhuThem, bamThem, lamLai.
(function () {
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const sao3 = n => [0, 1, 2].map(i => `<span style="animation-delay:${i * .25}s;${i < n ? "" : "filter:grayscale(1);opacity:.3"}">⭐</span>`).join("");
  const dangMo = id => document.getElementById(id).classList.contains("hien");
  const g = id => document.getElementById(id);

  // ---------- giao diện ----------
  document.head.insertAdjacentHTML("beforeend", `<style>
.luoi.lt{display:block}
.o .loai{position:absolute;top:10px;left:10px;background:rgba(255,255,255,.9);color:var(--chu);border-radius:99px;padding:0 10px;font-size:13px;font-weight:800}
.doc-khung{flex:1;display:flex;flex-direction:column;align-items:center;gap:12px;min-height:0;overflow-y:auto;padding:4px 2px 8px}
.doc-hinh{font-size:min(30vw,130px,18vh);line-height:1}
.doc-hinh img{height:min(52vw,240px,28vh);width:auto;border-radius:24px;box-shadow:var(--bong)}
.doc-bh{font-size:22px;font-weight:800;color:var(--mau)}
.doc-chu{width:100%;max-width:640px;display:flex;flex-direction:column;gap:10px}
.doc-cau{background:var(--the);border-radius:22px;padding:12px 16px;box-shadow:var(--bong);border:4px solid transparent;text-align:left}
.doc-cau.dang{border-color:var(--mau)}
.doc-cau .en{margin:0;font-size:clamp(24px,6.5vw,34px);font-weight:800;line-height:1.3}
.doc-cau .vi{margin:4px 0 0;font-size:clamp(18px,4.8vw,24px);font-weight:700;color:var(--vi);line-height:1.25}
.w{border-radius:8px;padding:0 2px;transition:background .1s}
.w.dang{background:#FFD54F;color:#3B2F4A}
.w.da{color:var(--mau)}
.dd-xem{max-width:640px;margin:6px auto 0;background:var(--the);border-radius:16px;padding:6px 12px;text-align:left;font-size:17px}
.dd-xem summary{font-weight:800;cursor:pointer;color:var(--phu)}
.mc-khung{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:0}
.mc-hinh{width:min(46vw,210px,26vh);aspect-ratio:1;background:var(--the);border-radius:28px;box-shadow:var(--bong);display:grid;place-items:center;overflow:hidden}
.mc-hinh img{width:100%;height:100%;object-fit:contain}
.mc-hinh .em{font-size:min(28vw,120px)}
.mc-cau{font-size:clamp(28px,8vw,44px);font-weight:800;text-align:center;line-height:1.2}
.mc-cau .o-trong{color:#fff;background:var(--mau);border-radius:14px;padding:0 10px}
.mc-vi{font-size:clamp(20px,5.5vw,28px);font-weight:800;color:var(--vi);text-align:center}
.mc-chon{display:flex;gap:10px;overflow-x:auto;padding:8px 2px max(14px,env(safe-area-inset-bottom));scrollbar-width:none}
.mc-chon button{flex:none;width:86px;background:var(--the);border-radius:18px;box-shadow:0 4px 0 rgba(59,47,74,.12);padding:6px;border:3px solid transparent;font-size:15px;font-weight:800}
.mc-chon button.chon{border-color:var(--mau)}
.mc-chon img{width:100%;aspect-ratio:1;object-fit:contain;border-radius:12px}
.mc-chon .em{font-size:44px;display:block}
.dt-cau{max-width:640px;margin:10px auto 0;background:var(--the);border-radius:24px;box-shadow:var(--bong);padding:16px;font-size:clamp(26px,7vw,38px);font-weight:800;text-align:center;line-height:1.35}
.dt-o{display:inline-block;min-width:3.2em;border-bottom:5px solid var(--mau);color:var(--dung)}
.dt-vi{text-align:center;font-size:clamp(18px,5vw,24px);font-weight:800;color:var(--vi);margin-top:8px}
.dt-chon{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;padding:18px 0}
.dt-chon .the-tu{position:relative}
.dt-chon .the-tu.sai{opacity:.35;border-color:#E53935;animation:lac .4s}
.dt-chon .the-tu.dung{background:#E8F5E9;border-color:var(--dung)}
.lt-dau{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;padding:4px 0 10px;font-size:18px;font-weight:800}
.lt-dau span{background:var(--the);border-radius:99px;padding:6px 14px;box-shadow:0 4px 0 rgba(59,47,74,.12)}
.lt-dau button{background:#7E57C2;color:#fff;border-radius:99px;padding:6px 14px;font-weight:800;box-shadow:0 4px 0 rgba(59,47,74,.15)}
.lt-nut{display:block;width:100%;max-width:520px;margin:0 auto 14px;background:linear-gradient(135deg,#FF8A65,#FFB74D);color:#fff;border-radius:28px;padding:18px;font-size:28px;font-weight:800;box-shadow:var(--bong);animation:nhip 1.6s ease-in-out infinite}
.lt-nut small{display:block;font-size:16px;opacity:.95}
@keyframes nhip{50%{transform:scale(1.03)}}
.lt-cap{background:var(--the);border-radius:24px;padding:10px 12px 14px;margin-bottom:12px;box-shadow:var(--bong)}
.lt-cap h3{margin:0 0 8px;font-size:19px}
.lt-hang{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
.lt-o{aspect-ratio:1;border-radius:50%;font-size:20px;font-weight:800;display:grid;place-items:center;background:#eee3d2;color:var(--phu)}
.lt-o.xong{background:#FFF1D6;font-size:26px;box-shadow:inset 0 0 0 3px #FFB74D}
.lt-o.nay{background:#FF8A65;color:#fff;box-shadow:0 0 0 5px rgba(255,138,101,.35);animation:nhip 1.2s infinite}
.lt-o.khoa{opacity:.45}
.ngay-khung{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;min-height:0;text-align:center}
.ngay-nhom{font-size:22px;font-weight:800;color:var(--mau)}
.ngay-gioi{font-size:22px;font-weight:800;line-height:1.7}
.ngay-to{font-size:clamp(40px,11vw,60px);font-weight:800}
.album{display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:10px;padding:10px 0;overflow-y:auto}
.album div{aspect-ratio:1;background:var(--the);border-radius:20px;display:grid;place-items:center;font-size:40px;box-shadow:0 4px 0 rgba(59,47,74,.12)}
.album div.chua{font-size:20px;color:var(--phu);opacity:.5}
.sticker-to{font-size:min(40vw,170px);animation:vao .6s cubic-bezier(.3,1.6,.6,1)}
.tt-tu{margin-left:auto;flex:none;display:flex;align-items:center;gap:6px;height:48px;padding:0 16px 0 12px;border-radius:999px;background:var(--the);box-shadow:var(--bong);font-family:inherit;font-weight:800;font-size:18px;color:#555;border:3px solid #66BB6A;white-space:nowrap}
.tt-tu b{font-size:22px}
.tt-tu.dung{background:#FFA000;border-color:#FFA000;color:#fff;animation:nhay 1.6s ease-in-out infinite}
@keyframes nhay{50%{transform:scale(1.07)}}
#tt .dau h1{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tt-trang{flex:1;min-height:0;overflow-y:auto;display:grid;grid-template-columns:1fr;grid-auto-rows:max-content;gap:18px;align-content:start;width:100%;max-width:1000px;margin:0 auto;padding:4px 6px 28px}
@media(min-width:760px){.tt-trang{grid-template-columns:1fr 1fr}.tt-bia,.tt-bh,.tt-cuoi{grid-column:1/-1}}
.tt-o,.tt-bia,.tt-bh{--k:var(--mau);position:relative;background:color-mix(in srgb,var(--k) 10%,#fff);border:5px solid var(--k);border-radius:28px;overflow:hidden;box-shadow:0 6px 0 color-mix(in srgb,var(--k) 35%,transparent);transition:transform .25s,box-shadow .25s}
.tt-o.dang,.tt-bia.dang,.tt-bh.dang{transform:scale(1.015);box-shadow:0 0 0 6px color-mix(in srgb,var(--k) 35%,transparent),0 8px 0 color-mix(in srgb,var(--k) 45%,transparent)}
.tt-o::after{content:"✨";position:absolute;top:8px;right:10px;font-size:26px;animation:lap 1.8s ease-in-out infinite}
@keyframes lap{50%{transform:scale(1.3) rotate(15deg);opacity:.7}}
.tt-anh{position:relative;aspect-ratio:3/2;background:color-mix(in srgb,var(--k) 22%,#fff);display:grid;place-items:center;font-size:min(26vw,120px);cursor:pointer}
.tt-anh img{width:100%;height:100%;object-fit:cover}
.tt-so{position:absolute;top:10px;left:10px;width:56px;height:56px;border-radius:50%;background:var(--k);color:#fff;font-size:32px;font-weight:800;display:grid;place-items:center;border:4px solid #fff;box-shadow:0 4px 0 rgba(0,0,0,.2);font-style:normal}
.tt-o.da .tt-so::after{content:"✓";position:absolute;right:-8px;bottom:-6px;width:24px;height:24px;border-radius:50%;background:#43A047;font-size:16px;display:grid;place-items:center;border:2px solid #fff}
.tt-chu{position:relative;margin-top:-30px;padding:0 12px 14px;display:flex;flex-direction:column;gap:12px}
.tt-cau{position:relative;background:#fff;border:3px solid color-mix(in srgb,var(--k) 55%,#fff);border-radius:20px;padding:10px 14px;text-align:left;cursor:pointer;box-shadow:0 3px 0 color-mix(in srgb,var(--k) 25%,transparent)}
.tt-cau.thoai{border:4px solid var(--k);border-radius:32px;margin-top:12px}
.tt-cau.thoai::before{content:"";position:absolute;top:-20px;left:40px;border:17px solid transparent;border-bottom-color:var(--k);border-top:0}
.tt-cau.thoai::after{content:"";position:absolute;top:-13px;left:45px;border:12px solid transparent;border-bottom-color:#fff;border-top:0}
.tt-cau.dang{background:#FFFBEA;outline:5px solid #FFD54F;outline-offset:-1px}
.tt-cau .en{margin:0;font-size:clamp(25px,6.6vw,34px);font-weight:800;line-height:1.28}
.tt-cau .vi{margin:4px 0 0;font-size:clamp(20px,5.2vw,26px);font-weight:700;color:var(--vi);line-height:1.25}
.tt-cau .w.da{color:var(--k)}
.tt-tieu{position:absolute;left:0;right:0;bottom:0;padding:16px 14px 12px;background:linear-gradient(transparent,rgba(255,255,255,.95) 30%);text-align:center;cursor:pointer}
.tt-tieu .en{margin:0;font-size:clamp(34px,9.5vw,56px);font-weight:800;line-height:1.08;-webkit-text-stroke:1.5px #fff;paint-order:stroke fill;text-shadow:0 3px 0 rgba(59,47,74,.25)}
.tt-tieu .w:nth-child(4n+1){color:#8E24AA}.tt-tieu .w:nth-child(4n+2){color:#43A047}.tt-tieu .w:nth-child(4n+3){color:#F4511E}.tt-tieu .w:nth-child(4n){color:#1E88E5}
.tt-tieu .vi{margin:4px 0 0;font-size:clamp(20px,5.5vw,28px);font-weight:800;color:var(--vi)}
.tt-bia::before{content:"☀️";position:absolute;z-index:1;top:8px;left:10px;font-size:40px}
.tt-bia::after{content:"🦋";position:absolute;z-index:1;top:10px;right:12px;font-size:36px;animation:lap 2.2s ease-in-out infinite}
.tt-bh{--k:#EC407A;background:linear-gradient(135deg,#FFE3EC,#FFF4D6);padding:12px}
.tt-bh h3{margin:0 0 8px;font-size:24px;color:#D81B60}
.tt-cuoi{display:flex;justify-content:center;padding:6px 0 10px}
</style>`);

  document.body.insertAdjacentHTML("beforeend", `
<section class="man" id="doc">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><h1 id="doc-ten"></h1><div class="cham" id="doc-cham" style="max-width:110px"></div></div>
  <div class="doc-khung"><div class="doc-bh" id="doc-bh"></div><div class="doc-hinh" id="doc-hinh"></div><div class="doc-chu" id="doc-chu"></div></div>
  <div class="dieu-khien"><button class="nut-tron" id="doc-truoc" aria-label="Trang trước">⬅️</button><button class="nut-tron" id="doc-nghe" aria-label="Đọc lại">🔊</button><button class="nut-tron" id="doc-sau" aria-label="Trang sau">➡️</button></div>
</section>
<section class="man" id="dd-kt">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><div class="tien-do"><b id="dd-td"></b></div></div>
  <div class="cau-hoi">
    <div class="cau-chu"><div class="en" id="dd-hoi"></div><div class="vi" id="dd-hoivi"></div></div>
    <button class="nut-tron" id="dd-nghe" aria-label="Nghe câu hỏi" style="width:84px;height:84px;font-size:40px">🔊</button>
    <details class="dd-xem"><summary>📖 Xem lại bài đọc</summary><div id="dd-van"></div></details>
  </div>
  <div class="dap-an chu" id="dd-da"></div>
</section>
<section class="man" id="kt2">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><div class="tien-do"><b id="kt2-td"></b></div></div>
  <div class="cau-hoi"><div class="cau-chu"><div class="en" id="kt2-hoi"></div><div class="vi" id="kt2-hoivi"></div></div>
    <button class="nut-tron" id="kt2-nghe" aria-label="Nghe lại">🔊</button><p>Chạm loa để nghe lại</p></div>
  <div class="dap-an" id="kt2-da"></div>
</section>
<section class="man" id="mc">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><h1 id="mc-ten"></h1><button class="nut-tron" id="mc-kt" aria-label="Luyện tập">⭐</button></div>
  <div class="mc-khung"><div class="mc-hinh" id="mc-hinh"></div><div class="mc-cau" id="mc-cau"></div><div class="mc-vi" id="mc-vi"></div><p style="margin:0;color:var(--phu)">Chạm hình bên dưới để thay từ · ⭐ để luyện tập</p></div>
  <div class="mc-chon" id="mc-chon"></div>
</section>
<section class="man" id="dt">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><div class="tien-do"><b id="dt-td"></b></div></div>
  <div class="cau-hoi"><div class="cau-chu"><div class="en">Listen and fill in!</div><div class="vi">Nghe và chọn từ còn thiếu</div></div>
    <button class="nut-tron" id="dt-nghe" aria-label="Nghe lại" style="width:96px;height:96px;font-size:46px">🔊</button></div>
  <div class="dt-cau" id="dt-cau"></div><div class="dt-vi" id="dt-vi"></div>
  <div class="dt-chon" id="dt-chon"></div>
</section>
<section class="man" id="ngay">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><div class="tien-do"><b id="ngay-td"></b></div></div>
  <div class="ngay-khung" id="ngay-khung"></div>
  <div class="hanh"><button class="nut-to" id="ngay-tiep">Tiếp ➡️</button></div>
</section>
<section class="man" id="album">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><h1>🎖️ Album sticker</h1></div>
  <div class="album" id="album-luoi"></div>
</section>
<section class="man" id="tt">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><h1 id="tt-ten"></h1><button class="tt-tu" id="tt-tu" aria-label="Dừng / Đọc tiếp"></button></div>
  <div class="tt-trang" id="tt-trang"></div>
</section>`);

  // ---------- màn kết thúc chung ----------
  function manXong(khoaSao, n, phu) {
    ghiSao(khoaSao, n);
    g("sao-to").innerHTML = sao3(n);
    g("xong-loi").textContent = ["", "Cố lên nào!", "Giỏi lắm!", "Xuất sắc!"][n];
    g("xong-phu").textContent = phu;
    sang("xong"); phao(24); phat("_well-done", "Well done! You did it!");
  }
  const soSao = (dung, tong) => dung >= tong - 1 ? 3 : dung >= tong / 2 ? 2 : 1;

  // ============ TRUYỆN + BÀI ĐỌC (karaoke) ============
  let docVat, docTrang = [], docSo = 0, docXong = null, docTok = 0, docRaf = 0;
  // ---- Truyện tranh (bé 5 tuổi): khung đánh số + ô thoại song ngữ, tự đọc từng câu ----
  let ttSeq = [], ttI = 0, ttTu = true, ttTok = 0, ttRaf = 0, ttAm = null, ttHet = false;
  const MAU_KHUNG = ["#EC407A", "#FFA000", "#29B6F6", "#AB47BC", "#66BB6A", "#FF7043"];
  const boNhay = s => /^'.*'$/.test(s) ? s.slice(1, -1) : s;
  const chuW = s => s.split(" ").map(w => `<span class="w">${esc(w)}</span>`).join(" ");
  function moTruyen(id, xong) {
    const t = docVat = TRUYEN.find(x => x.id === id); kieu = "tr"; docXong = xong || null;
    ttSeq = [{ id: `tr-${t.id}-ten`, en: t.ten }];
    const cauHtml = c => {
      const i = ttSeq.push(c) - 1, thoai = c.en.startsWith("'");
      return `<div class="tt-cau${thoai ? " thoai" : ""}" data-i="${i}"><p class="en">${chuW(thoai ? boNhay(c.en) : c.en)}</p><p class="vi">${esc(thoai ? boNhay(c.vi) : c.vi)}</p></div>`;
    };
    let h = `<div class="tt-bia"><div class="tt-anh">${anhGt(t.bia ? t.bia.anh : "", t.emoji)}<div class="tt-tieu" data-i="0"><p class="en">${chuW(t.ten)}</p><p class="vi">${esc(t.vi)}</p></div></div></div>`;
    t.trang.forEach((p, n) => {
      h += `<article class="tt-o" style="--k:${MAU_KHUNG[n % MAU_KHUNG.length]}"><div class="tt-anh">${p.anh ? anhGt(p.anh, p.emoji) : p.emoji}<i class="tt-so">${n + 1}</i></div><div class="tt-chu">${p.cau.map(cauHtml).join("")}</div></article>`;
    });
    h += `<div class="tt-bh"><h3>⭐ Moral · Bài học 💖</h3>${cauHtml(t.baiHoc)}</div><div class="tt-cuoi"><button class="nut-to" id="tt-xong">✅ Xong rồi!</button></div>`;
    document.body.style.setProperty("--mau", t.mau);
    g("tt-ten").textContent = t.emoji + " " + t.vi;
    g("tt-trang").innerHTML = h; g("tt-trang").scrollTop = 0;
    napAm(ttSeq.map(c => c.id));
    ttTu = true; ttHet = false; nutTu();
    sang("tt"); ttTok++; setTimeout(() => ttDoc(0), 500);
  }
  function ttDung() { ttTok++; cancelAnimationFrame(ttRaf); if (ttAm) ttAm.pause(); }
  function ttDoc(i) {
    const tok = ++ttTok, box = g("tt-trang");
    cancelAnimationFrame(ttRaf);
    box.querySelectorAll(".dang").forEach(e => e.classList.remove("dang"));
    if (!dangMo("tt")) return;
    if (i >= ttSeq.length) { ttHet = true; g("tt-xong").scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    ttI = i; ttHet = false;
    const el = box.querySelector(`[data-i="${i}"]`), khung = el.closest(".tt-o,.tt-bia,.tt-bh"), c = ttSeq[i];
    el.classList.add("dang"); khung.classList.add("dang");
    khung.scrollIntoView({ block: khung.offsetHeight <= box.clientHeight ? "nearest" : "start", behavior: "smooth" });
    const spans = [...el.querySelectorAll(".w")], tg = (window.THOI_GIAN || {})[c.id] || [];
    spans.forEach(s => s.classList.remove("dang", "da"));
    const a = ttAm = phat(c.id, c.en);
    const ve = () => {
      if (tok !== ttTok) return;
      const ms = a.currentTime * 1000; let k = -1;
      for (let j = 0; j < tg.length; j++) if (ms >= tg[j][0] - 40) k = j;
      spans.forEach((s, j) => { s.classList.toggle("dang", j === k); s.classList.toggle("da", j < k); });
      ttRaf = requestAnimationFrame(ve);
    };
    ttRaf = requestAnimationFrame(ve);
    a.onended = () => {
      if (tok !== ttTok) return;
      cancelAnimationFrame(ttRaf);
      spans.forEach(s => { s.classList.remove("dang"); s.classList.add("da"); });
      const sau = box.querySelector(`[data-i="${i + 1}"]`);
      if (khung.classList.contains("tt-o") && (!sau || sau.closest(".tt-o,.tt-bia,.tt-bh") !== khung)) khung.classList.add("da");
      if (ttTu) setTimeout(() => { if (tok === ttTok && dangMo("tt")) ttDoc(i + 1); }, 900);
      else { el.classList.remove("dang"); khung.classList.remove("dang"); ttHet = true; }
    };
  }
  g("tt-trang").addEventListener("click", e => {
    if (e.target.closest("#tt-xong")) {
      ttDung(); ghiSao("tr-" + docVat.id, 3);
      if (docXong) { const f = docXong; docXong = null; return f(); }
      return manXong("tr-" + docVat.id, 3, "Bé đã đọc xong truyện “" + docVat.vi + "”");
    }
    const o = e.target.closest("[data-i]") || e.target.closest(".tt-o,.tt-bia,.tt-bh")?.querySelector("[data-i]");
    if (o) ttDoc(+o.dataset.i);
  });
  // nút góc phải: đang tự đọc → "Dừng"; đang dừng → "Đọc tiếp" (lúc dừng bé chạm câu nào thì đọc câu đó rồi đứng lại)
  function nutTu() {
    const n = g("tt-tu"); n.classList.toggle("dung", !ttTu);
    n.innerHTML = ttTu ? "<b>⏸️</b>Dừng" : "<b>▶️</b>Đọc tiếp";
  }
  g("tt-tu").onclick = () => {
    ttTu = !ttTu; nutTu();
    if (!ttTu) { ttDung(); g("tt-trang").querySelectorAll(".dang").forEach(e => e.classList.remove("dang")); }
    else ttDoc(ttHet ? ttI + 1 : ttI);
  };
  function moBaiDoc(id) {
    docVat = BAI_DOC.find(b => b.id === id); kieu = "dd"; docXong = null;
    docTrang = docVat.trang; batDauDoc();
  }
  function batDauDoc() {
    document.body.style.setProperty("--mau", docVat.mau);
    g("doc-ten").textContent = docVat.emoji + " " + docVat.ten;
    napAm(docTrang.flatMap(t => t.cau.map(c => c.id)));
    docSo = 0; sang("doc"); veTrangDoc();
  }
  function veTrangDoc() {
    const tr = docTrang[docSo];
    g("doc-bh").textContent = tr.bh ? "⭐ Bài học / Lesson" : "";
    g("doc-hinh").innerHTML = tr.anh ? anhGt(tr.anh, tr.emoji) : tr.emoji;
    g("doc-chu").innerHTML = tr.cau.map((c, k) => `<div class="doc-cau" data-k="${k}"><p class="en">${c.en.split(" ").map(w => `<span class="w">${esc(w)}</span>`).join(" ")}</p><p class="vi">${esc(c.vi)}</p></div>`).join("");
    g("doc-cham").innerHTML = docTrang.map((_, i) => `<i class="${i <= docSo ? "da" : ""}"></i>`).join("");
    g("doc-truoc").style.visibility = docSo ? "visible" : "hidden";
    const cuoi = docSo === docTrang.length - 1;
    g("doc-sau").textContent = !cuoi ? "➡️" : kieu === "dd" ? "❓" : "✅";
    document.querySelector("#doc .doc-khung").scrollTop = 0;
    docDoc(0, false);
  }
  // Đọc từ câu k (một câu hoặc cả trang), tô sáng từng chữ theo THOI_GIAN
  function docDoc(k0, chiMot) {
    const tok = ++docTok, tr = docTrang[docSo];
    cancelAnimationFrame(docRaf);
    document.querySelectorAll("#doc-chu .w").forEach(s => s.classList.remove("dang", "da"));
    const buoc = k => {
      if (tok !== docTok || !dangMo("doc")) return;
      document.querySelectorAll("#doc-chu .doc-cau").forEach(e => e.classList.remove("dang"));
      if (k >= tr.cau.length) return;
      const c = tr.cau[k], el = document.querySelector(`#doc-chu .doc-cau[data-k="${k}"]`);
      const spans = [...el.querySelectorAll(".w")], tg = (window.THOI_GIAN || {})[c.id] || [];
      el.classList.add("dang"); el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      spans.forEach(s => s.classList.remove("dang", "da"));
      const a = phat(c.id, c.en);
      const ve = () => {
        if (tok !== docTok || !dangMo("doc")) return;
        const t = a.currentTime * 1000; let i = -1;
        for (let j = 0; j < tg.length; j++) if (t >= tg[j][0] - 40) i = j;
        spans.forEach((s, j) => { s.classList.toggle("dang", j === i); s.classList.toggle("da", j < i); });
        docRaf = requestAnimationFrame(ve);
      };
      docRaf = requestAnimationFrame(ve);
      a.onended = () => {
        cancelAnimationFrame(docRaf);
        spans.forEach(s => { s.classList.remove("dang"); s.classList.add("da"); });
        if (!chiMot) setTimeout(() => buoc(k + 1), 400); else el.classList.remove("dang");
      };
    };
    setTimeout(() => buoc(k0), 250);
  }
  g("doc-chu").addEventListener("click", e => { const c = e.target.closest(".doc-cau"); if (c) docDoc(+c.dataset.k, true); });
  g("doc-nghe").onclick = () => docDoc(0, false);
  g("doc-truoc").onclick = () => { if (docSo > 0) { docSo--; veTrangDoc(); } };
  g("doc-sau").onclick = () => {
    if (docSo < docTrang.length - 1) { docSo++; veTrangDoc(); return; }
    docTok++;
    if (kieu === "dd") return ktDoc();
    ghiSao("tr-" + docVat.id, 3);
    if (docXong) { const f = docXong; docXong = null; return f(); }
    manXong("tr-" + docVat.id, 3, "Bé đã đọc xong truyện “" + docVat.vi + "”");
  };

  // ---- câu hỏi đọc hiểu ----
  let ddSo = 0, ddDung = 0, ddSai = false, ddKhoa = false;
  function ktDoc() {
    kieu = "dd"; ddSo = 0; ddDung = 0;
    napAm(docVat.hoi.map(h => h.id));
    g("dd-van").innerHTML = docVat.trang[0].cau.map(c => `<p style="margin:6px 0">${esc(c.en)}<br><span style="color:var(--vi);font-weight:700">${esc(c.vi)}</span></p>`).join("");
    g("dd-van").parentElement.open = false;
    sang("dd-kt"); veDd();
  }
  function veDd() {
    ddSai = false; ddKhoa = false;
    const h = docVat.hoi[ddSo];
    g("dd-td").style.width = (ddSo / docVat.hoi.length * 100) + "%";
    g("dd-hoi").textContent = h.q; g("dd-hoivi").textContent = h.qvi;
    g("dd-da").classList.remove("xong");
    g("dd-da").innerHTML = h.dap.map((d, i) => `<button class="lua-chon" data-i="${i}"><b>${esc(d)}</b></button>`).join("");
    setTimeout(() => { if (docVat.hoi[ddSo] === h && !ddKhoa) phat(h.id, h.q); }, 150);
  }
  g("dd-nghe").onclick = () => { const h = docVat.hoi[ddSo]; phat(h.id, h.q); };
  g("dd-da").onclick = e => {
    const b = e.target.closest(".lua-chon"); if (!b || ddKhoa || b.classList.contains("sai")) return;
    const h = docVat.hoi[ddSo];
    if (+b.dataset.i === h.dung) {
      ddKhoa = true; if (!ddSai) ddDung++;
      b.classList.add("dung"); g("dd-da").classList.add("xong"); phao(12); tiengDung();
      setTimeout(() => {
        if (!dangMo("dd-kt")) return;
        ddSo++; ddSo < docVat.hoi.length ? veDd() : manXong("dd-" + docVat.id, soSao(ddDung, docVat.hoi.length), `Bé trả lời đúng ngay ${ddDung}/${docVat.hoi.length} câu`);
      }, 1300);
    } else { ddSai = true; b.classList.add("sai"); tiengSai(); }
  };

  // ============ CÂU HỎI CHỌN HÌNH (dùng chung) ============
  let k2 = null;
  function ktHinh(cfg) {
    k2 = { ...cfg, ds: tron(cfg.ds), so: 0, dung: 0, sai: false, khoa: false };
    napAm(k2.ds.map(x => cfg.am(x)[0]));
    g("kt2-hoi").textContent = cfg.hoi; g("kt2-hoivi").textContent = cfg.hoivi;
    sang("kt2"); veK2();
  }
  function veK2() {
    k2.sai = false; k2.khoa = false;
    const x = k2.ds[k2.so];
    const lua = tron([x, ...tron((k2.goc || k2.ds).filter(y => y !== x)).slice(0, 2)]);
    g("kt2-td").style.width = (k2.so / k2.ds.length * 100) + "%";
    g("kt2-da").classList.remove("xong");
    g("kt2-da").innerHTML = lua.map((y, i) => `<button class="lua-chon" data-dung="${y === x ? 1 : 0}">${k2.hinh(y)}</button>`).join("");
    if (k2.cauHoi) { const c = k2.cauHoi(x); g("kt2-hoi").textContent = c[0]; g("kt2-hoivi").textContent = c[1]; }
    setTimeout(() => { if (k2 && k2.ds[k2.so] === x && !k2.khoa) phat(...k2.am(x)); }, 120);
  }
  g("kt2-nghe").onclick = () => { if (k2) phat(...k2.am(k2.ds[k2.so])); };
  g("kt2-da").onclick = e => {
    const b = e.target.closest(".lua-chon"); if (!b || !k2 || k2.khoa || b.classList.contains("sai")) return;
    const x = k2.ds[k2.so];
    if (b.dataset.dung === "1") {
      k2.khoa = true; if (!k2.sai) k2.dung++;
      b.classList.add("dung"); b.insertAdjacentHTML("beforeend", `<span class="nhan-dung">${esc(k2.nhan(x))}</span>`);
      g("kt2-da").classList.add("xong"); phao(12); tiengDung();
      phatLanLuot([k2.am(x)], () => {
        if (!dangMo("kt2")) return;
        k2.so++; k2.so < k2.ds.length ? veK2() : k2.xong(k2.dung, k2.ds.length);
      });
    } else { k2.sai = true; b.classList.add("sai"); tiengSai(); }
  };

  // ============ MẪU CÂU THAY TỪ ============
  let mcVat, mcChon = 0;
  const EM = {};
  const emojiCua = id => { if (!Object.keys(EM).length) TU_VUNG.forEach(c => c.tu.forEach(t => EM[t.id] = t.emoji)); return EM[id] || "🖼️"; };
  const hinhMc = t => hinhTu({ id: t.anh, anh: t.anh, emoji: emojiCua(t.anh), en: t.chu });
  function moMc(id) {
    mcVat = MAU_CAU.find(m => m.id === id); kieu = "mc";
    document.body.style.setProperty("--mau", mcVat.mau);
    g("mc-ten").textContent = mcVat.emoji + " " + mcVat.ten;
    g("mc-chon").innerHTML = mcVat.tu.map((t, i) => `<button data-i="${i}">${hinhMc(t)}${esc(t.chu)}</button>`).join("");
    napAm(mcVat.tu.map(t => t.id));
    sang("mc"); chonMc(0);
  }
  function chonMc(i) {
    mcChon = i; const t = mcVat.tu[i];
    g("mc-hinh").innerHTML = hinhMc(t);
    const [dau, cuoi] = mcVat.mau_en.split("___");
    g("mc-cau").innerHTML = `${esc(dau)}<span class="o-trong">${esc(t.chu)}</span>${esc(cuoi)}`;
    g("mc-vi").textContent = t.cauVi;
    g("mc-chon").querySelectorAll("button").forEach((b, j) => b.classList.toggle("chon", j === i));
    phat(t.id, t.en);
  }
  g("mc-chon").onclick = e => { const b = e.target.closest("button"); if (b) chonMc(+b.dataset.i); };
  g("mc-hinh").onclick = () => { const t = mcVat.tu[mcChon]; phat(t.id, t.en); };
  g("mc-cau").onclick = () => { const t = mcVat.tu[mcChon]; phat(t.id, t.en); };
  function ktMc() {
    kieu = "mc";
    ktHinh({ ds: mcVat.tu, hoi: mcVat.mau_en, hoivi: mcVat.mau_vi,
      am: t => [t.id, t.en], hinh: hinhMc, nhan: t => t.chu,
      xong: (d, n) => { kieu = "mc"; manXong("mc-" + mcVat.id, soSao(d, n), `Bé chọn đúng ngay ${d}/${n} câu`); } });
  }
  g("mc-kt").onclick = ktMc;

  // ============ NGHE VÀ ĐIỀN TỪ ============
  const BO = new Set(["the", "and", "you", "are", "for", "can", "it's", "i'm", "i'd", "i'll", "that's", "let's", "what", "this", "with"]);
  const tach = w => { const m = w.match(/^([^A-Za-z']*)(.*?)([^A-Za-z']*)$/); return { dau: m[1], loi: m[2], cuoi: m[3] }; };
  let dtBai, dtDs = [], dtSo = 0, dtDung = 0, dtSai = false, dtKhoa = false, dtCau = null;
  function moDt(id) {
    dtBai = TINH_HUONG.find(b => b.id === id); kieu = "dt";
    document.body.style.setProperty("--mau", dtBai.mau);
    dtDs = tron(dtBai.luot); dtSo = 0; dtDung = 0;
    napAm(dtDs.map(l => l.id + "-a"));
    sang("dt"); veDt();
  }
  function veDt() {
    dtSai = false; dtKhoa = false;
    const l = dtDs[dtSo], tu = l.a.split(" ");
    const ung = tu.map((w, i) => ({ i, ...tach(w) })).filter(x => x.loi.length >= 3 && !BO.has(x.loi.toLowerCase()));
    const chon = ung.length ? ung.sort((a, b) => b.loi.length - a.loi.length)[Math.floor(Math.random() * Math.min(2, ung.length))] : { i: 0, ...tach(tu[0]) };
    const khac = [...new Set(dtBai.luot.filter(x => x !== l).flatMap(x => x.a.split(" ").map(w => tach(w).loi))
      .filter(w => w.length >= 3 && !BO.has(w.toLowerCase()) && w.toLowerCase() !== chon.loi.toLowerCase()))];
    const lua = tron([chon.loi, ...tron(khac).slice(0, 2)]);
    dtCau = { l, chon };
    g("dt-td").style.width = (dtSo / dtDs.length * 100) + "%";
    g("dt-cau").innerHTML = tu.map((w, i) => i === chon.i ? `${esc(chon.dau)}<span class="dt-o" id="dt-o">&nbsp;</span>${esc(chon.cuoi)}` : esc(w)).join(" ");
    g("dt-vi").textContent = l.avi;
    g("dt-chon").innerHTML = lua.map(w => `<button class="the-tu" data-w="${esc(w)}">${esc(w)}</button>`).join("");
    setTimeout(() => { if (dtCau && dtCau.l === l && !dtKhoa) phat(l.id + "-a", l.a); }, 150);
  }
  g("dt-nghe").onclick = () => { if (dtCau) phat(dtCau.l.id + "-a", dtCau.l.a); };
  g("dt-chon").onclick = e => {
    const b = e.target.closest(".the-tu"); if (!b || dtKhoa || b.classList.contains("sai")) return;
    const { l, chon } = dtCau;
    if (b.dataset.w === chon.loi) {
      dtKhoa = true; if (!dtSai) dtDung++;
      b.classList.add("dung"); g("dt-o").textContent = chon.loi; phao(12); tiengDung();
      phatLanLuot([[l.id + "-a", l.a]], () => {
        if (!dangMo("dt")) return;
        dtSo++; dtSo < dtDs.length ? veDt() : manXong("dt-" + dtBai.id, soSao(dtDung, dtDs.length), `Bé điền đúng ngay ${dtDung}/${dtDs.length} câu`);
      });
    } else { dtSai = true; b.classList.add("sai"); tiengSai(); }
  };

  // ============ LỘ TRÌNH MỖI NGÀY ============
  const SO_NGAY = 100;
  const CAP = ["🌱 Hạt mầm", "🌿 Chồi non", "🍀 Lá xanh", "🌳 Cây con", "🌸 Nở hoa", "🍎 Kết trái", "🦋 Bươm bướm", "🐦 Chim non", "🦅 Đại bàng", "🏆 Nhà vô địch"];
  const STICKER = "🦄 🐶 🐱 🦊 🐼 🐨 🐯 🦁 🐸 🐵 🐧 🐢 🐙 🦋 🐝 🐞 🦖 🐳 🐬 🦀 🌈 ⭐ 🌙 🌞 🍀 🌻 🌸 🍓 🍉 🍦 🍩 🎈 🎁 🎨 🚀 🚂 ⚽ 🏆 👑 💎 🎸 🎺 🧸 🪁 🛼 🚁 🎠 🍭 🧁 🥨 🦒 🦓 🐘 🦔 🦦 🦩 🐠 🐊 🦜 🐻 🐰 🐹 🐮 🐷 🐔 🐤 🦉 🦚 🦥 🦘 🦡 🐿️ 🍄 🌵 🌴 🎄 🍒 🍑 🥝 🥥 🍔 🍕 🌮 🍿 🎂 🍪 🛸 🪐 🌋 🎡 🎢 ⛵ 🚲 🛴 🏀 🎾 🥁 🎹 📚 🔮 🧩 🪀 🦭".split(" ");
  const ngayStr = d => d.toISOString().slice(0, 10);
  const homNay = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return ngayStr(d); };
  const homQua = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset() - 1440); return ngayStr(d); };
  const docLt = () => { try { return JSON.parse(localStorage.getItem("lo-trinh") || "{}"); } catch { return {}; } };
  const ghiLt = v => { try { localStorage.setItem("lo-trinh", JSON.stringify(v)); } catch {} };
  const chuoiNgay = lt => (lt.ngayCuoi === homNay() || lt.ngayCuoi === homQua()) ? (lt.chuoi || 0) : 0;
  function veLoTrinh() {
    const lt = docLt(), xong = lt.xong || 0, nay = Math.min(xong + 1, SO_NGAY);
    let h = `<div class="lt-dau"><span>🔥 ${chuoiNgay(lt)} ngày liên tiếp</span><span>🎖️ ${xong} sticker</span><button data-album="1">Album</button></div>`;
    h += `<button class="lt-nut" data-ngay="${nay}">▶️ Học Ngày ${nay}<small>${CAP[Math.floor((nay - 1) / 10)]} · khoảng 8 phút</small></button>`;
    for (let c = 0; c < 10; c++) {
      h += `<div class="lt-cap"><h3>Cấp ${c + 1}: ${CAP[c]}</h3><div class="lt-hang">`;
      for (let d = c * 10 + 1; d <= c * 10 + 10; d++) {
        const lop = d <= xong ? "xong" : d === nay ? "nay" : "khoa";
        h += `<button class="lt-o ${lop}" data-ngay="${d}">${d <= xong ? STICKER[(d - 1) % STICKER.length] : d > nay ? "🔒" : d}</button>`;
      }
      h += `</div></div>`;
    }
    return h;
  }
  function keHoach(d) {
    const tuAll = TU_VUNG.flatMap(c => c.tu.map(t => ({ ...t, chuDe: c })));
    const tv = [0, 1, 2, 3].map(i => tuAll[((d - 1) * 4 + i) % tuAll.length]);
    const abc = CHU_CAI.filter(c => c.khu === "abc").flatMap(c => c.tu);
    const sw = CHU_CAI.filter(c => c.khu === "sight").flatMap(c => c.tu);
    const tr = TRUYEN[(d - 1) % TRUYEN.length];
    return [
      { k: "gioi", tv, chu: abc[(d - 1) % abc.length], tr },
      { k: "the", tu: abc[(d - 1) % abc.length], nhom: "🔤 Chữ cái hôm nay", mau: "#FF7043" },
      ...tv.map((t, i) => ({ k: "the", tu: t, nhom: `📚 Từ mới ${i + 1}/4 · ${t.chuDe.vi}`, mau: t.chuDe.mau })),
      ...[0, 1].map(i => ({ k: "the", tu: sw[(2 * (d - 1) + i) % sw.length], nhom: "👀 Sight word", mau: "#5C6BC0" })),
      { k: "kt", ds: tv },
      { k: "truyen", tr },
      { k: "xong" },
    ];
  }
  let ngD = 1, ngKh = [], ngB = 0;
  function moNgay(d) {
    const lt = docLt();
    if (d > Math.min((lt.xong || 0) + 1, SO_NGAY)) { tiengSai(); return; }
    ngD = d; ngKh = keHoach(d); ngB = 0; kieu = "ngay";
    napAm(ngKh.filter(b => b.k === "the").map(b => b.tu.id));
    veNgay();
  }
  function veNgay() {
    const b = ngKh[ngB];
    g("ngay-td").style.width = (ngB / (ngKh.length - 1) * 100) + "%";
    const nut = g("ngay-tiep"); nut.style.display = "";
    if (b.k === "kt") {
      nut.style.display = "none";
      return ktHinh({ ds: b.ds, goc: b.ds, hoi: "Find the picture!", hoivi: "Tìm hình đúng nhé!",
        am: t => [t.id, t.en], hinh: t => hinhTu(t), nhan: t => t.en,
        xong: () => { kieu = "ngay"; ngB++; veNgay(); } });
    }
    if (b.k === "truyen") { return moTruyen(b.tr.id, () => { kieu = "ngay"; ngB++; veNgay(); }); }
    sang("ngay");
    const kh = g("ngay-khung");
    if (b.k === "gioi") {
      document.body.style.setProperty("--mau", "#FF8A65");
      kh.innerHTML = `<div class="ngay-to">Ngày ${ngD}</div><div class="ngay-nhom">${CAP[Math.floor((ngD - 1) / 10)]}</div>
        <div class="ngay-gioi">🔤 Chữ cái: <b>${b.chu.en}</b><br>📚 4 từ mới: ${b.tv.map(t => esc(t.en)).join(", ")}<br>👀 2 sight words<br>⭐ Trò chơi tìm hình<br>📖 Truyện: ${esc(b.tr.ten)}</div>`;
      nut.textContent = "Bắt đầu 🚀";
    } else if (b.k === "the") {
      const t = b.tu;
      document.body.style.setProperty("--mau", b.mau);
      kh.innerHTML = `<div class="ngay-nhom">${b.nhom}</div>
        <button class="the vao" id="ngay-the" style="width:min(86vw,420px,52vh)"><div class="hinh">${hinhTu(t)}</div>
        <div class="chu-en">${esc(t.en)}</div><div class="chu-vi">${esc(t.vi)}</div>${t.vd ? `<div class="the-vd">${esc(t.vd)}</div>` : ""}<div class="loa">🔊 chạm để nghe</div></button>`;
      g("ngay-the").onclick = () => phat(t.id, t.en);
      setTimeout(() => { if (dangMo("ngay") && ngKh[ngB] === b) phat(t.id, t.en); }, 300);
      nut.textContent = "Tiếp ➡️";
    } else if (b.k === "xong") {
      const lt = docLt(), moi = ngD > (lt.xong || 0);
      if (lt.ngayCuoi !== homNay()) { lt.chuoi = lt.ngayCuoi === homQua() ? (lt.chuoi || 0) + 1 : 1; lt.ngayCuoi = homNay(); }
      if (moi) lt.xong = ngD;
      ghiLt(lt);
      const st = STICKER[(ngD - 1) % STICKER.length];
      kh.innerHTML = `<div class="ngay-nhom">${moi ? "🎉 Bé nhận được sticker mới!" : "🎉 Ôn lại xong rồi!"}</div><div class="sticker-to">${st}</div>
        <div class="ngay-gioi">🔥 ${lt.chuoi} ngày học liên tiếp<br>🎖️ ${lt.xong} sticker trong album</div>`;
      nut.textContent = "🗺️ Về bản đồ";
      phao(30); phat("_well-done", "Well done! You did it!");
    }
  }
  g("ngay-tiep").onclick = () => {
    if (ngKh[ngB].k === "xong") { tuoi = "5"; khu = "lt"; return veTrangChu(); }
    ngB++; veNgay();
  };
  function moAlbum() {
    const xong = docLt().xong || 0;
    g("album-luoi").innerHTML = Array.from({ length: SO_NGAY }, (_, i) => i < xong ? `<div>${STICKER[i % STICKER.length]}</div>` : `<div class="chua">${i + 1}</div>`).join("");
    sang("album");
  }

  // ============ TRANG CHỦ: các khu mới ============
  window.veKhuThem = function (khu, sao) {
    if (khu === "lt") return veLoTrinh();
    if (khu === "truyen") return TRUYEN.map(t => `<button class="o" style="--mau:${t.mau}" data-tr="${t.id}"><span class="loai">${t.loai}</span><span class="sao">${"⭐".repeat(sao["tr-" + t.id] || 0)}</span><span class="bieu">${t.emoji}</span><span class="ten" style="font-size:18px;text-align:center;line-height:1.05;padding:0 6px">${esc(t.ten)}</span><span class="vi">${esc(t.vi)}</span></button>`).join("");
    if (khu === "doc") return BAI_DOC.map(b => `<button class="o" style="--mau:${b.mau}" data-dd="${b.id}"><span class="loai">Cấp ${b.cap} · ${b.capTen}</span><span class="sao">${"⭐".repeat(sao["dd-" + b.id] || 0)}</span><span class="bieu">${b.emoji}</span><span class="ten" style="font-size:19px;text-align:center;line-height:1.05;padding:0 6px">${esc(b.ten)}</span><span class="vi">${esc(b.vi)}</span></button>`).join("");
    if (khu === "mc") return MAU_CAU.map(m => `<button class="o" style="--mau:${m.mau}" data-mc="${m.id}"><span class="sao">${"⭐".repeat(sao["mc-" + m.id] || 0)}</span><span class="bieu">${m.emoji}</span><span class="ten" style="font-size:19px;text-align:center;line-height:1.05;padding:0 6px">${esc(m.ten)}</span><span class="vi">${esc(m.mau_vi.replace("___", "…"))}</span></button>`).join("");
    if (khu === "dt") return TINH_HUONG.map(b => `<button class="o" style="--mau:${b.mau}" data-dt="${b.id}"><span class="sao">${"⭐".repeat(sao["dt-" + b.id] || 0)}</span><span class="bieu">✍️</span><span class="ten" style="font-size:19px;text-align:center;line-height:1.05;padding:0 6px">${esc(b.ten)}</span><span class="vi">${esc(b.vi)}</span><span class="loai" style="left:auto;right:10px;top:auto;bottom:10px;background:none;font-size:24px">${b.emoji}</span></button>`).join("");
    return null;
  };
  window.bamThem = function (e) {
    const o = e.target.closest("[data-ngay],[data-album],[data-tr],[data-dd],[data-mc],[data-dt]");
    if (!o) return false;
    const d = o.dataset;
    if (d.ngay) moNgay(+d.ngay); else if (d.album) moAlbum(); else if (d.tr) moTruyen(d.tr);
    else if (d.dd) moBaiDoc(d.dd); else if (d.mc) moMc(d.mc); else if (d.dt) moDt(d.dt);
    return true;
  };
  window.lamLai = {
    tr: { hoc: () => moTruyen(docVat.id), choi: () => moTruyen(docVat.id) },
    dd: { hoc: () => moBaiDoc(docVat.id), choi: () => ktDoc() },
    mc: { hoc: () => moMc(mcVat.id), choi: () => ktMc() },
    dt: { hoc: () => moBai(dtBai.id), choi: () => moDt(dtBai.id) },
  };
})();
