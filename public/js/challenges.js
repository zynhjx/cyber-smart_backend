  // Challenge pages
const challengeIntro = [
  { type: 'info', title: 'Challenge 1: First Defense', body: [
      "Welcome to Challenge 1: First Defense!",
      "Test your knowledge of cybersecurity basics. Complete the following tasks to prove your skills."
  ]}
];
// All challenge items (fill and quiz), original order irrelevant
const challengeItems = [
  { type: 'fill', q: "The main goal of cybersecurity is to protect the ", answer: "CIA", suffix: " Triad: confidentiality, integrity, and availability."},
  { type: 'fill', q: "Confidentiality means keeping data ", answer: "private", suffix: " and safe from unauthorized access."},
  { type: 'fill', q: "Integrity ensures data stays ", answer: "accurate", suffix: " and unchanged."},
  { type: 'fill', q: "Availability means systems and information are always ", answer: "accessible", suffix: " when needed."},
  { type: 'quiz', q: "Why is cybersecurity important in daily life?", multi: false, opts: [
    { t: "Because almost everything relies on digital systems", correct: true },
    { t: "It’s only for IT professionals", correct: false },
    { t: "It prevents users from browsing the internet", correct: false }
  ]},
  { type: 'quiz', q: "Which attack affected hospitals and businesses worldwide in 2017?", multi: false, opts: [
    { t: "WannaCry ransomware", correct: true },
    { t: "Phishing email", correct: false },
    { t: "MITM attack", correct: false }
  ]},
  { type: 'fill', q: "Malware is software designed to gain unauthorized ", answer: "access", suffix: " or damage your devices."},
  { type: 'quiz', q: "Which of these spreads automatically without user action?", multi: false, opts: [
    { t: "Virus", correct: false },
    { t: "Worm", correct: true },
    { t: "Strong password", correct: false }
  ]},
  { type: 'fill', q: "Phishing tricks users into revealing personal ", answer: "information", suffix: " via fake emails or websites."},
  { type: 'fill', q: "Ransomware locks your ", answer: "files", suffix: " and demands payment to unlock them."},
  { type: 'quiz', q: "Social engineering attacks target:", multi: false, opts: [
    { t: "Human behavior", correct: true },
    { t: "Hardware only", correct: false },
    { t: "Software only", correct: false }
  ]},
  { type: 'quiz', q: "A DoS attack does what?", multi: false, opts: [
    { t: "Makes a system unavailable by flooding it with traffic", correct: true },
    { t: "Encrypts files for ransom", correct: false },
    { t: "Tricks users into sharing passwords", correct: false }
  ]},
  { type: 'quiz', q: "MITM attacks:", multi: false, opts: [
    { t: "Intercept communication secretly", correct: true },
    { t: "Spread viruses automatically", correct: false },
    { t: "Protect passwords", correct: false }
  ]},
  { type: 'fill', q: "Your attack surface includes software, hardware, networks, and even ", answer: "people", suffix: "."},
  { type: 'quiz', q: "Which action reduces your attack surface?", multi: false, opts: [
    { t: "Updating software and using strong passwords", correct: true },
    { t: "Connecting all devices to public Wi-Fi", correct: false },
    { t: "Sharing passwords", correct: false }
  ]},
  { type: 'fill', q: "Devices like smartphones or smart cameras can be weak points if not ", answer: "secured", suffix: "."},
];

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const pages = challengeIntro.concat(shuffleArray(challengeItems));


const panel=document.getElementById('panel');
const progress=document.getElementById('progress');
const prevBtn=document.getElementById('prevBtn');
const nextBtn=document.getElementById('nextBtn');
const checkBtn=document.getElementById('checkBtn');
const exitBtn=document.getElementById('exitBtn');

let idx=0;
let selected=null;

exitBtn.addEventListener('click', ()=>{window.location.href='/challenge';});
prevBtn.addEventListener('click', ()=>{if(idx>0){idx--; render();}});
nextBtn.addEventListener('click', ()=>{if(idx<pages.length-1){idx++; render();} else finish();});

function shuffleArray(arr){ // Fisher-Yates shuffle
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

function render(){
  panel.classList.remove('fade-in'); panel.classList.add('fade-out');
  setTimeout(()=>{
    panel.classList.remove('fade-out'); 
    panel.classList.add('fade-in'); 
    renderPage();
  },180);
  progress.style.width=`${((idx+1)/pages.length)*100}%`;
}

function renderPage(){
  const page=pages[idx];
  panel.innerHTML="";
  selected=null; 
  checkBtn.style.display='none'; 
  checkBtn.disabled=true; 
  nextBtn.disabled=true;

  // Info page
  if(page.type==='info'){
    const title=document.createElement('div'); 
    title.className='pagetitle'; 
    title.textContent=page.title;
    panel.appendChild(title);

    page.body.forEach(text=>{
      const p=document.createElement('div'); 
      p.className='lead'; 
      p.textContent=text;
      panel.appendChild(p);
    });

    nextBtn.disabled=false; // info pages just go next
    return;
  }

  // Fill-type page

  if (page.type === 'fill') {
    const qEl = document.createElement('div');
    qEl.className = 'lead';
    panel.appendChild(qEl);

    const prefix = document.createElement('span');
    prefix.textContent = page.q;
    qEl.appendChild(prefix);

    const blanksContainer = document.createElement('span');
    blanksContainer.className = 'fill-blank-inline';
    qEl.appendChild(blanksContainer);

    const blanks = [];
    const poolDiv = document.createElement('div');
    poolDiv.className = 'drag-letters';

    let letters = page.answer.split('');
    shuffleArray(letters);
    letters.forEach(letter => {
      const lDiv = document.createElement('div');
      lDiv.className = 'letter';
      lDiv.textContent = letter;
      lDiv.draggable = true;
      lDiv.addEventListener('dragstart', e => e.dataTransfer.setData('text', letter));
      poolDiv.appendChild(lDiv);
    });

    // Track which letters came from pool
    const removedFromPool = new Set();

    for (let i = 0; i < page.answer.length; i++) {
      const box = document.createElement('span');
      box.className = 'blank-box';
      box.contentEditable = true;
      blanksContainer.appendChild(box);
      blanks.push(box);

      const placeCursorAtEnd = el => {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      };

      box.addEventListener('input', e => {
        const val = box.textContent.trim().toLowerCase();

        // remove matching letter from pool only if it exists
        const letterEl = Array.from(poolDiv.children).find(l => l.textContent.toLowerCase() === val);
        if (letterEl) {
          letterEl.remove();
          removedFromPool.add(val);
        }

        if (i < blanks.length - 1 && box.textContent) blanks[i + 1].focus();

        const allFilled = blanks.every(b => b.textContent.trim() !== "");
        checkBtn.disabled = !allFilled;
      });

      box.addEventListener('keydown', e => {
        if (e.key === "ArrowLeft" && i > 0) {
          e.preventDefault();
          blanks[i - 1].focus();
          placeCursorAtEnd(blanks[i - 1]);
        }
        if (e.key === "ArrowRight" && i < blanks.length - 1) {
          e.preventDefault();
          blanks[i + 1].focus();
          placeCursorAtEnd(blanks[i + 1]);
        }
        if (e.key === "Backspace") {
          e.preventDefault();

          const removed = box.textContent.trim().toLowerCase();
          box.textContent = "";

          // only restore if it was originally removed from pool
          if (removed && removedFromPool.has(removed)) {
            const restore = document.createElement('div');
            restore.className = 'letter';
            restore.textContent = removed;
            restore.draggable = true;
            restore.addEventListener('dragstart', ev => ev.dataTransfer.setData('text', removed));
            poolDiv.appendChild(restore);
            removedFromPool.delete(removed);
          }

          if (i > 0) {
            blanks[i - 1].focus();
            placeCursorAtEnd(blanks[i - 1]);
          }

          const allFilled = blanks.every(b => b.textContent.trim() !== "");
          checkBtn.disabled = !allFilled;
        }
      });

      box.addEventListener('dragover', e => e.preventDefault());
      box.addEventListener('drop', e => {
        e.preventDefault();
        const letter = e.dataTransfer.getData('text');
        box.textContent = letter;
        if (i < blanks.length - 1) blanks[i + 1].focus();
        placeCursorAtEnd(box);

        const letterEl = Array.from(poolDiv.children).find(l => l.textContent.toLowerCase() === letter.toLowerCase());
        if (letterEl) {
          letterEl.remove();
          removedFromPool.add(letter.toLowerCase());
        }

        const allFilled = blanks.every(b => b.textContent.trim() !== "");
        checkBtn.disabled = !allFilled;
      });
    }

    const suffix = document.createElement('span');
    suffix.textContent = page.suffix;
    qEl.appendChild(suffix);
    panel.appendChild(poolDiv);

    checkBtn.style.display = 'inline-block';
    checkBtn.disabled = true;
    nextBtn.disabled = true;

    checkBtn.onclick = () => {
      const userAnswer = blanks.map(b => b.textContent).join('');

      for (let i = 0; i < blanks.length; i++) {
        if (userAnswer[i]?.toLowerCase() === page.answer[i].toLowerCase()) {
          blanks[i].style.borderColor = "var(--ok)";
        } else {
          blanks[i].style.borderColor = "var(--bad)";
        }
      }

      nextBtn.disabled = false;
      checkBtn.disabled = true;
    };
  }




  // Multiple choice
  if(page.type==='quiz') {
    const qEl=document.createElement('div'); 
    qEl.className='lead'; 
    qEl.textContent=page.q; 
    panel.appendChild(qEl);

    const optsDiv=document.createElement('div'); 
    optsDiv.className='options';
    shuffleArray(page.opts); // shuffle options

    page.opts.forEach((o,i)=>{
      const opt=document.createElement('div'); 
      opt.className='opt'; 
      opt.textContent=o.t; 
      optsDiv.appendChild(opt);
      opt.addEventListener('click', ()=>{
        optsDiv.querySelectorAll('.opt').forEach(x=>x.classList.remove('selected'));
        opt.classList.add('selected'); 
        selected=i; 
        checkBtn.disabled=false;
      });
    });
    panel.appendChild(optsDiv);
    checkBtn.style.display='inline-block';
    checkBtn.disabled=true;
    checkBtn.onclick=()=>{
      const isCorrect = page.opts[selected].correct;
      if(isCorrect){
        optsDiv.children[selected].classList.add('correct');
      } else {
        optsDiv.children[selected].classList.add('wrong');
      }
      // Allow user to proceed regardless
      nextBtn.disabled = false;
    };
  }
}

async function finish(){

  const challengeId = 6;
  const expReward = 50;
  const orbReward = 30;

  try {
    await fetch('/api/challenge/complete', {
      method: 'POST',
      credentials: 'include',         // <---- required to send session cookie
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId, expReward, orbReward })
    });

  } catch (err) {
    console.error("Failed to update progress:", err);
  }


  panel.innerHTML=`<div class="pagetitle">Challenge Completed</div>
  <div class="lead"><p>Great job — you finished Challenge 1: First Defense!</p></div>
  <div style="margin-top:18px"><p class="finish-reward">You earned <strong>30 Orbs</strong> and <strong>50 EXP</strong>!</p></div>`;
  prevBtn.disabled=true; nextBtn.disabled=false; checkBtn.style.display='none'; progress.style.width='100%';



  nextBtn.textContent = "Go to Dashboard";
  nextBtn.addEventListener("click", function () {
    window.location.href = "/dashboard";
  })
  checkBtn.style.display = 'none';
}

render();