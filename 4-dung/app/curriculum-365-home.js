/* Focused home: learn now, current path, one library. Existing records stay separate. */
(function(){
"use strict";
if(!window.English365Player||!window.English365Curriculum)return;
const data=English365Curriculum,player=English365Player,home=document.getElementById("trang-chu"),cta=document.getElementById("hom-nay"),legacyClick=cta.onclick;
const esc=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const select=document.createElement("div");select.id="english365-selector";select.className="english365-selector";document.getElementById("ux-home-panel").before(select);
function choice(){
 const saved=nho("english365-v1-path-choice-"+tuoi,"");
 if(saved==="365"||saved==="legacy")return saved;
 try{const old=JSON.parse(nho(tuoi==="10"?"lo-trinh10":"lo-trinh","{}"));return Number(old.xong)>0?"legacy":"365";}catch{return"365";}
}
function setChoice(v){ghiNho("english365-v1-path-choice-"+tuoi,v);veTrangChu();}
select.onclick=e=>{const b=e.target.closest("[data-learning-path]");if(b)setChoice(b.dataset.learningPath);else if(e.target.closest("[data-parent-open]"))document.getElementById("vao-pp").click();};
function decorate(){
 const isHome=home.classList.contains("ux-home"),path=choice(),panel=document.getElementById("ux-home-panel");
 select.hidden=!isHome;home.classList.toggle("english365-active",isHome&&path==="365");cta.onclick=legacyClick;
 if(!isHome)return;
 select.innerHTML='<details class="english365-home-options"><summary>Tuỳ chọn</summary><div role="group" aria-label="Chọn lộ trình học"><button data-learning-path="365" aria-pressed="'+(path==="365")+'">365 buổi</button><button data-learning-path="legacy" aria-pressed="'+(path==="legacy")+'">Lộ trình cũ</button></div><button data-parent-open>Dành cho ba mẹ</button></details>';
 if(path!=="365"){panel.before(select);return;}
 const p=player.getStatus(),completed=new Set(p.completedLessonIds||[]),day=Math.min(365,Math.max(1,p.resumeDay||p.nextDay||1)),isFinished=completed.size===data.lessons.length;
 const lesson=data.lessons.find(x=>x.day===day)||data.lessons[0],unit=data.units.find(x=>x.id===lesson.unit_id)||data.units[0],unitIndex=data.units.indexOf(unit),unitLessons=data.lessons.filter(l=>l.unit_id===unit.id);
 const ready=(p.readyUnitIds||[]).map(id=>data.units.find(u=>u.id===id)).filter(Boolean),reviewUnit=ready.at(-1);
 const pathHtml='<section class="english365-path" aria-labelledby="english365-path-heading"><div class="english365-path-heading"><div><small>'+(isFinished?'ÔN LẠI':'CHẶNG HIỆN TẠI')+'</small><h2 id="english365-path-heading">Bài trong chương</h2></div></div><ol>'+unitLessons.map(l=>{const done=completed.has(l.id),current=!isFinished&&l.day===day;const title=l.title_vi.startsWith(unit.title_vi+': ')?l.title_vi.slice(unit.title_vi.length+2):l.title_vi;return '<li class="'+(current?'current':done?'done':'upcoming')+'"><button data-365-open="'+l.day+'"'+(current?' aria-current="step"':'')+'><span class="english365-path-node" aria-hidden="true">'+(done?'✓':l.day)+'</span><span class="english365-path-copy"><small>BUỔI '+l.day+(current?' · ĐANG HỌC':done?' · HỌC LẠI':'')+'</small><strong>'+esc(title)+'</strong></span><span class="english365-path-play" aria-hidden="true">'+(current?'▶':'→')+'</span></button></li>';}).join('')+'</ol></section>';
 cta.remove();select.remove();
 panel.innerHTML='<section class="ux-hero english365-simple-hero" aria-labelledby="ux-title"><div class="ux-hero-copy"><div class="ux-eyebrow">BUỔI '+day+' · CHƯƠNG '+(unitIndex+1)+'</div><h2 id="ux-title">'+esc(unit.title_vi)+'</h2><div id="english365-cta"></div></div></section>'+pathHtml+'<div class="ux-actions english365-simple-actions">'+(reviewUnit?'<button class="ux-action" id="english365-review-entry"><span aria-hidden="true">↻</span><strong>Ôn chương '+(data.units.indexOf(reviewUnit)+1)+'</strong><span aria-hidden="true">→</span></button>':'')+'<button class="ux-action secondary" id="english365-library"><span aria-hidden="true">📚</span><strong>Chọn bài khác</strong><span aria-hidden="true">→</span></button></div><div id="english365-home-options"></div>';
 document.getElementById("english365-cta").append(cta);cta.textContent=(isFinished?"Học lại buổi "+day:p.resumeDay?"Tiếp tục buổi "+day:"Học buổi "+day)+' →';cta.onclick=()=>player.openLesson(day);
 document.getElementById("english365-home-options").append(select);
 if(reviewUnit)document.getElementById("english365-review-entry").onclick=()=>player.openUnitReview(reviewUnit.id);
 document.getElementById("english365-library").onclick=()=>player.openHome();
 panel.querySelectorAll("[data-365-open]").forEach(b=>b.onclick=()=>player.openLesson(Number(b.dataset["365Open"])));
}
const oldSang=window.sang;window.sang=function(id){oldSang(id);if(id==="trang-chu")decorate();};
const toggle=document.getElementById("ux-home-toggle"),oldToggle=toggle.onclick;toggle.onclick=function(e){oldToggle.call(this,e);decorate();};
const oldClear=window.clearDailyReview;window.clearDailyReview=function(){oldClear?.();player.clearProfile({confirm:false});};
window.addEventListener('english365:change',()=>{if(home.classList.contains('hien'))veTrangChu();});
decorate();
})();
