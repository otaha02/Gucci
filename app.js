const tasks=[...document.querySelectorAll(".task")];
const progressText=document.querySelector("#progressText"),status=document.querySelector("#status");
const finish=document.querySelector("#finish"),bar=document.querySelector("#bar"),percent=document.querySelector("#percent");
function update(){
  const done=tasks.filter(x=>x.checked).length, total=tasks.length;
  progressText.textContent=`${done} of ${total} activities completed`;
  finish.disabled=done!==total;
  if(done===total) status.textContent="Everything is complete. You are ready to finish Day 1!";
  else status.textContent="Complete every activity, then finish Day 1.";
}
tasks.forEach(x=>x.addEventListener("change",update));

document.querySelector("#checkWriting").addEventListener("click",()=>{
  const s=document.querySelector("#writing").value.toLowerCase();
  const words=["appelle","habite","ai","aime"];
  const found=words.filter(w=>s.includes(w)).length;
  document.querySelector("#writingMessage").textContent =
    found===4 ? "Excellent! All four key words are there. ✓" :
    "Try again. Key words: appelle · habite · ai · aime.";
});

finish.addEventListener("click",()=>{
  if(finish.disabled)return;
  status.textContent="🎉 Beautiful work. Day 1 complete! Your next lesson can build on these phrases.";
  finish.textContent="Day 1 completed ✓";
  const current=1;
  const next=Math.min(90,current+1);
  percent.textContent=Math.round(next/90*100)+"%";
  bar.style.width=(next/90*100)+"%";
});

update();