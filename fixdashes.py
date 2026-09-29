"""One-shot cleanup: strip em/en dashes out of the HTML pages.

House style (see casedata.py): no em-dashes in body copy, use a period, a
comma or a colon. Rules run in order, specific before generic, so the
judgement calls are made explicitly and the catch-all only sees leftovers.

Delete this file once the pages are clean.
"""
import glob
import re

SPECIFIC = [
    # page titles: use the pipe separator the other titles already use
    ("About Us \u2014 Alpha", "About Us | Alpha"),
    ("Case Studies \u2014 Alliance", "Case Studies | Alliance"),
    ("Driveaway Dispatch Software \u2014 Built", "Driveaway Dispatch Software | Built"),
    ("Services \u2014 Operations Platforms", "Services | Operations Platforms"),
    ("Transport Software \u2014 Dispatch, Driver", "Transport Software | Dispatch, Driver"),
    ("Trust &amp; Security \u2014 NDA", "Trust &amp; Security | NDA"),

    # brand aria-label, matching the comma form index2.html already uses
    ("Alpha Squared \u2014 Ideas Implemented", "Alpha Squared, Ideas Implemented"),

    # numeric ranges read as words
    ("5&ndash;12%", "5 to 12%"),
    ("2&ndash;3 years", "2 to 3 years"),
    ("6&ndash;18 months", "6 to 18 months"),
    ("$100&ndash;300", "$100 to $300"),

    # a colon is what these actually want
    ("dispatch dashboard \u2014 job creation", "dispatch dashboard: job creation"),
    ("QuickBooks sync \u2014 load to invoice", "QuickBooks sync: load to invoice"),
    ("Dispatch \u2014 Active jobs", "Dispatch: Active jobs"),
    ("measurable job to do \u2014 answer the", "measurable job to do: answer the"),
    ("Weeks \u2014 configured, not written", "Weeks: configured, not written"),
    ("prototype first \u2014 you see and approve", "prototype first: you see and approve"),

    # full stop reads better than a comma here
    ("No \u2014 the opposite.", "No. The opposite."),
    ("No \u2014 assumes trailer", "No. Assumes trailer"),
    ("No \u2014 assumes freight", "No. Assumes freight"),
    ("partner &mdash; they found", "partner. They found"),
]

REGEX = [
    # numbered column labels: 01 — NO TRAILER
    (r"(0\d) \u2014 NO ", r"\1 \u00b7 NO "),

    # testimonial where the dash opens a continuation line
    (r"capability\s*\n(\s*)&mdash; the highest", r"capability.\n\1The highest"),

    # dash opening a wrapped line: push a comma onto the line before it
    (r" ?\n(\s*)\u2014 ", r",\n\1"),

    # dash immediately before a break tag
    (r" \u2014(<br\s*/?>)", r",\1"),

    # dash closing a line
    (r" \u2014\n", ",\n"),

    # the common parenthetical case
    (r" \u2014 ", ", "),

    # leftovers
    (r"&mdash;\s*", ", "),
    (r"(\d)&ndash;(\d)", r"\1 to \2"),
    (r"&ndash;", " to "),
    (r"\s*\u2014\s*", ", "),
    (r"(\d)\s*\u2013\s*(\d)", r"\1 to \2"),
    (r"\s*\u2013\s*", ", "),
]


def clean(text):
    for old, new in SPECIFIC:
        text = text.replace(old, new)
    for pattern, repl in REGEX:
        text = re.sub(pattern, repl, text)
    return text


def main():
    touched = 0
    for path in sorted(glob.glob("*.html")):
        with open(path, encoding="utf-8") as fh:
            src = fh.read()
        out = clean(src)
        if out != src:
            with open(path, "w", encoding="utf-8", newline="\n") as fh:
                fh.write(out)
            before = len(re.findall(r"[\u2013\u2014]|&[mn]dash;", src))
            print("%-32s %d fixed" % (path, before))
            touched += 1
    print("files changed:", touched)


if __name__ == "__main__":
    main()
