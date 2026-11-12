document.getElementById('copyright-year').textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let releaseMagic = () => {};
let clearMagic = () => {};
let effectsPreference = null;
try { effectsPreference = localStorage.getItem('kengo-effects'); } catch (error) { /* Storage may be unavailable. */ }
let effectsEnabled = effectsPreference === 'on' || (effectsPreference !== 'off' && !reducedMotion.matches);
const canAnimate = () => effectsEnabled;

if ('HTMLCanvasElement' in window) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    canvas.className = 'magic-trace';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    const sparks = [];
    const pulses = [];
    let frame = 0;
    let pointerPosition = null;
    let previousPointerPosition = null;
    let activeTouch = null;
    let lastTouchBurst = 0;
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
      '211, 153, 218'  // Soft pink
    ].map(makeGlow);

    const addTrailSparks = (fromX, fromY, toX, toY, now, scroll = false) => {
      if (!canAnimate()) return;
      const dx = toX - fromX;
      const dy = toY - fromY;
      const distance = Math.hypot(dx, dy);
      if (!distance) return;
      const tangentX = dx / distance;
      const tangentY = dy / distance;
      const count = Math.min(56, Math.max(scroll ? 18 : 8, Math.ceil(distance / 2.4)));
      for (let i = 0; i < count; i++) {
        const position = (i + Math.random()) / count;
        const angle = Math.random() * Math.PI * 2;
        const directionX = Math.cos(angle);
        const directionY = Math.sin(angle);
        const spread = 18 + Math.random() * 48;
        const tint = Math.random();
        sparks.push({
          x: fromX + dx * position + directionX * Math.random() * 10,
          y: fromY + dy * position + directionY * Math.random() * 10,
          vx: directionX * spread + tangentX * (scroll ? 4 : 6),
          vy: directionY * spread + tangentY * (scroll ? 4 : 6),
          radius: .6 + Math.random() * .7,
          color: tint < .44 ? 0 : tint < .88 ? 1 : 2,
          trail: true,
          life: 470 + Math.random() * 320,
          time: now
        });
      }
      if (sparks.length > 380) sparks.splice(0, sparks.length - 380);
      scheduleDraw();
    };

    const addTouchSparks = (x, y, now) => {
      for (let i = 0; i < 9; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 16 + Math.random() * 34;
        const tint = Math.random();
        sparks.push({
          x: x + Math.cos(angle) * Math.random() * 9,
          y: y + Math.sin(angle) * Math.random() * 9,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: .6 + Math.random() * .7,
          color: tint < .44 ? 0 : tint < .88 ? 1 : 2,
          trail: true,
          life: 470 + Math.random() * 320,
          time: now
        });
      }
      if (sparks.length > 380) sparks.splice(0, sparks.length - 380);
    };

    const addClickBurst = (x, y) => {
      const now = performance.now();
      pulses.push({ x, y, time: now, life: 450 });
      for (let i = 0; i < 24; i++) {
        const angle = (i + Math.random() * .7) * Math.PI * 2 / 24;
        const speed = 38 + Math.random() * 52;
        sparks.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: .8 + Math.random() * .8,
          color: i % 8 === 0 ? 2 : i % 2,
          trail: false,
          life: 520 + Math.random() * 220,
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
      pulses.length = 0;
      previousPointerPosition = null;
      lastScrollY = window.scrollY;
    };

    const draw = (now) => {
      frame = 0;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (activeTouch && canAnimate() && now - lastTouchBurst >= 75) {
        addTouchSparks(activeTouch.x, activeTouch.y, now);
        lastTouchBurst = now;
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        if (now - sparks[i].time > sparks[i].life) sparks.splice(i, 1);
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        if (now - pulses[i].time > pulses[i].life) pulses.splice(i, 1);
      }

      if (canAnimate()) {
        const dark = document.documentElement.dataset.theme === 'dark';
        for (const pulse of pulses) {
          const progress = (now - pulse.time) / pulse.life;
          const size = 24 + progress * 90;
          context.globalAlpha = (1 - progress) ** 2 * (dark ? .72 : .45);
          context.drawImage(glows[0], pulse.x - size / 2, pulse.y - size / 2, size, size);
        }
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
      if (sparks.length || pulses.length || activeTouch) frame = requestAnimationFrame(draw);
    };

    const scheduleDraw = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    clearMagic = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      sparks.length = 0;
      pulses.length = 0;
      pointerPosition = null;
      previousPointerPosition = null;
      activeTouch = null;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const beginTouch = (source, id, x, y) => {
      activeTouch = { source, id, x, y };
      lastTouchBurst = performance.now();
      addTouchSparks(x, y, lastTouchBurst);
      scheduleDraw();
    };

    const moveTouch = (x, y) => {
      const distance = Math.hypot(x - activeTouch.x, y - activeTouch.y);
      const previousX = activeTouch.x;
      const previousY = activeTouch.y;
      activeTouch.x = x;
      activeTouch.y = y;
      if (distance >= 2) addTrailSparks(previousX, previousY, x, y, performance.now());
    };

    document.addEventListener('pointerdown', (event) => {
      if (canAnimate() && event.pointerType === 'touch' && !activeTouch) {
        beginTouch('pointer', event.pointerId, event.clientX, event.clientY);
      }
    }, { passive: true, capture: true });

    document.addEventListener('touchstart', (event) => {
      if (!canAnimate() || event.touches.length !== 1) return;
      const touch = event.changedTouches[0];
      if (activeTouch && activeTouch.source === 'pointer') {
        activeTouch = { source: 'touch', id: touch.identifier, x: touch.clientX, y: touch.clientY };
      } else if (!activeTouch) {
        beginTouch('touch', touch.identifier, touch.clientX, touch.clientY);
      }
    }, { passive: true, capture: true });

    document.addEventListener('touchmove', (event) => {
      if (!canAnimate() || !activeTouch || activeTouch.source !== 'touch') return;
      const touch = Array.from(event.changedTouches).find((item) => item.identifier === activeTouch.id);
      if (!touch) return;
      moveTouch(touch.clientX, touch.clientY);
    }, { passive: true, capture: true });

    const endTouch = (event) => {
      if (activeTouch && activeTouch.source === 'touch' &&
          Array.from(event.changedTouches).some((item) => item.identifier === activeTouch.id)) activeTouch = null;
    };
    document.addEventListener('touchend', endTouch, { passive: true, capture: true });
    document.addEventListener('touchcancel', endTouch, { passive: true, capture: true });

    const endPointerTouch = (event) => {
      if (activeTouch && activeTouch.source === 'pointer' && activeTouch.id === event.pointerId) activeTouch = null;
    };
    document.addEventListener('pointerup', endPointerTouch, { passive: true, capture: true });
    document.addEventListener('pointercancel', endPointerTouch, { passive: true, capture: true });

    window.addEventListener('click', (event) => {
      if (!canAnimate() || event.detail === 0) return;
      if (event.clientX < 0 || event.clientX > window.innerWidth ||
          event.clientY < 0 || event.clientY > window.innerHeight) return;
      addClickBurst(event.clientX, event.clientY);
    }, { passive: true });

    window.addEventListener('pointermove', (event) => {
      if (!canAnimate()) return;
      if (event.pointerType === 'touch') {
        if (activeTouch && activeTouch.source === 'pointer' && activeTouch.id === event.pointerId) {
          moveTouch(event.clientX, event.clientY);
        }
        return;
      }
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
          color: i % 8 === 0 ? 2 : i % 2,
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
        pulses.length = 0;
        pointerPosition = null;
        previousPointerPosition = null;
        activeTouch = null;
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
  effectsPreference = effectsEnabled ? 'on' : 'off';
  try { localStorage.setItem('kengo-effects', effectsPreference); } catch (error) { /* Storage may be unavailable. */ }
  if (!effectsEnabled) {
    clearMagic();
    stopPortraits.forEach((stop) => stop());
  }
  syncEffectToggle();
});
const syncReducedMotion = () => {
  if (effectsPreference !== null) return;
  effectsEnabled = !reducedMotion.matches;
  if (!effectsEnabled) {
    clearMagic();
    stopPortraits.forEach((stop) => stop());
  }
  syncEffectToggle();
};
if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', syncReducedMotion);
else reducedMotion.addListener(syncReducedMotion);
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
