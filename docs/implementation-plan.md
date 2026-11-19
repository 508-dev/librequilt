# Implementation plan

**Source of truth.** This plan implements `docs/specification.md` at the commit the maintainer
approved, `b358fef4ed8c3a0c3c0a9a0419ab408ab3831d8c`, recorded in
`genairosity.json.specificationApproval`. Requirement IDs (`W-`, `G-`, `L-`, `F-`, `P-`, `D-`,
`A-`, `X-`), decided questions (`O-`) and acceptance tests (`T-01` to `T-13`) are that document's.
Numeric expectations come from `python3 docs/specification-fixtures.py`.

**Clean-room boundary.** This plan was written from the specification, the project contract files
and public documentation of the tools it names. Research records are outside the implementation
boundary. Where the specification is unclear, the question is written into
[Clarifications needed](#clarifications-needed) and nothing is chosen that would contradict the
specification meanwhile.

Status: tickets IMPL-01 and IMPL-02 are done (see [Ticket list](#ticket-list)). Nothing else is
started.

## Architecture

### Principles

The specification's own sentence sets the architecture: "A cutting chart is a physical promise."
Six invariants carry that promise, and the module boundaries exist to make each one checkable
rather than merely intended.

- **I1 — Nothing stored is a float.** A stored measurement is an integer count of sixteenths of
  an inch (`G-01`); everything else stored is an enumerated choice, an identifier, a count or a
  byte string. A fraction of an inch never exists as a `number`.
- **I2 — Rounding happens exactly twice, each time at the end of its chain.** A completed cut
  dimension rounds up once to the next eighth inch; one fabric's summed raw bolt length rounds up
  once to the next eighth yard (`G-02`). Both live in one module, so a third rounding site is
  visible in review.
- **I3 — A display value never re-enters a computation.** An irrational on-point dimension is
  shown to the nearest sixteenth and marked approximate (`L-04`); that number is a leaf of the
  graph, never an input.
- **I4 — The pure half imports no browser.** `core/`, `draw/` and `file/` may not import from
  `io/`, `ui/`, `platform/` or any browser global. The test runner gives them no DOM, so a
  violation fails rather than passes quietly.
- **I5 — A refusal a quilter can cause is a value, not an exception.** `W-02`, `D-02`, `F-06`,
  `P-03` and `A-01` all require a specific, understandable refusal; typed refusal values make the
  reason impossible to drop. A thrown error means a defect in librequilt itself.
- **I6 — The document is the only source of truth.** Everything a chart shows is a pure function
  of it, so `W-01`'s "changes update the finished size and material calculation from the design's
  actual geometry" holds by construction, not by remembering to recalculate.

### Module map

Each module names the requirements it owns. A module may import from modules above it in this
list and from its own layer, never from below.

#### `core/` — the domain. Pure: no DOM, network, storage, clock or randomness.

| Module | Owns | Boundary |
| --- | --- | --- |
| `core/exact` | `G-01`, `G-02` | Sixteenth-based lengths, exact rationals, exact `a + b√2`, and the two rounding rules. Everything else that measures builds on these types instead of `number` arithmetic. |
| `core/unit` | `G-03`–`G-08` | One cuttable unit: its finished geometry, its parent cuts, its yield, its trim variant and its refusal when a seam topology is unsupported. Knows nothing of blocks or quilts. |
| `core/block` | `W-02`, `W-03` | A square finished block as a measured grid of units; rotation and mirroring; whether a drawn geometry is cuttable and which seam is at fault. Does not know about layouts. |
| `core/library` | `W-03`, `T-12` | Block definitions as data, each with its provenance register entry. Content, not behaviour. |
| `core/layout` | `L-01`–`L-05` | Positions, sashing, cornerstones, borders, on-point setting and setting triangles; finished sizes and every actual piece the top needs. Produces piece demands, not fabric plans. |
| `core/fabric` | `F-01` | Fabric identity, usable width, photo calibration (pixels per inch) and repeat offset. Pure arithmetic over a photo's dimensions; never decodes an image. |
| `core/plan` | `F-02`–`F-06` | Greedy strip planning, orientation choice, joined and lengthwise long-piece plans, waste and shrinkage, per-fabric purchase, binding, backing, batting, and every "unavailable, because" reason. |
| `core/measure` | `P-01` | Mixed-number inch spelling and the metric readouts, to two decimals in centimetres and three in metres, labelled approximate. Readouts only; never an editing unit. |
| `core/chart` | `P-01`, `W-06`, `F-06`, `P-03` | The chart as data: rows with fabric, parent, quantity, dimensions, subcuts and yield; the stated assumptions; the incomplete-design marking. No page geometry. |
| `core/document` | `W-01`, `W-08`, `D-01` | The project document; the edit commands; the undo and redo stack. The only mutable thing in the pure half, and it mutates only through a command. |
| `core/scope` | `W-07` | The register of out-of-scope requests and the refusal each produces, so nothing is silently approximated. |

#### `draw/` — output documents. Pure: builds bytes and trees, never touches a DOM.

| Module | Owns | Boundary |
| --- | --- | --- |
| `draw/sheet` | `P-02`, `P-03` | Page layout in physical units: paper size, margins, the one-inch and one-centimetre test squares, tiling with numbered pages, overlap and alignment marks. One page model for both outputs, which is how `P-02`'s "PDF and SVG for the same revision agree" is kept. |
| `draw/svg` | `P-02` | SVG element trees and their serialisation, in physical units. |
| `draw/pdf` | `P-02` | A PDF writer over the same page model. Bytes in, bytes out, so it is unit-testable without a browser. |

#### `file/` — the project container. Pure: bytes in, document out.

| Module | Owns | Boundary |
| --- | --- | --- |
| `file/manifest` | `D-01`, `D-02` | The versioned JSON manifest: its schema, its validation, its upgrade path and its refusals. |
| `file/container` | `D-01`, `D-02` | `.lqzip` reading and writing, member paths, photo members. Refuses a truncated archive, a duplicate manifest, a missing photo and an unsafe member path. |

#### `io/`, `ui/`, `platform/` — browser-bound. Thin, and tested in a browser.

| Module | Owns | Boundary |
| --- | --- | --- |
| `io/transfer` | `D-03` | File selection, download and the share sheet, including iPad Safari. No Chromium-only picker. |
| `io/image` | `F-01`, `O-08` | Decoding a chosen photo, normalising to at most 24 megapixels, re-encoding, and refusing an oversized one before memory is exhausted. |
| `io/draft` | `D-03` | The temporary browser draft, always labelled evictable. |
| `ui/shell` | `A-01` | Landmarks, focus management, announcements, the 200% text path. |
| `ui/surface` | `W-02`, `W-04`, `A-01` | The SVG editing surface, with a tap route and a keyboard route for every drag. |
| `ui/controls` | `W-05`, `A-01` | HTML controls, measurement entry, accessible names, understandable errors. |
| `ui/preview` | `A-02` | The greyscale value preview. |
| `platform/offline` | `X-01`, `D-03` | Service worker registration, cache lifecycle, and protecting unsaved edits when an update activates. |
| `platform/capability` | `X-01`, `O-09` | Feature detection and the tested-version note each release publishes. |
| `sw/` | `X-01` | The service worker itself. |

### Data flow

```
  ui/controls, ui/surface                       browser-bound
        │ intent
        ▼
  core/document  ──command──▶  document (integer sixteenths only)    I1, I6
        │                            │
   undo/redo stack (W-08)            │ pure derivation, exact in Q(√2)
                                     ▼
                       core/unit → core/block → core/layout
                                     │ piece demands
                                     ▼
                                 core/plan        (strips, yardage, binding, backing)
                                     │
                                     ▼
                                core/chart        (rows, assumptions, unavailable reasons)
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
              draw/sheet → draw/svg, draw/pdf    ui/surface, ui/preview
                     │                               (screen rendering)
                     ▼
              io/transfer  (download, share)
                                     ▲
  file/manifest + file/container ────┘   .lqzip bytes ◀──▶ document
```

Derivation runs one way. A control never writes a derived number back into the document; the
chart is recomputed from the document. That is the whole mechanism behind `W-01` and behind
`T-02`'s requirement that undoing and redoing every step returns the same finished size and
chart.

### Pure versus browser-bound

| | Modules | How it is tested |
| --- | --- | --- |
| **Pure** | all of `core/`, `draw/`, `file/` | `bun test`, no DOM. Covers the whole numeric content of `T-01`–`T-07` and the geometry of `T-08`. |
| **Browser-bound** | `io/`, `ui/`, `platform/`, `sw/` | A browser-driven runner, chosen at IMPL-26. Covers `T-09`, `T-10` and the device half of `T-13`. |
| **Physical or human** | none — these are checks, not modules | Printing and measuring (`T-08`), sewing (`T-01` four-at-a-time, `T-03` on-point), a screen-reader pass (`T-10`), quilters (`T-11`), real devices (`T-13`). |

Most of the specification is in the pure half on purpose. The irreducibly browser-bound parts are
file hand-off, image decoding, the editing surface, offline caching and printing.

## Ticket list

Each ticket is sized for one agent to finish and verify. Status is tracked in the GitHub issue named in the last column (closed means done); this list is not updated as tickets finish. Each ticket records its verification results in its own file, `docs/verification/IMPL-NN.md`. The pure core comes first: tickets
IMPL-02 to IMPL-10 implement the `G-`, `L-` and `F-` requirements and satisfy `T-01` to `T-05`
before any browser work starts.

| # | Title | Implements | Tests | Needs | Issue |
| --- | --- | --- | --- | --- | --- |
| IMPL-01 | Exact lengths and the rounding rules | G-01, G-02 | T-01 (rounding) | — | #7 |
| IMPL-02 | Cuttable units and their refusals | G-03–G-08 | T-01 | 01 | #8 |
| IMPL-03 | The block as a measured grid | W-02, W-03 | T-01 | 02 | #9 |
| IMPL-04 | Straight layout geometry | L-01–L-03 | T-02 | 01, 03 | #10 |
| IMPL-05 | On-point layout geometry | L-04, L-05 | T-03 | 04 | #11 |
| IMPL-06 | Fabric identity and photo calibration | F-01 | T-06 (pure) | 01 | #12 |
| IMPL-07 | Greedy strips and per-fabric yardage | F-02, F-03, F-06 | T-04 | 04, 06 | #13 |
| IMPL-08 | Binding, backing and batting | F-04, F-05 | T-05 | 07 | #14 |
| IMPL-09 | Inch and metric readouts | P-01 | T-04a | 01 | #15 |
| IMPL-10 | The chart as data | P-01, W-06, F-06, P-03 | T-02, T-04, T-05 | 05, 08, 09 | #16 |
| IMPL-11 | Document, commands, undo and redo | W-01, W-08 | T-02 (undo) | 10 | #17 |
| IMPL-12 | Manifest schema, validation and refusal | D-01, D-02 | T-07 (pure) | 11 | #18 |
| IMPL-13 | The `.lqzip` container | D-01, D-02 | T-07 | 12 | #19 |
| IMPL-14 | Page model, true-scale SVG and tiling | P-02, P-03 | T-08 (geometry) | 10 | #20 |
| IMPL-15 | PDF output over the same page model | P-02, P-03 | T-08 (geometry) | 14 | #21 |
| IMPL-16 | The scope refusal register | W-07 | T-12 | 10 | #22 |
| IMPL-17 | Block library and provenance register | W-03 | T-12 | 03 — **human source check** | #23 |
| IMPL-18 | App shell bound to the document | W-01, A-01 | T-09, T-10 | 11 | #24 |
| IMPL-19 | Block drawing surface | W-02, A-01 | T-10 | 18 | #25 |
| IMPL-20 | Layout editing surface | W-04, A-01 | T-02, T-10 | 18 | #26 |
| IMPL-21 | Fabric photos in the browser | F-01, W-05, O-08 | T-06 | 06, 18 | #27 |
| IMPL-22 | Fabric assignment and greyscale preview | W-05, A-02 | T-06, T-10 | 21 | #28 |
| IMPL-23 | Chart and template output in the app | W-06, P-01–P-03 | T-08 | 15, 20 | #29 |
| IMPL-24 | Save, open, share and the temporary draft | D-03 | T-07, T-09 | 13, 18 | #30 |
| IMPL-25 | Offline service worker and update protection | X-01, D-03 | T-09 | 24 | #31 |
| IMPL-26 | Browser test harness and platform matrix | X-01, O-09 | T-09 | 25 — **real devices** | #32 |
| IMPL-27 | Accessibility audit and fixes | A-01, A-02 | T-10 | 23, 26 — **human pass** | #33 |
| IMPL-28 | Print-scale verification | P-01–P-03 | T-08 | 23 — **printing and a ruler** | #34 |
| IMPL-29 | Four-at-a-time HST sewn validation | G-05, O-06 | T-01 | 02, 28 — **sewing** | #35 |
| IMPL-30 | On-point proof quilt | L-05, O-11 | T-03 | 05, 28 — **sewing** | #36 |
| IMPL-31 | Performance measurement and the photo cap | X-02, O-08, O-10 | T-13 | 26 — **real devices** | #37 |
| IMPL-32 | Usability round with five to eight quilters | A-03 | T-11 | 23, 27 — **quilters** | #38 |
| IMPL-33 | Release evidence and security-reporting route | project contract | — | 26–32 | #39 |

### IMPL-01 — Exact lengths and the rounding rules

**Done.** Delivered with this plan.

**Objective.** A stored length that cannot hold a fraction of an inch, and the two rounding
rules, exact even when the geometry behind them is irrational.

**Implements.** `G-01`, `G-02`. **Tests.** The rounding half of `T-01`, plus `T-04`'s and
`T-05`'s purchase amounts and `T-01`'s refusal of a 3.01-inch entry.

**Prerequisites.** None.

**Scope.** `core/exact` only: the sixteenth-based length with its parsing, refusals and mixed
number spelling; exact rationals over `bigint`; exact `a + b√2`; `roundCutUpToEighthInch`;
`roundPurchaseUpToEighthYard`. **Not in scope:** any unit, layout, fabric or chart formula. The
unrounded inputs that exercise the irrational path live in the tests, not in `src`.

**Verification.** `bun test`, with every expected value quoted from
`python3 docs/specification-fixtures.py` and the fixture line named in a comment.

### IMPL-02 — Cuttable units and their refusals

**Done.** Recorded in [verification](verification.md).

**Objective.** Every cuttable unit of `G-03` to `G-08` as a function from a finished size to its
parent cuts, its yield and its trim variant, plus a typed refusal for an unsupported seam.

**Implements.** `G-03`, `G-04`, `G-05`, `G-06`, `G-07`, `G-08`. **Tests.** `T-01`, except its
physical four-at-a-time check (IMPL-29).

**Prerequisites.** IMPL-01.

**Scope.** `core/unit`. Plain squares, rectangles and strips; strip-set width and subcut; two-,
four- and eight-at-a-time half-square triangles with their oversized trim variants;
quarter-square triangles; one-at-a-time and no-waste four-at-a-time flying geese; stitch-and-flip
corners; square-in-a-square by finished outer side with its trim statement. Each result reports
parent count and yield, and excess units when a construction overshoots demand. Four-at-a-time
HST ships behind a flag that IMPL-29 either sets or removes (`O-06`). **Not in scope:** block
grids, fabric, charts, and any construction the specification excludes.

**Verification.** `bun test` against every row of `T-01`'s table. Assert the explicit failures:
a 3-inch four-at-a-time result of 4¼ or 4¾ inches fails; a curve, a set-in seam and a zero
finished block are refused as cuttable geometry with the affected seam identified.

### IMPL-03 — The block as a measured grid

**Objective.** A square finished block built from units on a measured grid, with rotation,
mirroring, and a definite answer to whether it can yield a cutting chart.

**Implements.** `W-02`, and `W-03`'s placement rules. **Tests.** `T-01`'s refusals.

**Prerequisites.** IMPL-02.

**Scope.** `core/block`. Grid division in whole sixteenths or a refusal; unit placement;
independent rotation and mirroring of a placed copy without altering a library definition;
cuttability with the offending seam named; the distinction between the finished block and its
unfinished and cut measurements. **Not in scope:** library content (IMPL-17), the drawing surface
(IMPL-19), fabric assignment.

**Verification.** `bun test`. A grid division that cannot be represented in whole sixteenths is
refused; mirroring and rotation leave every cut dimension unchanged (`G-03`); a block kept as a
visual draft reports its missing construction before export.

### IMPL-04 — Straight layout geometry

**Objective.** The finished size of a straight-set top and every actual piece it needs.

**Implements.** `L-01`, `L-02`, `L-03`. **Tests.** `T-02`.

**Prerequisites.** IMPL-01, IMPL-03.

**Scope.** `core/layout`, straight setting only. Grid size with and without outer sashing; plain
positions; sashing counts with cornerstones and the continuous-sash counts without them,
vertical-first per `O-12`; butted borders with sides sewn first; the piece demand list. **Not in
scope:** on-point (IMPL-05), fabric planning, mitered or pieced borders (excluded by `W-07`).

**Verification.** `bun test` against `T-02`: 30 × 44 inches before the border and 38 × 52
finished; 17 sash rectangles cut 2½ × 12½ and 12 cornerstones cut 2½ square; borders two
4½ × 44½ then two 4½ × 38½; 26 × 40 without outer sashing or border; and with cornerstones
removed, nine 2½ × 12½ vertical sashes and four 2½ × 30½ horizontal ones.

### IMPL-05 — On-point layout geometry

**Objective.** The on-point envelope, its position and triangle counts, and its parent cuts,
with the outer size labelled unverified where `O-11` requires it.

**Implements.** `L-04`, `L-05`. **Tests.** `T-03`.

**Prerequisites.** IMPL-04.

**Scope.** `core/layout`, on-point setting. The theoretical finished size as an exact `a + b√2`
value, never persisted and never fed into cut arithmetic (`I3`); `2CR−C−R+1` whole positions,
`2(C+R−2)` side triangles, four corner triangles; side and corner parent squares with their
diagonal cuts and the straight-grain edge each puts outside; leftover triangles reported; the
unverified label on the outer finished size of an on-point top with sashing. **Not in scope:**
the proof quilt itself (IMPL-30), on-point blocks that are not square (refused).

**Verification.** `bun test` against `T-03`: eight whole positions, six side and four corner
triangles, two side and two corner parent squares; exact size `24√2 × 36√2`, displayed
`33 15/16 × 50 15/16` and marked approximate; side parents 18¼ cut twice diagonally and corner
parents 9⅜ cut once; with 2-inch sashing, 21⅛ and 10⅞.

### IMPL-06 — Fabric identity and photo calibration

**Objective.** A fabric, and the arithmetic that gives a photo a physical scale.

**Implements.** `F-01`. **Tests.** the pure half of `T-06`.

**Prerequisites.** IMPL-01.

**Scope.** `core/fabric`. A named solid colour or a photo reference; usable width, editable in
sixteenths, defaulting to 40 inches; both calibration routes — two marked points a known distance
apart, and an entered repeat size — producing the same pixels-per-inch; the repeat offset; the
refusals for a missing photo, a zero-point distance and a nonpositive repeat; the rule that image
DPI metadata is not a calibration. **Not in scope:** decoding or normalising pixels (IMPL-21),
tiling on screen (IMPL-22).

**Verification.** `bun test` against `T-06`: a 600 × 400-pixel image of a 6 × 4-inch repeat
gives 100 pixels per inch by either route, and a 2-inch finished square spans 200 image pixels.
Changing the offset leaves every cut and yardage number identical. Zero-distance calibration is
refused.

### IMPL-07 — Greedy strips and per-fabric yardage

**Objective.** Turn a piece demand into strips, raw bolt length and one purchase per fabric.

**Implements.** `F-02`, `F-03`, `F-06`. **Tests.** `T-04`.

**Prerequisites.** IMPL-04, IMPL-06.

**Scope.** `core/plan`, top fabrics. Pieces per strip, strip count and raw length; the
orientation choice for nondirectional fabric and the locked orientation for directional; greedy
sharing of same-width strips within one fabric, longest first into the first strip with room;
the joined width-of-fabric plan for a piece longer than the usable width, with the lengthwise
alternative offered; waste and shrinkage factors defaulting to zero with the formula stated;
summing a fabric's roles before one purchase round; and the "unavailable, because" result when no
orientation fits. **Not in scope:** binding, backing and batting (IMPL-08); chart presentation.

**Verification.** `bun test` against every `T-04` row, including the 42-inch width variant, the
`w=10%`/`s=5%` adjustment reaching ⅞ yard where the defaults give ¾, and the explicit failure:
summing separate lengthwise cuts for the two border lengths to 83 inches and 2⅜ yards must not
occur. Assert that a 44½-inch border never appears as a single subcut across 40-inch fabric.

### IMPL-08 — Binding, backing and batting

**Objective.** The three non-top materials, each as its own estimate.

**Implements.** `F-04`, `F-05`. **Tests.** `T-05`.

**Prerequisites.** IMPL-07.

**Scope.** `core/plan`, remaining roles. Straight-grain binding from perimeter, join allowance
and strip width, defaults 10 inches and 2½ inches; backing in both the lengthwise and turned
plans, side by side with their yardage and no silent turning, with overhang 4 inches and join
seam ½ inch; batting with its own 3-inch overhang. Every default editable and stated on the
output. **Not in scope:** bias binding multipliers, which the specification refuses.

**Verification.** `bun test` against `T-05`: a 60 × 72-inch top gives perimeter 264, seven
strips, 17½ raw inches and ½ yard at a 10-inch join, and eight strips, 20 inches and ⅝ yard at
20 inches. A 60 × 80-inch top needs 68 × 88 backing; at 40 inches usable that is 2 widths,
176 inches, 5 yards lengthwise and 3 widths, 204 inches, 5¾ yards turned; at 108 inches, 1 width
and 88 inches, 2½ yards lengthwise against 68 inches, 2 yards turned. Batting is 66 × 86.

### IMPL-09 — Inch and metric readouts

**Objective.** The spellings a chart prints, and the metric readouts beside them.

**Implements.** `P-01` (display), `O-04`. **Tests.** `T-04a`.

**Prerequisites.** IMPL-01.

**Scope.** `core/measure`. Mixed-number inches; centimetres to two decimals and metres to three,
each labelled approximate; metre totals converted from the *rounded purchasable yards*, not from
the raw length. **Not in scope:** metric editing, which `W-07` excludes.

**Verification.** `bun test` against `T-04a`: a ¼-yard purchase is exactly 0.2286 metre and shows
as about 0.229 m; a 3½-inch cut shows as about 8.89 cm. Changing the display unit leaves the
stored inches and the ¼-yard purchase untouched.

### IMPL-10 — The chart as data

**Objective.** One chart model that every output renders, carrying its own assumptions and its
own gaps.

**Implements.** `P-01`, `W-06`, `F-06`, `P-03`. **Tests.** `T-02`, `T-04`, `T-05` end to end.

**Prerequisites.** IMPL-05, IMPL-08, IMPL-09.

**Scope.** `core/chart`. Rows naming fabric, parent square or strip, quantity, dimensions,
subcuts and unit yield; triangular pieces presented through their parent squares and diagonal
cuts, never as an independent triangle blank; separate binding, backing and batting; the stated
seam allowance, usable widths, raw lengths, purchases and any nonzero waste or shrinkage; the
construction-order disclosures of `O-12` and `O-15`; the clearly marked incomplete design whose
yardage is withheld. **Not in scope:** page geometry (IMPL-14), PDF or SVG bytes.

**Verification.** `bun test`. Build the `T-02` quilt from supported actions and assert the chart
reproduces every `T-02`, `T-04` and `T-05` figure; assert the displayed per-fabric sum reproduces
the chart's own parent cuts (`F-06`); assert an incomplete design yields a marked chart with no
yardage.

### IMPL-11 — Document, commands, undo and redo

**Objective.** The project document, and an edit history that can be walked both ways.

**Implements.** `W-01`, `W-08`, `O-16`. **Tests.** `T-02`'s undo and redo clause.

**Prerequisites.** IMPL-10.

**Scope.** `core/document`. The document shape, holding only integer sixteenths and enumerated
choices; one command per design edit — drawing, placing, recolouring, resizing, layout and fabric
changes; an undo and redo stack that need not survive closing; the rule that opening a project
and a refused import are not edits. **Not in scope:** serialisation (IMPL-12), the UI.

**Verification.** `bun test`. Build the `T-02` quilt step by step, undo back to an empty design
and redo every step: the finished size and the whole chart return to the same values. A refused
import leaves nothing to undo.

### IMPL-12 — Manifest schema, validation and refusal

**Objective.** The published manifest, and a reader that refuses rather than guesses.

**Implements.** `D-01`, `D-02`, `O-14`. **Tests.** the pure half of `T-07`.

**Prerequisites.** IMPL-11.

**Scope.** `file/manifest`. A UTF-8 JSON manifest with a single integer format version recording
every entered dimension as integer sixteenths, geometry and provenance, layout, fabric IDs, photo
calibration and offset, material assumptions and selected cut methods; a published schema,
example and format note defining units and members; the upgrade report and the rule that an
upgrade writes a *new* current-version file; the refusals for an unknown newer version, an
invalid fractional length, an out-of-range length, an unknown unit and unknown geometry; and the
documented list of optional fields a reader may ignore. Includes the synthetic older-version
fixture `T-07` needs, documented in the format note. **Not in scope:** the ZIP container
(IMPL-13).

**Verification.** `bun test` against `T-07`'s compatibility table. Preserve 192 and 32 sixteenth
counts across an upgrade; refuse a higher version by name with no partial import; accept an
unknown ignorable field while preserving every known dimension; refuse an unknown unit or
geometry rather than produce a partial cut chart.

### IMPL-13 — The `.lqzip` container

**Objective.** One file that holds a whole design and opens on another device with no network.

**Implements.** `D-01`, `D-02`. **Tests.** `T-07`.

**Prerequisites.** IMPL-12.

**Scope.** `file/container`. Writing and reading a ZIP holding one manifest and every photo the
design needs, with stable member references; refusing a truncated archive, a duplicate manifest,
a missing referenced photo and a member path containing `..`; leaving the source file
byte-for-byte intact on both success and refusal. Chooses the ZIP library or writes the container
(see [Dependencies](#dependencies-chosen-and-deferred)). **Not in scope:** browser download and
share (IMPL-24).

**Verification.** `bun test`. Round-trip the `T-02` quilt with a synthetic photo and a nonzero
offset and compare every sixteenth, fabric assignment, image, chart count and cut. Assert a
generic ZIP reader finds one JSON manifest, its version and every referenced photo. Hash the
source file before and after each refusal.

### IMPL-14 — Page model, true-scale SVG and tiling

**Objective.** Pages measured in inches and millimetres rather than screen pixels.

**Implements.** `P-02`, `P-03`. **Tests.** the geometry half of `T-08`.

**Prerequisites.** IMPL-10.

**Scope.** `draw/sheet`, `draw/svg`. Letter and A4; the one-inch and one-centimetre test squares
on every output page with the instruction to measure one before cutting; true-scale templates;
tiling an oversized template at 100% with numbered pages, a ½-inch default overlap, editable,
and alignment marks; the scaled design overview marked as not true scale; the refusal of a cut
template for an unsupported piece. **Not in scope:** PDF bytes (IMPL-15), the physical print
check (IMPL-28).

**Verification.** `bun test`. Assert the declared physical dimensions of a 3½-inch square
template and of both test squares; assert a synthetic 14 × 14-inch template tiles on both paper
sizes with correct numbering and overlap and that the tile geometry reconstructs a 14-inch edge.

### IMPL-15 — PDF output over the same page model

**Objective.** A PDF whose numbers agree with the SVG of the same revision.

**Implements.** `P-02`, `P-03`. **Tests.** the geometry half of `T-08`.

**Prerequisites.** IMPL-14.

**Scope.** `draw/pdf`. A writer from the shared page model to PDF bytes, in physical units,
with text, lines and rectangles; the statement that exporting alone does not guarantee a
true-size print. Chooses the PDF library or writes the file (see
[Dependencies](#dependencies-chosen-and-deferred)). **Not in scope:** printing (IMPL-28),
rasterisation, embedded photos in a template.

**Verification.** `bun test`. Parse the produced bytes and assert declared page size, the
physical dimensions of both test squares and of the template edge; assert PDF and SVG for the
same revision agree on every numerical size and on geometry.

### IMPL-16 — The scope refusal register

**Objective.** Every excluded request reports unsupported scope and preserves the project.

**Implements.** `W-07`. **Tests.** `T-12`'s scope half.

**Prerequisites.** IMPL-10.

**Scope.** `core/scope`. One register entry per exclusion — foundation paper piecing, medallion
and mixed-size row layouts, mitered and pieced borders, curves, set-in seams, bed-size presets,
full metric editing, `.pj8` import and export, longarm export, manufacturer fabric images,
accounts and hosted services — each with the message it produces. **Not in scope:** implementing
any of them.

**Verification.** `bun test`. Attempt each and assert a specific unsupported-scope result with
the open project unchanged and nothing silently approximated.

### IMPL-17 — Block library and provenance register

**Objective.** The shipped blocks, each with a source trail that survives review.

**Implements.** `W-03`, `O-07`. **Tests.** `T-12`'s source gate.

**Prerequisites.** IMPL-03. **Needs a human check:** a person must confirm each pre-1931
illustration and name source and that the geometry is independently authored. An agent may
prepare candidates and the register, never certify a source.

**Scope.** `core/library`. Block definitions as geometry, from the four-patch, nine-patch,
five-patch and log/strip families, with a release register giving each block a pre-1931
illustration for its geometry, a separate name source, its independently authored geometry and a
cut test. Blocks tied to a designer or trademark are screened out. Ship fewer verified blocks
rather than guessed geometry. **Not in scope:** reaching about 40 blocks if verification does not
support it; any manufacturer photo.

**Verification.** `bun test` that every library block is cuttable and has a complete register
entry, and that a name-only entry fails the gate. Human review of the register against the cited
illustrations, recorded in `docs/verification.md`.

### IMPL-18 — App shell bound to the document

**Objective.** A real shell: the document, its history and a chart on screen, accessibly.

**Implements.** `W-01`, `A-01`. **Tests.** `T-09`, `T-10` groundwork.

**Prerequisites.** IMPL-11.

**Scope.** `ui/shell`. Landmarks, headings, focus management, announcements, keyboard operation,
200% text, the undo and redo affordances, measurement entry wired to `core/exact`'s refusals.
**Not in scope:** the editing surface (IMPL-19, IMPL-20), files, offline.

**Verification.** Browser-driven tests for keyboard operation, focus visibility, accessible names
and 200% text. `bun test` for any pure helper.

### IMPL-19 — Block drawing surface

**Objective.** Draw a block on a measured grid, with no action available only by dragging.

**Implements.** `W-02`, `A-01`. **Tests.** `T-10`.

**Prerequisites.** IMPL-18.

**Scope.** `ui/surface` for block drawing: the SVG surface with HTML controls, unit placement,
rotation and mirroring, a tap route and a keyboard route for every drag, the refusal of an
unsupported geometry with the seam identified, 44 × 44 CSS-pixel pointer targets with documented
exceptions. **Not in scope:** quilt layout (IMPL-20), fabrics.

**Verification.** Browser-driven tests completing every drawing action by keyboard alone and by
tap alone; target measurements recorded against the 44-pixel goal.

### IMPL-20 — Layout editing surface

**Objective.** Lay out a quilt: grid, plain positions, sashing, cornerstones, borders, on-point.

**Implements.** `W-04`, `A-01`. **Tests.** `T-02`, `T-10`.

**Prerequisites.** IMPL-18.

**Scope.** `ui/surface` for layout. Placing, replacing, emptying and orienting positions;
sashing between and around; cornerstones; borders; the on-point setting with its unverified-size
label. **Not in scope:** the excluded layouts of `W-07`.

**Verification.** Browser-driven construction of the `T-02` quilt through the interface, asserting
the on-screen finished size and chart match `T-02`; the same by keyboard alone.

### IMPL-21 — Fabric photos in the browser

**Objective.** Bring in a photo of the quilter's own fabric, safely and at a known scale.

**Implements.** `F-01`, `W-05`, `O-08`. **Tests.** `T-06`.

**Prerequisites.** IMPL-06, IMPL-18.

**Scope.** `io/image`. Choosing a photo through ordinary file selection; decoding; normalising to
at most 24 megapixels while keeping aspect ratio and calibration; re-encoding to the stored
member; refusing an oversized photo before memory is exhausted, with the open project intact;
the calibration interactions of `F-01`. The compressed-byte cap is provisional until IMPL-31
measures it (see clarification Q-10). **Not in scope:** screen tiling (IMPL-22).

**Verification.** Browser-driven tests for both calibration routes, offset changes leaving cuts
and yardage identical, and a just-over-the-limit photo refused with the design intact.

### IMPL-22 — Fabric assignment and greyscale preview

**Objective.** Put fabrics on pieces, and judge value without hue.

**Implements.** `W-05`, `A-02`. **Tests.** `T-06`, `T-10`.

**Prerequisites.** IMPL-21.

**Scope.** `ui/controls`, `ui/preview`. Assigning a solid colour or a photo; tiling a calibrated
photo at physical scale; changing the motif offset without altering cuts or yardage; identifying
the pieces affected when a fabric is removed or replaced; the greyscale preview converting both
solids and photos while preserving piece boundaries; selection and error states discernible with
colour removed; the statement that photo and screen colour are approximate. **Not in scope:**
manufacturer images, which the project does not ship.

**Verification.** Browser-driven tests with red and green synthetic fabrics: the greyscale
preview keeps distinct luminance and piece boundaries, and selection and errors stay identifiable
without hue.

### IMPL-23 — Chart and template output in the app

**Objective.** Print or export the chart and true-scale templates from the running app.

**Implements.** `W-06`, `P-01`, `P-02`, `P-03`. **Tests.** `T-08`.

**Prerequisites.** IMPL-15, IMPL-20.

**Scope.** Wiring `core/chart` and `draw/` to the interface and to local export, on Letter and
A4; the refusal of a template for an unsupported piece; the marked incomplete chart. **Not in
scope:** the physical measurement (IMPL-28).

**Verification.** Browser-driven export of the `T-01` 3½-inch template and the `T-02` chart to
PDF and SVG on both paper sizes, asserting declared sizes and PDF-to-SVG agreement. Physical
measurement is IMPL-28.

### IMPL-24 — Save, open, share and the temporary draft

**Objective.** Get a project off the device and back again, including on an iPad.

**Implements.** `D-03`. **Tests.** `T-07`, `T-09`.

**Prerequisites.** IMPL-13, IMPL-18.

**Scope.** `io/transfer`, `io/draft`. Save through ordinary download or share behaviour on every
target platform, with no Chromium-only picker; open through ordinary file selection; the browser
draft labelled temporary and subject to eviction; protecting unsaved edits when another project
opens. **Not in scope:** the cached-update case (IMPL-25).

**Verification.** Browser-driven save and reopen in a fresh profile, comparing every saved
sixteenth and the chart; each `T-07` refusal leaving the source file hash and the open quilt
unchanged.

### IMPL-25 — Offline service worker and update protection

**Objective.** After one online visit, everything works with the network off.

**Implements.** `X-01`, `D-03`. **Tests.** `T-09`.

**Prerequisites.** IMPL-24.

**Scope.** `platform/offline`, `sw/`. Precaching every application asset during one online
visit; serving them offline; protecting unsaved edits when a cached update activates; the message
for a profile that never completed a first visit. No telemetry, no usage upload, no third-party
runtime request. **Not in scope:** the platform matrix (IMPL-26).

**Verification.** Browser-driven: visit once, save the `T-02` quilt, disable networking, reload,
then create a block, change sashing, export PDF, SVG and ZIP and reopen the earlier ZIP. A
request log shows no design, photo or usage upload and no third-party asset.

### IMPL-26 — Browser test harness and platform matrix

**Objective.** Run the browser-bound tests on the browsers the specification promises.

**Implements.** `X-01`, `O-09`. **Tests.** `T-09`.

**Prerequisites.** IMPL-25. **Needs real devices:** iPad Safari through ordinary file selection
and share behaviour cannot be verified by an agent or in a container.

**Scope.** Choose and wire the browser-driven runner; run the browser-bound suites on the latest
and previous stable Safari, Chromium-based and Firefox releases where available; publish the
actual tested version numbers per release. **Not in scope:** new product behaviour.

**Verification.** The suite green on each combination, with versions, platforms and gaps recorded
in `docs/verification.md`. An untested combination is reported as untested.

### IMPL-27 — Accessibility audit and fixes

**Objective.** Meet WCAG 2.2 AA across every included workflow, and prove it.

**Implements.** `A-01`, `A-02`. **Tests.** `T-10`.

**Prerequisites.** IMPL-23, IMPL-26. **Needs a human pass:** a screen-reader run and a judgement
of understandability. Automated checks cannot establish either.

**Scope.** Audit and fix focus, accessible names, contrast, error recovery and target size;
confirm a no-drag route to placement, rotation, fabric assignment and export; document every
pointer-target exception against the 24 × 24 rule or a spacing exception. **Not in scope:**
features beyond the approved scope.

**Verification.** Automated audit plus a recorded manual pass: complete `T-02` by keyboard, by
screen reader, by touch and at 200% text, with findings and fixes in `docs/verification.md`.

### IMPL-28 — Print-scale verification

**Objective.** Confirm on paper that a printed inch is an inch.

**Implements.** `P-01`, `P-02`, `P-03`. **Tests.** `T-08`.

**Prerequisites.** IMPL-23. **Needs printing and a ruler:** PDF pixels do not prove scale. An
agent cannot do this.

**Scope.** Print the `T-01` template and the `T-02` chart at 100% on Letter and A4 and measure
both test squares and the 3½-inch template edge against the 1/32-inch or 1-millimetre tolerance;
print deliberately at 97% and confirm the warning identifies it as unsafe; tile a 14 × 14-inch
template on both paper sizes and measure the reconstructed 14-inch edge.

**Verification.** Measured values, printer, driver, paper and settings recorded in
`docs/verification.md`. A failure is a product defect, not a test adjustment.

### IMPL-29 — Four-at-a-time HST sewn validation

**Objective.** Decide whether the four-at-a-time method ships.

**Implements.** `G-05`, `O-06`. **Tests.** `T-01`'s physical check.

**Prerequisites.** IMPL-02, IMPL-28. **Needs sewing:** two 5½-inch squares sewn and cut.

**Scope.** Sew two 5½-inch parent squares into four units and confirm each trims to 3½ inches
unfinished with the seam corner to corner. If it does, the method ships with the bias-edge
caution; if not, it is removed. **Not in scope:** inventing a different formula; the published
4¼-inch and 4¾-inch shortcuts are failures either way.

**Verification.** Measurements and photographs recorded in `docs/verification.md`, and the
IMPL-02 flag set or the method deleted.

### IMPL-30 — On-point proof quilt

**Objective.** Establish the rule for the outer finished size of an on-point top with sashing.

**Implements.** `L-05`, `O-11`. **Tests.** `T-03`.

**Prerequisites.** IMPL-05, IMPL-28. **Needs sewing:** a proof quilt constructed and measured.

**Scope.** Construct the on-point proof quilt, measure the outer finished size, record the rule,
then replace the unverified label with the measured rule. **Not in scope:** claiming the size
before the measurement exists.

**Verification.** The construction, the measurements and the derived rule in
`docs/verification.md`; `T-03` extended to the measured rule. A material change to the
specification needs fresh maintainer approval.

### IMPL-31 — Performance measurement and the photo cap

**Objective.** Measure what `T-13` only assumes, and set the photo byte cap from a real device.

**Implements.** `X-02`, `O-08`, `O-10`. **Tests.** `T-13`.

**Prerequisites.** IMPL-26. **Needs real devices:** a documented current iPad and a midrange
desktop.

**Scope.** Measure first interaction, placement latency at the 95th percentile of 100 actions,
chart recalculation, PDF export and peak tab memory on a synthetic 10 × 10 quilt with forty block
definitions and four photos at the 24-megapixel limit; record device, browser, compressed app
transfer size, photo format and memory method; publish the compressed-byte cap of `F-01`; verify
a just-over-limit photo is refused with the design intact. Propose revised targets if the
measurements justify it (see clarification Q-09). **Not in scope:** revising a target without
maintainer approval.

**Verification.** Measurements and method in `docs/verification.md`, with every unmeasured target
still marked unmeasured.

### IMPL-32 — Usability round with five to eight quilters

**Objective.** Test the charter's bar: a first quilt and its cutting chart without a manual.

**Implements.** `A-03`. **Tests.** `T-11`.

**Prerequisites.** IMPL-23, IMPL-27. **Needs quilters:** five to eight people new to librequilt,
including an iPad or Chromebook user if available. No agent can stand in for them.

**Scope.** Run the observation round exactly as `T-11` describes and record unaided completion,
elapsed time, wrong turns, help requests, failed steps and the measured printed square. Declare
the bar met only on at least 4 of 5 or 6 of 8 unaided completions, every measured square within
`T-08` tolerance and no severe blocker; otherwise fix and repeat.

**Verification.** The recorded round in `docs/verification.md`, with the pass or fail stated
plainly.

### IMPL-33 — Release evidence and security-reporting route

**Objective.** Everything a usable release has to document.

**Implements.** the project's release contract. **Tests.** —

**Prerequisites.** IMPL-26 to IMPL-32. **Needs the maintainer:** only they can publish a private
security-reporting route.

**Scope.** Reproducible checks, limitations, supported platforms, source and build instructions,
licence notices, the published manifest schema and format note, and the maintainer's private
security-reporting route. **Not in scope:** claiming a scope is usable while a required check is
unrun.

**Verification.** `python3 scripts/check-project.py`, the full command list in
`docs/verification.md`, and a maintainer review.

## Tickets that need a physical or human check

An agent cannot complete these. Each needs a person, a device, a printer or a sewing machine.

| Ticket | What a person has to do | Consequence if skipped |
| --- | --- | --- |
| IMPL-17 | Confirm each block's pre-1931 illustration and name source | `T-12`'s source gate fails; blocks ship on guessed geometry | #23 |
| IMPL-26 | Run the suite on real iPad Safari, including file selection and share | `X-01`'s platform claim is untested | #32 |
| IMPL-27 | A screen-reader pass and a judgement of understandability | `A-01` is asserted, not demonstrated | #33 |
| IMPL-28 | Print at 100% and measure with a ruler | the cutting chart's central promise is unverified | #34 |
| IMPL-29 | Sew two 5½-inch squares into four half-square triangles | `O-06` undecided; the method cannot ship | #35 |
| IMPL-30 | Construct and measure an on-point proof quilt | `O-11` undecided; the outer size stays unverified | #36 |
| IMPL-31 | Measure on a current iPad and a midrange desktop | `T-13`'s targets stay unmeasured and the photo cap unset | #37 |
| IMPL-32 | Observe five to eight quilters, unaided | `A-03`, the charter's bar, is unproven | #38 |

IMPL-33 also needs the maintainer, for the private security-reporting route.

## Dependencies chosen and deferred

The tooling decision, with licences and reasons, is the dated entry in
[decisions](decisions.md). In short: Bun as package manager and test runner, Vite for the static
build, TypeScript in strict mode, Biome for lint and format. Four development dependencies and no
runtime dependency; the built site contains only this project's own code.

Deferred to their tickets, so the choice is made with the problem in front of it:

| Need | Ticket | Candidates and the leaning |
| --- | --- | --- |
| ZIP container | IMPL-13 | `fflate` (MIT, maintained, no dependencies) is the leading candidate. A stored-only ZIP writer and reader is also small enough to write, which would keep the runtime dependency count at zero; the ticket decides. |
| PDF output | IMPL-15 | The output is vector lines, rectangles and short text labels, and PDF's base-14 fonts need no embedding, so a small in-house writer is the leaning: it avoids a dependency, avoids a font licence question entirely, and keeps the geometry exact. `pdf-lib` and `jsPDF` (both MIT) are the fallbacks if the ticket finds the in-house path too wide. |
| Browser-driven test runner | IMPL-26 | Playwright (Apache-2.0) is the leading candidate: it drives Safari, Chromium and Firefox, and supports offline mode and printing, which `T-08` and `T-09` need. Development-only, never shipped. |
| Accessibility audit library | IMPL-27 | `axe-core` (MPL-2.0) for the automated part. Development-only. MPL-2.0 is compatible with AGPL-3.0-or-later, and it is not distributed in any case. |

Every dependency must be AGPL-3.0-or-later compatible and maintained, with its licence recorded
in `docs/decisions.md` at the ticket that adds it. No font is downloaded at runtime, which is
part of how `X-01` is kept.

## Clarifications needed

**Resolved:** specification revision 2 (2026-11-19) answers every question below with the provisional assumption stated here, plus the cutting sequences for eight-at-a-time triangles and no-waste geese; see "Revision 2 clarifications" in `docs/specification.md`. The text below is kept as the record of how each was raised.

Questions the specification does not settle. None is a blocker for the tickets before it, and
nothing below has been resolved in a way that contradicts the specification. Where a ticket has
to proceed meanwhile, the provisional assumption is stated and is documented in the code.

**Q-01 — `G-04`: the eight-at-a-time parent for a finished size that is not a whole eighth.**
`G-04` gives the two-at-a-time parent as `ceil⅛(F+½+1/(2√2))` but the eight-at-a-time parent as
`2(F+⅞)`, calling `F+⅞` "the familiar" value on ordinary eighth-inch inputs. `G-01` allows a
finished size in sixteenths. At `F = 3 1/16` the three readings diverge: `2(F+⅞)` literally is
7⅞; rounding the doubled *unrounded* geometry, `ceil⅛(2(F+½+1/(2√2)))`, is also 7⅞; doubling the
*rounded* two-at-a-time parent is 8. Which is intended — and are half-square-triangle finished
sizes restricted to whole eighths? *Meanwhile:* IMPL-02 rounds the doubled unrounded geometry,
because `G-02` forbids rounding before joining and it agrees with `G-04`'s literal on every
eighth-inch input, including every `T-01` row.

**Q-02 — `G-02` with `F-03`: reporting a raw length that is not a whole sixteenth.** `G-02`
requires the raw planned length and the rounded purchase both to be reported, and `G-01` makes a
stored length a whole sixteenth. But `F-03`'s adjusted raw length, `raw·(1+w)/(1−s)`, generally
is not: `T-04`'s own example, 25 inches at `w=10%` and `s=5%`, is exactly 550/19 inches. How
should the chart report it — as an exact fraction, as a decimal, or rounded for display, and if
rounded, to what and in which direction? *Meanwhile:* IMPL-07 keeps the value exact internally,
and IMPL-10 reports it to the nearest sixteenth labelled approximate, by analogy with `L-04`.

**Q-03 — `W-02` with `G-08`: is square-in-a-square a drawable unit?** `W-02`'s list of units a
quilter may draw is squares, rectangles, half-square triangles, quarter-square triangles, flying
geese and strips. `G-08` specifies square-in-a-square cuts and `T-01` tests them. Is
square-in-a-square drawable in a block, available only in library blocks, or a construction
choice the tool recognises in a drawn geometry? *Meanwhile:* IMPL-02 implements the cuts because
`T-01` requires them; IMPL-19 does not offer it as a drawing tool until this is answered.

**Q-04 — `F-02` with `O-15`: which plan wins for a piece longer than the usable width?** `F-02`
says a nondirectional fabric is evaluated in both 90-degree orientations and the lesser raw
length is used; it also says a piece longer than the usable width comes by default from joined
width-of-fabric strips. For the `T-02` border, 4½ × 44½ inches, the second orientation *is*
feasible as a lengthwise cut at 44½ raw inches, while the joined plan needs 22½. Is the joined
plan a third candidate in the lesser-raw-length comparison, or a default that pre-empts it? Is
the lengthwise alternative always shown, or offered only on request? *Meanwhile:* IMPL-07 applies
the `O-15` default first and shows the lengthwise alternative beside it, which reproduces every
`T-04` row.

**Q-05 — `F-02`: where a joined plan charges its join allowance.** The fixture charges ½ inch per
strip-to-strip join across one continuous run — five strips for 166 inches of border — and
nothing where a subcut boundary between two border pieces falls. Is that right, and must the
chart say where a join lands inside a border piece, so a quilter knows a seam will show?
*Meanwhile:* IMPL-07 follows the fixture, and IMPL-10 discloses the join positions.

**Q-06 — `F-02` with `F-06`: does strip sharing cross roles?** `F-02` says same-width pieces of
one fabric always share strips; `F-03` sums a fabric's roles before one purchase round; `F-06`
says the estimate distinguishes top, binding, backing and batting. If one fabric supplies both
2½-inch top pieces and 2½-inch binding strips, do they share strips, or share only the final
purchase round? *Meanwhile:* IMPL-07 shares strips within the top and sums roles only at the
purchase, so no binding strip is planned out of a sash strip's remainder.

**Q-07 — `D-02` with `O-14`: refusal against a single integer version.** `O-14` sets a single
integer format version; `D-02` refuses "an unknown newer major version" and `T-07` tests "one
major version higher". With no minor component, is every integer above the supported one refused?
*Meanwhile:* IMPL-12 refuses any higher integer, and tolerates unknown fields only within a
version it supports, which is the reading `D-02`'s field rule implies.

**Q-08 — `G-01` with `D-02`: the valid range of a stored length.** `D-02` requires an
out-of-range length to be refused, and the specification states no range. *Meanwhile:* IMPL-01
refuses anything outside 0 to 1000 inches, documented in `src/core/exact/length.ts` and here.
The bound is provisional and needs a decision before the format note is published, because the
manifest schema will state it.

**Q-09 — `X-02`/`T-13`: the 500 MB memory target against four 24-megapixel photos.** `T-13`
targets peak tab memory below 500 MB with four photos at the 24-megapixel limit. Decoded at four
bytes per pixel, one such photo is about 96 MB and four are about 384 MB, before the editing
surface, the chart and PDF generation. Does the target assume the photos are not all decoded at
once — that the editor works from downscaled display copies and reads full resolution only on
demand? If so, that is an architectural requirement for IMPL-21 and IMPL-22, not only a number.
*Meanwhile:* IMPL-21 is planned around downscaled display copies with full resolution read on
demand, and IMPL-31 reports the measurement either way.

**Q-10 — `F-01` with `O-08`: the photo byte cap before it has been measured.** `F-01` sets the
compressed-size cap "from the iPad measurement in `T-13`", which has not been run, yet IMPL-21
has to enforce something. What provisional cap should ship? *Meanwhile:* IMPL-21 enforces the
24-megapixel limit, which is specified, and treats the byte cap as unset until IMPL-31 measures
it, refusing nothing on byte size alone.
