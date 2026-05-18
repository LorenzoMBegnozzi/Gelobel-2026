    window.addEventListener('load', () => {
      setTimeout(() => { document.getElementById('loader').classList.add('hide'); }, 2400);
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

    (function () {
      const c = document.getElementById('particles');
      for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `left:${Math.random() * 100}%;bottom:${Math.random() * 40}%;animation-duration:${3 + Math.random() * 5}s;animation-delay:${Math.random() * 6}s;`;
        c.appendChild(p);
      }
    })();

    window.addEventListener('scroll', () => {
      document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 60);
    });

    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));

    function initSobreCarousel() {
      const carousel = document.querySelector('[data-about-carousel]');
      if (!carousel) return;

      const slides = Array.from(carousel.querySelectorAll('.sobre-slide'));
      const dotsWrap = carousel.querySelector('[data-about-dots]');
      const prevButton = carousel.querySelector('[data-about-prev]');
      const nextButton = carousel.querySelector('[data-about-next]');

      if (!slides.length || !dotsWrap || !prevButton || !nextButton) return;

      let activeIndex = 0;
      let autoplayId = null;
      let startX = 0;
      let startY = 0;

      const dots = slides.map((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'sobre-carousel-dot';
        dot.setAttribute('aria-label', `Ir para foto ${index + 1}`);
        dot.addEventListener('click', () => {
          activeIndex = index;
          render();
          restartAutoplay();
        });
        dotsWrap.appendChild(dot);
        return dot;
      });

      function render() {
        slides.forEach((slide, index) => {
          slide.classList.toggle('is-active', index === activeIndex);
        });

        dots.forEach((dot, index) => {
          dot.classList.toggle('is-active', index === activeIndex);
        });
      }

      function goTo(index) {
        activeIndex = (index + slides.length) % slides.length;
        render();
      }

      function restartAutoplay() {
        if (autoplayId) {
          window.clearInterval(autoplayId);
        }

        autoplayId = window.setInterval(() => {
          goTo(activeIndex + 1);
        }, 4200);
      }

      prevButton.addEventListener('click', () => {
        goTo(activeIndex - 1);
        restartAutoplay();
      });

      nextButton.addEventListener('click', () => {
        goTo(activeIndex + 1);
        restartAutoplay();
      });

      carousel.addEventListener('mouseenter', () => {
        if (autoplayId) {
          window.clearInterval(autoplayId);
          autoplayId = null;
        }
      });

      carousel.addEventListener('mouseleave', restartAutoplay);

      carousel.addEventListener('touchstart', (event) => {
        const touch = event.changedTouches[0];
        startX = touch.clientX;
        startY = touch.clientY;
      }, { passive: true });

      carousel.addEventListener('touchend', (event) => {
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) {
          return;
        }

        if (deltaX < 0) {
          goTo(activeIndex + 1);
        } else {
          goTo(activeIndex - 1);
        }

        restartAutoplay();
      }, { passive: true });

      render();
      restartAutoplay();
    }

    initSobreCarousel();

    function showPanel(name, btn) {
      document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      document.getElementById('panel-' + name).classList.add('active');
      btn.classList.add('active');
    }

    function closeMobileNav() {
      const links = document.querySelector('.nav-links');
      if (!links) return;
      links.removeAttribute('style');
      links.dataset.mobileOpen = 'false';
    }

    const navToggle = document.getElementById('navToggle');
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        const links = document.querySelector('.nav-links');
        if (!links || window.innerWidth > 1024) return;

        const open = links.dataset.mobileOpen === 'true';
        if (open) {
          closeMobileNav();
          return;
        }

        Object.assign(links.style, {
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: '70px',
          left: '0',
          right: '0',
          background: 'rgba(13, 12, 10, 0.97)',
          padding: '32px 28px',
          gap: '24px',
          borderBottom: '1px solid rgba(200, 146, 42, 0.12)',
          zIndex: '999'
        });
        links.dataset.mobileOpen = 'true';
      });
    }

    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) {
        closeMobileNav();
      }
    });

    function initMobileCardCarousels() {
      const mobileQuery = window.matchMedia('(max-width: 640px)');
      const carousels = Array.from(document.querySelectorAll('[data-mobile-carousel]')).map((grid) => {
        const section = grid.closest('section');
        const viewport = grid.closest('.mobile-carousel-viewport');
        const controls = section?.querySelector('[data-carousel-controls]');
        const prevButton = controls?.querySelector('[data-carousel-prev]');
        const nextButton = controls?.querySelector('[data-carousel-next]');
        const status = controls?.querySelector('[data-carousel-status]');
        const cards = Array.from(grid.children);

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

    function selectYear(item, targetId) {
      document.querySelectorAll('.vtl-year-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.vtl-panel').forEach(p => { p.classList.remove('active'); });
      item.classList.add('active');
      const panel = document.getElementById(targetId);
      if (panel) {
        panel.style.opacity = '0';
        panel.style.transform = 'translateX(-16px)';
        panel.classList.add('active');
        requestAnimationFrame(() => { requestAnimationFrame(() => { panel.style.opacity = '1'; panel.style.transform = 'translateX(0)'; }); });
      }
      const items = [...document.querySelectorAll('.vtl-year-item')];
      const idx = items.indexOf(item);
      const fill = document.querySelector('.vtl-line-fill');
      if (fill) { fill.style.height = ((idx / (items.length - 1)) * 100) + '%'; }
    }

    window.addEventListener('DOMContentLoaded', () => {
      const first = document.querySelector('.vtl-year-item');
      if (first) { selectYear(first, 'tl1991'); }
    });

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function (e) {
        const t = document.querySelector(this.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
      });
    });

    function toggleZapMenu() {
      const menu = document.getElementById('floatZapMenu');
      const btn = document.getElementById('floatZapBtn');
      if (!menu || !btn) return;

      const open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
    }

    document.addEventListener('click', function (e) {
      const wrap = document.getElementById('floatZap');
      const menu = document.getElementById('floatZapMenu');
      const btn = document.getElementById('floatZapBtn');

      if (wrap && menu && btn && !wrap.contains(e.target)) {
        menu.classList.remove('open');
        btn.classList.remove('open');
      }
    });
