/* ==========================================================================
   The Stewart Law Practice — Interaction Layer (v2 post-QA)
   ========================================================================== */

(function () {
  'use strict';

  // Mark JS available — but ONLY after we know reveal observer will work,
  // so a JS error elsewhere can't hide content.
  const enableJsMode = () => {
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');
  };

  /* ----- Sticky header ----- */
  const header = document.querySelector('.site-header');
  let lastScroll = 0;
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  /* ----- Back-to-top shows after scrolling; Book Consultation is always visible ----- */
  const backToTop = document.querySelector('.back-to-top');
  const updateFab = () => {
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
      updateFab();
      rafPending = false;
    });
  };
  updateHeader();
  updateFab();
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
    // Only swap to JS-provided icon if button is empty (inline SVG fallback already in HTML otherwise)
    if (!navToggle.querySelector('svg')) navToggle.innerHTML = navIconOpen;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'mobile-nav');
    mobileNav.setAttribute('id', 'mobile-nav');
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      mobileNav.classList.contains('is-open') ? closeMobileNav() : openMobileNav();
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileNav));
    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) closeMobileNav();
    });
    // Close when tapping backdrop area (outside the inner panel)
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeMobileNav();
    });
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

  /* ----- Desktop dropdowns: touch / click support ----- */
  const dropdownParents = document.querySelectorAll('.nav__item.has-dropdown');
  dropdownParents.forEach((parent) => {
    const trigger = parent.querySelector('.nav__link');
    if (!trigger) return;
    // If trigger is href="#" or non-navigating, intercept click to toggle
    const href = trigger.getAttribute('href') || '';
    const isNonNav = href === '#' || href === '';
    trigger.addEventListener('click', (e) => {
      // On coarse pointers (touch) or for non-navigating triggers, intercept
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
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__item.has-dropdown')) {
      dropdownParents.forEach((p) => { p.classList.remove('is-open'); const t = p.querySelector('.nav__link'); if (t) t.setAttribute('aria-expanded', 'false'); });
    }
  });
  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownParents.forEach((p) => p.classList.remove('is-open'));
    }
  });

  /* ----- Reveal on scroll ----- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    enableJsMode();
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });
    revealEls.forEach((el) => {
      // If already in viewport at load time, mark visible immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      } else {
        obs.observe(el);
      }
    });
  }
  // Safety net: after 1.5 seconds, force everything visible regardless
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }, 1500);

  /* ----- Count-up numbers ----- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    // Pre-blank to avoid pre-paint flicker
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

  /* ----- FAQ accordion (accessible) ----- */
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
        // After transition end, set to none so resize doesn't clip
        const onEnd = () => { body.style.maxHeight = 'none'; body.removeEventListener('transitionend', onEnd); };
        body.addEventListener('transitionend', onEnd);
      } else {
        // Snap to current pixel height then transition to 0 next frame
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
      // Build a mailto fallback so the form actually does something
      const data = Object.fromEntries(new FormData(form).entries());
      const subject = encodeURIComponent('New inquiry — ' + (data.topic || 'General') + ' — ' + (data.firstName || '') + ' ' + (data.lastName || ''));
      const bodyText = encodeURIComponent(
        'Name: ' + (data.firstName || '') + ' ' + (data.lastName || '') + '\n' +
        'Email: ' + (data.email || '') + '\n' +
        'Phone: ' + (data.phone || '') + '\n' +
        'Topic: ' + (data.topic || '') + '\n\n' +
        'Message:\n' + (data.message || '')
      );
      const mailto = 'mailto:dstewart@thestewartlawpractice.com?subject=' + subject + '&body=' + bodyTe