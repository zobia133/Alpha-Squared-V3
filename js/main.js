/* ==========================================================================
   Alpha Squared — 2026 site
   Motion layer. Same stack the reference runs on: Lenis smooth scroll driving
   GSAP ScrollTrigger, SplitType for per-word/line heading reveals, plus
   hand-built canvas visuals in place of the reference's hosted WebGL.
   ========================================================================== */

(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';

  document.documentElement.classList.add('js-on');

  /* ── shared easing ─────────────────────────────────────────────── */
  var EASE = 'power3.out';
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.CustomEase) {
      CustomEase.create('as', '0.16, 1, 0.3, 1');
      EASE = 'as';
    }
  }

  /* ══════════════════════════════════════════════════════════════════
     1. Smooth scroll — Lenis feeds ScrollTrigger off the same RAF loop
        so scrubbed animations never lag a frame behind the scroll.
     ══════════════════════════════════════════════════════════════════ */
  var lenis = null;

  function initScroll() {
    if (REDUCED || typeof window.Lenis === 'undefined' || !hasGSAP) return;

    lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.6 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ══════════════════════════════════════════════════════════════════
     2. Loader — counts to 100, then hands off to the hero timeline.
     ══════════════════════════════════════════════════════════════════ */
  function runLoader(done) {
    var el = document.getElementById('loader');
    var pct = document.getElementById('loaderPct');
    if (!el) { done(); return; }

    // The 0→100% splash is a first-impression piece: show it once per visit,
    // not on every page change (it cost ~1.8s on each navigation).
    var seen = false;
    try { seen = sessionStorage.getItem('a2-loader-seen') === '1'; sessionStorage.setItem('a2-loader-seen', '1'); } catch (e) {}

    if (REDUCED || !hasGSAP || seen) {
      el.remove();
      document.body.classList.remove('is-loading');
      done();
      return;
    }

    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      if (el.parentNode) el.remove();
      document.body.classList.remove('is-loading');
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      done();
    }

    var n = { v: 0 };
    gsap.timeline({ onComplete: finish })
      .to(n, {
        v: 100, duration: 0.8, ease: 'power2.inOut',
        onUpdate: function () { pct.textContent = Math.round(n.v) + '%'; }
      })
      .to(el, { opacity: 0, duration: .4, ease: 'power2.inOut' }, '+=0.05');

    // Wall-clock safety net. GSAP's ticker runs on rAF, which browsers
    // throttle hard in background tabs — so a page opened in a background
    // tab can sit on the splash indefinitely and still be on it when the
    // user finally switches over. setTimeout keeps running regardless.
    setTimeout(finish, 2000);
  }

  /* ══════════════════════════════════════════════════════════════════
     3. Heading reveals — SplitType by word or line, masked so glyphs
        rise out of an invisible box rather than just fading.
     ══════════════════════════════════════════════════════════════════ */
  function splitHeadings() {
    var nodes = document.querySelectorAll('[data-split]');
    if (!hasGSAP || typeof window.SplitType === 'undefined' || REDUCED) {
      nodes.forEach(function (n) { n.style.visibility = 'visible'; });
      return;
    }

    nodes.forEach(function (node) {
      var mode = node.getAttribute('data-split');
      var split = new SplitType(node, {
        types: mode === 'lines' ? 'lines' : 'words',
        lineClass: 'sp-line',
        wordClass: 'sp-word'
      });
      var parts = mode === 'lines' ? split.lines : split.words;

      // Wrap each part so overflow can clip it into a mask. The extra
      // bottom padding (cancelled by an equal negative margin) keeps
      // descenders and the gradient's ink inside the clip box — without it
      // the clip cuts through the glyphs themselves.
      parts.forEach(function (p) {
        var w = document.createElement('span');
        w.style.cssText =
          'overflow:hidden;vertical-align:top;' +
          'padding-bottom:.22em;margin-bottom:-.22em;' +
          'display:' + (mode === 'lines' ? 'block' : 'inline-block');
        p.parentNode.insertBefore(w, p);
        w.appendChild(p);
        p.style.display = 'inline-block';
        p.style.willChange = 'transform';
      });

      node.style.visibility = 'visible';
      gsap.set(parts, { yPercent: 112 });

      // Hero headings are driven by the loader hand-off instead, so they
      // never get a ScrollTrigger — two tweens on the same targets fight
      // and leave the words stranded mid-rise.
      if (node.closest('.hero')) return;

      gsap.to(parts, {
        yPercent: 0,
        duration: 1.05,
        ease: EASE,
        stagger: mode === 'lines' ? 0.09 : 0.045,
        scrollTrigger: { trigger: node, start: 'top 88%', once: true }
      });
    });
  }

  /* ── hero heading fires on load, not on scroll ──────────────────── */
  function heroIn() {
    if (!hasGSAP || REDUCED) return;
    var parts = document.querySelectorAll('.hero [data-split] .sp-word, .hero [data-split] .sp-line');
    if (!parts.length) return;

    gsap.to(parts, { yPercent: 0, duration: 1.15, ease: EASE, stagger: 0.05 });
  }

  /* ══════════════════════════════════════════════════════════════════
     4. Generic scroll reveals — [data-anim] with an optional [data-delay]
     ══════════════════════════════════════════════════════════════════ */
  var FROM = {
    fade:  { y: 22 },
    up:    { y: 44 },
    left:  { x: -38 },
    right: { x: 38 }
  };

  function reveals() {
    var nodes = document.querySelectorAll('[data-anim]');

    if (!hasGSAP || REDUCED) {
      nodes.forEach(function (n) { n.style.opacity = 1; });
      return;
    }

    nodes.forEach(function (n) {
      var from = FROM[n.getAttribute('data-anim')] || FROM.fade;
      var delay = parseFloat(n.getAttribute('data-delay')) || 0;
      var inHero = n.closest('.hero');

      var vars = Object.assign({ opacity: 0 }, from);
      var to = {
        opacity: 1, x: 0, y: 0,
        duration: 1,
        delay: delay,
        ease: EASE
      };

      if (!inHero) {
        to.scrollTrigger = { trigger: n, start: 'top 90%', once: true };
      }

      gsap.fromTo(n, vars, to);
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     5. Count-up stats
     ══════════════════════════════════════════════════════════════════ */
  function counters() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';

      if (!hasGSAP || REDUCED) { el.textContent = target + suffix; return; }

      var o = { v: 0 };
      gsap.to(o, {
        v: target,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: function () { el.textContent = Math.round(o.v) + suffix; }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     5b. Process rail — the gradient bar over each step draws itself in
     ══════════════════════════════════════════════════════════════════ */
  function rails() {
    var steps = document.querySelectorAll('[data-lit]');
    if (!steps.length) return;

    if (!hasGSAP || REDUCED) {
      steps.forEach(function (s) { s.classList.add('is-lit'); });
      return;
    }

    steps.forEach(function (s, i) {
      ScrollTrigger.create({
        trigger: s,
        start: 'top 82%',
        once: true,
        onEnter: function () {
          setTimeout(function () { s.classList.add('is-lit'); }, i * 130);
        }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     6. Parallax on the hero glow layers
     ══════════════════════════════════════════════════════════════════ */
  function parallax() {
    if (!hasGSAP || REDUCED) return;

    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var amt = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      gsap.to(el, {
        yPercent: amt * 100,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    });

    // slow breathing on the arc so the hero is never fully static
    gsap.to('.hero__arc', {
      scale: 1.045, opacity: .82,
      duration: 7, ease: 'sine.inOut', repeat: -1, yoyo: true
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     7. Nav — hide on scroll down, show on scroll up
     ══════════════════════════════════════════════════════════════════ */
  function nav() {
    var el = document.getElementById('nav');
    var burger = document.getElementById('burger');
    if (!el) return;

    if (burger) {
      burger.addEventListener('click', function () {
        var open = el.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
      });
      el.querySelectorAll('.nav__links a').forEach(function (a) {
        a.addEventListener('click', function () {
          el.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    var last = 0;
    function onScroll() {
      var y = window.scrollY;
      el.classList.toggle('is-stuck', y > 40);
      if (!el.classList.contains('is-open')) {
        el.classList.toggle('is-hidden', y > last && y > 400);
      }
      last = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // in-page anchors need to go through Lenis, not the native jump
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.querySelector(a.getAttribute('href'));
        if (!t) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(t, { offset: -90 });
        else t.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     8. Card cursor glow
     ══════════════════════════════════════════════════════════════════ */
  function cardGlow() {
    if (REDUCED) return;
    document.querySelectorAll('.card').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     8b. Case-study covers — a card that ships before its screenshot does
     falls back to the .cs__plate sitting behind the image.
     ══════════════════════════════════════════════════════════════════ */
  function shotFallback() {
    document.querySelectorAll('.cs__shot img').forEach(function (img) {
      img.addEventListener('error', function () { img.remove(); });
      if (img.complete && img.naturalWidth === 0) img.remove();
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     9. Accordion + typical/alpha toggle
     ══════════════════════════════════════════════════════════════════ */
  var ACC_COPY = {
    typical: [
      'A rotating cast of developers who learn your domain on your budget.',
      'Generic CRUD screens that ignore how dispatchers actually work.',
      'AI scoped in a slide deck and quietly dropped before delivery.',
      'An offshore team asleep when production breaks at 2am.'
    ],
    alpha: [
      'The same senior engineers from kickoff to handover, 16+ years deep.',
      'Interfaces shaped by process mapping done alongside your operators.',
      'AI shipped into production, measured against a job it has to do.',
      'A Canadian principal in your timezone, accountable by name.'
    ]
  };

  function accordion() {
    var acc = document.getElementById('acc');
    if (!acc) return;

    var items = Array.prototype.slice.call(acc.querySelectorAll('.acc__item'));

    // Animate to a measured pixel height rather than 'auto', and kill any
    // in-flight tween on the same element first. overwrite:'auto' resolves
    // on the next tick, which is too late when every item is set in one go.
    function setOpen(item, open) {
      var body = item.querySelector('.acc__a');
      item.classList.toggle('is-open', open);

      if (!hasGSAP || REDUCED) { body.style.height = open ? 'auto' : '0'; return; }

      gsap.killTweensOf(body);
      gsap.to(body, {
        height: open ? body.scrollHeight : 0,
        duration: .5,
        ease: 'power2.inOut'
      });
    }

    // One open item at a time; clicking the open one closes it.
    function openOnly(idx) {
      items.forEach(function (item, i) { setOpen(item, i === idx); });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }

    items.forEach(function (item, i) {
      setOpen(item, i === 0);
      item.querySelector('.acc__q').addEventListener('click', function () {
        openOnly(item.classList.contains('is-open') ? -1 : i);
      });
    });

    // toggle swaps the answer copy between the two modes
    var toggle = document.getElementById('toggle');
    if (!toggle) return;

    toggle.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        toggle.querySelectorAll('button').forEach(function (o) { o.classList.remove('is-on'); });
        b.classList.add('is-on');

        var copy = ACC_COPY[b.getAttribute('data-mode')];
        items.forEach(function (item, i) {
          var p = item.querySelector('.acc__a p');
          if (!copy[i]) return;

          p.textContent = copy[i];
          if (hasGSAP && !REDUCED) {
            gsap.fromTo(p, { opacity: 0 }, { opacity: 1, duration: .35, overwrite: 'auto' });
          }
          // new copy is a different length, so the open panel needs re-measuring
          if (item.classList.contains('is-open')) setOpen(item, true);
        });
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     10. Canvas helper — DPR-aware sizing that survives resize
     ══════════════════════════════════════════════════════════════════ */
  function setupCanvas(canvas) {
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0;

    function resize() {
      var r = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);
    return { ctx: ctx, get w() { return w; }, get h() { return h; } };
  }

  function onScreen(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > -200 && r.top < window.innerHeight + 200;
  }

  /* ══════════════════════════════════════════════════════════════════
     11. Hero visual — dot-matrix world map with delivery cities pulsing.
         Replaces the earlier isometric grid, which read as a generic
         data-centre abstraction and said nothing about the work. The map
         *is* the credibility claim the stats below it quantify.

         Land comes from Natural Earth 110m, rasterised at build time to a
         210x84 bit mask (see README). ~2.9KB of base64, no runtime data
         dependency.
     ══════════════════════════════════════════════════════════════════ */

  var LAND_COLS = 210, LAND_ROWS = 84;
  var LAND_LAT0 = 83, LAND_LAT1 = -56;
  var LAND_B64 =
    'AAAAAAAAA//xm/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAeH8////+AAAKAA4AAAHAAAAAAAAAAAAAAANPfj////8AAD4AAAAAA' +
    'BsAAAAAAAAAAAABgAA8D////8AABgAAAAAAAMAAAAAAAAAAAAAdjXcAB///8AAAAAAAcAAf/4AB8AAAAAAAAPgAcAAA///4A' +
    'AAAAADgAB//wAAAAAAAAAAAO/zz9gAf//gAAAAAACAY/////A/AAAAB8AAA/4Z/+Af//QAAAB4AAA7////////AAAH////nI' +
    'sc+AH//AAAAf/gAGZ//////////4H///////8nwP/wAAAB//5f/7//////////ef///////gOQP8AfgAD8+P////////////' +
    '/AB//////8UHgH4AOAAH7/f////////////+AH//////4LhADwAAAA/n/////////////39AH9v////wA8AAwAAAA/j/////' +
    '///////8vgAD4A////wB+QAAAAAA/h///////////wYwAAAUAH///4A/4AAAAAwDh///////////ADwAADAAD////g/8AAAA' +
    'AwOH//////////+ADgAAAAAF////5//AAAACYO///////////+gDAAAAAAA////5//gAAAG8/////////////oCAAAAAAAf/' +
    '////8AAAAAz/////////////oAAAAAAAAP////+hwAAAAP/////////////gAAAAAAAAL/////gQAAAAf/////////////AA' +
    'AAAAAAAH/////8AAAAAP//6fj///////+AAAAAAAAAH////+gAAAAAP0/wPn///////8IAAAAAAAAP////8AAAAAD+OPgHj/' +
    '//////gYAAAAAAAAH////4AAAAAD4Juv/x///////gQAAAAAAAAH////gAAAAAH4Amf/z//////CAQAAAAAAAAD////gAAAA' +
    'ADwDGf/z//////RAgAAAAAAAAD////gAAAAAAH4AA////////hjgAAAAAAAAB////AAAAAAB/4AA////////gaAAAAAAAAAA' +
    'f//8AAAAAAD/+EB////////wQAAAAAAAAAAX//4AAAAAAH//n/////////wAAAAAAAAAAAL/yEAAAAAAH/////n//////wAA' +
    'AAAAAAAAAJ/AEAAAAAAf///8/z//////gAAAAAAAAAAAB/AEAAAAAA////+/w//////gAAAAAAAAAAAC/ABAAAAAA/////f5' +
    'A/////QAAAAAAAAAAAAfAOAAAAAB/////P/wP///8QAAAAAAAAAAAAPDBgAAAAB/////v/gP/H+QAAAAAAAAIAAAAPjAGAAA' +
    'AB/////n/gH+D+wAAAAAAAAAAAAAD/AAAAAAA/////z+AD4D+AQAAAAAAAAAAAAAuAAAAAAB/////z4ADwC/AQAAAAAAAAAA' +
    'AAAHwAAAAAB/////7wADwA/gQAAAAAAAAAAAAAAwAAAAAB/////+AABwAvgAAAAAAAAAAAAAAAQeAAAAA/////8YABwAHAIA' +
    'AAAAAAAAAAAAAKf8AAAAf/////4AAgAiACAAAAAAAAAAAAAAF/+AAAAf/////wAAIAQAOAAAAAAAAAAAAAAA//AAAAH8////' +
    'wAAAAIBAAAAAAAAAAAAAAAA//4AAACAv///gAAABIDAAAAAAAAAAAAAAAA//4AAAAAH///AAAAAoPAAAAAAAAAAAAAAAB//8' +
    'AAAAAP//+AAAAAYfRAAAAAAAAAAAAAAD//+AAAAAP//8AAAAAYfAIAAAAAAAAAAAAAD///gAAAAH//4AAAAAMewBAAAAAAAA' +
    'AAAAAD///+AAAAH//wAAAAAGAAP4AAAAAAAAAAAAD////AAAAD//wAAAAACAIA8gAAAAAAAAAAAD////gAAAD//wAAAAAB4A' +
    'A+AAAAAAAAAAAAB////gAAAB//wAAAAAABSAbAAAAAAAAAAAAB////AAAAB//4AAAAAAAAAAgQAAAAAAAAAAA///+AAAAB//' +
    '4AAAAAAAAOAAAAAAAAAAAAAA///8AAAAD//4QAAAAAAAcIAAAAAAAAAAAAAf//8AAAAD//4wAAAAAAD8MACAAAAAAAAAAAH/' +
    '/8AAAAD//hwAAAAAAP/cAAAAAAAAAAAAAD//8AAAAD//BwAAAAAAP/8AAAAAAAAAAAAAD//4AAAAB/+BgAAAAAA///AAAAAA' +
    'AAAAAAAD//4AAAAB//DgAAAAAH///AAAAAAAAAAAAAD//gAAAAB//DgAAAAAH///gAAAAAAAAAAAAD/+AAAAAA/8BAAAAAAH' +
    '///wAAAAAAAAAAAAD/+AAAAAA/8AAAAAAAH///wAAAAAAAAAAAAH/8AAAAAAf8AAAAAAAD///4AAAAAAAAAAAAH/8AAAAAAf' +
    '4AAAAAAAD///wAAAAAAAAAAAAH/4AAAAAAPwAAAAAAAB/H/wAAAAAAAAAAAAH/wAAAAAAPAAAAAAAAD4D/gAAAAAAAAAAAAH' +
    '/AAAAAAAAAAAAAAAAAAA/gAIAAAAAAAAAAP/AAAAAAAAAAAAAAAAAAAfAAEAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAKAAGAA' +
    'AAAAAAAAP4AAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAADAAYAAAAAAAAAAPgAAAAAAAAAAAAAAAA' +
    'AAAAAAwAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAAAAAA' +
    'AAAAAAAAAAAAAAAAAAAAAAAAAAeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
    'OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAA';

  /* ─────────────────────────────────────────────────────────────────
     The 17 countries we've delivered into (client-supplied, 2026-07-28).
     North America is broken out to city level instead of one dot per
     country — it's the flagship market, so it gets more visual weight on
     the map than the rest. Every other region stays country-level.

     dx/dy are label offsets in px from the marker; `a` is the text anchor.
     Europe, the Gulf and now North America are hand-fanned outward into
     empty ocean because the markers sit within ~80px of each other at
     this scale — anything placed inline there collides. A leader line is
     drawn automatically whenever a label is pushed far enough from its
     marker to need one.
     ───────────────────────────────────────────────────────────────── */
  var PLACES = [
    /* North America — city-level, fanned out from a tight real cluster */
    { n: 'Edmonton',     lat: 53.5,  lng: -113.5, hq: true, dx: 0,   dy: -26, a: 'center' },
    { n: 'Calgary',      lat: 51.0,  lng: -114.1,           dx: -40, dy: -6,  a: 'right' },
    { n: 'Vancouver',    lat: 49.3,  lng: -123.1,           dx: -66, dy: 10,  a: 'right' },
    { n: 'Toronto',      lat: 43.7,  lng: -79.4,            dx: 50,  dy: -16, a: 'left' },
    { n: 'New York',     lat: 40.7,  lng: -74.0,            dx: 80,  dy: 6,   a: 'left' },
    { n: 'Chicago',      lat: 41.9,  lng: -87.6,            dx: 32,  dy: 28,  a: 'left' },
    { n: 'Dallas',       lat: 32.8,  lng: -96.8,            dx: -10, dy: 50,  a: 'center' },
    { n: 'Miami',        lat: 25.8,  lng: -80.2,            dx: 48,  dy: 48,  a: 'left' },

    /* Europe — fanned into the Atlantic and the Arctic */
    { n: 'Sweden',       lat: 62.0,  lng: 15.0,             dx: 30,  dy: -22, a: 'left' },
    { n: 'UK',           lat: 54.0,  lng: -2.5,             dx: -46, dy: -30, a: 'right' },
    { n: 'France',       lat: 46.6,  lng: 2.4,              dx: -62, dy: -4,  a: 'right' },
    { n: 'Spain',        lat: 40.3,  lng: -3.7,             dx: -56, dy: 24,  a: 'right' },
    { n: 'Switzerland',  lat: 46.8,  lng: 8.2,              dx: 52,  dy: -30, a: 'left' },
    { n: 'Italy',        lat: 42.8,  lng: 12.6,             dx: 50,  dy: 2,   a: 'left' },

    /* Gulf — fanned down and out */
    { n: 'Saudi Arabia', lat: 24.0,  lng: 45.0,             dx: -34, dy: 30,  a: 'right' },
    { n: 'UAE',          lat: 24.0,  lng: 54.0,             dx: 30,  dy: -16, a: 'left' },
    { n: 'Oman',         lat: 21.0,  lng: 57.0,             dx: 32,  dy: 22,  a: 'left' },

    { n: 'Pakistan',     lat: 30.2,  lng: 69.5,             dx: 0,   dy: -20, a: 'center' },
    { n: 'China',        lat: 35.0,  lng: 104.0,            dx: 20,  dy: -18, a: 'left' },
    { n: 'Malaysia',     lat: 4.2,   lng: 102.0,            dx: 14,  dy: 22,  a: 'left' },
    { n: 'Nigeria',      lat: 9.1,   lng: 8.7,              dx: -16, dy: 24,  a: 'right' },
    { n: 'South Africa', lat: -29.0, lng: 24.7,             dx: 0,   dy: 24,  a: 'center' },
    { n: 'Australia',    lat: -25.3, lng: 133.8,            dx: 0,   dy: 26,  a: 'center' }
  ];

  function decodeLand() {
    var bin = atob(LAND_B64);
    var bits = new Uint8Array(LAND_COLS * LAND_ROWS);
    for (var i = 0; i < bits.length; i++) {
      bits[i] = (bin.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
    }
    return bits;
  }

  function heroViz() {
    var canvas = document.getElementById('heroViz');
    if (!canvas) return;

    var c = setupCanvas(canvas);
    var land = decodeLand();

    // equirectangular: lat/lng → normalised 0..1 across the mask's extent
    function project(lat, lng) {
      return {
        u: (lng + 180) / 360,
        v: (LAND_LAT0 - lat) / (LAND_LAT0 - LAND_LAT1)
      };
    }

    var geom = null;
    function layout() {
      // Uniform scale — one step for both axes, so the geography keeps its
      // true proportions. The band's height is sized off viewport width in
      // CSS (36vw against a 2.5:1 mask), which lets the map run nearly edge
      // to edge without the horizontal-only stretch it used to need.
      var step = Math.min(c.w / LAND_COLS, c.h / LAND_ROWS);
      var mw = step * LAND_COLS, mh = step * LAND_ROWS;
      geom = {
        stepX: step, stepY: step,
        x0: (c.w - mw) / 2,
        y0: (c.h - mh) / 2,
        mw: mw, mh: mh,
        r: Math.max(1, step * 0.3)
      };
    }
    layout();
    window.addEventListener('resize', function () { setTimeout(layout, 60); });

    PLACES.forEach(function (ct, i) {
      ct.phase = (i * 0.37) % 1;
      ct.speed = 0.22 + (i % 5) * 0.035;
    });

    var t0 = 0, clock = 0;
    function frame(ts) {
      requestAnimationFrame(frame);
      if (!onScreen(canvas)) return;
      if (ts - t0 < 32) return;                 // ~30fps is plenty for this
      var dt = Math.min(0.1, (ts - t0) / 1000);
      t0 = ts;
      if (!REDUCED) clock += dt;

      var ctx = c.ctx;
      ctx.clearRect(0, 0, c.w, c.h);
      if (!geom) return;

      var g = geom;

      /* ── land dots ── */
      for (var row = 0; row < LAND_ROWS; row++) {
        for (var col = 0; col < LAND_COLS; col++) {
          if (!land[row * LAND_COLS + col]) continue;

          var x = g.x0 + (col + 0.5) * g.stepX;
          var y = g.y0 + (row + 0.5) * g.stepY;

          // colour drifts blue → teal → orange west-to-east, brand gradient
          var t = col / LAND_COLS;
          var cr, cg, cb;
          if (t < 0.5) {
            var k = t / 0.5;
            cr = 43 + k * 4; cg = 167 + k * 50; cb = 255 - k * 48;
          } else {
            var k2 = (t - 0.5) / 0.5;
            cr = 47 + k2 * 207; cg = 217 - k2 * 81; cb = 207 - k2 * 180;
          }

          // Gentle vertical fade so the map settles into the background.
          // Floored at 0.55 so the continents stay legible at the edges —
          // below that the map reads as noise rather than geography.
          // Base alpha is deliberately low: the land is a backdrop for the
          // markers and labels, and at full strength it pulled focus off
          // the headline sitting above it.
          var fade = Math.max(0.55, 1 - Math.abs((row / LAND_ROWS) - 0.42) * 0.5);
          ctx.fillStyle = 'rgba(' + (cr | 0) + ',' + (cg | 0) + ',' + (cb | 0) + ',' +
                          (0.32 * fade).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(x, y, g.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* ── markers ── */
      var marks = [];

      PLACES.forEach(function (ct) {
        var p = project(ct.lat, ct.lng);
        var x = g.x0 + p.u * g.mw;
        var y = g.y0 + p.v * g.mh;

        var beat = (clock * ct.speed + ct.phase) % 1;      // 0..1 ring cycle
        var base = ct.hq ? 3.4 : 2.4;

        // expanding ring
        if (!REDUCED) {
          var rr = base + beat * (ct.hq ? 30 : 21);
          ctx.strokeStyle = 'rgba(255,255,255,' + (0.34 * (1 - beat)).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, rr, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        var glow = ctx.createRadialGradient(x, y, 0, x, y, ct.hq ? 26 : 17);
        glow.addColorStop(0, ct.hq ? 'rgba(255,190,110,.95)' : 'rgba(190,150,255,.8)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, ct.hq ? 26 : 17, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x, y, base, 0, Math.PI * 2);
        ctx.fill();

        marks.push({ ct: ct, x: x, y: y });
      });

      /* ── country labels, drawn last so nothing paints over them ──
         Below 820px the map is too narrow to place 17 labels without
         collisions, so they're dropped and the strip under the map
         carries the names instead. The threshold has to match the
         breakpoint that reveals .geo, or the 760–820 band shows both. */
      if (c.w >= 820) {
        ctx.font = '500 11px Poppins, -apple-system, sans-serif';
        ctx.textBaseline = 'middle';

        marks.forEach(function (m) {
          var ct = m.ct;
          var tx = m.x + (ct.dx || 0);
          var ty = m.y + (ct.dy || 0);
          var far = Math.abs(ct.dx || 0) > 26 || Math.abs(ct.dy || 0) > 22;

          // leader line back to the marker, for labels fanned out of a cluster
          if (far) {
            ctx.strokeStyle = 'rgba(255,255,255,.22)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(tx - (ct.a === 'right' ? -3 : ct.a === 'left' ? 3 : 0), ty);
            ctx.stroke();
          }

          ctx.textAlign = ct.a || 'center';
          var w = ctx.measureText(ct.n).width;
          var padX = 5.5, boxH = 16;
          var bx = ct.a === 'left' ? tx - padX
                 : ct.a === 'right' ? tx - w - padX
                 : tx - w / 2 - padX;

          // plate behind the text — over a dotted map bare text loses its edges
          ctx.fillStyle = 'rgba(11,8,18,.72)';
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(bx, ty - boxH / 2, w + padX * 2, boxH, 4);
          else ctx.rect(bx, ty - boxH / 2, w + padX * 2, boxH);
          ctx.fill();

          ctx.fillStyle = ct.hq ? 'rgba(255,206,150,.96)' : 'rgba(255,255,255,.88)';
          ctx.fillText(ct.n, tx, ty);
        });
      }
    }
    requestAnimationFrame(frame);
  }

  /* ══════════════════════════════════════════════════════════════════
     12. Proof visual — a live dispatch board abstraction
     ══════════════════════════════════════════════════════════════════ */
  function proofViz() {
    var canvas = document.getElementById('proofViz');
    if (!canvas) return;

    var c = setupCanvas(canvas);
    var LANES = 7;
    var jobs = [];

    function build() {
      jobs = [];
      for (var i = 0; i < 22; i++) {
        jobs.push({
          lane: i % LANES,
          x: Math.random(),
          w: 0.1 + Math.random() * 0.24,
          v: 0.0009 + Math.random() * 0.0014,
          c: Math.random()
        });
      }
    }
    build();

    var t0 = 0;
    function frame(ts) {
      requestAnimationFrame(frame);
      if (!onScreen(canvas)) return;
      if (ts - t0 < 24) return;
      t0 = ts;

      var ctx = c.ctx, lh = c.h / LANES;
      ctx.clearRect(0, 0, c.w, c.h);

      // lane rails
      ctx.strokeStyle = 'rgba(255,255,255,.06)';
      ctx.lineWidth = 1;
      for (var i = 0; i <= LANES; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * lh);
        ctx.lineTo(c.w, i * lh);
        ctx.stroke();
      }

      jobs.forEach(function (j) {
        j.x += j.v;
        if (j.x > 1.1) { j.x = -j.w - Math.random() * 0.3; j.c = Math.random(); }

        var x = j.x * c.w, w = j.w * c.w;
        var y = j.lane * lh + lh * 0.26, h = lh * 0.48;
        var col = j.c < .34 ? '28,78,255' : (j.c < .68 ? '172,36,255' : '254,136,27');

        var g = ctx.createLinearGradient(x, 0, x + w, 0);
        g.addColorStop(0, 'rgba(' + col + ',.06)');
        g.addColorStop(.72, 'rgba(' + col + ',.62)');
        g.addColorStop(1, 'rgba(' + col + ',.9)');
        ctx.fillStyle = g;

        var r = h / 2;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, Math.max(w, r * 2), h, r);
        else ctx.rect(x, y, Math.max(w, r * 2), h);
        ctx.fill();
      });
    }
    requestAnimationFrame(frame);
  }

  /* ══════════════════════════════════════════════════════════════════
     13. Voice agent — one speech envelope drives the globe's rings, the
         waveform and the transcript, so the block reads as a single
         agent mid-sentence rather than three unrelated loops.
     ══════════════════════════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════════════════════════
     Voice-agent speech envelope. One signal drives the globe's rings,
     the waveform bars and the transcript, so they stay in sync and the
     block reads as a single agent speaking rather than three loops.
     Phrase-shaped on purpose: bursts of syllables, then a breath.
     ══════════════════════════════════════════════════════════════════ */
  var AGENT = { level: 0, speaking: true, _ts: -1 };

  function agentEnvelope(t) {
    // Advance once per frame no matter how many consumers ask, so the globe
    // and the waveform can each drive it and neither freezes if the other
    // is off-screen (rAF also stops entirely in a background tab).
    if (t === AGENT._ts) return AGENT.level;
    AGENT._ts = t;

    // 5.4s cycle: ~4s of speech in syllable bursts, then a pause
    var cycle = (t % 5400) / 5400;
    if (cycle > 0.76) { AGENT.speaking = false; AGENT.level += (0 - AGENT.level) * 0.08; return AGENT.level; }
    AGENT.speaking = true;
    var syll = Math.abs(Math.sin(t / 118)) * Math.abs(Math.sin(t / 47));
    var phrase = 0.55 + 0.45 * Math.sin(cycle * Math.PI * 3.1);
    var target = Math.max(0, syll * phrase);
    AGENT.level += (target - AGENT.level) * 0.22;      // smooth, no strobing
    return AGENT.level;
  }

  /* Waveform bars under the transcript — same envelope, offset per bar so it
     reads as speech rather than a level meter. */
  function agentWave() {
    var host = document.getElementById('agentWave');
    if (!host) return;
    var N = 28, bars = [];
    for (var i = 0; i < N; i++) { var b = document.createElement('i'); host.appendChild(b); bars.push(b); }
    if (REDUCED) { bars.forEach(function (b) { b.style.height = '6px'; }); return; }
    var t0 = 0;
    (function frame(ts) {
      requestAnimationFrame(frame);
      if (ts - t0 < 40) return;                        // 25fps is plenty
      t0 = ts;
      if (!onScreen(host)) return;
      var lv = REDUCED ? 0 : agentEnvelope(ts);
      for (var i = 0; i < N; i++) {
        var centre = 1 - Math.abs(i - (N - 1) / 2) / ((N - 1) / 2);   // taller mid-row
        var j = Math.abs(Math.sin(ts / 90 + i * 0.7));
        bars[i].style.height = (3 + lv * j * centre * 23).toFixed(1) + 'px';
      }
    })(0);
  }

  /* Transcript — cycles the kind of line the front-desk agent actually says. */
  function agentLine() {
    var el = document.getElementById('agentLine');
    if (!el || REDUCED) return;
    var lines = [
      'Good afternoon, Alpha Squared here. How can I help?',
      'I can see Thursday at 10, or Friday morning. Which suits?',
      'Booked. I\u2019ve put the details in your CRM.'
    ];
    var i = 0;
    setInterval(function () {
      if (!onScreen(el)) return;
      i = (i + 1) % lines.length;
      el.style.opacity = 0;
      setTimeout(function () { el.textContent = lines[i]; el.style.opacity = 1; }, 260);
    }, 5400);                                          // matches the envelope cycle
    el.style.transition = 'opacity .26s ease';
  }

  /* ══════════════════════════════════════════════════════════════════
     12b. Chat assistant — opened by the "Voice agent" pill on the AI
     block. One assistant, two ways in: type, or talk. Voice uses
     SpeechRecognition in and speechSynthesis out, both progressive —
     where the browser has neither, this stays a plain text chat.
     ══════════════════════════════════════════════════════════════════ */
  function chatBot() {
    var root = document.getElementById('a2chat');
    if (!root) return;

    var log    = document.getElementById('chatLog');
    var chips  = document.getElementById('chatChips');
    var form   = document.getElementById('chatForm');
    var input  = document.getElementById('chatInput');
    var panel  = root.querySelector('.chat__panel');
    var voice  = document.getElementById('chatVoice');
    var orb    = document.getElementById('chatOrb');
    var vstate = document.getElementById('chatVState');
    var vwave  = document.getElementById('chatVWave');

    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var TTS = window.speechSynthesis;
    var rec = null, listening = false, mode = 'text', lastFocus = null, waveRAF = 0, greeted = false;

    /* ── what it knows. First match wins, so order is priority. ──── */
    var OPENER = 'Hi — Alpha Squared assistant here. Ask me what we build, how we work, or what a project runs to. Say "book a call" and I\'ll hand you the calendar.';

    var WELCOME = 'Hi, you\'re through to the Alpha Squared voice agent. Ask me what we build, how we work, or what a project costs — or just say, book a call.';

    var RULES = [
      { k: /\b(book|call|meeting|schedule|demo|talk to (a )?human|speak to someone)\b/,
        a: 'Happy to set that up. Twenty minutes with Abdullah, no form in between — the calendar is in the "Let\'s talk" section at the bottom of this page. Or email info@alphasquared.co and we\'ll come back within two business days.',
        go: '#contact' },

      { k: /\b(price|pricing|cost|budget|rate|how much|quote)\b/,
        a: 'We scope before we price, so there is no menu. Most engagements start as a fixed-scope discovery of two to three weeks, then move to a monthly pod. Tell me the operation and roughly what you want automated, and we will give you an honest read on scope and cost.' },

      { k: /\b(how long|timeline|timeframe|deadline|how fast|when can)\b/,
        a: 'Discovery runs two to three weeks. A first production release is usually six to twelve weeks after that, depending on how many integrations sit in the way. We ship in increments, so you see working software long before the end date.' },

      { k: /\b(voice|phone|call answer|receptionist|front desk|ivr)\b/,
        a: 'Voice agents are live for a real client today — the AI Front Desk. It answers inbound calls, understands intent, checks live availability, books the job and writes it straight into the CRM with no human in the loop. That is the same kind of agent you are talking to now.' },

      { k: /\b(ai|automation|llm|gpt|agent|ocr|document)\b/,
        a: 'AI and automation is the fastest-moving part of what we do: voice agents on real inbound calls, OCR microservices reading real documents, and agentic assistants wired into live CRMs. We treat AI as engineering with a measurable job, not a demo.' },

      { k: /\b(truck|trucking|fleet|dispatch|driver|freight|logistic|transport|eld|driveaway)\b/,
        a: 'Trucking is where we automate deepest. We built the dispatch platform for Alliance Driveaway — one-way driveaway jobs where the vehicle being moved is the freight — covering dispatch, contractor drivers, documents and settlements. If you are running on spreadsheets and phone calls, that is exactly the problem we solve.' },

      { k: /\b(integrat|api|quickbooks|salesforce|hubspot|erp|netsuite|webhook|sync)\b/,
        a: 'Integrations are usually the hard half of the job, so we treat them as first-class work. We have shipped deep QuickBooks sync for load-to-invoice, HubSpot CRM writes straight off a live phone call, and plenty of custom APIs in between. Tell me what systems have to stay in sync and I will tell you how we would wire them.' },

      { k: /\b(mobile|ios|android|app store|play store|react native|flutter|swift|kotlin)\b/,
        a: 'Native iOS and Android, built to survive the field — offline-tolerant sync, GPS, camera, signatures and push. The Alliance driver apps run exactly that way, because a driver in a dead zone still has to close out a job.' },

      { k: /\b(stack|tech|technolog|laravel|vue|node|react|php|python|aws|azure|database)\b/,
        a: 'Mostly Laravel and Node on the backend, Vue and React on the front, Swift and Kotlin for mobile, Postgres or MySQL for data, and AWS or Azure for infrastructure. We pick boring, well-supported tools on purpose — you should be able to hire for your own codebase later.' },

      { k: /\b(support|maintain|maintenance|sla|uptime|monitoring|after launch|warranty|bug)\b/,
        a: 'We stay after launch. Releases, monitoring, on-call support and a live roadmap — the same team that built it keeps it running. Most clients move onto a monthly support and roadmap arrangement once the first release is out.' },

      { k: /\b(process|how do you work|methodolog|agile|sprint|standup|communicat|progress|update)\b/,
        a: 'Plan, design, build, operate — one team across all four. You get a working increment every sprint, a shared board you can see at any time, and direct access to the people writing the code. No account manager sitting between you and the build.' },

      { k: /\b(legacy|existing (system|app|software)|rebuild|rewrite|migrat|take over|inherit|rescue)\b/,
        a: 'We take over existing systems often. First step is a short audit — what is worth keeping, what is quietly costing you, and what has to be replaced first. Then we modernise in stages so the business never has to stop while we work.' },

      { k: /\b(contract|engagement|retainer|monthly|ownership|own the code|source code|ip|licen[sc]e)\b/,
        a: 'Fixed-scope discovery first, then a monthly pod you can scale up or down. You own the code and the IP outright — repositories, infrastructure and accounts are in your name from day one.' },

      { k: /\b(industr|sector|vertical|healthcare|clinic|energy|retail|fintech|education|public safety|marketplace)\b/,
        a: 'Ten sectors so far: trucking and transport, energy and industrial, healthcare, public safety, field services, retail and POS, fintech, marketplaces, education and media. Different domains, same pattern — operations that cannot afford downtime.' },

      { k: /\b(why (you|alpha)|what makes you|different from|competitor|instead of)\b/,
        a: 'Three reasons clients give us: senior engineers only, domain depth we already paid for on someone else\'s budget, and the fact that we stay after launch. Fifty-two repeat clients is the number I would judge us on.' },

      { k: /\b(service|what do you do|offer|capabilit|build)\b/,
        a: 'Six lines: operations platforms, mobile apps, AI and automation, product and UX design, dedicated engineering teams, and cloud, DevOps and long-term support. The Services page breaks each of them down.' },

      { k: /\b(case stud|portfolio|example|work|client|reference)\b/,
        a: 'Alliance Driveaway dispatch, the AI Front Desk voice agent, WhoIFollow, FluidsData and internal messaging work for Coca-Cola, among others. The Case Studies page has the problem, the solution and the outcome for each.' },

      { k: /\b(team|who are you|about|company|where are you|located|canada)\b/,
        a: 'Alpha Squared is a Canadian software studio in Edmonton, Alberta, shipping since 2012 — 265+ projects, 17 countries, 52 repeat clients. Senior engineers only, embedded with your team rather than thrown over a wall.' },

      { k: /\b(secur|compliance|soc ?2|nda|data|privacy|gdpr|pipeda)\b/,
        a: 'Security is on the Trust page: least-privilege access, encrypted data at rest and in transit, audited deploys, and NDAs signed before anything sensitive changes hands. Tell me your compliance regime and I will get the right engineer on the call.' },

      { k: /\b(hire|team|staff|augment|developer|pod|capacity)\b/,
        a: 'Dedicated teams: a vetted senior pod embedded with yours, running your rituals and your board. It gets you capacity without the twelve-week local hiring cycle, and you can scale it down as cleanly as you scaled it up.' },

      { k: /\b(hi|hey|hello|salam|good (morning|afternoon|evening))\b/,
        a: 'Hello. What are you building — or what is currently breaking? Either one is a good place to start.' },

      { k: /\b(thank|thanks|cheers|great|nice|awesome)\b/,
        a: 'Any time. If you want this in front of an engineer instead, the booking calendar is at the bottom of the page.' }
    ];

    var FALLBACK = 'I can speak to what we build, how we work, timelines, pricing and security. If it is more specific than that, the fastest path is twenty minutes with the team — the calendar is at the bottom of this page.';

    var CHIPS = [
      'What do you build?',
      'How much does a project cost?',
      'Tell me about the voice agent',
      'Can you integrate with QuickBooks?',
      'Do you support it after launch?',
      'Book a call'
    ];

    function answer(q) {
      var t = q.toLowerCase();
      for (var i = 0; i < RULES.length; i++) {
        if (RULES[i].k.test(t)) return RULES[i];
      }
      return { a: FALLBACK };
    }

    /* ── transcript ─────────────────────────────────────────────── */
    function bubble(who, text) {
      var el = document.createElement('div');
      el.className = 'chat__msg chat__msg--' + who;
      el.textContent = text;                            // never innerHTML: user text
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
      return el;
    }

    function typing() {
      var el = document.createElement('div');
      el.className = 'chat__msg chat__msg--bot chat__typing';
      el.innerHTML = '<i></i><i></i><i></i>';
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
      return el;
    }

    function speak(text) {
      if (!TTS || mode !== 'voice') return;
      TTS.cancel();
      var u = new SpeechSynthesisUtterance(text);
      var v = pickVoice();
      if (v) u.voice = v;
      u.lang = v ? v.lang : 'en-US';
      u.rate = 1.03; u.pitch = 1;
      u.onstart = function () { setVState('Speaking…'); runWave(true); };
      u.onend = function () { runWave(false); setVState(SR ? 'Tap to talk' : 'Type below — this browser has no mic support'); };
      TTS.speak(u);
    }

    /* Chrome fills the voice list asynchronously, so this is re-run rather
       than resolved once at startup. */
    var picked = null;
    function pickVoice() {
      if (picked || !TTS) return picked;
      var all = TTS.getVoices() || [];
      var want = ['Google UK English Female', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Samantha'];
      for (var w = 0; w < want.length; w++) {
        for (var i = 0; i < all.length; i++) {
          if (all[i].name.indexOf(want[w]) === 0) { picked = all[i]; return picked; }
        }
      }
      for (var j = 0; j < all.length; j++) {
        if (/^en\b|^en[-_]/i.test(all[j].lang)) { picked = all[j]; return picked; }
      }
      return null;
    }
    if (TTS && typeof TTS.addEventListener === 'function') {
      TTS.addEventListener('voiceschanged', function () { picked = null; pickVoice(); });
    }

    /* Spoken greeting the first time voice mode is entered — opening the
       panel is the user gesture browsers require before audio may play. */
    function welcome() {
      if (greeted) return;
      greeted = true;
      bubble('bot', WELCOME);
      setTimeout(function () { speak(WELCOME); }, 360);
    }

    function send(text) {
      text = (text || '').trim();
      if (!text) return;
      chips.innerHTML = '';
      bubble('me', text);

      var hit = answer(text);
      var dots = typing();
      setTimeout(function () {
        dots.remove();
        bubble('bot', hit.a);
        speak(hit.a);
        if (hit.go) {
          var jump = document.createElement('button');
          jump.type = 'button';
          jump.className = 'chat__chip';
          jump.textContent = 'Open the calendar →';
          jump.addEventListener('click', function () { close(); goTo(hit.go); });
          chips.appendChild(jump);
        }
      }, 620 + Math.min(text.length * 12, 700));
    }

    function goTo(hash) {
      var t = document.querySelector(hash);
      if (!t) { window.location.href = 'index.html' + hash; return; }
      if (lenis) lenis.scrollTo(t, { offset: -90 });
      else t.scrollIntoView({ behavior: 'smooth' });
    }

    function seedChips() {
      chips.innerHTML = '';
      CHIPS.forEach(function (c) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'chat__chip';
        b.textContent = c;
        b.addEventListener('click', function () { send(c); });
        chips.appendChild(b);
      });
    }

    /* ── voice ──────────────────────────────────────────────────── */
    var bars = [];
    for (var i = 0; i < 22; i++) { var b = document.createElement('i'); vwave.appendChild(b); bars.push(b); }

    function setVState(s) { vstate.textContent = s; }

    function runWave(on) {
      if (!on) {
        cancelAnimationFrame(waveRAF);
        waveRAF = 0;
        bars.forEach(function (bar) { bar.style.height = '3px'; });
        return;
      }
      if (waveRAF) return;
      (function frame(ts) {
        waveRAF = requestAnimationFrame(frame);
        for (var j = 0; j < bars.length; j++) {
          var centre = 1 - Math.abs(j - (bars.length - 1) / 2) / ((bars.length - 1) / 2);
          var lv = Math.abs(Math.sin(ts / 150 + j * 0.6)) * Math.abs(Math.sin(ts / 420));
          bars[j].style.height = (3 + lv * centre * 18).toFixed(1) + 'px';
        }
      })(0);
    }

    function startListening() {
      if (!SR) { setVState('This browser has no speech input — switch to Text'); return; }
      if (listening) { rec.stop(); return; }
      if (!rec) {
        rec = new SR();
        rec.lang = 'en-US';
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        rec.onstart = function () { listening = true; orb.classList.add('is-live'); setVState('Listening…'); runWave(true); };
        rec.onerror = function (e) {
          listening = false; orb.classList.remove('is-live'); runWave(false);
          setVState(e.error === 'not-allowed' ? 'Mic blocked — allow access, or use Text' : 'Didn\'t catch that. Tap to try again');
        };
        rec.onend = function () { listening = false; orb.classList.remove('is-live'); runWave(false); };
        rec.onresult = function (e) {
          var said = e.results[0][0].transcript;
          setVState('Thinking…');
          send(said);
        };
      }
      if (TTS) TTS.cancel();
      try { rec.start(); } catch (err) { /* already running */ }
    }

    function setMode(next) {
      mode = next;
      root.querySelectorAll('.chat__mode').forEach(function (m) {
        var on = m.getAttribute('data-mode') === next;
        m.classList.toggle('is-on', on);
        m.setAttribute('aria-selected', String(on));
      });
      var isVoice = next === 'voice';
      voice.hidden = !isVoice;
      form.hidden = isVoice;
      if (isVoice) {
        setVState(SR ? 'Tap to talk' : 'No speech input here — switch to Text');
        welcome();
      } else {
        if (TTS) TTS.cancel();
        if (listening && rec) rec.stop();
        runWave(false);
        input.focus();
      }
    }

    /* ── open / close ───────────────────────────────────────────── */
    function open(startMode) {
      var next = startMode || mode || 'text';
      if (!root.hidden) { setMode(next); return; }
      lastFocus = document.activeElement;
      root.hidden = false;
      requestAnimationFrame(function () { root.classList.add('is-open'); });
      if (lenis) lenis.stop();
      document.body.style.overflow = 'hidden';
      var fresh = !log.childElementCount;
      if (fresh && next !== 'voice') bubble('bot', OPENER);   // voice mode greets out loud instead
      setMode(next);
      if (fresh) seedChips();
      setTimeout(function () { (mode === 'voice' ? orb : input).focus(); }, 380);
    }

    function close() {
      if (root.hidden) return;
      root.classList.remove('is-open');
      if (TTS) TTS.cancel();
      if (listening && rec) rec.stop();
      runWave(false);
      if (lenis) lenis.start();
      document.body.style.overflow = '';
      setTimeout(function () { root.hidden = true; }, 340);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.querySelectorAll('[data-chat-open]').forEach(function (t) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        open(t.getAttribute('data-chat-open') || 'text');
      });
    });

    root.querySelectorAll('[data-chat-close]').forEach(function (t) {
      t.addEventListener('click', function () { close(); });
    });

    // close first, then scroll: Lenis is stopped while the panel owns the screen
    root.querySelectorAll('[data-chat-goto]').forEach(function (t) {
      t.addEventListener('click', function () { close(); goTo(t.getAttribute('data-chat-goto')); });
    });

    root.querySelectorAll('.chat__mode').forEach(function (m) {
      m.addEventListener('click', function () { setMode(m.getAttribute('data-mode')); });
    });

    orb.addEventListener('click', startListening);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      send(input.value);
      input.value = '';
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !root.hidden) close();
    });

    // keep tabbing inside the panel while it owns the screen
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = panel.querySelectorAll('button, input, a[href]');
      f = Array.prototype.filter.call(f, function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     North America, city-level. Same dot grid as the hero's world map,
     cropped to the home market and scaled up so the cities carry labels.
     ══════════════════════════════════════════════════════════════════ */
  function naViz() {
    var canvas = document.getElementById('naViz');
    if (!canvas) return;

    var c = setupCanvas(canvas);
    var land = decodeLand();

    // crop window, in degrees
    var W_LNG = -168, E_LNG = -52, N_LAT = 72, S_LAT = 14;
    var col0 = Math.floor((W_LNG + 180) / 360 * LAND_COLS);
    var col1 = Math.ceil((E_LNG + 180) / 360 * LAND_COLS);
    var row0 = Math.floor((LAND_LAT0 - N_LAT) / (LAND_LAT0 - LAND_LAT1) * LAND_ROWS);
    var row1 = Math.ceil((LAND_LAT0 - S_LAT) / (LAND_LAT0 - LAND_LAT1) * LAND_ROWS);
    var cols = col1 - col0, rows = row1 - row0;

    var NA = PLACES.filter(function (p) { return p.lng < -50 && p.lat > 12; });

    var geom = null;
    function layout() {
      var step = Math.min(c.w / cols, c.h / rows);
      geom = {
        step: step,
        x0: (c.w - step * cols) / 2,
        y0: (c.h - step * rows) / 2,
        r: Math.max(1.1, step * 0.3)
      };
    }
    layout();
    window.addEventListener('resize', function () { setTimeout(layout, 60); });

    function put(lat, lng) {
      var g = geom;
      return {
        x: g.x0 + ((lng + 180) / 360 * LAND_COLS - col0) * g.step,
        y: g.y0 + ((LAND_LAT0 - lat) / (LAND_LAT0 - LAND_LAT1) * LAND_ROWS - row0) * g.step
      };
    }

    NA.forEach(function (p, i) { p.phase = (i * 0.41) % 1; });

    var t0 = 0, clock = 0;
    function frame(ts) {
      requestAnimationFrame(frame);
      if (!onScreen(canvas)) return;
      if (ts - t0 < 32) return;
      var dt = Math.min(0.1, (ts - t0) / 1000);
      t0 = ts;
      if (!REDUCED) clock += dt;

      var ctx = c.ctx, g = geom;
      ctx.clearRect(0, 0, c.w, c.h);
      if (!g) return;

      for (var row = row0; row < row1; row++) {
        for (var col = col0; col < col1; col++) {
          if (row < 0 || row >= LAND_ROWS || !land[row * LAND_COLS + col]) continue;
          var x = g.x0 + (col - col0 + 0.5) * g.step;
          var y = g.y0 + (row - row0 + 0.5) * g.step;
          var t = (col - col0) / cols;
          var cr = 43 + t * 4, cg2 = 167 + t * 50, cb2 = 255 - t * 48;
          ctx.fillStyle = 'rgba(' + (cr | 0) + ',' + (cg2 | 0) + ',' + (cb2 | 0) + ',0.30)';
          ctx.beginPath();
          ctx.arc(x, y, g.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      NA.forEach(function (p) {
        var q = put(p.lat, p.lng);
        var pulse = 0.5 + 0.5 * Math.sin((clock * 0.9 + p.phase) * Math.PI * 2);
        var R = (p.hq ? 5.5 : 3.6) + pulse * (p.hq ? 2.6 : 1.3);

        var halo = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, R * 4);
        halo.addColorStop(0, 'rgba(47,217,207,' + (0.34 + pulse * 0.26).toFixed(3) + ')');
        halo.addColorStop(1, 'rgba(47,217,207,0)');
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(q.x, q.y, R * 4, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = p.hq ? '#ffd9a8' : '#ffffff';
        ctx.beginPath(); ctx.arc(q.x, q.y, p.hq ? 3 : 2, 0, Math.PI * 2); ctx.fill();

        if (c.w > 460) {
          ctx.font = (p.hq ? '600 ' : '500 ') + '11px Poppins, sans-serif';
          ctx.textAlign = p.a || 'left';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = p.hq ? 'rgba(255,236,214,.96)' : 'rgba(255,255,255,.66)';
          ctx.fillText(p.n, q.x + (p.dx || 8) * 0.55, q.y + (p.dy || 0) * 0.55);
        }
      });
    }
    requestAnimationFrame(frame);
  }

  /* ══════════════════════════════════════════════════════════════════
     12b. Why Alpha Squared — tabbed proof panel. The AI tab types an
          agent trace line by line. Typing only runs while that tab is
          open, so a hidden panel never leaves timers burning.
     ══════════════════════════════════════════════════════════════════ */
  function whyTabs() {
    var tabs = [].slice.call(document.querySelectorAll('.whyus__tab'));
    if (!tabs.length) return;

    var views = [].slice.call(document.querySelectorAll('.whyview'));
    var copies = [].slice.call(document.querySelectorAll('.whycopy'));
    var feed = document.getElementById('aiFeed');
    var replay = document.getElementById('aiReplay');

    var TRACE = [
      { k: 'meta',  b: '06:14',  t: 'inbound call · Alliance Driveaway' },
      { k: 'user',  b: 'caller', t: 'Can you move the Calgary pickup to Thursday?' },
      { k: 'tool',  b: '▸',      t: 'crm.lookup("Calgary pickup")', ok: 'load #4471' },
      { k: 'tool',  b: '▸',      t: 'calendar.findSlot(Thu, 2 drivers)', ok: '10:00' },
      { k: 'tool',  b: '▸',      t: 'crm.update(#4471 → Thu 10:00)', ok: 'saved' },
      { k: 'agent', b: 'agent',  t: 'Moved to Thursday at 10. Both drivers notified.' }
    ];

    var timers = [];
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }

    function lineEl(l) {
      var row = document.createElement('div');
      row.className = 'aicon__ln aicon__ln--' + l.k;
      var b = document.createElement('b');
      b.textContent = l.b;
      row.appendChild(b);
      row.appendChild(document.createElement('span'));
      return row;
    }

    function markDone(row, l) {
      row.classList.remove('is-typing');
      if (!l.ok) return;
      var ok = document.createElement('i');
      ok.className = 'aicon__ok';
      ok.textContent = '✓ ' + l.ok;
      row.appendChild(ok);
    }

    function play(idx) {
      if (idx >= TRACE.length) {
        if (replay) replay.classList.add('is-ready');
        return;
      }
      var l = TRACE[idx];
      var row = lineEl(l);
      row.classList.add('is-typing');
      feed.appendChild(row);

      var span = row.firstChild.nextSibling;
      var i = 0;
      (function step() {
        span.textContent = l.t.slice(0, ++i);
        if (i < l.t.length) { later(step, 16 + Math.random() * 24); return; }
        markDone(row, l);
        later(function () { play(idx + 1); }, 340);
      })();
    }

    function runTrace() {
      if (!feed) return;
      clearTimers();
      feed.textContent = '';
      if (replay) replay.classList.remove('is-ready');

      if (REDUCED) {
        TRACE.forEach(function (l) {
          var row = lineEl(l);
          row.firstChild.nextSibling.textContent = l.t;
          markDone(row, l);
          feed.appendChild(row);
        });
        if (replay) replay.classList.add('is-ready');
        return;
      }
      later(function () { play(0); }, 240);
    }

    function show(view) {
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-view') === view;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      views.forEach(function (v) { v.classList.toggle('is-on', v.getAttribute('data-view') === view); });
      copies.forEach(function (c) { c.classList.toggle('is-on', c.getAttribute('data-view') === view); });

      if (view === 'ai') runTrace();
      else clearTimers();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(t.getAttribute('data-view')); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var next = tabs[(i + d + tabs.length) % tabs.length];
        next.focus();
        show(next.getAttribute('data-view'));
      });
    });

    if (replay) replay.addEventListener('click', runTrace);

    show('map');
  }

  /* ══════════════════════════════════════════════════════════════════
     13. Wireframe globe — the reference's centrepiece in the compare block
     ══════════════════════════════════════════════════════════════════ */
  function globeViz() {
    var canvas = document.getElementById('globeViz');
    if (!canvas) return;

    var c = setupCanvas(canvas);
    var pts = [];
    var N = 620;

    // fibonacci sphere for even point distribution
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2;
      var rad = Math.sqrt(Math.max(0, 1 - y * y));
      var th = Math.PI * (3 - Math.sqrt(5)) * i;
      pts.push({ x: Math.cos(th) * rad, y: y, z: Math.sin(th) * rad, hi: Math.random() < .06 });
    }

    var rot = 0, t0 = 0;
    function frame(ts) {
      requestAnimationFrame(frame);
      if (!onScreen(canvas)) return;
      if (ts - t0 < 24) return;
      t0 = ts;

      var ctx = c.ctx;
      var cx = c.w / 2, cy = c.h / 2;
      var R = Math.min(c.w, c.h) * 0.38;
      ctx.clearRect(0, 0, c.w, c.h);

      rot += REDUCED ? 0 : 0.0032;
      var tilt = -0.42;

      /* Speech rings — the globe is the agent's "mouth", so rings leave it in
         time with the envelope. Drawn before the sphere so they read as
         emanating from behind it. */
      var lv = REDUCED ? 0 : agentEnvelope(ts);
      for (var ri = 0; ri < 3; ri++) {
        var phase = ((ts / 1400) + ri / 3) % 1;
        var rr = R * (1.06 + phase * 0.9);
        var ra = (1 - phase) * 0.5 * lv;
        if (ra <= 0.004) continue;
        ctx.strokeStyle = 'rgba(47,217,207,' + ra.toFixed(3) + ')';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.stroke();
      }

      // rim ring in the brand gradient
      var rim = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      rim.addColorStop(0, '#2ba7ff');
      rim.addColorStop(.5, '#2fd9cf');
      rim.addColorStop(1, '#fe881b');
      ctx.strokeStyle = rim;
      ctx.lineWidth = 2 + lv * 1.6;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.06, 0, Math.PI * 2);
      ctx.stroke();

      pts.forEach(function (p) {
        var x = p.x * Math.cos(rot) - p.z * Math.sin(rot);
        var z = p.x * Math.sin(rot) + p.z * Math.cos(rot);
        var y = p.y * Math.cos(tilt) - z * Math.sin(tilt);
        var z2 = p.y * Math.sin(tilt) + z * Math.cos(tilt);

        var depth = (z2 + 1) / 2;                 // 0 back → 1 front
        var sx = cx + x * R, sy = cy + y * R;
        var a = 0.06 + depth * 0.5;

        if (p.hi) {
          ctx.fillStyle = 'rgba(47,217,207,' + (a * 1.4).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(sx, sy, 2.2 + depth * 1.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(96,150,165,' + a.toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(sx, sy, 0.9 + depth * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }
    requestAnimationFrame(frame);
  }

  /* ══════════════════════════════════════════════════════════════════
     14. Radar sweep — the why-us panel visual
     ══════════════════════════════════════════════════════════════════ */
  function radarViz() {
    var canvas = document.getElementById('radarViz');
    if (!canvas) return;

    var c = setupCanvas(canvas);
    var blips = [];
    for (var i = 0; i < 34; i++) {
      blips.push({ a: Math.random() * Math.PI * 2, r: 0.18 + Math.random() * 0.74, s: Math.random() });
    }

    var sweep = 0, t0 = 0;
    function frame(ts) {
      requestAnimationFrame(frame);
      if (!onScreen(canvas)) return;
      if (ts - t0 < 24) return;
      t0 = ts;

      var ctx = c.ctx;
      var cx = c.w / 2, cy = c.h / 2;
      var R = Math.min(c.w, c.h) * 0.42;
      ctx.clearRect(0, 0, c.w, c.h);

      sweep += REDUCED ? 0 : 0.012;

      // Sweep wedge goes down first: its destination-out fade must only
      // erase the wedge, so nothing else can be on the canvas yet. A conic gradient fades it along the arc; a radial mask
      // on top fades it toward the rim so the wedge has no hard outer edge.
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sweep);

      var g = ctx.createConicGradient ? ctx.createConicGradient(0, 0, 0) : null;
      if (g) {
        g.addColorStop(0, 'rgba(18,184,176,.42)');
        g.addColorStop(.16, 'rgba(40,140,180,.06)');
        g.addColorStop(.2, 'rgba(18,184,176,0)');
        g.addColorStop(1, 'rgba(18,184,176,0)');
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = 'rgba(18,184,176,.18)';
      }
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, R, 0, Math.PI / 3);
      ctx.closePath();
      ctx.fill();

      ctx.globalCompositeOperation = 'destination-out';
      var fade = ctx.createRadialGradient(0, 0, R * 0.45, 0, 0, R);
      fade.addColorStop(0, 'rgba(0,0,0,0)');
      fade.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.fillStyle = fade;
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // concentric rings, drawn over the wedge
      ctx.lineWidth = 1;
      for (var k = 1; k <= 4; k++) {
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.11 - k * 0.014).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(cx, cy, R * (k / 4), 0, Math.PI * 2);
        ctx.stroke();
      }

      // blips brighten as the sweep passes
      blips.forEach(function (b) {
        var d = ((sweep % (Math.PI * 2)) - b.a + Math.PI * 2) % (Math.PI * 2);
        var hot = Math.max(0, 1 - d / 1.1);
        var x = cx + Math.cos(b.a) * b.r * R;
        var y = cy + Math.sin(b.a) * b.r * R;
        ctx.fillStyle = 'rgba(210,180,255,' + (0.12 + hot * 0.8).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(x, y, 1.6 + hot * 2.4, 0, Math.PI * 2);
        ctx.fill();
      });

      // centre dot
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  /* ══════════════════════════════════════════════════════════════════
     15. Bot dock — the launcher introduces itself once per session, then
         gets out of the way. Cycles a few openers so it reads like the
         assistant is nudging you, not like a static badge.
     ══════════════════════════════════════════════════════════════════ */
  function botDock() {
    var dock = document.getElementById('botDock');
    var hint = document.getElementById('botHint');
    if (!dock || !hint) return;

    var SEEN = 'a2-bot-hint';
    var title = hint.querySelector('b');
    var sub = hint.querySelector('em');
    var closer = document.getElementById('botHintX');
    var fab = dock.querySelector('.botfab');

    var LINES = [
      ['Ask me anything', 'Pricing, timelines, or book a call'],
      ['Still reading?', 'Ask what a build like yours costs'],
      ['Say "book a call"', 'I will hand you the calendar']
    ];

    var idx = 0, rotate = null, hide = null;

    function stop() {
      clearTimeout(hide);
      clearInterval(rotate);
      dock.classList.remove('is-hinting');
    }

    function dismiss() {
      stop();
      try { sessionStorage.setItem(SEEN, '1'); } catch (e) { /* private mode */ }
    }

    function show() {
      dock.classList.add('is-hinting');
      hide = setTimeout(dismiss, 11000);
      if (REDUCED) return;
      rotate = setInterval(function () {
        idx = (idx + 1) % LINES.length;
        title.textContent = LINES[idx][0];
        sub.textContent = LINES[idx][1];
      }, 3800);
    }

    if (closer) closer.addEventListener('click', dismiss);
    if (fab) fab.addEventListener('click', dismiss);
    hint.addEventListener('click', function (e) {
      if (closer && closer.contains(e.target)) return;
      dismiss();
      if (fab) fab.click();
    });

    try {
      if (sessionStorage.getItem(SEEN)) return;
    } catch (e) { /* private mode — just show it */ }

    setTimeout(show, 5200);
  }

  /* ══════════════════════════════════════════════════════════════════
     Boot
     ══════════════════════════════════════════════════════════════════ */
  // index.html ships the chat markup; every other page gets the same block injected.
  function injectChat() {
    if (document.getElementById('a2chat')) return;
    var X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4Z"/></svg>';
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="chat" id="a2chat" hidden>' +
        '<div class="chat__scrim" data-chat-close></div>' +
        '<section class="chat__panel" role="dialog" aria-modal="true" aria-labelledby="chatTitle">' +
          '<header class="chat__head">' +
            '<span class="chat__avatar" aria-hidden="true"><svg viewBox="0 0 32 32"><path fill-rule="evenodd" d="M12 2h2v3h-2V2Zm6 0h2v3h-2V2ZM9 5h14a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4Zm3.5 6a1.5 1.5 0 0 0-1.5 1.5v7a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5h-7ZM12 27h2v3h-2v-3Zm6 0h2v3h-2v-3ZM2 12h3v2H2v-2Zm0 6h3v2H2v-2Zm25-6h3v2h-3v-2Zm0 6h3v2h-3v-2Z"/></svg></span>' +
            '<span class="chat__id"><strong id="chatTitle">Alpha Squared AI</strong><span class="chat__status"><i></i> Online · answers in seconds</span></span>' +
            '<button class="chat__x" type="button" data-chat-close aria-label="Close chat">' + X + '</button>' +
          '</header>' +
          '<div class="chat__modes" role="tablist" aria-label="Chat mode">' +
            '<button type="button" class="chat__mode is-on" role="tab" aria-selected="true" data-mode="text">Text</button>' +
            '<button type="button" class="chat__mode" role="tab" aria-selected="false" data-mode="voice">Voice</button>' +
          '</div>' +
          '<div class="chat__log" id="chatLog" role="log" aria-live="polite"></div>' +
          '<div class="chat__chips" id="chatChips"></div>' +
          '<div class="chat__voice" id="chatVoice" hidden>' +
            '<button type="button" class="chat__orb" id="chatOrb" aria-label="Start talking"><span class="chat__orb-ring" aria-hidden="true"></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 14a3.5 3.5 0 0 0 3.5-3.5v-5a3.5 3.5 0 0 0-7 0v5A3.5 3.5 0 0 0 12 14Zm6-3.5a6 6 0 0 1-5 5.92V20h-2v-3.58a6 6 0 0 1-5-5.92h2a4 4 0 0 0 8 0h2Z"/></svg></button>' +
            '<p class="chat__vstate" id="chatVState">Tap to talk</p>' +
            '<div class="chat__vwave" id="chatVWave" aria-hidden="true"></div>' +
          '</div>' +
          '<form class="chat__form" id="chatForm" autocomplete="off">' +
            '<input class="chat__input" id="chatInput" type="text" name="message" placeholder="Ask about trucking, AI, timelines…" aria-label="Message" maxlength="400" />' +
            '<button class="chat__send" type="submit" aria-label="Send message"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10.2 15.5 12 3.4 13.8v6.6Z"/></svg></button>' +
          '</form>' +
          '<p class="chat__foot">Demo assistant · <button type="button" class="chat__link" data-chat-goto="#contact">talk to a human</button></p>' +
        '</section>' +
      '</div>' +
      '<div class="botdock" id="botDock">' +
        '<div class="botdock__hint" id="botHint">' +
          '<span class="botdock__msg"><b>Ask me anything</b><em>Pricing, timelines, or book a call</em></span>' +
          '<button class="botdock__x" type="button" id="botHintX" aria-label="Dismiss">' + X + '</button>' +
        '</div>' +
        '<button class="botfab" type="button" data-chat-open="text" aria-label="Chat with Alpha Squared AI">' +
          '<span class="botfab__ping" aria-hidden="true"></span>' +
          '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="3.6" r="2.2"/><path d="M15 5.4h2V9h-2z"/><path fill-rule="evenodd" d="M9.5 9h13a5.5 5.5 0 0 1 5.5 5.5v6a5.5 5.5 0 0 1-5.5 5.5h-13A5.5 5.5 0 0 1 4 20.5v-6A5.5 5.5 0 0 1 9.5 9Zm2.5 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/></svg>' +
        '</button>' +
      '</div>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  }
  // Each step is isolated: a decorative visual that throws must never take
  // down the rest of the page. Learned the hard way — one bad character in
  // the map's base64 threw during init, so the loader never ran and the
  // whole site sat on a 0% splash screen.
  function safely(name, fn) {
    try {
      fn();
    } catch (e) {
      if (window.console) console.error('[a2] ' + name + ' failed:', e);
    }
  }

  function init() {
    safely('initScroll', initScroll);
    safely('nav', nav);
    safely('splitHeadings', splitHeadings);
    safely('reveals', reveals);
    safely('counters', counters);
    safely('rails', rails);
    safely('parallax', parallax);
    safely('cardGlow', cardGlow);
    safely('shotFallback', shotFallback);
    safely('accordion', accordion);

    safely('heroViz', heroViz);
    safely('proofViz', proofViz);
    safely('globeViz', globeViz);
    safely('naViz', naViz);
    safely('whyTabs', whyTabs);
    safely('agentWave', agentWave);
    safely('agentLine', agentLine);
    safely('injectChat', injectChat);
    safely('chatBot', chatBot);
    safely('botDock', botDock);
    safely('radarViz', radarViz);

    // The loader is last but must run no matter what came before it,
    // or the page stays hidden behind the splash.
    try {
      runLoader(heroIn);
    } catch (e) {
      var el = document.getElementById('loader');
      if (el) el.remove();
      document.body.classList.remove('is-loading');
      if (window.console) console.error('[a2] loader failed:', e);
    }

    if (hasGSAP) {
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
