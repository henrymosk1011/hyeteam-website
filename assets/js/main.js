/* =========================================================
   HyeTeam site interactions
   Smooth scroll (Lenis), scroll animations (GSAP + ScrollTrigger),
   page transitions, horizontal scroll sections, menu and forms.
   ========================================================= */
(function () {
  'use strict';

  window.HYE_READY = true;

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var lenis = null;
  var heroTimeline = null;

  var curtain = document.querySelector('[data-curtain]');
  var curtainLabel = curtain ? curtain.querySelector('[data-curtain-label]') : null;
  var header = document.querySelector('[data-header]');

  function store(key, value) {
    try {
      if (value === undefined) return window.sessionStorage.getItem(key);
      if (value === null) window.sessionStorage.removeItem(key);
      else window.sessionStorage.setItem(key, value);
    } catch (e) { return null; }
    return null;
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /* Footer year: always the current year on the visitor's clock */
  $all('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* Fallback: show everything without motion */
  function staticMode() {
    root.classList.remove('js');
    root.classList.add(hasGsap ? 'reduced-motion' : 'no-gsap');
    if (curtain) curtain.style.visibility = 'hidden';
    $all('[data-hero-split]').forEach(function (el) { el.classList.add('is-split'); });
  }

  /* ---------------------------------------------------------
     Split text into words, keeping inline markup intact
     --------------------------------------------------------- */
  function splitWords(el) {
    if (el.dataset.splitDone) return $all('.wi', el);
    function wrap(node) {
      var w = document.createElement('span');
      w.className = 'w';
      var wi = document.createElement('span');
      wi.className = 'wi';
      w.appendChild(wi);
      node.parentNode.insertBefore(w, node);
      wi.appendChild(node);
    }
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(' '));
              return;
            }
            var w = document.createElement('span');
            w.className = 'w';
            var wi = document.createElement('span');
            wi.className = 'wi';
            wi.textContent = part;
            w.appendChild(wi);
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          if (child.hasAttribute('data-nosplit')) wrap(child);
          else walk(child);
        }
      });
    }
    walk(el);
    el.dataset.splitDone = '1';
    return $all('.wi', el);
  }

  /* ---------------------------------------------------------
     Header: theme under header, hide on scroll down
     --------------------------------------------------------- */
  var themedSections = $all('main [data-theme], footer[data-theme]');
  var lastY = window.scrollY;
  var menuOpen = false;

  function updateHeader() {
    if (!header) return;
    var y = window.scrollY;
    var probe = 36;
    var theme = 'dark';
    for (var i = 0; i < themedSections.length; i++) {
      var r = themedSections[i].getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) theme = themedSections[i].getAttribute('data-theme');
    }
    header.setAttribute('data-header-theme', theme);
    header.classList.toggle('is-scrolled', y > 24);
    if (!menuOpen) {
      if (y > lastY + 4 && y > 240) header.classList.add('is-hidden');
      else if (y < lastY - 4 || y <= 240) header.classList.remove('is-hidden');
    }
    lastY = y;
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);
  updateHeader();

  /* ---------------------------------------------------------
     Mobile menu
     --------------------------------------------------------- */
  var menu = document.querySelector('[data-menu]');
  var menuToggle = document.querySelector('[data-menu-toggle]');

  function setMenu(open) {
    if (!menu || !menuToggle) return;
    menuOpen = open;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if ('inert' in menu) menu.inert = !open;
    header.classList.toggle('menu-open', open);
    header.classList.remove('is-hidden');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    var label = menuToggle.querySelector('[data-menu-label]');
    if (label) label.textContent = open ? 'Close' : 'Menu';
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
    root.style.overflow = open && !lenis ? 'hidden' : '';
    if (open) {
      var first = menu.querySelector('a');
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 350);
    }
  }

  if (menu && menuToggle) {
    if ('inert' in menu) menu.inert = true;
    menuToggle.addEventListener('click', function () { setMenu(!menuOpen); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) { setMenu(false); menuToggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (menuOpen && window.innerWidth > 1020) setMenu(false);
    });
  }

  /* ---------------------------------------------------------
     Forms: POST to an endpoint when configured, otherwise
     open the visitor's email app with the message ready.
     --------------------------------------------------------- */
  function initForms() {
    var params = new URLSearchParams(window.location.search);
    var topic = params.get('topic');
    if (topic) {
      $all('select[name="topic"]').forEach(function (sel) {
        var opt = sel.querySelector('option[value="' + topic + '"]');
        if (opt) sel.value = topic;
      });
    }

    $all('form[data-form]').forEach(function (form) {
      var status = form.querySelector('[data-form-status]');
      var button = form.querySelector('button[type="submit"]');

      function show(message) {
        if (!status) return;
        status.textContent = message;
        status.hidden = false;
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;

        var data = new FormData(form);
        if (data.get('company_website')) return; // spam trap

        var endpoint = form.getAttribute('data-endpoint');
        if (endpoint) {
          if (button) button.disabled = true;
          fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
            .then(function (res) {
              if (!res.ok) throw new Error('Request failed');
              form.reset();
              show(form.getAttribute('data-success') || 'Thank you. We will be in touch shortly.');
            })
            .catch(function () {
              show('Something went wrong. Please email us at info@hyeteam.com.');
            })
            .then(function () { if (button) button.disabled = false; });
          return;
        }

        var lines = [];
        $all('[name]', form).forEach(function (field) {
          if (field.name === 'company_website' || !field.name) return;
          if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) return;
          var value = field.tagName === 'SELECT' && field.selectedIndex > -1
            ? field.options[field.selectedIndex].text
            : field.value;
          value = (value || '').trim();
          if (!value) return;
          var label = field.getAttribute('data-label') || field.name;
          lines.push(label + ': ' + value);
        });
        var subject = form.getAttribute('data-subject') || 'Website inquiry';
        var to = form.getAttribute('data-mailto') || 'info@hyeteam.com';
        var href = 'mailto:' + to +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(lines.join('\n'));
        window.location.href = href;
        show('Your email app should open with everything filled in. Just press send. If nothing opens, email us directly at ' + to + '.');
      });
    });
  }
  initForms();

  /* ---------------------------------------------------------
     No animation path (also used when the loading fallback fired)
     --------------------------------------------------------- */
  if (!hasGsap || reduceMotion || !root.classList.contains('js')) {
    staticMode();
    initCounters(false);
    return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);
    init();
  } catch (err) {
    if (window.console) console.error(err);
    staticMode();
  }

  function init() {
    root.classList.add('has-motion');

    /* Smooth scroll */
    if (typeof window.Lenis !== 'undefined') {
      lenis = new window.Lenis({
        lerp: 0.095,
        smoothWheel: true,
        anchors: true,
        stopInertiaOnNavigate: true
      });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    ScrollTrigger.config({ ignoreMobileResize: true });

    initCurtain();
    initHero();
    initSplits();
    initReveals();
    initMedia();
    initScrub();
    initMarquees();
    initHorizontal();
    initHoverList();
    initMagnetic();
    initCounters(true);

    var refresh = function () { ScrollTrigger.refresh(); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', function () {
      refresh();
      if (window.location.hash) {
        var target = document.querySelector(window.location.hash);
        if (target && lenis) lenis.scrollTo(target, { immediate: true });
      }
    });
  }

  /* ---------------------------------------------------------
     Curtain: intro on first visit, page transitions after
     --------------------------------------------------------- */
  function setCurtainLabel(text, isIntro) {
    if (!curtainLabel) return [];
    curtainLabel.innerHTML = '';
    var chars = [];
    Array.prototype.forEach.call(text, function (ch, i) {
      var s = document.createElement('span');
      s.className = 'c' + (isIntro && i < 3 ? ' hl' : '');
      s.textContent = ch;
      curtainLabel.appendChild(s);
      chars.push(s);
    });
    return chars;
  }

  function initCurtain() {
    if (!curtain) return;
    var firstVisit = !store('hye:visited');
    store('hye:visited', '1');
    var nextLabel = store('hye:label');
    store('hye:label', null);

    var label = firstVisit ? 'HyeTeam' : (nextLabel || '');
    var chars = setCurtainLabel(label, firstVisit);

    var tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: function () { curtain.style.visibility = 'hidden'; }
    });
    gsap.set(curtain, { yPercent: 0 });

    if (chars.length) {
      gsap.set(chars, { yPercent: firstVisit ? 110 : 0 });
      if (firstVisit) {
        tl.to(chars, { yPercent: 0, duration: 1, stagger: 0.045 }, 0.1)
          .to(chars, { yPercent: -110, duration: 0.7, ease: 'expo.in', stagger: 0.025 }, '+=0.25');
      } else {
        tl.to(chars, { yPercent: -110, duration: 0.55, ease: 'expo.in', stagger: 0.02 }, 0.05);
      }
    }
    tl.to(curtain, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, chars.length ? '-=0.35' : 0.05);
    tl.add(function () { if (heroTimeline) heroTimeline.play(); }, '-=0.6');

    /* Transition out on internal navigation */
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a') : null;
      if (!a || e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download') || a.hasAttribute('data-no-transition')) return;
      var url;
      try { url = new URL(a.href, window.location.href); } catch (err) { return; }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      e.preventDefault();
      if (menuOpen) setMenu(false);
      var text = a.getAttribute('data-label');
      if (text === null) {
        var clone = a.cloneNode(true);
        $all('[aria-hidden="true"], svg, img', clone).forEach(function (n) { n.remove(); });
        text = clone.textContent || '';
      }
      text = text.replace(/\s+/g, ' ').trim();
      if (text.length > 18) text = '';
      store('hye:label', text);

      var outChars = setCurtainLabel(text, false);
      curtain.style.visibility = 'visible';
      gsap.killTweensOf(curtain);
      var out = gsap.timeline({ onComplete: function () { window.location.href = url.href; } });
      out.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: 'expo.inOut' });
      if (outChars.length) {
        gsap.set(outChars, { yPercent: 110 });
        out.to(outChars, { yPercent: 0, duration: 0.6, ease: 'expo.out', stagger: 0.025 }, '-=0.3');
      }
    });

    /* Coming back through the browser history */
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        gsap.set(curtain, { yPercent: -100 });
        curtain.style.visibility = 'hidden';
        if (heroTimeline) heroTimeline.progress(1);
      }
    });
  }

  /* ---------------------------------------------------------
     Hero intro
     --------------------------------------------------------- */
  function initHero() {
    var title = document.querySelector('[data-hero-split]');
    heroTimeline = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });

    if (title) {
      var words = splitWords(title);
      title.classList.add('is-split');
      gsap.set(words, { yPercent: 115 });
      heroTimeline.to(words, { yPercent: 0, duration: 1.4, stagger: 0.07 }, 0);

      var pills = $all('.pill-img', title);
      if (pills.length) {
        pills.forEach(function (pill) {
          var img = pill.querySelector('img');
          heroTimeline.fromTo(pill, { width: 0 }, { width: '1.75em', duration: 1.5, ease: 'expo.inOut' }, 0.35);
          if (img) heroTimeline.fromTo(img, { scale: 1.6 }, { scale: 1, duration: 1.8 }, 0.35);
        });
      }
    }

    var fades = $all('[data-hero-fade]');
    if (fades.length) {
      gsap.set(fades, { autoAlpha: 0, y: 30 });
      heroTimeline.to(fades, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.45);
    }

    /* Hero drifts away on scroll */
    var hero = document.querySelector('[data-hero]');
    if (hero && title) {
      gsap.to(title, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    var glow = document.querySelector('.hero__glow');
    if (glow) {
      gsap.to(glow, {
        yPercent: 30, scale: 1.25, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    if (!curtain) heroTimeline.play();
  }

  /* ---------------------------------------------------------
     Headline word reveals
     --------------------------------------------------------- */
  function initSplits() {
    $all('[data-split]').forEach(function (el) {
      var words = splitWords(el);
      gsap.set(words, { yPercent: 115 });
      gsap.to(words, {
        yPercent: 0,
        duration: 1.25,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
  }

  /* ---------------------------------------------------------
     Fade up reveals
     --------------------------------------------------------- */
  function initReveals() {
    $all('[data-reveal]').forEach(function (el) {
      gsap.from(el, {
        y: 46,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'expo.out',
        delay: parseFloat(el.getAttribute('data-delay') || 0),
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    $all('[data-reveal-group]').forEach(function (group) {
      var items = Array.prototype.slice.call(group.children);
      gsap.from(items, {
        y: 56,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: group, start: 'top 85%' }
      });
    });
  }

  /* ---------------------------------------------------------
     Image reveals, parallax and the expanding frame
     --------------------------------------------------------- */
  function initMedia() {
    $all('[data-img-reveal]').forEach(function (frame) {
      var img = frame.querySelector('img');
      var tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 86%' } });
      tl.fromTo(frame,
        { clipPath: 'inset(100% 0% 0% 0% round 28px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.5, ease: 'expo.inOut' });
      if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.9, ease: 'expo.out' }, 0.15);
    });

    $all('[data-parallax]').forEach(function (img) {
      var amount = parseFloat(img.getAttribute('data-parallax')) || 8;
      gsap.fromTo(img, { yPercent: -amount }, {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    $all('[data-expand]').forEach(function (frame) {
      var mm = gsap.matchMedia();
      mm.add({ wide: '(min-width: 700px)', narrow: '(max-width: 699px)' }, function (ctx) {
        var inset = ctx.conditions.wide ? '9% 12% 9% 12%' : '6% 4% 6% 4%';
        gsap.fromTo(frame,
          { clipPath: 'inset(' + inset + ' round 32px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top 95%', end: 'top 5%', scrub: true }
          });
      });
      var caption = frame.querySelector('[data-expand-caption]');
      if (caption) {
        gsap.from(caption.children, {
          y: 60, autoAlpha: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1,
          scrollTrigger: { trigger: frame, start: 'top 35%' }
        });
      }
    });
  }

  /* ---------------------------------------------------------
     Statement text lights up word by word
     --------------------------------------------------------- */
  function initScrub() {
    $all('[data-scrub]').forEach(function (el) {
      var words = splitWords(el);
      gsap.fromTo(words, { opacity: 0.14 }, {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 48%', scrub: true }
      });
    });
  }

  /* ---------------------------------------------------------
     Marquee reacts to scroll speed and direction
     --------------------------------------------------------- */
  function initMarquees() {
    $all('[data-marquee]').forEach(function (m) {
      var inner = m.querySelector('[data-marquee-inner]');
      if (!inner) return;
      var reverse = m.hasAttribute('data-reverse');
      var loop = gsap.to(inner, { xPercent: -50, ease: 'none', duration: 34, repeat: -1 });
      loop.totalTime(loop.duration() * 200);
      var base = reverse ? -1 : 1;
      loop.timeScale(base);

      ScrollTrigger.create({
        trigger: m,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: function (self) {
          var boost = Math.min(Math.abs(self.getVelocity()) / 260, 5);
          var dir = self.direction * base;
          gsap.to(loop, { timeScale: dir * (1 + boost), duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2, ease: 'power2.out' });
        }
      });
    });
  }

  /* ---------------------------------------------------------
     Horizontal scrolling
     Pinned sections move sideways while you scroll down.
     Rails drift sideways as they pass through the view.
     --------------------------------------------------------- */
  function initHorizontal() {
    var mm = gsap.matchMedia();

    mm.add('(min-width: 900px)', function () {
      $all('[data-hscroll]').forEach(function (section) {
        var pin = section.querySelector('[data-hs-pin]') || section;
        var track = section.querySelector('[data-hs-track]');
        if (!track) return;
        var distance = function () { return Math.max(0, track.scrollWidth - document.documentElement.clientWidth); };
        var items = $all('[data-hs-item]', track);
        var count = section.querySelector('[data-hs-current]');

        var tween = gsap.to(track, {
          x: function () { return -distance(); },
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: function () { return '+=' + distance(); },
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: function (self) {
              if (!count || !items.length) return;
              var idx = Math.min(items.length, Math.round(self.progress * (items.length - 1)) + 1);
              count.textContent = String(idx).padStart(2, '0');
            }
          }
        });

        $all('[data-hs-parallax]', track).forEach(function (img) {
          gsap.fromTo(img, { xPercent: -6 }, {
            xPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true
            }
          });
        });

        items.forEach(function (item) {
          gsap.from(item, {
            rotate: 2.5,
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              containerAnimation: tween,
              start: 'left right',
              end: 'left 55%',
              scrub: true
            }
          });
        });
      });

      $all('[data-rail]').forEach(function (rail) {
        var track = rail.querySelector('[data-rail-track]');
        if (!track) return;
        var distance = function () { return Math.max(0, track.scrollWidth - rail.clientWidth); };
        gsap.fromTo(track, { x: 0 }, {
          x: function () { return -distance(); },
          ease: 'none',
          scrollTrigger: {
            trigger: rail,
            start: 'top 85%',
            end: 'bottom 15%',
            scrub: 0.8,
            invalidateOnRefresh: true
          }
        });
      });
    });
  }

  /* Count indicator for native swipe tracks (mobile) */
  function initCounters(withMotion) {
    $all('[data-hscroll]').forEach(function (section) {
      var track = section.querySelector('[data-hs-track]');
      var count = section.querySelector('[data-hs-current]');
      var items = track ? $all('[data-hs-item]', track) : [];
      if (!track || !count || !items.length) return;
      track.addEventListener('scroll', function () {
        if (withMotion && window.innerWidth >= 900) return;
        var max = track.scrollWidth - track.clientWidth;
        var p = max > 0 ? track.scrollLeft / max : 0;
        var idx = Math.min(items.length, Math.round(p * (items.length - 1)) + 1);
        count.textContent = String(idx).padStart(2, '0');
      }, { passive: true });
    });
  }

  /* ---------------------------------------------------------
     Hover list with floating image
     --------------------------------------------------------- */
  function initHoverList() {
    if (!finePointer) return;
    $all('[data-hover-list]').forEach(function (list) {
      var float = document.createElement('div');
      float.className = 'hover-img';
      float.setAttribute('aria-hidden', 'true');
      var img = document.createElement('img');
      img.alt = '';
      float.appendChild(img);
      document.body.appendChild(float);
      gsap.set(float, { xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0 });

      var xTo = gsap.quickTo(float, 'x', { duration: 0.7, ease: 'power3.out' });
      var yTo = gsap.quickTo(float, 'y', { duration: 0.7, ease: 'power3.out' });

      list.addEventListener('mousemove', function (e) { xTo(e.clientX); yTo(e.clientY); });
      list.addEventListener('mouseenter', function (e) {
        gsap.set(float, { x: e.clientX, y: e.clientY });
        gsap.to(float, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' });
      });
      list.addEventListener('mouseleave', function () {
        gsap.to(float, { opacity: 0, scale: 0.6, duration: 0.5, ease: 'expo.out' });
      });
      $all('[data-img]', list).forEach(function (item) {
        var src = item.getAttribute('data-img');
        var preload = new Image();
        preload.src = src;
        item.addEventListener('mouseenter', function () {
          if (img.getAttribute('src') !== src) img.setAttribute('src', src);
          gsap.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 0.8, ease: 'expo.out' });
        });
      });
    });
  }

  /* ---------------------------------------------------------
     Magnetic buttons
     --------------------------------------------------------- */
  function initMagnetic() {
    if (!finePointer) return;
    $all('[data-magnetic]').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      var yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.38);
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' });
      });
    });
  }
})();
