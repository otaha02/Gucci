const tasks=[...document.querySelectorAll('.task')], progressText=document.getElementById('progressText'), status=document.getElementById('status'), finish=document.getElementById('finish');
const saved=JSON.parse(localStorage.getItem('french90_day1')||'[]'); tasks.forEach((x,i)=>x.checked=!!saved[i]);
function update(){const done=tasks.filter(x=>x.checked).length,total=tasks.length;progressText.textContent=`${done} of ${total} activities completed`;status.textContent=done===total?'Amazing — you completed everything!':'Complete every activity, then finish Day 1.';finish.disabled=done!==total;localStorage.setItem('french90_day1',JSON.stringify(tasks.map(x=>x.checked)));document.getElementById('journeyProgress').textContent=`${done} of ${total} activities completed`;}
tasks.forEach(x=>x.addEventListener('change',update));
document.getElementById('checkWriting').addEventListener('click',()=>{const text=document.getElementById('writing').value.toLowerCase();const answers=['m appelle','habite','ai','aime'];const ok=answers.every(a=>text.includes(a));document.getElementById('writingMessage').textContent=ok?'✓ Looks good! Compare with the phrases above.':'Keep trying — use: m’appelle, habite, ai, aime.';});
finish.addEventListener('click',()=>alert('🎉 Day 1 complete! Your next lesson is coming soon.'));

const VKEY='french90_vocabulary_v1';
let words=JSON.parse(localStorage.getItem(VKEY)||'[]');
const saveWords=()=>localStorage.setItem(VKEY,JSON.stringify(words));
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function renderWords(){
 document.getElementById('wordCount').textContent=words.length;
 const list=document.getElementById('vocabList');
 if(!words.length){list.innerHTML='<p>No words saved yet. Add French you notice during lessons, videos, work, shops or conversations.</p>';return;}
 list.innerHTML=words.slice().reverse().map((w,ri)=>{const i=words.length-1-ri;return `<div class="word-row"><div><b>${esc(w.fr)}</b><small>${esc(w.example||'')}</small></div><div><span>${esc(w.en)}</span></div><button class="delete-word" data-delete="${i}" aria-label="Delete">✕</button></div>`}).join('');
 document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{words.splice(+b.dataset.delete,1);saveWords();renderWords();resetCards();});
}
document.getElementById('addWord').onclick=()=>{
 const fr=document.getElementById('vFrench').value.trim(),en=document.getElementById('vEnglish').value.trim(),example=document.getElementById('vExample').value.trim();
 const msg=document.getElementById('vocabMessage');
 if(!fr||!en){msg.textContent='Add both the French and English first.';return;}
 words.push({fr,en,example,added:new Date().toISOString()});saveWords();
 document.getElementById('vFrench').value='';document.getElementById('vEnglish').value='';document.getElementById('vExample').value='';
 msg.textContent='✓ Saved — it is now in your flashcards.';renderWords();resetCards();
};
document.getElementById('clearWords').onclick=()=>{if(words.length&&confirm('Clear all saved vocabulary?')){words=[];saveWords();renderWords();resetCards();}};

let direction='fr-en', deck=[],cardIndex=0;
function resetCards(){deck=[...words].sort(()=>Math.random()-.5);cardIndex=0;renderCard();}
function renderCard(){
 const empty=document.getElementById('emptyCards'),area=document.getElementById('flashArea');
 if(!deck.length){empty.classList.remove('hidden');area.classList.add('hidden');document.getElementById('cardPosition').textContent='';return;}
 empty.classList.add('hidden');area.classList.remove('hidden');
 const w=deck[cardIndex%deck.length],frFirst=direction==='fr-en';
 document.getElementById('cardPromptLabel').textContent=frFirst?'FRENCH':'ENGLISH';
 document.getElementById('cardAnswerLabel').textContent=frFirst?'ENGLISH':'FRENCH';
 document.getElementById('cardFront').textContent=frFirst?w.fr:w.en;
 document.getElementById('cardBack').textContent=frFirst?w.en:w.fr;
 document.getElementById('cardExample').textContent=w.example||'';
 document.getElementById('cardBackWrap').classList.add('hidden');
 document.getElementById('reveal').classList.remove('hidden');document.getElementById('again').classList.add('hidden');document.getElementById('know').classList.add('hidden');
 document.getElementById('cardPosition').textContent=`Card ${cardIndex+1} of ${deck.length}`;
}
document.getElementById('reveal').onclick=()=>{document.getElementById('cardBackWrap').classList.remove('hidden');document.getElementById('reveal').classList.add('hidden');document.getElementById('again').classList.remove('hidden');document.getElementById('know').classList.remove('hidden');};
document.getElementById('know').onclick=()=>{cardIndex=(cardIndex+1)%deck.length;renderCard();};
document.getElementById('again').onclick=()=>{const w=deck.splice(cardIndex,1)[0];deck.push(w);if(cardIndex>=deck.length)cardIndex=0;renderCard();};
document.getElementById('frToEn').onclick=()=>{direction='fr-en';document.getElementById('frToEn').classList.add('active');document.getElementById('enToFr').classList.remove('active');resetCards();};
document.getElementById('enToFr').onclick=()=>{direction='en-fr';document.getElementById('enToFr').classList.add('active');document.getElementById('frToEn').classList.remove('active');resetCards();};

function showView(name){
 document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
 const el=document.getElementById(name+'View')||document.getElementById('homeView');el.classList.remove('hidden');
 document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.view===name));
 window.scrollTo({top:0,behavior:'smooth'});
 if(name==='vocabulary')renderWords();if(name==='flashcards')resetCards();
}
document.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',()=>showView(el.dataset.view)));

if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{}));
renderWords();resetCards();update();