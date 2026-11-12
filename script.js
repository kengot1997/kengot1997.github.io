document.getElementById('copyright-year').textContent = new Date().getFullYear();

for (const portrait of document.querySelectorAll('.portrait-media')) {
  const video = portrait.querySelector('video');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = false;

  const play = () => {
    if (active) return;
    active = true;
    video.currentTime = 0;
    video.play().catch(() => { active = false; });
  };
  const stop = () => {
    active = false;
    portrait.classList.remove('is-playing');
    video.pause();
    video.currentTime = 0;
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
