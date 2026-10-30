# Research and evidence register

Carried over on 2026-10-13 from the research on hub nomination
<https://github.com/508-dev/genairosity/issues/71>. It was drafted by locally initiated
research agents and reviewed before a summary was posted on that issue. The reviewer re-opened
the sources for the claims the recommendation rests on; the issue comment says which.
Everything else below is a lead to check, not a finding. Follow the hub's clean-room policy
before gathering or sharing evidence, and do not ingest uncertain materials into git, public
issues, or a model session.

## Overseer check (2026-10-11)

Sections 1 to 4 were written by one agent (Qwen 3.8 Max) that was cut off by a usage limit; a second agent
(DeepSeek v4 Pro) rebuilt the evidence register, corrected five claims, and wrote sections 5 to 10. The
orchestrator then re-opened these sources directly:

- Confirmed verbatim: S1 (9 to 11 million North American quilters, survey funded by Premier Needle Arts);
  S2 (US$239.95, single-user licence with 2 activations, non-transferable, US$24.95 Migration Kit, "over 6,200
  new fabrics"); S5a (M-series Macs need Rosetta to run EQ8); S6 (vendor: "will have a solution in place
  before the release of macOS 28", updated 2026-05-22); S7 (Apple: from macOS 28 Rosetta only for certain
  older games); S11 (no export for computer-guided quilting machines); S34 (Quarter Inch: free plan of 3
  quilts, US$9 a month or US$89 a year, opens .pj8 files).
- Confirmed with a caveat: S2 block count. The shop page says both "6,000+ copyright-free blocks" and "over
  6,700 pre-drawn designs". S9: NiftyFifty's page confirms its own free Quilt Designer and Pattern Designer
  (saving, printing, yardage, cutting charts, foundation piecing), the three complaints, PreQuilt at US$50 a
  year and Quiltler at US$49.99 a year. The page does not say whether NiftyFifty is open source.
- Not confirmed: in the section 3 table, the rows for QuiltLab, TideStitch, Fern Mountain Quilt Architect,
  QuiltPop and Quiltography, and PreQuilt's "Market plan $100/yr", did not appear in the part of S9 the
  orchestrator could read. Treat those rows as unverified.
- Inference, correctly labelled in the draft: that the Mac build runs under Wine. S5 is a troubleshooting
  article for an error message called "Wine error" in EQ8 on macOS; it does not say the application runs on Wine.
- GitHub: every repository in the section 4 table exists with the licence, star count and last-push date
  stated. Five further searches sorted by recent activity found only zero-star projects, most created in 2026.

## Summary and recommendation

**Pursue, but narrowed — and contingent on platform. Confidence: medium.** The single finding that would
change it: a maintained FOSS competitor (none found) — or a maintainer decision that Linux-first is
non-negotiable, which would flip this to _decline_, because the audience is Windows/macOS/iPad. Full
reasoning in the final section.

## 1. Users and workflows

The best citable community-size source found is the Craft Industry Alliance's report of the 2020
Premier Needle Arts quilting consumer survey [S1]: the quilting market is ~US$4.2B; North America has
9–11 million quilters, "stable (between 8-12 million) over the last decade"; 98% of quilting consumers
are female and 65% retired; the average quilter is "a retired woman in her 60's with a household income
of $74,000" who starts 8–10 quilts a year and spends 6–10 hours/week on projects; 46% search online for
quilting products/education daily. Guild participation is reportedly declining; top learning sources are
YouTube and local-shop classes [S1]. **Verdict on the issue's "10–20 million quilters" figure: too high
and unsourced; the supportable figure is ~9–11 million in North America (2020 survey) [S1].** (Older
"Quilting in America" surveys reportedly gave higher counts under looser definitions; those primary PDFs
were not opened this session and are not cited.)

**Methodology caveat:** this 2020 survey was funded by Premier Needle Arts — the parent of Handi Quilter
and Quilt Pro Systems (an EQ8 competitor), among others — and was emailed to brand/consumer lists (~1M
invites, ~20,000 responses, roughly 2% response rate); commenters on the source page itself flag the
self-selection and age bias [S1]. The 2021 iteration put the figure at 10–12M and the 2022 iteration back
at 9–11M, so the order of magnitude is stable even though the exact band moves year to year [S1b].
Treat the demographic profile as vendor-adjacent and upwardly-skewed, but the ~9–11M order of magnitude is
consistent across years.

Who actually designs quilts in software:

- **Hobbyists** (the bulk): lay out block-based quilts, audition fabrics, print yardage/cutting charts.
  This is exactly what EQ8 sells: "Design your own quilts and blocks and print them at any size you want!
  ... Print your fabric yardage estimates, foundation patterns, rotary-cutting charts, or templates!" [S2].
  Vendor lessons show the same workflow (sashing, block spotlight challenges) [S23].
- **Pattern designers who sell patterns**: EQ runs an "EQ Artists" directory of designers using the tool
  and sells add-on quilt/block/fabric libraries by named designers (Karen K. Stone, Judy Martin, Kimberly
  Einmo) [S2]. Newer commercial tools court this segment explicitly: PreQuilt's Market plan ($100/yr) lets
  designers sell digital coloring pages of their patterns; QuiltLab's paid Maker plan adds imports and
  publishing [S9].
- **Teachers, shops and guilds**: Electric Quilt operates a credential system and a "Hire an EQ Teacher"
  directory for teaching EQ8 "at your quilt shop, guild meeting, or other event", plus in-person EQ Academy
  and online EQ At Home classes [S24]. Competitors mirror this (Quarter Inch invites "Teachers, quilt shops
  and guilds" to contact them) [S9]. Teaching is a real channel: an alternative tool inherits no teachers,
  which is an adoption moat (see §9–10).
- **Longarm / machine-guided quilters**: use computerized quilting systems (Handi Quilter Pro-Stitcher,
  Gammill Statler, APQS Quilt Path, IntelliQuilter) that consume vector quilting-design files in formats
  like QLI, HQF, DXF, IQP [S16]. Notably EQ8 itself cannot export to these machines [S11]; designers of
  machine-quilting motifs use dedicated software (e.g., Pro-Stitcher Designer, which advertises
  "Compatible with all major longarm quilting file formats; Import and export vector formats") [S17].
- **Die-cutting users** (AccuQuilt GO!): a hardware-adjacent workflow; EQ sells official AccuQuilt block
  add-ons matched to die shapes [S2].

## 2. The incumbent: Electric Quilt 8 (EQ8)

Verified from the vendor's own shop and support pages:

- **Price / license**: US$239.95 one-time (Windows download, Mac download, or physical License Card).
  "This product is a single-user license and includes 2 activations per license. Once the software is
  purchased, the license is non-transferable." [S2] — **the issue's $239.95 figure is confirmed.**
  Running on both Windows and Mac requires the $24.95 Migration Kit [S2][S3].
- **Activation**: unlimited installations, two computers simultaneously active, activations transferable
  between machines; internet required for download, activation and "periodic validation" (offline use OK) [S3].
- **Platforms**: Windows 7 SP1 (min) through Windows 11; macOS 10.13 (min) through macOS Tahoe 26 /
  Sequoia 15 (recommended); Intel and M-series Macs. Explicitly no Chromebook/iPad/Android/iOS, no
  Windows-on-ARM, no Windows S mode, no Linux [S3].
- **Mac architecture status**: the Mac build is not Apple-Silicon-native — the vendor states that on an
  M-series Mac "you will need Rosetta installed in order to run EQ8" [S5a], and its own release notes say
  the M1 update 3.2.0.4 fixed _lag_ but "does not add compatibility for the new Apple Silicon M1 chip"
  [S8]. A separate "Wine Error" support article (printing/saving/importing failures) is consistent with a
  Wine-based Mac build, though the vendor does not say so outright on that page — treat "runs under Wine"
  as an inference from these three facts, not a direct statement [S5]. The vendor said in 2021 that EQ8
  "fully supports" M1 Macs after 3.2.0.4 fixed the lag issues [S4]. In 2026 Apple announced Rosetta removal
  in macOS 28 (fall 2027) [S7]; Electric Quilt published "macOS 28 Compatibility with EQ" (updated
  2026-05-22): "Apple will be phasing out the use of Rosetta 2 in the fall 2027 release of macOS 28. We are
  aware of this update and **will have a solution in place before the release of macOS 28**" [S6].
  **Verdict on issue claims: "Mac version depends on Rosetta" is substantively true (Wine/x86 build, and
  the vendor's own page treats Apple's Rosetta phase-out as an EQ problem); "vendor has not committed to a
  v28 solution" is false — the vendor committed publicly in May 2026 [S6].**
- **Release/update history**: company founded 1991 (Dean Neumann; first release a DOS program) [S25];
  EQ8 released October–November 2017 (upgrade 2017-10-23, full version 2017-11-13) [S26]. Current versions
  per the vendor's update page: Windows 1.1.0.6 (released 2025-02-28), Mac 3.2.0.7 (released 2023-11-10;
  requires macOS 10.13+) [S8]. Mac build has had no update in ~3 years; Windows gets occasional bug-fix
  releases (e.g., a crash fix when switching worktables on the Print & Export tab) [S27].
- **Content ecosystem (add-ons)**: EQ8 ships 6,200 manufacturer fabrics and "6,000+ copyright-free blocks";
  paid add-ons: EQ Stash fabric downloads (1,000+ fabrics each, manufacturer collections), BlockBase+
  (4,264 blocks from Barbara Brackman's _Encyclopedia of Pieced Quilt Patterns_, standalone or linked to
  EQ8), designer quilt/block libraries, AccuQuilt GO! die-matched blocks, Kaleidoscope paper-piecing packs,
  Dear Jane, plus an annual "EQ Membership" with free Stash downloads and discounts [S2].

## 3. Other proprietary tools

From NiftyFifty's comparison page (a competitor, "Updated August 2026 · prices checked against each
vendor's site") plus each vendor's own pages opened this session. Treat positioning language skeptically;
prices not confirmed this session are marked inline [S9]:

| Tool                                       | Platform         | Price                                                                           | Notes                                                                                                      |
| ------------------------------------------ | ---------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Electric Quilt 8                           | Win/Mac          | $239.95 once (+$24.95 2nd platform)                                             | deepest feature set; no iPad/Chromebook [S2][S9]                                                           |
| QuiltLab (unverified)                      | web              | free plan; paid Maker plan (price not captured)                                 | "modern alternative to EQ8"; EQ8 .pj8 import on the paid plan [S9]                                         |
| NiftyFifty                                 | web (any device) | free                                                                            | full Quilt Designer + Pattern Designer + FPP maker; covers EQ8's core block→layout→yardage→print loop [S9] |
| PreQuilt                                   | web              | subscription; Market plan $100/yr                                               | solid-color cards, fabric calculator, designer coloring-page market [S9]                                   |
| TideStitch (unverified)                    | iPad/Mac/iPhone  | free (4 designs); one-time purchase, no subscription (exact price not captured) | true-scale fabric tiling, eighths measurements, FPP add-on [S9]                                            |
| Quiltler 3                                 | iPhone/iPad/web  | free first quilt; $7.99/mo or $49.99/yr                                         | explicitly does NOT import EQ8 projects [S9][S10]                                                          |
| Fern Mountain Quilt Architect (unverified) | Mac/Win          | one-time purchase (price not captured)                                          | photo/sketch → FPP patterns, no Y-seams [S9]                                                               |
| QuiltPop (unverified)                      | iPhone/iPad      | free                                                                            | layouts + printable FPP blocks [S9]                                                                        |
| Quiltography (unverified)                  | iPad             | $14.99 once                                                                     | yardage/stash; aging, iPad-only [S9]                                                                       |
| Quarter Inch                               | iPad/Mac/web     | Free plan (3 quilts); Quilter $9/mo or $89/yr                                   | imports .pj8 (free to open/view, with an import report) [S34]                                              |
| Design N Quilt                             | Win              | $799.99 SRP                                                                     | fabric-realistic design + "cut as you go"; priced well above EQ8 [S28]                                     |
| BlockBase+                                 | Win/Mac          | EQ add-on/standalone (price not captured this session)                          | block encyclopedia database, prints charts/templates/foundations [S2]                                      |
| Pro-Stitcher Designer                      | Win              | paid (longarm ecosystem)                                                        | machine-quilting motif design, multi-format longarm export [S17]                                           |

**Verdict on issue claims**: Quiltler "$49–99/yr" — the supportable figure is $7.99/mo or $49.99/yr [S10].
The issue's "Quarter Inch $89/yr" figure is **confirmed** (its annual price); the earlier draft's claim that
Quarter Inch is a "one-time purchase, no subscription" was **wrong** — it is a freemium subscription (Free /
$9/mo / $89/yr) [S34]. Frog & Thread could not be verified this session (not opened); treat as unconfirmed.
The broader point stands, and is stronger than the draft stated: several web/iPad competitors attack EQ8 on
price and platform reach, **and at least one (NiftyFifty) is free** and already covers the core
block→layout→yardage→print loop — though none is FOSS [S9].

## 4. Existing FOSS — the decisive check

**Bottom line: no maintained FOSS project covers most of this need.** The search was deliberately broad;
results below.

Searches run (all 2026-10-11):

- **GitHub** (`gh search repos`, ≥14 queries): "quilt design", "quilting software", "quilt block",
  "foundation paper piecing", "quilt yardage", "half square triangle", "quilt pattern generator",
  "patchwork design", "quilt maker", "quilt editor", "quilting pattern", "quilt fabric calculator",
  plus German ("quilten software", "patchwork muster"), French ("courtepointe", "quilt logiciel"),
  Spanish ("acolchado software", "patrón quilt"), Japanese ("キルト パターン", "キルト デザイン") [S12].
  Non-English queries returned zero quilt-design results. The `quilt` topic/keyword is dominated by the
  unrelated Minecraft "Quilt" mod loader and data-tooling projects [S12].
- **GitLab** API project search "quilt" [S13], **Codeberg** API repo search "quilt" [S14],
  **SourceForge** directory search "quilt" [S15], **F-Droid** search "quilt" (zero apps) [S18],
  **Flathub** API searches "quilt"/"quilting"/"patchwork" (zero dedicated apps; only Seamly2D surfaces) [S19].
- **Inkscape ecosystem**: `gh search repos "inkscape quilt"` → nothing; "inkscape sewing" →
  slspencer/InkscapeSewingPatternExtensions (5★, dormant since 2022) [S12]. No quilt-specific Inkscape
  extension found.

Projects that are more than toys, and what they lack:

| Project                    | URL                                   | License            | Stars | Last push                    | What it is / lacks                                                                                                                                                   |
| -------------------------- | ------------------------------------- | ------------------ | ----- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seamly2D                   | github.com/FashionFreedom/Seamly2D    | GPL-3.0            | 988   | 2026-10-10 (active)          | **Garment** pattern-drafting CAD (measurements, multi-size). Not quilt-block/yardage/fabric-audition oriented; wrong domain model for quilts [S20][S19]              |
| Ink/Stitch                 | github.com/inkstitch/inkstitch        | GPL-3.0            | 1,364 | 2026-10-11 (active)          | Machine-**embroidery** digitizing Inkscape extension. Adjacent craft, not pieced-quilt design [S21]                                                                  |
| neonfuzz/svg_quilter       | github.com/neonfuzz/svg_quilter       | MIT                | 8     | 2025-07-29 (dormant)         | Python: SVG line art → foundation-paper-piecing pattern sheets (grouping, labeling, nesting). Single-function CLI, no block library, no fabric/yardage, no UI [S16a] |
| TetonTopo/quiltblock       | github.com/TetonTopo/quiltblock       | MIT                | 0     | 2026-09-23 (one-day project) | Geometry → seam-allowance math, cutting lists, pressing plans. Early-stage, no library/UI [S16b]                                                                     |
| william-pyle/QuiltDesigner | github.com/william-pyle/QuiltDesigner | GPL-3.0            | 0     | 2026-05-22 (single day)      | "Design Quilts, generate fabric requirements, print instructions" — stub [S16c]                                                                                      |
| JesseRWeigel/quiltsmith    | github.com/JesseRWeigel/quiltsmith    | MIT                | 0     | 2026-08-13 (single day)      | Generative block engine w/ yardage + embroidery export — stub [S16d]                                                                                                 |
| rhjones/quiltr             | github.com/rhjones/quiltr             | none (NOASSERTION) | 11    | 2016 (abandoned)             | Web block-layout toy; confirms issue's "11 stars" claim [S12]                                                                                                        |
| awalsh17/quiltR            | github.com/awalsh17/quiltR            | MIT                | 3     | 2022                         | R plotting of quilt layouts; confirms issue's claim [S12]                                                                                                            |
| RFQuiltLayout              | github.com/bryceredd/RFQuiltLayout    | MIT                | 866   | 2020                         | iOS UICollectionView layout named "quilt" — unrelated to quilting [S12]                                                                                              |

Free-but-not-FOSS (relevant context, verified partially this session): QuiltAssistant (vendor states it
"is not designed to be a cheap alternative to commercial software like Electric Quilt"; photo-to-pattern
niche; last release v2.25, April 2013; can export designs _to_ EQ formats) [S22]; PatternJam (free web,
preset patterns; not opened this session — from the issue, unverified); **NiftyFifty** — the significant
one: a free, proprietary browser suite (Quilt Designer + Pattern Designer + FPP maker) that the vendor and
its own comparison page describe as covering EQ8's core "draw a block → lay out the quilt → print yardage
and cutting chart" loop for free, with no source repository found this session [S9]. F-Droid has **no**
quilting app at all [S18].

**Conclusion for criterion (b): nothing maintained and FOSS covers block authoring + block library +
fabric audition + yardage/cutting math + printable patterns. The closest active FOSS neighbors
(Seamly2D, Ink/Stitch) serve different crafts. The FOSS niche is genuinely empty — but the _free-proprietary_
niche is not: NiftyFifty (and to a lesser degree PreQuilt) already cover much of the core loop for $0. That
does not disqualify under criterion (b), which is about maintained FOSS, but it raises the bar for what a
useful first version must do (see §9–10).**

## 5. What users say is wrong

The same three complaints recur across forums, reviews and the competitors' own pages [S9]:

- **Price.** US$239.95 (plus $24.95 for a second platform) is the most-quoted gripe; NiftyFifty's
  comparison FAQ names it first, alongside "the learning curve (the most common word is 'frustrating')" [S9].
- **Learning curve.** Quilting Board's "To EQ8 or not?" thread: "there is a huge learning curve… when I'm
  in a hurry I just use my old method" [S29]; r/quilting's "Should I buy EQ8?" calls it "a bit clunky" with
  a learning curve, worth it only "as long as you are tech savvy" [S30]; a PatternReview thread calls it "a
  steep learning curve" [S32].
- **Desktop lock-in.** EQ8 has no iPad/iPhone/Android/Chromebook version, and running it on both a Mac and
  a PC needs the paid Migration Kit [S3][S9]. Quiltler's EQ8-alternative page makes "no iPad, iPhone,
  Android or Chromebook version" its headline [S10].
- **Mac decay / Rosetta uncertainty.** Quarter Inch's guide "EQ8 on macOS 27 and 28: what Mac quilters
  need to know" documents that EQ8 for Mac relies on Rosetta today and that its future past macOS 27
  depends on a not-yet-specified vendor fix [S34].
- **Proprietary project files.** Most rivals cannot open `.pj8`; Quiltler explicitly does not import it
  [S10], and Quarter Inch markets "open your .pj8 projects free" as a headline feature — lock-in real
  enough that a competitor sells against it [S34].

The praise side is real too: owners who climb the curve call EQ8 unmatched for whole-quilt layout, block
drawing and yardage ("EQ8 is the be all end all for quilting design" [S46]; the r/quilting QuiltAssistant-vs-
EQ8 thread likewise credits EQ8 for whole-quilt layout [S31]). The gap is not capability; it is cost,
difficulty and platform.

## 6. Content the software depends on

- **Block libraries.** The classic block _designs_ (Nine Patch, Log Cabin, Ohio Star, …) are traditional and
  long public domain as ideas; what can be protected is a particular _drawing_ or _compilation_. EQ8
  advertises its blocks as "6,000+ copyright-free" and its Kaleidoscope add-ons as "1,000+ copyright-free"
  [S2]. BlockBase+ (4,264 blocks) is built on Barbara Brackman's _Encyclopedia of Pieced Quilt Patterns_ — a
  copyrighted book whose illustrations and lookup system are not free to copy even though the underlying
  blocks are [S2].
- **Fabric libraries.** EQ8 ships "6,200 fabrics from top manufacturers" [S2]; these are manufacturers'
  copyrighted swatch images, and EQ Stash downloads are licensed for EQ use. A FOSS tool cannot ship
  manufacturer fabric images.
- **What a FOSS tool can ship day one:** (1) a _parametric_ block library — block definitions as geometry
  plus traditional names (facts/ideas, not copied artwork); (2) solid colours and a few procedurally
  generated textures; (3) user-imported fabric photos (photograph/scan your own stash). This is how the web
  competitors already do it: PreQuilt ships "real solid-fabric libraries (Kona, AGF, Moda)" under licence,
  and users import their own prints [S9]. Block _names_ are the one thing to check case-by-case (a few may
  be trademarked — see §10).

## 7. File formats and interchange

- **EQ8's own project file** is `.pj8` (also `.pj7` for EQ7, `.eqm` for EQ Mini); it is proprietary with no
  public specification. This report records only what is publicly documented — the extension and save
  location [S35] — and does not analyse the format.
- **EQ8 export (publicly documented):** Export Image, Export Selection (Windows BMP), Export Metafile
  (Windows WMF/EMF, Block Worktable only — the vendor notes the WMF libraries are "copyrighted by
  Microsoft"), and Export to Facebook; **there is no longarm-machine export** [S11][S36]. BlockBase+ can
  export SVG [S23].
- **What quilters exchange:** PDF patterns (universal; public ISO 32000 spec); SVG (public W3C spec); DXF
  (AutoCAD, publicly documented); and machine-quilting/longarm formats — QLI, HQF, IQP, BQM, CQP, HQA, HQV,
  HQW, PAT, QCC, SSD — which are proprietary per machine vendor with no public specification [S16]. Cutting
  machines (AccuQuilt GO!) work from physical dies rather than software export; Cricut/Silhouette consume
  SVG/PDF (from memory, unverified).
- **Clean-room implication:** PDF/SVG/DXF export is unencumbered; importing `.pj8` (or emitting
  QLI/HQF/IQP) touches proprietary formats and would have to stay inside the clean-room boundary.

## 8. The calculations

The arithmetic is small, well-documented, and already implemented in free online calculators — a strength,
since it can be clean-roomed from published formulas:

- **Seam allowance** is the standard ¼″.
- **Half-square triangles:** cut square = finished size + 7/8″ [S37][S38].
- **Quarter-square triangles:** cut square = finished size + 1¼″ (from memory, unverified; same family as
  HST + 7/8″) [S39].
- **On-point settings:** setting-triangle cut square = (finished block × √2) + 1¼″ seam allowance;
  sashing/cornerstones shift the "finished block" term used in the formula [S40].
- **Yardage:** quilting cotton ~42–44″ usable width; divide total strip length by usable width, multiply by
  strip width, round up to the next ⅛ yd [S41][S44].
- **Binding:** (quilt length + width) × 2 ÷ usable width → strip count; × strip width (2¼–2½″) → yardage
  [S42][S43].
- Reference implementations to check against: Quilter's Paradise's free binding/sashing calculators [S45]
  and Quarter Inch's published "cutting chart" examples (e.g. 58 squares @ 3⅞″ → 1⅜ yd) [S34].

## 9. A bounded first version

The smallest tool a quilter would switch to is the EQ8 core loop minus the catalogue: **draw a block
(shape-based, with symmetry mirroring), place blocks in a grid/sashing/border layout, colour them with your
own fabric photos or solid colours, and get a correct yardage + rotary-cutting chart as a printable
PDF/SVG.** That is precisely what NiftyFifty already gives away free in the browser [S9], so a FOSS version
must match that _and_ add a reason to exist (freedom, self-hosting, no account, open file format).

**Platform honesty:** the project's preferences (Linux-first desktop, Android-first mobile) do not fit this
audience. The users are retired women in their 60s on Windows and Mac desktops, increasingly with iPads
[S1]; EQ8's weakness is being _desktop-only_, and the winning web competitors are browser/iPad, not Linux or
Android. A Linux-first desktop build would reach essentially none of the actual quilters, and Android-first
mobile almost none (the mobile-quilting audience is iOS). **The pragmatic fit is a browser app (PWA) that
runs on Windows, macOS, iPad and Chromebook with zero install**, optionally wrapped as a desktop binary that
ships Windows and macOS first and Linux last. This tension should be settled with the maintainer before
committing (see §10 and Unresolved questions).

A plausible three-month v1: block editor (grid snap, symmetry, HST/QST/flip tools) + ~40 classic blocks
defined parametrically + fabric import/solid colours + the §8 maths + PDF/SVG print. Excluded from v1:
`.pj8` import, longarm export, the 6,000-block/6,200-fabric catalogue, foundation-paper-piecing
auto-generation, and pattern-marketplace features.

## 10. Risks

- **Trademark / branding.** "Electric Quilt", "EQ", "BlockBase", "EQ Stash" and product names are
  trademarks; do not reuse them. Most classic block names are generic, but a minority may be trademarked or
  strongly tied to a designer's book (e.g. "Dear Jane"). _Open question, not a conclusion:_ which block
  names and product terms are safe to use.
- **Copyright / compilation.** Brackman's _Encyclopedia of Pieced Quilt Patterns_ (the BlockBase+ source)
  is copyrighted; its illustrations and lookup system must not be copied. Fabric swatch images are
  manufacturer-copyrighted and cannot be redistributed. _Open question:_ what counts as copying a
  "compilation" of block geometry vs. independently enumerating the same traditional blocks.
- **`.pj8` import and clean-room.** No public spec exists; any import would rest on lawful observation only.
  _Open question:_ whether `.pj8` import is worth the clean-room risk in a v1, given Quarter Inch already
  opens `.pj8` for free.
- **Data / lock-in.** Users' value is trapped in `.pj8` and in EQ's add-on libraries; a switcher must
  re-enter blocks and fabrics. Mitigations: open format, import from PDF/SVG, and (later) `.pj8`.
- **Adoption.** The incumbent has a teacher/credentialing channel, a designer ecosystem (EQ Artists), and
  ~30 years of brand loyalty; the audience is non-technical. Free proprietary rivals (NiftyFifty, PreQuilt)
  already occupy the "free web tool" position a FOSS project would target.
- **Sustainability.** A non-commercial FOSS project cannot license manufacturer fabric catalogues, so it
  depends on user-imported fabric and community block definitions — a thinner content model than EQ's.

---

## Evidence register

Access date for every row: 2026-10-11. "Not checked" means licence/terms were not assessed.

| ID     | URL                                                                                                                                                       | Terms / license     | Establishes                                                                                                                                                                                                                                           | Supports §    |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| S1     | craftindustryalliance.org/quilting-trends-survey-results-2020/                                                                                            | not checked         | 2020 Premier Needle Arts survey: $4.2B market; 9–11M NA quilters; 98% female / 65% retired; "retired woman in her 60s… $74,000… 8–10 quilts/yr… 6–10 hrs/wk"; 46% search online daily; survey funded by PNA (owns Quilt Pro Systems)                  | 1, 5, 9       |
| S1b    | craftindustryalliance.org/the-size-of-the-quilting-market-quilting-trends-survey-results-2021/                                                            | not checked         | 2021 iteration: 10–12M quilters; 2022 PDF (fabshopnet) repeats 9–11M                                                                                                                                                                                  | 1             |
| S2     | electricquilt.com/online-shop/electric-quilt-8/ (+ /category/electric-quilt-8-eq8/, /online-shop/blockbase/)                                              | not checked         | $239.95; single-user, 2 activations, non-transferable; $24.95 Migration Kit; "6,200 fabrics"; "6,000+ copyright-free blocks"; BlockBase+ 4,264 blocks from Brackman's _Encyclopedia_; add-ons (AccuQuilt, EQ Artists, Stash, Kaleidoscope, Dear Jane) | 2, 6          |
| S3     | support.electricquilt.com/articles/eq8-system-requirements/                                                                                               | not checked         | Win 7 SP1–Win 11; macOS 10.13–Tahoe 26/Sequoia 15; M-series; no Chromebook/iPad/Android/iOS/ARM/S-mode/Linux; "internet required for activating, periodic validation; offline use OK"                                                                 | 2, 5          |
| S4     | support.electricquilt.com/articles/support-for-macos-big-sur/                                                                                             | not checked         | "EQ8 now fully supports… M1 chip"; 3.2.0.4 (2021-05-19) fixed lag                                                                                                                                                                                     | 2             |
| S5     | support.electricquilt.com/articles/wine-error/                                                                                                            | not checked         | "Wine error" support article (image import/printing/install) — consistent with a Wine-based Mac build                                                                                                                                                 | 2             |
| S5a    | support.electricquilt.com/articles/what-is-rosetta/                                                                                                       | not checked         | M-series Macs "will need Rosetta installed in order to run EQ8"                                                                                                                                                                                       | 2             |
| S6     | support.electricquilt.com/articles/macos-28-compatibility-with-eq/                                                                                        | not checked         | Vendor: "will have a solution in place before the release of macOS 28" (updated 2026-05-22)                                                                                                                                                           | 2             |
| S7     | support.apple.com/en-us/102527                                                                                                                            | not checked         | Rosetta available through macOS 27; from macOS 28 "only for certain older, unmaintained games"                                                                                                                                                        | 2             |
| S8     | electricquilt.com/product-updates/eq8-updates/eq8-update-release-notes/                                                                                   | not checked         | Windows 1.1.0.6 (2025-02-28); Mac 3.2.0.7 (2023-11-10); 3.2.0.4 "does not add… Apple Silicon M1"                                                                                                                                                      | 2, 4          |
| S9     | niftyfiftyquilting.com/quilt-design-software/eq8-alternatives                                                                                             | not checked         | Competitor comparison ("Updated August 2026"); free NiftyFifty covers core loop; "three complaints" = price / learning curve / desktop lock-in; PreQuilt/Quiltler/TideStitch/Quiltography/StitchLogic/CinchQuilt pricing                              | 3, 4, 5, 6, 9 |
| S10    | quiltler.com/eq8-alternative + quiltler.com/terms                                                                                                         | not checked         | Quiltler does not import EQ8 .pj8; $7.99/mo or $49.99/yr                                                                                                                                                                                              | 3, 5          |
| S11    | support.electricquilt.com/articles/exporting-for-longarm-quilting-machines/                                                                               | not checked         | EQ8 has no longarm export                                                                                                                                                                                                                             | 2, 7          |
| S12    | GitHub search (`gh search repos`, ≥14 queries incl. DE/FR/ES/JA)                                                                                          | n/a                 | No maintained quilt-design repo; "quilt" dominated by Minecraft Quilt loader                                                                                                                                                                          | 4             |
| S13    | GitLab API projects?search=quilt                                                                                                                          | n/a                 | Zero quilt-design results (equilibrator, Minecraft-adjacent)                                                                                                                                                                                          | 4             |
| S14    | Codeberg API repos/search?q=quilt                                                                                                                         | n/a                 | Only bmad4ever/bmquilting (0★) quilt-adjacent; rest Minecraft                                                                                                                                                                                         | 4             |
| S15    | SourceForge directory ?q=quilt                                                                                                                            | n/a                 | No quilt-design software surfaced                                                                                                                                                                                                                     | 4             |
| S16    | support.oesd.com/article/152-formats-supported                                                                                                            | not checked         | Longarm/quilting formats QLI, HQF, IQP, BQM, CQP, HQA, HQV, HQW, PAT, QCC, SSD; DXF/SVG under vector                                                                                                                                                  | 2, 7          |
| S16a–d | github.com/neonfuzz/svg_quilter; TetonTopo/quiltblock; william-pyle/QuiltDesigner; JesseRWeigel/quiltsmith                                                | MIT/MIT/GPL-3.0/MIT | 8★/0★/0★/0★; single-function or stubs (via `gh api`)                                                                                                                                                                                                  | 4             |
| S17    | prostitcher.com/prostitcher-designer/                                                                                                                     | not checked         | Pro-Stitcher Designer: "compatible with all major longarm formats; import/export vector"                                                                                                                                                              | 2, 3          |
| S18    | search.f-droid.org/?q=quilt                                                                                                                               | n/a                 | "F-Droid does not have any apps matching… quilt"                                                                                                                                                                                                      | 4             |
| S19    | flathub.org/api/v2/search (quilt/quilting/patchwork)                                                                                                      | n/a                 | No dedicated quilt-design app; Seamly2D is the only sewing-adjacent hit (exact set not re-confirmed)                                                                                                                                                  | 4             |
| S20    | github.com/FashionFreedom/Seamly2D                                                                                                                        | GPL-3.0             | 988★, active 2026-10-10; garment CAD, wrong domain                                                                                                                                                                                                    | 4             |
| S21    | github.com/inkstitch/inkstitch                                                                                                                            | GPL-3.0             | 1,364★, active; machine embroidery, not pieced quilts                                                                                                                                                                                                 | 4             |
| S22    | quiltassistant.com/free-quilt-design-software                                                                                                             | not checked         | "not designed to be a cheap alternative…"; v2.25 (April 2013); can export to EQ formats                                                                                                                                                               | 4             |
| S23    | doyoueq.com/blog/2023/12/design-discover-sashing-without-cornerstones/ + doyoueq.com/blog/2021/03/eq8-lessons-with-yvonne-using-svg-files-from-blockbase/ | not checked         | Sashing lessons; BlockBase+ SVG export                                                                                                                                                                                                                | 1, 7          |
| S24    | classes.electricquilt.com (teachersforhire / eq-teacher-credentials / class-catalog)                                                                      | not checked         | Hire-an-EQ-Teacher directory, credential program, EQ Academy (in-person) and EQ At Home (online)                                                                                                                                                      | 1             |
| S25    | electricquilt.com/home/about-electric-quilt/                                                                                                              | not checked         | Founded 1991; Dean Neumann; first program a DOS app                                                                                                                                                                                                   | 2             |
| S26    | doyoueq.com/blog/2018/10/happy-1st-birthday-eq8/ + doyoueq.com/blog/2017/10/announcing-electric-quilt-8/                                                  | not checked         | EQ8 released 2017-10-23 (upgrade) / 2017-11-13 (full)                                                                                                                                                                                                 | 2             |
| S27    | electricquilt.com/product-updates/eq8-updates/eq8-update-release-notes/                                                                                   | not checked         | Windows 1.1.0.6 fixed "switching worktables on Print & Export… crash"                                                                                                                                                                                 | 2             |
| S28    | onpointquilter.com/blog/design-n-quilt-software-versus-electric-quilt-8                                                                                   | not checked         | Design N Quilt SRP $799.99 (retailers discount to ~$160–400)                                                                                                                                                                                          | 3             |
| S29    | quiltingboard.com/main-f1/eq8-not-t306667.html                                                                                                            | not checked         | "huge learning curve"                                                                                                                                                                                                                                 | 5             |
| S30    | reddit.com/r/quilting/comments/1n2aodx/should_i_buy_eq8/                                                                                                  | not checked         | "clunky… learning curve… worth it if you are tech savvy"                                                                                                                                                                                              | 5             |
| S31    | reddit.com/r/quilting/comments/15tpp3h/quiltassistant_vs_eq8/                                                                                             | not checked         | EQ8 strong for whole-quilt design; weak elsewhere                                                                                                                                                                                                     | 5             |
| S32    | sewing.patternreview.com/SewingDiscussions/topic/130298                                                                                                   | not checked         | "steep learning curve"                                                                                                                                                                                                                                | 5             |
| S34    | quarterinch.app (+ /guides/eq8-macos-27)                                                                                                                  | not checked         | Quarter Inch free/$9-mo/$89-yr; opens .pj8 free; "EQ8 for Mac relies on Rosetta today"                                                                                                                                                                | 3, 5, 8       |
| S35    | support.electricquilt.com/articles/creating-new-projects-2/                                                                                               | not checked         | EQ8 project files use extension \*.PJ8                                                                                                                                                                                                                | 7             |
| S36    | support.electricquilt.com/articles/export-a-quilt/                                                                                                        | not checked         | EQ8 export options (image/selection/metafile/Facebook); WMF libs "copyrighted by Microsoft"                                                                                                                                                           | 7             |
| S37    | jacquelynnesteves.com/half-square-triangle-hst-cheat-sheet-and-tutorial/                                                                                  | not checked         | HST cut square = finished + 7/8″                                                                                                                                                                                                                      | 8             |
| S38    | blog.wholecirclestudio.com/tutorial-formulas-3-easy-ways-to-make-half-square-triangles-hsts/                                                              | not checked         | HST formulas (2- and 8-at-a-time)                                                                                                                                                                                                                     | 8             |
| S39    | reddit.com/r/quilting/comments/1fo7ov9/…                                                                                                                  | not checked         | Square +½″, HST +7/8″ seam allowance                                                                                                                                                                                                                  | 8             |
| S40    | thequiltingnook.wordpress.com/…/on-point-setting-with-sashing-and-cornerstones-1.pdf                                                                      | not checked         | On-point setting-triangle formula                                                                                                                                                                                                                     | 8             |
| S41    | stitchinheaven.com/blogs/quilting/how-much-fabric-for-a-quilt                                                                                             | not checked         | Yardage / binding strip-count method                                                                                                                                                                                                                  | 8             |
| S42    | onpointquilter.com/blog/calculating-yardage-for-binding                                                                                                   | not checked         | Binding formula                                                                                                                                                                                                                                       | 8             |
| S43    | lilysquilts.blogspot.com/2012/10/quilt-math-part-i-calculating-binding.html                                                                               | not checked         | Binding strips × width                                                                                                                                                                                                                                | 8             |
| S44    | mrsquilty.com/blogs/news/how-to-calculate-fabric-for-a-quilt-without-the-confusing-math                                                                   | not checked         | 42–44″ usable width                                                                                                                                                                                                                                   | 8             |
| S45    | quiltersparadiseesc.com/Calculators/Binding Calculator.php                                                                                                | not checked         | Reference binding calculator                                                                                                                                                                                                                          | 8             |
| S46    | sewing.patternreview.com/SewingDiscussions/topic/122716                                                                                                   | not checked         | "EQ8 is the be all end all for quilting design"                                                                                                                                                                                                       | 5             |

## Facts, inferences, proposals

**Facts (sourced):** (1) 9–11M NA quilters, $4.2B market (2020 survey, vendor-funded). (2) EQ8 is
US$239.95, two activations, non-transferable, $24.95 second-platform Migration Kit; 6,200 fabrics +
6,000+ blocks shipped; BlockBase+ = 4,264 blocks from Brackman's book. (3) EQ8 is Windows/macOS desktop
only; the Mac build is Intel/Rosetta (not Apple-Silicon-native); Apple is removing Rosetta in macOS 28 and
EQ has publicly promised a fix. (4) EQ8 exports image/selection/metafile/Facebook but no longarm formats;
its project file is proprietary `.pj8`. (5) No maintained FOSS quilt-design tool exists (GitHub/GitLab/
Codeberg/F-Droid/Flathub/SourceForge checked); closest FOSS are Seamly2D and Ink/Stitch, different crafts.
(6) NiftyFifty is a free proprietary browser suite covering the core block→layout→yardage→print loop.

**Inferences (not directly stated by a source):** (a) The Mac build "runs under Wine" is inferred from the
Wine-Error article + the Rosetta requirement + "does not add Apple Silicon" release note. (b) The learning
curve and platform lock-in, not capability, are the real adoption gaps. (c) A browser/PWA (or
Windows-macOS-first desktop) is the platform that would actually reach these users; Linux-first/Android-
first would not.

**Proposals (for the maintainer, not decisions):** (1) Narrow to a block-authoring + parametric-block-
library + fabric-import + yardage/cutting-chart tool with PDF/SVG export. (2) Ship browser-first (PWA),
Windows/macOS desktop second, Linux last — and resolve the Linux-first policy tension explicitly. (3)
Exclude `.pj8` import and longarm export from v1. (4) Use published formulas (S37–S45) as the clean-room
basis for the maths.

## Unresolved questions

1. Will the maintainer accept a browser-first (non-Linux-first) delivery, given DECISIONS #12? If not, this
   target should be declined — the audience is not on Linux or Android.
   **Resolved 2026-10-28:** the maintainer chose browser first; see [decisions](decisions.md).
2. Which block names / product terms are trademarked or risky (e.g. "Dear Jane"), and which are generic?
3. Does independently enumerating traditional block geometry risk copying Brackman's "compilation"?
4. Is `.pj8` import worth the clean-room effort at all, given Quarter Inch opens it free today?
5. How much of the "6,200 fabrics" / "6,000+ blocks" would a community actually need on day one to switch,
   vs. importing their own fabrics and ~40 classic blocks?

## Recommendation (detailed)

**Pursue, but narrowed — and contingent on platform.** The need is real and documented (criterion a), and
there is genuinely no maintained FOSS covering it (criterion b), so the FOSS case is sound. The narrowing:
build the EQ8 core loop (block authoring, small parametric block library, fabric import, yardage/cutting
maths, PDF/SVG print) rather than the catalogue; ship browser-first, not Linux-first. The contingency: if
the maintainer is unwilling to relax the Linux-first preference, this target should be **declined**, because
the audience is Windows/macOS/iPad and a Linux- or Android-first build would serve almost no one.

**Confidence: medium.** The single finding that would change it: the presence of a maintained FOSS
competitor (none found) — or a maintainer decision that Linux-first is non-negotiable (which would flip the
recommendation to decline).

---

## Specification research (2026-10-28)

Five research tracks gathered evidence for the functional specification. The reports, with their
evidence registers (IDs A1 to A78, B1 to B19, C1 to C19, D1 to D21 and E1 to E52), the
claims files and the method are in [spec-research](spec-research/README.md). Links in every report
were probed, cited repositories looked up, and quoted claims matched against the cited pages.
The orchestrator re-derived the formulas the proposals rest on. Nothing below is an approved
requirement.

**Decided since the nomination research:** browser first ([decisions](decisions.md)).

### What the research establishes

- **Arithmetic** (track A). A quarter-inch seam allowance (6 mm in metric). Squares, rectangles and
  strips are cut at finished size plus 1/2 inch; half-square triangles made two at a time at plus
  7/8; eight at a time from (finished + 7/8) x 2; quarter-square triangles at plus 1 1/4. Cut
  sizes and yardage round up to the next 1/8 (inch or yard). Yardage is strips cut across a usable
  width of 40 to 42 inches, then subcut; public calculators all do this greedily, and no maintained
  FOSS calculator exists. Metric quilting still works mostly in inches; metric cotton is 110 to 112
  cm wide and sold by the metre. "Standard" bed and quilt sizes disagree by up to 30 inches.
- **Blocks and their sources** (track B). Squares, rectangles, half- and quarter-square triangles
  and flying geese cover the traditional blocks that need only straight seams and no set-in seams.
  Diamond stars, hexagons and curves each need a different kind of seam. Works published in 1930 or
  earlier are in the US public domain as of 2026; that covers Marie Webster's 1915 book (on Project
  Gutenberg) and the Ladies Art Company catalogues (about 1897 to 1928, reproduced by the Quilt
  Index). The Copyright Office's Compendium excludes common geometric shapes and says a pattern
  book's registration does not cover the individual pattern pieces. The live risk is names:
  "Dear Jane" is a registered trademark. Track B lists 58 candidate blocks, 48 of them straight-seam.
- **Layouts** (tracks D and A). Straight sets, sashing with or without cornerstones, alternate plain
  blocks, rows, medallions and borders each reduce to a short rule. Only the on-point setting needs
  non-obvious geometry: side triangles from squares of block x 1.414 + 1 1/4 cut twice diagonally,
  corner triangles from squares of block / 1.414 + 7/8 cut once, both rounded up to 1/8.
- **Foundation paper piecing** (track D). A 2021 SIGGRAPH paper (Leake, Bernstein, Davis and
  Agrawala) gives an exact test for whether a design can be paper-pieced and a way to find the
  order; a 2022 Bridges paper extends it. No released implementation was found; svg_quilter (MIT)
  has been dormant since 2025-07. Printing a pattern whose sections and order the quilter marks is
  far smaller than finding a sewable split automatically.
- **Fabric photos** (tracks D and C). Tools set real-world scale from a ruler in the photo, from
  cropping at the repeat, or from a typed size. Phone photos cannot give accurate colour.
- **Printing** (tracks C and D). The most dangerous step for the quilter. Viewers and browsers often
  default to fit-to-page, which shrinks templates by a few percent. The universal remedy is to print
  at actual size and measure a printed test square. Large templates are tiled with overlap marks.
- **Users** (track C). Quilters still design on graph paper because it needs no maths or computer
  skills. The free browser tools (NiftyFifty, PreQuilt's free tier, Quiltler's free tier) cover the
  core loop; none is open source, and NiftyFifty's pages say "All rights reserved". WCAG 2.2 gives
  testable targets suited to older users. Five to eight participants are enough for each round of
  usability testing.
- **Platform and stack** (track E). A static site can be installed on an iPad and work offline, but
  Safari may evict stored data, so an exported project file must be the durable copy. Safari and
  Firefox lack the File System Access API, so opening and saving go through a file input,
  downloads and the share sheet. Leptos, Dioxus and Yew render to the DOM, which suits accessible
  controls and an SVG editing surface; egui draws to a canvas, and Slint's browser build has no
  screen-reader support. Permissively licensed crates cover geometry, PDF, SVG, images and colour.
  Whether they all build for WebAssembly, and how large and fast the result is, were not measured.

### Corrections made in review

1. **Half-square triangles four at a time.** Track A's "exact" formula, and the published charts it
   cites, cut too small. Sewing a quarter inch inside the edge of two squares and cutting both
   diagonals makes the seam segment (side - 1/2) the unit's diagonal, so the cut square is
   (finished + 1/2) x 1.414 + 1/2, about finished x 1.414 + 1 1/4. For 3-inch finished units that
   is 5 1/2 inches, not 5 (track A) or 4 1/4 (the chart). The same reasoning reproduces the
   familiar 7/8-inch rule for two at a time. The examples script now carries the corrected formula.
   Lesson for the specification: derive each formula from the geometry and test it, rather than
   copying a web chart; fabricmathtools.com (A11) disagrees with several independent sources.
2. **Wide backing.** Track A's 108-inch example lays the backing lengthwise (2 1/2 yards); turning
   it needs 2. The specification must say whether the tool turns pieces to save fabric.
3. **Block names are not block geometry.** Webster's name list shows that a name existed, not which
   block it named, and names varied by region. Each block's geometry needs a public-domain
   illustration before it ships.
4. **1931 to 1963 sources** (McKim, Hall and Kretsinger, Nancy Cabot) are in the public domain only
   if their copyright was not renewed. That check is still open.
5. **Device evidence** for quilters rests on vendors' marketing pages; no neutral survey was found.

### Candidate requirements

Consolidated from the tracks' proposals. Each is a proposal for the specification.

_Measurement and arithmetic_

1. Lengths are stored exactly, as whole sixteenths of an inch; values are rounded only when shown as
   a cut size, up to the next 1/8 inch (D, A).
2. Cut sizes follow the geometry: finished + 1/2 for squares, rectangles and strips; + 7/8 for
   two-at-a-time half-square triangles; (finished + 7/8) x 2 for eight at a time;
   (finished + 1/2) x 1.414 + 1/2 for four at a time; + 1 1/4 for quarter-square triangles; and the
   flying-geese and stitch-and-flip rules in track A. Each has an acceptance test from a worked example.
3. Yardage: pieces per strip = whole pieces across the usable width; strips = pieces needed / pieces
   per strip, rounded up; length = strips x strip width; total rounded up to the next 1/8 yard.
   Usable width, waste allowance and shrinkage allowance are settings.
4. Binding, backing and batting are calculated, with strip width, joining allowance and backing
   overhang as settings.

_Layout_

5. A quilt is a grid of block slots with rotation, optional sashing with or without cornerstones,
   and one or more borders with butted corners (D).
6. An on-point setting computes side and corner setting triangles by the formulas above, adding the
   sashing width to the block size when there is sashing (D, A).

_Blocks_

7. Blocks are defined as geometry on a grid in the project's own words, never copied from a modern
   compilation; each block records the public-domain source for its name and its geometry (B).
8. The first library contains only straight-seam blocks without set-in seams (B).
9. Trademarked or designer-tied names are screened and excluded by default (B).

_Fabrics_

10. A fabric is a solid colour or a photo with a stored scale, set by marking two points a known
    distance apart or by typing the repeat size; colour is treated as approximate (D, C).

_Printing_

11. Cutting charts and templates print at exact size on Letter or A4 and every page carries a 1-inch
    and a 1-cm test square; templates larger than a page are tiled with overlap and alignment marks;
    output is PDF and SVG (C, D, E).
12. Cutting charts list totals in yards and metres (C).

_Files, storage and privacy_

13. Designs save to a documented, versioned open format; older versions are upgraded into a new copy;
    unknown newer versions are refused without changing the file (E, C).
14. The user can always download or share the complete project file; anything kept only in the
    browser is labelled as recoverable but not guaranteed (E).
15. Files open and save on iPad Safari without the File System Access API (E).
16. After one online visit the app works offline, and no design, photo or usage data leaves the
    device; there is no telemetry (E, charter).

_Usability and accessibility_

17. Every action done by dragging can also be done by tapping or clicking; touch targets are at least
    24 by 24 CSS pixels; text resizes to 200 percent; text contrast is at least 4.5 to 1; colour is
    never the only signal; a greyscale preview shows fabric value (C).
18. A first-time quilter can lay out a quilt and print its cutting chart without a manual, shown by a
    five-to-eight-person usability test before the bar is declared met (C).

### Open decisions for the maintainer

Decided by the maintainer on 2026-10-30; see [decisions](decisions.md). The chosen option matches
the orchestrator's recommendation in every row except the stack, where it had recommended
measuring prototypes before choosing.

| Decision                 | Options                                                                              | Chosen Option                                                         | Evidence                 |
| ------------------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------ |
| Foundation paper piecing | Exclude from v1; quilter marks sections and order, tool prints; tool finds the split | Exclude from v1; make "quilter marks, tool prints" the first addition | D section 2              |
| On-point setting         | In v1 or later                                                                       | In v1: two formulas, and the charter's sampler needs it               | D, A                     |
| Other layouts            | Medallion, rows, mitered corners, pieced borders                                     | Defer all                                                             | D section 1              |
| Block library            | About 40 straight-seam blocks; also stars, hexagons, curves                          | About 40 straight-seam blocks                                         | B sections 1 and 5       |
| 1931 to 1963 sources     | Pre-1931 only; commission a renewal search                                           | Pre-1931 only for now                                                 | B section 2              |
| Units                    | Inches only; inches with metric totals and A4; full metric editing                   | Inches, with metric totals and A4 printing; full metric later         | A section 1, C section 6 |
| Fabric photo scale       | Ruler in photo; typed repeat; both                                                   | Both: they set the same scale factor                                  | D section 3              |
| Accessibility level      | WCAG 2.2 AA; AAA                                                                     | AA, with 44-pixel touch targets as the design goal                    | C section 5              |
| Usable fabric width      | 40 or 42 inches, as default                                                          | 40, changeable: buying short is worse than buying extra               | A section 4              |
| Yardage rounding         | 1/8 or 1/4 yard                                                                      | 1/8 yard                                                              | A section 4              |
| Bed-size presets         | Ship a table; leave them out                                                         | Leave out of v1; sources disagree too much                            | A section 3              |
| Cutting plan             | Greedy strips per size; mixed-size optimisation                                      | Greedy, as every public calculator does                               | A section 6              |
| Stack                    | A Rust DOM framework (Leptos, Dioxus, Yew); TypeScript                               | TypeScript                                                            | E sections 2 and 5       |
| Editing surface          | SVG with HTML controls; canvas                                                       | SVG with HTML controls, for accessibility                             | E section 2              |
| Project file             | JSON; ZIP of JSON and images; SVG with embedded data                                 | A single ZIP with versioned JSON and embedded fabric photos           | E section 6              |

### Still unknown, and next steps

- **Lawful observation of the free tool**: the protocol in
  [observations](observations/niftyfifty-sampler-protocol.md), carried out by a person.
- **Quilters' own view**: no quilter has been interviewed; the usability protocol in track C,
  section 7, could double as a first round.
- **Renewal search** for McKim (1931), Hall and Kretsinger (1935) and Nancy Cabot (from 1933), and a
  USPTO screen of the candidate block names.
- **Prototype measurements** on iPad Safari: download size, start-up time, memory with a large fabric
  photo, printing a generated PDF, and screen-reader behaviour.
- **Block geometry**: match each candidate block to a public-domain illustration.
