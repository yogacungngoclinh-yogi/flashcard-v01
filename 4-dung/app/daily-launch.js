/* Daily Launch v1: additive UX on the verified flashcards app. */
(function(){
"use strict";
const C=DailyLaunchCore, $id=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const home=$id("trang-chu"), cta=$id("hom-nay"), anchor=document.createComment("classic daily CTA");
cta.before(anchor);
const panel=document.createElement("div");panel.id="ux-home-panel";$id("khu").before(panel);
const toggle=document.createElement("button");toggle.id="ux-home-toggle";home.querySelector(".dau").append(toggle);
let mode="classic", allChapters=false, active=null, storageWarning=false, reviewOrigin=null;
const volatileStore=new Map();
function read(key,fallback){const scoped=khoaHs(key);if(volatileStore.has(scoped))return volatileStore.get(scoped);try{return JSON.parse(localStorage.getItem(scoped))??fallback;}catch{return fallback;}}
function write(key,value){const scoped=khoaHs(key);try{localStorage.setItem(scoped,JSON.stringify(value));volatileStore.delete(scoped);return true;}catch{volatileStore.set(scoped,JSON.parse(JSON.stringify(value)));storageWarning=true;return false;}}
const key=(age,chapter)=>"daily-review-v1-"+age+"-"+chapter;
function getSession(chapter){
 const s=read(key(tuoi,chapter),null), ids=new Set(C.pool(TU_VUNG,tuoi).map(w=>w.id));
 return C.validSession(s,tuoi,hoSo,ids)&&s.cursor<s.ids.length?s:null;
}
function resumeSession(){const n=read("daily-review-latest-"+tuoi,-1);return Number.isInteger(n)&&n<=progress().chapter?getSession(n):null;}
function progress(){
 const cfg=C.config(tuoi), p=read(tuoi==="10"?"lo-trinh10":"lo-trinh",{});
 const completed=Math.min(cfg.days,Math.max(0,Number(p.xong)||0));
 return {cfg,completed,day:Math.min(completed+1,cfg.days),chapter:Math.min(cfg.count-1,Math.floor(completed/cfg.span))};
}
function reviewScope(chapter){
 const p=progress(), words=C.taughtWords(TU_VUNG,tuoi,chapter,p.completed,docTuNho());
 return words.length?{words,preview:false}:p.completed===0&&chapter===0?{words:C.dayWords(TU_VUNG,tuoi,1),preview:true}:{words:[],preview:false};
}
function stopSound(){am.pause();am.onended=null;chuoiAm++;if(window.speechSynthesis)speechSynthesis.cancel();}
function renderHome(){
 const isDaily=mode==="daily";home.classList.toggle("ux-home",isDaily);
 toggle.textContent=isDaily?"Khám phá thư viện ↗":"← Học hôm nay";
 toggle.setAttribute("aria-label",isDaily?"Mở thư viện với giao diện cũ":"Về trang chủ học hôm nay");
 panel.hidden=!isDaily;
 if(!isDaily){anchor.after(cta);return;}
 const p=progress(), words=C.dayWords(TU_VUNG,tuoi,p.day), sample=words[1]||words[0], resume=resumeSession();
 const reviewChapter=resume?.chapter??(reviewScope(p.chapter).words.length?p.chapter:Math.max(0,p.chapter-1)), scope=reviewScope(reviewChapter);
 const reviewSize=resume?.ids.length??Math.min(6,scope.words.length);
 const reviewTitle=resume?"Tiếp tục ôn chương "+(resume.chapter+1):scope.preview?"Khám phá "+reviewSize+" từ đầu tiên":"Ôn nhanh chương "+(reviewChapter+1);
 const done=read("daily-review-results-"+tuoi,{}), end=allChapters?p.cfg.count:Math.min(p.cfg.count,Math.max(3,p.chapter+1));
 const icons=["🌱","🌿","🍀","🌳","🌸","🍎","🦋","🐦","🦅","🏆"];
 const chapterCards=Array.from({length:end},(_,i)=>{
   const start=i*p.cfg.span+1, finish=(i+1)*p.cfg.span, review=reviewScope(i), available=i<=p.chapter&&review.words.length>0;
   const count=Math.min(p.cfg.span,Math.max(0,p.completed-i*p.cfg.span));
   return '<article class="ux-chapter '+(i===p.chapter?"current":"")+'"><span class="ux-chapter-num">Chương '+(i+1)+' · Ngày '+start+'–'+finish+'</span><h3>'+icons[i]+' '+esc(p.cfg.titles[i])+'</h3><p>'+count+'/'+p.cfg.span+' ngày đã học</p><span class="ux-chapter-tag">'+(done[i]?"✓ Đã ôn · "+done[i].correct+"/"+done[i].total+" đúng lần đầu":i===p.chapter?"Bạn đang ở đây":available?"Có thể ôn bất cứ lúc nào":"Học theo nhịp của con")+'</span><button data-ux-review="'+i+'" '+(!available?"disabled":"")+'>'+(getSession(i)?"Tiếp tục ôn →":available?(review.preview?"Thử ":"Ôn nhanh ")+Math.min(6,review.words.length)+" từ →":i<=p.chapter?"Học chương này trước":"Chưa đến chương này")+'</button></article>';
 }).join("");
 // Keep the original CTA element and handler, rather than replacing the learning flow.
 anchor.after(cta);
 panel.innerHTML='<section class="ux-hero" aria-labelledby="ux-title"><div class="ux-hero-copy"><div class="ux-eyebrow">✦ Hành trình nhỏ · Ngày '+p.day+'</div><h2 id="ux-title">Mỗi ngày một chút.<br>Tiếng Anh lớn lên.</h2><p>'+(tuoi==="10"?"Nói trong tình huống thật, đọc và tự viết câu của mình.":"Nghe một từ, tìm một hình, kể một câu chuyện. Cùng con bắt đầu nhé!")+'</p><div class="ux-plan"><span>◷ Khoảng '+(tuoi==="10"?"15":"8")+' phút</span><span>'+p.cfg.perDay+' từ hôm nay</span><span>Không cần vội</span></div><div id="ux-cta-slot"></div></div><div class="ux-hero-art" aria-hidden="true"><div class="ux-word-card">'+(sample?hinhTu(sample):"🌱")+'<strong>'+esc(sample?.en||"Hello!")+'</strong><small>'+esc(sample?.vi||"Chào con!")+'</small></div><div class="ux-art-badge">Một bước mới hôm nay ✨</div></div></section><div class="ux-summary"><div><strong>Hành trình của con</strong><small>'+esc(p.cfg.titles[p.chapter])+' · Chương '+(p.chapter+1)+'/'+p.cfg.count+'</small></div><strong class="ux-count">'+p.completed+'<small> / '+p.cfg.days+' ngày</small></strong></div><div class="ux-track" role="progressbar" aria-label="Số ngày đã học" aria-valuemin="0" aria-valuemax="'+p.cfg.days+'" aria-valuenow="'+p.completed+'"><i style="width:'+(p.completed/p.cfg.days*100)+'%"></i></div><div class="ux-actions"><button class="ux-action" data-ux-review="'+reviewChapter+'"><span class="ux-action-icon" aria-hidden="true">↻</span><span><strong>'+reviewTitle+'</strong><small>'+(resume?"Đã làm "+resume.cursor+"/"+resume.ids.length+" câu. Con tiếp tục nhé.":(scope.preview?"Nghe và chọn hình · Một vòng làm quen nhẹ nhàng":reviewSize+" câu ngắn · Khoảng 3 phút · Chỉ ôn từ đã gặp"))+'</small></span><span class="ux-action-arrow" aria-hidden="true">→</span></button><button class="ux-action secondary" data-ux-khu="'+(tuoi==="10"?"th":"truyen")+'"><span class="ux-action-icon" aria-hidden="true">'+(tuoi==="10"?"💬":"📖")+'</span><span><strong>'+(tuoi==="10"?"Thử nói một tình huống":"Một câu chuyện cùng con")+'</strong><small>'+(tuoi==="10"?"Nghe mẫu, nói theo, dùng trong đời sống.":"Nghe, xem tranh và kể lại theo cách của con.")+'</small></span><span class="ux-action-arrow" aria-hidden="true">→</span></button></div><div class="ux-section-head"><h2>Chương nhỏ, tiến bộ lớn</h2><button class="ux-text-btn" id="ux-chapters-toggle">'+(allChapters?"Thu gọn":"Xem tất cả "+p.cfg.count+" chương")+'</button></div><div class="ux-chapters">'+chapterCards+'</div><div class="ux-library">'+KHU[tuoi].filter(([id])=>!["lt","lt10"].includes(id)).slice(0,6).map(([id,title])=>'<button data-ux-khu="'+id+'">'+esc(title)+' ↗</button>').join("")+'<button id="ux-parent">Dành cho ba mẹ</button></div><p class="ux-note">Tiến độ vẫn lưu trên thiết bị, theo từng hồ sơ. Ôn nhanh không tự mở khóa ngày mới. Đây là lộ trình '+p.cfg.days+' ngày hiện có trong app.</p>'+(storageWarning?'<p class="ux-save-notice">Trình duyệt chưa lưu được tiến độ. Đừng đóng trang nếu con đang ôn.</p>':"");
 $id("ux-cta-slot").append(cta);
 cta.innerHTML=(p.completed===p.cfg.days?"Ôn lại ngày cuối →":"Học hôm nay →")+'<small>Ngày '+p.day+' · '+esc(p.cfg.titles[p.chapter])+'</small>';
 $id("ux-chapters-toggle").onclick=()=>{allChapters=!allChapters;renderHome();$id("ux-chapters-toggle").focus();};
 $id("ux-parent").onclick=()=>$id("vao-pp").click();
}
toggle.onclick=()=>{mode=mode==="daily"?"classic":"daily";renderHome();};
panel.onclick=e=>{
 const review=e.target.closest("[data-ux-review]");if(review&&!review.disabled){startReview(Number(review.dataset.uxReview));return;}
 const nav=e.target.closest("[data-ux-khu]");if(nav){mode="classic";khu=nav.dataset.uxKhu;ghiNho("khu-"+tuoi,khu);veTrangChu();}
};
const screen=document.createElement("section");screen.className="man";screen.id="ux-review";screen.setAttribute("aria-label","Ôn nhanh chương");
screen.innerHTML='<div class="dau"><button class="nut-tron" id="ux-review-exit" aria-label="Về trang chủ">←</button><h1 id="ux-review-title" tabindex="-1"></h1><span id="ux-review-count"></span></div><div class="ux-track" id="ux-review-track" role="progressbar" aria-label="Tiến độ ôn nhanh" aria-valuemin="0"><i></i></div><p id="ux-review-warning" class="ux-save-notice" role="status" hidden></p><div class="ux-review-main" id="ux-review-main"></div>';
document.body.append(screen);
function save(){if(active)write(key(active.age,active.chapter),active);}
function startReview(chapter){
 const p=progress();if(chapter<0||chapter>p.chapter)return;
 stopSound();reviewOrigin=document.activeElement;
 const prior=getSession(chapter), scope=reviewScope(chapter), words=C.reviewWords(scope.words,docTuNho());
 if(!words.length)return;
 active=prior||{version:1,age:String(tuoi),profile:hoSo,chapter,preview:scope.preview,ids:words.map(w=>w.id),cursor:0,correct:0,missed:[],tried:[],answered:false};
 write("daily-review-latest-"+tuoi,chapter);save();
 sang("ux-review");renderQuestion();$id("ux-review-title").focus({preventScroll:true});
 // A single history entry supports browser Back without growing history per question.
 if(location.hash!=="#quick-review")history.pushState({dailyReview:true},"","#quick-review");
}
function leaveReview(fromHistory=false){
 stopSound();save();active=null;
 if(!fromHistory&&location.hash==="#quick-review"&&history.state?.dailyReview)history.back();
 mode="classic";veTrangChu();
 (reviewOrigin&&document.contains(reviewOrigin)?reviewOrigin:toggle).focus({preventScroll:true});
}
$id("ux-review-exit").onclick=()=>leaveReview();
window.addEventListener("popstate",()=>{if(screen.classList.contains("hien")&&location.hash!=="#quick-review")leaveReview(true);else if(location.hash==="#quick-review"&&resumeSession())startReview(resumeSession().chapter);});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&screen.classList.contains("hien")){e.preventDefault();leaveReview();}});
function speakCurrent(){if(!active)return;const t=C.pool(TU_VUNG,tuoi).find(w=>w.id===active.ids[active.cursor]);if(t)phat(t.id,t.en);}
function renderQuestion(){
 const warning=$id("ux-review-warning");warning.hidden=!storageWarning;warning.textContent="Tiến độ chỉ giữ được trong lần mở trang này. Trình duyệt đang chặn lưu; đừng tải lại hoặc đóng trang khi con chưa ôn xong.";
 if(!active||active.cursor>=active.ids.length){renderComplete();return;}
 const s=active, words=C.pool(TU_VUNG,s.age), target=words.find(w=>w.id===s.ids[s.cursor]);
 $id("ux-review-title").textContent=(s.preview?"Làm quen":"Ôn nhanh")+" · Chương "+(s.chapter+1);
 $id("ux-review-count").textContent=(s.cursor+1)+" / "+s.ids.length;
 const track=$id("ux-review-track");track.setAttribute("aria-valuemax",s.ids.length);track.setAttribute("aria-valuenow",s.cursor);track.firstElementChild.style.width=(s.cursor/s.ids.length*100)+"%";
 const opts=C.choices(target,C.chapterWords(TU_VUNG,s.age,s.chapter),s.cursor+s.chapter);
 const textual=TU_VUNG.find(c=>c.id===target.topicId)?.chu;
 $id("ux-review-main").innerHTML='<p class="ux-eyebrow">Nghe · Nhớ · Chọn</p><h2>Con tìm được '+(textual?"từ":"hình")+' nào?</h2><p class="ux-review-prompt">Bấm nghe, rồi chọn. Sai cũng không sao.</p><button class="ux-listen" id="ux-listen">🔊 Nghe từ tiếng Anh</button><div class="ux-review-choices">'+opts.map(w=>'<button class="ux-answer '+(s.answered&&w.id===target.id?"correct":s.tried.includes(w.id)?"wrong":"")+'" data-ux-answer="'+esc(w.id)+'" aria-label="'+esc(w.en)+'" '+(s.answered||s.tried.includes(w.id)?"disabled":"")+'>'+(textual?'<span class="ux-word-text">'+esc(w.en)+'</span>':hinhTu(w))+'</button>').join("")+'</div><div class="ux-feedback" id="ux-feedback" role="status" aria-live="polite">'+(s.answered?'<strong>'+esc(target.en)+' · '+esc(target.vi)+'</strong><br>'+(s.missed.includes(target.id)?"Con đã tìm được rồi. Thử lại là cách mình học!":"Đúng rồi! Con nhớ rất tốt."):s.tried.length?"Chưa đúng rồi. Con nghe lại và thử hình khác nhé.":"")+'</div><button class="ux-next" id="ux-next" '+(!s.answered?"disabled":"")+'>'+(s.cursor===s.ids.length-1?"Xem kết quả →":"Tiếp theo →")+'</button>';
 $id("ux-listen").onclick=speakCurrent;
 $id("ux-next").onclick=()=>{
  if(!active||!active.answered)return;
  stopSound();active.cursor++;active.answered=false;active.tried=[];save();
  if(active.cursor===active.ids.length){const results=read("daily-review-results-"+active.age,{});results[active.chapter]={correct:active.correct,total:active.ids.length,at:new Date().toISOString()};write("daily-review-results-"+active.age,results);}
  renderQuestion();($id("ux-listen")||$id("ux-finish")).focus({preventScroll:true});
 };
 $id("ux-review-main").querySelector(".ux-review-choices").onclick=e=>{
  const b=e.target.closest("[data-ux-answer]");if(!b||b.disabled||!active||active.answered)return;
  if(b.dataset.uxAnswer===target.id){
   active.answered=true;if(!active.missed.includes(target.id)){active.correct++;tuDung(target.id);}save();renderQuestion();phat(target.id,target.en);$id("ux-next").focus({preventScroll:true});
  }else{
   if(!active.missed.includes(target.id)){active.missed.push(target.id);tuSai(target.id);}
   active.tried.push(b.dataset.uxAnswer);save();renderQuestion();$id("ux-listen").focus({preventScroll:true});
  }
 };
}
function renderComplete(){
 if(!active)return;
 const all=C.pool(TU_VUNG,active.age), missed=active.missed.map(id=>all.find(w=>w.id===id)).filter(Boolean);
 $id("ux-review-count").textContent=active.ids.length+" / "+active.ids.length;
 $id("ux-review-track").setAttribute("aria-valuenow",active.ids.length);$id("ux-review-track").firstElementChild.style.width="100%";
 $id("ux-review-main").innerHTML='<div class="ux-complete" aria-hidden="true">🌟</div><h2>Một vòng ôn, thêm tự tin!</h2><p class="ux-review-prompt">Con chọn đúng ngay '+active.correct+'/'+active.ids.length+' từ. '+(missed.length?"Mình sẽ gặp lại các từ còn khó.":"Hôm nay con nhớ rất tốt.")+'</p><div class="ux-result-list">'+(missed.length?missed:active.ids.map(id=>all.find(w=>w.id===id))).map(w=>'<span>'+esc(w.en)+' · '+esc(w.vi)+'</span>').join("")+'</div><button class="ux-next" id="ux-finish">Xong rồi, về nhà →</button><p class="ux-note">Một vòng ôn ngắn không phải bài đánh giá thành thạo.</p>';
 $id("ux-finish").onclick=()=>leaveReview();
}
// Called only after the existing parent reset/delete confirmation succeeds.
window.clearDailyReview=function(){
 for(const age of ["5","10"]){
  const keys=["daily-review-latest-"+age,"daily-review-results-"+age,...Array.from({length:C.config(age).count},(_,i)=>key(age,i))];
  keys.forEach(k=>{const scoped=khoaHs(k);volatileStore.delete(scoped);try{localStorage.removeItem(scoped);}catch{}});
 }
 active=null;
};
const previousSang=window.sang;
window.sang=function(id){previousSang(id);if(id==="trang-chu")renderHome();};
renderHome();
// Resume via browser refresh only when a valid per-profile draft exists.
if(location.hash==="#quick-review"&&resumeSession())startReview(resumeSession().chapter);
})();