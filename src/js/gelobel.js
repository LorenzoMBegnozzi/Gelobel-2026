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
