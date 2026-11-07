// Nội dung Movers cho bé 10 tuổi: Ngữ pháp, Viết từ (đánh vần), Trò chơi ôn, Thi thử Movers, Lộ trình 60 ngày.
// Dùng hàm có sẵn: sang, phat, phatLanLuot, tiengDung, tiengSai, phao, tron, hinhTu, napAm, docSao, tuDung, tuSai, loiSai, nho, khoaHs, moBai, moXc, TH (từ them.js).
(function () {
  const g = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const lay = (k, mac) => { try { return JSON.parse(localStorage.getItem(khoaHs(k))) ?? mac; } catch { return mac; } };
  const luu = (k, v) => { try { localStorage.setItem(khoaHs(k), JSON.stringify(v)); } catch {} };
  const hom = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
  const homQua = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset() - 1440); return d.toISOString().slice(0, 10); };
  const dangMo = id => g(id).classList.contains("hien");
  let lt10Cb = null;   // đang trong Lộ trình 10: bước kế tiếp

  document.head.insertAdjacentHTML("beforeend", `<style>
.ng-khung{flex:1;overflow-y:auto;max-width:640px;width:100%;margin:0 auto;display:flex;flex-direction:column;gap:12px;padding:4px 2px 12px}
.ng-giai{background:var(--the);border-radius:22px;box-shadow:var(--bong);padding:14px 16px;font-size:clamp(18px,4.8vw,22px);font-weight:700;line-height:1.45;text-align:left;border-left:8px solid var(--mau)}
.ng-giai b{color:var(--mau)}
.ng-vd{background:#F3FBFF;border:4px solid #4FC3F7;border-radius:22px;padding:10px 14px;text-align:left;box-shadow:0 4px 0 rgba(59,47,74,.12);width:100%}
.ng-vd.dang{background:#FFF8E1;border-color:#FFB74D}
.ng-vd .en{margin:0;font-size:clamp(22px,6vw,30px);font-weight:800;line-height:1.2}
.ng-vd .vi{margin:4px 0 0;color:var(--vi);font-weight:700;font-size:clamp(16px,4.4vw,21px)}
.qz-doan{max-width:640px;width:100%;margin:0 auto 6px;max-height:26vh;overflow-y:auto;background:var(--the);border-radius:16px;padding:8px 12px;text-align:left;font-size:17px;line-height:1.35;user-select:text}
.qz-nhan{font-weight:800;color:var(--mau);font-size:16px;text-align:center}
.qz-o{display:inline-block;min-width:2.4em;border-bottom:4px solid var(--mau);color:var(--dung);text-align:center}
.vt-khung{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-height:0}
.vt-hinh{width:min(44vw,200px,24vh);aspect-ratio:1;background:var(--the);border-radius:26px;box-shadow:var(--bong);display:grid;place-items:center;overflow:hidden}
.vt-hinh img{width:100%;height:100%;object-fit:contain}
.vt-hinh .em{font-size:min(26vw,110px)}
.vt-o{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;min-height:56px;padding:4px 8px}
.vt-o span{width:clamp(30px,9vw,44px);height:clamp(40px,11vw,54px);border-bottom:5px solid #cfc3b0;display:grid;place-items:center;font-size:clamp(26px,7.5vw,36px);font-weight:800}
.vt-o span.co{border-color:var(--mau);color:var(--chu)}
.vt-o span.cach{border:0;width:14px}
.vt-o.dung span{border-color:var(--dung);color:var(--dung)}
.vt-o.sai{animation:lac .4s}
.vt-chu{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:6px 4px;max-width:520px}
.vt-chu button{width:clamp(42px,12vw,54px);height:clamp(48px,13vw,60px);background:#fff;border-radius:14px;box-shadow:0 5px 0 rgba(59,47,74,.18);font-size:clamp(24px,7vw,32px);font-weight:800;border:3px solid var(--mau)}
.vt-chu button.dung{background:#E8F5E9}
.vt-chu button:disabled{opacity:.15;box-shadow:none}
.vt-chu button.goiy{animation:chop .7s infinite}
.tc-ds{display:grid;grid-template-columns:1fr;gap:14px;max-width:520px;margin:0 auto;width:100%}
.ghep{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;flex:1;align-content:center;max-width:520px;width:100%;margin:0 auto}
.ghep button{aspect-ratio:1;border-radius:20px;background:var(--mau);box-shadow:var(--bong);font-size:clamp(20px,6vw,28px);font-weight:800;color:#fff;display:grid;place-items:center;padding:4px;overflow:hidden}
.ghep button.mo{background:#fff;color:var(--chu);border:4px solid var(--mau)}
.ghep button.khop{background:#E8F5E9;color:var(--chu);border:4px solid var(--dung);opacity:.8}
.ghep img{max-width:100%;max-height:100%;object-fit:contain}
.ghep .em{font-size:clamp(34px,10vw,56px)}
.nhanh-gio{height:16px;background:#eee3d2;border-radius:99px;overflow:hidden;flex:1}
.nhanh-gio b{display:block;height:100%;width:100%;background:#FF7043;transition:width 1s linear}
.nhanh-diem{font-size:26px;font-weight:800;text-align:center;margin:6px 0}
.thi-ten{text-align:center;font-weight:800;color:var(--phu);font-size:16px}
.ketqua-khien{font-size:clamp(40px,12vw,64px);letter-spacing:6px}
</style>`);

  document.body.insertAdjacentHTML("beforeend", `
<section class="man" id="ng">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><h1 id="ng-ten"></h1></div>
  <div class="ng-khung"><div class="ng-giai" id="ng-giai"></div><div id="ng-vd" style="display:flex;flex-direction:column;gap:10px"></div></div>
  <div class="hanh"><button class="nut-to" id="ng-lam">✏️ Làm bài tập</button></div>
</section>
<section class="man" id="qz">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><div class="tien-do"><b id="qz-td"></b></div></div>
  <div class="thi-ten" id="qz-nhan"></div>
  <div class="cau-hoi">
    <div class="qz-doan" id="qz-doan" style="display:none"></div>
    <div class="cau-chu" id="qz-hoi-chu"><div class="en" id="qz-hoi"></div><div class="vi" id="qz-vi"></div></div>
    <button class="nut-tron" id="qz-nghe" aria-label="Nghe" style="display:none">🔊</button>
  </div>
  <div class="dap-an chu" id="qz-da"></div>
</section>
<section class="man" id="vt">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><div class="tien-do"><b id="vt-td"></b></div></div>
  <div class="vt-khung">
    <div class="vt-hinh" id="vt-hinh"></div>
    <div class="dt-vi vt-vi" id="vt-vi"></div>
    <button class="nut-tron" id="vt-nghe" aria-label="Nghe lại" style="width:72px;height:72px;font-size:34px;background:var(--mau);color:#fff">🔊</button>
    <div class="vt-o" id="vt-o"></div>
    <div class="vt-chu" id="vt-chu"></div>
    <div class="hanh"><button class="nut-to" id="vt-xoa" style="background:#90A4AE">↩️ Xoá chữ</button></div>
  </div>
</section>
<section class="man" id="tc-ghep">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><h1>🃏 Ghép cặp</h1><span id="ghep-lan" style="font-weight:800"></span></div>
  <div class="ghep" id="ghep"></div>
</section>
<section class="man" id="tc-nhanh">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><div class="nhanh-gio"><b id="nhanh-gio"></b></div></div>
  <div class="nhanh-diem" id="nhanh-diem"></div>
  <div class="cau-hoi"><button class="nut-tron" id="nhanh-nghe" aria-label="Nghe lại" style="width:96px;height:96px;font-size:46px">🔊</button><p>Nghe rồi chọn từ đúng thật nhanh!</p></div>
  <div class="dap-an chu" id="nhanh-da"></div>
</section>
<section class="man" id="thi-noi">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><div class="tien-do"><b id="thi-noi-td"></b></div></div>
  <div class="canh">
    <div class="thi-ten">🎤 Phần nói — hãy đọc to câu này</div>
    <div class="bong be"><div class="en" id="thi-noi-en"></div><div class="vi" id="thi-noi-vi"></div></div>
    <button class="nut-to" id="thi-noi-nghe" style="background:#29B6F6">🔊 Nghe mẫu</button>
  </div>
  <div class="hanh"><button class="nut-to ghi-nut" id="thi-noi-ghi" style="background:#7E57C2">🎙️ Con nói đi</button><button class="nut-to xanh" id="thi-noi-tiep">Xong ➡️</button></div>
</section>
<section class="man" id="l10">
  <div class="dau"><button class="nut-tron" data-ve aria-label="Về trang chủ">🏠</button><h1 id="l10-ten"></h1></div>
  <div class="ngay-khung" id="l10-khung"></div>
  <div class="hanh"><button class="nut-to" id="l10-tiep">Bắt đầu 🚀</button></div>
</section>`);
  document.querySelectorAll("#ng [data-ve],#qz [data-ve],#vt [data-ve],#tc-ghep [data-ve],#tc-nhanh [data-ve],#thi-noi [data-ve],#l10 [data-ve]").forEach(b => b.onclick = veTrangChu);
  document.querySelector(".ket-qua").insertAdjacentHTML("afterbegin", `<button class="nut-to" id="xong-tiep" style="background:#4CAF50;display:none">Tiếp theo ➡️</button>`);
  g("xong-tiep").onclick = () => { const f = lt10Cb; lt10Cb = null; f && f(); };

  // ---- sang(): khi đang trong Lộ trình 10 thì màn kết quả có nút "Tiếp theo"; về trang chủ thì thoát lộ trình ----
  const sangGoc = window.sang;
  window.sang = function (id) {
    sangGoc(id);
    if (id === "trang-chu" || id === "hs" || id === "pp") lt10Cb = null;
    if (id === "xong") {
      const tiep = !!lt10Cb;
      g("xong-tiep").style.display = tiep ? "" : "none"; g("hoc-lai").style.display = tiep ? "none" : ""; g("choi-lai").style.display = tiep ? "none" : "";
    }
  };

  // ================= QUIZ CHUNG (ngữ pháp, thi thử) =================
  // cfg: { ds:[{q,qvi,audio:[id,text],opts,dung,fill,doan,nhan}], gioiY:true/false, sauDung:(item)=>[id,text]|null, xong:(dung,tong,chiTiet)=>void }
  let qz = null;
  function qzChay(cfg) {
    qz = { ...cfg, so: 0, dung: 0 };
    napAm(cfg.ds.flatMap(x => [x.audio && x.audio[0], x.sau && x.sau[0]].filter(Boolean)));
    sang("qz"); qzVe();
  }
  function qzVe() {
    const x = qz.ds[qz.so]; qz.sai = false; qz.khoa = false; loiCau = 0;
    g("qz-td").style.width = (qz.so / qz.ds.length * 100) + "%";
    g("qz-nhan").textContent = x.nhan || "";
    const dn = g("qz-doan"); dn.style.display = x.doan ? "" : "none"; dn.innerHTML = x.doan || "";
    g("qz-hoi").innerHTML = x.q.includes("___") ? esc(x.q).replace("___", `<span class="qz-o" id="qz-o">&nbsp;</span>`) : esc(x.q);
    g("qz-vi").textContent = x.qvi || "";
    g("qz-nghe").style.display = x.audio ? "" : "none";
    g("qz-hoi-chu").style.display = x.an ? "none" : "";
    g("qz-da").classList.remove("xong");
    g("qz-da").innerHTML = x.opts.map((o, i) => `<button class="lua-chon" data-i="${i}"><span class="tx"><b>${esc(o)}</b></span></button>`).join("");
    document.querySelector("#qz .cau-hoi").scrollTop = 0;
    if (x.audio) setTimeout(() => { if (qz && qz.ds[qz.so] === x && !qz.khoa) phat(x.audio[0], x.audio[1]); }, 200);
  }
  g("qz-nghe").onclick = () => { const x = qz && qz.ds[qz.so]; if (x && x.audio) phat(x.audio[0], x.audio[1]); };
  g("qz-da").onclick = e => {
    const b = e.target.closest(".lua-chon"); if (!qz || !b || qz.khoa || b.classList.contains("sai")) return;
    const x = qz.ds[qz.so], dungEl = g("qz-da").querySelector(`[data-i="${x.dung}"]`);
    if (+b.dataset.i === x.dung) {
      qz.khoa = true; b.classList.add("dung"); g("qz-da").classList.add("xong"); phao(10); tiengDung();
      if (!qz.sai) qz.dung++;
      const o = g("qz-o"); if (o) o.textContent = x.opts[x.dung];
      const tiep = () => { if (!dangMo("qz")) return; qz.so++; qz.so < qz.ds.length ? qzVe() : qz.xong(qz.dung, qz.ds.length); };
      x.sau ? phatLanLuot([x.sau], tiep) : setTimeout(tiep, 800);
    } else {
      b.classList.add("sai");
      if (qz.cheDo === "thi") {  // thi thử: sai là sai, hiện đáp án đúng rồi qua câu
        qz.khoa = true; qz.sai = true; tiengSai(); dungEl.classList.add("dung"); g("qz-da").classList.add("xong");
        setTimeout(() => { if (!dangMo("qz")) return; qz.so++; qz.so < qz.ds.length ? qzVe() : qz.xong(qz.dung, qz.ds.length); }, 1400);
      } else { qz.sai = true; loiSai(dungEl, x.sau ? () => phat(...x.sau) : null); }
    }
  };

  // ================= NGỮ PHÁP =================
  let ngBai = null;
  function moNg(id) {
    ngBai = NGU_PHAP.find(b => b.id === id); kieu = "ng";
    document.body.style.setProperty("--mau", ngBai.mau);
    g("ng-ten").textContent = ngBai.emoji + " " + ngBai.vi;
    g("ng-giai").innerHTML = `<b>${esc(ngBai.ten)}</b><br>` + ngBai.giai;
    g("ng-vd").innerHTML = ngBai.vd.map((v, i) => `<button class="ng-vd" data-i="${i}"><p class="en">🔊 ${esc(v.en)}</p><p class="vi">${esc(v.vi)}</p></button>`).join("");
    napAm(ngBai.vd.map(v => v.id));
    sang("ng"); setTimeout(() => dangMo("ng") && ngDoc(0), 500);
  }
  function ngDoc(i) {
    document.querySelectorAll("#ng-vd .ng-vd").forEach((e, k) => e.classList.toggle("dang", k === i));
    phat(ngBai.vd[i].id, ngBai.vd[i].en).onended = () => { if (dangMo("ng") && i < ngBai.vd.length - 1) setTimeout(() => dangMo("ng") && ngDoc(i + 1), 700); else document.querySelectorAll("#ng-vd .dang").forEach(e => e.classList.remove("dang")); };
  }
  g("ng-vd").onclick = e => { const b = e.target.closest(".ng-vd"); if (b) { const i = +b.dataset.i; document.querySelectorAll("#ng-vd .ng-vd").forEach((x, k) => x.classList.toggle("dang", k === i)); phat(ngBai.vd[i].id, ngBai.vd[i].en); } };
  function ktNg() {
    kieu = "ng";
    const ds = tron(ngBai.bt).map(b => ({ q: b.q, qvi: b.vi, opts: b.opts, dung: b.dung, nhan: "✏️ " + ngBai.ten, sau: [b.id, b.q.replace("___", b.opts[b.dung])] }));
    qzChay({ ds, xong: (d, n) => TH.manXong("ng-" + ngBai.id, TH.soSao(d, n), `Bé chọn đúng ngay ${d}/${n} câu`) });
  }
  g("ng-lam").onclick = ktNg;

  // ================= VIẾT TỪ (đánh vần) =================
  const tuViet = w => /^[A-Za-z]{3,12}$/.test(w.en);
  let vt = null;
  function moVt(ds, xong, khoaSao) {
    kieu = "vt";
    vt = { ds: ds.slice(0, 6), so: 0, dung: 0, xong, khoaSao };
    napAm(vt.ds.map(w => w.id)); sang("vt"); vtVe();
  }
  function vtVe() {
    const w = vt.ds[vt.so]; vt.sai = 0; vt.khoa = false; vt.dat = [];
    const chu = w.en.toLowerCase().split("");
    vt.chu = chu; vt.tiles = tron(chu.map((c, i) => ({ c, i })));
    g("vt-td").style.width = (vt.so / vt.ds.length * 100) + "%";
    g("vt-hinh").innerHTML = hinhTu(w); g("vt-vi").textContent = (w.vi || "").split(" · ")[0];
    g("vt-o").className = "vt-o";
    vtDung();
    setTimeout(() => { if (vt.ds[vt.so] === w && !vt.khoa) phat(w.id, w.en); }, 250);
  }
  function vtDung() {
    g("vt-o").innerHTML = vt.chu.map((c, i) => `<span class="${i < vt.dat.length ? "co" : ""}">${i < vt.dat.length ? esc(vt.dat[i].c) : ""}</span>`).join("");
    const dungRoi = new Set(vt.dat.map(x => x.i));
    g("vt-chu").innerHTML = vt.tiles.map(t => `<button data-i="${t.i}" class="${vt.sai >= 2 && t.i === vt.dat.length ? "goiy" : ""}" ${dungRoi.has(t.i) ? "disabled" : ""}>${esc(t.c)}</button>`).join("");
  }
  function vtChon(i) {
    if (!vt || vt.khoa) return;
    const t = vt.tiles.find(x => x.i === i); if (!t || vt.dat.some(x => x.i === i)) return;
    vt.dat.push(t); vtDung();
    if (vt.dat.length < vt.chu.length) return;
    const w = vt.ds[vt.so];
    if (vt.dat.map(x => x.c).join("") === vt.chu.join("")) {
      vt.khoa = true; g("vt-o").classList.add("dung"); phao(8); tiengDung();
      if (!vt.sai) { vt.dung++; tuDung(w.id); }
      phatLanLuot([[w.id, w.en]], () => { if (!dangMo("vt")) return; vt.so++; vt.so < vt.ds.length ? vtVe() : vt.xong(vt.dung, vt.ds.length); });
    } else {
      if (!vt.sai) tuSai(w.id);
      vt.sai++; tiengSai(); g("vt-o").classList.add("sai");
      setTimeout(() => {
        g("vt-o").classList.remove("sai"); vt.dat = []; vtDung();   // sai từ 2 lần: chữ cần bấm kế tiếp nhấp nháy
      }, 600);
    }
  }
  g("vt-chu").onclick = e => { const b = e.target.closest("button"); if (b && !b.disabled) vtChon(+b.dataset.i); };
  g("vt-xoa").onclick = () => { if (vt && !vt.khoa) { vt.dat.pop(); vtDung(); } };
  g("vt-nghe").onclick = () => { if (vt) { const w = vt.ds[vt.so]; phat(w.id, w.en); } };
  document.addEventListener("keydown", e => {
    if (!dangMo("vt") || !vt || vt.khoa) return;
    if (e.key === "Backspace") return g("vt-xoa").click();
    if (!/^[a-z]$/i.test(e.key)) return;
    const dung = new Set(vt.dat.map(x => x.i)), t = vt.tiles.find(x => x.c === e.key.toLowerCase() && !dung.has(x.i));
    if (t) vtChon(t.i);
  });
  const tuDonTheoChuDe = id => TU_VUNG.find(c => c.id === id).tu.filter(tuViet);
  function moVtChuDe(id) {
    const ds = tron(tuDonTheoChuDe(id)).slice(0, 6);
    moVt(ds.map(w => ({ ...w, chuDe: TU_VUNG.find(c => c.id === id) })), (d, n) => TH.manXong("vt-" + id, TH.soSao(d, n), `Bé viết đúng ngay ${d}/${n} từ`));
    vtId = id;
  }
  let vtId = "";

  // ================= TRÒ CHƠI ÔN =================
  function nguonTu() {   // từ bé đã học (nếu đủ) hoặc từ vựng chung có hình
    const tn = docTuNho(), mp = new Map(TU_VUNG.flatMap(c => c.tu.map(t => [t.id, { ...t, chuDe: c }])));
    const hoc = Object.keys(tn).filter(id => mp.has(id)).map(id => mp.get(id));
    return hoc.length >= 8 ? hoc : [...mp.values()];
  }
  let gh = null;
  function moGhep() {
    kieu = "tc-ghep";
    const co = nguonTu().filter(t => t.chuDe.kieu !== "chu");
    const ds = tron(co).slice(0, 6);
    const cards = tron(ds.flatMap(t => [{ id: t.id, loai: "h", t }, { id: t.id, loai: "t", t }]));
    gh = { cards, mo: [], khop: 0, lan: 0, ds };
    napAm(ds.map(t => t.id)); document.body.style.setProperty("--mau", "#7E57C2");
    g("ghep-lan").textContent = "0 lần"; sang("tc-ghep");
    g("ghep").innerHTML = cards.map((c, i) => `<button data-i="${i}">❓</button>`).join("");
  }
  g("ghep").onclick = e => {
    const b = e.target.closest("button"); if (!gh || !b || b.classList.contains("mo") || b.classList.contains("khop") || gh.mo.length >= 2) return;
    const i = +b.dataset.i, c = gh.cards[i]; b.classList.add("mo");
    b.innerHTML = c.loai === "h" ? hinhTu(c.t) : esc(c.t.en); if (c.loai === "t") phat(c.t.id, c.t.en);
    gh.mo.push(i);
    if (gh.mo.length < 2) return;
    gh.lan++; g("ghep-lan").textContent = gh.lan + " lần";
    const [a, d] = gh.mo.map(k => gh.cards[k]);
    const bs = gh.mo.map(k => g("ghep").children[k]);
    if (a.id === d.id && a.loai !== d.loai) {
      tiengDung(); phat(a.t.id, a.t.en); bs.forEach(x => { x.classList.remove("mo"); x.classList.add("khop"); }); gh.mo = []; gh.khop++;
      if (gh.khop === gh.ds.length) setTimeout(() => dangMo("tc-ghep") && TH.manXong("tc-ghep", gh.lan <= gh.ds.length + 4 ? 3 : gh.lan <= gh.ds.length * 2 + 2 ? 2 : 1, `Bé ghép xong sau ${gh.lan} lần lật`), 900);
    } else {
      tiengSai(); setTimeout(() => { bs.forEach(x => { x.classList.remove("mo"); x.textContent = "❓"; }); gh.mo = []; }, 900);
    }
  };
  let nh = null;
  function moNhanh() {
    kieu = "tc-nhanh";
    const co = nguonTu();
    nh = { ds: tron(co), so: 0, diem: 0, sai: 0, t: 60, het: false };
    document.body.style.setProperty("--mau", "#FF7043");
    napAm(nh.ds.slice(0, 30).map(t => t.id)); sang("tc-nhanh"); nhVe();
    clearInterval(nh.iv); nh.iv = setInterval(() => {
      if (!dangMo("tc-nhanh")) { clearInterval(nh.iv); return; }
      nh.t--; g("nhanh-gio").style.width = (nh.t / 60 * 100) + "%";
      if (nh.t <= 0) { clearInterval(nh.iv); nh.het = true; const d = nh.diem; TH.manXong("tc-nhanh", d >= 12 ? 3 : d >= 7 ? 2 : 1, `Bé trả lời đúng ${d} từ trong 60 giây`); }
    }, 1000);
  }
  function nhVe() {
    const x = nh.ds[nh.so % nh.ds.length]; nh.khoa = false; nh.cur = x;
    const cung = x.chuDe.tu.filter(t => t.id !== x.id);
    const lua = tron([x, ...tron(cung).slice(0, 3)]);
    g("nhanh-diem").textContent = "⭐ " + nh.diem;
    g("nhanh-da").classList.remove("xong");
    g("nhanh-da").innerHTML = lua.map(t => `<button class="lua-chon" data-id="${t.id}"><span class="tx"><b>${esc(t.en)}</b></span></button>`).join("");
    phat(x.id, x.en);
  }
  g("nhanh-nghe").onclick = () => nh && nh.cur && phat(nh.cur.id, nh.cur.en);
  g("nhanh-da").onclick = e => {
    const b = e.target.closest(".lua-chon"); if (!nh || nh.het || nh.khoa || !b) return;
    if (b.dataset.id === nh.cur.id) { nh.khoa = true; nh.diem++; tuDung(nh.cur.id); tiengDung(); b.classList.add("dung"); setTimeout(() => { if (!nh.het && dangMo("tc-nhanh")) { nh.so++; nhVe(); } }, 350); }
    else { tuSai(nh.cur.id); tiengSai(); b.classList.add("sai"); nh.t = Math.max(0, nh.t - 3); }
  };

  // ================= THI THỬ MOVERS =================
  const KHIEN = [[90, 5], [75, 4], [60, 3], [40, 2], [0, 1]];
  const bacKhien = p => KHIEN.find(([m]) => p >= m)[1];
  let thiTok = 0;
  function moThi() {
    kieu = "thi";
    document.body.style.setProperty("--mau", "#5C6BC0");
    const bai = tron(TINH_HUONG).flatMap(b => tron(b.luot).slice(0, 1).map(l => ({ b, l }))).slice(0, 8);
    const nghe = bai.map(({ b, l }) => {
      const khac = tron(TINH_HUONG.flatMap(x => x.luot).filter(y => y.a !== l.a)).slice(0, 2);
      const opts = tron([l.a, ...khac.map(y => y.a)]);
      return { q: "🎧 Listen and choose the best answer.", qvi: "Nghe rồi chọn câu trả lời phù hợp.", audio: [l.id + "-q", l.q], opts, dung: opts.indexOf(l.a), nhan: "Part 1 · Listening", an: false, phan: "nghe" };
    });
    const nguPhap = tron(NGU_PHAP.flatMap(b => b.bt.map(q => ({ b, q })))).slice(0, 8).map(({ b, q }) => ({ q: q.q, qvi: q.vi, opts: q.opts, dung: q.dung, nhan: "Part 2 · Grammar", sau: [q.id, q.q.replace("___", q.opts[q.dung])], phan: "nguphap" }));
    const doan = tron(BAI_DOC.filter(b => b.dai))[0];
    const van = `<b>${esc(doan.ten)}</b><br>` + doan.trang.flatMap(t => t.cau).map(c => esc(c.en)).join(" ");
    const doc = doan.hoi.map(h => ({ q: h.q, qvi: h.qvi, opts: h.dap, dung: h.dung, doan: van, nhan: "Part 3 · Reading", phan: "doc" }));
    const tu = tron(TU_VUNG.flatMap(c => c.tu.filter(tuViet).filter(() => true).map(t => ({ ...t, chuDe: c })))).slice(0, 4);
    const noi = tron(TINH_HUONG.flatMap(b => b.luot)).slice(0, 2);
    const tok = ++thiTok;
    const kq = { nghe: [0, 0], nguphap: [0, 0], doc: [0, 0], viet: [0, 0] };
    napAm(nghe.map(x => x.audio[0]));
    const tong = (p, d, n) => { kq[p][0] += d; kq[p][1] += n; };
    (async () => {
      for (const [ds, p] of [[nghe, "nghe"], [nguPhap, "nguphap"], [doc, "doc"]]) {
        const d = await new Promise(ok => qzChay({ ds, cheDo: "thi", xong: dd => ok(dd) }));
        if (!thiSong()) return; tong(p, d, ds.length);
      }
      const dViet = await new Promise(ok => moVt(tu, d => ok(d), "thi-viet"));
      if (!thiSong()) return; tong("viet", dViet, tu.length);
      let i = 0;
      const noiTiep = () => {
        if (i >= noi.length) return ketThi();
        const l = noi[i++]; kieu = "thi"; document.body.style.setProperty("--mau", "#7E57C2");
        g("thi-noi-en").textContent = l.a; g("thi-noi-vi").textContent = l.avi; g("thi-noi-td").style.width = (i / noi.length * 100) + "%";
        g("thi-noi-nghe").onclick = () => phat(l.id + "-a", l.a); g("thi-noi-tiep").onclick = noiTiep;
        g("thi-noi-ghi").onclick = () => window.ghiAmNoi && ghiAmNoi(g("thi-noi-ghi"), [l.id + "-a", l.a], "🎙️ Con nói đi");
        napAm([l.id + "-a"]); sang("thi-noi");
      };
      noiTiep();
    })();
    function ketThi() {
      let d = 0, n = 0; Object.values(kq).forEach(([a, b]) => { d += a; n += b; });
      const p = n ? Math.round(d / n * 100) : 0, k = bacKhien(p);
      const ls = lay("thi-ds", []); ls.push({ ngay: hom(), p, k }); luu("thi-ds", ls.slice(-20));
      TH.manXong("thi-movers", k >= 4 ? 3 : k >= 2 ? 2 : 1, `Nghe ${kq.nghe[0]}/${kq.nghe[1]} · Ngữ pháp ${kq.nguphap[0]}/${kq.nguphap[1]} · Đọc ${kq.doc[0]}/${kq.doc[1]} · Viết ${kq.viet[0]}/${kq.viet[1]}`);
      g("xong-loi").innerHTML = `<span class="ketqua-khien">${"🛡️".repeat(k)}</span><br>${p}% — ${k} khiên`;
    }
    const thiSong = () => tok === thiTok && (dangMo("qz") || dangMo("vt") || dangMo("thi-noi"));
  }

  // ================= LỘ TRÌNH 60 NGÀY (bé 10 tuổi) =================
  const SO10 = 60, CAP10 = ["🌱 Movers khởi động", "🌿 Movers", "🌳 Movers nâng cao"];
  const STK10 = "🦄 🐶 🐱 🦊 🐼 🐨 🐯 🦁 🐸 🐵 🐧 🐢 🐙 🦋 🐝 🐞 🦖 🐳 🐬 🦀 🌈 ⭐ 🌙 🌞 🍀 🌻 🌸 🍓 🍉 🍦 🍩 🎈 🎁 🎨 🚀 🚂 ⚽ 🏆 👑 💎 🎸 🎺 🧸 🪁 🛼 🚁 🎠 🍭 🧁 🥨 🦒 🦓 🐘 🦔 🦦 🦩 🐠 🐊 🦜".split(" ");
  const docLt10 = () => lay("lo-trinh10", {});
  const chuoi10 = lt => (lt.ngayCuoi === hom() || lt.ngayCuoi === homQua()) ? (lt.chuoi || 0) : 0;
  function veLt10() {
    const lt = docLt10(), xong = lt.xong || 0, nay = Math.min(xong + 1, SO10);
    let h = `<div class="lt-dau"><span>🔥 ${chuoi10(lt)} ngày liên tiếp</span><span>🎖️ ${xong}/${SO10}</span></div>`;
    h += `<button class="lt-nut" data-ngay10="${nay}" style="animation:none">▶️ Học Ngày ${nay}<small>${CAP10[Math.floor((nay - 1) / 20)]} · khoảng 15 phút</small></button>`;
    for (let c = 0; c < 3; c++) {
      h += `<div class="lt-cap"><h3>Cấp ${c + 1}: ${CAP10[c]}</h3><div class="lt-hang">`;
      for (let d = c * 20 + 1; d <= c * 20 + 20; d++) {
        const lop = d <= xong ? "xong" : d === nay ? "nay" : "khoa";
        h += `<button class="lt-o ${lop}" data-ngay10="${d}">${d <= xong ? STK10[(d - 1) % STK10.length] : d > nay ? "🔒" : d}</button>`;
      }
      h += `</div></div>`;
    }
    return h;
  }
  const docPool = () => [...BAI_DOC.filter(b => b.cap >= 2)].sort((a, b) => a.cap - b.cap);
  const vtPool = () => TU_VUNG.slice().sort((a, b) => (b.movers ? 1 : 0) - (a.movers ? 1 : 0)).flatMap(c => c.tu.filter(tuViet).map(t => ({ ...t, chuDe: c })));
  function buocNgay(d) {
    const th = TINH_HUONG[(d - 1) % TINH_HUONG.length], bs = [];
    if (TH.tuDenHan(1).length) bs.push({ t: "🔁 Ôn từ cũ", go: () => TH.moOn("han") });
    bs.push({ t: `🗣️ Tình huống: ${th.vi}`, go: () => moBai(th.id) });
    if (d % 2 === 1) { const ng = NGU_PHAP[((d - 1) / 2) % NGU_PHAP.length]; bs.push({ t: `📐 Ngữ pháp: ${ng.vi}`, go: () => moNg(ng.id) }); }
    else { const dp = docPool(), b = dp[(d / 2 - 1) % dp.length]; bs.push({ t: `📰 Bài đọc: ${b.vi}`, go: () => TH.moBaiDoc(b.id) }); }
    const pool = vtPool(), ds = Array.from({ length: 5 }, (_, i) => pool[((d - 1) * 5 + i) % pool.length]);
    bs.push({ t: "🔤 Viết 5 từ mới", go: () => moVt(ds, (x, n) => TH.manXong("l10-vt", TH.soSao(x, n), `Bé viết đúng ngay ${x}/${n} từ`)) });
    bs.push(d % 2 ? { t: `🧩 Xếp câu: ${th.vi}`, go: () => moXc(th.id) } : { t: `✍️ Điền từ: ${th.vi}`, go: () => TH.moDt(th.id) });
    return bs;
  }
  let l10 = null;
  function moNgay10(d) {
    const lt = docLt10();
    if (d > Math.min((lt.xong || 0) + 1, SO10)) { tiengSai(); return; }
    l10 = { d, bs: buocNgay(d), i: 0 }; kieu = "l10";
    document.body.style.setProperty("--mau", "#5C6BC0");
    g("l10-ten").textContent = "Ngày " + d;
    g("l10-khung").innerHTML = `<div class="ngay-nhom">${CAP10[Math.floor((d - 1) / 20)]}</div><div class="ngay-gioi" style="text-align:left">${l10.bs.map(b => esc(b.t)).join("<br>")}</div>`;
    g("l10-tiep").textContent = "Bắt đầu 🚀"; g("l10-tiep").onclick = () => l10Chay(0);
    sang("l10");
  }
  function l10Chay(i) {
    if (i >= l10.bs.length) return l10Xong();
    l10.i = i; lt10Cb = () => l10Chay(i + 1);
    l10.bs[i].go();
  }
  function l10Xong() {
    lt10Cb = null; const lt = docLt10(), moi = l10.d > (lt.xong || 0);
    if (lt.ngayCuoi !== hom()) { lt.chuoi = lt.ngayCuoi === homQua() ? (lt.chuoi || 0) + 1 : 1; lt.ngayCuoi = hom(); }
    if (moi) lt.xong = l10.d; luu("lo-trinh10", lt);
    g("l10-ten").textContent = "Ngày " + l10.d + " ✅";
    g("l10-khung").innerHTML = `<div class="ngay-nhom">${moi ? "🎉 Con nhận sticker mới!" : "🎉 Ôn lại xong rồi!"}</div><div class="sticker-to">${STK10[(l10.d - 1) % STK10.length]}</div><div class="ngay-gioi">🔥 ${lt.chuoi} ngày liên tiếp<br>🎖️ ${lt.xong}/${SO10} sticker</div>`;
    g("l10-tiep").textContent = "🗺️ Về bản đồ"; g("l10-tiep").onclick = () => { tuoi = "10"; khu = "lt10"; ghiNho("khu-10", "lt10"); veTrangChu(); };
    sang("l10"); phao(30); phat("_well-done", "Well done! You did it!");
  }

  // ================= TRANG CHỦ: các khu mới =================
  const oChung = (c, att, bieu, ten, vi, sao, loai) => `<button class="o" style="--mau:${c}" ${att}><span class="sao">${"⭐".repeat(sao || 0)}</span>${loai ? `<span class="loai">${loai}</span>` : ""}<span class="bieu">${bieu}</span><span class="ten" style="font-size:19px;text-align:center;line-height:1.05;padding:0 6px">${esc(ten)}</span><span class="vi">${esc(vi)}</span></button>`;
  const veKhuGoc = window.veKhuThem;
  window.veKhuThem = function (k, sao) {
    if (k === "lt10") return veLt10();
    if (k === "ng") return NGU_PHAP.map(b => oChung(b.mau, `data-ng="${b.id}"`, b.emoji, b.ten, b.vi, sao["ng-" + b.id])).join("");
    if (k === "vt") return [...TU_VUNG].sort((a, b) => (b.movers ? 1 : 0) - (a.movers ? 1 : 0)).filter(c => c.tu.filter(tuViet).length >= 4).map(c => oChung(c.mau, `data-vt="${c.id}"`, c.emoji, c.ten, c.vi, sao["vt-" + c.id], c.movers ? "Movers" : "")).join("");
    if (k === "tc") return `<div class="tc-ds" style="grid-column:1/-1">
      <button class="lt-nut" data-tc="ghep" style="animation:none;background:linear-gradient(135deg,#7E57C2,#AB47BC)">🃏 Ghép cặp<small>Lật thẻ, ghép hình với từ</small></button>
      <button class="lt-nut" data-tc="nhanh" style="animation:none;background:linear-gradient(135deg,#FF7043,#FFA726)">⚡ Nghe nhanh<small>60 giây, nghe và chọn từ đúng</small></button></div>`;
    if (k === "thi") { const ls = lay("thi-ds", []), cuoi = ls[ls.length - 1];
      return `<div class="tc-ds" style="grid-column:1/-1"><button class="lt-nut" data-thi="1" style="animation:none;background:linear-gradient(135deg,#5C6BC0,#29B6F6)">📝 Thi thử Movers<small>Nghe · Ngữ pháp · Đọc · Viết · Nói · khoảng 15 phút</small></button>
      <div class="lt-dau"><span>${cuoi ? `🛡️ Lần gần nhất: ${cuoi.k} khiên (${cuoi.p}%)` : "Chưa thi lần nào"}</span></div></div>`; }
    if (k === "tv") {   // bé 5 tuổi chỉ thấy từ Starters; bé 10 tuổi thấy từ Movers trước
      const ds = tuoi === "5" ? TU_VUNG.filter(c => !c.movers) : [...TU_VUNG.filter(c => c.movers), ...TU_VUNG.filter(c => !c.movers)];
      return TH.onNut("on-hang") + ds.map(c => oChuDe(c, sao)).join("");
    }
    return veKhuGoc(k, sao);
  };
  const bamGoc = window.bamThem;
  window.bamThem = function (e) {
    const o = e.target.closest("[data-ng],[data-vt],[data-tc],[data-thi],[data-ngay10]");
    if (!o) return bamGoc(e);
    const d = o.dataset;
    if (d.ng) moNg(d.ng); else if (d.vt) moVtChuDe(d.vt); else if (d.tc === "ghep") moGhep(); else if (d.tc === "nhanh") moNhanh();
    else if (d.thi) moThi(); else if (d.ngay10) moNgay10(+d.ngay10);
    return true;
  };
  window.ghiAmNoi = window.ghiAmNoi || null;
  Object.assign(window.lamLai, {
    ng: { hoc: () => moNg(ngBai.id), choi: () => ktNg() },
    vt: { hoc: () => moVtChuDe(vtId || TU_VUNG[0].id), choi: () => moVtChuDe(vtId || TU_VUNG[0].id) },
    "tc-ghep": { hoc: moGhep, choi: moGhep }, "tc-nhanh": { hoc: moNhanh, choi: moNhanh }, thi: { hoc: moThi, choi: moThi },
  });
  window.hocHomNay10 = () => moNgay10(Math.min((docLt10().xong || 0) + 1, SO10));
  window.ngayHomNay10 = () => Math.min((docLt10().xong || 0) + 1, SO10);
  veTrangChu();
})();
