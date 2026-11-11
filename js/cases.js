/* ═══════════════════════════════════════════════════════════════════════
   cases.js — behaviour for case-studies.html and the generated detail
   pages. Vanilla and dependency-free: main.js owns the GSAP scroll work,
   and this file must keep running on pages where that fails to load.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── tabbed panels: flow + screens ─────────────────────────────────── */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll('.ix__tab'));
      var panels = Array.prototype.slice.call(root.querySelectorAll('.ix__panel'));

      function show(i) {
        tabs.forEach(function (t, n) {
          t.setAttribute('aria-selected', String(n === i));
          t.tabIndex = n === i ? 0 : -1;
        });
        panels.forEach(function (p, n) { p.classList.toggle('is-on', n === i); });
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { show(i); });
        tab.addEventListener('keydown', function (e) {
          var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!step) return;
          e.preventDefault();
          var next = (i + step + tabs.length) % tabs.length;
          show(next);
          tabs[next].focus();
        });
      });

      show(0);
    });
  }

  /* ── reveal-once helper ────────────────────────────────────────────── */
  function onceVisible(el, fn) {
    if (reduced || !('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.disconnect();
        fn();
      });
    }, { threshold: 0.35 });
    io.observe(el);
  }

  /* ── metrics: count up and fill the bar when scrolled into view ────── */
  function initMetrics() {
    document.querySelectorAll('[data-metrics]').forEach(function (root) {
      onceVisible(root, function () {
        root.querySelectorAll('[data-n]').forEach(function (el) {
          var target = parseFloat(el.getAttribute('data-n')) || 0;
          var suffix = el.getAttribute('data-suffix') || '';
          var start = null;
          var dur = 1100;

          function frame(ts) {
            if (start === null) start = ts;
            var t = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
            if (t < 1) requestAnimationFrame(frame);
          }

          if (reduced) {
            el.textContent = target.toLocaleString('en-US') + suffix;
          } else {
            requestAnimationFrame(frame);
          }
        });

        root.querySelectorAll('[data-p]').forEach(function (bar) {
          bar.style.width = (parseFloat(bar.getAttribute('data-p')) || 0) * 100 + '%';
        });
      });
    });
  }

  /* ── transcript: stagger the turns in ──────────────────────────────── */
  function initTranscripts() {
    document.querySelectorAll('[data-transcript]').forEach(function (root) {
      var turns = Array.prototype.slice.call(root.querySelectorAll('.turn'));
      onceVisible(root, function () {
        turns.forEach(function (turn, i) {
          if (reduced) { turn.classList.add('is-on'); return; }
          setTimeout(function () { turn.classList.add('is-on'); }, i * 320);
        });
      });
    });
  }

  /* ── index: moving wall of project shots, built from the cards ──────── */
  function initWall() {
    var wall = document.querySelector('[data-wall]');
    if (!wall) return;
    var items = Array.prototype.slice.call(document.querySelectorAll('.cs-feat .ccard, .cs-grid .ccard'))
      .map(function (card) {
        var img = card.querySelector('img');
        var name = card.querySelector('.ccard__name');
        return img && name ? { href: card.getAttribute('href'), src: img.getAttribute('src'), name: name.textContent } : null;
      })
      .filter(Boolean)
      .slice(0, 24);   // the shots are up to 1920px wide, so cap how many the wall decodes
    var half = Math.ceil(items.length / 2);

    [items.slice(0, half), items.slice(half)].forEach(function (set, r) {
      var row = document.createElement('div');
      row.className = 'cs-wall__row' + (r ? ' cs-wall__row--rev' : '');
      // two copies back to back: the row slides -50% and loops seamlessly
      set.concat(set).forEach(function (it) {
        var a = document.createElement('a');
        a.className = 'cs-wall__item';
        a.href = it.href;
        a.tabIndex = -1;
        var im = document.createElement('img');
        im.src = it.src;
        im.alt = '';
        im.decoding = 'async';
        im.onerror = function () { im.remove(); };
        var label = document.createElement('span');
        label.textContent = it.name;
        a.appendChild(im);
        a.appendChild(label);
        row.appendChild(a);
      });
      wall.appendChild(row);
    });
  }

  /* ── index: category filter over the archive grid ──────────────────── */
  var GROUPS = [
    ['All', null],
    ['Healthcare', /health/i],
    ['Commerce & food', /commerce|food|hospitality|beauty|automotive|marketplace/i],
    ['Fintech & SaaS', /fintech|saas|real estate|productivity|legal/i],
    ['Enterprise & gov', /enterprise|gov|cyber|energy|training/i],
    ['Social & sport', /social|sport|fitness|community|childcare|nonprofit|dating/i],
    ['Travel & media', /travel|tourism|iptv|streaming|media|marketing/i]
  ];

  function initFilter() {
    var bar = document.querySelector('[data-filter]');
    var grid = document.querySelector('[data-cases]');
    if (!bar || !grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.ccard'));
    var match = function (card, re) { return !re || re.test(card.getAttribute('data-cat') || ''); };
    var buttons = [];

    GROUPS.forEach(function (g) {
      var n = cards.filter(function (c) { return match(c, g[1]); }).length;
      if (!n) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-pressed', g[1] ? 'false' : 'true');
      b.appendChild(document.createTextNode(g[0]));
      var count = document.createElement('b');
      count.textContent = n;
      b.appendChild(count);

      b.addEventListener('click', function () {
        buttons.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var shown = 0;
        cards.forEach(function (card) {
          var on = match(card, g[1]);
          card.classList.toggle('is-hidden', !on);
          card.classList.remove('is-in');
          if (!on || reduced) return;
          void card.offsetWidth;   // restart the entrance animation
          card.style.animationDelay = Math.min(shown++, 12) * 40 + 'ms';
          card.classList.add('is-in');
        });
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        if (window.a2track) window.a2track('case_filter', { group: g[0] });
      });

      bar.appendChild(b);
      buttons.push(b);
    });
  }

  /* ── index: cursor spotlight + 3D tilt on cards ────────────────────── */
  function initCardFx() {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.querySelectorAll('.cs-feat .ccard, .cs-grid .ccard').forEach(function (card) {
      var raf = 0;
      card.addEventListener('pointerenter', function () { card.classList.add('is-tilting'); });
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
          card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
          card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 7).toFixed(2) +
            'deg) rotateY(' + ((x - 0.5) * 9).toFixed(2) + 'deg) translateY(-4px)';
        });
      });
      card.addEventListener('pointerleave', function () {
        cancelAnimationFrame(raf);
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });
  }

  function init() {
    initTabs();
    initMetrics();
    initTranscripts();
    initWall();
    initFilter();
    initCardFx();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
