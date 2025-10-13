const pages = [
  // Page 1: Definition
  {type:'info', title:'Definition', body:[
    "Cybersecurity is the practice of protecting computers, networks, and data from unauthorized access or damage.",
    "It’s like having locks and guards for your digital world."
  ]},
  {type:'quiz', q:"Which option restates the definition given?", multi:false, opts:[
    {t:"Protecting systems and information from unauthorized access or damage", correct:true},
    {t:"Only cleaning viruses from infected systems", correct:false},
    {t:"Making devices faster by upgrading hardware", correct:false},
    {t:"Backing up every file to any cloud", correct:false}
  ], hint:"Look for the phrase that mirrors 'protecting ... unauthorized access or damage'."},

  // Page 2: Beyond Antivirus
  {type:'info', title:'Beyond Antivirus', body:[
    "It goes beyond installing antivirus software.",
    "It’s a system of defense made up of strategies, tools, and habits that keep your information safe."
  ]},
  {type:'fill', q:"Cybersecurity goes beyond ___ antivirus software.", choices:[
    {t:"installing", correct:true},
    {t:"ignoring", correct:false},
    {t:"removing", correct:false},
    {t:"updating", correct:false}
  ], hint:"Look for the word describing what we normally do with antivirus software."},
  {type:'quiz', q:"Which items are examples of the 'system of defense' described? (Select all that apply.)", multi:true, opts:[
    {t:"Using two-factor authentication", correct:true},
    {t:"Running a one-time malware scan and ignoring updates", correct:false},
    {t:"Setting strong passwords and keeping software updated", correct:true},
    {t:"Disconnecting the computer permanently", correct:false}
  ], hint:"Pick ongoing defensive habits and tools."},

  // Page 3: Main Goal
  {type:'info', title:'Main Goal', body:[
    "The goal of cybersecurity is to protect confidentiality, integrity, and availability.",
    "Together, these are known as the CIA Triad, the foundation of cybersecurity."
  ]},
  {type:'fill', q:"The CIA Triad stands for Confidentiality, ___, and Availability.", choices:[
    {t:"Integrity", correct:true},
    {t:"Intelligence", correct:false},
    {t:"Information", correct:false},
    {t:"Internet", correct:false}
  ], hint:"The middle term is about data staying correct and unaltered."},
  {type:'quiz', q:"Which set matches the CIA Triad named in the text?", multi:false, opts:[
    {t:"Confidentiality, Integrity, Availability", correct:true},
    {t:"Confidentiality, Integrity, Access-control", correct:false},
    {t:"Confidentiality, Identity, Availability", correct:false},
    {t:"Control, Integrity, Availability", correct:false}
  ], hint:"The exact three words were listed: confidentiality, integrity, availability."},

  // Page 4: Confidentiality
  {type:'info', title:'Confidentiality', body:[
    "Confidentiality means keeping data private and safe from those who shouldn’t see it.",
    "Think of it as sealing a letter so only the receiver can open it."
  ]},
  {type:'quiz', q:"Which action would break confidentiality as described?", multi:false, opts:[
    {t:"Sharing your password so a friend can access your account", correct:true},
    {t:"Encrypting a message before sending it", correct:false},
    {t:"Locking your device when you step away", correct:false},
    {t:"Using two-factor authentication for accounts", correct:false}
  ], hint:"Which choice gives unauthorized people access?"},

  // Page 5: Integrity
  {type:'info', title:'Integrity', body:[
    "Integrity means ensuring data stays accurate and unchanged.",
    "It’s like making sure no one edits your message before it reaches the person you sent it to."
  ]},
  {type:'quiz', q:"Which scenario reflects integrity as defined?", multi:false, opts:[
    {t:"A file arrives exactly as it was sent — unchanged", correct:true},
    {t:"A file is encrypted to hide contents", correct:false},
    {t:"A server is temporarily offline for maintenance", correct:false},
    {t:"A system speeds up after optimization", correct:false}
  ], hint:"Integrity focuses on unchanged and accurate data."},

  // Page 6: Availability
  {type:'info', title:'Availability', body:[
    "Availability means systems and information are always accessible when needed.",
    "It’s like making sure the lights in your home turn on every time you flip the switch."
  ]},
  {type:'fill', q:"Availability ensures systems and data are ___ when needed.", choices:[
    {t:"accessible", correct:true},
    {t:"hidden", correct:false},
    {t:"secured", correct:false},
    {t:"ignored", correct:false}
  ], hint:"Think about being able to reach your data when required."},
  {type:'quiz', q:"Which situations match a failure of availability? (Select all that apply.)", multi:true, opts:[
    {t:"A major site is unreachable because of a DDoS attack", correct:true},
    {t:"A service is intentionally offline for scheduled maintenance", correct:false},
    {t:"A server hardware crash causes downtime until repaired", correct:true},
    {t:"A password expires and requires reset", correct:false}
  ], hint:"Availability = accessible when needed; pick events that prevent access."},

  // Page 7: Importance
  {type:'info', title:'Importance', body:[
    "Almost every part of life today relies on digital systems — from banking to healthcare.",
    "If those systems are attacked, it can cause chaos and loss of trust."
  ]},
  {type:'quiz', q:"Which reason matches why cybersecurity matters, as the page states?", multi:false, opts:[
    {t:"Because critical services (like banking and healthcare) rely on digital systems", correct:true},
    {t:"Because it always guarantees 100% protection", correct:false},
    {t:"Because it only reduces spam emails", correct:false},
    {t:"Because it speeds up all devices", correct:false}
  ], hint:"The page named sectors like banking and healthcare."},

  // Page 8: Real-World Example
  {type:'info', title:'WannaCry Example', body:[
    "In 2017, the WannaCry ransomware attack spread worldwide and locked users out of their files.",
    "Hospitals, businesses, and government offices were affected within hours."
  ]},
  {type:'quiz', q:"According to the example, what did WannaCry do?", multi:false, opts:[
    {t:"Locked users out of their files until a ransom was paid", correct:true},
    {t:"Destroyed systems physically", correct:false},
    {t:"Broadcast false news on social networks", correct:false},
    {t:"Only targeted personal home devices", correct:false}
  ], hint:"The info says files were locked and institutions were affected."},

  // Page 9: Lessons & Shared Responsibility
  {type:'info', title:'Lesson & Responsibility', body:[
    "This shows how one weak link in security can lead to global problems.",
    "Cybersecurity works best when everyone takes part, from experts to everyday users."
  ]},
  {type:'quiz', q:"What lesson did the page draw from WannaCry?", multi:false, opts:[
    {t:"A single weak security link can cause widespread problems", correct:true},
    {t:"Only websites are at risk from ransomware", correct:false},
    {t:"Ransomware is harmless if ignored", correct:false},
    {t:"WannaCry improved security everywhere automatically", correct:false}
  ], hint:"Focus on 'one weak link' causing global problems."},
  {type:'quiz', q:"Which action matches the shared-responsibility idea?", multi:false, opts:[
    {t:"Everyone locking accounts and remaining alert reduces risk for all", correct:true},
    {t:"Leaving accounts open makes things faster", correct:false},
    {t:"Avoiding updates improves security", correct:false},
    {t:"Disabling firewalls for convenience helps safety", correct:false}
  ], hint:"Think 'city stays safe when everyone locks their doors'."}
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
  const lessonId = 4;
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
    console.error("❌ Failed to update progress:", err);
  }

  panel.innerHTML = `<div class="pagetitle">Lesson Completed</div>
    <div class="lead"><p>Nice work — you finished Lesson 1: What is Cybersecurity!</p>
    <p>Review anytime to keep this knowledge sharp.</p></div>
    <div style="margin-top:18px"><p class="finish-reward">
        You earned <strong>30 Orbs</strong> and <strong>50 EXP</strong>!
    </p></div>`;
  progress.style.width = '100%';
  prevBtn.disabled = true;
  nextBtn.disabled = false;
  nextBtn.textContent = "Next Lesson";
  const newNext = nextBtn.cloneNode(true);
  nextBtn.replaceWith(newNext);
  newNext.addEventListener("click", () => {
    window.location.href = "/training/module/1/lesson/2";
  });
  checkBtn.style.display = 'none';
}

function clearTimers(){ if (infoTimer){ clearInterval(infoTimer); infoTimer = null; } if (animTimeout){ clearTimeout(animTimeout); animTimeout = null; } }
function escapeHtml(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;').replace(/\n/g,'<br>'); }

prevBtn.addEventListener('click', ()=>{ clearTimers(); prev(); });
nextBtn.addEventListener('click', ()=>{ clearTimers(); next(); });

/* initial render */
render();