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

  function init() {
    initTabs();
    initMetrics();
    initTranscripts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
