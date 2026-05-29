/* ==========================================================================
   The Stewart Law Practice — Interaction Layer
   ========================================================================== */

(function () {
  'use strict';

  /* ----- Sticky header ----- */
  const header = document.querySelector('.site-header');
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  /* ----- Back-to-top (FAB Book Consultation is always visible) ----- */
  const backToTop = document.querySelector('.back-to-top');
  const updateBackToTop = () => {
    if (backToTop) backToTop.classList.toggle('is-visible', window.scrollY > 200);
  };
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  let rafPending = false;
  const onScroll = () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      updateHeader();
      updateBackToTop();
      rafPending = false;
    });
  };
  updateHeader();
  updateBackToTop();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----- Mobile nav ----- */
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const navIconOpen = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>';
  const navIconClose = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>';

  const closeMobileNav = () => {
    if (!mobileNav || !navToggle) return;
    mobileNav.classList.remove('is-open');
    navToggle.innerHTML = navIconOpen;
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const openMobileNav = () => {
    if (!mobileNav || !navToggle) return;
    mobileNav.classList.add('is-open');
    navToggle.innerHTML = navIconClose;
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  if (navToggle && mobileNav) {
    if (!navToggle.querySelector('svg')) navToggle.innerHTML = navIconOpen;
    navToggle.setAttribute('aria-controls', 'mobile-nav');
    mobileNav.setAttribute('id', 'mobile-nav');
    // The inline boot script in each HTML file (see end of <body>) already wires
    // the toggle's click handler. Adding another here would cause the menu to
    // open then immediately close again. Only wire the click if not already wired.
    if (!navToggle.dataset.bootWired) {
      navToggle.dataset.bootWired = '1';
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        mobileNav.classList.contains('is-open') ? closeMobileNav() : openMobileNav();
      });
      mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) closeMobileNav();
      });
    }
    // Always wire these — they upgrade the inline boot script with nicer icon
    // swaps on toggle (the inline boot doesn't swap the SVG).
    mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileNav));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) closeMobileNav();
    });
    // Upgrade close/open to also swap the icon (inline boot only toggles aria/overflow)
    const _origClose = closeMobileNav, _origOpen = openMobileNav;
    // (closeMobileNav and openMobileNav already swap the icon; nothing else to upgrade here)
  }
  document.querySelectorAll('[data-mobile-sub]').forEach((trigger) => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', () => {
      const sub = trigger.nextElementSibling;
      if (!sub) return;
      const isOpen = sub.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
      trigger.classList.toggle('is-open', isOpen);
    });
  });

  /* ----- Desktop dropdowns: click/touch support ----- */
  const dropdownParents = document.querySelectorAll('.nav__item.has-dropdown');
  dropdownParents.forEach((parent) => {
    const trigger = parent.querySelector('.nav__link');
    if (!trigger) return;
    const href = trigger.getAttribute('href') || '';
    const isNonNav = href === '#' || href === '';
    trigger.addEventListener('click', (e) => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      if (isNonNav || isTouch) {
        e.preventDefault();
        const willOpen = !parent.classList.contains('is-open');
        dropdownParents.forEach((p) => p.classList.remove('is-open'));
        if (willOpen) parent.classList.add('is-open');
        trigger.setAttribute('aria-expanded', String(willOpen));
      }
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__item.has-dropdown')) {
      dropdownParents.forEach((p) => {
        p.classList.remove('is-open');
        const t = p.querySelector('.nav__link');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dropdownParents.forEach((p) => p.classList.remove('is-open'));
  });

  /* ----- Reveal on scroll (content stays visible by default; only transforms) ----- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });
    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      } else {
        obs.observe(el);
      }
    });
  }
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }, 1500);

  /* ----- Count-up numbers ----- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    counters.forEach((c) => { c.style.visibility = 'hidden'; });
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.visibility = 'visible';
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1400;
        const start = performance.now();
        const step = (ts) => {
          const p = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const value = Math.round(target * eased);
          el.textContent = prefix + value + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = prefix + target + suffix;
        };
        requestAnimationFrame(step);
        cObs.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => cObs.observe(c));
  }

  /* ----- FAQ accordion ----- */
  document.querySelectorAll('.faq__item').forEach((item, idx) => {
    const trigger = item.querySelector('.faq__trigger');
    const body = item.querySelector('.faq__body');
    if (!trigger || !body) return;
    const bodyId = body.id || ('faq-body-' + idx);
    body.id = bodyId;
    trigger.setAttribute('aria-controls', bodyId);
    trigger.setAttribute('aria-expanded', 'false');
    body.setAttribute('role', 'region');
    body.hidden = true;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        body.hidden = false;
        body.style.maxHeight = body.scrollHeight + 'px';
        const onEnd = () => { body.style.maxHeight = 'none'; body.removeEventListener('transitionend', onEnd); };
        body.addEventListener('transitionend', onEnd);
      } else {
        body.style.maxHeight = body.scrollHeight + 'px';
        requestAnimationFrame(() => { body.style.maxHeight = '0px'; });
        const onEnd2 = () => { body.hidden = true; body.removeEventListener('transitionend', onEnd2); };
        body.addEventListener('transitionend', onEnd2);
      }
    });
  });

  /* ----- Testimonial slider ----- */
  const slider = document.querySelector('[data-slider]');
  if (slider) {
    const slides = slider.querySelectorAll('[data-slide]');
    const dots = slider.querySelectorAll('[data-dot]');
    let current = 0;
    let auto;
    const show = (idx) => {
      slides.forEach((s, i) => { s.style.display = i === idx ? 'block' : 'none'; });
      dots.forEach((d, i) => { d.classList.toggle('is-active', i === idx); d.setAttribute('aria-pressed', String(i === idx)); });
      current = idx;
    };
    dots.forEach((d, i) => {
      d.setAttribute('type', 'button');
      d.setAttribute('aria-pressed', String(i === 0));
      d.addEventListener('click', () => { show(i); resetAuto(); });
    });
    const advance = () => show((current + 1) % slides.length);
    const startAuto = () => { if (slides.length > 1) auto = setInterval(advance, 7000); };
    const stopAuto = () => { if (auto) { clearInterval(auto); auto = null; } };
    const resetAuto = () => { stopAuto(); startAuto(); };
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    document.addEventListener('visibilitychange', () => { document.hidden ? stopAuto() : startAuto(); });
    show(0);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) startAuto();
  }

  /* ----- Contact form ----- */
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = form.querySelectorAll('[required]');
      let firstInvalid = null;
      fields.forEach((field) => {
        const wrap = field.closest('.form-field');
        const valid = !!field.value.trim() && (field.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(field.value));
        field.classList.toggle('is-error', !valid);
        if (wrap) wrap.classList.toggle('is-invalid', !valid);
        if (!valid && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }
      const data = Object.fromEntries(new FormData(form).entries());
      const subject = encodeURIComponent('New inquiry — ' + (data.topic || 'General') + ' — ' + (data.firstName || '') + ' ' + (data.lastName || ''));
      const bodyText = encodeURIComponent(
        'Name: ' + (data.firstName || '') + ' ' + (data.lastName || '') + '\n' +
        'Email: ' + (data.email || '') + '\n' +
        'Phone: ' + (data.phone || '') + '\n' +
        'Topic: ' + (data.topic || '') + '\n\n' +
        'Message:\n' + (data.message || '')
      );
      window.location.href = 'mailto:dstewart@thestewartlawpractice.com?subject=' + subject + '&body=' + bodyText;
      const success = form.querySelector('[data-form-success]');
      if (success) {
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setTimeout(() => form.reset(), 250);
    });
  }

  /* ----- Smooth anchor scroll with real header offset ----- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id.length < 2) {
        e.preventDefault();
        return;
      }
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const headerH = (document.querySelector('.site-header') || {}).offsetHeight || 100;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----- Year stamp ----- */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
