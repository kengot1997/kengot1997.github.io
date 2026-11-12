document.getElementById('copyright-year').textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let releaseMagic = () => {};
let clearMagic = () => {};
let effectsEnabled = true;
try { effectsEnabled = localStorage.getItem('kengo-effects') !== 'off'; } catch (error) { /* Storage may be unavailable. */ }
const canAnimate = () => effectsEnabled && !reducedMotion.matches;

if (window.matchMedia('(pointer: fine)').matches) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    canvas.className = 'magic-trace';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    const sparks = [];
    let frame = 0;
    let pointerPosition = null;
    let previousPointerPosition = null;
    let lastScrollY = window.scrollY;

    const makeGlow = (color) => {
      const glow = document.createElement('canvas');
      glow.width = glow.height = 32;
      const glowContext = glow.getContext('2d');
      const gradient = glowContext.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, `rgba(${color}, .9)`);
      gradient.addColorStop(.25, `rgba(${color}, .38)`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);
      glowContext.fillStyle = gradient;
      glowContext.fillRect(0, 0, 32, 32);
      return glow;
    };
    const glows = [
      '159, 112, 255', // Violet
      '75, 199, 255',  // Cyan
      '238, 112, 188', // Pink
      '230, 168, 71',  // Amber
      '66, 189, 169'   // Mint
    ].map(makeGlow);

    const addTrailSparks = (fromX, fromY, toX, toY, now, scroll = false) => {
      if (!canAnimate()) return;
      const dx = toX - fromX;
      const dy = toY - fromY;
      const distance = Math.hypot(dx, dy);
      if (!distance) return;
      const tangentX = dx / distance;
      const tangentY = dy / distance;
      const normalX = -tangentY;
      const normalY = tangentX;
      const count = Math.min(56, Math.max(scroll ? 18 : 8, Math.ceil(distance / 2.4)));
      for (let i = 0; i < count; i++) {
        const position = (i + Math.random()) / count;
        const side = Math.random() < .5 ? -1 : 1;
        const spread = side * (10 + Math.random() * 26);
        sparks.push({
          x: fromX + dx * position + normalX * side * Math.random() * 5,
          y: fromY + dy * position + normalY * side * Math.random() * 5,
          vx: normalX * spread + tangentX * (scroll ? 7 : 11),
          vy: normalY * spread + tangentY * (scroll ? 7 : 11),
          radius: .6 + Math.random() * .7,
          color: Math.floor(Math.random() * glows.length),
          trail: true,
          life: 470 + Math.random() * 320,
          time: now
        });
      }
      if (sparks.length > 380) sparks.splice(0, sparks.length - 380);
      scheduleDraw();
    };

    const resizeCanvas = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * scale);
      canvas.height = Math.round(window.innerHeight * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      sparks.length = 0;
      previousPointerPosition = null;
      lastScrollY = window.scrollY;
    };

    const draw = (now) => {
      frame = 0;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = sparks.length - 1; i >= 0; i--) {
        if (now - sparks[i].time > sparks[i].life) sparks.splice(i, 1);
      }

      if (canAnimate()) {
        const dark = document.documentElement.dataset.theme === 'dark';
        for (const spark of sparks) {
          const progress = Math.min(1, (now - spark.time) / spark.life);
          const x = spark.x + spark.vx * progress;
          const y = spark.y + spark.vy * progress;
          const alpha = (1 - progress) * (spark.trail ? (dark ? .85 : .78) : (dark ? .8 : .65));
          const size = spark.trail ? 6 + spark.radius * 5 : 12 + spark.radius * 5;
          context.globalAlpha = alpha;
          context.drawImage(glows[spark.color], x - size / 2, y - size / 2, size, size);
        }
        context.globalAlpha = 1;
      }
      if (sparks.length) frame = requestAnimationFrame(draw);
    };

    const scheduleDraw = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    clearMagic = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      sparks.length = 0;
      pointerPosition = null;
      previousPointerPosition = null;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    window.addEventListener('pointermove', (event) => {
      if (!canAnimate() || event.pointerType === 'touch') return;
      pointerPosition = { x: event.clientX, y: event.clientY };
      const now = performance.now();
      const last = previousPointerPosition;
      previousPointerPosition = { x: event.clientX, y: event.clientY, time: now };
      if (!last || now - last.time > 160) return;
      const distance = Math.hypot(event.clientX - last.x, event.clientY - last.y);
      if (distance >= 2 && distance <= 100) addTrailSparks(last.x, last.y, event.clientX, event.clientY, now);
    }, { passive: true });

    window.addEventListener('scroll', () => {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (!canAnimate() || !pointerPosition || !delta) return;
      const { x, y } = pointerPosition;
      const length = Math.min(28, Math.max(8, Math.abs(delta) * .5));
      const direction = Math.sign(delta);
      addTrailSparks(x, y - direction * length, x, y, performance.now(), true);
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      pointerPosition = null;
      previousPointerPosition = null;
    });

    releaseMagic = (portrait) => {
      if (!canAnimate()) return;
      const rect = portrait.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const radius = rect.width / 2;
      const now = performance.now();
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + Math.random() * .3;
        sparks.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          vx: Math.cos(angle) * (18 + Math.random() * 30),
          vy: Math.sin(angle) * (18 + Math.random() * 30) - 12,
          radius: 1.5 + Math.random() * 1.5,
          color: i % glows.length,
          trail: false,
          life: 1250,
          time: now
        });
      }
      scheduleDraw();
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        sparks.length = 0;
        pointerPosition = null;
        previousPointerPosition = null;
      }
    });
    resizeCanvas();
  }
}

const stopPortraits = [];
for (const portrait of document.querySelectorAll('.portrait-media')) {
  const video = portrait.querySelector('video');
  let active = false;

  const play = () => {
    if (active || !canAnimate()) return;
    active = true;
    video.currentTime = 0;
    video.play().catch(() => { active = false; });
  };
  const stop = () => {
    const wasPlaying = portrait.classList.contains('is-playing');
    active = false;
    portrait.classList.remove('is-playing');
    video.pause();
    video.currentTime = 0;
    if (wasPlaying) releaseMagic(portrait);
  };
  stopPortraits.push(stop);

  portrait.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') play();
  });
  portrait.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') stop();
  });
  portrait.addEventListener('blur', stop);
  portrait.addEventListener('click', (event) => {
    if (!canAnimate()) return;
    if (event.detail && window.matchMedia('(hover: hover)').matches) return;
    if (active) stop();
    else play();
  });
  video.addEventListener('playing', () => {
    if (active) portrait.classList.add('is-playing');
    else video.pause();
  });
}

const effectToggle = document.querySelector('.effect-toggle');
const syncEffectToggle = () => {
  const on = effectsEnabled;
  const english = document.documentElement.lang === 'en';
  effectToggle.setAttribute('aria-pressed', String(on));
  effectToggle.setAttribute('aria-label', english
    ? (on ? 'Turn effects off' : 'Turn effects on')
    : (on ? 'エフェクトをオフにする' : 'エフェクトをオンにする'));
  effectToggle.title = `${english ? 'Effects' : 'エフェクト'}: ${on ? 'ON' : 'OFF'}`;
  effectToggle.lastElementChild.textContent = on ? 'ON' : 'OFF';
};
effectToggle.addEventListener('click', () => {
  effectsEnabled = !effectsEnabled;
  try { localStorage.setItem('kengo-effects', effectsEnabled ? 'on' : 'off'); } catch (error) { /* Storage may be unavailable. */ }
  if (!effectsEnabled) {
    clearMagic();
    stopPortraits.forEach((stop) => stop());
  }
  syncEffectToggle();
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    clearMagic();
    stopPortraits.forEach((stop) => stop());
  }
});
document.addEventListener('languagechange', syncEffectToggle);
syncEffectToggle();

const navLinks = [...document.querySelectorAll('.site-nav a')];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-25% 0px -65% 0px' });
  sections.forEach((section) => observer.observe(section));
}
