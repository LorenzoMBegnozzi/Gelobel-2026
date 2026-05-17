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

// MOBILE CARD CAROUSELS
function initMobileCardCarousels() {
  const mobileQuery = window.matchMedia('(max-width: 600px)');
  const carousels = Array.from(document.querySelectorAll('[data-mobile-carousel]')).map((grid) => {
    const section = grid.closest('section');
    const viewport = grid.closest('.mobile-carousel-viewport');
    const controls = section?.querySelector('[data-carousel-controls]');
    const prevButton = controls?.querySelector('[data-carousel-prev]');
    const nextButton = controls?.querySelector('[data-carousel-next]');
    const status = controls?.querySelector('[data-carousel-status]');
    const cards = Array.from(grid.querySelectorAll('.exp-card'));

    return { grid, viewport, prevButton, nextButton, status, cards, index: 0, direction: 'forward' };
  });

  function goToPrev(carousel) {
    if (!mobileQuery.matches || carousel.index === 0) return;
    carousel.direction = 'backward';
    carousel.index -= 1;
    renderCarousel(carousel);
  }

  function goToNext(carousel) {
    if (!mobileQuery.matches || carousel.index >= carousel.cards.length - 1) return;
    carousel.direction = 'forward';
    carousel.index += 1;
    renderCarousel(carousel);
  }

  function renderCarousel(carousel) {
    const total = carousel.cards.length;

    if (!mobileQuery.matches) {
      carousel.index = 0;
      carousel.cards.forEach((card) => card.classList.remove('is-active', 'is-backward'));
      if (carousel.status) carousel.status.textContent = `1 / ${total}`;
      if (carousel.prevButton) carousel.prevButton.disabled = false;
      if (carousel.nextButton) carousel.nextButton.disabled = false;
      return;
    }

    carousel.cards.forEach((card, cardIndex) => {
      const isActive = cardIndex === carousel.index;
      card.classList.toggle('is-active', isActive);
      card.classList.toggle('is-backward', isActive && carousel.direction === 'backward');
    });
    if (carousel.status) carousel.status.textContent = `${carousel.index + 1} / ${total}`;
    if (carousel.prevButton) carousel.prevButton.disabled = carousel.index === 0;
    if (carousel.nextButton) carousel.nextButton.disabled = carousel.index === total - 1;
  }

  carousels.forEach((carousel) => {
    if (carousel.prevButton) {
      carousel.prevButton.addEventListener('click', () => goToPrev(carousel));
    }

    if (carousel.nextButton) {
      carousel.nextButton.addEventListener('click', () => goToNext(carousel));
    }

    if (carousel.viewport) {
      let startX = 0;
      let startY = 0;

      carousel.viewport.addEventListener('touchstart', (event) => {
        const touch = event.changedTouches[0];
        startX = touch.clientX;
        startY = touch.clientY;
      }, { passive: true });

      carousel.viewport.addEventListener('touchend', (event) => {
        if (!mobileQuery.matches) return;

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) {
          return;
        }

        if (deltaX < 0) {
          goToNext(carousel);
        } else {
          goToPrev(carousel);
        }
      }, { passive: true });
    }

    renderCarousel(carousel);
  });

  const rerender = () => carousels.forEach(renderCarousel);
  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', rerender);
  } else {
    mobileQuery.addListener(rerender);
  }
  window.addEventListener('resize', rerender);
}

initMobileCardCarousels();

// PARALLAX HERO
document.addEventListener('scroll', () => {
  const y = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) heroContent.style.transform = `translateY(${y * 0.25}px)`;
  const kanji = document.querySelector('.hero-kanji');
  if (kanji) kanji.style.transform = `translateY(calc(-50% + ${y * 0.1}px))`;
});
