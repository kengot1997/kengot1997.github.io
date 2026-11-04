document.getElementById('copyright-year').textContent = new Date().getFullYear();

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
