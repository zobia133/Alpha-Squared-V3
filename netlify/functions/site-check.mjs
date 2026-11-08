// Instant website check: fetches a public URL server-side and scores it against
// Alpha Squared's six services. No third-party APIs or keys. GET /api/site-check?url=…
import http from 'node:http';
import https from 'node:https';
import dns from 'node:dns';
import net from 'node:net';
import zlib from 'node:zlib';

const UA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36 AlphaSquaredSiteCheck/1.0';
const MAIN_TIMEOUT = 6500;
const SIDE_TIMEOUT = 2500;
const MAX_BYTES = 3_000_000;
const MAX_REDIRECTS = 5;

export const config = { path: '/api/site-check' };

/* ── SSRF guard: only public addresses, checked on every connection (incl. redirects) ── */
function isPrivate(ip) {
  if (net.isIPv4(ip)) {
    const [a, b, c] = ip.split('.').map(Number);
    return a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) ||
      (a === 192 && b === 0 && (c === 0 || c === 2)) || (a === 198 && (b === 18 || b === 19));
  }
  const v = ip.toLowerCase();
  if (v.startsWith('::ffff:')) {
    const rest = v.slice(7);
    return net.isIPv4(rest) ? isPrivate(rest) : true;
  }
  return v === '::' || v === '::1' || /^f[cd]/.test(v) || /^fe[89ab]/.test(v) ||
    v.startsWith('64:ff9b:') || v.startsWith('2001:db8:') || v.startsWith('ff');
}

function blocked() {
  const e = new Error('blocked address');
  e.code = 'EBLOCKED';
  return e;
}

function safeLookup(hostname, options, cb) {
  dns.lookup(hostname, { all: true, verbatim: true }, (err, addrs) => {
    if (err) return cb(err);
    if (!addrs.length || addrs.some((a) => isPrivate(a.address))) return cb(blocked());
    if (options && options.all) return cb(null, addrs);
    cb(null, addrs[0].address, addrs[0].family);
  });
}

function decode(raw, enc, partial) {
  const opts = { maxOutputLength: 8_000_000 };
  try {
    if (enc === 'br') return zlib.brotliDecompressSync(raw, partial ? { ...opts, finishFlush: zlib.constants.BROTLI_OPERATION_FLUSH } : opts);
    if (enc === 'gzip') return zlib.gunzipSync(raw, partial ? { ...opts, finishFlush: zlib.constants.Z_SYNC_FLUSH } : opts);
    if (enc === 'deflate') return zlib.inflateSync(raw, partial ? { ...opts, finishFlush: zlib.constants.Z_SYNC_FLUSH } : opts);
  } catch {
    return Buffer.alloc(0);
  }
  return raw;
}

function request(target, { timeout, maxBytes }) {
  return new Promise((resolve, reject) => {
    const u = new URL(target);
    const host = u.hostname.replace(/^\[|\]$/g, '');
    if (net.isIP(host) && isPrivate(host)) return reject(blocked());
    const lib = u.protocol === 'https:' ? https : http;
    const t0 = Date.now();
    let done = false;

    const req = lib.get(u, {
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,*/*;q=0.8', 'accept-encoding': 'br, gzip, deflate', 'accept-language': 'en' },
      lookup: safeLookup,
      timeout
    }, (res) => {
      const ttfb = Date.now() - t0;
      const chunks = [];
      let size = 0;
      const finish = (truncated) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        const raw = Buffer.concat(chunks);
        const enc = String(res.headers['content-encoding'] || '').toLowerCase().trim();
        resolve({ url: u.href, status: res.statusCode, headers: res.headers, ttfb, bytes: size, encoding: enc, body: decode(raw, enc, truncated) });
      };
      res.on('data', (c) => {
        size += c.length;
        chunks.push(c);
        if (size >= maxBytes) { finish(true); res.destroy(); }
      });
      res.on('end', () => finish(false));
      res.on('error', (e) => { if (!done) { done = true; reject(e); } });
    });

    const timer = setTimeout(() => req.destroy(Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' })), timeout);
    req.on('timeout', () => req.destroy(Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' })));
    req.on('error', (e) => { clearTimeout(timer); if (!done) { done = true; reject(e); } });
  });
}

async function follow(start, opts) {
  // One time budget for the whole redirect chain, so the function stays under Netlify's limit.
  const deadline = Date.now() + opts.timeout;
  let url = start;
  const chain = [];
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    const left = deadline - Date.now();
    if (left < 200) throw Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' });
    const res = await request(url, { ...opts, timeout: left });
    const loc = res.headers.location;
    if (res.status >= 300 && res.status < 400 && loc) {
      const next = new URL(loc, url);
      if (!/^https?:$/.test(next.protocol)) throw blocked();
      chain.push(url);
      url = next.href;
      continue;
    }
    res.redirects = chain.length;
    return res;
  }
  throw Object.assign(new Error('too many redirects'), { code: 'EREDIRECTS' });
}

/* ── Tiny HTML helpers (regex; good enough for signals, not a full parser) ── */
const tagsOf = (html, name) => html.match(new RegExp('<' + name + '\\b[^>]*>', 'gi')) || [];
function attr(tag, name) {
  const m = tag.match(new RegExp('\\s' + name + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i'));
  return m ? (m[1] ?? m[2] ?? m[3] ?? '') : null;
}
function meta(html, key) {
  const t = tagsOf(html, 'meta').find((m) => {
    const n = (attr(m, 'name') || attr(m, 'property') || '').toLowerCase();
    return n === key;
  });
  return t ? (attr(t, 'content') || '') : null;
}
const relLinks = (html, rel) => tagsOf(html, 'link').filter((l) => (attr(l, 'rel') || '').toLowerCase().split(/\s+/).includes(rel));
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim();

const CHAT = [
  ['Intercom', /intercom(cdn)?\.(io|com)/], ['Drift', /\bdrift(t)?\.com/], ['Tawk.to', /tawk\.to/],
  ['Crisp', /crisp\.chat/], ['Zendesk', /zdassets\.com|zopim/], ['LiveChat', /livechatinc\.com/],
  ['Tidio', /tidio(chat)?\.co/], ['HubSpot chat', /usemessages\.com/], ['Freshchat', /freshchat|freshworks\.com/],
  ['Olark', /olark\.com/], ['Gorgias', /gorgias\./], ['Smartsupp', /smartsupp/], ['JivoChat', /jivosite|jivochat/],
  ['Chatra', /chatra\.io/], ['Userlike', /userlike/], ['Kommunicate', /kommunicate\.io/], ['Ada', /ada\.support|ada\.cx/],
  ['Voiceflow', /voiceflow\.com/], ['Botpress', /botpress/], ['Chatbase', /chatbase\.co/], ['Landbot', /landbot\.io/],
  ['Vapi', /vapi\.ai/], ['ElevenLabs', /elevenlabs\.io/], ['Messenger', /customerchat/]
];
const BOOKING = [
  ['Calendly', /calendly\.com/], ['Cal.com', /\/\/(app\.)?cal\.com\//], ['Acuity', /acuityscheduling\.com/],
  ['HubSpot Meetings', /meetings\.hubspot\.com/], ['SimplyBook', /simplybook\./], ['Setmore', /setmore\.com/],
  ['Square Appointments', /squareup\.com\/appointments/], ['OpenTable', /opentable\./], ['Zoho Bookings', /zohobookings/]
];
const CRM = [
  ['HubSpot', /hs-scripts\.com|hsforms\.|hs-analytics|js\.hubspot\.com/], ['Salesforce', /salesforce\.com|pardot\.com/],
  ['Marketo', /marketo\.(net|com)|mktoresp/], ['Mailchimp', /chimpstatic\.com|list-manage\.com/], ['Klaviyo', /klaviyo\.com/],
  ['ActiveCampaign', /activehosted\.com|activecampaign/], ['Zoho', /zohopublic|salesiq\.zoho/], ['Pipedrive', /pipedrive/],
  ['Brevo', /sibforms|brevo\.com|sendinblue/], ['Typeform', /typeform\.com/], ['Jotform', /jotform/],
  ['Segment', /cdn\.segment\.(com|io)/], ['Zapier', /zapier\.com/]
];
const ANALYTICS = [
  ['Google Analytics', /googletagmanager\.com|google-analytics\.com|gtag\(/], ['Plausible', /plausible\.io/],
  ['Matomo', /matomo|piwik/], ['Hotjar', /hotjar\.com/], ['Microsoft Clarity', /clarity\.ms/],
  ['Meta Pixel', /connect\.facebook\.net|fbq\(/], ['Mixpanel', /mixpanel/], ['Fathom', /usefathom/]
];
const CDN = [
  ['Cloudflare', (h) => h['cf-ray'] || /cloudflare/i.test(h.server || '')], ['CloudFront', (h) => h['x-amz-cf-id']],
  ['Fastly', (h) => h['x-fastly-request-id'] || /fastly/i.test(h['x-served-by'] || '')], ['Netlify', (h) => h['x-nf-request-id']],
  ['Vercel', (h) => h['x-vercel-id']], ['Akamai', (h) => /akamai/i.test(h.server || '') || h['x-akamai-transformed']],
  ['Azure Front Door', (h) => h['x-azure-ref']], ['Google Cloud CDN', (h) => /gws|google frontend/i.test(h.server || '') && h.via],
  ['Sucuri', (h) => h['x-sucuri-id']], ['BunnyCDN', (h) => /bunnycdn/i.test(h.server || '')]
];
const found = (list, html) => list.filter(([, re]) => re.test(html)).map(([n]) => n);

/* ── Scoring ── */
const row = (label, state, value) => ({ label, state, value });
const band = (v, good, ok) => (v <= good ? 'pass' : v <= ok ? 'warn' : 'fail');
const kb = (n) => (n < 1024 ? n + ' B' : Math.round(n / 1024) + ' KB');

function analyse(main, extras) {
  const h = main.headers;
  const raw = main.body.toString('utf8');
  const html = raw.replace(/<!--[\s\S]*?-->/g, '');
  const lower = html.toLowerCase();
  const head = (html.match(/<head\b[\s\S]*?<\/head>/i) || [''])[0];
  const final = new URL(main.url);
  const isHttps = final.protocol === 'https:';
  const csp = String(h['content-security-policy'] || '') || (tagsOf(html, 'meta').find((m) => /content-security-policy/i.test(attr(m, 'http-equiv') || '')) ? 'meta' : '');
  const year = new Date().getFullYear();

  /* 01 Platforms: reliability & security */
  const platforms = [];
  platforms.push(row('Secure connection (HTTPS)', isHttps ? 'pass' : 'fail', isHttps ? 'Yes' : 'No'));
  if (isHttps && extras.httpProbe) {
    const loc = String(extras.httpProbe.headers.location || '');
    const ok = extras.httpProbe.status >= 300 && extras.httpProbe.status < 400 && /^https:/i.test(new URL(loc || '/', 'http://' + final.host).href);
    platforms.push(row('HTTP redirects to HTTPS', ok ? 'pass' : 'fail', ok ? 'Yes' : 'No'));
  }
  if (isHttps) {
    const mixed = (html.match(/\ssrc\s*=\s*["']http:\/\//gi) || []).length;
    platforms.push(row('Insecure (mixed) content', mixed ? 'fail' : 'pass', mixed ? mixed + ' found' : 'None'));
  }
  platforms.push(row('HSTS header', h['strict-transport-security'] ? 'pass' : 'warn', h['strict-transport-security'] ? 'Set' : 'Missing'));
  platforms.push(row('Content Security Policy', csp ? 'pass' : 'warn', csp ? 'Set' : 'Missing'));
  const frame = h['x-frame-options'] || /frame-ancestors/i.test(csp);
  platforms.push(row('Clickjacking protection', frame ? 'pass' : 'warn', frame ? 'Set' : 'Missing'));
  platforms.push(row('MIME sniffing protection', /nosniff/i.test(h['x-content-type-options'] || '') ? 'pass' : 'warn', h['x-content-type-options'] ? 'Set' : 'Missing'));
  const leak = [h['x-powered-by'], /\d/.test(h.server || '') ? h.server : null].filter(Boolean);
  platforms.push(row('Server version hidden', leak.length ? 'warn' : 'pass', leak.length ? 'Shows ' + String(leak[0]).slice(0, 40) : 'Yes'));

  /* 02 Mobile */
  const mobile = [];
  const vp = meta(html, 'viewport');
  mobile.push(row('Mobile viewport', vp && /width\s*=\s*device-width/i.test(vp) ? 'pass' : 'fail', vp ? (/device-width/i.test(vp) ? 'Set' : 'Fixed width') : 'Missing'));
  if (vp) {
    const noZoom = /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/i.test(vp);
    mobile.push(row('Pinch-zoom allowed', noZoom ? 'warn' : 'pass', noZoom ? 'Blocked' : 'Yes'));
  }
  const imgs = tagsOf(html, 'img');
  if (imgs.length) {
    const responsive = imgs.filter((i) => attr(i, 'srcset') !== null).length + tagsOf(html, 'picture').length;
    const pct = Math.min(1, responsive / imgs.length);
    mobile.push(row('Responsive images', pct >= 0.5 ? 'pass' : pct > 0 ? 'warn' : imgs.length > 3 ? 'fail' : 'warn', Math.round(pct * 100) + '% of ' + imgs.length));
  }
  const homeIcon = relLinks(html, 'manifest').length || relLinks(html, 'apple-touch-icon').length;
  mobile.push(row('Home-screen icon / app manifest', homeIcon ? 'pass' : 'warn', homeIcon ? 'Yes' : 'Missing'));
  mobile.push(row('Tap-to-call link', /href\s*=\s*["']tel:/i.test(html) ? 'pass' : 'warn', /href\s*=\s*["']tel:/i.test(html) ? 'Yes' : 'None found'));
  const apps = [/apps\.apple\.com|itunes\.apple\.com/i.test(html) && 'App Store', /play\.google\.com\/store/i.test(html) && 'Google Play'].filter(Boolean);
  mobile.push(row('Companion mobile app', apps.length ? 'pass' : 'warn', apps.length ? apps.join(' & ') : 'None linked'));

  /* 03 AI & automation */
  const chat = found(CHAT, lower), booking = found(BOOKING, lower), crm = found(CRM, lower), analytics = found(ANALYTICS, lower);
  const leadForm = tagsOf(html, 'form').length && (/type\s*=\s*["']?email/i.test(html) || /<textarea/i.test(html));
  const ai = [
    row('Chat or voice assistant', chat.length ? 'pass' : 'fail', chat.length ? chat.join(', ') : 'None found'),
    row('Online booking', booking.length ? 'pass' : 'warn', booking.length ? booking.join(', ') : 'None found'),
    row('CRM / marketing automation', crm.length ? 'pass' : 'warn', crm.length ? crm.join(', ') : 'None found'),
    row('Lead capture form', leadForm ? 'pass' : 'warn', leadForm ? 'Yes' : 'None found'),
    row('Visitor analytics', analytics.length ? 'pass' : 'warn', analytics.length ? analytics.join(', ') : 'None found')
  ];

  /* 04 UX & search basics */
  const design = [];
  const title = text((html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1]);
  design.push(row('Page title', !title ? 'fail' : title.length >= 10 && title.length <= 65 ? 'pass' : 'warn', title ? title.length + ' characters' : 'Missing'));
  const desc = (meta(html, 'description') || '').trim();
  design.push(row('Meta description', !desc ? 'fail' : desc.length >= 50 && desc.length <= 165 ? 'pass' : 'warn', desc ? desc.length + ' characters' : 'Missing'));
  const h1 = tagsOf(html, 'h1').length;
  design.push(row('One main heading (H1)', h1 === 1 ? 'pass' : h1 === 0 ? 'fail' : 'warn', h1 + ' found'));
  const lang = attr((html.match(/<html\b[^>]*>/i) || [''])[0], 'lang');
  design.push(row('Page language set', lang ? 'pass' : 'warn', lang || 'Missing'));
  if (imgs.length) {
    const noAlt = imgs.filter((i) => attr(i, 'alt') === null).length;
    const share = 1 - noAlt / imgs.length;
    design.push(row('Image alt text', noAlt === 0 ? 'pass' : share >= 0.8 ? 'warn' : 'fail', noAlt ? noAlt + ' of ' + imgs.length + ' missing' : 'All ' + imgs.length));
  }
  const og = [meta(html, 'og:title'), meta(html, 'og:image')].filter(Boolean).length;
  design.push(row('Social share preview', og === 2 ? 'pass' : 'warn', og === 2 ? 'Set' : og ? 'Partial' : 'Missing'));
  const robotsMeta = (meta(html, 'robots') || '') + ' ' + (h['x-robots-tag'] || '');
  const noindex = /noindex/i.test(robotsMeta);
  design.push(row('Visible to search engines', noindex ? 'fail' : 'pass', noindex ? 'Blocked (noindex)' : 'Yes'));
  const robotsOk = extras.robots && extras.robots.status === 200 && !/html/i.test(String(extras.robots.headers['content-type'] || ''));
  const sitemapOk = (extras.sitemap && extras.sitemap.status === 200) || (robotsOk && /^\s*sitemap:/im.test(extras.robots.body.toString('utf8')));
  design.push(row('robots.txt & sitemap', robotsOk && sitemapOk ? 'pass' : robotsOk || sitemapOk ? 'warn' : 'fail',
    [robotsOk ? 'robots.txt' : null, sitemapOk ? 'sitemap' : null].filter(Boolean).join(' + ') || 'Neither found'));

  /* 05 Code upkeep */
  const teams = [];
  const scripts = tagsOf(html, 'script');
  const extScripts = scripts.filter((s) => attr(s, 'src'));
  const jq = html.match(/jquery[.\-/@]?v?([1-4])\.(\d+)\.\d+/i) || html.match(/jquery(?:\.min)?\.js\?ver=([1-4])\.(\d+)/i);
  if (jq) {
    const major = +jq[1], minor = +jq[2];
    teams.push(row('jQuery version', major < 3 ? 'fail' : major === 3 && minor < 5 ? 'warn' : 'pass', major + '.' + minor));
  }
  teams.push(row('Script files', band(extScripts.length, 15, 30), extScripts.length + ' files'));
  const css = relLinks(html, 'stylesheet').length;
  teams.push(row('Stylesheet files', band(css, 6, 12), css + ' files'));
  const inline = (html.match(/<script\b(?![^>]*\ssrc=)[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>/gi) || []).reduce((n, s) => n + s.length, 0);
  teams.push(row('Inline code weight', band(inline, 50_000, 150_000), kb(inline)));
  const legacy = /<(font|center|marquee|frameset|applet)\b|\.swf\b/i.test(html);
  teams.push(row('Outdated markup or plugins', legacy ? 'fail' : 'pass', legacy ? 'Found' : 'None'));
  const years = [...html.matchAll(/(?:©|&copy;|&#169;|copyright)\s*(?:\d{4}\s*(?:-|–|&ndash;)\s*)?(\d{4})/gi)].map((m) => +m[1]).filter((y) => y > 1990 && y <= year);
  if (years.length) {
    const last = Math.max(...years);
    teams.push(row('Copyright year current', last >= year - 1 ? 'pass' : 'warn', '© ' + last));
  }
  const gen = meta(html, 'generator');
  const wp = gen && gen.match(/wordpress\s*(\d+)\.(\d+)/i);
  if (wp) teams.push(row('WordPress version', +wp[1] < 6 ? 'fail' : 'pass', wp[1] + '.' + wp[2]));

  /* 06 Hosting & speed */
  const cloud = [];
  cloud.push(row('Server response time', band(main.ttfb, 600, 1500), main.ttfb + ' ms'));
  const enc = main.encoding;
  const compressed = /br|gzip|deflate|zstd/.test(enc);
  cloud.push(row('Compression', compressed || main.bytes < 2048 ? 'pass' : 'fail', compressed ? ({ br: 'Brotli', gzip: 'Gzip', deflate: 'Deflate', zstd: 'Zstd' }[enc] || enc) : 'None'));
  const htmlBytes = main.body.length;
  cloud.push(row('HTML size', band(htmlBytes, 100_000, 300_000), kb(htmlBytes)));
  const blocking = (head.match(/<script\b[^>]*\ssrc=[^>]*>/gi) || []).filter((s) => !/\s(async|defer)\b|type\s*=\s*["']module/i.test(s)).length;
  cloud.push(row('Render-blocking scripts', band(blocking, 0, 3), blocking + ' in <head>'));
  cloud.push(row('Redirect hops', band(main.redirects, 1, 2), String(main.redirects)));
  const caching = h['cache-control'] || h.etag || h['last-modified'];
  cloud.push(row('Caching headers', caching ? 'pass' : 'warn', caching ? 'Set' : 'Missing'));
  const cdn = CDN.filter(([, t]) => t(h)).map(([n]) => n);
  cloud.push(row('CDN', cdn.length ? 'pass' : 'warn', cdn.length ? cdn.join(', ') : 'None detected'));

  const groups = { platforms, mobile, ai, design, teams, cloud };
  const services = Object.keys(groups).map((id) => {
    const list = groups[id];
    const score = Math.round(100 * list.reduce((n, r) => n + (r.state === 'pass' ? 1 : r.state === 'warn' ? 0.5 : 0), 0) / list.length);
    return { id, score, checks: list };
  });
  return {
    url: main.url,
    host: final.hostname,
    status: main.status,
    ms: main.ttfb,
    size: main.bytes,
    overall: Math.round(services.reduce((n, s) => n + s.score, 0) / services.length),
    services
  };
}

function normalize(raw) {
  let v = String(raw || '').trim();
  if (!v || v.length > 2048) return null;
  if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
  let u;
  try { u = new URL(v); } catch { return null; }
  if (!/^https?:$/.test(u.protocol) || u.username || u.password) return null;
  if (u.port && !['80', '443'].includes(u.port)) return null;
  if (u.hostname.indexOf('.') < 0 || /\.(local|internal|localhost)$/i.test(u.hostname)) return null;
  u.hash = '';
  return u.href;
}

function friendly(e) {
  const c = e.code || '';
  if (c === 'EBLOCKED') return 'That address isn\u2019t a public website.';
  if (c === 'ENOTFOUND' || c === 'EAI_AGAIN') return 'We couldn\u2019t find that domain. Check the spelling.';
  if (c === 'ETIMEDOUT' || c === 'ECONNRESET' || c === 'UND_ERR_CONNECT_TIMEOUT') return 'The site took too long to respond. It may be down or blocking automated checks.';
  if (c === 'ECONNREFUSED') return 'The site refused the connection.';
  if (/CERT|SSL|TLS|SELF_SIGNED/i.test(c + ' ' + e.message)) return 'The site\u2019s security certificate is invalid, so browsers will show visitors a warning.';
  if (c === 'EREDIRECTS') return 'The site redirects in a loop.';
  return 'We couldn\u2019t load that site.';
}

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

export default async (req) => {
  if (req.method !== 'GET') return json(405, { error: 'Method not allowed.' });
  const start = normalize(new URL(req.url).searchParams.get('url'));
  if (!start) return json(400, { error: 'Please enter a full public website address, like yourcompany.com' });

  let main;
  try {
    main = await follow(start, { timeout: MAIN_TIMEOUT, maxBytes: MAX_BYTES });
  } catch (e) {
    return json(422, { error: friendly(e) });
  }
  if (main.status === 401 || main.status === 403 || main.status === 429 || main.status === 503)
    return json(422, { error: 'That site blocks automated checks (HTTP ' + main.status + '). Request the full audit below and we\u2019ll review it by hand.' });
  if (main.status >= 400) return json(422, { error: 'That page answered with an error (HTTP ' + main.status + '). Check the address.' });
  if (!/html/i.test(String(main.headers['content-type'] || 'text/html'))) return json(422, { error: 'That address isn\u2019t a web page.' });

  const final = new URL(main.url);
  const side = { timeout: SIDE_TIMEOUT, maxBytes: 64_000 };
  const [httpProbe, robots, sitemap] = await Promise.all([
    final.protocol === 'https:' ? request('http://' + final.host + '/', { timeout: SIDE_TIMEOUT, maxBytes: 1 }).catch(() => null) : null,
    follow(final.origin + '/robots.txt', side).catch(() => null),
    follow(final.origin + '/sitemap.xml', { timeout: SIDE_TIMEOUT, maxBytes: 1 }).catch(() => null)
  ]);

  return json(200, analyse(main, { httpProbe, robots, sitemap }));
};
