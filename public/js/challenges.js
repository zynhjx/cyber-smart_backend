// Challenge pages
const challengeIntro = [
  { type: 'info', title: 'Challenge 1: First Defense', body: [
      "Welcome to Challenge 1: First Defense!",
      "Test your knowledge of cybersecurity basics. Complete the following tasks to prove your skills."
  ]}
];

// All challenge items (fill and quiz)
const challengeItems = [
  { type: 'fill', q: "The main goal of cybersecurity is to protect the ", answer: "CIA", suffix: " Triad: confidentiality, integrity, and availability." },
  { type: 'fill', q: "Confidentiality means keeping data ", answer: "private", suffix: " and safe from unauthorized access." },
  { type: 'fill', q: "Integrity ensures data stays ", answer: "accurate", suffix: " and unchanged." },
  { type: 'fill', q: "Availability means systems and information are always ", answer: "accessible", suffix: " when needed." },
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
  { type: 'fill', q: "Malware is software designed to gain unauthorized ", answer: "access", suffix: " or damage your devices." },
  { type: 'quiz', q: "Which of these spreads automatically without user action?", multi: false, opts: [
    { t: "Virus", correct: false },
    { t: "Worm", correct: true },
    { t: "Strong password", correct: false }
  ]},
  { type: 'fill', q: "Phishing tricks users into revealing personal ", answer: "information", suffix: " via fake emails or websites." },
  { type: 'fill', q: "Ransomware locks your ", answer: "files", suffix: " and demands payment to unlock them." },
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
  { type: 'fill', q: "Your attack surface includes software, hardware, networks, and even ", answer: "people", suffix: "." },
  { type: 'quiz', q: "Which action reduces your attack surface?", multi: false, opts: [
    { t: "Updating software and using strong passwords", correct: true },
    { t: "Connecting all devices to public Wi-Fi", correct: false },
    { t: "Sharing passwords", correct: false }
  ]},
  { type: 'fill', q: "Devices like smartphones or smart cameras can be weak points if not ", answer: "secured", suffix: "." },
];

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const pages = challengeIntro.concat(shuffleArray(challengeItems));

const panel = document.getElementById('panel');
const progress = document.getElementById('progress');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const checkBtn = document.getElementById('checkBtn');
const exitBtn = document.getElementById('exitBtn');

let idx = 0;
let selected = null;

exitBtn.addEventListener('click', () => window.location.href = '/challenge');
prevBtn.addEventListener('click', () => { if (idx > 0) { idx--; render(); } });
nextBtn.addEventListener('click', () => { if (idx < pages.length - 1) { idx++; render(); } else finish(); });

function render() {
  panel.classList.remove('fade-in'); 
  panel.classList.add('fade-out');
  setTimeout(() => {
    panel.classList.remove('fade-out'); 
    panel.classList.add('fade-in');
    renderPage();
  }, 180);
  progress.style.width = `${((idx + 1) / pages.length) * 100}%`;
}

function renderPage() {
  const page = pages[idx];
  panel.innerHTML = "";
  selected = null;
  checkBtn.style.display = 'none';
  checkBtn.disabled = true;
  nextBtn.disabled = true;

  // Info Page
  if (page.type === 'info') {
    const title = document.createElement('div');
    title.className = 'pagetitle';
    title.textContent = page.title;
    panel.appendChild(title);

    page.body.forEach(text => {
      const p = document.createElement('div');
      p.className = 'lead';
      p.textContent = text;
      panel.appendChild(p);
    });

    nextBtn.disabled = false;
    return;
  }

  // Fill Type
  if (page.type === 'fill') {
    qEl = document.createElement('div');
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

    const letterColor = '#6c63ff'; // fixed violet color

    let letters = page.answer.split('');
    shuffleArray(letters);

    // Create letter pool (clickable)
    letters.forEach(letter => {
      const lDiv = document.createElement('div');
      lDiv.className = 'letter';
      lDiv.textContent = letter;
      lDiv.style.background = letterColor;
      lDiv.style.color = "white";
      poolDiv.appendChild(lDiv);
    });

    // Jump animation
    const animateJump = (fromEl, toEl) => {
      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();
      const clone = fromEl.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.left = fromRect.left + 'px';
      clone.style.top = fromRect.top + 'px';
      clone.style.zIndex = 9999;
      clone.style.transition = 'all 0.35s ease-out';
      clone.style.background = letterColor;
      document.body.appendChild(clone);

      requestAnimationFrame(() => {
        clone.style.left = toRect.left + 'px';
        clone.style.top = toRect.top + 'px';
        clone.style.transform = 'scale(0.8)';
        clone.style.opacity = '0.8';
      });

      clone.addEventListener('transitionend', () => clone.remove());
    };

    // Create blanks
    for (let i = 0; i < page.answer.length; i++) {
      const box = document.createElement('span');
      box.className = 'blank-box';
      blanksContainer.appendChild(box);
      blanks.push(box);

      // Click blank to remove letter
      box.addEventListener('click', () => {
        if (box.textContent) {
          const restore = document.createElement('div');
          restore.className = 'letter';
          restore.textContent = box.textContent;
          restore.style.background = letterColor;
          restore.style.color = "white";
          poolDiv.appendChild(restore);
          box.textContent = "";
          box.style.background = "rgba(108, 99, 255, 0.15)";
          box.style.color = "";
          box.style.borderColor = "";
          checkBtn.disabled = true;
        }
      });
    }

    // Click pool letter to fill blank
    poolDiv.addEventListener('click', e => {
      if (!e.target.classList.contains('letter')) return;
      const letter = e.target.textContent;
      const empty = blanks.find(b => !b.textContent);
      if (empty) {
        animateJump(e.target, empty);
        empty.textContent = letter;
        empty.style.background = letterColor;
        empty.style.color = "white";
        e.target.remove();
      }
      checkBtn.disabled = !blanks.every(b => b.textContent.trim() !== "");
    });

    const suffix = document.createElement('span');
    suffix.textContent = page.suffix;
    qEl.appendChild(suffix);
    panel.appendChild(poolDiv);

    checkBtn.style.display = 'inline-block';
    checkBtn.disabled = true;
    nextBtn.disabled = true;

    // Check answer
    checkBtn.onclick = () => {
      const userAnswer = blanks.map(b => b.textContent).join('');

      for (let i = 0; i < blanks.length; i++) {
        if (userAnswer[i]?.toLowerCase() === page.answer[i].toLowerCase()) {
          blanks[i].style.borderColor = "var(--ok)";
          blanks[i].style.background = "var(--ok)";
          blanks[i].style.color = "white";
        } else {
          blanks[i].style.borderColor = "var(--bad)";
          blanks[i].style.background = "var(--bad)";
          blanks[i].style.color = "white";
        }
      }

      nextBtn.disabled = false;
      checkBtn.disabled = true;
    };
  }


  // Quiz Type
  if (page.type === 'quiz') {
    const qEl = document.createElement('div');
    qEl.className = 'lead';
    qEl.textContent = page.q;
    panel.appendChild(qEl);

    const optsDiv = document.createElement('div');
    optsDiv.className = 'options';
    shuffleArray(page.opts);

    page.opts.forEach((o, i) => {
      const opt = document.createElement('div');
      opt.className = 'opt';
      opt.textContent = o.t;
      optsDiv.appendChild(opt);
      opt.addEventListener('click', () => {
        optsDiv.querySelectorAll('.opt').forEach(x => x.classList.remove('selected'));
        opt.classList.add('selected');
        selected = i;
        checkBtn.disabled = false;
      });
    });

    panel.appendChild(optsDiv);
    checkBtn.style.display = 'inline-block';
    checkBtn.disabled = true;
    checkBtn.onclick = () => {
      const isCorrect = page.opts[selected].correct;
      const selectedOpt = optsDiv.children[selected];
      optsDiv.querySelectorAll('.opt').forEach(x => x.style.pointerEvents = 'none'); // disable clicking

      page.opts.forEach((opt, i) => {
        const el = optsDiv.children[i];
        if (opt.correct) el.classList.add('correct');
        if (i === selected && !opt.correct) el.classList.add('wrong');
      });

      nextBtn.disabled = false;
    };
  }
}

async function finish() {
  const challengeId = 6;
  const expReward = 50;
  const orbReward = 30;

  try {
    await fetch('/api/challenge/complete', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId, expReward, orbReward })
    });
  } catch (err) {
    console.error("Failed to update progress:", err);
  }

  panel.innerHTML = `
    <div class="pagetitle">Challenge Completed</div>
    <div class="lead"><p>Great job — you finished Challenge 1: First Defense!</p></div>
    <div style="margin-top:18px"><p class="finish-reward">You earned <strong>30 Orbs</strong> and <strong>50 EXP</strong>!</p></div>
  `;
  prevBtn.disabled = true;
  nextBtn.disabled = false;
  checkBtn.style.display = 'none';
  progress.style.width = '100%';
  nextBtn.textContent = "Go to Dashboard";
  nextBtn.onclick = () => window.location.href = "/dashboard";
}

render();
