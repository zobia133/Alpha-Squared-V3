/* Website check: instant scan via the site-check Netlify Function (/api/site-check),
   then the "free-audit" Netlify form for a hand-reviewed audit. */
(function () {
  'use strict';

  var API = '/api/site-check';
  var PSI_WEB = 'https://pagespeed.web.dev/analysis?url=';
  var MAIL = 'info@alphasquared.co';
  var TIMEOUT_MS = 30000;

  var checkForm = document.getElementById('checkForm');
  var auditForm = document.getElementById('auditForm');
  if (!checkForm || !auditForm) return;

  var checkUrl = checkForm.elements.url;
  var checkBtn = checkForm.querySelector('button[type="submit"]');
  var checkErr = document.getElementById('checkError');
  var report = document.getElementById('report');
  var progress = document.getElementById('checkProgress');
  var bar = document.getElementById('checkBar');
  var msg = document.getElementById('checkMsg');
  var results = document.getElementById('checkResults');
  var summary = document.getElementById('checkSummary');
  var grid = document.getElementById('checkGrid');
  var svcPage = checkForm.getAttribute('data-services') || 'services.html';

  var next = document.getElementById('auditNext');
  var auditUrl = auditForm.elements.url;
  var auditBtn = auditForm.querySelector('button[type="submit"]');
  var auditErr = document.getElementById('auditError');
  var thanks = document.getElementById('auditThanks');
  var selfLink = document.getElementById('auditSelf');

  var SERVICES = {
    platforms: { n: '01', name: 'Operations Platforms', focus: 'Reliability & security',
      fix: 'We harden security headers, remove insecure content and add monitoring so problems are caught before customers see them.' },
    mobile: { n: '02', name: 'Mobile Apps', focus: 'Mobile readiness',
      fix: 'We make the site work properly on phones and build companion iOS and Android apps when customers need more.' },
    ai: { n: '03', name: 'AI & Automation', focus: 'Leads & automation',
      fix: 'We add AI chat and voice agents, online booking and CRM automation so every enquiry is answered, day or night.' },
    design: { n: '04', name: 'Product & UX Design', focus: 'UX & search basics',
      fix: 'We fix titles, headings, alt text and share previews so people and search engines understand the site.' },
    teams: { n: '05', name: 'Dedicated Teams', focus: 'Code upkeep',
      fix: 'A senior pod clears outdated libraries and bloat, then keeps the codebase current month after month.' },
    cloud: { n: '06', name: 'Cloud, DevOps & Support', focus: 'Hosting & speed',
      fix: 'We move sites onto fast, cached, CDN-backed hosting with compression and uptime monitoring.' }
  };

  var PROGRESS = [
    'Connecting to the site\u2026',
    'Reading the page\u2026',
    'Checking security headers\u2026',
    'Looking for chat, booking and CRM tools\u2026',
    'Checking mobile and search basics\u2026',
    'Scoring against six services\u2026'
  ];

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function normalize(raw) {
    var v = (raw || '').trim();
    if (!v) return null;
    if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
    var u;
    try { u = new URL(v); } catch (e) { return null; }
    if (!/^https?:$/.test(u.protocol)) return null;
    var h = u.hostname;
    if (h.indexOf('.') < 0 || /^(localhost|127\.|10\.|192\.168\.|0\.)/.test(h)) return null;
    return u.href;
  }

  function grade(s) { return s >= 90 ? 'good' : s >= 50 ? 'avg' : 'poor'; }
  function verdict(s) { return s >= 90 ? 'In good shape' : s >= 50 ? 'Room to improve' : 'Needs attention'; }

  function ring(score, big) {
    var r = el('div', 'aring aring--' + grade(score) + (big ? ' aring--lg' : ''));
    r.style.setProperty('--p', score);
    r.setAttribute('role', 'img');
    r.setAttribute('aria-label', 'Score ' + score + ' out of 100');
    r.appendChild(el('b', null, String(score)));
    return r;
  }

  function show(node, text) {
    node.textContent = text;
    node.hidden = false;
  }

  function refreshLayout() {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function syncSelfLink() {
    var u = normalize(auditUrl.value);
    selfLink.href = u ? PSI_WEB + encodeURIComponent(u) : 'https://pagespeed.web.dev/';
  }

  function revealNext(url, score) {
    if (url && !auditForm.hidden) auditUrl.value = url;
    if (auditForm.elements.score) auditForm.elements.score.value = score == null ? '' : String(score);
    syncSelfLink();
    next.hidden = false;
  }

  /* ── Report ── */
  function render(data) {
    var pass = 0, warn = 0, fail = 0;
    data.services.forEach(function (s) {
      s.checks.forEach(function (c) { if (c.state === 'pass') pass++; else if (c.state === 'warn') warn++; else fail++; });
    });

    summary.textContent = '';
    var left = el('div');
    left.appendChild(el('span', 'badge', 'Your instant report'));
    left.appendChild(el('h3', 'audit-summary__host', data.host));
    left.appendChild(el('p', 'audit-summary__meta',
      'HTTP ' + data.status + ' \u00b7 ' + data.ms + ' ms server response \u00b7 ' + Math.max(1, Math.round(data.size / 1024)) + ' KB transferred'));
    var counts = el('div', 'audit-counts');
    if (fail) counts.appendChild(el('span', 'is-fail', fail + (fail === 1 ? ' issue' : ' issues')));
    if (warn) counts.appendChild(el('span', 'is-warn', warn + ' to improve'));
    counts.appendChild(el('span', 'is-pass', pass + ' passed'));
    left.appendChild(counts);
    var cta = el('div', 'cta-row');
    var full = el('a', 'btn');
    full.href = '#auditNext';
    full.appendChild(el('span', null, 'Get the full audit \u2192'));
    full.addEventListener('click', function (e) {
      e.preventDefault();
      next.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (!auditForm.hidden) auditForm.elements.name.focus({ preventScroll: true });
    });
    cta.appendChild(full);
    left.appendChild(cta);
    summary.appendChild(left);

    var overall = el('div', 'audit-overall');
    overall.appendChild(ring(data.overall, true));
    overall.appendChild(el('span', null, 'Overall score'));
    summary.appendChild(overall);

    grid.textContent = '';
    data.services.forEach(function (s) {
      var meta = SERVICES[s.id];
      if (!meta) return;
      var card = el('article', 'acard');
      var head = el('div', 'acard__head');
      var title = el('div');
      title.appendChild(el('span', 'acard__n', meta.n + ' \u00b7 ' + meta.focus));
      title.appendChild(el('h3', null, meta.name));
      title.appendChild(el('p', 'acard__verdict acard__verdict--' + grade(s.score), verdict(s.score)));
      head.appendChild(title);
      head.appendChild(ring(s.score));
      card.appendChild(head);

      var list = el('ul', 'acard__list');
      s.checks.forEach(function (c) {
        var li = el('li', 'is-' + c.state);
        li.appendChild(el('span', null, c.label));
        li.appendChild(el('em', null, c.value));
        list.appendChild(li);
      });
      card.appendChild(list);

      if (s.score < 90) {
        var foot = el('div', 'acard__fix');
        foot.appendChild(el('p', null, meta.fix));
        var link = el('a', 'tlink');
        link.href = svcPage + '#' + s.id;
        link.appendChild(document.createTextNode('How we help '));
        link.appendChild(el('i', 'ar', '\u2192'));
        foot.appendChild(link);
        card.appendChild(foot);
      }
      grid.appendChild(card);
    });
  }

  /* ── Instant check ── */
  var running = false;
  var timer = null;

  function startProgress() {
    var t0 = Date.now();
    var i = 0;
    msg.textContent = PROGRESS[0];
    bar.style.width = '3%';
    timer = setInterval(function () {
      var t = (Date.now() - t0) / 1000;
      bar.style.width = (95 * (1 - Math.exp(-t / 4))).toFixed(1) + '%';
      var n = Math.min(PROGRESS.length - 1, Math.floor(t / 1.5));
      if (n !== i) { i = n; msg.textContent = PROGRESS[i]; }
    }, 200);
  }

  function run(url) {
    if (running) return;
    running = true;
    checkErr.hidden = true;
    checkBtn.disabled = true;
    report.hidden = false;
    progress.hidden = false;
    results.hidden = true;
    refreshLayout();
    report.scrollIntoView({ behavior: 'smooth', block: 'start' });
    startProgress();

    var ctrl = window.AbortController ? new AbortController() : null;
    var kill = ctrl ? setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS) : null;

    fetch(API + '?url=' + encodeURIComponent(url), { signal: ctrl ? ctrl.signal : undefined })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok || !data.services) throw new Error(data.error || '');
          return data;
        });
      })
      .then(function (data) {
        render(data);
        progress.hidden = true;
        results.hidden = false;
        revealNext(data.url, data.overall);
        if (window.a2track) window.a2track('site_check', { host: data.host, score: data.overall });
      })
      .catch(function (err) {
        report.hidden = true;
        show(checkErr, err.name === 'AbortError'
          ? 'The check timed out. Request the full audit below and we\u2019ll review the site by hand.'
          : (err.message || 'The instant check isn\u2019t available right now. Request the full audit below instead.'));
        revealNext(url, null);
      })
      .then(function () {
        clearTimeout(kill);
        clearInterval(timer);
        bar.style.width = '100%';
        running = false;
        checkBtn.disabled = false;
        refreshLayout();
      });
  }

  checkForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var url = normalize(checkUrl.value);
    if (!url) {
      show(checkErr, 'Please enter a full public website address, like yourcompany.com');
      checkUrl.focus();
      return;
    }
    try { history.replaceState(null, '', '?url=' + encodeURIComponent(new URL(url).hostname) + location.hash); } catch (er) {}
    run(url);
  });

  /* ── Full audit request (Netlify form) ── */
  auditUrl.addEventListener('input', syncSelfLink);
  selfLink.addEventListener('click', syncSelfLink);

  auditForm.addEventListener('submit', function (e) {
    e.preventDefault();
    auditErr.hidden = true;
    var u = normalize(auditUrl.value);
    if (!u) {
      show(auditErr, 'Please enter a full public website address, like yourcompany.com');
      auditUrl.focus();
      return;
    }
    auditUrl.value = u;
    auditBtn.disabled = true;

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(auditForm)).toString()
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      auditForm.hidden = true;
      thanks.hidden = false;
      if (window.a2track) window.a2track('audit_request', { host: new URL(u).hostname });
    }).catch(function () {
      show(auditErr, 'Sorry, that didn\u2019t send. Please try again or email ' + MAIL + '.');
    }).then(function () {
      auditBtn.disabled = false;
    });
  });

  /* Shareable links: website-check.html?url=example.com runs the instant check straight away. */
  var pre = new URLSearchParams(location.search).get('url');
  if (pre) {
    checkUrl.value = pre;
    var u = normalize(pre);
    if (u) setTimeout(function () { run(u); }, 400);
  }
})();
