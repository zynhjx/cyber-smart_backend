const pages = [
  // Page 1: Introduction (Info)
  {type:'info', title:'Introduction', body:[
    "Cyber threats are actions or software designed to harm your systems, steal information, or disrupt services.",
    "This challenge tests your understanding of different cyber threats based on what you learned from the module."
  ]},
  {type:'fill', q:"Cyber threats are actions or software designed to ___ your systems, steal information, or disrupt services.", choices:[
    {t:"ignore", correct:false},
    {t:"harm", correct:true},
    {t:"lock", correct:false},
    {t:"fix", correct:false}
  ], hint:"It’s something negative that happens to your system."},

  // Page 2: Malware (Info + Quiz)
  {type:'info', title:'Malware', body:[
    "Malware is software designed to damage, steal information, or gain unauthorized access to your devices.",
    "It can include viruses, worms, spyware, or Trojan horses — each with different behaviors."
  ]},
  {type:'quiz', q:"Which option best describes malware?", multi:false, opts:[
    {t:"Software that improves device performance", correct:false},
    {t:"A hardware component", correct:false},
    {t:"Software that damages or accesses systems without permission", correct:true},
    {t:"A backup utility", correct:false}
  ], hint:"Think about software that sneaks in without permission."},

  // Page 3: Viruses and Worms (Info + Fill)
  {type:'info', title:'Viruses and Worms', body:[
    "Viruses attach to files and spread when files are shared, requiring user action to propagate.",
    "Worms can spread automatically without user action, making them more dangerous."
  ]},
  {type:'fill', q:"A virus spreads when ___ are shared, while a worm spreads automatically.", choices:[
    {t:"files", correct:true},
    {t:"emails", correct:false},
    {t:"software updates", correct:false},
    {t:"security settings", correct:false}
  ], hint:"Think about what you commonly share between devices."},

  // Page 4: Trojan Horses (Info + Quiz)
  {type:'info', title:'Trojan Horses', body:[
    "Trojan horses appear to be useful programs but hide malicious actions inside.",
    "They trick users into installing them, allowing attackers access to your system."
  ]},
  {type:'quiz', q:"What is a Trojan horse?", multi:false, opts:[
    {t:"A harmless utility", correct:false},
    {t:"A virus that spreads automatically", correct:false},
    {t:"Software that appears useful but hides malicious actions", correct:true},
    {t:"A backup program", correct:false}
  ], hint:"It disguises itself as something good but is actually harmful."},

  // Page 5: Spyware and Adware (Info + Fill)
  {type:'info', title:'Spyware and Adware', body:[
    "Spyware secretly collects information from your devices without consent.",
    "Adware displays unwanted ads but can also track your online activity."
  ]},
  {type:'fill', q:"___ secretly collects information from your devices without consent.", choices:[
    {t:"Spyware", correct:true},
    {t:"Adware", correct:false},
    {t:"Firewall", correct:false},
    {t:"Worm", correct:false}
  ], hint:"It spies on you without permission."},

  // Page 6: Phishing (Info + Fill)
  {type:'info', title:'Phishing', body:[
    "Phishing tricks you into revealing personal information through fake emails or websites.",
    "It targets human behavior rather than software."
  ]},
  {type:'fill', q:"Phishing tricks you into revealing ___ information.", choices:[
    {t:"personal", correct:true},
    {t:"generic", correct:false},
    {t:"useless", correct:false},
    {t:"encrypted", correct:false}
  ], hint:"It targets data about you."},

  // Page 7: Social Engineering (Info + Quiz)
  {type:'info', title:'Social Engineering', body:[
    "Social engineering manipulates people into giving away sensitive information.",
    "Common types include pretexting, baiting, and tailgating."
  ]},
  {type:'quiz', q:"Which is an example of social engineering?", multi:false, opts:[
    {t:"Pretending to be IT support to get a password", correct:true},
    {t:"Installing antivirus software", correct:false},
    {t:"Encrypting emails", correct:false},
    {t:"Backing up files to the cloud", correct:false}
  ], hint:"It targets human behavior, not software."},

  // Page 8: Denial of Service (DoS) (Info + Fill)
  {type:'info', title:'Denial of Service (DoS)', body:[
    "A DoS attack floods a system with traffic, making it unavailable to users.",
    "It prevents legitimate users from accessing resources."
  ]},
  {type:'fill', q:"A DoS attack ___ a system with traffic.", choices:[
    {t:"blocks", correct:false},
    {t:"floods", correct:true},
    {t:"protects", correct:false},
    {t:"repairs", correct:false}
  ], hint:"Think of overwhelming traffic."},

  // Page 9: Man-in-the-Middle (MITM) (Info + Fill)
  {type:'info', title:'Man-in-the-Middle (MITM)', body:[
    "MITM attacks intercept communication between two parties without their knowledge.",
    "Attackers can steal data or manipulate messages secretly."
  ]},
  {type:'fill', q:"MITM attacks ___ communication between two parties without their knowledge.", choices:[
    {t:"intercept", correct:true},
    {t:"protect", correct:false},
    {t:"ignore", correct:false},
    {t:"encrypt", correct:false}
  ], hint:"They secretly listen or tamper with messages."},

  // Page 10: Summary (Info + Fill)
  {type:'info', title:'Summary', body:[
    "Cyber threats come in many forms, targeting systems, software, and people.",
    "Knowing them is the first step to defending yourself effectively."
  ]},
  {type:'fill', q:"Knowing cyber threats is the first step to ___ yourself effectively.", choices:[
    {t:"defending", correct:true},
    {t:"attacking", correct:false},
    {t:"ignoring", correct:false},
    {t:"updating", correct:false}
  ], hint:"You want to protect yourself, not harm."}
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
  const lessonId = 5;
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
    <div class="lead"><p>Nice work — you finished Lesson 2: Types of Cyber Threats!</p>
    <p>Review anytime to keep this knowledge sharp.</p></div>
    <div style="margin-top:18px"><p class="finish-reward">
        You earned <strong>30 Orbs</strong> and <strong>50 EXP</strong>!
    </p></div>`;
  progress.style.width = '100%';
  prevBtn.disabled = true;
  nextBtn.disabled = false;
  nextBtn.textContent = "Next Lesson";
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