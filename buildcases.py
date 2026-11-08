"""Generate the case study index and one detail page per project.

Reads every record from casedata.py and writes:

    case-studies.html            index of all projects, linked from index.html
    case-<slug>.html             one full detail page per project

Both use the A2 theme (style.css -> theme-a2.css -> cases.css), matching
index.html.

Self-contained, stdlib only, and idempotent: every run rewrites the files
from casedata.py, so edits belong in the data module and never in the output.

    python buildcases.py
"""
import html
import os

from casedata import PROJECTS, BY_SLUG, FLAGSHIP, IMG

HERE = os.path.dirname(os.path.abspath(__file__))

INDEX = "case-studies.html"
SERVICES = "services.html"
CSS = "css/style.css?v=20261028c"
CSS_A2 = "css/theme-a2.css?v=20261028c"
CSS_CASES = "css/cases.css?v=20261028c"


def e(text):
    """Escape for HTML text and attribute contexts. Source copy is plain UTF-8."""
    return html.escape(str(text), quote=True)


def page_for(slug):
    return "case-%s.html" % slug


# Most art has not landed in assets/CaseStudies/ yet. These four already exist
# under assets/work/, so point at them instead of rendering the placeholder.
SUBS = {
    "09-alliance-driveaway-solutions.jpg": "assets/work/alliance.jpg",
    "05-fluidsdata.jpg": "assets/work/fluidsdata.jpg",
    "company-01-cover.jpg": "assets/work/ai-front-desk.jpg",
    "10-who-i-follow.jpg": "assets/work/whoifollow.jpg",
}


def src_for(filename):
    return SUBS.get(filename, "%s/%s" % (IMG, filename))


# ══════════════════════════════════════════════════════════════════════════
# shared chrome
# ══════════════════════════════════════════════════════════════════════════

def head(title, description, active):
    nav = []
    for href, label in (("trucking.html", "Trucking &amp; Transport"),
                        (SERVICES, "Services"),
                        (INDEX, "Case Studies"),
                        ("about.html", "About Us")):
        cls = ' class="is-active"' if href == active else ""
        nav.append('      <a href="%s"%s>%s</a>' % (href, cls, label))

    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>%s</title>
<meta name="description" content="%s" />

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&amp;family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="%s" />
<link rel="stylesheet" href="%s" />
<link rel="stylesheet" href="%s" />
</head>

<body class="is-loading">

<div class="loader" id="loader" aria-hidden="true">
  <div class="loader__row">
    <div class="loader__ring"></div>
    <div class="loader__name">Alpha<sup>2</sup></div>
    <span class="loader__pct" id="loaderPct">0%%</span>
  </div>
</div>

<header class="nav" id="nav">
  <div class="nav__inner">
    <a href="index.html" class="brand" aria-label="Alpha Squared, Ideas Implemented">
      <img src="assets/logo-full.png" alt="Alpha Squared" class="brand__logo" />
    </a>

    <nav class="nav__links">
%s
    </nav>

    <a href="#contact" class="btn nav__cta"><span>Contact</span></a>

    <button class="nav__burger" id="burger" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<main>
""" % (e(title), e(description), CSS, CSS_A2, CSS_CASES, "\n".join(nav))


FOOT = """
<div class="page-light">
  <section class="final" id="contact">
    <div class="wrap">
      <span class="badge" data-anim="fade">Let's talk</span>
      <h2 class="d2" data-split="lines"><span class="grad">One conversation</span> makes your roadmap real.</h2>
      <p class="lead" data-anim="fade">Tell us what you're building. You'll get an honest read on scope,
        timeline and the right engagement model, usually within two business days.</p>
      <div class="cta-row" data-anim="fade" style="justify-content:center;margin-top:32px">
        <a href="mailto:info@alphasquared.co" class="btn"><span>Book a discovery call <i class="ar">&rarr;</i></span></a>
      </div>
    </div>
  </section>
</div>

</main>

<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div class="footer__brand">
        <a href="index.html" class="brand" aria-label="Alpha Squared, Ideas Implemented">
          <img src="assets/logo-full-white.png" alt="Alpha Squared" class="brand__logo" />
        </a>
        <p>Canadian software studio building for operators and enterprises since 2012.
          Trucking and transport specialists. Ideas implemented.</p>
      </div>
      <div>
        <h4>Solutions</h4>
        <ul>
          <li><a href="trucking.html">Trucking &amp; Transport</a></li>
          <li><a href="index-trucking-b.html">Driveaway Dispatch Platform &#8599;</a></li>
          <li><a href="services.html#platforms">Operations Platforms</a></li>
          <li><a href="services.html#mobile">Mobile Apps</a></li>
          <li><a href="services.html#ai">AI &amp; Automation</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="__INDEX__">Case Studies</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="trust.html">Trust &amp; Security</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li><a href="mailto:info@alphasquared.co">info@alphasquared.co</a></li>
          <li><a href="https://alphasquared.ca">alphasquared.ca</a></li>
          <li>Edmonton, Alberta, Canada</li>
        </ul>
      </div>
    </div>
    <div class="footer__base">
      <span>&copy; 2026 Alpha Squared. Ideas Implemented.</span>
      <span>Software for operations that can't stop.</span>
    </div>
  </div>
</footer>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/CustomEase.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>
<script src="https://unpkg.com/split-type@0.3.4/umd/index.min.js"></script>
<script src="js/main.js?v=20261028c"></script>
<script src="js/cases.js?v=20261028c"></script>
</body>
</html>
""".replace("__INDEX__", INDEX)


def shot(filename, alt, cls="shot", label=""):
    """A framed image. The <img> removes itself if the file is missing, which
    uncovers the gradient frame and the data-label rather than a broken icon."""
    return ('<figure class="%s" data-label="%s">'
            '<img src="%s" alt="%s" loading="lazy" onerror="this.remove()" />'
            '</figure>' % (cls, e(label or alt), e(src_for(filename)), e(alt)))


# ══════════════════════════════════════════════════════════════════════════
# interactive blocks
# ══════════════════════════════════════════════════════════════════════════

def ix_flow(ix):
    tabs, panels = [], []
    for i, s in enumerate(ix["steps"]):
        tabs.append('        <button class="ix__tab" role="tab" aria-selected="false" '
                    'aria-controls="fp%d"><span class="k">%s</span>%s</button>'
                    % (i, e(s["k"]), e(s["t"])))
        panels.append('      <div class="ix__panel" id="fp%d" role="tabpanel">\n'
                      '        <h4>%s</h4>\n        <p>%s</p>\n      </div>'
                      % (i, e(s["t"]), e(s["d"])))
    return ('    <div data-tabs>\n      <div class="ix__tabs" role="tablist">\n%s\n      </div>\n%s\n    </div>'
            % ("\n".join(tabs), "\n".join(panels)))


def ix_screens(ix):
    tabs, panels = [], []
    for i, s in enumerate(ix["shots"]):
        tabs.append('        <button class="ix__tab" role="tab" aria-selected="false" '
                    'aria-controls="sp%d">%s</button>' % (i, e(s["t"])))
        panels.append('      <div class="ix__panel" id="sp%d" role="tabpanel">\n'
                      '        %s\n        <figcaption>%s</figcaption>\n      </div>'
                      % (i, shot(s["img"], s["alt"]), e(s["cap"])))
    return ('    <div data-tabs>\n      <div class="ix__tabs" role="tablist">\n%s\n      </div>\n%s\n    </div>'
            % ("\n".join(tabs), "\n".join(panels)))


def ix_metrics(ix):
    items = []
    for m in ix["items"]:
        items.append('      <div class="met">\n'
                     '        <div class="met__n" data-n="%s" data-suffix="%s">0%s</div>\n'
                     '        <p class="met__l">%s</p>\n'
                     '        <div class="met__bar"><i data-p="%s"></i></div>\n'
                     '      </div>'
                     % (e(m["n"]), e(m["suffix"]), e(m["suffix"]), e(m["l"]), e(m["p"])))
    return '    <div class="ix-metrics" data-metrics>\n%s\n    </div>' % "\n".join(items)


def ix_stack(ix):
    rows = []
    for layer in ix["layers"]:
        tags = "".join("<span>%s</span>" % e(t) for t in layer["tags"])
        rows.append('      <div class="lay" tabindex="0">\n'
                    '        <h4>%s</h4>\n        <p>%s</p>\n'
                    '        <div class="lay__tags">%s</div>\n      </div>'
                    % (e(layer["t"]), e(layer["d"]), tags))
    return '    <div class="ix-stack">\n%s\n    </div>' % "\n".join(rows)


def ix_transcript(ix):
    who_label = {"agent": "AI agent", "caller": "Caller", "system": "System"}
    rows = []
    for turn in ix["turns"]:
        who = turn["who"]
        label = ("" if who == "system"
                 else '<span class="turn__who">%s</span>' % e(who_label[who]))
        rows.append('      <div class="turn turn--%s">%s%s</div>'
                    % (e(who), label, e(turn["text"])))
    return '    <div class="ix-tr" data-transcript>\n%s\n    </div>' % "\n".join(rows)


BUILDERS = {"flow": ix_flow, "screens": ix_screens, "metrics": ix_metrics,
            "stack": ix_stack, "transcript": ix_transcript}


def render_ix(ix):
    if not ix:
        return ""
    body = BUILDERS[ix["type"]](ix)
    return ("""
<section class="section section--tight">
  <div class="wrap">
    <div class="ix" data-anim="up">
      <p class="ix__label">%s</p>
      <h2 class="ix__title">%s</h2>
%s
    </div>
  </div>
</section>
""" % (e(ix["label"]), e(ix["title"]), body))


# ══════════════════════════════════════════════════════════════════════════
# detail page
# ══════════════════════════════════════════════════════════════════════════

def detail(p, prev, nxt):
    title = p["title"] or "%s, %s Case Study | Alpha Squared" % (p["name"], p["category"])
    desc = p["description"] or p["card"]

    out = [head(title, desc, INDEX)]

    out.append("""
<section class="hero hero--page">
  <div class="hero__arc" data-parallax="0.12"></div>
  <div class="hero__bloom" data-parallax="0.2"></div>

  <div class="wrap hero__inner">
    <a class="cs-back" href="%s" data-anim="fade">&larr; All case studies</a>
    <span class="badge" data-anim="fade">%s</span>
    <h1 class="d1" data-split="words">%s</h1>
    <p class="hero__sub" data-anim="fade" data-delay="0.5">%s</p>
  </div>
</section>
""" % (INDEX, e(p["category"]), e(p["name"]), e(p["tagline"])))

    # ── overview: what it is, chips, hero image, the three columns ──
    out.append('\n<section class="section">\n  <div class="wrap">\n')
    out.append('    <h2 class="cs-what" data-anim="fade">What it is</h2>\n')
    out.append('    <p class="lead cs-lede" data-anim="fade">%s</p>\n' % e(p["lead"]))

    if p["chips"]:
        chips = "".join("<span>%s</span>" % e(c) for c in p["chips"])
        out.append('    <div class="chips cs-chips" data-anim="fade">%s</div>\n' % chips)

    if p["images"]:
        fn, alt = p["images"][0]
        out.append('    %s\n' % shot(fn, alt, cls="shot cs-hero__shot"))

    cols = []
    if p["problem"]:
        cols.append('      <div>\n        <h3>The problem</h3>\n        <p>%s</p>\n      </div>'
                    % e(p["problem"]))
    if p["shipped"]:
        li = "\n".join("          <li>%s</li>" % e(x) for x in p["shipped"])
        cols.append('      <div>\n        <h3>What we shipped</h3>\n'
                    '        <ul class="ticks">\n%s\n        </ul>\n      </div>' % li)
    if p["today"]:
        li = "\n".join("          <li>%s</li>" % e(x) for x in p["today"])
        cols.append('      <div>\n        <h3>Where it stands today</h3>\n'
                    '        <ul class="ticks">\n%s\n        </ul>\n      </div>' % li)
    if cols:
        out.append('    <div class="cs-cols" data-anim="up">\n%s\n    </div>\n' % "\n".join(cols))

    out.append('  </div>\n</section>\n')

    out.append(render_ix(p["ix"]))

    # ── any remaining art that the interactive block did not already use ──
    used = set()
    if p["ix"] and p["ix"]["type"] == "screens":
        used = {s["img"] for s in p["ix"]["shots"]}
    extra = [im for im in p["images"][1:] if im[0] not in used]
    if extra:
        cells = "\n".join("      %s" % shot(fn, alt) for fn, alt in extra)
        out.append('\n<section class="section section--tight">\n  <div class="wrap">\n'
                   '    <div class="grid grid--2" data-anim="up">\n%s\n    </div>\n'
                   '  </div>\n</section>\n' % cells)

    # ── prev / all / next ──
    out.append("""
<section class="section section--tight">
  <div class="wrap">
    <nav class="cs-pager" aria-label="More case studies">
      <a class="to-prev" href="%s"><small>Previous</small><strong>%s</strong></a>
      <a class="to-all" href="%s"><strong>All %d case studies</strong></a>
      <a class="to-next" href="%s"><small>Next</small><strong>%s</strong></a>
    </nav>
  </div>
</section>
""" % (page_for(prev["slug"]), e(prev["name"]),
       INDEX, len(PROJECTS),
       page_for(nxt["slug"]), e(nxt["name"])))

    out.append(FOOT)
    return "".join(out)


# ══════════════════════════════════════════════════════════════════════════
# index page
# ══════════════════════════════════════════════════════════════════════════

def card(p):
    media = ""
    if p["images"]:
        fn, alt = p["images"][0]
        media = shot(fn, alt, cls="shot ccard__media", label=p["name"])

    return ('    <a class="ccard" href="%s" data-cat="%s" data-anim="up">\n'
            '      %s\n'
            '      <div class="ccard__body">\n'
            '        <span class="ccard__cat">%s</span>\n'
            '        <h3 class="ccard__name">%s</h3>\n'
            '        <p class="ccard__tag">%s</p>\n'
            '        <p class="ccard__p">%s</p>\n'
            '        <span class="ccard__go">Read the case study <i>&rarr;</i></span>\n'
            '      </div>\n    </a>'
            % (page_for(p["slug"]), e(p["category"]), media,
               e(p["category"]), e(p["name"]), e(p["tagline"]), e(p["card"])))


def index():
    flagship = [BY_SLUG[s] for s in FLAGSHIP]
    rest = [p for p in PROJECTS if p["slug"] not in FLAGSHIP]

    out = [head(
        "Case Studies, 48 Projects in Production | Alpha Squared",
        "Every Alpha Squared case study in one place: dispatch platforms, AI agents, "
        "marketplaces, clinical systems and more. %d projects, each with the problem, "
        "what we shipped and where it stands today." % len(PROJECTS),
        INDEX)]

    out.append("""
<section class="hero hero--page">
  <div class="hero__arc" data-parallax="0.12"></div>
  <div class="hero__bloom" data-parallax="0.2"></div>

  <div class="wrap hero__inner">
    <span class="hero__eyebrow grad" data-anim="fade">Selected work</span>
    <h1 class="d1" data-split="words">Systems running in production,<br />not slides in a deck.</h1>
    <p class="hero__sub" data-anim="fade" data-delay="0.5">
      265+ projects since 2012. These %d are the ones we can show in full:
      the problem, what we shipped, and what it is doing today.
    </p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="head head--center">
      <span class="badge" data-anim="fade">Our best work, not a sales pitch</span>
      <h2 class="d2" data-split="lines">The work that<br /><span class="grad">speaks for itself.</span></h2>
      <p class="lead" data-anim="fade">Dispatch running a 350-driver fleet. A voice agent answering
        calls at 3am. Drilling-fluids analytics in use at Chevron and ExxonMobil. No pitch needed,
        just what shipped.</p>
    </div>

    <div class="cs-feat">
%s
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="head head--center">
      <span class="badge" data-anim="fade">The wider archive</span>
      <h2 class="d2" data-split="lines">Beyond the flagships,<br /><span class="grad">there's more.</span></h2>
      <p class="lead" data-anim="fade">The flagships prove what we build for trucking, AI and
        industrial data. This is everywhere else: Coca-Cola's internal messaging platform, a
        1,750-channel IPTV app, a diabetes clinic seeing 300 patients a day, and more, across
        North America, Europe, the Middle East and Asia.</p>
    </div>

    <div class="cs-grid" data-cases>
%s
    </div>
  </div>
</section>
""" % (len(PROJECTS),
       "\n".join(card(p) for p in flagship),
       "\n".join(card(p) for p in rest)))

    out.append(FOOT)
    return "".join(out)


# ══════════════════════════════════════════════════════════════════════════

def write(name, text):
    with open(os.path.join(HERE, name), "w", encoding="utf-8", newline="\n") as fh:
        fh.write(text)


def main():
    slugs = [p["slug"] for p in PROJECTS]
    assert len(slugs) == len(set(slugs)), "duplicate slug in casedata.PROJECTS"

    write(INDEX, index())
    print("wrote %s (%d projects)" % (INDEX, len(PROJECTS)))

    n = len(PROJECTS)
    for i, p in enumerate(PROJECTS):
        prev = PROJECTS[(i - 1) % n]
        nxt = PROJECTS[(i + 1) % n]
        write(page_for(p["slug"]), detail(p, prev, nxt))
    print("wrote %d detail pages" % n)


if __name__ == "__main__":
    main()
