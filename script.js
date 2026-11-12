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

    const resizeCanvas = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * scale);
      canvas.height = Math.round(window.innerHeight * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      trail.length = 0;
      sparks.length = 0;
    };

    const draw = (now) => {
      frame = 0;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      while (trail.length && now - trail[0].time > trailLife) trail.shift();
      while (sparks.length && now - sparks[0].time > 1250) sparks.shift();

      if (!reducedMotion.matches) {
        const dark = document.documentElement.dataset.theme === 'dark';
        context.save();
        context.lineCap = 'round';
        context.shadowColor = dark ? '#9c83ff' : '#8e80ee';
        context.shadowBlur = 11;
        for (let i = 1; i < trail.length; i++) {
          const strength = Math.max(0, 1 - (now - trail[i].time) / trailLife);
          context.strokeStyle = `rgba(112, 113, 242, ${strength * (dark ? .68 : .48)})`;
          context.lineWidth = 2.2 * strength + .5;
          context.beginPath();
          context.moveTo(trail[i - 1].x, trail[i - 1].y);
          context.lineTo(trail[i].x, trail[i].y);
          context.stroke();
        }
        if (trail.length) {
          const tip = trail[trail.length - 1];
          const strength = Math.max(0, 1 - (now - tip.time) / trailLife);
          context.fillStyle = `rgba(82, 194, 255, ${strength * (dark ? .8 : .65)})`;
          context.beginPath();
          context.arc(tip.x, tip.y, 2.2 * strength, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();

        for (const spark of sparks) {
          const progress = Math.min(1, (now - spark.time) / 1250);
          const x = spark.x + spark.vx * progress;
          const y = spark.y + spark.vy * progress;
          const alpha = (1 - progress) * (dark ? .8 : .65);
          context.save();
          context.fillStyle = spark.blue
            ? `rgba(75, 199, 255, ${alpha})`
            : `rgba(159, 112, 255, ${alpha})`;
          context.shadowColor = spark.blue ? '#4bc7ff' : '#9f70ff';
          context.shadowBlur = 10;
          context.beginPath();
          context.arc(x, y, spark.radius * (1 - progress * .4), 0, Math.PI * 2);
          context.fill();
          context.restore();
        }
      }
      if (trail.length || sparks.length) frame = requestAnimationFrame(draw);
    };

    const scheduleDraw = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    window.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches || event.pointerType === 'touch') return;
      const last = trail[trail.length - 1];
      const distance = last ? Math.hypot(event.clientX - last.x, event.clientY - last.y) : Infinity;
      if (distance > 100) trail.length = 0;
      if (distance < 5) return;
      trail.push({ x: event.clientX, y: event.clientY, time: performance.now() });
      if (trail.length > 28) trail.shift();
      scheduleDraw();
    }, { passive: true });

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
