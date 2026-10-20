(() => {
  const C = window.CONFIG;
  const $ = (s) => document.querySelector(s);
  const rand = (a, b) => Math.random() * (b - a) + a;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // ---------- Điền tên ----------
  document.querySelectorAll('[data-her]').forEach((el) => (el.textContent = C.herName));
  document.querySelectorAll('[data-me]').forEach((el) => (el.textContent = C.myName));
  document.querySelectorAll('[data-her-real]').forEach((el) => (el.textContent = C.herrealName));
  document.title = `Gửi ${C.herName} 💖 20/10`;

  // ---------- Chuyển màn ----------
  const onEnter = {};
  function show(id) {
    document.querySelectorAll('.stage').forEach((s) => s.classList.toggle('active', s.id === id));
    window.scrollTo(0, 0);
    if (onEnter[id]) onEnter[id]();
  }
  const isActive = (id) => document.getElementById(id).classList.contains('active');

  // ---------- Tim bay nền ----------
  const floaty = $('#floaty');
  const FLOAT = ['💖', '💗', '🌸', '💕', '🌷', '✨', '💝', '🎀'];
  function spawnFloat() {
    const el = document.createElement('span');
    el.className = 'float';
    el.textContent = pick(FLOAT);
    el.style.left = rand(0, 100) + 'vw';
    el.style.fontSize = rand(14, 34) + 'px';
    el.style.animationDuration = rand(7, 14) + 's';
    el.style.setProperty('--sway', rand(-60, 60) + 'px');
    floaty.appendChild(el);
    setTimeout(() => el.remove(), 14500);
  }
  setInterval(spawnFloat, 450);

  // ---------- Nổ tim khi chạm ----------
  const BURST = ['💖', '💕', '💗', '❤️', '🌸', '✨'];
  function burst(x, y, n = 10, spread = 120) {
    for (let i = 0; i < n; i++) {
      const el = document.createElement('span');
      el.className = 'burst';
      el.textContent = pick(BURST);
      const a = rand(0, Math.PI * 2);
      const d = rand(spread * 0.4, spread);
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.fontSize = rand(14, 28) + 'px';
      el.style.setProperty('--dx', Math.cos(a) * d + 'px');
      el.style.setProperty('--dy', Math.sin(a) * d + 'px');
      el.style.setProperty('--r', rand(-90, 90) + 'deg');
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  }
  document.addEventListener('pointerdown', (e) => burst(e.clientX, e.clientY, 7, 80));

  // ---------- Nhạc ----------
  const audio = $('#bgm');
  const musicBtn = $('#musicBtn');
  if (C.music) audio.src = C.music;
  else musicBtn.hidden = true;
  audio.addEventListener('error', () => (musicBtn.hidden = true));
  function playMusic() {
    if (!C.music) return;
    audio.play().then(() => musicBtn.classList.add('playing')).catch(() => {});
  }
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) playMusic();
    else {
      audio.pause();
      musicBtn.classList.remove('playing');
    }
  });

  // =====================================================
  // Màn 1: Câu hỏi
  // =====================================================
  const yesBtn = $('#yesBtn');
  const noBtn = $('#noBtn');
  const bear = $('#bear');
  const hint = $('#qHint');
  $('#question').textContent = C.question;

  let noCount = 0;
  let yesScale = 1;
  let lastDodge = 0;
  let sadTimer;
  function dodge(e) {
    if (e) e.preventDefault();
    if (Date.now() - lastDodge < 300) return;
    lastDodge = Date.now();
    noCount++;
    noBtn.textContent = C.noTexts[noCount % C.noTexts.length];
    const r = noBtn.getBoundingClientRect();
    noBtn.style.position = 'fixed';
    noBtn.style.left = rand(16, Math.max(16, window.innerWidth - r.width - 16)) + 'px';
    noBtn.style.top = rand(16, Math.max(16, window.innerHeight - r.height - 16)) + 'px';
    yesScale = Math.min(yesScale + 0.15, 2.4);
    yesBtn.style.setProperty('--s', yesScale);
    bear.classList.add('sad');
    clearTimeout(sadTimer);
    sadTimer = setTimeout(() => bear.classList.remove('sad'), 1200);
    hint.textContent = C.noHints[Math.min(noCount - 1, C.noHints.length - 1)];
  }
  noBtn.addEventListener('mouseenter', dodge);
  noBtn.addEventListener('touchstart', dodge, { passive: false });
  noBtn.addEventListener('click', dodge);

  yesBtn.addEventListener('click', () => {
    playMusic();
    bear.classList.remove('sad');
    bear.classList.add('happy');
    const r = yesBtn.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 30, 220);
    hint.textContent = C.yesText;
    noBtn.style.display = 'none';
    yesBtn.disabled = true;
    setTimeout(() => show('stage-envelope'), 1800);
  });

  // =====================================================
  // Màn 2: Phong thư
  // =====================================================
  const env = $('#envelope');
  env.addEventListener('click', (e) => {
    if (env.classList.contains('open')) return;
    env.classList.add('open');
    burst(e.clientX, e.clientY, 20, 160);
    setTimeout(() => show('stage-letter'), 1700);
  });

  // =====================================================
  // Màn 3: Lá thư gõ chữ
  // =====================================================
  const letter = $('#letter');
  const body = $('#letterBody');
  let skip = false;
  let typed = false;

  onEnter['stage-letter'] = () => {
    if (typed) return;
    typed = true;
    $('#letterTitle').textContent = C.letterTitle;
    const paras = C.letter.map((t) => Array.from(t)); // Array.from để không cắt đôi emoji
    let pi = 0, ci = 0, p = null;

    function done() {
      if (p) p.classList.remove('cursor');
      const sign = $('#letterSign');
      sign.textContent = `— ${C.myName} yêu ${C.herName} nhiều lắm 💗`;
      sign.hidden = false;
      $('#skipHint').hidden = true;
      $('#toHeart').hidden = false;
      letter.scrollTop = letter.scrollHeight;
    }

    function step() {
      if (skip) {
        body.innerHTML = '';
        C.letter.forEach((t) => {
          const el = document.createElement('p');
          el.textContent = t;
          body.appendChild(el);
        });
        p = null;
        return done();
      }
      if (pi >= paras.length) return done();
      if (!p) {
        p = document.createElement('p');
        p.className = 'cursor';
        body.appendChild(p);
      }
      const chars = paras[pi];
      ci++;
      p.textContent = chars.slice(0, ci).join('');
      letter.scrollTop = letter.scrollHeight;
      if (ci >= chars.length) {
        p.classList.remove('cursor');
        pi++; ci = 0; p = null;
        return setTimeout(step, 450);
      }
      setTimeout(step, /[.,!?…]/.test(chars[ci - 1]) ? 230 : 40);
    }
    setTimeout(step, 400);
  };
  letter.addEventListener('click', () => (skip = true));
  $('#toHeart').addEventListener('click', () => show('stage-heart'));

  // =====================================================
  // Màn 4: Trái tim hạt (particle heart) + bộ đếm
  // =====================================================
  const starBox = $('#stars');
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    s.style.left = rand(0, 100) + '%';
    s.style.top = rand(0, 100) + '%';
    s.style.animationDelay = rand(0, 3) + 's';
    const size = rand(1, 3);
    s.style.width = s.style.height = size + 'px';
    starBox.appendChild(s);
  }

  const cv = $('#heartCanvas');
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, S = 1, parts = [], halo = [], running = false, t0 = 0;

  // Phương trình trái tim kinh điển
  const heartPt = (t) => [
    16 * Math.pow(Math.sin(t), 3),
    -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) - 2.5
  ];

  function buildHeart() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    S = Math.min(W / 40, H / 36);
    const n = W < 600 ? 800 : 1500;
    const old = parts;
    parts = [];
    for (let i = 0; i < n; i++) {
      const [x, y] = heartPt(rand(0, Math.PI * 2));
      const k = Math.random() < 0.7 ? rand(0.93, 1.04) : Math.pow(Math.random(), 0.6) * 0.9;
      const o = old[i];
      parts.push({
        tx: x * k * S, ty: y * k * S,
        x: o ? o.x : rand(-W / 2, W / 2), y: o ? o.y : rand(-H / 2, H / 2),
        s: rand(0.8, 2.4), h: rand(325, 360), l: rand(60, 80), ph: rand(0, 6.28)
      });
    }
  }

  function frame(now) {
    if (!isActive('stage-heart')) { running = false; return; }
    const t = (now - t0) / 1000;
    const beat = 1 + 0.08 * Math.pow(Math.sin(t * 2.6), 8) + 0.04 * Math.pow(Math.sin(t * 2.6 + 0.6), 8);
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.globalCompositeOperation = 'lighter';

    for (const p of parts) {
      p.x += (p.tx * beat - p.x) * 0.06;
      p.y += (p.ty * beat - p.y) * 0.06;
      ctx.fillStyle = `hsla(${p.h},100%,${p.l}%,0.85)`;
      ctx.fillRect(p.x + Math.sin(t * 2 + p.ph) * 0.8, p.y, p.s, p.s);
    }

    // Hào quang bay ra từ viền tim
    for (let i = 0; i < 4; i++) {
      const [x, y] = heartPt(rand(0, Math.PI * 2));
      const sp = rand(0.4, 1.4);
      halo.push({ x: x * S * beat, y: y * S * beat, vx: (x / 16) * sp, vy: (y / 16) * sp, life: 1, h: rand(330, 360) });
    }
    for (const p of halo) {
      p.x += p.vx; p.y += p.vy; p.life -= 0.012;
      ctx.fillStyle = `hsla(${p.h},100%,75%,${Math.max(p.life, 0) * 0.8})`;
      ctx.fillRect(p.x, p.y, 1.6, 1.6);
    }
    halo = halo.filter((p) => p.life > 0);

    ctx.restore();
    requestAnimationFrame(frame);
  }

  let counterStarted = false;
  function startCounter() {
    if (counterStarted) return;
    counterStarted = true;
    const el = $('#counter');
    const start = new Date(C.loveStartDate + 'T00:00:00');
    const upd = () => {
      let s = Math.max(0, Math.floor((Date.now() - start) / 1000));
      const d = Math.floor(s / 86400); s %= 86400;
      const h = Math.floor(s / 3600); s %= 3600;
      const m = Math.floor(s / 60); s %= 60;
      el.innerHTML = `<b>${d}</b> ngày <b>${h}</b> giờ <b>${m}</b> phút <b>${s}</b> giây`;
    };
    upd();
    setInterval(upd, 1000);
  }

  onEnter['stage-heart'] = () => {
    buildHeart();
    startCounter();
    if (!running) {
      running = true;
      t0 = performance.now();
      requestAnimationFrame(frame);
    }
  };
  window.addEventListener('resize', () => { if (isActive('stage-heart')) buildHeart(); });
  $('#toGifts').addEventListener('click', () => show('stage-gifts'));

  // =====================================================
  // Màn 5: Hộp quà
  // =====================================================
  const grid = $('#gifts');
  let opened = 0;
  C.coupons.forEach((c, i) => {
    const card = document.createElement('div');
    card.className = 'gift';
    card.innerHTML = `
      <div class="gift-inner">
        <div class="gift-face gift-front"><span class="gift-emoji">🎁</span><small>Quà số ${i + 1}</small></div>
        <div class="gift-face gift-back"><span class="c-icon"></span><h4></h4><p></p></div>
      </div>`;
    card.querySelector('.c-icon').textContent = c.icon;
    card.querySelector('h4').textContent = c.title;
    card.querySelector('p').textContent = c.desc;
    card.querySelector('.gift-emoji').style.animationDelay = i * 0.3 + 's';
    card.addEventListener('click', (e) => {
      if (card.classList.contains('flipped')) return;
      card.classList.add('flipped');
      burst(e.clientX, e.clientY, 16, 150);
      if (++opened === C.coupons.length) $('#toFinal').hidden = false;
    });
    grid.appendChild(card);
  });
  $('#toFinal').addEventListener('click', () => show('stage-final'));

  // =====================================================
  // Màn 6: Kết + pháo hoa tim
  // =====================================================
  $('#finalMsg').textContent = C.finalMessage;
  if (C.photo) {
    $('#photo').src = C.photo;
    $('#polaroid').hidden = false;
  }
  let fireworks = null;
  onEnter['stage-final'] = () => {
    if (fireworks) return;
    const fire = () => {
      if (!isActive('stage-final')) { clearInterval(fireworks); fireworks = null; return; }
      burst(rand(40, window.innerWidth - 40), rand(60, window.innerHeight * 0.6), 18, 170);
    };
    fire();
    fireworks = setInterval(fire, 700);
  };
  $('#replay').addEventListener('click', () => location.reload());
})();
