/* Daily launch/review adapter for the existing 100/60-day curriculum.
   No migration, child data upload, network analytics, or v7 claims. */
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.DailyLaunchCore=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";
const titles5=["Hạt mầm","Chồi non","Lá xanh","Cây con","Nở hoa","Kết trái","Bươm bướm","Chim non","Đại bàng","Nhà vô địch"];
const titles10=["Movers khởi động","Movers","Movers nâng cao"];
function config(age){return String(age)==="10"?{days:60,span:20,count:3,perDay:5,titles:titles10}:{days:100,span:10,count:10,perDay:4,titles:titles5};}
function pool(data,age){
 const groups=String(age)==="10"?data.slice().sort((a,b)=>Number(!!b.movers)-Number(!!a.movers)):data.filter(c=>!c.movers);
 return groups.flatMap(c=>c.tu.filter(t=>String(age)!=="10"||/^[A-Za-z]{3,12}$/.test(t.en)).map(t=>({...t,topic:c.vi,topicId:c.id})));
}
function dayWords(data,age,day){const p=pool(data,age), c=config(age);if(!p.length)return[];const d=Math.max(1,Math.min(c.days,Math.floor(Number(day)||1)));return Array.from({length:c.perDay},(_,i)=>p[((d-1)*c.perDay+i)%p.length]);}
function chapterWords(data,age,index){
 const c=config(age);if(!Number.isInteger(index)||index<0||index>=c.count)return[];
 const unique=new Map();for(let d=index*c.span+1;d<=(index+1)*c.span;d++)for(const w of dayWords(data,age,d))unique.set(w.id,w);return [...unique.values()];
}
function taughtWords(data,age,index,completed,memory={}){
 const c=config(age), known=new Set();
 for(let d=index*c.span+1;d<=Math.min(completed,(index+1)*c.span);d++)for(const w of dayWords(data,age,d))known.add(w.id);
 return chapterWords(data,age,index).filter(w=>known.has(w.id)||(memory[w.id]?.h||0)>0||(memory[w.id]?.s||0)>0);
}
function reviewWords(words,memory={},limit=6){
 return words.map((w,i)=>({w,i,priority:(memory[w.id]?.s||0)*10-(memory[w.id]?.h||0)})).sort((a,b)=>b.priority-a.priority||a.i-b.i).slice(0,limit).map(x=>x.w);
}
function choices(target,words,seed=0){
 const same=words.filter(w=>w.id!==target.id&&w.topicId===target.topicId);
 const other=words.filter(w=>w.id!==target.id&&w.topicId!==target.topicId);
 const found=[...same,...other], pick=found.length?[found[seed%found.length],found[(seed+Math.ceil(found.length/2))%found.length]]:[];
 const unique=[...new Map([target,...pick,...found].map(w=>[w.id,w])).values()].slice(0,3);
 const shift=seed%unique.length;return unique.slice(shift).concat(unique.slice(0,shift));
}
function validSession(s,age,profile,validIds){
 return !!s&&s.version===1&&s.age===String(age)&&s.profile===profile&&Number.isInteger(s.chapter)&&s.chapter>=0&&s.chapter<config(age).count&&Array.isArray(s.ids)&&s.ids.length>0&&s.ids.length<=6&&new Set(s.ids).size===s.ids.length&&s.ids.every(id=>validIds.has(id))&&Number.isInteger(s.cursor)&&s.cursor>=0&&s.cursor<=s.ids.length&&Number.isInteger(s.correct)&&s.correct>=0&&typeof s.answered==="boolean"&&s.correct<=s.ids.length&&s.correct<=s.cursor+(s.answered?1:0)&&!(s.cursor===s.ids.length&&s.answered)&&Array.isArray(s.missed)&&s.missed.every(id=>s.ids.includes(id))&&Array.isArray(s.tried)&&s.tried.every(id=>validIds.has(id));
}
return {config,pool,dayWords,chapterWords,taughtWords,reviewWords,choices,validSession};
});