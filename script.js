document.getElementById('copyright-year').textContent = new Date().getFullYear();

const portraitGif = 'assets/kengo-tanaka-magic.gif';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let portraitBlobPromise;

function loadPortraitGif() {
  if (!portraitBlobPromise) {
    portraitBlobPromise = fetch(portraitGif).then((response) => {
      if (!response.ok) throw new Error('Portrait animation could not be loaded');
      return response.blob();
    }).catch((error) => {
      portraitBlobPromise = null;
      throw error;
    });
  }
  return portraitBlobPromise;
}

document.querySelectorAll('.portrait-trigger').forEach((button) => {
  const image = button.querySelector('img');
  const stillImage = image.getAttribute('src');
  let objectUrl;
  let playRequest = 0;
  let touchTimer;

  function stop() {
    playRequest += 1;
    clearTimeout(touchTimer);
    image.src = stillImage;
    button.setAttribute('aria-pressed', 'false');
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
  }

  async function play(userInitiated = false) {
    if (reducedMotion.matches && !userInitiated) return;
    if (objectUrl) stop();
    const request = ++playRequest;
    try {
      const blob = await loadPortraitGif();
      if (request !== playRequest) return;
      objectUrl = URL.createObjectURL(blob);
      image.src = objectUrl;
      button.setAttribute('aria-pressed', 'true');
      if (userInitiated) touchTimer = setTimeout(stop, 3000);
    } catch (error) {
      stop();
    }
  }

  button.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') play();
  });
  button.addEventListener('pointerleave', stop);
  button.addEventListener('focus', () => play());
  button.addEventListener('blur', stop);
  button.addEventListener('click', () => play(true));
});

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
