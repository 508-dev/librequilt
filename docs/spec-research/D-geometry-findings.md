> Agent research report for librequilt, written 2026-10-28 by a locally initiated agent (DeepSeek V4 Pro) following the brief in this folder's README. Mechanical check: 12 of 12 links resolve; 14 of 18 claim quotes found verbatim, the rest on a page that refuses automated requests or differing only in inch marks. The orchestrator reviewed it; no corrections. Its on-point formulas (round the diagonal, then add) give the same results as track A's (add, then round) because the added amounts are whole eighths. Everything marked **[proposal]** is a proposal, not an approved requirement. Corrections and the consolidated summary are in [research.md](../research.md#specification-research-2026-10-28).

# Track D — Geometry, FPP, fabric-photo scale, true-scale printing: findings

Track prefix `D`. Access date for every register row: 2026-10-28. Companion claims file: `D-geometry-claims.md`.
The cutting arithmetic (seam allowances, yardage) is another track; this file covers geometry and behaviour only.

## Summary

- **Layouts are a small taxonomy.** Straight set (edge-to-edge, or sashing with/without cornerstones), on-point (setting triangles), alternate/plain blocks, row/strippy, medallion, and borders (butted vs mitered) are each defined by a tiny rule set [D8][D9][D10]. A first version can ship straight set + sashing/cornerstones + butted borders, with on-point as the one "advanced but common" layout worth including (it appears in the charter's sampler).
- **On-point is the only layout that needs non-obvious geometry:** side triangles are quarter-square triangles cut from a square of `finished block × √2 + 1¼″`, corner triangles are half-square triangles from `finished block ÷ √2 + 7/8″` (sashing width is added to the block term) [D9]. These values were re-checked by script (see §1).
- **Foundation paper piecing has a real, published mathematical foundation.** Leake, Bernstein, Davis and Agrawala (SIGGRAPH 2021) proved a pattern is paper-pieceable iff its "dual hypergraph" is acyclic, and generated sewing orders by leaf-plucking; a 2022 Bridges follow-up (Bakker & Verhoeff) showed *any* design is paper-pieceable in at most two stages [D1][D2][D3]. This is the clean-room basis for any future auto-decomposition.
- **The effort gap between "print what the user numbered" and "find the sewable decomposition itself" is at least an order of magnitude** — the former is a print engine plus a drawing/annotation surface; the latter is research-grade mesh/dual-hypergraph construction that two academic papers implemented [D1][D2][D4]. Recommend shipping the print-first version.
- **Fabric-photo scale has three established mechanisms:** a reference ruler in the photo (Electric Quilt), cropping at the design repeat (Electric Quilt), and "crop so the photo shows N real inches" (Quiltler); scanner DPI is a fourth (EQ scans at 72–75 dpi because it only renders on screen) [D13][D14][D15][D17]. Phone-photo colour is unreliable (white balance/colour cast, metamerism, CRI), so colour is approximate [D18][D19].
- **True-scale printing is solved but has one recurring failure mode:** PDF viewers/browsers default to "fit to page"/"fit printable area", shrinking every measurement; the universal remedy is print at 100 %/"Actual size" plus a printed 1″ (or 1 cm) test square measured before cutting [D11][D12][D20][D21]. Oversized templates are tiled with overlap and alignment marks [D12].
- **The data model should store length as exact dyadic rationals (integer multiples of 1/16″ or 1/32″), not floating point**, and round irrational results (√2) to 1/8″ only when emitting a rotary-cutting value [D11][D9]. Dyadic fractions are exact in binary float (verified), but the *rounding policy*, not float round-off, is what breaks correctness.

---

## 1. Layout types

Each layout is a geometric rule plus a "how common" signal from tutorials and pattern-shop category pages.

- **Straight set.** Blocks laid in horizontal (or vertical) rows, either **edge-to-edge** or separated by **sashing**; sashing may have a **cornerstone** (a small square at each sashing intersection) [D8][D9]. This is the default, most common setting: Kate Colleran's basics series opens with it, and Snuggles Quilts calls it "the traditional quilt block setting … we are all familiar with" [D9]. Geometrically it is a regular grid of block cells with optional sashing/cornerstone rows and columns between them.
- **On-point.** The same square blocks rotated 45°, so rows run diagonally; the ragged edges are squared with **setting triangles** — side triangles (quarter-square triangles, straight-of-grain on the outside) and corner triangles (half-square triangles) [D8][D9]. Formulas (Snuggles Quilts, [D9]): side-triangle cut square = `finished block × 1.414` rounded up to 1/8″ then `+ 1¼″`; corner-triangle cut square = `finished block ÷ 1.414` rounded up to 1/8″ then `+ 7/8″`. The author states that with sashing you add the sashing width to the block size before applying the formula (e.g. 8″ block + 1″ sashing → use 9″). On-point is the common "intermediate" layout — common enough that pattern shops ship free cheat sheets for it — but Snuggles Quilts advises beginners to start small and treat on-point-with-sashing as "definitely advanced" [D9]. Re-checked by script: `6 × √2 = 8.485` → round up to `8.5` → `+1.25 = 9.75`; `6 ÷ √2 = 4.243` → round up to `4.25` → `+0.875 = 5.125`, matching the tutorial exactly.
- **Alternating plain blocks.** A second block — often a plain (unpieced) square — alternates checkerboard-fashion with the main block [D8]. Common in beginners' "snowball" and alternating-square quilts; geometrically just a two-valued block-slot map.
- **Row / strippy quilts.** A straight (usually horizontal) set where each row differs from the others, often with different block sizes per row [D8]. Common for sampler and "row-by-row" charity quilts; geometrically a list of rows, each a list of (possibly differently sized) blocks.
- **Medallion.** A centre block surrounded by successive borders or "rounds", which may be pieced or plain [D8]. Traditional and moderately common; built outward from the centre. Geometrically a centre rectangle plus a stack of frame widths.
- **Borders.** **Butted** corners run the top/bottom border the full width and butt the side borders against them (straight seams, standard, less fabric, "faster to sew"); **mitered** corners join at a 45° seam like a picture frame (more fabric, more time, correct for striped/directional prints) [D10]. **Pieced borders** are borders built from strips or blocks (e.g. a flying-geese band) [D10]. Border-width rule of thumb is roughly ⅓–½ the finished block size [D10].

**Recommendation for a first version:** ship straight set (edge-to-edge **and** sashing with/without cornerstones), alternating plain blocks, butted borders, and on-point. These cover the charter's stated sampler (sashing + on-point). Defer medallion, row/strippy, mitered corners, and pieced borders to a later version; they are either rare or add real seam-math complexity for little first-release reach. Mitered corners in particular are the one border feature with hidden geometry (the 45° corner seam and extra length).

---

## 2. Foundation paper piecing (FPP)

**What a printable FPP pattern must contain** (synthesised from two tutorial/designer sources [D6][D7]):

1. **Sections.** A block is split into one or more independently sewable **sections** (A, B, C…) that are joined after each is pieced [D6][D7].
2. **Piecing-order numbers.** Each fabric patch carries a number (1/A1, 2/A2…) that is the order of sewing: piece 1 anchors, piece 2 attaches to one edge of 1, etc. [D6][D7]. "Numbering matters because one seam creates the edge that the next piece uses" [D7].
3. **Seam-allowance outline.** The template includes a ¼″ seam allowance on its outer edge (some designers make this explicit; Village Bound notes "most FPP templates will include the outer seam allowance in the template") [D6][D7].
4. **Mirroring.** The finished fabric block is a **mirror image of the printed paper**, because you stitch on the printed side and place fabric on the back. Templates are therefore printed (or drawn) as mirror images [D6][D7]. Village Bound: "the finished FPP is going to be a mirror image of the template" [D6]; High Country Quilts: "the finished block comes out as a mirror image of the paper … especially with directional prints" [D7].
5. **Joining marks.** Where sections must be sewn together, some patterns print instructions "within the seam allowance so you know which piece(s) to sew together" [D6].
6. **A test square.** A 1″ (or 1 cm) square to measure and confirm the page printed at 100 % before cutting [D6].

**Sewability constraints.** The academic result is directly usable as the definition: Leake et al. represent a design as a **dual hypergraph** (nodes = fabric faces, hyperedges = seams joining ≥2 faces); the pattern is paper-pieceable **iff the hypergraph is acyclic**, and a **leaf-plucking** algorithm then yields a valid sewing order (reverse of pluck order) [D1]. Their tool lets designers draw geometry and automatically checks/numbers it. The UIST 2022 follow-up ("Sketch-Based Design of Foundation Paper Pieceable Quilts", Leake/Bernstein/Agrawala) takes a partial sketch of edges, completes it into a planar mesh of closed polygonal faces, determines a sewable order, and splits complicated sketches into independently sewable sections [D2]. The Bridges 2022 paper (Bakker & Verhoeff, Eindhoven) extends this: input is a block of polygonal regions, output is a split into sections and pieces with a sewing order, and — notably — **"every design can be made foundation paper pieceable in at most two stages"** [D3]. Practical constraints these encode: no self-overlapping seams, T-junctions create ordering subtleties (Fig. 9 of [D1]), and complex designs need section splits. Designer-side tutorials add the softer rules: cut each fabric patch ≥¼″ larger than its section on all sides, and use straight seams / avoid Y-seams for beginners [D6][D7].

**FOSS landscape (confirmed this session via `gh api` / `gh search`):** **neonfuzz/svg_quilter** (MIT, last push 2025-07-29, 8★, Python) turns an SVG line drawing into FPP sheets — auto-groups faces, labels pieces, adds a configurable seam allowance, flips for the wrong side, packs pieces onto PDF pages [D4]. Five further 2026 repos exist but are 0-star and mostly unlicensed: **isaacc2/Piecewise** (MIT, 2026-10-17, single-file web FPP designer), **millwrightapps/FPPdesigner** (2026-09-12, no licence), **wendybiird/fpp** (2026-06-07, Svelte, no licence), **Rhiba/quilting-svg2pdf** (GPL-3.0, SVG→PDF with seam allowances), and **MysticMike3/FPPNumbering** (2026-03-16, "automatic numbering") [D5]. None is a maintained, licensable dependency today; svg_quilter is concrete prior art for auto-grouping + print.

**Effort estimate: (a) draw-and-print vs (b) auto-decompose.**

- **(a) User draws sections and numbers the order; the tool prints.** The tool needs: a drawing/annotation surface over the block geometry; per-patch numbering labels; a ¼″ seam-allowance outline; a mirror toggle (print the reversed design); joining marks; a printed 1″ test square; and a true-scale PDF/SVG print path. All of this reuses the ordinary block geometry and print engine described in §4–5. This is one focused feature — roughly weeks to a low number of months, low risk.
- **(b) Tool finds the sewable decomposition itself.** This requires constructing a planar mesh of closed faces from arbitrary input, building the dual hypergraph, testing acyclicity, leaf-plucking for the order, and splitting into sections — the exact subject of a four-author SIGGRAPH paper [D1], a UIST sketch-completion paper [D2], and a Bridges algorithms paper [D3]. The algorithms are published (clean-room-usable), but I found no released reference implementation. This is **at least an order of magnitude more work than (a)** and materially riskier. **Recommendation:** ship (a) first; treat (b) as a separate later project, reusing svg_quilter's grouping [D4] or reimplementing the published leaf-plucking test [D1].

---

## 3. Fabric photos

How quilters and tools map a photo of fabric to real-world scale (public pages only):

- **Reference ruler in the photo (Electric Quilt).** EQ's "Getting the Correct Fabric Scale": many downloadable fabric images include a ruler along the edge; "If you want to take a photo of fabric, place a ruler on the fabric before you take the photo," then crop to a mark and use the Scale Fabric tool to "Type the size shown on the ruler in the photo" [D13]. This is the canonical calibration.
- **Cropping at the repeat (Electric Quilt).** EQ's "Import Scanned Fabric" has the user scan a section of fabric, crop a small square (suggested 3″×3″) positioned at the design repeat, and notes that resizing the image changes scale (so crop, don't resize) [D14].
- **Scanner DPI.** EQ recommends scanning at **72–75 dpi at 100 %**, because its fabric images are only rendered on screen (the shipped EQ7 library fabrics are "all 72 dpi JPG files"); 300–600 dpi is the norm for print-quality scanning generally [D14]. The key distinction for librequilt: **screen audition needs only screen DPI; the image must still be tagged with its real-world size.**
- **Repeat size / "crop to N inches" (Quiltler).** Quiltler's public guide reduces true scale to a rule: "Crop your fabric photo so the square you keep covers the same number of real inches as your block" [D15]. It distinguishes **Stretch** (one copy of the photo fills the block) from **Tile** (one copy fills a block-sized square then repeats), and states that an exact "type the print's real size" control is still in development [D15]. Measuring the **pattern repeat** with a ruler is the shared quilter practice [D17].
- **Tiling, rotation, fussy cutting.** Repeating prints are tiled; rotation/straightening of a scan matters (EQ has a "Rotating and Straightening a Fabric Scan" article) [D13]. **Fussy cutting** is deliberately positioning a motif in a piece — a "window template" the size of the finished piece is moved over the fabric to choose the motif [D16]. This implies a first version needs, at minimum, a way to pan/offset the fabric image within a piece so a motif can be centred.
- **Colour accuracy limits of phone photos.** White balance produces a **colour cast** when the light source varies (warm under incandescent, blue in shade, green under some fluorescents), and auto white balance fails on scenes with no neutral or a single dominant colour [D18]. **Metamerism** — two fabrics match under one light but not another — and low **CRI** bulbs mean a photo is not a reliable colour reference [D19]. Online fabric images are further filtered by lighting, white balance, editing, and the backlit screen [D19].

**Minimum for a first version.** A fabric is either a **solid colour** or a **user photo/scanned image with a stored "pixels-per-inch" (or "this crop shows N inches") scale factor**, plus repeat/tile and offset (for fussy cutting). Calibration UI: let the user (1) place a ruler in the photo and mark two points with a known distance, or (2) type the repeat size. Colour should be presented as approximate; a "daylight vs warm" toggle or a note is sufficient, not colour management.

---

## 4. True-scale printing

How designers tell users to print templates, and what goes wrong:

- **The instruction is unanimous: print at 100 % or "Actual size", never "Fit to page".** Quilt Block Atlas: "Print at 100% or 'Actual size' — never 'Fit to page', which shrinks every measurement on the sheet" [D11]. GridPrint: "Print the PDF at 100% (never 'fit to page')" [D12].
- **The test square is the control.** A printed 1″ (or 1 cm) square must be measured with a ruler before cutting; if it is not exactly 1″, the page was scaled [D6][D11]. Quilt Block Atlas notes the trap that a mis-scaled print can land back on ruler marks (12.5″ at 97 % = 12.125″ = a "clean 12⅛″"), so only the calibration square is an honest check [D11]. Verified by script: 97 % → 2.5″ becomes 2.425″, 12.5″ becomes 12.125″; 95 % → 12.5″ becomes 11.875″ [D11].
- **What goes wrong** (documented failure modes) [D11][D20][D21]:
  1. **"Fit to page"/"Shrink to fit"** scales the whole sheet down. Microsoft Edge names the two options explicitly — "Fit to printable area" (auto-adjusts to fit the printable area) vs "Actual size" (prints at original size, no scaling) [D20].
  2. **A remembered scale value.** Browser print dialogs keep the last scale, so a previous job below 100 % silently shrinks later jobs [D11].
  3. **"Fit printable area"** on printers that can't print edge-to-edge shrinks instead of clipping [D11].
  4. **PDF-viewer default.** Acrobat Reader "sets the scaling to 'Fit'", even for content that fits — a user measured it offering "Fit" at 95 % [D21]. This is the single most-cited cause and the reason designers put the test square on every page [D6][D11].
  5. **Phone preview/share-sheet** printing re-scales before sending to the printer [D11].
- **Tiling a template larger than a page.** GridPrint tiles at 100 % with a configurable **overlap** (default 10 mm), crop marks, numbered pages and an assembly map, and prints a scale ruler on the guide; pages are then cut and taped [D12]. Desktop PDF viewers offer an equivalent "Poster"/tile mode with a scale and overlap setting (Adobe Acrobat "Poster" and "Tile Large Pages"; from memory, unverified this session). The overlap + alignment marks are what let pages be taped into one true-scale sheet.
- **US Letter vs A4.** The tool must emit both paper sizes, since a Letter PDF printed on A4 (or vice versa) is a scaling hazard (the Adobe community notes a document assumed to be Letter being re-scaled to A4) [D21]. The test square makes the mismatch detectable regardless of paper size.

**Implication for librequilt:** the print path must (1) render at exact inches with the paper size as an explicit dimension, (2) always include a 1″/1 cm test square, (3) support tiling oversized templates with overlap and alignment marks, and (4) offer Letter and A4. These are all standard PDF/SVG features, not proprietary.

---

## 5. A data model in prose

A design can be represented so that all of the above is computable, as follows. (Prose only; no code.)

- **Lengths are dyadic rationals.** Represent every measurement as an integer number of sixteenths (or thirty-seconds) of an inch — equivalently, an exact rational with denominator a power of two — rather than floating point. Dyadic fractions (⅛″, 1/16″, ¼″, ⅞″) are exactly representable in binary, so a rational-integer scheme is *lossless* for ruler values (verified). The genuine hazard is not float round-off of these values; it is the **rounding policy**: quilters round only at specific moments (the on-point √2 term is rounded up to 1/8″ *then* the seam allowance is added [D9]), and a tool that silently rounds elsewhere — or carries full-precision √2 through — produces cuts that don't match the ruler. The specification should store exact values, and round **only** when a rotary-cutting value is emitted, to the nearest 1/8″ (up, per convention), with the rule "unsupported sizes are refused, never silently rounded" [D11].
- **Blocks.** A block is a list of **pieces**, each a polygon on a square grid, plus **seams** between pieces. A piece is a polygon whose vertices are grid points (for grid-based blocks); each piece references a **fabric**. Two representations coexist: the **finished** geometry (the visible patchwork) and, derived from it, the **cut** geometry (finished shape + ¼″ seam allowance), which is what the rotary-cutting chart prints. Mirroring and rotation of a block (for on-point or for FPP mirroring) are transformations applied to the finished geometry.
- **Units.** Reusable groups — HST (half-square triangle, two right-isosceles triangles in a square), flying geese (a rectangle of three triangles), four-patch, etc. — are sub-blocks: a unit is a block-like polygon set with named sub-pieces, referenced by many blocks. This is what lets a block library be *parametric* (a definition of geometry plus traditional names) rather than thousands of hard-coded drawings.
- **Layout.** A quilt is a **grid of block slots** (rows × columns), where each slot names a block and an optional rotation, plus optional **sashing** (a per-column and per-row strip width, with or without **cornerstones** at intersections) and a stack of **borders** (each a width plus a corner style: butted or mitered, plain or pieced). On-point is represented by rotating the slot grid 45° and computing **setting-triangle** slots from the finished block size (using the §1 formulas), so on-point is a derived layout over the same grid rather than a separate format. A row/strippy quilt is a grid where rows may have independent block sizes; a medallion is a centre slot plus border rounds.
- **Fabrics.** A fabric is either a **solid colour** or a **scaled image**: the image (PNG/JPEG/SVG) plus a stored **scale** (pixels per inch, or "this crop spans N real inches"), plus a tiling mode (stretch vs tile) and an offset for fussy cutting [D15]. The scale is what lets the same image render a ½″ motif and a 2″ motif correctly.
- **FPP as a piecing tree.** An FPP pattern is a block annotated with a **section split** (sections A, B, …) and, within each section, a **sewing order** (a total order 1, 2, 3, … such that each new patch attaches to the already-sewn region along a single seam). This is exactly the **leaf-plucking order** of the dual hypergraph in Leake et al. [D1], so the piecing tree is both the print artifact (numbers on the paper) and the proof-of-sewability. A future auto-decomposer would *generate* this tree; the first version *stores* a user-authored tree.

**Precision evidence.** (1) Ruler compatibility requires dyadic values and explicit refusal of non-ruler sizes [D11]. (2) The on-point formulas demonstrate the "round at the cut, up to 1/8″, then add the seam allowance" convention [D9]. (3) Dyadic fractions are exact in binary floating point, so the argument for a rational representation is about *determinism and rounding policy*, not about float error per se (verified by script this session).

---

## Candidate requirements

Numbered proposals, each **[proposal]** and linked to evidence IDs.

1. **[proposal]** The tool represents all lengths as exact multiples of 1/16″ (integer sixteenths) and rounds to the nearest 1/8″ (up) only when emitting a rotary-cutting measurement; sizes that cannot be expressed on the ruler are refused, not silently rounded. *(D11, D9)*
2. **[proposal]** The tool lays out a quilt as a grid of block slots with optional rotation, optional sashing with/without cornerstones, and a stack of borders with butted corners in v1. *(D8, D10)*
3. **[proposal]** The tool supports an on-point setting and computes side-triangle cut squares as `ceil(finished × √2, 1/8″) + 1¼″` and corner-triangle cut squares as `ceil(finished ÷ √2, 1/8″) + 7/8″`, adding the sashing width to the block term when sashing is present. *(D9)*
4. **[proposal]** A printable FPP pattern includes sections (A/B/C), per-patch piecing-order numbers, a ¼″ seam-allowance outline, mirroring, section-joining marks, and a printed 1″ test square. *(D6, D7)*
5. **[proposal]** The FPP print path stores a user-authored piecing tree (sections + sewing order) and prints it; automatic sewable-decomposition is out of scope for v1. *(D1, D2, D3, D4)*
6. **[proposal]** A fabric is a solid colour or a user image carrying a stored pixels-per-inch scale, a stretch/tile mode, and an offset; the user calibrates scale by marking two points of a known distance (ruler in the photo) or entering the repeat size. *(D13, D14, D15, D17)*
7. **[proposal]** The tool treats fabric-photo colour as approximate and does not attempt colour-managed accuracy in v1. *(D18, D19)*
8. **[proposal]** Every printable template/chart is rendered at exact size for an explicit paper size (Letter and A4), always carries a 1″ (and 1 cm) test square, and oversized templates are tiled across pages with overlap and alignment marks. *(D11, D12, D20, D21)*
9. **[proposal]** The tool emits a document open format (PDF and/or SVG) for all print output. *(D12; charter §7)*

## Open decisions for the maintainer

1. **On-point in v1 or later?** Options: include (it is in the charter's sampler, and the geometry is only two formulas) vs defer (it adds setting-triangle generation and diagonal-row sewing instructions). Evidence for including: it is the one "advanced" layout quilters explicitly associate with sashing [D9], and the charter's sampler calls for an on-point setting.
2. **FPP scope.** Options: (a) draw-and-print only (user numbers the order) — recommended, low risk; (b) auto-decomposition — high value, order-of-magnitude more effort [D1][D2][D3][D4]. No released implementation of the academic algorithms was found to reuse.
3. **Which layouts ship first.** Straight set, sashing/cornerstones, and butted borders are uncontroversial. The open calls are medallion, row/strippy, mitered corners, and pieced borders (all deferred in the recommendation above) [D8][D10].
4. **Fabric-scale calibration UX.** Options: ruler-in-photo two-point calibration [D13], type-the-repeat-size [D17], "crop covers N inches" [D15], or all three. The three map to the same underlying scale factor, so this is a UI decision, not a data-model one.
5. **Precision unit.** Sixteenths vs thirty-seconds vs millimetres. Evidence: rotary rulers are marked in 1/8″ (and 1/16″), so sixteenths suffice for North-American quilters [D11][D9]; a metric (mm) store would be needed for a metric market, and the two are not exactly interconvertible at 1/16″ granularity.

## Facts / Inferences / Unknowns

**Facts (sourced):** (1) The eight layout types each reduce to a short rule set [D8][D9][D10]. (2) On-point side/corner triangle formulas, re-checked by script [D9]. (3) Leake et al. proved paper-pieceability ⇔ acyclic dual hypergraph, with leaf-plucking for order [D1]; Bakker & Verhoeff: any design paper-pieceable in ≤2 stages [D3]. (4) svg_quilter is MIT, dormant since 2025-07-29; five other FPP repos appeared in 2026, all 0-star and mostly unlicensed [D4][D5]. (5) EQ calibrates fabric scale by ruler-in-photo and scans at 72–75 dpi [D13][D14]. (6) The print-at-100 %/test-square convention is universal, and Acrobat Reader defaults to "Fit" scaling [D11][D20][D21].

**Inferences (not directly stated):** (a) Because the FPP algorithms are published in papers and svg_quilter is MIT, an auto-decomposition feature is clean-room-buildable later, but it is a distinct project, not an extension of the print path. (b) The data model's precision risk is policy (when to round), not float representation. (c) On-point is best implemented as a derived layout over the same block-slot grid rather than a separate storage format.

**Unknowns:** (1) Whether a released reference implementation of Leake et al.'s tool exists (not found). (2) What fraction of sold patterns are FPP vs traditionally pieced (no citable number found). (3) Whether any 2026 FPP repo (Piecewise, FPPdesigner, FPPNumbering) is of reusable quality — not evaluated. (4) Exact DPI a phone fabric photo should target for screen-only use (only EQ's 72–75 dpi scanner guidance is sourced).

---

## Evidence register

Access date for every row: 2026-10-28. "not checked" = licence/terms not assessed.

| ID | URL | Licence / terms | Establishes | Sections |
| --- | --- | --- | --- | --- |
| D1 | mackenzieleake.com/projects/paperpiecing | not checked | Leake/Bernstein/Davis/Agrawala, "A Mathematical Foundation for Foundation Paper Pieceable Quilts" (ACM TOG 40(4), SIGGRAPH 2021): dual hypergraph (nodes=faces, hyperedges=seams); paper-pieceable ⇔ acyclic; leaf-plucking yields sewing order; implemented in a design tool | 2, 5 |
| D2 | people.csail.mit.edu/leake/projects/sketchpiecing/ | not checked | UIST 2022 follow-up: sketch-based FPP; completes partial edges into a planar mesh of closed faces; determines sewable order; splits into sections | 2 |
| D3 | research.tue.nl/en/publications/algorithms-to-construct-designs-for-foundation-paper-piecing-of-q | not checked | Bakker & Verhoeff, Bridges 2022 pp. 347–350: splits a block of polygonal regions into sections+pieces with sewing order; "every design can be made foundation paper pieceable in at most two stages" | 2 |
| D4 | github.com/neonfuzz/svg_quilter (via `gh api`) | MIT | SVG→FPP CLI: grouping, labeling, seam allowance, flip, PDF packing; 8★; last push 2025-07-29; deps shapely/svgpathtools/pyclipper/reportlab | 2, 4, 5 |
| D5 | `gh search repos` "foundation paper piecing" + "paper piecing" | n/a | isaacc2/Piecewise (MIT, 2026-10-17), millwrightapps/FPPdesigner (2026-09-12), wendybiird/fpp (2026-06-07), Rhiba/quilting-svg2pdf (GPL-3.0), MysticMike3/FPPNumbering (2026-03-16); all 0★ | 2 |
| D6 | villageboundquilts.com/blog/how-to-fpp | not checked | FPP pattern must-haves: 1″ test square, sections A/B/C, numeric order, mirror image, joining marks, outer seam allowance | 2, 4 |
| D7 | hcquilts.com/blogs/tips-and-tricks/foundation-paper-piecing-patterns | not checked | "finished block comes out as a mirror image of the paper"; numbered areas = sewing order; stitch on printed side, fabric on back; Y-seams advanced | 2 |
| D8 | katecollerandesigns.com/quilting-basics-how-to-plan-quilt-layouts | not checked | Layout taxonomy: straight set (horizontal/vertical), sashing/cornerstones, alternate blocks, row quilt, on-point (QST side + HST corner triangles), single block, medallion, custom/irregular grid | 1 |
| D9 | snugglesquilts.com/quilt-block-settings-on-point | not checked | On-point side-triangle = finished×1.414 round-up-1/8 +1¼″; corner = finished÷1.414 round-up-1/8 +7/8″; sashing width added to block term; on-point+sashing "definitely advanced" | 1, 5 |
| D10 | gequiltdesigns.com/blogs/the-quilters-toolkit/all-about-quilt-borders | not checked | Butted vs mitered corners (45°); butted = standard/less fabric; mitered = directional prints; border width ≈ ⅓–½ block; strip-pieced borders | 1 |
| D11 | quiltblockatlas.com/printing-quilt-patterns-at-100-percent | not checked | Print at 100 %/Actual size, never Fit-to-page; 1″ calibration square the only honest check; scale-error table (97 %→2.425″, 95 %→11.875″); remembered scale; fit-printable-area; phone preview; "never silently rounded" | 4, 5 |
| D12 | gridprint.app/en/use/sewing-pattern | not checked | Tile at 100 % with overlap (default 10 mm), crop marks, numbered pages, assembly map, printed scale ruler; "Set real size" = mark known distance | 4 |
| D13 | support.electricquilt.com/articles/getting-the-correct-fabric-scale | not checked | Ruler-in-photo fabric scaling: place ruler, crop to mark, Scale Fabric tool types the size; related: crop-to-repeat, rotate/straighten | 3 |
| D14 | support.electricquilt.com/articles/import-scanned-fabric | not checked | Scan fabric at 72–75 dpi at 100 %; crop small square (3″×3″) at the repeat; resize changes scale (so crop, don't resize); EQ library fabrics are 72 dpi JPG | 3 |
| D15 | quiltler.com/fabric-print-scale | not checked | Stretch vs Tile; true scale ⇔ "crop so the square you keep covers the same number of real inches as your block"; exact type-the-size control "in development" | 3 |
| D16 | thequiltshow.com/quiltipedia/what-is-fussy-cutting | not checked | Fussy cutting = selecting a motif and cutting to exact size; "window template" sized to the finished piece | 3 |
| D17 | learnhowtoquilt.com/encyclopedia/fabric-scale | not checked | Fabric scale = print size; measure the pattern repeat (½″, 4″, 10″ examples); small-scale prints for small pieces | 3 |
| D18 | photographypro.com/white-balance | not checked | White balance / colour cast; auto WB fails on no-neutral or single-colour scenes; Kelvin table | 3 |
| D19 | sewendipitous.com/How-Light-Changes-Fabric-Color-And-What-Quilters-Should-Know_b_114.html | not checked | Metamerism; CRI (80/90+/95+); lighting changes perceived colour; online images pass through lighting/WB/editing/screen | 3 |
| D20 | support.microsoft.com/en-us/edge/print-in-microsoft-edge | not checked | Edge "Fit to printable area" (auto-adjusts) vs "Actual size" (original size, no scaling) | 4 |
| D21 | community.adobe.com/questions-9/how-to-set-default-scaling-to-actual-size-in-print-dialog-1520586 | not checked | Acrobat Reader "sets the scaling to 'Fit'"; measured offering "Fit" at 95 % even for a centred 10 cm box; Letter/A4 re-scaling | 4 |
