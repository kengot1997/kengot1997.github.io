document.getElementById('copyright-year').textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let releaseMagic = () => {};

if (window.matchMedia('(pointer: fine)').matches) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    canvas.className = 'magic-trace';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    const trail = [];
    const sparks = [];
    const trailLife = 800;
    let frame = 0;
    let pointerPosition = null;
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
    const glows = [makeGlow('159, 112, 255'), makeGlow('75, 199, 255')];

    const addTrailSparks = (fromX, fromY, toX, toY, now, scroll = false) => {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const distance = Math.hypot(dx, dy);
      if (!distance) return;
      const tangentX = dx / distance;
      const tangentY = dy / distance;
      const normalX = -tangentY;
      const normalY = tangentX;
      const count = Math.min(24, Math.max(scroll ? 8 : 3, Math.ceil(distance / 5)));
      for (let i = 0; i < count; i++) {
        const position = (i + Math.random()) / count;
        const side = Math.random() < .5 ? -1 : 1;
        const spread = side * (8 + Math.random() * 20);
        sparks.push({
          x: fromX + dx * position + normalX * side * Math.random() * 3,
          y: fromY + dy * position + normalY * side * Math.random() * 3,
          vx: normalX * spread + tangentX * (scroll ? 7 : 11),
          vy: normalY * spread + tangentY * (scroll ? 7 : 11),
          radius: .6 + Math.random() * .7,
          blue: Math.random() < .5,
          trail: true,
          life: 470 + Math.random() * 320,
          time: now
        });
      }
      if (sparks.length > 180) sparks.splice(0, sparks.length - 180);
      scheduleDraw();
    };

    const resizeCanvas = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * scale);
      canvas.height = Math.round(window.innerHeight * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      trail.length = 0;
      sparks.length = 0;
      lastScrollY = window.scrollY;
    };

    const draw = (now) => {
      frame = 0;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      while (trail.length && now - trail[0].time > trailLife) trail.shift();
      for (let i = sparks.length - 1; i >= 0; i--) {
        if (now - sparks[i].time > sparks[i].life) sparks.splice(i, 1);
      }

      if (!reducedMotion.matches) {
        const dark = document.documentElement.dataset.theme === 'dark';
        if (trail.length > 1) {
          const strength = Math.max(0, 1 - (now - trail[trail.length - 1].time) / trailLife);
          context.save();
          context.beginPath();
          context.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length - 1; i++) {
            const point = trail[i];
            const next = trail[i + 1];
            context.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
          }
          const tip = trail[trail.length - 1];
          context.lineTo(tip.x, tip.y);
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.shadowColor = dark ? '#9c83ff' : '#8e80ee';
          context.shadowBlur = 15;
          context.strokeStyle = `rgba(112, 113, 242, ${strength * (dark ? .22 : .17)})`;
          context.lineWidth = 10;
          context.stroke();
          context.shadowBlur = 7;
          context.strokeStyle = `rgba(112, 113, 242, ${strength * (dark ? .72 : .55)})`;
          context.lineWidth = 4;
          context.stroke();
          context.restore();
        }

        for (const spark of sparks) {
          const progress = Math.min(1, (now - spark.time) / spark.life);
          const x = spark.x + spark.vx * progress;
          const y = spark.y + spark.vy * progress;
          const alpha = (1 - progress) * (spark.trail ? (dark ? .75 : .62) : (dark ? .8 : .65));
          const size = spark.trail ? 5 + spark.radius * 4 : 12 + spark.radius * 5;
          context.globalAlpha = alpha;
          context.drawImage(glows[spark.blue ? 1 : 0], x - size / 2, y - size / 2, size, size);
        }
        context.globalAlpha = 1;
      }
      if (trail.length || sparks.length) frame = requestAnimationFrame(draw);
    };

    const scheduleDraw = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    window.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches || event.pointerType === 'touch') return;
      pointerPosition = { x: event.clientX, y: event.clientY };
      const last = trail[trail.length - 1];
      const distance = last ? Math.hypot(event.clientX - last.x, event.clientY - last.y) : Infinity;
      if (distance > 100) {
        trail.length = 0;
      }
      if (distance < 2) return;
      const now = performance.now();
      trail.push({ x: event.clientX, y: event.clientY, time: now });
      if (trail.length > 28) trail.shift();
      if (last && distance <= 100) addTrailSparks(last.x, last.y, event.clientX, event.clientY, now);
      scheduleDraw();
    }, { passive: true });

    window.addEventListener('scroll', () => {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (reducedMotion.matches || !pointerPosition || !delta) return;
      const { x, y } = pointerPosition;
      const length = Math.min(28, Math.max(8, Math.abs(delta) * .5));
      const direction = Math.sign(delta);
      addTrailSparks(x, y - direction * length, x, y, performance.now(), true);
    }, { passive: true });

    document.addEventListener('pointerleave', () => { pointerPosition = null; });

    releaseMagic = (portrait) => {
      if (reducedMotion.matches) return;
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
          blue: i % 2 === 0,
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
        trail.length = 0;
        sparks.length = 0;
        pointerPosition = null;
      }
    });
    resizeCanvas();
  }
}

for (const portrait of document.querySelectorAll('.portrait-media')) {
  const video = portrait.querySelector('video');
  let active = false;

  const play = () => {
    if (active) return;
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

  portrait.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' && !reducedMotion.matches) play();
  });
  portrait.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') stop();
  });
  portrait.addEventListener('blur', stop);
  portrait.addEventListener('click', (event) => {
    if (event.detail && window.matchMedia('(hover: hover)').matches && !reducedMotion.matches) return;
    if (active) stop();
    else play();
  });
  video.addEventListener('playing', () => {
    if (active) portrait.classList.add('is-playing');
    else video.pause();
  });
}

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
