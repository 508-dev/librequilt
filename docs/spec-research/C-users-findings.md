> Agent research report for librequilt, written 2026-10-28 by a locally initiated agent (DeepSeek V4 Pro; an earlier GLM 5.3 run failed for lack of account funds) following the brief in this folder's README. Mechanical check: 18 of 18 links resolve; 11 of 12 claim quotes found verbatim, the twelfth on a page that refuses automated requests. The orchestrator reviewed it; note that its device evidence rests on vendors' marketing pages and that the forum threads could not be re-opened, so those points rest on the earlier register (S29 to S32, S46). Everything marked **[proposal]** is a proposal, not an approved requirement. Corrections and the consolidated summary are in [research.md](../research.md#specification-research-2026-10-28).

# Track C — Quilters' design workflow, existing tools, unmet needs, usability & accessibility

Access date for all sources: 2026-10-28. IDs use the track prefix `C`. Pages marked
"not re-opened" were found via search results but the page blocked or emptied the fetch
this session; they are listed for completeness, not cited as opened evidence.

## Summary

- The workflow quilters describe is stable and mostly done on paper: pick/combine blocks,
  draw on graph paper, colour with pencils, then count squares and add ¼″ seam allowance to
  work out cuts (C18). Graph paper survives because it needs no math and no computer skills.
- The incumbent (EQ8) prints yardage, foundation patterns, rotary-cutting charts and templates
  and ships 6,000+ blocks and fabrics (C5), but runs only on Windows/macOS desktops (C9) and its
  three most-repeated complaints are price, learning curve and desktop lock-in (C1).
- The free/proprietary browser tools already cover the core block→layout→yardage→print loop in
  the browser: NiftyFifty free, PreQuilt free tier (no saving), Quiltler free tier (one quilt /
  ten fabrics). None is open source. NiftyFifty's own terms/about contain no source licence, and
  its footer says "© 2026 NiftyFifty. All rights reserved." (C3).
- The single most operationally dangerous step is **printing at true scale**: "Fit to page"
  silently shrinks templates 3–6%, so every credible tool prints a 1″ calibration square
  (C11, C8).
- The typical user is a retired woman in her sixties (charter, from C1/S1 context); WCAG 2.2
  gives concrete testable targets — 24×24 CSS px touch targets (C13), resizable text to 200% and
  4.5:1 contrast for older users (C14) — and the audience skews colour-vision-deficient (C16).
- Metric is secondary but real: the craft runs on inches worldwide even in metric countries (C12),
  yet EQ8's metric support is a trap (no conversion after design, C10) and the web tools print A4
  and report "yards and meters" (C8).
- The usability bar can be tested cheaply with 5–8 users; NN/g says five users find most problems
  and iterative small tests beat one big study (C15).

---

## 1. The workflow as quilters describe it

The dominant description of designing a quilt is **still analog**. A step-by-step beginner guide
(C18) describes the loop precisely: (1) gather block ideas from web/Pinterest/books/cards; (2)
pick blocks whose finished sizes match or can be combined (an 8″ block + two 4″ blocks); (3) draw
the layout on graph paper; (4) make photocopies and colour them with pencils to "play with color
combinations"; (5) pick a colourway and add a colour key plus cut notes; (6) choose a finished
block size and add ½″ seam allowance to every dimension (¼″ per side) to get cut sizes; (7) pull
fabric, cut, sew the blocks, and lay them on a design wall. The same guide's software section
notes the core benefit a tool offers: "there is no quilt math!".

Across sources the steps people still do by hand are:

- **Choosing or drawing blocks** — drawn on a grid (3×3 for a nine-patch, 2×2 for a four-patch),
  then splitting squares into triangles/rectangles (C18; and the "draw a block on a grid" framing
  from a drawing-ideas guide, not re-opened).
- **Layout, size, sashing/borders** — drawn and re-drawn on paper; block counts and finished size
  worked out by counting grid squares, not arithmetic (C18; National Quilters Circle "graph paper
  … no real math required", not re-opened).
- **Colour and fabric audition** — via photocopies and coloured pencils (C18), and via "value"
  (dark/light) first, before adding colour (C18 step 8).
- **Yardage and cutting** — "figure out how much fabric you'll need … Add your seam allowance and
  figure out how many of each you'll need. Fabric is 40-inches wide." (C18). Cutting sizes come
  from counting grid squares + seam allowance.
- **Piecing order** — largely absent from the paper workflow; it is a separate, later step.

**Why graph paper / spreadsheets / phone photos persist** (synthesised from C18, C12, C1):

- No learning curve and no software cost; the act of colouring is described as "meditative and
  relaxing" (C18).
- The maths is manual and error-prone ("it was easy to make mistakes in calculations" — Alanda
  Craft, C17), but the alternative tools have a reputation for a steep learning curve (C1).
- Fabric is physical: quilters photograph or scan their own stash and audition against it; a tool
  that cannot take a real fabric photo and show it at true scale is only a colouring page.

---

## 2. What existing tools offer, functionally

Described functionally, in my own words, from each vendor's public pages opened this session.

| Tool | Platform / price | Workflow & outputs | Fabric photos & scale | Units | Offline? |
|---|---|---|---|---|---|
| **Electric Quilt 8 (EQ8)** | Windows/macOS desktop only; US$239.95 one-time (charter; C9 notes "~$200+") | Draw blocks (lines/curves, trace an image), build quilt layouts (horizontal, on-point, variable, custom) with sashing/borders, colour with fabrics/solids; **prints yardage estimates, foundation patterns, rotary-cutting charts, and templates at any size** (C5). Ships 6,000+ blocks, 6,000+ fabrics; BlockBase+ adds 4,264 blocks (C5). | Ships manufacturer fabric swatches; also import/scan your own fabric photos (C5, C17). No true-scale tiling of a photo across a block described. | Inches and centimetres, but switching after design does **not** convert existing sizes (C10). | Yes — a desktop install; internet only for download/activation/periodic validation (per charter/S3; not re-checked this session). |
| **NiftyFifty** | Free; any browser incl. iPad/Chromebook; no account needed to design (C2) | Quilt Designer (arrange archive blocks on a grid, sashing, borders, export a fabric cut list), Pattern Designer (draw a block from scratch: pieced/appliqué/FPP), FPP Pattern Maker, EPP designer, calculators, yardage/cutting chart printable pattern (C2, C1). Opens .pj8/.pj7 files in-browser (C1). | Uses ~1,400 photographed community blocks; manufacturer/retailer swatches are licensed for preview only and must not be sold in exports (C3). | Inches; some references list inch-to-cm (not verified this session). | Browser app; designs generated "entirely in your browser" (C3), but it is a web service (requires the page; not a PWA claim verified). |
| **PreQuilt** | Free tier (0 saved quilts) + Basic/Market subscription (~$50/yr per C1) | Colour-first planner: rect/on-point/triangle/hexagon grids, block maker, solid-colour cards, colourways, randomization; **fabric calculator (yardage, cutting diagrams, backing, binding) is paid**; print block 1:1 and export SVG are paid (C7). Explicitly a planner, not a pattern generator with assembly steps (C1). | Solid colour cards free; printed fabric collections and "import your own fabric photos with scale" paid (C1, C7). | Inches; fabric calculator uses ¼″ seam allowance and imperial measurements (help centre FAQ, not re-opened). | No — cloud SaaS: "everything is saved in the cloud" (help centre, not re-opened). |
| **Quarter Inch** | Free (3 quilts) / $9 mo / $89 yr; iPad, Mac, Windows, Chromebook, phone (C8) | Start from a block (524 blocks), a sentence prompt, a charm-pack photo, or a sketch; computes seam/yardage/cuts in fractions; **prints templates and foundations at true size with a 1″ test square on every page**; cutting chart you tick off as you cut (C8). Opens .pj8/.pj7 free with an import report (C8). | Photograph a charm pack / layer cake / fat quarters, or add fabrics; designs with your own fabric; shopping list asks only for what's missing (C8). | "The fabric to buy, in yards and meters"; cuts in fractions to ⅛″ (C8). | Web/iPad app; same quilt across devices via account (C8). |
| **Quiltler** | Browser + iPhone/iPad; free (1 quilt, 10 fabrics); Quilter $7.99/mo or $49.99/yr; one quilt's pattern $4.99 (C6) | Blocks (library + drafter + Shape Designer), layouts (repeats, half-drop, sashing, borders), stash photos, output = cutting sizes, yardage, backing, binding, batting, cutting chart, true-scale templates, FPP sheets (C6). **Does not open EQ8 project files** (C6, C9). | Photograph your stash and audition it in the design (C6). True-scale of prints not stated as a first-class scale feature on this page. | Inches (cuts to ⅛″; not explicitly metric on this page). | Browser studio; quilts on account across devices (C6). |

**Free tools beyond these** found this session: NiftyFifty's own printable calculators/graph-paper
pages (C2); PreQuilt free tier (C7). (PatternJam and Quilt Assistant are described on C1 but their
own sites were not opened this session.)

**NiftyFifty source licence — the specific question asked.** NiftyFifty's Terms of Service (C3)
and About page (C4) describe the product, content licensing and the fact that "the NiftyFifty
Quilt Designer and Pattern Designer generate original quilt designs entirely in your browser"
and that "You own the designs you create", but **neither page states that the platform's source
code is available under any licence**. The site footer reads "© 2026 NiftyFifty. All rights
reserved." (C3). No repository or open-source licence is named. Treat this as a negative finding
confirmed from the vendor's own pages, not a claim that the source is or isn't available elsewhere.

---

## 3. Unmet needs (public complaints and wishes)

Ten-plus concrete complaints/wishes, each with a URL and a one-line paraphrase. Sources opened
this session carry a C-id; the rest were identified via search but the page blocked or emptied the
fetch, and are marked.

1. **Price** — NiftyFifty's comparison FAQ names "the $239.95 price" first among the reasons
   quilters look for alternatives (C1, opened).
2. **Learning curve ("frustrating")** — "the learning curve (the most common word is
   'frustrating')" (C1, opened).
3. **Learning curve (end-user voice)** — a review's own "Cons" list: "There can be a bit of a
   learning curve when starting out." (C17, opened).
4. **Interface "clunky"** — reviewer comment: "I find the interface a little clunky and less
   robust." (C17, opened).
5. **Desktop lock-in / no tablet** — "being chained to a desktop — EQ8 has no iPad, phone, or
   Chromebook version" (C1, opened).
6. **No iPad/iPhone/Android/Chromebook version** — "Electric Quilt 8 runs only on Windows and
   macOS desktops and laptops. There's no iPad app, no iPhone app, no Android or Chromebook
   version." (C9, opened).
7. **Printing at true scale (the dominant pain)** — "A pattern printed at 96% does not look wrong
   at the first seam; it looks wrong at the last one…" (C11, opened).
8. **Printer scaling of templates** — Electric Quilt's own support page "Scale Square is Not 1
   Inch": "If the Scale Square is not exactly 1 inch, then your printer may be scaling the printout
   and your templates or foundation pieces will not be accurately sized."
   (https://support.electricquilt.com/articles/scale-square-incorrect-size — not re-opened this session).
9. **Print-at-100% is an ongoing burden** — a how-to page explaining the 1″ calibration square and
   that "Fit to page"/"Shrink to fit" ruin measurements
   (https://quiltblockatlas.com/printing-quilt-patterns-at-100-percent — not re-opened).
10. **Metric units are a trap in EQ8** — "EQ8 does not calculate conversions if this option is
    changed after you have designed a quilt." (C10, opened).
11. **Proprietary files / lock-in** — "Because EQ8 project files are proprietary, you simply
    recreate your design in Quiltler…" (C9, opened); Quiltler "does not open EQ8 project files"
    (C6, opened).
12. **Proprietary files / migration** — Quarter Inch sells on it: "Open your .pj8 projects and see
    exactly what came across" (C8, opened).
13. **iPad / Chromebook demand** — a Facebook group asks "any good quilt design software for
    chrome books…?" and a vendor notes browser tools (NiftyFifty/PreQuilt/Quiltink/QuiltLab) "all
    run in a tablet or Chromebook browser"
    (https://niftyfiftyquilting.com/quilt-design-software — not re-opened; Facebook group post not re-opened).
14. **Measuring fabric photos / true scale** — a rival app's selling point is that you "tell
    [it] how wide the print really is" so a 6″ print tiles at 6″
    (https://tidestitchquilts.com — not re-opened this session).
15. **"Huge learning curve"** — Quilting Board thread "To EQ8 or not?" (S29 in docs/research.md;
    https://www.quiltingboard.com/main-f1/eq8-not-t306667.html — returned HTTP 403 this session).
16. **"Clunky … worth it if you are tech savvy"** — r/quilting "Should I buy EQ8?" (S30 in
    docs/research.md; https://www.reddit.com/r/quilting/comments/1n2aodx/should_i_buy_eq8/ — returned
    an empty page this session).
17. **"Steep learning curve"** — PatternReview (S32 in docs/research.md;
    https://sewing.patternreview.com/SewingDiscussions/topic/130298 — not re-opened this session).

The recurrence across independent pages (a competitor's comparison, a third-party review with
user comments, a print-quality blog, and the vendor's own support articles) means items 1–8 and
10–12 rest on opened sources; the remainder are forum voices already recorded in the project's
research register (docs/research.md S29/S30/S32) that I could not re-open.

---

## 4. Devices and settings

Evidence is vendor marketing and forum signals, not a neutral survey — this is the bias to note.

- **The incumbent is desktop-only**, so the fastest-growing demand is tablet/Chromebook: "EQ8 has
  no iPad, phone, or Chromebook version" (C1) and "runs only on Windows and macOS desktops and
  laptops" (C9). Quiltler's alternative page states the number-one reason to switch is "the
  device", for "a hobby that often happens on the sofa, at a guild meeting, or standing in a
  fabric aisle" (C9).
- **Browser tools advertise cross-device reach** including iPad and Chromebook (C1, C8); Quarter
  Inch lists "iPad and Apple Pencil, Mac, Windows and Chromebook, iPhone and Android, Home
  printers" (C8).
- **iPad/Apple Pencil is a real segment**: Quiltler markets "a design wall made for touch" and an
  iPad app (C6, C9); the charter's survey context already notes iPads are "increasingly" used.
- **Printing at home is assumed** — the tools all target "Home printers" (C8), and the print-scale
  literature (C11) is written for a home inkjet/printer and an acrylic ruler.

Bias: every device claim above is from a vendor trying to position against EQ8 or sell a
subscription; no independent, neutral survey of "which device do quilters design on" was found and
opened this session. Treat "desktop today, iPad/Chromebook growing" as vendor-consistent, not
surveyed.

---

## 5. Accessibility and usability for older adults

The audience is a retired woman in her sixties (charter, from the 2020 survey). Public guidance,
turned into candidate testable requirements (linked to the Candidate requirements section):

- **W3C WAI on older users** (C14): "Designing products that are easier for older people to use is
  similar to designing for people with disabilities." It maps declining vision/dexterity/cognition
  to specific WCAG criteria: text resizable to 200% (1.4.4), contrast ≥ 4.5:1 (1.4.3), colour not
  the only cue (1.4.1), visible focus, keyboard operation, large links/buttons, no time limits,
  clear labels and error recovery.
- **Target size** — WCAG 2.5.8 (Level AA): "The size of the target for pointer inputs is at least
  24 by 24 CSS pixels, except when [spacing/equivalent/inline/UA/essential]" (C13). The stricter
  AAA 2.5.5 is 44×44 CSS px. The criterion exists precisely because small targets defeat people
  with tremors/dexterity loss — a large share of older users.
- **Dragging movements** — WCAG 2.2 adds a criterion that any drag operation be achievable with a
  single pointer without dragging (normative text seen in the WCAG 2.2 spec; the Understanding
  page for 2.5.8 links the adjacent "Dragging Movements" criterion, C13). This matters for a quilt
  tool whose natural gesture is drag-to-place-and-colour.
- **Contrast** — 4.5:1 (AA) / 7:1 (AAA) for text (C14). Quarter Inch advertises "Large, clear
  text and big buttons, by design", displaying 19 px text, 48 px buttons and AAA contrast as its
  accessibility stance (C8) — a concrete benchmark a FOSS tool should match or exceed.
- **Colour-vision deficiency (CVD)** — fabric auditioning depends on colour, and CVD "affects
  approximately 1 in 12 men (8%) and 1 in 200 women" (C16). Red/green deficiency means people
  "confuse any colours which have some red or green as part of the whole colour" — e.g. blue vs
  purple (C16). Because 98% of quilters are female, the *population* rate in the audience is low
  (~0.5%), but a designer's family, guild or customer may be male, and the craft already uses a
  grayscale "value" test — so a value/grayscale preview is both a familiar quilting idea (C18 "a
  variety of values") and a CVD accommodation.

---

## 6. International and metric users

- **Inches are the craft's lingua franca even in metric countries.** A New-Zealand pattern
  designer explains she publishes in inches because her customers are US-based, and: "Even in
  countries that use the metric system, quilters often adapt to using inches for the sake of
  convenience and consistency." Precuts (jelly rolls, charm packs) and rulers are inch-based
  (C12).
- **Metric support is nonetheless requested and imperfect.** EQ8 offers inches *or* centimetres,
  but "does not calculate conversions if this option is changed after you have designed a quilt"
  — a 10″ block silently becomes 10 cm (C10).
- **Paper is A4 outside North America.** Quarter Inch (a UK company) sells "Letter and A4
  versions" for pattern output (C8 pricing, opened). NiftyFifty prints a "1″ test square" style
  reference and lists dimensions "in inches and centimeters" (quilt-sizes page, not re-opened).
- **International communities exist** (UK/Europe/Australia/Japan), but no opened source this
  session quantified them; Japan's sashiko/yosegire traditions surfaced only in search snippets
  (not re-opened). The practical requirement is: dual units on screen and A4 + Letter print
  layouts, with conversions done at the point of entry, not retroactively (the exact failure C10
  documents).

---

## 7. How to test the usability bar

NN/g's "Why You Only Need to Test with 5 Users" is the canonical citation: "Elaborate usability
tests are a waste of resources. The best results come from testing no more than 5 users and
running as many small tests as you can afford." (C15). The task asks for 5–8 users; NN/g's
"how many test users" follow-up recommends 5 per homogeneous group and 3–4 per group when testing
two groups, so 5–8 is defensible for a first volunteer run (C15).

Proposed cheap protocol for a volunteer maintainer:

- **Recruit 5–8 quilters** who have never used the tool; aim for the target profile (retired,
  sixties) plus at least one colour-blind participant and, if available, one non-US (metric/A4)
  user.
- **Environment:** their own laptop/desktop if possible (and one on an iPad or Chromebook), their
  own printer, a phone photo of one real fabric, and an acrylic ruler.
- **Tasks (time-boxed, think-aloud):** (1) create a layout of one traditional block (e.g. a
  nine-patch) at a chosen finished size; (2) add sashing and a border; (3) colour it with the
  solid palette and with the photographed fabric; (4) print the yardage + cutting chart; (5)
  measure the printed 1″ test square with the ruler.
- **Success measures:** task completion without help (the charter bar: "lay out a first quilt and
  print its cutting chart without a manual"); time to first completed cutting chart; number of
  times the tester asked for help or gave up; whether the printed test square measured 1″ (true
  scale); whether the yardage matched an independent calculator within rounding.
- **Record:** video/screen recording or written notes; the exact words at each stall point; the
  error rate per task; and post-task single-question difficulty rating. Fix the top problems and
  re-test once (C15's iterative advice).

---

## Candidate requirements

Each is a testable statement, marked **[proposal]**, with the evidence that motivates it.

1. **[proposal]** The tool renders the design and prints templates/cutting charts at true scale,
   and every printed page includes a 1″ (and 25 mm) calibration square so the user can verify the
   printer did not rescale it. *(C11, C8, C10)*
2. **[proposal]** The tool prints a rotary-cutting chart whose cut sizes are expressed to the
   nearest ⅛″ (and nearest 1 mm in metric mode), rounded up for yardage to the next ⅛ yd / 0.1 m.
   *(C8, C10)*
3. **[proposal]** The tool computes yardage, cutting sizes, backing and binding from the design's
   actual pieces (not from overall quilt dimensions alone). *(C6, C7, C8)*
4. **[proposal]** The tool accepts a photograph of the user's own fabric and lets the user state
   the print's real-world repeat/width, then tiles it at that true scale in the design. *(C8, C6,
   C1; TideStitch not re-opened)*
5. **[proposal]** All interactive targets are at least 24×24 CSS pixels (44×44 preferred), or are
   spaced so their 24 px circles do not intersect. *(C13)*
6. **[proposal]** Any operation performed by dragging (placing/rotating/colouring pieces) can also
   be completed with a single pointer tap or click without dragging. *(C13 — Dragging Movements)*
7. **[proposal]** Body text is resizable to 200% without loss of content/function, and text meets
   a 4.5:1 contrast ratio (7:1 preferred). *(C14)*
8. **[proposal]** Colour is never the only signal for a selected/error state; the tool offers a
   grayscale ("value") preview so a colour-vision-deficient user can still judge contrast. *(C14,
   C16, C18)*
9. **[proposal]** The user can switch between inches and centimetres, and switching units converts
   all existing dimensions rather than relabelling them. *(C10, C12)*
10. **[proposal]** Printing supports both Letter and A4 paper, and the cutting chart lists both
    the yard and metre totals. *(C8, C12)*
11. **[proposal]** Designs save to and open from a documented, open file format that the user
    owns, and can be exported as PDF/SVG without a subscription. *(C3, C6, C8, C9)*
12. **[proposal]** A new user can lay out a first quilt and print its cutting chart without a
    manual; this is verified by the 5–8-user protocol in §7 before the bar is declared met.
    *(C15, C18, C1)*

---

## Open decisions for the maintainer

- **Browser-first vs desktop.** Browser tools reach iPad/Chromebook with zero install (C1, C9, C8)
  and match how the free competitors work; a desktop-only build reproduces EQ8's main complaint.
  *Evidence for browser:* C1, C6, C8, C9. *Against:* the hub's Linux-first preference (charter);
  offline use favours a native/PWA.
- **Offline vs cloud.** EQ8 works offline (desktop install); PreQuilt is cloud-only; NiftyFifty
  renders in-browser but is still a web service; the charter requires designs and fabric photos to
  "stay on the quilter's device". *Evidence:* C3, C7, charter.
- **Metric depth.** Inches are the craft default (C12) but metric conversion done wrong is a
  documented failure (C10). Decide whether v1 ships full dual-unit editing or inch-only with a
  clear metric readout.
- **Fabric-photo true scale.** The charter scope includes fabric photos; true-scale tiling of a
  print is what separates "colouring page" from "audition tool" (C8, C6). Decide how v1 captures
  scale (user-entered repeat width, ruler-in-photo, or both).
- **Accessibility target level.** WCAG 2.2 AA is the defensible floor (C13, C14); Quarter Inch
  advertises AAA contrast + 48 px buttons (C8). Decide AA vs AAA for contrast/target size.

---

## Facts / Inferences / Unknowns

**Facts (sourced):** EQ8 is Windows/macOS desktop only and prints yardage, foundations,
rotary-cutting charts and templates; ships 6,000+ blocks/fabrics (C5, C9). NiftyFifty, PreQuilt
and Quiltler cover the block→layout→yardage→print loop in the browser with free tiers; none is
open source; NiftyFifty's terms/about name no source licence and its footer asserts "all rights
reserved" (C1, C3, C6, C7). Printing at true scale is a real, recurring failure mode addressed by
a 1″ test square (C11, C8). WCAG 2.5.8 requires 24×24 CSS px targets (C13); WAI maps older-user
needs to resize-text/contrast/keyboard criteria (C14). CVD affects ~8% of men / 0.5% of women
(C16; the 8%/0.5% figures are quoted from the source, and I verified 1/12 ≈ 8.3% and 1/200 = 0.5%
with python3). The craft uses inches even in metric countries (C12). NN/g recommends 5 users per
qualitative test (C15).

**Inferences (not directly stated):** (a) A browser/PWA tool that prints true-scale templates and
an open file format would directly counter the three most-repeated EQ8 complaints (price, learning
curve, desktop lock-in) without needing to beat EQ8's block catalogue. (b) The 5–8-user protocol
plus the charter's "no manual" bar is a cheap, defensible first gate. (c) True-scale fabric tiling
is the single feature most likely to make a free tool feel "real" to a quilter.

**Unknowns:** No neutral survey of which device quilters design on was found and opened. No
quantified size for non-North-American quilting communities was opened this session. Whether
NiftyFifty's source is available anywhere outside its own terms/about was not established (only
that its own pages do not license it). Reddit/Quilting Board/PatternReview threads could not be
re-opened (blocked/403); their quotes rest on docs/research.md S29/S30/S32/S46.

---

## Evidence register

Access date for every row: 2026-10-28. "Not checked" = licence/terms not assessed. "Not re-opened"
= identified via search results but the page blocked or emptied the fetch; listed for transparency.

| ID | URL | Licence / terms | Establishes | Sections |
|---|---|---|---|---|
| C1 | niftyfiftyquilting.com/quilt-design-software/eq8-alternatives | not checked | Competitor comparison (Aug 2026): NiftyFifty free covers core loop; three complaints = price / learning curve ("frustrating") / desktop lock-in; PreQuilt free tier can't save; NiftyFifty opens .pj8 | 2, 3, 4, Summary |
| C2 | niftyfiftyquilting.com/ | not checked | Full tool list (Quilt Designer, Pattern Designer, FPP/EPP makers, calculators); "2,621 blocks"; free, no account to design | 2, 4 |
| C3 | niftyfiftyquilting.com/terms | Terms of Service | Designs "generated entirely in your browser"; "You own the designs you create"; fabric swatches licensed preview-only; no source licence stated; footer "© 2026 NiftyFifty. All rights reserved." | 2, Summary |
| C4 | niftyfiftyquilting.com/about | not checked | Company/community description; no source or licence mention | 2 |
| C5 | electricquilt.com/online-shop/electric-quilt-8/ | not checked | EQ8 prints yardage/foundations/rotary-cutting/templates; 6,000+ fabrics, 6,000+ copyright-free blocks; BlockBase+ 4,264 blocks | 2 |
| C6 | quiltler.com/quilt-design-software | not checked | Quiltler: browser + iPhone/iPad; free = 1 quilt / 10 fabrics; Quilter $7.99/mo / $49.99/yr; $4.99 per-quilt pattern; outputs cutting/yardage/backing/binding/cutting chart/true-scale templates/FPP; does not open EQ8 | 2, 3 |
| C7 | help.prequilt.com/welcome-to-prequilt/prequilt-features | not checked | PreQuilt feature matrix: free = 0 saved quilts; fabric calculator, 1:1 print, SVG export are paid; solid colour cards free | 2 |
| C8 | quarterinch.app/ | not checked | Quarter Inch: iPad/Mac/Win/Chromebook/phone; prints at true size w/ 1″ test square; opens .pj8 free; "Large, clear text and big buttons, by design"; $89/yr; Avoxy Technologies (UK) | 2, 4, 5, 6 |
| C19 | quarterinch.app/pricing | not checked | "The fabric to buy, in yards and meters"; "Letter and A4, versions, tester copies"; feature matrix (free 3 quilts vs Quilter $89/yr) | 6 |
| C9 | quiltler.com/eq8-alternative | not checked | "EQ8 runs only on Windows and macOS… no iPad, iPhone, Android or Chromebook version"; "EQ8 project files are proprietary" | 2, 3, 4 |
| C10 | support.electricquilt.com/articles/adjusting-for-inches-or-centimeters | not checked | EQ8 supports inches/cm but "does not calculate conversions if changed after you have designed a quilt" | 2, 3, 6 |
| C11 | mrsquilty.com/blogs/news/why-free-placemat-pdfs-print-wrong-and-the-60-second-fix | not checked | "Fit to page" shrinks 94–97%; test square is the only proof of scale; compounding taping error | 3, 5 |
| C12 | kohatupatterns.com/blog/.../why-quilting-patterns-tools-and-tutorials-are-typically-designed-in-inches | not checked | Inches are the craft default even in metric countries; precuts/rulers inch-based | 6 |
| C13 | w3.org/WAI/WCAG22/Understanding/target-size-minimum.html | W3C (permissive) | WCAG 2.5.8 (AA): 24×24 CSS px targets w/ 5 exceptions; benefits incl. tremors/dexterity | 5 |
| C14 | w3.org/WAI/older-users/developing | W3C (permissive) | Older-user→WCAG mapping: 1.4.4 resize 200%, 1.4.3 contrast 4.5:1, 1.4.1 use of colour, keyboard/focus, mouse use | 5 |
| C15 | nngroup.com/articles/why-you-only-need-to-test-with-5-users | © NN/g | "test no more than 5 users"; "After the fifth user, you are wasting your time"; iterative | 7 |
| C16 | colourblindawareness.org/colour-blindness | © Colour Blind Awareness | CVD "1 in 12 men (8%) and 1 in 200 women"; red/green confusion e.g. blue vs purple | 5 |
| C17 | alandacraft.com/2020/07/04/electric-quilt-review | not checked | EQ8 functional detail; comment "interface a little clunky and less robust"; "a bit of a learning curve" | 1, 3 |
| C18 | createwhimsy.com/projects/beginners-guide-to-creating-your-own-quilt-designs/ | © Create Whimsy | Step-by-step graph-paper workflow incl. photocopy colour audition, seam allowance, yardage | 1 |

*Not re-opened this session (blocked / search-only), referenced in §3 for completeness:* EQ
support "Scale Square is Not 1 Inch"; quiltblockatlas.com "Printing Quilt Patterns at 100%";
niftyfiftyquilting.com/quilt-design-software (Chromebook FAQ); tidestitchquilts.com; Quilting Board
"To EQ8 or not?"; r/quilting "Should I buy EQ8?"; PatternReview topic 130298.
