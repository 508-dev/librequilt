**Draft — not approved for implementation.**

# Functional specification

This draft is a proposed observable contract for a first release, for maintainer review. It is not an approval or an implementation brief. Evidence IDs refer to the public-source and research registers in `docs/research.md` and `docs/spec-research/`. **Observed** denotes what a cited source reports; **inference** denotes a consequence derived here; **[proposal]** denotes a measurable target with no validation yet; **[open]** denotes an unmade choice with options below. Decisions recorded on 2026-10-28 and 2026-10-30 in `docs/decisions.md` govern the scope even where earlier reports still call it provisional. This document uses original functional descriptions and synthetic examples. [S9, A3, B3–B6, C1, D8, E40–E44]

## User workflows and scope

**W-01 — Start and revisit a quilt.** A quilter can create a design with a named block size, row and column counts, and an inch-based quarter-inch seam allowance. Changes to block positions, sashing, borders or fabrics update the finished size and material calculation from the design's actual geometry. The quilter can export a complete project, close the browser, and reopen that file with the same editable design. Browser-only recovery is not represented as durable saving. [A1–A3, C18, E3–E9]

**W-02 — Draw a block.** A quilter can draw a square finished block on a measured grid using squares, rectangles, right-isosceles half-square triangles, quarter-square triangles, flying-geese units and straight strips; choose its finished size; assign fabrics to its pieces; and rotate or mirror it. Only a geometry with supported straight seams and a rotary construction method can yield a cutting chart. An unsupported free polygon, curve or set-in seam is refused as a cuttable block, with the affected seam identified. The displayed finished block and its unfinished/cut measurements are distinct. [A16–A33, B15, C18, D8]

**W-03 — Choose a library block.** A quilter can choose a traditional block, set an eligible finished size, recolour its pieces and place independently rotated or mirrored copies without modifying the library definition. The first release aims for about 40 blocks from four-patch, nine-patch, five-patch and log/strip families; the exact list is **[open]**. Each offered block has a recorded pre-1931 public-domain source for its *name* and a public-domain illustration for its *geometry*, checked separately. A name in Webster's list alone cannot establish geometry. Names tied to a designer or trademark are screened and excluded by default. [B3–B6, B13–B15; research correction 3]

**W-04 — Lay out the quilt.** A quilter can place equal finished-size square blocks in a straight grid, leave a position plain, replace its block, and orient a position independently. Sashing can run between blocks and optionally around the outside. Sash intersections can use equal-size cornerstones. One or more plain borders can be added with butted corners. The quilter can instead choose an on-point setting with side and corner setting triangles. The resulting chart counts every actual block, sash, cornerstone, border and setting-triangle parent cut. [A16, A34–A41, D8–D10]

**W-05 — Colour with owned fabrics.** A piece can receive a solid colour or a selected photo of the quilter's own fabric. A calibrated photo tiles at its physical scale, and its motif offset can be changed without altering the cut or yardage. Removing or replacing a fabric identifies affected pieces. The quilter can inspect the design in greyscale to judge value and is told photo/screen colour is approximate. No manufacturer images are required or shipped. [C6–C8, C16, C18, D13–D19]

**W-06 — Plan and take away the result.** The quilter can inspect the finished quilt size, per-fabric yardage, a rotary-cutting chart, binding, backing and batting requirements. The chart identifies fabric, parent square or strip, quantity, dimensions, subcuts and unit yield. It presents triangular pieces through their parent squares and diagonal cuts, never as a misleading independent triangle blank. The quilter can print or locally export PDF and SVG charts and true-scale templates, and can save a separate, editable ZIP project. Outputs state their material and measurement assumptions. [A3, A12–A16, A24–A34, A59–A70, C8, D11–D12]

**W-07 — Scope boundary.** The first release excludes foundation paper piecing, medallion and mixed-size row layouts, mitered or pieced borders, curves, set-in seams, diamond/hexagon assemblies requiring them, bed-size presets, full metric editing, `.pj8` import/export, longarm-machine export, manufacturer fabric images, hosted accounts, marketplaces and other hosted services. It does not silently approximate these requests. The first later paper-piecing addition, if separately approved, is for the quilter to mark sections and sewing order and have the tool print them; automatic sewability analysis is not included. [S9, S11, B15, C10, D1–D4, D8–D10; decisions 2026-10-30]

**Observed:** quilters choose or draw blocks, audition fabrics and calculate cuts; some work on graph paper because its layout is immediately visible and involves no software learning. Existing free proprietary browser tools already cover much of this loop. **Inference:** changing one quilt fact should recalculate all dependent dimensions and material numbers together. No quilter interview yet establishes that a FOSS alternative alone will cause adoption. [C1, C15, C18, S9]

## Inputs, outputs, and observable behavior

### Exact measurements and rotary cuts

**G-01 — Stored lengths.** Every editable or saved positive length is exactly a whole number of sixteenths of an inch. Zero is valid only for an absent optional sash or border. An input between those marks is rejected rather than silently rounded. The saved design stores finished input dimensions; computed diagonals can remain exact expressions until evaluated for an output. A theoretical on-point dimension involving √2 is not persisted as a rounded sixteenth. [A1–A6, D9, D11]

**G-02 — Rounding sequence.** For each cut dimension, start with unrounded finished geometry, add the quarter-inch margins and any construction allowance, then round the *completed* parent square, rectangle dimension or strip width **up to the next eighth inch**. An exact eighth stays unchanged. Do not round an intermediate diagonal or a block before joining it to another. For each fabric, sum all raw planned bolt lengths and any selected waste/shrinkage adjustments, then round the *single purchase result* up to the next eighth yard, where an eighth yard is 4½ inches. The raw length and rounded amount are both reported. Finished geometry is never rounded as a cut. [A6, A12–A16, D9, D11]

**G-03 — Plain units.** A square with finished side `F` is cut `F+½`; a finished `W×H` rectangle is cut `(W+½)×(H+½)`. A strip of finished width `F` is cut `F+½` wide; a strip-set segment of finished length `L` is subcut `L+½` long. Each finished exterior side gains a quarter-inch seam margin at both ends. Mirroring, rotation and fabric-photo scale do not change these numbers. [A16, A30, A33, C18]

**G-04 — Two- and eight-at-a-time HST.** For a finished half-square-triangle unit of side `F`, two equal parent squares of side `ceil⅛(F+½+1/(2√2))` yield two units after two diagonal seams and a diagonal cut. On ordinary eighth-inch inputs this is the familiar `F+⅞`. Two parents of side `2(F+⅞)` yield eight units by the eight-at-a-time construction. Optional oversized/trim choices use `F+1` for two at a time and `2(F+1)` for eight at a time; their chart explicitly says to trim each unit to unfinished side `F+½`. The `1/(2√2)` is the quarter-inch seam offset projected onto a square side; the outer half inch covers the finished unit's perimeter seams. Each chart row states parent count and yield. [A9–A10, A17–A23; research correction 1]

**G-05 — Four-at-a-time HST.** If this method is offered, two same-size squares are sewn a quarter inch inside their four outer edges, then cut along both diagonals to yield four units. A parent square of side `S` leaves seam segment `S−½` as the unit diagonal. That must equal `(F+½)√2`, hence **`S=ceil⅛((F+½)√2+½)`**. For `F=3`, the cut is `5½` inches. The published shortcuts of `4¼` and `4¾` inches undercut this fixture and are not acceptable. Whether the method ships is **[open]**. [A9–A11; research correction 1]

**G-06 — Quarter-square triangles.** For two finished hourglass units of side `F`, cut two parent squares of side `ceil⅛(F+½+1/√2)` and cut each twice diagonally. For supported eighth-inch finished sizes this is the conventional `F+1¼`; an optional trim choice is `F+1½`. The diagonal term accounts for the two bias seams, and the half inch for the unit's exterior seams. The chart reports the parent squares and yield, including any unused triangles. [A24–A26, A70]

**G-07 — Geese and flipped corners.** For a goose finished `W×H` with `W=2H`, the one-at-a-time construction cuts a `(W+½)×(H+½)` rectangle and two `(H+½)` corner squares, yielding one goose. The no-waste four-at-a-time construction cuts one large square `W+1¼` and four small squares `H+⅞`, yielding four geese. These allowances cover exterior and diagonal quarter-inch seams. A stitch-and-flip corner of finished leg `C` uses a `(C+½)` square. If a four-unit construction exceeds demand, the chart states excess units and counts the parent fabric. [A27–A31]

**G-08 — Square-in-a-square and strip set.** A square-in-a-square unit is defined by its *finished outer side* `F`, so that it fits the block grid. Its on-point centre square has finished side `F/√2` and is cut `ceil⅛(F/√2+½)`; two corner-parent squares are cut `F/2+⅞` and each is cut *once* diagonally, giving four corners with straight grain on the unit's outer edges. Because the centre cut is rounded up, the sewn unit is trimmed to unfinished side `F+½`, and the chart says so. A strip set reports its cut width and subcut length separately. A block name by itself is never used to infer this construction. [A16, A31–A33, B6]

### Layout geometry

**L-01 — Straight grid size.** For `C` columns of finished block width `Bₓ` and `R` rows of finished block height `Bᵧ`, finished interior size is `C·Bₓ+(C−1+oₓ)Sₓ` by `R·Bᵧ+(R−1+oᵧ)Sᵧ`, where each `o` is zero without outer sashing or two with outer sashing. If sashing is absent, its width and contribution are zero. A cornerstone replaces an equal-size sash intersection, so it adds no length. Plain positions keep the same block dimensions. [A16, A34, D8–D9]

**L-02 — Sashing counts.** With between-and-around sashing in an `R×C` straight grid, count `R(C+1)+C(R+1)` individual sash rectangles and `(R+1)(C+1)` cornerstones. A sash neighboring a block has the block's finished length and the selected finished sash width; both cut dimensions gain half an inch. Without cornerstones, the actual continuous sash lengths and counts replace those individual pieces. Whether vertical or horizontal continuous sashes run through the intersections is **[open]**; the chart must say which construction it used. [A16, A34, D8–D9]

**L-03 — Butted borders.** A border of finished width `T` around a current finished `W×H` top makes it `(W+2T)×(H+2T)`. With sides sewn first, two side pieces cut `(T+½)×(H+½)`, then two top/bottom pieces cut `(T+½)×(W+2T+½)`. Each end has a quarter-inch seam margin. Sides-first versus top-first is **[open]**; either gives the same finished size but different cut lengths, so the chart names its choice. Pieces longer than usable fabric width follow the disclosed lengthwise or joined plan of O-15, never an impossible width-of-fabric subcut. [A16, A34, D10; sampler protocol]

**L-04 — On-point envelope.** An on-point rectangle measured as `C` block diagonals across and `R` down, with square finished block `B` and no sashing/border, has theoretical finished size `C·B√2` by `R·B√2`. It contains `2CR−C−R+1` full diamond block positions, `2(C+R−2)` side setting triangles and four corner triangles. A plain alternate counts as a full block position. Four side triangles come from each twice-diagonally-cut parent square; two corners come from each once-diagonally-cut parent square, with leftovers reported. Show an irrational finished dimension approximately to nearest sixteenth, marked approximate, without feeding that display value into later cut math. [A35–A41, D8–D9; sampler protocol]

**L-05 — On-point parent cuts.** Let `T=B+S`, where `S` is finished on-point sashing width or zero. The side parent-square cut is `ceil⅛(T√2+1¼)` and is cut twice diagonally, putting straight grain on the long outside edge. The corner parent-square cut is `ceil⅛(T/√2+⅞)` and is cut once diagonally, putting straight grain on the two outside legs. The √2 relationship comes from rotating a square 45 degrees; allowances cover outside and diagonal seams. The exact finished outer envelope when on-point sashing also runs around the exterior is **[open]**; until resolved, the tool must not claim an unverified on-point-with-sashing finished size. [A6, A35–A41, D9]

### Fabrics and material estimates

**F-01 — Fabric definition and scale.** Each fabric is a named solid colour or an embedded quilter-selected photo with a retained physical pixels-per-inch scale and repeat offset. The quilter can mark two photo points a known physical distance apart, making scale `pixel distance / entered inches`; alternatively the quilter can enter the real-world width and, if known, height of the photographed repeat, making scale `crop pixels / repeat inches`. Both routes produce the same physical tiling behavior. A missing photo, zero-point distance or nonpositive repeat is refused. Image DPI metadata alone is not a physical calibration. The retained pixel count and normalization policy are **[open]**. [D13–D19, E3, E11]

**F-02 — Usable width and greedy strips.** Each fabric has a usable width, initially 40 inches and editable in sixteenths. For a group of identical cut pieces, with dimension `a` across usable width `U` and other dimension `b` along the bolt, whole pieces per strip are `floor(U/a)`, strips are `ceil(quantity/pieces-per-strip)`, and raw bolt length is `strips·b`. If `a>U`, that orientation is infeasible. For nondirectional fabric, the tool evaluates both 90-degree orientations and uses the one with the lesser raw length; a directional fabric preserves the chosen print orientation. Groups are planned greedily by size, not with mixed-size nesting. Pieces longer than the usable width, and whether same-width groups of one fabric share strips, follow **[open]** O-15. The chart names orientation, width and every strip/subcut. [A34, A48–A49, A55, A71–A73; decisions 2026-10-30]

**F-03 — Waste, shrinkage and aggregation.** A configurable waste fraction `w` and prewash length-shrink fraction `s` would adjust a fabric's summed raw bolt length to `raw·(1+w)/(1−s)` before the one eighth-yard purchase round; selected usable width is treated as effective postwash width. Negative factors and `s≥1` are invalid. Their defaults and whether both controls ship are **[open]** because sources disagree. If the same fabric supplies several piece groups or roles, the estimate sums those raw lengths before one purchase round. The chart states any nonzero factor and says when both are zero. [A12–A15, A34, A48–A49, A55–A58]

**F-04 — Binding.** For finished top `W×H`, perimeter is `2(W+H)`. With join allowance `J`, usable width `U` and straight-grain binding strip width `K`, strips needed are `ceil((2(W+H)+J)/U)`, raw bolt length is `strips·K`, and purchase length is rounded once to an eighth yard. The chart states all three inputs and strip count. The default `J` and `K` are **[open]**. The formula is for straight-grain binding on a rectangular quilt, not an unsourced bias-binding multiplier. [A12–A13, A67–A69]

**F-05 — Backing and batting.** Backing overhang `O` on *each* side makes required backing `(W+2O)×(H+2O)`. For a lengthwise plan with usable backing width `Uᵦ`, count `ceil((W+2O)/Uᵦ)` widths and multiply by `(H+2O)` for raw bolt length before purchase rounding. Pieced-backing seam consumption must be added and stated; without it this simple result is identified as a lower bound. A turned plan swaps required width and length, if allowed. Batting with its own overhang `Oᵦ` requires `(W+2Oᵦ)×(H+2Oᵦ)` material. Backing and batting default overhangs, joining seam allowance, and whether to offer turning are **[open]**. [A59–A66; research correction 2]

**F-06 — Unavailable estimates.** An estimate distinguishes top, binding, backing and batting even when one fabric is assigned to more than one role. If a required piece fits no allowed orientation, if a joined strip plan is missing, or if an unsupported block lacks a cut method, the tool says which material quantity is unavailable and why. It does not manufacture a number from overall quilt dimensions alone. The displayed per-fabric sum and assumptions must reproduce the chart's parent cuts. [A12–A16, A34, A55, A63–A64, C6–C8]

### Print, project data and operation

**P-01 — Chart and totals.** The chart states the finished size, quarter-inch seam, cut dimensions to eighth inches, each fabric's usable width, raw planned length and purchasable eighth yards, plus metre totals converted from the *rounded purchasable yards*. It lists parent counts, subcuts and yield; binding, backing and batting are separate. The quilter may use Letter or A4 paper. Metric values are readouts, not a second editing system; their display precision is **[open]**. A page-sized design overview can be scaled, but any cut template is identified as true scale. [A3, A12–A16, A70, C8, C10–C12]

**P-02 — True-scale PDF and SVG.** Templates encode physical inch or millimetre dimensions rather than screen pixels. Every output page carries both a one-inch and a one-centimetre test square and tells the quilter to measure one on paper before cutting. A print driver can shrink output, so the tool does not claim that exporting alone guarantees a true-size print. An oversized template is tiled at 100% with numbered pages, an explicit overlap and alignment marks; each tile has both scale squares. The overlap default is **[open]**. PDF and SVG for the same revision agree on numerical sizes and geometry. [C8, C11, D6, D11–D12, D20–D21, E8, E51]

**P-03 — Output limits.** Charts and templates export locally while disconnected. A PDF or SVG output is an output document, not an editable project file; the ZIP is the reopenable project. An unsupported piece's cut template is refused with the block identified. The chart can still show a clearly marked incomplete design but cannot silently include its yardage. [C8, D11–D12, E7–E9, E40–E44]

**D-01 — Portable project.** One file is a ZIP containing one UTF-8 JSON manifest and every photo the design needs, with stable member references and a documented format version. The manifest records all entered dimensions as integer sixteenths, geometry and source provenance, layout, fabric IDs and photo calibration/offset, material assumptions and selected cut methods. A public schema, example and format note define units and members. The project opens on another supported device without network or the original image path. Extension, photo normalization and exact version numbering are **[open]**. [B6, D9, D13–D17, E40–E44]

**D-02 — Upgrade and refusal.** A supported older project opens with an upgrade report and saves to a *new* current-version ZIP, leaving the original byte-for-byte intact. An unknown newer major version is refused with a version message and no partial import. A truncated ZIP, duplicate manifest, missing referenced photo, unsafe member path, unsupported geometry, or out-of-range length is refused with a reason, leaving the currently open design intact. Only documented optional unknown fields may be ignored; unknown units and geometry may not. Each released version documents supported older versions and migration behavior. [E3–E5, E40–E44]

**D-03 — Save and recovery.** A completed save offers a project file through normal download or share behavior on all target platforms, including iPad Safari. If a browser draft exists, it is labelled temporary and subject to eviction. The app protects unsaved edits when another project opens or a cached app update activates. It needs no Chromium-only open/save picker. [E3–E9, E48, E50]

**A-01 — Accessibility.** Every included workflow meets WCAG 2.2 AA: keyboard operation, focus visibility, accessible names, understandable errors and recovery, 200% text enlargement without lost functionality, ordinary-text contrast of at least 4.5:1, and no reliance on colour alone. Every drag action has a tap/click route and keyboard route. The pointer-target *goal* is 44×44 CSS pixels; exceptions still meet the AA 24×24 rule or a documented equivalent/spacing exception. [C13–C14, E10, E18; decisions 2026-10-30]

**A-02 — Value preview.** A greyscale preview converts both solids and photos while preserving piece boundaries; the quilter can judge light/dark placement without distinguishing hues. Selection and error states remain discernible with colour removed. Photo colour is described as approximate due to capture, lighting and display. [C14, C16, C18, D18–D19]

**A-03 — First-use bar.** A first-time quilter can lay out a quilt and print its cutting chart without a manual. The claim requires a five-to-eight-quilter observation round recording unaided completion, time, wrong turns, help requests and measured print squares. The exact pass threshold is **[proposal]** in acceptance criterion T-11; no round has yet been run. [C1, C15, C18]

**X-01 — Platform, offline use and privacy.** The chosen implementation is web-only TypeScript with an SVG editing surface and HTML controls. It works in current browsers on Windows, macOS, iPadOS, ChromeOS and Linux. Once all application assets have loaded during one online visit, the quilter can create, edit, save, reopen and export offline. There is no design server, account, telemetry, usage upload or runtime third-party asset request. The host necessarily receives a request for application files; it does not receive project or photo data. Which browser versions count as current is **[open]**. [C8–C9, E1–E9, E18, E45–E49; decisions 2026-10-28 and 2026-10-30]

**X-02 — Performance.** The editor remains usable with the accepted photo limit and a representative quilt on iPad and desktop. Concrete latency, memory and transfer targets are **[proposal]** in T-13 and **have not been measured**. A photo over the selected limit is rejected before exhausting memory, leaving the current project intact. [E3, E10–E11, E37–E39, E52]

## Edge cases and constraints

A cutting chart is a physical promise. A grid division that cannot be represented in whole sixteenths, an on-point block that is not square, a seam topology outside the supported units, an invalid photo calibration, and a piece that cannot fit a selected fabric width must produce a specific refusal or an explicitly incomplete chart. None may turn into a silently rounded or guessed cut. If a block is kept visually as a draft, its missing construction and material quantities must be identifiable before export. [A6, A16, B15, D11, D13–D17]

The straight-set formulas assume equal finished-size block positions. On-point finishing includes irrational diagonals even though editable dimensions are exact sixteenths; its rounded *display* is an approximation only. Outer sashing and borders on such a top need their own exact geometry before a finished-size or backing claim. The tool must distinguish a finished quilt dimension, an unfinished sewn piece, a rotary-cutting dimension and a purchase quantity. This is an **inference** from the geometry and print-scale failures, made testable below. [A35–A41, D9, D11, D20–D21]

A ZIP moved to another device must contain every needed photo, including its calibrated scale. Opening a new project cannot replace the current quilt until all required members and dimensions validate. A failed import, unknown future version or refused large photo cannot alter the source file, the current open quilt or an available browser draft. Safari and other browsers may evict local storage, so a downloaded project is the reliable handoff. These are **inferences** from documented platform behavior, not observations of a working librequilt build. [E3–E9, E40–E44]

### Unresolved questions

Every item in this table is **[open]** for the maintainer. Recommendations are draft proposals, not recorded choices. Test rows using them are conditional until approval settles them.

| ID | Options and recommendation | Evidence |
| --- | --- | --- |
| O-01 | Binding join allowance: 10, 12 or 20 inches; default strip width 2¼ or 2½ inches. **Recommend** editable 10 inches and 2½ inches, since independent sources use the 10-inch example. | A12–A13, A67–A69 |
| O-02 | Backing overhang: 4 inches for longarm or 2–3 for domestic. Batting: 2–4 inches. **Recommend** editable 4-inch backing and 3-inch batting defaults, with their purpose stated. | A59–A66 |
| O-03 | Backing orientation: always lengthwise, automatically choose shorter, or present both. **Recommend** present both and require a quilter choice; turning a 108-inch backing changes the fixture by half a yard. Specify joining-seam consumption before claiming exact pieced backing. | A59, A63–A64; research correction 2 |
| O-04 | Metric display: exact conversion shown to two decimal places, or rounded to nearest millimetre/centimetre. **Recommend** two decimals for centimetres and three for metres, labelled approximate. Stored inches never change. | A3–A8, C10–C12 |
| O-05 | Waste and shrinkage defaults: both zero, 10% waste plus 3–5% shrinkage, or settings omitted. **Recommend** zero with editable factors and stated formula; cited ranges differ, and usable width already assumes trimming. | A48–A49, A55–A58 |
| O-06 | Four-at-a-time HST: offer only the corrected construction, or omit it. **Recommend** offer with a bias-edge caution if physical testing validates it; otherwise omit. | A9–A11; research correction 1 |
| O-07 | Exact block list: ship about 40 straight-seam candidates once each has a matched pre-1931 illustration, or ship fewer verified blocks. **Recommend** fewer rather than guessed geometry. | B6, B15; research correction 3 |
| O-08 | Photo retention: embed original pixels or a normalized copy; maximum 12, 24 or 48 megapixels, with a stated compressed-byte cap. **Recommend** normalized copies up to 24 megapixels, retaining aspect ratio and physical calibration; measure iPad memory first. | D13–D19, E3, E11 |
| O-09 | “Current browser”: latest stable only, or latest and one prior stable release per family. **Recommend** latest plus one prior Safari, Chromium and Firefox release where available; publish actual tested version numbers. | E1–E10, E18 |
| O-10 | Performance: no explicit bar, or measurable load, edit, export and memory targets. **Recommend** the unmeasured T-13 targets, revised after an iPad prototype. | E3, E10–E11, E37–E39, E52 |
| O-11 | On-point outer sashing: treat `B+S` as the diagonal pitch with exterior half-sash, or include a full outer sash. **Recommend** construct and measure a proof quilt before fixing the exterior-size rule. The side/corner parent cuts remain as specified. | A41, D9 |
| O-12 | Butted border order: sides-first or top/bottom-first. Continuous sash junctions without cornerstones: vertical-first or horizontal-first. **Recommend** sides-first and vertical-first, disclosed in the chart. | D8–D10; sampler protocol |
| O-13 | Tiled-template overlap: fixed ⅜ inch, fixed ½ inch or editable. **Recommend** ½-inch default, editable where printer margins require more. | D11–D12 |
| O-14 | Project extension and version detail: `.lqzip` or another documented ZIP extension; integer or major/minor version; original or normalized photo members. **Recommend** distinctive extension, integer format version and normalized embedded photos, with a public manifest schema. | E40–E44 |
| O-15 | Pieces longer than usable width, such as long borders: width-of-fabric strips joined with straight quarter-inch seams (each join uses ½ inch); one lengthwise cut as long as the longest piece; or the quilter chooses per fabric. Same-width groups of one fabric sharing strips or not. **Recommend** joined strips by default, as for binding, with lengthwise offered for directional prints or seamless borders; same-width groups of one fabric always share. | A12–A13, A34, D10 |
| O-16 | Undo and redo: every design edit can be undone and redone within a session; or none in the first release. **Recommend** include it; recovering from mistakes matters for first-time users. | Inference from A-01 and T-11; no source opened |

**Research limits.** The track B candidate list has names and a researcher's one-line descriptions, but the needed public-domain illustration-to-geometry matches are unfinished. Sources contradict one another on four-at-a-time HST cuts, binding join length, backing orientation, waste/shrinkage and quilt-size tables. The on-point sampler protocol's "2 across by 3 down" means two block diagonals across and three down, which gives eight whole positions (six blocks plus two plain alternates); T-03 states it that way. Device-demand evidence largely comes from vendor marketing, not a neutral device survey. No real iPad measurements establish a photo pixel limit, memory ceiling or latency target. [A9–A15, A42–A49, A56–A69, B6, B15, C1, C8–C9, D9, E11]

## Acceptance criteria

All numerical expectations below were computed by `python3 docs/specification-fixtures.py`, a synthetic fixture script. A test creates the stated design through supported actions or a documented synthetic file, then compares the visible output and exported chart. Choices tied to O-01–O-16 are conditional. Printed length is measured on paper with a ruler; PDF pixels alone do not prove scale. [A6, A12–A16, C11, D11–D12]

**T-01 — Unit constructions (G-01 through G-08).** Enter the stated finished size, assign distinct synthetic fabrics to parent groups, and read both parent count and yield. For HSTs, a cut value is each parent-square side. A trim variant states the unfinished trim size of `F+½`.

| Input and method | Expected cut and yield |
| --- | --- |
| 3-inch finished square or strip width | 3½ inches |
| 3-inch HST, two at a time; optional trim | 3⅞-inch parents, yield 2; 4-inch oversized parents, trim to 3½ inches unfinished |
| 3-inch HST, four at a time, if O-06 includes it | 5½-inch parents, yield 4 |
| 3-inch HST, eight at a time; optional trim | 7¾-inch parents, yield 8; 8-inch oversized parents, trim to 3½ inches unfinished |
| 3-inch quarter-square/hourglass; optional trim | 4¼-inch parents, yield 2 hourglass units per pair; 4½-inch oversized parents |
| One 4 × 2-inch finished goose, one at a time | 4½ × 2½-inch rectangle and two 2½-inch squares, yield 1 |
| Four 4 × 2-inch finished geese, no waste | one 5¼-inch square and four 2⅞-inch squares, yield 4 |
| 3-inch finished stitch-and-flip corner | 3½-inch square |
| Square-in-a-square, 6-inch finished outer side | 4¾-inch centre; two 3⅞-inch corner parents, each cut once diagonally; unit trimmed to 6½ inches |
| Strip set finished width 2 inches, segment 6 inches | 2½-inch strip; 6½-inch subcut |

Reject a 3.01-inch entered length, a zero finished block, a curve, and a set-in seam as cuttable geometry. An eighth-inch cut already exact stays unchanged. A 3-inch four-at-a-time HST result of 4¼ or 4¾ inches is an explicit failure. [A9–A11, A16–A33, B15]

**T-02 — Straight sampler (L-01 through L-03).** Use two columns and three rows of 12-inch blocks, 2-inch sashing between and around every block, 2-inch cornerstones and one 4-inch plain border. Different block identities do not change these totals.

| Result | Expected |
| --- | --- |
| Top before border; finished top | 30 × 44 inches; 38 × 52 inches |
| Sash and cornerstone counts | 17 sash rectangles cut 2½ × 12½ inches; 12 cornerstones cut 2½ inches square |
| Border if sides first | two 4½ × 44½-inch pieces; two 4½ × 38½-inch pieces |
| Same grid without outer sashing and without border | 26 × 40 inches |

With cornerstones removed, the 30 × 44-inch finished size stays; cornerstone count becomes zero and the chart uses the actual O-12 continuous-sash pieces. A 44½-inch border cannot appear as a single subcut across 40-inch usable fabric width. [A16, A34, D8–D10; sampler protocol]

**T-03 — On-point setting (L-04, L-05).** Use a two-span-across, three-span-down envelope of 12-inch square blocks, with no sash or border. Expect eight whole positions (plain alternates allowed), six side triangles, four corner triangles, two side parent squares and two corner parent squares. The exact finished dimensions are `24√2 × 36√2` inches; shown to nearest sixteenth they are `33 15/16 × 50 15/16`. Side parents cut 18¼ inches, twice diagonally; corner parents cut 9⅜ inches, once diagonally. With 2-inch on-point sashing, the parent cuts are 21⅛ and 10⅞ inches; the outer finished size remains dependent on O-11. Check the specified straight-grain outside edges. [A35–A41, D9; sampler protocol]

**T-04 — Greedy yardage (F-02, F-03, F-06).** Use 40-inch usable fabric width and zero waste and shrinkage. Check both raw bolt length and the *one-time* rounded purchase amount.

| Group | Pieces across; strips | Raw length; purchase |
| --- | --- | --- |
| Thirteen 4½-inch squares | 8; 2 | 9 inches; ¼ yard |
| Seventeen 2½ × 12½-inch sashes, nondirectional fabric | 12½ across, 3; 6 | 15 inches; ½ yard |
| The same sashes in a directional fabric locked to 2½ across | 16; 2 | 25 inches; ¾ yard |
| Twelve 2½-inch cornerstones | 16; 1 | 2½ inches; ⅛ yard |
| The T-02 border (two 4½ × 44½ and two 4½ × 38½ inches), joined plan if O-15 selects it | 166 inches of strip from 5 joined strips | 22½ inches; ⅝ yard |
| The same border, one shared lengthwise cut if O-15 selects it | 8 lengthwise strips, 4 used | 44½ inches; 1¼ yards |

Summing separate lengthwise cuts for the two border lengths (83 inches, 2⅜ yards) is an explicit failure: it buys fabric the plan never uses.

At 42-inch usable width, thirteen 4½-inch squares fit nine across, still requiring two strips and ¼ yard. If O-05 includes editable factors, raw 25 inches with `w=10%` and `s=5%` adjusts to `25×1.10/0.95` inches and rounds to ⅞ yard; both zero gives ¾ yard. A piece too wide in every permitted orientation reports unavailable yardage. [A12–A16, A34, A48–A49, A55–A58]

**T-04a — Metric total (P-01).** The ¼-yard purchase in the first T-04 row is exactly 0.2286 metre before display rounding (`¼×0.9144`). The selected O-04 display rule may shorten that string, but changing the display unit and reopening the project cannot change the stored inch measurements or the ¼-yard purchase. [A3–A8, C10–C12]

**T-05 — Binding, backing and batting (F-04, F-05).** For a 60 × 72-inch top, 40-inch usable width and 2½-inch binding strips, perimeter is 264 inches. A 10-inch join allowance means seven strips, 17½ raw inches and ½ yard; a 20-inch allowance means eight strips, 20 raw inches and ⅝ yard. The chart names the selected allowance. [A12–A13, A67–A69]

| Synthetic 60 × 80-inch top, 4-inch backing overhang | Expected |
| --- | --- |
| Required backing size | 68 × 88 inches |
| 40-inch usable backing, lengthwise, before joining seams | 2 widths; 176 raw inches; 5 yards, a lower bound |
| 108-inch usable backing, lengthwise | 1 width; 88 raw inches; 2½ yards |
| 108-inch usable backing, turned if O-03 permits | 1 width; 68 raw inches; 2 yards |
| Batting with separately chosen 3-inch overhang | 66 × 86 inches |

The two-width backing estimate needs the approved joining-seam allowance added before it can be an exact purchase amount. Turning never happens invisibly. [A59–A66; research correction 2]

**T-06 — Photo calibration (F-01, W-05).** Use a synthetic 600 × 400-pixel fabric image representing a 6 × 4-inch repeat. Enter that repeat or mark two points 300 pixels apart and enter 3 inches. Both routes yield 100 pixels per inch; a 2-inch finished square displays 200 image pixels across at physical scale. Change the repeat offset: motif placement changes while cuts and yardage do not. Export and reopen offline: the retained pixels or documented normalization and scale remain available with no original image path. Zero-distance calibration is refused. [D13–D19, E3, E11]

**T-07 — File round trip and refusal (D-01 through D-03).** Save the T-02 quilt with a synthetic photo and nonzero offset; reopen the ZIP in a fresh offline browser profile. Compare each saved sixteenth, fabric assignment, retained image, chart count and cut. A generic ZIP reader finds one JSON manifest, its version and every referenced photo, with no external asset dependency. Try a truncated ZIP, missing image, duplicate manifest, member path containing `../`, invalid fractional length, unknown unit and future version. Each gives a specific refusal; the source ZIP hash and previously open quilt remain unchanged. [E3–E9, E40–E44]

| Compatibility fixture | Expected observable outcome |
| --- | --- |
| Documented older supported version with 12-inch block, 2-inch sash and photo | Upgrade report; new current-version ZIP preserves 192 and 32 sixteenth counts, image and calibration; source ZIP hash unchanged |
| Manifest one major version higher than reader supports | Refusal naming version; no upgrade ZIP; source hash and current quilt unchanged |
| Unknown documented-ignorable optional field | Opens while preserving all known dimensions under published field rule |
| Unknown geometry or unit field | Refusal, not a partial cut chart |

No older production file exists yet. For the first release, the older-version row uses a **synthetic version fixture documented in the first format note**; the migration test becomes a release gate whenever the format version advances. It does not invent a historical format. [E40–E44]

**T-08 — True-scale printing (P-01 through P-03).** Export T-01's 3½-inch square template and T-02's chart to PDF and SVG on Letter and A4. Print each at 100% on matching paper. Every page's measured test squares are one inch and one centimetre, and the template edge is 3½ inches, within a stated lab tolerance of **[proposal]** 1/32 inch or 1 mm. Deliberately print at 97%: the one-inch square becomes about 0.97 inch and the 3½-inch edge about 3.395 inches; the warning identifies this as unsafe. Tile a synthetic 14 × 14-inch template on both paper sizes, check numbering, overlap and alignment, and measure a reconstructed 14-inch edge. Compare PDF and SVG chart values. [C8, C11, D11–D12, D20–D21, E8, E51]

**T-09 — Offline and platforms (X-01, D-03).** Visit online once and let all app assets finish loading; save T-02, disable networking, then reload. Create a new block, change sashing, export PDF/SVG and ZIP, reopen the earlier ZIP and print or save PDF. Repeat on supported browser/platform combinations, especially iPad Safari through ordinary file selection and share/download flows. A request log shows no design, photo or usage upload and no needed third-party runtime asset. A profile that never completed the first visit may say offline content is unavailable. [E1–E9, E45–E49]

**T-10 — Accessibility (A-01, A-02).** Complete T-02 with keyboard, screen reader, touch and 200% text enlargement. Audit WCAG 2.2 AA, including focus, names, contrast, error recovery, target size and a no-drag route to placement, rotation, fabric assignment and export. Measure primary pointer controls against the 44×44 CSS-pixel goal and document exceptions. Use red/green synthetic fabrics: grayscale preview preserves distinct luminance and piece boundaries, and selection/errors remain identifiable without hue. [C13–C14, C16, C18, E10, E18]

**T-11 — Usability (A-03).** Recruit five to eight quilters new to librequilt; include an iPad or Chromebook user if available. Each chooses or draws a nine-patch, lays out a small quilt, adds sash and border, assigns a solid and own fabric photo, reads yardage, prints a chart and measures its one-inch square. Give no manual. Record unaided completion, elapsed time, wrong turns, help requests, failed steps and physical square measurements. **[proposal]** Declare the charter bar met only if at least 4 of 5 or 6 of 8 complete layout and chart unaided, every measured square meets T-08 tolerance, and no severe blocker remains; otherwise fix and repeat. The threshold is proposed because no test has yet run. [C1, C15, C18]

**T-12 — Scope and block source gate (W-03, W-07).** A release register gives every cuttable library block a pre-1931 illustration for geometry, a name source, its independently authored geometry and a cut test. A name-only Webster entry fails. Attempt FPP, curves, a `.pj8` import, medallion and full metric editing; each reports unsupported scope while preserving the project. The shipped assets contain no manufacturer photo. [B3–B6, B13–B15, D1–D4; research correction 3]

**T-13 — Performance (X-02).** **[proposal; unmeasured]** On a documented current iPad and midrange desktop, with a synthetic 10×10 straight quilt, forty distinct block definitions and four photos at O-08's accepted limit (24 megapixels each if its recommendation is chosen), target: first interaction within 5 seconds on a warm cache; visible placement within 100 milliseconds at the 95th percentile of 100 actions; chart recalculation within 1 second; PDF export within 10 seconds; peak tab memory below 500 MB where measurable. Record device, browser, compressed app transfer size, photo format and memory method. Import a photo just over O-08's selected limit and verify clear refusal and intact design. A prototype may justify revising all thresholds before approval. [E3, E10–E11, E37–E39, E52]

## Approval record

The maintainer must approve an exact specification commit in a GitHub issue or PR.
Record reviewer, date, review URL, and full commit SHA in genairosity.json. Implementation
starts in a separate context with the approved spec. Material changes need fresh approval.
