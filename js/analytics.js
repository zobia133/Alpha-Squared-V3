/* Analytics + lead tracking for alphasquared.
   ─────────────────────────────────────────────────────────────────────
   Nothing loads until you paste an ID below. Leave a value as '' and
   that tool stays off — no extra requests, no cookies.

   GA4:        Google Analytics → Admin → Data streams → Measurement ID (G-XXXXXXXXXX)
   Meta Pixel: Meta Events Manager → Data sources → Pixel ID (15–16 digits)
   ───────────────────────────────────────────────────────────────────── */
(function () {
  var GA4_ID = '';        // e.g. 'G-ABC123XYZ9'
  var META_PIXEL_ID = ''; // e.g. '123456789012345'

  var hasGA = /^G-[A-Z0-9]+$/.test(GA4_ID);
  var hasPixel = /^\d{10,20}$/.test(META_PIXEL_ID);

  if (hasGA) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID);
  }

  if (hasPixel) {
    /* Standard Meta Pixel bootstrap */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  if (!hasGA && !hasPixel) return;

  /* One helper so every lead signal goes to both tools. */
  function track(name, params) {
    try {
      if (hasGA && window.gtag) window.gtag('event', name, params || {});
      if (hasPixel && window.fbq) {
        var map = { generate_lead: 'Lead', book_call_click: 'Schedule', chat_open: 'Contact', email_click: 'Contact', phone_click: 'Contact' };
        if (map[name]) window.fbq('track', map[name], params || {});
        else window.fbq('trackCustom', name, params || {});
      }
    } catch (e) { /* tracking must never break the page */ }
  }
  window.a2track = track;

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f && f.getAttribute && f.getAttribute('data-netlify') !== null) {
      track('generate_lead', { form: f.getAttribute('name') || 'contact', page: location.pathname });
    }
  }, true);

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a,button') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/cal\.com/.test(href)) track('book_call_click', { page: location.pathname });
    else if (/^mailto:/.test(href)) track('email_click', { page: location.pathname });
    else if (/^tel:/.test(href)) track('phone_click', { page: location.pathname });
    else if (a.hasAttribute('data-chat-open')) track('chat_open', { mode: a.getAttribute('data-chat-open') || 'text' });
  }, true);
})();
