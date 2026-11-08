/* AI Growth System showcase — tabs + autoplay.
   - Click / arrow keys switch service; the panel's animation replays.
   - Autoplays through all seven while the section is on screen, pauses on
     hover or keyboard focus, and stops for good once the visitor picks a tab.
   - No autoplay for people who prefer reduced motion. */
(function () {
  var root = document.getElementById('gs');
  if (!root) return;

  var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  var DUR = 7000;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var idx = 0, timer = null, visible = false, hovering = false, userPicked = false, startedAt = 0, remaining = DUR;

  root.style.setProperty('--gs-dur', DUR / 1000 + 's');

  function show(i, focus) {
    idx = (i + tabs.length) % tabs.length;
    tabs.forEach(function (t, n) {
      var on = n === idx;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var p = panels[n];
      if (!p) return;
      if (on) {
        p.classList.remove('is-on');
        void p.offsetWidth;            // restart the entrance animations
        p.classList.add('is-on');
        p.hidden = false;
      } else {
        p.classList.remove('is-on');
        p.hidden = true;
      }
    });
    // restart the progress bar on the new tab
    var bar = tabs[idx].querySelector('.gs__prog i');
    if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
    if (focus) tabs[idx].focus();
    if (window.a2track) window.a2track('growth_service_view', { service: tabs[idx].getAttribute('data-name') });
  }

  function clear() { if (timer) { clearTimeout(timer); timer = null; } }
  function schedule(ms) {
    clear();
    if (REDUCED || userPicked || !visible) return;
    startedAt = Date.now(); remaining = ms;
    root.classList.add('is-playing'); root.classList.remove('is-paused');
    timer = setTimeout(function () { show(idx + 1); schedule(DUR); }, ms);
  }
  function pause() {
    if (!timer) return;
    clear();
    remaining = Math.max(400, remaining - (Date.now() - startedAt));
    root.classList.add('is-paused');
  }
  function resume() { if (!hovering && visible && !userPicked) schedule(remaining); }
  function stop() { clear(); userPicked = true; root.classList.remove('is-playing', 'is-paused'); }

  tabs.forEach(function (t, n) {
    t.addEventListener('click', function () { stop(); show(n); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, next = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') next = idx + 1;
      else if (k === 'ArrowUp' || k === 'ArrowLeft') next = idx - 1;
      else if (k === 'Home') next = 0;
      else if (k === 'End') next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault(); stop(); show(next, true);
    });
  });

  root.addEventListener('mouseenter', function () { hovering = true; pause(); });
  root.addEventListener('mouseleave', function () { hovering = false; resume(); });
  root.addEventListener('focusin', function () { hovering = true; pause(); });
  root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) { hovering = false; resume(); } });

  show(0);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        visible = e.isIntersecting;
        if (visible) { show(idx); if (!hovering) schedule(DUR); } else pause();
      });
    }, { threshold: 0.35 }).observe(root);
  } else { visible = true; schedule(DUR); }
})();
