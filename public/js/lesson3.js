const pages = [
  // Page 1: Introduction
  {type:'info', title:'Introduction', body:[
    "An attack surface is the total number of points where an attacker could try to enter your system.",
    "This challenge tests your knowledge of attack surfaces based on what you learned in the module."
  ]},
  {type:'fill', q:"The larger your ___, the more vulnerable you are to cyber threats.", choices:[
    {t:"attack surface", correct:true},
    {t:"network speed", correct:false},
    {t:"firewall", correct:false},
    {t:"encryption", correct:false}
  ], hint:"It’s the total points an attacker could try to enter."},

  // Page 2: Components
  {type:'info', title:'Components', body:[
    "Your attack surface includes software, hardware, networks, and even people.",
    "Every device, application, or account you use can be a potential entry point for attackers."
  ]},
  {type:'quiz', q:"Which of the following is NOT part of the attack surface?", multi:false, opts:[
    {t:"Software", correct:false},
    {t:"Hardware", correct:false},
    {t:"People", correct:false},
    {t:"The color of your desktop background", correct:true}
  ], hint:"Think of what attackers can actually exploit."},

  // Page 3: Example – Software
  {type:'info', title:'Example – Software', body:[
    "Outdated software or unpatched systems increase your attack surface.",
    "It’s like leaving the doors and windows of your house unlocked."
  ]},
  {type:'fill', q:"___ software increases your attack surface.", choices:[
    {t:"Outdated", correct:true},
    {t:"Updated", correct:false},
    {t:"Encrypted", correct:false},
    {t:"Secured", correct:false}
  ], hint:"Think of software that hasn’t been fixed or patched."},

  // Page 4: Example – Hardware
  {type:'info', title:'Example – Hardware', body:[
    "Devices connected to your network, like smartphones or IoT gadgets, can also be weak points.",
    "Even something small, like a smart camera, can be exploited if it’s not secured."
  ]},
  {type:'quiz', q:"Which devices could increase your attack surface if unsecured?", multi:true, opts:[
    {t:"Smartphone", correct:true},
    {t:"IoT gadgets", correct:true},
    {t:"Smart camera", correct:true},
    {t:"Paper notebook", correct:false}
  ], hint:"Think connected devices that can be accessed digitally."},

  // Page 5: Example – People
  {type:'info', title:'Example – People', body:[
    "Humans are often the easiest targets through phishing or social engineering attacks.",
    "Even the smartest employees can accidentally click on malicious links."
  ]},
  {type:'quiz', q:"Which attack methods target people directly?", multi:true, opts:[
    {t:"Phishing", correct:true},
    {t:"Social engineering", correct:true},
    {t:"Malware injection automatically", correct:false},
    {t:"Hardware failure", correct:false}
  ], hint:"It exploits human behavior rather than software vulnerabilities."},

  // Page 6: Reducing Risk
  {type:'info', title:'Reducing Risk', body:[
    "Reducing your attack surface means minimizing unnecessary exposure.",
    "This includes updating software, using strong passwords, and limiting access to sensitive systems."
  ]},
  {type:'fill', q:"Reducing your attack surface includes updating software, using ___ passwords, and limiting access.", choices:[
    {t:"strong", correct:true},
    {t:"weak", correct:false},
    {t:"repeated", correct:false},
    {t:"default", correct:false}
  ], hint:"Passwords that are hard to guess are called ___ passwords."},

  // Page 7: Continuous Monitoring
  {type:'info', title:'Continuous Monitoring', body:[
    "Attack surfaces are not static — they change as you add new devices, software, or users.",
    "Regular monitoring and security checks help prevent vulnerabilities from being exploited."
  ]},
  {type:'quiz', q:"Why must attack surfaces be monitored continuously?", multi:false, opts:[
    {t:"Because they change when new devices, software, or users are added", correct:true},
    {t:"Because they disappear automatically after installation", correct:false},
    {t:"Because monitoring is optional for security", correct:false},
    {t:"Because old devices never pose risks", correct:false}
  ], hint:"Attack surfaces evolve with your environment."},

  // Page 8: Summary
  {type:'info', title:'Summary', body:[
    "Your attack surface is everything that could be attacked in your digital environment.",
    "Understanding and managing it is key to effective cybersecurity."
  ]},
  {type:'fill', q:"Your attack surface is everything that could be ___ in your digital environment.", choices:[
    {t:"attacked", correct:true},
    {t:"ignored", correct:false},
    {t:"secured", correct:false},
    {t:"upgraded", correct:false}
  ], hint:"Think about what attackers target."}
];


const panel = document.getElementById('panel');
const progress = document.getElementById('progress');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const checkBtn = document.getElementById('checkBtn');
const exitBtn = document.getElementById('exitBtn');

let idx = 0;
let infoTimer = null;
let countdown = 0;
let selected = [];
let selectedSingle = null;
let animTimeout = null;

exitBtn.addEventListener('click', ()=> { window.location.href = '/training'; });

function render(){
  clearTimers();
  selected = [];
  selectedSingle = null;
  checkBtn.style.display = 'none';
  checkBtn.disabled = true;
  nextBtn.disabled = true;
  nextBtn.textContent = 'Next';
  progress.style.width = `${((idx+1)/pages.length)*100}%`;
  prevBtn.disabled = idx === 0;

  const page = pages[idx];
  switch(page.type){
    case 'info': renderInfo(page); break;
    case 'quiz': renderQuiz(page); break;
    case 'fill': renderFill(page); break; // <--- call renderFill
}
}

function renderFill(page){
  let html = `<div class="pagetitle">Fill in the Blank</div>
    <div class="lead" style="font-weight:700;margin-top:6px">${escapeHtml(page.q)}</div>
    <div class="options" id="options">`;

  page.choices.forEach((c,i)=>{
    html += `<div class="opt" data-index="${i}" tabindex="0">${escapeHtml(c.t)}</div>`;
  });

  html += `</div>
    <div id="feedback" class="feedback" style="display:none"></div>`;

  panel.innerHTML = html;

  checkBtn.style.display = 'inline-block';
  checkBtn.disabled = true;
  nextBtn.disabled = true;

  const opts = panel.querySelectorAll('.opt');
  opts.forEach(o=>{
    o.addEventListener('click', ()=> onSelectFill(o, page, opts));
    o.addEventListener('keydown', (ev)=>{ if(ev.key==='Enter') onSelectFill(o, page, opts); });
  });
}

function onSelectFill(el, page, opts){
  opts.forEach(x=>x.classList.remove('selected'));
  el.classList.add('selected');
  selectedSingle = Number(el.getAttribute('data-index'));
  checkBtn.disabled = false;

  const fb = document.getElementById('feedback');
  if (fb){ fb.style.display='none'; fb.textContent=''; }

  checkBtn.onclick = ()=>{
    opts.forEach(x=>x.classList.add('disabled'));
    checkBtn.disabled = true;
    const fb = document.getElementById('feedback');
    fb.style.display = 'block';
    if (page.choices[selectedSingle] && page.choices[selectedSingle].correct){
      opts[selectedSingle].classList.add('correct');
      fb.className = 'feedback ok';
      fb.textContent = 'Correct — good job.';
      nextBtn.disabled = false;
    } else {
      if (typeof selectedSingle === 'number') opts[selectedSingle].classList.add('wrong');
      fb.className = 'feedback bad';
      fb.textContent = 'Incorrect. Hint: ' + (page.hint || 'Review the page content.');
      setTimeout(()=>{
        opts.forEach(x=>x.classList.remove('disabled','wrong','selected'));
        selectedSingle = null;
        checkBtn.disabled = true;
        fb.style.display='none';
      },1200);
    }
  };
}

function fadeTo(nextAction){
  // add fade-out, then call nextAction after animation, then fade-in
  panel.classList.remove('fade-in');
  panel.classList.add('fade-out');
  clearTimeout(animTimeout);
  animTimeout = setTimeout(()=>{
    nextAction();
    panel.classList.remove('fade-out');
    panel.classList.add('fade-in');
  }, 180);
}

function renderInfo(page){
  panel.innerHTML = `<div class="pagetitle">${escapeHtml(page.title)}</div>
    <div class="lead">${page.body.map(p=>`<p>${escapeHtml(p)}</p>`).join('')}</div>`;
  countdown = 3;
  nextBtn.textContent = `Next (${countdown})`;
  nextBtn.disabled = true;
  infoTimer = setInterval(()=>{
    countdown--;
    if (countdown > 0) nextBtn.textContent = `Next (${countdown})`;
    else { clearInterval(infoTimer); infoTimer = null; nextBtn.disabled = false; nextBtn.textContent = 'Next'; }
  },1000);
}

function renderQuiz(page){
  const instruction = page.multi ? '<div class="muted" style="margin-top:10px">Instruction: Select all that apply.</div>' : '<div class="muted" style="margin-top:10px">Instruction: Select one answer.</div>';
  let html = `<div class="pagetitle">Quick Check</div>
    <div class="lead" style="font-weight:700;margin-top:6px">${escapeHtml(page.q)}</div>
    ${instruction}
    <div class="options" id="options">`;
  page.opts.forEach((o,i)=>{
    html += `<div class="opt" data-index="${i}" tabindex="0">${escapeHtml(o.t)}</div>`;
  });
  html += `</div><div id="feedback" class="feedback" style="display:none"></div>`;
  panel.innerHTML = html;

  checkBtn.style.display = 'inline-block';
  checkBtn.disabled = true;
  nextBtn.disabled = true;

  const opts = panel.querySelectorAll('.opt');
  opts.forEach(o=>{
    o.addEventListener('click', (ev)=> onChoose(ev, page.multi));
    o.addEventListener('keydown', (ev)=> { if(ev.key==='Enter') onChoose(ev, page.multi); });
  });

  function onChoose(e, multi){
    const el = e.currentTarget || e.target;
    const idxOpt = Number(el.getAttribute('data-index'));
    if (multi){
      if (selected.includes(idxOpt)){
        selected = selected.filter(x=>x!==idxOpt);
        el.classList.remove('selected');
      } else {
        selected.push(idxOpt);
        el.classList.add('selected');
      }
      checkBtn.disabled = selected.length === 0;
    } else {
      opts.forEach(x=>x.classList.remove('selected'));
      el.classList.add('selected');
      selectedSingle = idxOpt;
      checkBtn.disabled = false;
    }
    const fb = document.getElementById('feedback');
    if (fb){ fb.style.display='none'; fb.textContent=''; }
  }

  checkBtn.onclick = ()=>{
    opts.forEach(x=>x.classList.add('disabled'));
    checkBtn.disabled = true;
    const fb = document.getElementById('feedback');
    fb.style.display = 'block';

    const correctIndices = page.opts.reduce((acc,o,i)=> { if (o.correct) acc.push(i); return acc; }, []);
    if (page.multi){
      const selSorted = [...selected].sort((a,b)=>a-b);
      const corrSorted = [...correctIndices].sort((a,b)=>a-b);
      const match = selSorted.length===corrSorted.length && selSorted.every((v,i)=>v===corrSorted[i]);
      if (match){
        selected.forEach(i=> opts[i].classList.add('correct'));
        fb.className='feedback ok';
        fb.textContent = 'Correct — well done.';
        nextBtn.disabled = false;
      } else {
        selected.forEach(i=> opts[i].classList.add('wrong'));
        fb.className='feedback bad';
        fb.textContent = 'Incorrect. Hint: ' + (page.hint || 'Review the page content.');
        setTimeout(()=>{
          opts.forEach(x=>x.classList.remove('disabled','wrong','selected'));
          selected = [];
          checkBtn.disabled = true;
          fb.style.display='none';
        },1200);
      }
    } else {
      const isCorrect = page.opts[selectedSingle] && page.opts[selectedSingle].correct;
      if (isCorrect){
        opts[selectedSingle].classList.add('correct');
        fb.className='feedback ok';
        fb.textContent = 'Correct — good job.';
        nextBtn.disabled = false;
      } else {
        if (typeof selectedSingle === 'number') opts[selectedSingle].classList.add('wrong');
        fb.className='feedback bad';
        fb.textContent = 'Incorrect. Hint: ' + (page.hint || 'Re-read the previous page.');
        setTimeout(()=>{
          opts.forEach(x=>x.classList.remove('disabled','wrong','selected'));
          selectedSingle = null;
          checkBtn.disabled = true;
          fb.style.display='none';
        },1200);
      }
    }
  };
}

function next(){
  if (idx < pages.length - 1){ 
    fadeTo(()=>{ idx++; render(); }); 
  } else finish();
}
function prev(){
  if (idx > 0){ fadeTo(()=>{ idx--; render(); }); }
}

async function finish(){
  clearTimers();

  const moduleId = 6;
  const lessonId = 6;
  const expReward = 15;
  const orbReward = 10;

  try {
    await fetch('/api/lesson/complete', {
      method: 'POST',
      credentials: 'include',         // <---- required to send session cookie
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleId, lessonId, expReward, orbReward })
    });

  } catch (err) {
    console.error("Failed to update progress:", err);
  }


  panel.innerHTML = `<div class="pagetitle">Lesson Completed</div>
    <div class="lead"><p>Nice work — you finished Lesson 3: Understanding the Attack Surface!</p>
    <p>Review anytime to keep this knowledge sharp.</p></div>
    <div style="margin-top:18px"><p class="finish-reward">
        You earned <strong>30 Orbs</strong> and <strong>50 EXP</strong>!
    </p></div>`;
  progress.style.width = '100%';
  prevBtn.disabled = true;
  nextBtn.disabled = false;
  nextBtn.textContent = "Next Module";
  nextBtn.addEventListener("click", function () {
    window.location.href = "/training/module/1/lesson/3";
  })
  checkBtn.style.display = 'none';
}

function clearTimers(){ if (infoTimer){ clearInterval(infoTimer); infoTimer = null; } if (animTimeout){ clearTimeout(animTimeout); animTimeout = null; } }
function escapeHtml(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;').replace(/\n/g,'<br>'); }

prevBtn.addEventListener('click', ()=>{ clearTimers(); prev(); });
nextBtn.addEventListener('click', ()=>{ clearTimers(); next(); });

/* initial render */
render();