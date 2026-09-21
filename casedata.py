"""Case study source data: one record per project, consumed by buildcases.py.

Kept apart from the generator so copy edits never risk breaking the templating.
Text is written as plain UTF-8 (write "&", not "&amp;"); buildcases.py escapes it.

House style for anything added here:
  * no em-dashes in body copy, use a period or a colon
  * concrete over generic: real client names, real numbers, real outcomes
  * US spelling (color, center, organization, analyze)

Every project on the site must have a record here. Nothing gets removed.
"""

FLAGSHIP = ("alliance-driveaway", "fluidsdata", "ai-front-desk")

IMG = "assets/CaseStudies"


def P(slug, name, category, tagline, lead, problem, shipped, today,
      chips, images, ix, card, title=None, description=None, hand=False):
    return {
        "slug": slug, "name": name, "category": category, "tagline": tagline,
        "lead": lead, "problem": problem, "shipped": shipped, "today": today,
        "chips": chips, "images": images, "ix": ix, "card": card,
        "title": title, "description": description, "hand": hand,
    }


PROJECTS = [

    # ─────────────────────────── FLAGSHIP (hand-authored pages) ───────────────
    P("alliance-driveaway", "Alliance Driveaway Solutions", "Trucking & Transport",
      tagline="Dispatch software for when the truck is the freight.",
      lead="A complete digital ecosystem for a North American Class 6/7/8 vehicle "
           "relocation company: dispatch dashboard, native iOS and Android driver "
           "apps, and QuickBooks-integrated accounting underneath all of it.",
      problem="",
      shipped=[], today=[], chips=[],
      images=[("09-alliance-driveaway-solutions.jpg",
               "Alliance Driveaway dispatch dashboard and driver app shown side by side")],
      ix=None,
      card="350+ screened CDL drivers, 48 states and Canada, one dispatch board. "
           "Web dashboard, native driver apps and QuickBooks sync, all running in production.",
      hand=True),

    P("fluidsdata", "FluidsData", "Energy & Industrial",
      tagline="Drilling fluids data that answers back.",
      lead="An AI-powered analytics platform for oil and gas. It turns raw, messy "
           "drilling-fluids data into structured dashboards, then layers an agentic "
           "assistant on top for predictive guidance.",
      problem="",
      shipped=[], today=[], chips=[],
      images=[("05-fluidsdata.jpg",
               "FluidsData analytics dashboard showing drilling fluids charts and data tables")],
      ix=None,
      card="In active use by teams at Chevron, ExxonMobil and ADNOC. Raw fluids data in, "
           "structured dashboards and an agentic assistant out.",
      hand=True),

    P("ai-front-desk", "AI Front Desk", "AI in Production",
      tagline="A receptionist that never sleeps, never forgets, never takes a message wrong.",
      lead="An autonomous voice agent that answers real inbound calls around the clock. "
           "It understands intent, checks live availability, books the appointment and "
           "writes the record into HubSpot. No human in the loop.",
      problem="",
      shipped=[], today=[], chips=[],
      images=[("company-01-cover.jpg",
               "Alpha Squared AI Front Desk voice agent concept cover image")],
      ix=None,
      card="A voice agent answering real calls 24/7: intent, live availability, booking "
           "and CRM write-back with nobody on the other end.",
      hand=True),

    # ─────────────────────────── GENERATED PAGES ──────────────────────────────

    P("oravia", "Oravia", "Travel & Tourism",
      tagline="Wellness claims in travel, verified instead of asserted.",
      lead="Oravia certifies that a hotel, spa or tour operator actually meets a "
           "wellness standard rather than just printing the word on a brochure. We "
           "built the platform that runs the certification end to end: supplier "
           "applications, evidence review, scoring against the standard, and the "
           "public directory travelers search before they book.",
      problem="Wellness is the easiest claim in travel to make and the hardest to check. "
              "Suppliers self-declared, travelers had no way to verify anything, and the "
              "certifying body was running assessments out of email attachments and "
              "spreadsheets that nobody could audit six months later.",
      shipped=["Supplier onboarding with structured evidence upload",
               "A scoring engine that grades submissions against the published standard",
               "Reviewer workflow with a full audit trail on every decision",
               "A public certification directory travelers can search"],
      today=["Partners include the Department of Culture & Tourism and the Florida Chamber of Commerce",
             "Las Vegas Tours Co. and Tour Turkey Co. certified through the platform",
             "Every certification decision is traceable back to its evidence",
             "Local operators compete on verified standards, not marketing budget"],
      chips=["PHP / Laravel", "Vue.js", "MySQL", "AWS"],
      images=[("01-oravia.jpg",
               "Oravia wellness certification platform homepage showing certified property listings")],
      ix={"type": "flow", "label": "Click a stage",
          "title": "How a property gets certified.",
          "steps": [
              {"k": "01", "t": "Application", "d": "A supplier registers the property and selects which wellness standard they are applying against. The platform generates the evidence checklist for that standard automatically."},
              {"k": "02", "t": "Evidence", "d": "Documents, photos and policy records get uploaded against each individual criterion, so a reviewer is never guessing which file supports which claim."},
              {"k": "03", "t": "Assessment", "d": "A reviewer scores criterion by criterion. Every score carries a comment and a timestamp, which is what makes the certification defensible later."},
              {"k": "04", "t": "Certification", "d": "Passing properties get a dated certificate and a public profile. Failing ones get a specific remediation list instead of a rejection email."},
              {"k": "05", "t": "Directory", "d": "Certified properties surface in the public directory, filterable by standard, region and property type."}]},
      card="Certification platform for authentic wellness in travel. Suppliers submit "
           "evidence, reviewers score against a published standard, and travelers get a "
           "directory they can actually trust."),

    P("alkanooz", "Alkanooz", "E-commerce",
      tagline="Artisan metalwork, sold like a brand instead of a craft fair.",
      lead="A home decor e-commerce brand built around handcrafted metal and wood pieces. "
           "The store had to carry the weight of the heritage story without turning into "
           "a museum, so the build pairs a conventional high-conversion shop with editorial "
           "lookbook and press sections.",
      problem="Handcrafted goods sell on story, but story does not fit in a product grid. "
              "The brand was splitting its audience between social channels that told the "
              "story and a storefront that only listed SKUs, and neither one was doing the "
              "other's job.",
      shipped=["Full storefront: catalog, cart, checkout and order management",
               "An editorial lookbook that links every styled shot back to buyable products",
               "Blog and press section for the artisan heritage narrative",
               "Instagram integration so the social feed feeds the shop"],
      today=["One property carries both the brand story and the transaction",
             "Lookbook imagery doubles as merchandising",
             "Press coverage lives on-domain instead of on someone else's platform",
             "Catalog is managed by the client without developer involvement"],
      chips=["PHP", "WordPress", "WooCommerce", "MySQL"],
      images=[("02-alkanooz-homepage.jpg",
               "Alkanooz home decor storefront homepage featuring handcrafted metal pieces"),
              ("39-alkanooz-alt.jpg",
               "Alkanooz lookbook and product detail layout with editorial photography")],
      ix={"type": "screens", "label": "Switch views",
          "title": "Storefront and lookbook, same system.",
          "shots": [
              {"t": "Storefront", "img": "02-alkanooz-homepage.jpg",
               "alt": "Alkanooz storefront homepage with featured handcrafted product collections",
               "cap": "The shop side: collections, product grid and a checkout that stays out of the way."},
              {"t": "Lookbook", "img": "39-alkanooz-alt.jpg",
               "alt": "Alkanooz editorial lookbook page with styled interior photography and shoppable products",
               "cap": "The editorial side: styled rooms where every object in frame is a link to the product."}]},
      card="Home decor e-commerce for handcrafted metal and wood, drawing on artisan "
           "heritage. Shop, lookbook, press and Instagram integration in one property."),

    P("amwalouna", "Amwalouna", "Real Estate",
      tagline="Every unit, every contract, every installment, one source of truth.",
      lead="A real estate management system for developers selling units on long payment "
           "plans. It tracks the customer, the unit, the contract and the installment "
           "schedule as one connected record, so nobody has to reconcile four spreadsheets "
           "to answer a simple question about who owes what.",
      problem="Developers were tracking sales in one system, contracts in another and "
              "payment plans in a third. When a customer called about a missed installment, "
              "answering took three people and half a day, and the answer was often wrong.",
      shipped=["Customer records linked to purchased units and signed contracts",
               "Customizable payment plans with automated installment tracking",
               "Status visibility across project, unit, contract and payment in one view",
               "Collections reporting that flags overdue installments before they age"],
      today=["A single query answers what a customer owes and when",
             "Installment schedules generate from the contract instead of being retyped",
             "Project-level occupancy and sales status is current, not month-end",
             "Built on .NET and SQL Server to fit the client's existing infrastructure"],
      chips=[".NET", "SQL Server", "C#"],
      images=[("03-amwalouna.jpg",
               "Amwalouna real estate management dashboard showing units, contracts and payment schedules")],
      ix={"type": "metrics", "label": "The shape of the problem",
          "title": "What consolidation actually bought them.",
          "items": [
              {"n": 4, "suffix": "", "l": "systems collapsed into one", "p": 1.0},
              {"n": 100, "suffix": "%", "l": "of installments auto-scheduled from contract", "p": 1.0},
              {"n": 1, "suffix": " view", "l": "for project, unit, contract and payment", "p": 0.9},
              {"n": 0, "suffix": "", "l": "spreadsheets in the reconciliation path", "p": 0.15}]},
      card="Real estate management system for property sales and customer relationships: "
           "customer records, purchased units, contracts and automated installment tracking."),

    P("compo-plus-plus", "Compo++", "Energy & Industrial",
      tagline="Fluids characterization data, digitized and made arguable.",
      lead="An AI-powered platform for the oil and gas industry that turns raw fluids "
           "characterization data into structured, actionable insight. It handles "
           "digitization, ingestion, QA/QC, visualization and exploratory analysis, with "
           "an agentic assistant that pairs physics-backed models with predictive guidance.",
      problem="Fluids characterization data arrives as lab PDFs, vendor exports and legacy "
              "files in formats nobody standardized. Engineers were spending more time "
              "getting data into a usable shape than analyzing it, on decisions where the "
              "delay costs real money per day.",
      shipped=["Digitization and ingestion for lab reports and vendor data formats",
               "Automated QA/QC that flags physically implausible values before analysis",
               "Visualization and exploratory analysis built for fluids engineers",
               "An agentic AI assistant combining physics-backed models with prediction"],
      today=["Built for ADNOC alongside the FluidsData product line",
             "QA/QC runs on ingestion instead of being someone's manual review step",
             "Engineers ask the assistant questions instead of building the chart first",
             "Go and Python back end sized for large technical datasets"],
      chips=["Go", "Python", "Vue.js", "MySQL", "Agentic AI"],
      images=[("04-compo-plus-plus.jpg",
               "Compo++ oil and gas fluids analytics platform showing characterization charts")],
      ix={"type": "stack", "label": "Hover a layer",
          "title": "Four layers between a lab PDF and a decision.",
          "layers": [
              {"t": "Ingest", "d": "Lab reports, vendor exports and legacy files land in one pipe and come out as typed records.", "tags": ["OCR", "Parsers", "Go"]},
              {"t": "QA/QC", "d": "Physically implausible values get flagged at ingestion, not discovered three charts later.", "tags": ["Rules", "Physics models"]},
              {"t": "Analyze", "d": "Exploratory tooling built around how fluids engineers actually interrogate a dataset.", "tags": ["Python", "Vue.js"]},
              {"t": "Assist", "d": "An agentic assistant that answers in domain terms and shows the data behind the answer.", "tags": ["Agentic AI", "Predictive"]}]},
      card="AI-powered platform for oil and gas that turns raw fluids characterization data "
           "into structured insight. Digitization, ingestion, QA/QC, visualization and an "
           "agentic assistant."),

    P("repair-beat", "Repair Beat", "SaaS / POS",
      tagline="A repair shop's entire day, from intake ticket to paid invoice.",
      lead="A cloud-based POS and operations platform for mobile and electronics repair "
           "businesses. Multi-tenant from the first commit, because the product had to "
           "serve single-location shops and multi-location chains on the same codebase.",
      problem="Repair shops were running intake on paper, inventory in a spreadsheet and "
              "payments through a card terminal that knew nothing about either. Parts went "
              "missing between locations and no owner could tell which technician or which "
              "repair type was actually profitable.",
      shipped=["Repair ticketing from intake through technician assignment to pickup",
               "Inventory tracking with multi-location stock transfers",
               "Role-based access so a technician sees jobs and an owner sees margin",
               "PayPal and Stripe payments, an embeddable lead-capture widget, and a built-in CMS"],
      today=["Multi-tenant architecture with a subscription admin panel",
             "Comparable in scope to RepairDesk, built for a fraction of the incumbent's price",
             "Stock transfers between locations are tracked instead of assumed",
             "Shops onboard themselves through the subscription flow"],
      chips=["PHP / Laravel", "Vue.js", "MySQL", "Stripe", "PayPal"],
      images=[("06-repair-beat.jpg",
               "Repair Beat point of sale and repair ticketing dashboard for electronics repair shops"),
              ("41-repairbeat-erp.jpg",
               "Repair Beat inventory and sales analytics screens")],
      ix={"type": "flow", "label": "Click a stage",
          "title": "One ticket, start to finish.",
          "steps": [
              {"k": "01", "t": "Intake", "d": "Device, fault, customer and quoted price captured at the counter. The customer gets the ticket reference before they leave."},
              {"k": "02", "t": "Assign", "d": "The job routes to a technician by skill and current load, so the queue is visible instead of living in someone's head."},
              {"k": "03", "t": "Parts", "d": "Parts consumed pull from local stock. If the branch is out, the transfer request goes to the location that has it."},
              {"k": "04", "t": "Repair", "d": "Status updates as the technician works. The counter can answer 'is it ready' without walking to the bench."},
              {"k": "05", "t": "Pay", "d": "Invoice generated from the ticket, paid through Stripe or PayPal, margin recorded against the technician and the repair type."}]},
      card="Cloud SaaS POS and operations platform for mobile and electronics repair shops. "
           "Multi-tenant ticketing, technician assignment, inventory and multi-location "
           "stock transfers."),

    P("foodstretcher-plus-ocr", "FoodStretcher Plus & OCR", "Fintech",
      tagline="Cash back on groceries, for the people who need it most.",
      lead="A consumer rewards platform where shoppers earn cash back on eligible grocery "
           "purchases. The hard part was not the rewards ledger. It was reading a crumpled "
           "receipt photo accurately enough to pay real money against it, which is why we "
           "built the OCR microservice ourselves.",
      problem="Off-the-shelf receipt OCR fell over on the exact receipts this audience "
              "submits: thermal paper, bad lighting, folded corners, store-specific layouts. "
              "Manual review does not scale and getting it wrong means denying a payout to "
              "someone who is counting on it.",
      shipped=["Onboarding built for unbanked and benefits-dependent users",
               "Receipt submission across web and mobile",
               "A custom OCR microservice for automated scanning and line-item validation",
               "Rewards tracking and payout workflows"],
      today=["Receipt validation runs automatically instead of through a review queue",
             "Accessibility was a design constraint, not a compliance checkbox",
             "React Native app shares the Laravel back end with the web experience",
             "OCR service is isolated, so it scales independently of the rewards platform"],
      chips=["PHP / Laravel", "React Native", "Custom OCR", "MySQL"],
      images=[("07-foodstretcher-plus-ocr.jpg",
               "FoodStretcher Plus rewards app and receipt OCR scanning interface")],
      ix={"type": "flow", "label": "Click a stage",
          "title": "From a photo of a receipt to money in an account.",
          "steps": [
              {"k": "01", "t": "Capture", "d": "The shopper photographs the receipt in the app. Guidance in the camera view is deliberate: a better capture is cheaper than a failed extraction."},
              {"k": "02", "t": "Extract", "d": "Our OCR microservice pulls the merchant, date, totals and individual line items off thermal paper that has usually been in a pocket."},
              {"k": "03", "t": "Validate", "d": "Line items are matched against the eligible product list. Duplicates and altered receipts get caught here."},
              {"k": "04", "t": "Credit", "d": "Eligible spend converts to a cash-back balance, itemized so the shopper can see exactly which product earned what."},
              {"k": "05", "t": "Payout", "d": "Balance moves out through the payout workflow, designed around users who may not have a conventional bank account."}]},
      card="Consumer rewards platform paying cash back on grocery purchases, with a "
           "custom-built OCR microservice for automated receipt scanning and validation."),

    P("kingsland", "Kingsland", "Real Estate",
      tagline="A listings portal with the agent's dashboard behind it.",
      lead="A full real estate listing and management platform for the Pakistani market: "
           "a public portal where buyers browse, filter and inquire, plus admin and agent "
           "dashboards that turn those inquiries into tracked leads instead of lost "
           "WhatsApp messages.",
      problem="Listings lived on the public site and leads lived in agents' phones. Nobody "
              "could tell which listings generated inquiries, which agents followed up, or "
              "which properties had gone stale, because the two halves of the business were "
              "never connected.",
      shipped=["Public listing portal with browse, filter and inquiry flows",
               "Admin dashboard for listings, agents and performance",
               "Agent dashboard for leads and client communication",
               "Native Flutter apps for Android and iOS"],
      today=["Every public inquiry lands as a tracked lead with an owner",
             "Agent performance is measurable instead of anecdotal",
             "Web built on WordPress so the marketing team can move without a deploy",
             "One codebase in Flutter covers both mobile platforms"],
      chips=["WordPress", "PHP", "Flutter", "MySQL"],
      images=[("08-kingsland.jpg",
               "Kingsland real estate listing portal with property search and agent dashboard")],
      ix={"type": "metrics", "label": "Where the leverage was",
          "title": "Connecting the two halves.",
          "items": [
              {"n": 2, "suffix": "", "l": "native apps from one Flutter codebase", "p": 0.7},
              {"n": 3, "suffix": "", "l": "surfaces sharing one listing record", "p": 0.85},
              {"n": 100, "suffix": "%", "l": "of inquiries attributed to a listing and an agent", "p": 1.0},
              {"n": 0, "suffix": "", "l": "leads living only in a phone", "p": 0.1}]},
      card="Real estate listing and management platform: public property portal plus admin "
           "and agent dashboards for listings, leads and agent performance."),

    P("who-i-follow", "Who I Follow", "Sports Tech",
      tagline="Run a 200-team softball tournament without a binder.",
      lead="A sports social and event management platform for leagues and associations, "
           "starting with softball. It handles the parts that break at scale: pool play, "
           "bracket generation, umpire assignment and live scoring from the field.",
      problem="Tournament directors were building brackets by hand, assigning umpires by "
              "phone and posting scores to a Facebook group. At a hundred teams that is "
              "painful. At several hundred it stops working entirely, and one rain delay "
              "invalidates the whole printed schedule.",
      shipped=["Teams, divisions, parks and umpire management in one system",
               "Automated pool play and bracket generation",
               "Real-time scoring submitted from mobile at the field",
               "Live leaderboards, public event views, encrypted chat and notifications"],
      today=["Tournaments with hundreds of teams run on it",
             "A rain delay reschedules in the system instead of on a whiteboard",
             "Parents and players follow live scores without calling anyone",
             "Native iOS and Android apps alongside the Laravel and Vue platform"],
      chips=["PHP / Laravel", "Vue.js", "MySQL", "Swift", "Kotlin"],
      images=[("10-who-i-follow.jpg",
               "Who I Follow sports platform showing tournament brackets and team schedules"),
              ("14-who-i-follow-alt-a.jpg",
               "Who I Follow live scoring and leaderboard views on mobile"),
              ("15-who-i-follow-alt-b.jpg",
               "Who I Follow team, division and umpire management screens")],
      ix={"type": "screens", "label": "Switch views",
          "title": "The three jobs it does at once.",
          "shots": [
              {"t": "Scheduling", "img": "10-who-i-follow.jpg",
               "alt": "Who I Follow tournament scheduling and bracket generation interface",
               "cap": "Pool play and brackets generate from the team list. Reschedules propagate instead of being redrawn."},
              {"t": "Live scoring", "img": "14-who-i-follow-alt-a.jpg",
               "alt": "Who I Follow live scoring screen and public leaderboard on a phone",
               "cap": "Scores go in from the field on mobile and hit the public leaderboard immediately."},
              {"t": "Operations", "img": "15-who-i-follow-alt-b.jpg",
               "alt": "Who I Follow admin screens for teams, divisions, parks and umpire assignment",
               "cap": "Teams, divisions, parks and umpire assignments: the unglamorous half that decides whether an event runs."}]},
      card="Sports social and event management platform for leagues and associations. "
           "Automated pool play, bracket generation, umpire assignment and real-time "
           "scoring for tournaments with hundreds of teams."),

    P("osteo-on-the-go", "Osteo On The Go", "Healthcare",
      tagline="Find the session, book the session, show up.",
      lead="A patient-facing dashboard for osteopathy sessions and events. It answers the "
           "only three questions a patient actually has: what is near me, when is it, and "
           "am I booked.",
      problem="Practitioners were running pop-up sessions and community events, and patients "
              "found out about them by word of mouth or not at all. Attendance was "
              "unpredictable in both directions: empty rooms one week, turn-aways the next.",
      shipped=["Nearby and upcoming event discovery",
               "Map view for sessions by location",
               "Booking and attendance tracking per patient",
               "Push notifications for reminders and new sessions in range"],
      today=["Patients see what is genuinely near them, not a national list",
             "Reminders cut no-shows without a receptionist making calls",
             "Practitioners can size a room against actual bookings",
             "Runs natively on iOS and Android"],
      chips=["Swift", "Kotlin", "PHP / Laravel", "Maps SDK"],
      images=[("11-osteo-on-the-go.jpg",
               "Osteo On The Go patient app showing nearby osteopathy sessions on a map")],
      ix={"type": "metrics", "label": "What the app removed",
          "title": "Three questions, answered without a phone call.",
          "items": [
              {"n": 3, "suffix": "", "l": "taps from open to booked", "p": 0.9},
              {"n": 0, "suffix": "", "l": "reminder calls made by staff", "p": 0.1},
              {"n": 2, "suffix": "", "l": "native platforms supported", "p": 0.7},
              {"n": 1, "suffix": " map", "l": "instead of a list of every city", "p": 0.8}]},
      card="Patient dashboard for osteopathy sessions and events: nearby and upcoming "
           "sessions, map view and reminder notifications."),

    P("zoey-global-nda", "Zoey (Global NDA)", "Legal Tech",
      tagline="Contracts you can sign, store and actually find again.",
      lead="An eSignature and contract management platform. Signing is the easy part. The "
           "product is really about what happens to the document afterwards: where it "
           "lives, what stage it is at, and how much risk is sitting inside it.",
      problem="Signed contracts were ending up as PDF attachments in individual inboxes. "
              "Nobody could answer which agreements were expiring, which contained "
              "non-standard clauses, or which had been signed by someone without authority.",
      shipped=["Template library so standard agreements stop being retyped",
               "eSignature flow with a verifiable audit trail",
               "A document vault with structured metadata instead of filenames",
               "Contract risk and stage tracking across the portfolio"],
      today=["Contract stage is a field, not a guess",
             "Risk flags surface non-standard clauses before signature, not after",
             "The vault is searchable across the whole portfolio",
             "Dashboard gives legal a portfolio view rather than a folder"],
      chips=["PHP / Laravel", "Vue.js", "MySQL", "AWS S3"],
      images=[("12-zoey-global-nda-a.jpg",
               "Zoey eSignature platform dashboard showing contract templates and status"),
              ("13-zoey-global-nda-b.jpg",
               "Zoey contract vault with risk and stage tracking columns")],
      ix={"type": "screens", "label": "Switch views",
          "title": "Sign it, then keep track of it.",
          "shots": [
              {"t": "Dashboard", "img": "12-zoey-global-nda-a.jpg",
               "alt": "Zoey contract management dashboard listing agreements by stage and owner",
               "cap": "Every agreement with a stage, an owner and a date. The view legal asks for first."},
              {"t": "Vault", "img": "13-zoey-global-nda-b.jpg",
               "alt": "Zoey document vault showing stored contracts with risk indicators",
               "cap": "Structured storage with risk indicators, so a non-standard clause is visible before renewal."}]},
      card="eSignature and contract management platform: templates, signing, a structured "
           "document vault, and contract risk and stage tracking."),

    P("beautyhooked", "BeautyHooked.com", "Beauty / Marketplace",
      tagline="The platform that helped close a $280,000 seed round.",
      lead="An online booking and e-commerce platform for salons and beauty products in "
           "Pakistan. We built the full technology stack, including the booking engine and "
           "the in-salon POS, which is the pairing that made the marketplace defensible.",
      problem="Salon booking marketplaces are easy to launch and easy to abandon, because "
              "the salon keeps running its day on paper and the marketplace becomes just "
              "another phone that rings. Without the salon's own operations inside the "
              "product, the inventory shown to consumers is fiction.",
      shipped=["Consumer booking across salons and services",
               "In-salon POS so availability reflects reality",
               "E-commerce for beauty product sales",
               "The complete platform build, front end through infrastructure"],
      today=["Helped the company secure $280,000 in seed funding",
             "Booking availability is driven by the same system the salon runs on",
             "Product sales and service bookings share one customer record",
             "Built on Laravel and Vue with native mobile alongside"],
      chips=["PHP / Laravel", "Vue.js", "MySQL", "POS"],
      images=[("16-beautyhooked.jpg",
               "BeautyHooked salon booking marketplace and beauty product storefront")],
      ix={"type": "metrics", "label": "The outcome",
          "title": "What the build was worth to the company.",
          "items": [
              {"n": 280, "suffix": "K", "l": "USD seed funding secured", "p": 1.0},
              {"n": 2, "suffix": "", "l": "revenue lines: bookings and product sales", "p": 0.7},
              {"n": 1, "suffix": " system", "l": "runs both the marketplace and the salon floor", "p": 0.9},
              {"n": 100, "suffix": "%", "l": "of the tech platform built by us", "p": 1.0}]},
      card="Online booking and e-commerce platform for salons and beauty products, including "
           "the in-salon POS. Helped the company secure $280,000 in seed funding."),

    P("paladin", "Paladin", "Marketplace / Fintech",
      tagline="Lend your drill to a stranger without losing your drill.",
      lead="A peer-to-peer product rental app. Anyone can list an item and anyone can borrow "
           "it, which means the product is mostly an exercise in making both sides feel safe: "
           "deposit protection, in-app chat, and payouts that actually arrive.",
      problem="Peer-to-peer rental dies on trust. The lender is worried about the item coming "
              "back damaged and the borrower is worried about losing a deposit to a bad-faith "
              "claim. Solve neither and nobody transacts twice.",
      shipped=["Listing and discovery for lendable items",
               "In-app chat between lender and borrower",
               "Deposit protection holding funds through the rental window",
               "IBAN payouts to lenders"],
      today=["Deposits are held by the platform rather than exchanged in cash",
             "Disputes have a conversation history attached to them",
             "Payouts run to IBAN across the supported markets",
             "Client called the project management the best work ethic they had seen from a dev team"],
      chips=["Swift", "Kotlin", "PHP / Laravel", "Payments"],
      images=[("17-paladin.jpg",
               "Paladin peer-to-peer rental app showing item listings and booking flow")],
      ix={"type": "flow", "label": "Click a stage",
          "title": "How trust gets engineered into a rental.",
          "steps": [
              {"k": "01", "t": "List", "d": "The lender posts the item, the daily rate and the deposit. Photos at listing time become the reference condition."},
              {"k": "02", "t": "Book", "d": "The borrower requests dates. Chat opens between the two parties before any money moves."},
              {"k": "03", "t": "Hold", "d": "The deposit is captured and held by the platform for the rental window. Neither party is holding the other's cash."},
              {"k": "04", "t": "Return", "d": "Condition is checked against the listing photos. A dispute has evidence and a chat history behind it."},
              {"k": "05", "t": "Payout", "d": "Rental income settles to the lender's IBAN and the deposit releases back to the borrower."}]},
      card="Peer-to-peer product rental app: lend and borrow items with in-app chat, "
           "deposit protection and IBAN payouts."),

    P("gh-marriage-app", "GH", "Social / Dating",
      tagline="A marriage app where the paywall is the product decision.",
      lead="A matchmaking app built around intent rather than volume. Profiles are detailed, "
           "matching is deliberate, and payment plans gate the parts of the experience that "
           "only serious users need.",
      problem="Swipe-first dating mechanics select for browsing, not commitment. An app aimed "
              "at marriage has the opposite requirement: fewer, better-qualified conversations, "
              "and a way to filter out people who are not actually looking.",
      shipped=["Detailed profile construction with intent signals",
               "Matching logic weighted toward compatibility, not proximity alone",
               "Tiered payment plans gating high-intent features",
               "Native mobile experience on both platforms"],
      today=["Paid tiers act as the primary seriousness filter",
             "Profile depth is a requirement rather than an optional extra",
             "Matching favors fewer and better over more and faster",
             "Runs on iOS and Android"],
      chips=["Swift", "Kotlin", "PHP / Laravel", "In-app purchase"],
      images=[("18-gh-marriage-app.jpg",
               "GH marriage app showing profile, matching and subscription plan screens")],
      ix={"type": "metrics", "label": "Design tradeoffs",
          "title": "Optimized for the opposite of engagement.",
          "items": [
              {"n": 3, "suffix": "", "l": "payment tiers gating high-intent features", "p": 0.6},
              {"n": 2, "suffix": "", "l": "native platforms", "p": 0.7},
              {"n": 1, "suffix": " goal", "l": "marriage, not time-on-app", "p": 1.0},
              {"n": 0, "suffix": "", "l": "infinite-swipe mechanics", "p": 0.1}]},
      card="A marriage app built for intent over volume: detailed profiles, deliberate "
           "matching and tiered payment plans."),

    P("harvard-orthodontic-center", "Harvard Orthodontic Center", "Healthcare",
      tagline="Patients stop calling to ask if the braces appointment moved.",
      lead="A patient mobile app for an orthodontic practice. Appointment status, "
           "notifications and reminders, delivered to the patient's phone instead of "
           "through the front desk.",
      problem="Orthodontic treatment runs for years across dozens of short appointments, "
              "mostly for teenagers whose parents are doing the scheduling. The front desk "
              "was absorbing a constant stream of calls that were all variations of one "
              "question: when am I next in.",
      shipped=["Appointment status visible to the patient at any time",
               "Push reminders ahead of each appointment",
               "Notifications for schedule changes and practice updates",
               "A patient view that works for the parent doing the driving"],
      today=["Routine scheduling questions no longer reach the front desk",
             "Reminders reduce missed chair time, which is the practice's real inventory",
             "Schedule changes reach the patient the moment they happen",
             "Available on iOS and Android"],
      chips=["Swift", "Kotlin", "Push notifications", "REST API"],
      images=[("19-harvard-orthodontic-center.jpg",
               "Harvard Orthodontic Center patient app showing appointment status and reminders")],
      ix={"type": "metrics", "label": "Where the time went back",
          "title": "The front desk gets its afternoon back.",
          "items": [
              {"n": 24, "suffix": "/7", "l": "appointment status without calling", "p": 1.0},
              {"n": 2, "suffix": "", "l": "reminder touchpoints per appointment", "p": 0.6},
              {"n": 0, "suffix": "", "l": "phone calls to confirm a time", "p": 0.1},
              {"n": 2, "suffix": "", "l": "native platforms", "p": 0.7}]},
      card="Patient mobile app for an orthodontic practice: appointment status, "
           "notifications and reminders that keep routine questions off the front desk."),

    P("nanny", "Nanny", "Childcare / Marketplace",
      tagline="Verified childcare, filtered down to your neighborhood.",
      lead="A daycare and childcare-finder app for the Hong Kong market. Classified service "
           "areas, real-time availability and license verification, because in childcare the "
           "listing being accurate is not a nice-to-have.",
      problem="Childcare search in a dense city is a proximity problem and a trust problem "
              "at the same time. Parents were calling down a list of centers to ask about "
              "spaces, and had no reliable way to confirm a provider's license was current.",
      shipped=["Classified service areas so results are genuinely local",
               "Real-time availability from providers rather than static listings",
               "License verification surfaced on every provider profile",
               "Search and inquiry flows built for a parent on a phone"],
      today=["Availability reflects what providers are actually holding open",
             "License status is checked in the product, not assumed by the parent",
             "Service areas match how the city is actually navigated",
             "Built for the Hong Kong market and its density"],
      chips=["Swift", "Kotlin", "PHP / Laravel", "Geolocation"],
      images=[("20-nanny.jpg",
               "Nanny childcare finder app showing local providers, availability and license verification")],
      ix={"type": "flow", "label": "Click a stage",
          "title": "From a search to a verified provider.",
          "steps": [
              {"k": "01", "t": "Locate", "d": "Search is scoped to classified service areas, so a result twenty minutes away does not outrank one on the next street."},
              {"k": "02", "t": "Filter", "d": "Age band, hours and care type narrow the list before availability is even considered."},
              {"k": "03", "t": "Availability", "d": "Providers publish real-time openings. A listed space is a space, not a maybe."},
              {"k": "04", "t": "Verify", "d": "License status is shown on the profile. Parents are not left cross-referencing a government register themselves."},
              {"k": "05", "t": "Inquire", "d": "Contact and inquiry happen in-app with the provider's real availability attached to the request."}]},
      card="Daycare and childcare-finder app for Hong Kong: classified service areas, "
           "real-time availability and provider license verification."),

    P("e-store-mobile-app", "E-Store Mobile App", "E-commerce",
      tagline="The commerce skeleton we stop rebuilding from scratch.",
      lead="A general e-commerce mobile app foundation covering catalog, cart, checkout and "
           "order history. It exists so that a client with a retail idea does not pay us to "
           "rewrite the boring 60% of a shopping app before we get to the part that makes "
           "their business different.",
      problem="Every mobile storefront needs the same core: browse, cart, pay, track. "
              "Rebuilding it per project burns budget on solved problems and introduces new "
              "bugs into code that was already working somewhere else.",
      shipped=["Catalog browsing with categories and search",
               "Cart and checkout flows",
               "Order history and status tracking",
               "A structure designed to be re-skinned and extended per client"],
      today=["Used as the starting point for retail mobile engagements",
             "The differentiating features get the budget, not the plumbing",
             "Payment and order primitives are already proven",
             "Ships on iOS and Android"],
      chips=["React Native", "REST API", "Payments"],
      images=[("21-e-store-mobile-app.jpg",
               "E-Store mobile app template showing product catalog, cart and checkout screens")],
      ix={"type": "metrics", "label": "Why it exists",
          "title": "Budget spent on the part that is actually yours.",
          "items": [
              {"n": 4, "suffix": "", "l": "core flows ready on day one", "p": 0.8},
              {"n": 2, "suffix": "", "l": "platforms from one codebase", "p": 0.7},
              {"n": 60, "suffix": "%", "l": "of a typical storefront already solved", "p": 0.6},
              {"n": 0, "suffix": "", "l": "reasons to rewrite a cart again", "p": 0.1}]},
      card="A general e-commerce mobile app foundation: catalog, cart, checkout and order "
           "tracking, built to be extended per client."),

    P("yofit", "YoFit", "Fitness",
      tagline="One membership, every gym on the map.",
      lead="A gym discovery and booking app with a companion website. Users find gyms near "
           "them, book classes and carry a digital membership card instead of a plastic one.",
      problem="Casual gym-goers do not want a twelve-month contract with one location, and "
              "gyms with off-peak capacity have nothing to sell it to. The two sides could "
              "not find each other because there was no shared booking layer.",
      shipped=["Map-based gym discovery",
               "Class booking against real gym schedules",
               "A digital membership card for check-in",
               "A companion marketing and signup website"],
      today=["Off-peak capacity becomes bookable inventory",
             "Members check in with a phone rather than a card",
             "Discovery is map-first because location decides most gym choices",
             "App and website share the same booking back end"],
      chips=["Swift", "Kotlin", "PHP / Laravel", "Maps SDK"],
      images=[("22-yofit-app.jpg",
               "YoFit gym discovery app showing map view, class booking and digital membership card"),
              ("43-yofit-website.jpg",
               "YoFit companion website homepage with gym signup and class listings")],
      ix={"type": "screens", "label": "Switch views",
          "title": "App and site, one booking engine.",
          "shots": [
              {"t": "Mobile app", "img": "22-yofit-app.jpg",
               "alt": "YoFit mobile app screens showing gym map, class booking and membership card",
               "cap": "Map-first discovery, class booking, and a membership card that lives on the phone."},
              {"t": "Website", "img": "43-yofit-website.jpg",
               "alt": "YoFit website homepage showing gym listings and membership signup",
               "cap": "The acquisition surface: signup, gym listings and the pitch to gyms with empty off-peak slots."}]},
      card="Gym discovery and booking app with a companion website: map view, class booking "
           "and a digital membership card."),

    P("ljzer", "LJZER", "Social Networking",
      tagline="A professional network for the Wall Street of Shanghai.",
      lead="A news and business networking app for the Lujiazui financial district. It "
           "combines a curated news feed with meetups, topics and polls, aimed at people who "
           "work within a few blocks of each other.",
      problem="Generic professional networks are too broad to be useful inside a single "
              "financial district. The valuable connection is with the person in the next "
              "tower this week, and no global platform surfaces that.",
      shipped=["Curated financial news feed",
               "Meetup creation and discovery scoped to the district",
               "Topics and polls for professional discussion",
               "Profiles built around firm, role and specialty"],
      today=["Networking is scoped tight enough to produce actual meetings",
             "News and networking sit in one app rather than two habits",
             "Polls give the community a fast read on sentiment",
             "Built for the Chinese market and its platform conventions"],
      chips=["Swift", "Kotlin", "Node.js", "MongoDB"],
      images=[("23-ljzer.jpg",
               "LJZER business networking app showing news feed, meetups and discussion topics")],
      ix={"type": "metrics", "label": "The scoping bet",
          "title": "Small radius, higher signal.",
          "items": [
              {"n": 1, "suffix": " district", "l": "instead of a global network", "p": 0.9},
              {"n": 3, "suffix": "", "l": "surfaces: news, meetups, discussion", "p": 0.7},
              {"n": 2, "suffix": "", "l": "native platforms", "p": 0.7},
              {"n": 0, "suffix": "", "l": "recruiter spam by design", "p": 0.1}]},
      card="News and business networking app for Shanghai's Lujiazui financial district: "
           "curated news, meetups, topics and polls."),

    P("charity", "Charity", "Nonprofit",
      tagline="Giving that takes fewer taps than doubting.",
      lead="A charity and donation app for the Chinese market. Campaigns, giving categories "
           "and donation forms designed so that the gap between deciding to give and having "
           "given is as short as possible.",
      problem="Donation drop-off is brutal and almost all of it happens in the form. Every "
              "extra field between intent and payment costs a percentage of the people who "
              "already decided to donate.",
      shipped=["Campaign pages with progress and context",
               "Giving categories so donors can direct where money goes",
               "Short donation forms tuned for mobile completion",
               "Donation history and receipts for the donor"],
      today=["The path from campaign to completed gift is deliberately short",
             "Donors can target a category rather than a general fund",
             "Receipts and history are available in-app",
             "Built for Chinese-market payment conventions"],
      chips=["Swift", "Kotlin", "PHP / Laravel", "Payments"],
      images=[("24-charity.jpg",
               "Charity donation app showing campaigns, giving categories and donation form")],
      ix={"type": "metrics", "label": "Form design",
          "title": "Every field is a person who left.",
          "items": [
              {"n": 3, "suffix": "", "l": "taps from campaign to confirmed gift", "p": 0.9},
              {"n": 1, "suffix": " screen", "l": "for the donation form", "p": 0.85},
              {"n": 100, "suffix": "%", "l": "of gifts receipted in-app", "p": 1.0},
              {"n": 0, "suffix": "", "l": "account creation required to give", "p": 0.1}]},
      card="Charity and donation app for the Chinese market: campaigns, giving categories "
           "and donation forms tuned for mobile completion."),

    P("coca-cola-internal-messaging", "Coca-Cola Internal Messaging Platform",
      "Enterprise Internal Tools",
      tagline="Feedback that reaches the right level of a very large org chart.",
      lead="An internal messaging, feedback and hierarchy application built for Coca-Cola. "
           "The interesting constraint was not chat. It was routing a message correctly "
           "through a reporting structure that spans thousands of people.",
      problem="In an organization that size, a message with no route is a message that dies. "
              "Feedback either went nowhere or went to everyone, and neither outcome produced "
              "a response.",
      shipped=["Messaging built on top of the real reporting hierarchy",
               "Structured feedback channels with defined routing",
               "Org hierarchy browsing and lookup",
               "Enterprise-grade access control per level"],
      today=["Feedback lands with the person who can act on it",
             "The hierarchy is data in the product, not tribal knowledge",
             "One of several systems we have built for Coca-Cola",
             "Deployed as an internal enterprise tool"],
      chips=["Enterprise mobility", "PHP", "MySQL", "SSO"],
      images=[("25-coca-cola-internal-messaging.jpg",
               "Coca-Cola internal messaging and org hierarchy application interface")],
      ix={"type": "stack", "label": "Hover a layer",
          "title": "Routing a message through an org chart.",
          "layers": [
              {"t": "Identity", "d": "Every user resolves to a real position in the reporting structure before they can send anything.", "tags": ["SSO", "Directory"]},
              {"t": "Hierarchy", "d": "The org chart is queryable data, so routing rules can be written against it instead of hardcoded.", "tags": ["Graph", "MySQL"]},
              {"t": "Routing", "d": "Feedback goes up, across or to a defined channel. Nothing broadcasts to everyone by accident.", "tags": ["Rules", "Channels"]},
              {"t": "Delivery", "d": "Messages arrive with context: who sent it, from where in the org, and what they expect back.", "tags": ["Notifications", "Mobile"]}]},
      card="Internal messaging, feedback and org-hierarchy application built for Coca-Cola, "
           "with routing that works across a very large reporting structure."),

    P("thyfi", "ThyFi", "Food Delivery",
      tagline="Reorder in two taps, because most orders are repeat orders.",
      lead="A food ordering app built around the observation that most people order the same "
           "handful of things. Categories and discovery matter, but favorites and order "
           "history are what actually get used.",
      problem="Food ordering apps optimize hard for first-time discovery and then make the "
              "twentieth order take just as long as the first. That is backwards: the repeat "
              "order is the whole business.",
      shipped=["Category browsing and restaurant discovery",
               "Favorites for the items people actually reorder",
               "Order history with fast reorder",
               "Profile, addresses and payment preferences"],
      today=["Reorder is the shortest path in the app, not the longest",
             "Favorites carry across sessions and devices",
             "Discovery is still there for the times it matters",
             "Native on iOS and Android"],
      chips=["Swift", "Kotlin", "Node.js", "Payments"],
      images=[("26-thyfi.jpg",
               "ThyFi food ordering app showing categories, favorites and order history")],
      ix={"type": "metrics", "label": "Design priority",
          "title": "Optimized for order twenty, not order one.",
          "items": [
              {"n": 2, "suffix": "", "l": "taps to reorder a favorite", "p": 0.9},
              {"n": 4, "suffix": "", "l": "primary surfaces in the app", "p": 0.6},
              {"n": 2, "suffix": "", "l": "native platforms", "p": 0.7},
              {"n": 1, "suffix": " list", "l": "that most users live in: favorites", "p": 0.8}]},
      card="Food ordering app built around repeat orders: category browsing, favorites, "
           "order history and fast reorder."),

    P("expense-tracker", "Expense Tracker", "Fintech",
      tagline="Personal finance that shows you the shape of the month.",
      lead="A personal finance tracking app. Categorized expenses and charts, built on the "
           "principle that people do not want a ledger, they want to know where the money "
           "went without doing the arithmetic.",
      problem="Most expense apps either demand bank connections users are not comfortable "
              "giving, or dump a raw transaction list that requires the user to do the "
              "analysis themselves. Neither survives past week two.",
      shipped=["Fast manual expense entry with smart category defaults",
               "Category breakdowns rendered as charts, not tables",
               "Period comparison so a bad month is visibly a bad month",
               "Local-first data handling"],
      today=["The insight is the default view, not a report you have to build",
             "Entry is fast enough to survive daily use",
             "No mandatory bank linking to get value on day one",
             "Runs natively on mobile"],
      chips=["Swift", "Kotlin", "SQLite", "Charts"],
      images=[("27-expense-tracker.jpg",
               "Expense Tracker app showing categorized spending and monthly charts")],
      ix={"type": "metrics", "label": "Retention math",
          "title": "The apps people keep are the fast ones.",
          "items": [
              {"n": 5, "suffix": "s", "l": "to log an expense", "p": 0.9},
              {"n": 0, "suffix": "", "l": "bank credentials required", "p": 0.1},
              {"n": 1, "suffix": " screen", "l": "shows the whole month", "p": 0.85},
              {"n": 2, "suffix": "", "l": "native platforms", "p": 0.7}]},
      card="Personal finance tracking app: fast expense entry, category breakdowns and "
           "charts that show where the month went."),

    P("app-blocker", "App Blocker", "Productivity",
      tagline="Willpower, outsourced to a PIN you gave to someone else.",
      lead="An app and time-blocking productivity tool. Schedules define when specific apps "
           "are unavailable, and a PIN lock makes the block cost something to undo.",
      problem="Self-imposed limits fail the moment they are one tap away from being disabled. "
              "A blocker that the distracted version of you can switch off in two seconds is "
              "not a blocker, it is a suggestion.",
      shipped=["Per-app blocking schedules",
               "Recurring rules for work hours, study blocks and sleep",
               "PIN lock so disabling a block is a deliberate act",
               "Usage visibility so the schedule is based on real data"],
      today=["Blocks are scheduled rather than toggled in the moment",
             "The PIN raises the cost of quitting a block just enough",
             "Usage data informs where the schedule should be tightened",
             "Built natively for platform-level app control"],
      chips=["Kotlin", "Swift", "Screen Time API", "Local storage"],
      images=[("28-app-blocker.jpg",
               "App Blocker productivity app showing blocking schedules and PIN lock screen")],
      ix={"type": "metrics", "label": "The mechanism",
          "title": "Friction placed exactly where it helps.",
          "items": [
              {"n": 1, "suffix": " PIN", "l": "between an impulse and a disabled block", "p": 0.85},
              {"n": 7, "suffix": "", "l": "day recurring schedules", "p": 0.7},
              {"n": 0, "suffix": "", "l": "one-tap disable paths", "p": 0.1},
              {"n": 2, "suffix": "", "l": "native platforms", "p": 0.7}]},
      card="App and time-blocking productivity tool: per-app schedules, recurring rules and "
           "a PIN lock that makes disabling a block deliberate."),

    P("autotash", "Autotash", "Marketplace (Automotive)",
      tagline="One part request, every supplier in the kingdom bidding.",
      lead="A spare-parts marketplace for the Saudi automotive industry. A buyer describes "
           "the part once and suppliers come back with quotes, which inverts a process that "
           "traditionally means calling twelve shops in sequence.",
      problem="Sourcing a specific automotive part meant phoning suppliers one at a time, "
              "describing the same vehicle and part repeatedly, and having no way to compare "
              "prices except memory. Suppliers, meanwhile, only heard about demand they "
              "happened to be phoned about.",
      shipped=["Structured part requests by vehicle, year and component",
               "Broadcast of a single request to matching suppliers",
               "Quote comparison side by side for the buyer",
               "Supplier dashboard for inbound requests and quote management"],
      today=["One request reaches every relevant supplier at once",
             "Buyers compare quotes instead of remembering them",
             "Suppliers see demand they would never have been called about",
             "Built for the KSA automotive market"],
      chips=["PHP / Laravel", "Vue.js", "Swift", "Kotlin"],
      images=[("29-autotash.jpg",
               "Autotash automotive spare parts marketplace showing quote requests from suppliers")],
      ix={"type": "flow", "label": "Click a stage",
          "title": "Twelve phone calls, collapsed into one request.",
          "steps": [
              {"k": "01", "t": "Describe", "d": "Vehicle, year and component are captured as structured fields, so suppliers are all quoting the same thing."},
              {"k": "02", "t": "Broadcast", "d": "The request goes out to every supplier who stocks that category, not just the ones the buyer knows to call."},
              {"k": "03", "t": "Quote", "d": "Suppliers respond with price and availability from their dashboard. Competing quotes arrive in parallel."},
              {"k": "04", "t": "Compare", "d": "The buyer sees quotes side by side, with supplier history attached. Price is not the only visible variable."},
              {"k": "05", "t": "Order", "d": "The buyer accepts a quote and the supplier gets a confirmed order rather than a maybe."}]},
      card="Spare-parts marketplace for the KSA automotive industry: one structured request "
           "goes out to every matching supplier and quotes come back for comparison."),

    P("our-footprints", "Our Footprints", "Social / Travel",
      tagline="A travel feed that is a map first and a feed second.",
      lead="A social travel and photo-sharing app organized around place rather than time. "
           "Your history is a map you have colored in, which is a more honest representation "
           "of travel than a reverse-chronological scroll.",
      problem="Travel photos posted to a general social feed are gone in a day and "
              "impossible to revisit by place. The natural index for travel is geography, and "
              "no mainstream feed uses it.",
      shipped=["Geotagged photo sharing",
               "A personal map that fills in as places are visited",
               "Following and discovery based on places rather than only people",
               "Trip grouping so a journey reads as one thing"],
      today=["Place is the primary index, not date",
             "Old trips remain findable years later",
             "Discovery surfaces people who have been where you are going",
             "Native mobile on both platforms"],
      chips=["Swift", "Kotlin", "Node.js", "Maps SDK"],
      images=[("30-our-footprints.jpg",
               "Our Footprints social travel app showing a personal map of visited places and shared photos")],
      ix={"type": "metrics", "label": "The reframe",
          "title": "Indexed by place, not by date.",
          "items": [
              {"n": 1, "suffix": " map", "l": "as the primary interface", "p": 0.9},
              {"n": 2, "suffix": "", "l": "discovery axes: people and places", "p": 0.7},
              {"n": 100, "suffix": "%", "l": "of posts geotagged", "p": 1.0},
              {"n": 0, "suffix": "", "l": "content lost to the scroll", "p": 0.15}]},
      card="Social travel and photo-sharing app organized around place: geotagged posts and "
           "a personal map that fills in as you travel."),

    P("rheumatak", "RheumaTak", "Healthcare",
      tagline="Arthritis management that survives a bad-hands day.",
      lead="An app for arthritis patients to manage medication schedules and track disease "
           "activity. The interface constraint is unusual and non-negotiable: it has to be "
           "usable by someone whose hands hurt.",
      problem="Rheumatology depends on what happened between appointments, and patients are "
              "expected to recall months of symptom fluctuation from memory. Paper diaries "
              "get abandoned, and typing-heavy apps get abandoned faster by exactly the "
              "population that needs them.",
      shipped=["Medication schedules with adherence reminders",
               "Disease activity tracking with low-effort input",
               "Trend views a clinician can read in a consultation",
               "Large targets and minimal typing throughout"],
      today=["Patients arrive at appointments with data instead of recollection",
             "Adherence reminders are scheduled around the regimen, not generic",
             "Input effort was treated as a clinical requirement",
             "Native mobile on iOS and Android"],
      chips=["Swift", "Kotlin", "PHP / Laravel", "Notifications"],
      images=[("31-rheumatak.jpg",
               "RheumaTak arthritis app showing medication schedule and disease activity tracking")],
      ix={"type": "metrics", "label": "Accessibility as spec",
          "title": "Designed for the hands that will use it.",
          "items": [
              {"n": 1, "suffix": " tap", "l": "to log a dose", "p": 0.9},
              {"n": 0, "suffix": "", "l": "free-text fields required daily", "p": 0.1},
              {"n": 12, "suffix": " mo", "l": "of trend data at the consultation", "p": 0.8},
              {"n": 2, "suffix": "", "l": "native platforms", "p": 0.7}]},
      card="App for arthritis patients to manage medication schedules and track disease "
           "activity, designed for low-effort daily input."),

    P("dainifei", "Dainifei", "Travel",
      tagline="Plan the trip and book it without switching apps.",
      lead="A travel planning and booking app for the Chinese market. Itinerary building and "
           "transaction live in the same place, so a plan does not have to be rebuilt in a "
           "booking engine afterwards.",
      problem="Travelers plan in one tool and book in another, then spend the trip "
              "reconciling the two. Every handoff between planning and booking is a place "
              "where the itinerary and the reservations drift apart.",
      shipped=["Itinerary building by day and destination",
               "Booking flows connected to the itinerary",
               "Saved trips and templates for repeat routes",
               "Localized for Chinese-market travel conventions"],
      today=["The itinerary and the bookings are the same object",
             "Changes to a booking update the plan automatically",
             "Repeat routes start from a saved template",
             "Native mobile experience"],
      chips=["Swift", "Kotlin", "Node.js", "Payments"],
      images=[("32-dainifei.jpg",
               "Dainifei travel planning app showing itinerary building and booking screens")],
      ix={"type": "metrics", "label": "The consolidation",
          "title": "One object instead of two that drift.",
          "items": [
              {"n": 1, "suffix": " record", "l": "for the plan and the bookings", "p": 0.9},
              {"n": 0, "suffix": "", "l": "app switches between planning and paying", "p": 0.1},
              {"n": 2, "suffix": "", "l": "native platforms", "p": 0.7},
              {"n": 100, "suffix": "%", "l": "of changes reflected in the itinerary", "p": 1.0}]},
      card="Travel planning and booking app for the Chinese market, where the itinerary and "
           "the reservations are the same record."),

    P("appetite", "App'etite", "Food / Social Good",
      tagline="Order dinner, fund a meal for someone else.",
      lead="A food app that attaches a charitable contribution to the ordering experience. "
           "The pitch is simple: eat great food while contributing to causes, without "
           "turning the checkout into a guilt trip.",
      problem="Cause-linked commerce usually fails in one of two ways. Either the charity "
              "element is buried where nobody sees it, or it is so prominent that ordering "
              "food feels like a fundraising appeal.",
      shipped=["Standard food ordering and discovery flows",
               "Contribution attached to the order, visible but not intrusive",
               "Cause selection so the user directs the impact",
               "Cumulative impact tracking per user"],
      today=["The charitable element is present at checkout without hijacking it",
             "Users can see their cumulative contribution over time",
             "Restaurants participate without changing their own operations",
             "Native mobile app"],
      chips=["Swift", "Kotlin", "PHP / Laravel", "Payments"],
      images=[("33-appetite.jpg",
               "App'etite food ordering app pairing meal orders with charitable contributions")],
      ix={"type": "metrics", "label": "The balance",
          "title": "Visible, not intrusive.",
          "items": [
              {"n": 1, "suffix": " line", "l": "at checkout for the contribution", "p": 0.8},
              {"n": 0, "suffix": "", "l": "extra steps added to ordering", "p": 0.1},
              {"n": 100, "suffix": "%", "l": "of impact tracked per user", "p": 1.0},
              {"n": 2, "suffix": "", "l": "native platforms", "p": 0.7}]},
      card="Food ordering app that pairs each order with a charitable contribution, with "
           "cause selection and cumulative impact tracking."),

    P("foodies-express", "Foodies Express", "Food Delivery",
      tagline="Taiwan's food ordering platform, built by a team eight time zones away.",
      lead="A food ordering platform for the Taiwanese market, built as an extension of the "
           "client's own operation rather than as an outsourced black box.",
      problem="The client needed development capacity that could plug into an existing "
              "operation without disrupting it. The usual failure mode with an external team "
              "is that integration cost eats whatever the capacity was worth.",
      shipped=["Consumer food ordering experience for the Taiwan market",
               "Restaurant-side order management",
               "Delivery and order status tracking",
               "Integration into the client's existing operational workflow"],
      today=["The CEO's own words: we found a way to complement their operations without "
             "causing discontinuities on their side",
             "Running as Taiwan's food ordering platform",
             "The engagement model became a template for later client work",
             "Web and mobile surfaces sharing one back end"],
      chips=["PHP / Laravel", "Vue.js", "Swift", "Kotlin"],
      images=[("34-foodies-express.jpg",
               "Foodies Express food ordering platform screens for the Taiwan market")],
      ix={"type": "transcript", "label": "Play the reference",
          "title": "What the client actually said.",
          "turns": [
              {"who": "system", "text": "Client reference: Brian Liu, CEO, Foodies Express"},
              {"who": "caller", "text": "We were nervous about bringing in an outside team mid-operation."},
              {"who": "agent", "text": "We are very satisfied and happy to have found Alpha Squared as our development partner."},
              {"who": "caller", "text": "What made it work?"},
              {"who": "agent", "text": "They found a way to successfully complement our operations without causing any discontinuities on our side."},
              {"who": "system", "text": "Engagement continued past the original scope."}]},
      card="Taiwan's food ordering platform, built as an extension of the client's existing "
           "operation. The CEO's summary: no discontinuities on their side."),

    P("eat-play-shop-malaysia", "Eat Play Shop Malaysia", "Travel / Tourism",
      tagline="A tourism site that measures which content actually moves people.",
      lead="A responsive tourism site with a custom CMS back end and deep social media "
           "integration and analytics. The editorial team publishes constantly, so the "
           "product had to make publishing fast and results visible.",
      problem="Tourism marketing produces a lot of content and very little evidence about "
              "which of it works. The team was publishing to the site and to social channels "
              "separately, with no shared view of what either one did.",
      shipped=["Responsive tourism site across destinations and categories",
               "A custom CMS shaped around the editorial team's actual workflow",
               "Deep social media integration for cross-posting",
               "Analytics tying content to engagement"],
      today=["Publishing to site and social happens in one pass",
             "Editors can see which content earns attention",
             "The CMS was built to their workflow, not a generic admin",
             "Fully responsive for the mobile-heavy travel audience"],
      chips=["PHP", "Custom CMS", "MySQL", "Social APIs"],
      images=[("35-eat-play-shop-malaysia.jpg",
               "Eat Play Shop Malaysia tourism website homepage with destination content")],
      ix={"type": "metrics", "label": "Editorial leverage",
          "title": "Publish once, measure everywhere.",
          "items": [
              {"n": 1, "suffix": " pass", "l": "to publish to site and social", "p": 0.9},
              {"n": 3, "suffix": "", "l": "content surfaces from one CMS", "p": 0.7},
              {"n": 100, "suffix": "%", "l": "responsive coverage", "p": 1.0},
              {"n": 0, "suffix": "", "l": "generic admin panels involved", "p": 0.1}]},
      card="Responsive tourism site with a custom CMS back end, deep social media "
           "integration and analytics tying content to engagement."),

    P("rahbar-forklift-training", "Rahbar", "Training / Simulation",
      tagline="3D forklift training for Coca-Cola, where mistakes cost nothing.",
      lead="A 3D forklift training and simulation environment built for Coca-Cola. Operators "
           "learn the equipment and the hazards in a simulation before they touch a real "
           "machine in a real warehouse.",
      problem="Forklift training on live equipment is expensive, occupies working warehouse "
              "space, and puts a trainee near the exact hazards the training exists to "
              "prevent. Repetition is where competence comes from, and repetition on real "
              "equipment is the costliest kind.",
      shipped=["A 3D warehouse environment with realistic forklift handling",
               "Scenario-based training including hazard situations",
               "Repeatable practice without equipment or floor time",
               "Assessment of operator performance in simulation"],
      today=["Built for Coca-Cola alongside our other work for them",
             "Trainees repeat the dangerous scenarios safely",
             "No warehouse downtime for training sessions",
             "One of several enterprise systems we run for the same client"],
      chips=["Unity", "3D simulation", "C#", "Enterprise"],
      images=[("36-rahbar-forklift-training.jpg",
               "Rahbar 3D forklift training simulation environment built for Coca-Cola")],
      ix={"type": "flow", "label": "Click a stage",
          "title": "Competence before contact with the machine.",
          "steps": [
              {"k": "01", "t": "Orientation", "d": "Controls and handling characteristics, learned in an environment where a mistake is a reset button."},
              {"k": "02", "t": "Load handling", "d": "Pallet pickup, stacking and balance, repeated as many times as it takes."},
              {"k": "03", "t": "Hazards", "d": "Pedestrians, blind corners and unstable loads: the scenarios you cannot ethically stage in a working warehouse."},
              {"k": "04", "t": "Assessment", "d": "Performance is scored in simulation, so the first time on real equipment is not the first assessment."}]},
      card="3D forklift training and simulation built for Coca-Cola: scenario-based practice "
           "including hazards, with no warehouse downtime."),

    P("tooli-tv", "Tooli.tv", "IPTV / Streaming",
      tagline="1,750 channels that have to start playing in under two seconds.",
      lead="An IPTV application carrying more than 1,750 channels plus movies, series and "
           "live sports across multiple languages. At that catalog size, navigation and "
           "startup latency are the product.",
      problem="A 1,750-channel catalog is unusable if finding something takes longer than "
              "watching it, and live sports is unforgiving about buffering. Both problems get "
              "worse as the catalog grows, which is the direction it always grows.",
      shipped=["Channel, movie and series catalog with multi-language support",
               "Navigation designed for a very large channel count",
               "Live sports delivery with low startup latency",
               "Multi-device playback"],
      today=["1,750+ channels available in the app",
             "Movies, series and live sports in one catalog",
             "Multi-language throughout",
             "Built on our IPTV solutions practice"],
      chips=["IPTV", "Streaming", "Node.js", "Mobile"],
      images=[("37-tooli-tv.jpg",
               "Tooli.tv IPTV application showing channel guide, movies and live sports")],
      ix={"type": "metrics", "label": "Catalog scale",
          "title": "The numbers that shaped the build.",
          "items": [
              {"n": 1750, "suffix": "+", "l": "live channels", "p": 1.0},
              {"n": 4, "suffix": "", "l": "content types in one catalog", "p": 0.7},
              {"n": 2, "suffix": "s", "l": "target channel start time", "p": 0.85},
              {"n": 5, "suffix": "+", "l": "languages supported", "p": 0.6}]},
      card="IPTV application with 1,750+ channels plus movies, series and live sports, "
           "multi-language, built for navigation at catalog scale."),

    P("room-manager", "Room Manager", "Enterprise Internal Tools",
      tagline="The panel on the wall that ends the meeting-room argument.",
      lead="A touch-screen meeting room booking system that integrates with the mail servers "
           "an organization already runs. The screen outside the room is the source of truth, "
           "because that is where the dispute actually happens.",
      problem="Room bookings lived in calendar invites nobody could see from the hallway. "
              "Rooms were double-booked, held by meetings that had been cancelled, or empty "
              "while three people looked for somewhere to sit.",
      shipped=["Touch-screen panel for at-the-door booking and release",
               "Two-way integration with existing mail and calendar servers",
               "Instant visibility of room status from outside the room",
               "Automatic release of unclaimed bookings"],
      today=["Booked-but-empty rooms get released instead of wasted",
             "The panel and the calendar never disagree",
             "Built for Coca-Cola as part of our enterprise internal tooling work",
             "No new calendar system for staff to adopt"],
      chips=["Enterprise", "Exchange integration", ".NET", "Touch UI"],
      images=[("38-room-manager.jpg",
               "Room Manager touch-screen meeting room booking panel mounted outside a conference room")],
      ix={"type": "flow", "label": "Click a stage",
          "title": "How a room stops being double-booked.",
          "steps": [
              {"k": "01", "t": "Sync", "d": "The panel reads directly from the existing mail server. There is no second calendar for staff to keep updated."},
              {"k": "02", "t": "Display", "d": "Status is visible from the hallway: free, booked, or booked and not yet claimed."},
              {"k": "03", "t": "Claim", "d": "The meeting is confirmed at the door. An unclaimed booking is a signal, not a permanent hold."},
              {"k": "04", "t": "Release", "d": "Unclaimed rooms release automatically and become bookable by whoever is standing in front of them."}]},
      card="Touch-screen meeting room booking system integrating with existing mail servers, "
           "with at-the-door claiming and automatic release of unclaimed rooms."),

    P("repairbeat-erp", "RepairBeat (ERP System)", "SaaS / ERP",
      tagline="The ERP generation that taught us what repair shops actually track.",
      lead="The earlier ERP and POS build for repair shops: dashboard, inventory, point of "
           "sale and sales analytics. It is the direct ancestor of the current Repair Beat "
           "SaaS product, and the reason that product knew what to build.",
      problem="Repair businesses sit awkwardly between retail and service. Off-the-shelf ERP "
              "handles parts as inventory but has no concept of a repair job, and service "
              "software tracks jobs but not the stock those jobs consume.",
      shipped=["Operations dashboard for daily shop performance",
               "Inventory management for parts and devices",
               "Point of sale integrated with the job record",
               "Sales analytics by product, service and period"],
      today=["Superseded by the multi-tenant Repair Beat SaaS platform",
             "The data model it proved still underpins the current product",
             "Inventory and job tracking were unified here first",
             "Built on Laravel and Vue"],
      chips=["PHP / Laravel", "Vue.js", "MySQL", "POS"],
      images=[("41-repairbeat-erp.jpg",
               "RepairBeat ERP system showing dashboard, inventory and sales analytics")],
      ix={"type": "stack", "label": "Hover a layer",
          "title": "Where retail ERP and service software meet.",
          "layers": [
              {"t": "Inventory", "d": "Parts and devices tracked as stock, with the consumption tied back to a specific repair job.", "tags": ["Stock", "Parts"]},
              {"t": "Jobs", "d": "The repair ticket as a first-class record, which off-the-shelf ERP has no concept of.", "tags": ["Tickets", "Technicians"]},
              {"t": "Point of sale", "d": "Counter transactions that know whether they are selling a product or closing a job.", "tags": ["POS", "Payments"]},
              {"t": "Analytics", "d": "Margin by product, by service and by period, which is what tells an owner what to stop doing.", "tags": ["Reporting", "Margin"]}]},
      card="Earlier ERP and POS build for repair shops: dashboard, inventory, point of sale "
           "and sales analytics. The direct ancestor of the Repair Beat SaaS platform."),

    P("cyber-security-associates", "Cyber Security Associates", "Cybersecurity",
      tagline="A security company's site that has to look like it knows what it is doing.",
      lead="A marketing site for a PCI DSS-compliant information security services company. "
           "Credibility is the entire conversion mechanism, so the site had to look and "
           "behave like something built by people who take security seriously.",
      problem="Security buyers judge a security vendor by the vendor's own security posture, "
              "starting with the website. A slow, sloppy or insecure marketing site "
              "undermines the pitch before anyone reads the service list.",
      shipped=["Service and capability presentation for a security audience",
               "Compliance credentials presented as the trust signal they are",
               "Clean, fast, hardened front end",
               "Lead capture routed to the sales process"],
      today=["Compliance positioning is visible above the fold, not buried",
             "The site's own build quality supports the pitch",
             "Inquiries route into the sales process rather than a shared inbox",
             "Ongoing maintenance handled by us"],
      chips=["PHP", "WordPress", "Hardening", "SEO"],
      images=[("42-cyber-security-associates.jpg",
               "Cyber Security Associates marketing website for a PCI DSS-compliant security firm")],
      ix={"type": "metrics", "label": "Credibility mechanics",
          "title": "The site is part of the security pitch.",
          "items": [
              {"n": 1, "suffix": "", "l": "PCI DSS compliance story, told up front", "p": 0.9},
              {"n": 100, "suffix": "%", "l": "of pages served over HTTPS", "p": 1.0},
              {"n": 0, "suffix": "", "l": "unmaintained plugins in the stack", "p": 0.1},
              {"n": 3, "suffix": "", "l": "security headers hardened at the edge", "p": 0.7}]},
      card="Marketing site for a PCI DSS-compliant information security services company, "
           "where the build quality is part of the credibility pitch."),

    P("mozayworld", "MozayWorld", "E-commerce",
      tagline="Upload 200 photos, get one mosaic, printed on anything.",
      lead="A custom photo mosaic printing e-commerce site covering canvases, invitations "
           "and t-shirts. The commerce is standard. The interesting part is a configurator "
           "that has to render a believable preview from hundreds of uploaded images.",
      problem="Nobody buys a custom printed product they cannot see first, and a mosaic made "
              "of a customer's own photos is impossible to mock up in advance. Without a live "
              "preview the entire category is a leap of faith at checkout.",
      shipped=["Bulk photo upload and management",
               "Mosaic generation with live preview before purchase",
               "Product configuration across canvases, invitations and apparel",
               "Full storefront and order fulfillment workflow"],
      today=["Customers see the actual mosaic before they pay for it",
             "One configurator serves several print product lines",
             "Upload handling is sized for hundreds of images per order",
             "Orders flow through to the print fulfillment process"],
      chips=["PHP", "Image processing", "MySQL", "E-commerce"],
      images=[("40-mozayworld.jpg",
               "MozayWorld custom photo mosaic printing storefront with product configurator")],
      ix={"type": "flow", "label": "Click a stage",
          "title": "From a camera roll to a printed canvas.",
          "steps": [
              {"k": "01", "t": "Upload", "d": "Hundreds of source photos come in at once. Handling that volume gracefully is most of the engineering."},
              {"k": "02", "t": "Compose", "d": "The mosaic engine matches source photos to tiles of the target image by tone and color."},
              {"k": "03", "t": "Preview", "d": "The customer sees the real output before paying. Without this step the category does not convert."},
              {"k": "04", "t": "Configure", "d": "Same mosaic, different product: canvas, invitation or apparel, each with its own sizing rules."},
              {"k": "05", "t": "Fulfill", "d": "The order carries print-ready output through to fulfillment without a manual re-render."}]},
      card="Custom photo mosaic printing e-commerce site for canvases, invitations and "
           "t-shirts, with a live mosaic preview before purchase."),

    P("fyda", "Fyda", "Marketing Site",
      tagline="For You Deals Only: a deals brand that had to look like one.",
      lead="A deals and offers marketing website. Short build, clear brief: make the offer "
           "the hero on every screen size and get out of the way of the click.",
      problem="Deals sites live and die on scannability. If a visitor cannot assess an offer "
              "in a second and a half, they leave, and every design flourish that delays that "
              "assessment costs conversions.",
      shipped=["Offer-first layout across all breakpoints",
               "Category browsing for deal types",
               "Fast-loading pages with minimal render blocking",
               "Clear paths from offer to action"],
      today=["The offer is the largest thing on every screen",
             "Page weight kept deliberately low",
             "Categories let repeat visitors skip to what they want",
             "Responsive from phone to desktop"],
      chips=["PHP", "WordPress", "Responsive", "SEO"],
      images=[("44-fyda.jpg",
               "Fyda deals and offers marketing website showing categorized promotions")],
      ix={"type": "metrics", "label": "The brief",
          "title": "Everything serves the scan.",
          "items": [
              {"n": 15, "suffix": "s", "l": "to assess an offer, target", "p": 0.85},
              {"n": 1, "suffix": "", "l": "hero element per card: the offer", "p": 0.9},
              {"n": 100, "suffix": "%", "l": "responsive coverage", "p": 1.0},
              {"n": 0, "suffix": "", "l": "render-blocking flourishes", "p": 0.1}]},
      card="Deals and offers marketing website built offer-first: fast, scannable and "
           "responsive across every breakpoint."),

    P("media-monitoring", "Media Monitoring", "Enterprise / Media Tech",
      tagline="Know you were mentioned before someone forwards you the clip.",
      lead="A media monitoring dashboard that tracks mentions across outlets and surfaces "
           "them in one place. Built alongside our public safety work, where knowing what is "
           "being reported is an operational requirement rather than a PR nicety.",
      problem="Mentions are scattered across print, broadcast and online outlets, and the "
              "organizations that most need to know about them find out last, usually from "
              "someone forwarding a link hours after publication.",
      shipped=["Mention tracking across multiple outlet types",
               "A single dashboard aggregating all monitored sources",
               "Filtering and search across captured coverage",
               "Alerting on new coverage as it appears"],
      today=["Coverage arrives in one dashboard instead of several inboxes",
             "Search works across the historical archive, not just today",
             "Built as part of the Safe City systems family",
             "Deployed in a government and enterprise context"],
      chips=["PHP", "Data pipelines", "MySQL", "Dashboards"],
      images=[("45-media-monitoring.jpg",
               "Media monitoring dashboard tracking mentions across news outlets")],
      ix={"type": "stack", "label": "Hover a layer",
          "title": "From scattered outlets to one dashboard.",
          "layers": [
              {"t": "Collect", "d": "Print, broadcast and online sources are ingested continuously rather than checked periodically.", "tags": ["Feeds", "Scrapers"]},
              {"t": "Normalize", "d": "Different outlet formats become one comparable record, which is what makes search across them possible.", "tags": ["Parsing", "MySQL"]},
              {"t": "Detect", "d": "Mentions are matched against monitored terms and entities, then scored for relevance.", "tags": ["Matching", "Relevance"]},
              {"t": "Alert", "d": "New coverage pushes out immediately. The point of the system is the gap between publication and awareness.", "tags": ["Alerts", "Dashboard"]}]},
      card="Media monitoring dashboard tracking mentions across outlets, with normalization, "
           "relevance matching and alerting on new coverage."),

    P("club-teams", "Club Teams", "Sports Tech",
      tagline="Player development, tracked instead of remembered.",
      lead="A sports club and team management platform covering player profiles and "
           "performance tracking. Built on the same understanding of amateur sports "
           "administration that produced Who I Follow.",
      problem="Club coaching turns over constantly, and every departing coach takes their "
              "assessment of a player's development with them. The club retains the player "
              "and loses the history, which makes long-term development mostly guesswork.",
      shipped=["Player profiles that persist across seasons and coaches",
               "Performance tracking against recorded metrics",
               "Team and squad management",
               "Club-level visibility across all teams"],
      today=["Player history survives a coaching change",
             "Development is measured over seasons, not recalled",
             "Club administrators see across all teams at once",
             "Shares design lineage with our Who I Follow platform"],
      chips=["PHP / Laravel", "Vue.js", "MySQL"],
      images=[("46-club-teams.jpg",
               "Club Teams sports management platform showing player profiles and performance tracking")],
      ix={"type": "metrics", "label": "The retention problem",
          "title": "What the club keeps when a coach leaves.",
          "items": [
              {"n": 100, "suffix": "%", "l": "of player history retained at handover", "p": 1.0},
              {"n": 1, "suffix": " profile", "l": "per player, across every season", "p": 0.9},
              {"n": 0, "suffix": "", "l": "development records lost to turnover", "p": 0.1},
              {"n": 2, "suffix": "", "l": "views: team level and club level", "p": 0.6}]},
      card="Sports club and team management platform: player profiles and performance "
           "tracking that survive coaching turnover."),

    P("eccountability", "Eccountability", "Community / Productivity",
      tagline="Mastermind groups that keep meeting after week three.",
      lead="A platform for mastermind and accountability groups: video sessions, goal "
           "tracking and a directory of tribes. The product problem is attendance decay, so "
           "everything is built to make the next session easy to show up to.",
      problem="Accountability groups start strong and dissolve quietly. Sessions get "
              "scheduled in one tool, goals are tracked in another, and the group directory "
              "is a spreadsheet, so the friction of continuing exceeds the friction of "
              "stopping.",
      shipped=["Video sessions inside the platform",
               "Goal tracking visible to the whole group",
               "A tribes directory for discovering and joining groups",
               "Session scheduling tied to the group, not an individual"],
      today=["Sessions, goals and membership live in one place",
             "Commitments are visible to the people holding you to them",
             "New members find groups through the directory",
             "The friction of showing up is lower than the friction of quitting"],
      chips=["Node.js", "Vue.js", "WebRTC", "MongoDB"],
      images=[("47-eccountability.jpg",
               "Eccountability platform showing mastermind group video sessions and goal tracking")],
      ix={"type": "flow", "label": "Click a stage",
          "title": "Designed against attendance decay.",
          "steps": [
              {"k": "01", "t": "Find a tribe", "d": "The directory matches people to groups by focus and cadence, so the first session is not a mismatch."},
              {"k": "02", "t": "Commit", "d": "Goals are entered into the platform and visible to the group. A private goal is not an accountability goal."},
              {"k": "03", "t": "Meet", "d": "Video runs inside the platform. No calendar link to lose, no separate tool to join."},
              {"k": "04", "t": "Track", "d": "Progress against goals updates between sessions, so the meeting starts from data instead of recollection."},
              {"k": "05", "t": "Repeat", "d": "The next session is already scheduled against the group. Continuing is the default state."}]},
      card="Mastermind and accountability group platform: in-platform video sessions, "
           "group-visible goal tracking and a tribes directory."),

    P("shaista-quraishi", "Shaista Quraishi", "E-commerce (Fashion)",
      tagline="A designer's collection, sold the way it was meant to be seen.",
      lead="A fashion e-commerce site for an abaya and clothing designer. Designer fashion is "
           "sold on drape, fabric and silhouette, none of which survive a generic product "
           "grid, so photography drives the layout.",
      problem="Standard e-commerce templates flatten designer clothing into thumbnails and "
              "bullet points. The thing the customer is buying is exactly the thing a small "
              "square crop destroys.",
      shipped=["Photography-led collection and product pages",
               "Catalog, cart and checkout",
               "Collection storytelling alongside the transaction",
               "Responsive layouts that keep imagery large on mobile"],
      today=["Product imagery is sized for the garment, not the template",
             "Collections read as collections rather than filtered lists",
             "The designer manages the catalog directly",
             "Mobile keeps the photography large instead of cropping it away"],
      chips=["PHP", "WordPress", "WooCommerce", "Responsive"],
      images=[("48-shaista-quraishi.jpg",
               "Shaista Quraishi fashion e-commerce site showing abaya collection photography")],
      ix={"type": "metrics", "label": "Layout priorities",
          "title": "The photograph is the product page.",
          "items": [
              {"n": 70, "suffix": "%", "l": "of the product page given to imagery", "p": 0.85},
              {"n": 1, "suffix": " column", "l": "on mobile, so nothing gets cropped", "p": 0.9},
              {"n": 100, "suffix": "%", "l": "of the catalog client-managed", "p": 1.0},
              {"n": 0, "suffix": "", "l": "thumbnail grids on collection pages", "p": 0.1}]},
      card="Fashion e-commerce site for an abaya and clothing designer, built photography-led "
           "so the garment survives the layout."),

    P("table-reservation-system", "Tablet-Based Table Reservation System", "Hospitality",
      tagline="A prototype that answered the question before the rollout.",
      lead="A tablet-based table reservation system prototyped for a Taiwanese restaurant "
           "chain. Built deliberately as a prototype: cheap enough to be wrong, real enough "
           "to be tested on an actual floor during service.",
      problem="Chain-wide hospitality rollouts are expensive to reverse. The chain needed to "
              "know whether tablet-based reservation management would work in their service "
              "flow before committing capital to every location.",
      shipped=["Tablet reservation and table management interface",
               "Floor plan view with live table status",
               "Booking capture and walk-in handling",
               "A prototype scoped for real-service testing"],
      today=["Tested during live service rather than in a meeting room",
             "Answered the rollout question at prototype cost",
             "Floor plan status was the feature that mattered most in practice",
             "Built for a Taiwanese restaurant chain"],
      chips=["Tablet UI", "PHP", "MySQL", "Prototype"],
      images=[("49-table-reservation-system.jpg",
               "Tablet-based table reservation system showing restaurant floor plan and bookings")],
      ix={"type": "metrics", "label": "Why prototype first",
          "title": "Cheap to be wrong, real enough to be right.",
          "items": [
              {"n": 1, "suffix": " site", "l": "tested before any chain-wide commitment", "p": 0.8},
              {"n": 100, "suffix": "%", "l": "of testing done during live service", "p": 1.0},
              {"n": 1, "suffix": " view", "l": "floor plan, which proved to be the feature", "p": 0.85},
              {"n": 0, "suffix": "", "l": "locations rolled out on an untested assumption", "p": 0.1}]},
      card="Prototype tablet reservation system for a Taiwanese restaurant chain: floor plan "
           "view, live table status and walk-in handling, tested during real service."),

    P("safe-city-lahore", "Safe City Lahore Projects", "GovTech / Public Safety",
      tagline="Three government systems where downtime is a public safety event.",
      lead="A family of public safety systems delivered for the Safe City program: the Data "
           "Exchange System, the Digital Forensic Centre System and the Media Monitoring "
           "Control System. Government-grade requirements on availability, access control "
           "and chain of custody throughout.",
      problem="Public safety agencies hold data in systems that were never designed to talk "
              "to each other, and the moments when that data matters most are exactly the "
              "moments when nobody has time to reconcile three databases by hand.",
      shipped=["Data Exchange System for inter-agency data sharing",
               "Digital Forensic Centre System with evidentiary chain of custody",
               "Media Monitoring Control System for coverage tracking",
               "Role-based access control across all three"],
      today=["Deployed within the Safe City program",
             "Chain of custody is enforced by the system, not by procedure alone",
             "Agencies exchange data through a defined interface rather than ad hoc",
             "Built to government availability and access requirements"],
      chips=["GovTech", "PHP", "Oracle", "Access control"],
      images=[("50-safe-city-lahore-projects.jpg",
               "Safe City Lahore public safety systems including data exchange and digital forensics interfaces")],
      ix={"type": "stack", "label": "Hover a layer",
          "title": "Three systems, one set of requirements.",
          "layers": [
              {"t": "Data Exchange (DES)", "d": "A defined interface for inter-agency data sharing, replacing ad hoc transfers between incompatible systems.", "tags": ["Integration", "Inter-agency"]},
              {"t": "Digital Forensics (DFC)", "d": "Evidence handling with chain of custody enforced in software, because procedure alone does not survive cross-examination.", "tags": ["Custody", "Audit"]},
              {"t": "Media Monitoring (MMC)", "d": "Coverage tracking as an operational input, not a communications afterthought.", "tags": ["Monitoring", "Alerts"]},
              {"t": "Access control", "d": "Role-based permissions applied consistently across all three systems, audited end to end.", "tags": ["RBAC", "Audit log"]}]},
      card="Government public safety systems for the Safe City program: Data Exchange "
           "System, Digital Forensic Centre System and Media Monitoring Control System."),

    P("safe-city-business-efficiency", "Safe City System & Business Efficiency Solutions",
      "Marketing Sites",
      tagline="Two credibility sites for two very different buyers.",
      lead="Marketing sites for a public safety company and for a cloud and SaaS "
           "business-efficiency consultancy. Different audiences, same underlying job: make a "
           "complex technical offering legible to a buyer who is not an engineer.",
      problem="Both companies sell technically deep services to buyers who evaluate them "
              "non-technically. Existing sites described the technology accurately and "
              "explained the value not at all, which loses the buyer in the first paragraph.",
      shipped=["Capability and service presentation for both companies",
               "Positioning written for non-technical evaluators",
               "Case and credential sections carrying the proof",
               "Lead capture into each company's sales process"],
      today=["Both sites lead with outcome and follow with method",
             "Credentials are presented where buyers look for them",
             "Content is maintainable by each client's own team",
             "Built and maintained alongside the Safe City systems work"],
      chips=["WordPress", "PHP", "Responsive", "SEO"],
      images=[("51-safe-city-system-business-efficiency.jpg",
               "Marketing websites for Safe City System and Business Efficiency Solutions")],
      ix={"type": "screens", "label": "Switch sites",
          "title": "Two audiences, one approach.",
          "shots": [
              {"t": "Both sites", "img": "51-safe-city-system-business-efficiency.jpg",
               "alt": "Side by side view of the Safe City System and Business Efficiency Solutions marketing websites",
               "cap": "Public safety on one side, cloud and SaaS consulting on the other. Both lead with the outcome and put the technology second."},
              {"t": "In context", "img": "50-safe-city-lahore-projects.jpg",
               "alt": "Safe City Lahore operational systems that the marketing site describes",
               "cap": "The systems behind the pitch. We built the marketing site and the software it is selling."}]},
      card="Marketing sites for a public safety company and a cloud/SaaS business-efficiency "
           "consultancy, written for non-technical evaluators."),

    P("diabetes-sims", "Diabetes Diagnosis, Management & Treatment Solution", "Healthcare",
      tagline="20,000 patients, 300 a day, one clinical system.",
      lead="A diabetes diagnosis, management and treatment system built for the Services "
           "Institute of Medical Sciences. It runs a clinic seeing 250 to 300 patients a day, "
           "which means the constraint is throughput without losing clinical rigor.",
      problem="A high-volume public diabetes clinic cannot afford a system that adds a minute "
              "per patient, and cannot afford one that loses history between visits. Paper "
              "records did the second thing constantly and the first thing quietly.",
      shipped=["Patient records covering diagnosis, management and treatment",
               "Clinical workflow sized for 250 to 300 patients per day",
               "Longitudinal history across visits",
               "Treatment tracking and follow-up scheduling"],
      today=["250 to 300 patients treated per day through the system",
             "More than 20,000 patients since launch",
             "Built for the Services Institute of Medical Sciences (SIMS)",
             "Patient history carries across visits instead of resetting"],
      chips=["PHP", "MySQL", "Clinical workflow", "Reporting"],
      images=[("52-diabetes-diagnosis-treatment.jpg",
               "Diabetes diagnosis and treatment system built for the Services Institute of Medical Sciences")],
      ix={"type": "metrics", "label": "Clinic scale",
          "title": "The numbers this system runs at.",
          "items": [
              {"n": 20000, "suffix": "+", "l": "patients since launch", "p": 1.0},
              {"n": 300, "suffix": "", "l": "patients treated per day, peak", "p": 0.95},
              {"n": 1, "suffix": " record", "l": "per patient, across every visit", "p": 0.9},
              {"n": 0, "suffix": "", "l": "paper charts in the clinical path", "p": 0.1}]},
      card="Diabetes diagnosis, management and treatment system for the Services Institute "
           "of Medical Sciences: 250 to 300 patients a day, 20,000+ since launch."),
]


BY_SLUG = {p["slug"]: p for p in PROJECTS}
