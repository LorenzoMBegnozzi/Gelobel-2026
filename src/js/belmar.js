// LOADER
window.addEventListener('load', () => {
  setTimeout(() => { document.getElementById('loader').classList.add('hidden'); }, 2400);
});

function transitionToPage(targetUrl) {
  const overlay = document.getElementById('pageTransition');
  if (!overlay || !targetUrl || document.body.classList.contains('page-transitioning')) {
    return;
  }

  document.body.classList.add('page-transitioning');
  overlay.classList.add('active');

  window.setTimeout(() => {
    window.location.href = targetUrl;
  }, 620);
}

document.querySelectorAll('[data-transition-target]').forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    transitionToPage(link.getAttribute('data-transition-target'));
  });
});

// NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 60); });

// NAV MOBILE
document.getElementById('navToggle').addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  const open = links.style.display === 'flex';
  Object.assign(links.style, { display: open ? 'none' : 'flex', flexDirection: 'column', position: 'fixed', top: '70px', left: '0', right: '0', background: 'rgba(14,13,11,0.97)', padding: '32px 28px', gap: '24px', borderBottom: '1px solid rgba(168,180,154,0.1)', zIndex: '999' });
  if (open) links.style.display = 'none';
});

// CARDÁPIO TABS
function cardTab(name, btn) {
  document.querySelectorAll('.card-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.card-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById('tab-' + name);
  if (panel) panel.classList.add('active');
}

// SCROLL REVEAL
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.07 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

// PARALLAX HERO
document.addEventListener('scroll', () => {
  const y = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) heroContent.style.transform = `translateY(${y * 0.25}px)`;
  const kanji = document.querySelector('.hero-kanji');
  if (kanji) kanji.style.transform = `translateY(calc(-50% + ${y * 0.1}px))`;
});
