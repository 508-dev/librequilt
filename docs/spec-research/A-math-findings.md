> Agent research report for librequilt, written 2026-10-28 by a locally initiated agent (DeepSeek V4 Pro) following the brief in this folder's README. Mechanical check: 11 of 11 links resolve; 9 of 13 claim quotes found verbatim, the rest on pages that refuse automated requests or in PDF formatting. The orchestrator reviewed it; **two corrections apply.** The four-at-a-time half-square triangle formula in section 2 and candidate requirement 4 under-cuts; the correct cut square is (finished + 1/2) x sqrt(2) + 1/2, about finished x 1.414 + 1 1/4. The 108-inch backing in example 10 is not turned to save fabric. fabricmathtools.com (A11) contradicts several independent sources and should not be relied on. The examples script in this folder carries the corrected formula. Everything marked **[proposal]** is a proposal, not an approved requirement. Corrections and the consolidated summary are in [research.md](../research.md#specification-research-2026-10-28).

# A — Findings: quilting arithmetic, yardage, and cutting-chart conventions

Track A, librequilt specification research. Access date for all sources: 2026-10-28.

## Summary

- The piecing system is small and stable: a **1/4-inch seam allowance** (6 mm metric), **finished size + 1/2"** for plain squares/rectangles/strips, and a handful of triangle formulas built on **+7/8"** (half-square triangles) and **+1¼"** (quarter-square triangles).
- Rotary rulers are marked in **1/8-inch** increments, and published formulas repeatedly say to **round cut sizes up to the nearest 1/8"**. Yardage is conventionally rounded **up to the next 1/8 yard** (4.5 in), the smallest cut most shops sell.
- The one genuinely contested formula is the **half-square triangle made "4-at-a-time"**: published charts give *finished + 1¼"* (fabricmathtools/Quiltler) or *finished ÷ 0.64* (Treasurie), but the geometric exact value for the "sew the perimeter, cut both diagonals" construction is **(finished + 1/2) × √2**, which is larger than either published number. This is the single most important thing to settle before writing acceptance tests. (A9, A10, A11)
- Usable fabric width is **40–42 inches** from a 44–45-inch bolt; the safe planning number is **40"**. Metric quilting cotton is **110–112 cm** wide, sold **per metre** (UK/EU/AU), often in 5–10 cm increments with a 0.25 m minimum.
- Yardage is a **strip-then-subcut** calculation (pieces per strip = floor(WOF ÷ cut width); strips = ceil(pieces ÷ per-strip); yards = strips × cut height ÷ 36, rounded up). This is the standard one-dimensional cutting-stock / guillotine pattern.
- On-point **side setting triangles** are cut from a square sliced **twice** diagonally (quarter-square, straight grain on the outer edge); **corner triangles** from a square sliced **once** (half-square, straight grain on the two outer edges) — so the bias always falls on the *internal* seam.
- No maintained FOSS quilt calculator exists; `gh search` returns only 0-star stubs. Published commercial calculators (Quiltler, QuiltCalc/CraftCalc, Quilter's Paradise) all implement the same strip-then-subcut formulas this spec needs.

## 1. Units and rounding

**Smallest cutting increment.** Rotary cutting rulers for quilters are graduated in **1/8-inch** marks; that is the smallest increment quilters routinely cut. Generations Quilt Patterns, giving setting-triangle formulas, says to "**Round up to the nearest 1/8" (because you'll use a rotary ruler)**" (A6). The stitch-and-flip and square-in-a-square tutorials likewise round to the nearest 1/8". (A6, A10)

**Yardage rounding.** Three sources state yardage is rounded **up to the next 1/8 yard** (4.5 in): Quiltler's binding calculator ("divide … and rounds yardage up … to the nearest 1/8 yard") (A13), CraftCalc's binding calculator ("fabric rounded up to the nearest eighth yard") (A12), and CalculatorCollection ("rounded up to the next ⅛ yard (4.5 in), the smallest cut most shops sell") (A14). Some generalist calculators round to the nearest ¼ yard instead (A14, A15); this is a real variance to record.

**Seam allowance.** The quilting standard is **1/4 inch**, universally. Its metric equivalent is stated as **0.6 cm / 6 mm** by sewingwithease ("1/4 inch (0.6 cm) for quilting") (A1) and by SewCalcs ("¼″ = 6 mm … Standard for quilting in both UK and US") (A2). The task's suggested alternatives (0.75 cm, 7 mm) do **not** appear as the standard in any source opened this session; 7 mm/0.75 cm are rounding variants some quilters use, not a documented convention. Metric rulers are commonly marked in both inches and cm, but metric-country quilters overwhelmingly keep working in **imperial inches** because patterns are written in inches (Tilda's pattern notes: "Measurements are in imperial inches with metric conversions in brackets – use only one system throughout (preferably inches)") (A3).

**How fabric is sold.** In the UK, Europe, Australia and Japan quilting cotton is sold **per metre**, width **110–112 cm** (≈ 44") (A4, A5, A7). UK shops sell in **5 cm or 10 cm increments** with a **0.25 m minimum** (a 0.25 m cut arrives as a **50 × 55 cm fat quarter**); Sew Hot sells "in 5 cm cuts with a minimum of 0.25 metres" (A7); Busy Bee (NZ) "minimum purchase is 25 cms with increments of 5 cms thereafter" (A8). Wide backing is **275 cm (108")** (A8). Japan's cotton is commonly **110 cm** (A4). Usable width after selvage removal is reported as ~**105 cm** from 110–112 cm (A4).

**Metric "seam allowance on the triangle" note.** The +7/8" (2.2 cm) triangle allowance is used as-is by metric-country quilters; Treasurie states the 2-at-a-time allowance as "add 7/8 inch (2.2cm)" (A10).

## 2. Cut sizes for units

Unless noted, "finished" = the size sewn into the quilt; "cut" = with 1/4" seam allowance. Yield is per pair/set of starting squares.

| Unit | Formula (cut size) | Yield | Evidence |
|---|---|---|---|
| Square | finished + 1/2" | 1 | A16 |
| Rectangle | finished + 1/2" each side | 1 | A16 |
| HST, 2-at-a-time | finished + 7/8" | 2 per pair | A9, A10, A17, A18 |
| HST, 2-at-a-time (oversized/trim) | finished + 1" | 2 | A9, A10 |
| HST, 4-at-a-time | **(finished + 1/2) × √2** (geometric); charts say +1¼" or ÷0.64 | 4 per pair | A9, A10, A11 |
| HST, 8-at-a-time (magic 8) | (finished + 7/8") × 2 | 8 per pair | A19, A20, A21, A10 |
| HST, 8-at-a-time (oversized) | (finished + 1") × 2 | 8 | A22, A23 |
| Quarter-square triangle (hourglass) | finished + 1¼" | 2 per 2 squares (cross-HST) | A24, A25, A26 |
| QST (oversized/trim) | finished + 1½" | — | A26 |
| Flying geese, 1-at-a-time (stitch-and-flip) | rectangle (w+1/2)×(h+1/2); corner squares h+1/2 (×2) | 1 | A27 |
| Flying geese, 4-at-a-time (no-waste) | large square w+1¼"; small squares h+7/8" (×4) | 4 | A28, A29 |
| Stitch-and-flip corner | finished corner + 1/2" | 1 | A27, A30 |
| Square-in-a-square, center | finished center + 1/2" | 1 | A31 |
| Square-in-a-square, corner triangles | (finished center ÷ √2) + 7/8", cut twice for 4 triangles | 4 | A31, A32 |
| Strip set | strip = finished width + 1/2"; subcut = finished + 1/2" | — | A16, A33 |

**Half-square triangles (the contested case).** The 2-at-a-time formula is rock solid: finished + 7/8" (Treasurie A10, Quiltler A9, Raevenfea A17, Quilter by Design A18). The 8-at-a-time "magic 8" formula is also consistent — **(finished + 7/8") × 2** — stated by BERNINA ("Desired finished size of half square triangle + 7/8" X 2 = Size of beginning square") (A19), Craftsy (A20), and Treasurie (A10). Two sources instead teach the oversized **(finished + 1") × 2** (Penny Spool A22, QuiltPlan A23); fabricmathtools gives a tighter **2×finished + 1½"** (A11). All three are within 1/2" of each other and all assume trimming.

The **4-at-a-time** method (place two squares right sides together, sew around all four outside edges, cut both diagonals — Quiltler A9, Treasurie A10) is where sources genuinely conflict:

- fabricmathtools: "Cut size = finished + 1¼"" (A11); Quiltler: "cut at finished + about 1¼"" (A9).
- Treasurie: "Cut Square = Finished Size / 0.64" (A10) — e.g. 3" → 4¾".
- Geometric exact (derived and verified in `A-math-examples.py`): the diagonal cut becomes the HST's outer edge of length S/√2, which must equal finished + 1/2", so **S = (finished + 1/2) × √2**. For 3" finished that is 4.9497" — larger than both 4¼" and 4¾". Both published values **under-cut** the unit and are unusable without accepting an undersized or aggressively-trimmed result.

I computed and checked all of the above with `python3 .context/spec-research/A-math-examples.py` (the "derivation check" prints the numbers). The 2-at-a-time "7/8" is itself a rounding-up of the exact F + 1/2 + 1/(2√2) ≈ F + 0.8536.

## 3. Layout arithmetic

**Straight set.** Finished quilt = (blocks across × block) + ((blocks across − 1) × sashing) + borders, and the same in height. Cornerstones at sashing intersections do not change the total when they are the same finished size as the sashing. (A34, A16)

**On-point setting.** The two formulas, with block size B (all rounded up to 1/8"):

- **Side setting triangles:** cut square = **B × 1.414 + 1¼"**, then cut **twice** diagonally → 4 quarter-square triangles (A35, A36, A37, A38). For B = 12", Timber Lane's table gives 18¼" (A39).
- **Corner setting triangles:** cut square = **B ÷ 1.414 + 7/8"**, then cut **once** diagonally → 2 half-square triangles; cut two squares for the four corners (A35, A36, A37). For B = 12", Timber Lane gives 9⅜" (A39).

**Why quarter- vs half-square cuts (bias placement).** For *side* triangles the quilt's outer edge is the **long** (hypotenuse) edge; cutting a square **twice** diagonally puts that hypotenuse on the straight grain, leaving the two short (bias) edges to be sewn internally to blocks. For *corner* triangles the quilt's outer edges are the two **short** legs; cutting **once** diagonally puts both legs on the straight grain and leaves the bias on the internal hypotenuse. Shadywood states this explicitly (A38), and National Quilters Circle: "we want our bias to be right here, and our straight of the grain … on the outside corner" (A40).

**Sashing and cornerstones shift the term.** With sashing, the "block" term in the formulas becomes **finished block + finished sashing** (the diagonal distance the sashing adds). The Quilting Nook's on-point-with-sashing handout demonstrates the adjustment (adds the cornerstone to the block before applying √2) (A41). This is the least-standardized corner of the layout math and needs a maintainer decision (below).

**One disagreement.** Reproduced Quilt Lover gives the corner-triangle square as simply "block + 1" (A36) — an oversized variant vs the standard block ÷ 1.414 + 7/8". Both are in circulation; the standard is the ÷1.414 form.

**Bed / quilt sizes (disagreement, not resolved).** Sources differ by up to ~30". Representative values:

| Size | Stitchin' Heaven (A42) | Missouri Star (A43) | Piece & Plenty (A44) | Philanthropy (A45) | Quiltler (A46) |
|---|---|---|---|---|---|
| Crib | 36×52 | 36×52 | 36×54 | 36×52 | 36×52 |
| Throw | 60×60–72 | 50×65 | 54×70 | 50×65 | 50×65 |
| Twin | 72×90 | 68×86 | 72×90 | 70×90 | 70×90 |
| Full/Double | 81×96 | 84×90 | 85×108 | 85×108 | 85×90 |
| Queen | 90×108 | 90×95 | 90×108 | 90×108 | 90×95 |
| King | 120×120 | 108×95 | 108×108 | 110×108 | 108×95 |

Mattress sizes (more consistent): crib 28×52, twin 39×75, full 54×75, queen 60×80, king 76–78×80 (A44, A46, A47). The maintainer should pick one authority per size and document it; these are conventions, not facts.

## 4. Yardage

**Usable width.** Quilting cotton is labelled 44–45", but usable width after trimming selvages is **40–42"**; the safe planning number is **40"** (A34, A48, A49). Metric: 110–112 cm, usable ~105 cm (A4, A7).

**Strip-then-subcut.** The near-universal algorithm: pieces per strip = ⌊WOF ÷ cut width⌋; strips = ⌈pieces ÷ per-strip⌉; length = strips × cut height; yards = length ÷ 36, rounded up to 1/8 yd. StitchLogic documents exactly this and appends a **+10% waste** factor (A49); Stitchin' Heaven's worked example (80 squares at 6.5" → 6 per strip → 14 strips → 91" → ≈2.5 yd) (A34) matches the script's method.

**Fat quarters / fat eighths.** A fat quarter is **18" × 22"** (18×21" from 42" bolts; 18×20" from narrower) (A50, A51, A52, A53). A fat eighth is **9" × 22"** (or 11" × 18") (A51, A54). Metric fat quarter ≈ **50 × 55 cm** (A7). These are cutting *sources*: a fat quarter can yield pieces up to 18" × 22", so the tool should let the user constrain a fabric to a fat quarter's dimensions.

**Directional prints.** Directional (one-way) prints constrain layout: pieces cannot be rotated 180°, which reduces the pieces-per-strip count and can add yardage. High Country Quilts lists "Is the print directional? Directional prints limit layout choices" as a first-order yardage input (A55); several generalist calculators (A14, A15) expose a "directional fabric" toggle.

**Pre-wash shrinkage.** Quilting cotton shrinks **3–5%** on first wash (Moda via MadamSew: "cotton shrinks between 3% and 5%") (A56); other sources give 2–5% (A57) up to 5–7% (A57). 108" backing shrinks to ~104" (A58). The practical rule is to **buy ~10% extra** if not pre-washing (A57) or plan WOF as 40" post-wash (A49).

**Backing.** Add **overhang** to the top on all four sides: **4"** for longarm (A59, A60, A61, A62), **2–3"** for domestic machine (A59, A60). Backing width/height = top + 2×overhang; **number of widths** = ⌈backing width ÷ WOF⌉; yardage = widths × backing height ÷ 36. Boneyard's worked example (60×80 → 68×88 backing, 2 widths of 44", ≈4.9 yd) (A59) matches the script. Wide **108"** backing eliminates seams for most quilts (A58, A63). **Seam orientation:** the pieced seam runs parallel to the length of the quilt (A63, A59); calculators compare vertical vs horizontal piecing to minimise waste (A64).

**Batting.** Batting is cut with its own (smaller) overhang, typically **2–4"** beyond the top (A65, A66).

**Binding.** perimeter = 2×(W+L); add an allowance for mitered corners and the diagonal join — sources use **+10"** (CraftCalc A12, Quiltler A13), **+12"** (Quilt Calculator, Stitchtale A67), or **+20"** (Missouri Star A68). Strips = ⌈(perimeter + allowance) ÷ WOF⌉; yardage = strips × strip width ÷ 36. Strip width **2½"** is standard (double-fold); 2¼" for a narrower finish (A68, A69). **Straight-grain** binding is the default; **bias** binding (strips cut at 45°) is used only for curved edges and needs more yardage (A69, from memory). CraftCalc's example (60×72 → perimeter 264 + 10 = 274 → 7 strips × 2½" = ~0.5 yd) (A12) matches the script.

## 5. How published patterns present cutting instructions

From the patterns and handouts opened this session (Moda/Block Heads and Tilda PDFs A3, A70; guild handouts A39, A19), the conventional rotary-cutting chart has a consistent, teachable shape:

1. **A fabric key.** Each fabric is assigned a letter or colour (e.g. "A = light, B = dark"), used throughout.
2. **Cutting list grouped by fabric**, most-to-least. Each line names the fabric, then a quantity, a piece description, and a cut size. Sub-cuts are grouped so the *parent* cut is stated once and the pieces derived from it (e.g. "From Fabric A cut (2) 5¼" × WOF strips; from the strips subcut 8 squares 5¼"…").
3. **WOF strips first.** Large or many identical pieces are cut as strips across the width of fabric ("× WOF"), then subcut. The Moda Fp Atelier pattern reads "From EACH of 6 … Fat Quarters cut … 5–5¼" squares, cut in half twice on the diagonal to make 20 quarter square triangles" (A70) — quantity, parent square, diagonal cuts, and yield in one line.
4. **Triangles are described by their parent square + cuts**, not by raw triangle dimensions ("5¼" squares, cut in half twice on the diagonal").
5. **Yield stated per line** ("to make 32 half square triangles").
6. **A separate yardage/requirements table** near the top lists fabric quantities per fabric as ⅛-yard increments (or "1 fat quarter", "1/2 yard"), often with "based on 42" usable width" stated once.
7. **Finished size and seam allowance stated once** up front ("Finished size 60½" × 80½"; "use ¼" seams").

In my own words: a pattern tells you *what to cut and from which fabric, in an order that mirrors assembly* — WOF strips first, then sub-cuts, triangles via their parent square, each line carrying count, size and yield — and separately tells you *how much of each fabric to buy* in eighth-yard increments. No single pattern's layout is being reproduced; this is a synthesis of the convention across the sources listed.

## 6. Optimisation

**Is it a known packing problem?** Yes. The strip-then-subcut plan is a **one-dimensional cutting-stock problem** (1D-CSP): the bolt width is a fixed stock length and each WOF strip is cut into pieces of the required widths; guillotine constraints (each cut spans the full strip) hold because rotary cuts are straight and full-width. NIST classifies the cutting-stock problem as NP-complete (A71); the guillotine 2D strip-packing variant is also NP-hard (A72, A73). However, quilting's version is **trivial** in practice: pieces are usually all the same size per fabric, so greedy "pieces per strip = ⌊WOF ÷ width⌋" is optimal for a single piece size; the only real optimisation is choosing cut width vs cut height orientation and mixing piece sizes on one strip, which public calculators do by simple floor/ceil arithmetic, not a solver.

**What public calculators do.** Quiltler, QuiltCalc/CraftCalc, Quilter's Paradise and others implement exactly the strip-then-subcut arithmetic described in §4 (A9, A11, A12, A13, A34). None published a different algorithm; the only variations are the WOF default (40 vs 42), the binding allowance (+10 vs +12 vs +20"), and rounding (1/8 vs 1/4 yd).

**FOSS repositories** (`gh search repos`, run this session; access 2026-10-28). Queries: `quilt calculator`, `quilt yardage`, `half square triangle quilt`, `flying geese quilt`, `quilt design`. Every result is a 0-star stub or abandoned:

| Repo | License | Last push | What it computes |
|---|---|---|---|
| TetonTopo/quiltblock | MIT | 2026-10-26 | "seam allowance math, piecing constructions, cutting lists, sew order and pressing plans" — the closest match to this track's scope (A74) |
| ithinkitschad/QuiltingCalculator | none | 2025-04-02 | "yardage, binding, backing, and fabric requirements" (Kotlin) (A75) |
| scottshamel-ctrl/quilt-calculators | none | 2026-10-18 | "Free quilting calculators" (HTML, 0-star) (A76) |
| william-pyle/QuiltDesigner | GPL-3.0 | 2026-05-22 | "generate fabric requirements, print instructions" (stub) (A77) |
| andrew-paul-thompson/half-square-triangle-quilts | MIT | 2023-10-24 | generative HST quilt images (A78) |

No licence/source was copied; only the descriptions and metadata above are recorded. Consistent with the nomination research (docs/research.md §4): the FOSS niche is empty; nothing maintained implements the yardage/cutting math to reuse.

## 7. Worked examples for acceptance tests

Ten synthetic examples are computed by `python3 .context/spec-research/A-math-examples.py`, which prints every input, every cut size, and every yardage number. Summary and cross-checks:

1. **Plain squares / strip-set** (5×5 grid of 4" squares, 13 pieces of one fabric): cut 4½"; 11 per 40" strip; cross-check Stitchin' Heaven's 6-per-strip method (A34).
2. **HST 2-at-a-time** (12 units @ 3"): cut 3⅞", 6 pairs → 12; cross-check Treasurie/Quiltler 3"→3⅞" (A9, A10).
3. **HST 4- and 8-at-a-time** (8 units @ 3"): 8-at-a-time cut 7¾" (cross-check BERNINA (3+7/8)×2 = 7¾"); 4-at-a-time geometric cut 4.9497" vs published 4¼"/4¾" (the disagreement, computed).
4. **QST / hourglass** (Ohio Star @ 3"): cut 4¼"; cross-check Create Whimsy/Craftsy (A24, A26).
5. **Flying geese both methods** (@ 4×2"): 1-at-a-time rect 4½"×2½", squares 2½" (cross-check The Quilter A27); no-waste large 5¼", small 2⅞" (cross-check WeAllSew A28).
6. **Stitch-and-flip + square-in-a-square** (@ 6" block): snowball corner 3½"; SIS center 4¾", corner triangles 3⅞" (cross-check Quilting Jetgirl's 4" block: center 3⅜", corners 2⅞" A32; Scissortail quick-corner = finished/2 + 1/2 A31).
7. **Strip set** (rail fence): strip 2½", subcut 6½" (A33).
8. **Layout** (the task's example — 20 nine-patch blocks 9" finished, 2" sashing + cornerstones, 4" border): finished 61" × 50"; light 100 × 3½", dark 80 × 3½"; sashing 16 + 15 pieces; 12 cornerstones; computed per-fabric strip counts and yards.
9. **On-point** (@ 12" block): side setting square 18¼", corner 9⅜" (cross-check Quiltville/Timber Lane A37, A39).
10. **Backing + binding** (60×80 throw): binding 6 strips @ 2½" = ½ yd (cross-check CraftCalc A12); backing 68×88 = 2 widths × 58" = 3¼ yd (cross-check Boneyard ~4.9 yd at 44" WOF A59); 108" wide back = 1 width = 3¼ yd.

Each example cross-checks at least one number against a public calculator or tutorial, as required.

---

## Candidate requirements

1. **[proposal]** The tool computes plain square, rectangle and strip-set cut sizes as **finished size + 1/2"**. (A16)
2. **[proposal]** The tool computes 2-at-a-time HST cut size as **finished + 7/8"** and offers **finished + 1"** as an optional oversized/trim variant. (A9, A10)
3. **[proposal]** The tool computes 8-at-a-time HST cut size as **(finished + 7/8") × 2**, with an oversized (finished + 1") × 2 variant. (A19, A20, A22)
4. **[proposal]** For the 4-at-a-time HST, the tool uses the geometric exact **(finished + 1/2) × √2**, rounded up to 1/8", and does **not** reproduce the published +1¼" / ÷0.64 charts (which under-cut). (A9, A10, A11 — and the script's derivation check)
5. **[proposal]** QST/hourglass cut size = **finished + 1¼"** (with +1½" trim variant). (A24, A25, A26)
6. **[proposal]** Flying-geese cut sizes: 1-at-a-time rectangle (w+1/2)×(h+1/2) + two squares h+1/2; no-waste large square w+1¼" + four squares h+7/8". (A27, A28, A29)
7. **[proposal]** Stitch-and-flip corner square = **finished + 1/2"**; square-in-a-square center = finished + 1/2" and corner triangles from squares of (finished ÷ √2) + 7/8". (A27, A31, A32)
8. **[proposal]** On-point setting triangles: side = **(block + sashing) × 1.414 + 1¼"** cut twice diagonally; corner = **(block + sashing) ÷ 1.414 + 7/8"** cut once diagonally; both rounded up to 1/8". (A35–A41)
9. **[proposal]** All cut sizes round **up to the nearest 1/8 inch**. (A6)
10. **[proposal]** Yardage uses **usable WOF = 40" default** (configurable 42"), pieces-per-strip = ⌊WOF ÷ cut width⌋, strips = ⌈qty ÷ per-strip⌉, length = strips × cut height, **rounded up to the nearest 1/8 yard**. (A34, A49)
11. **[proposal]** Binding = ⌈(perimeter + allowance) ÷ WOF⌉ × strip width, with allowance and strip width (2½" default) configurable. (A12, A13, A68)
12. **[proposal]** Backing = top + 2×overhang on each side; widths = ⌈backing width ÷ WOF⌉; overhang default 4" (longarm) / 2–3" (domestic); supports 108" wide backing. (A59, A60, A61)
13. **[proposal]** The tool supports a **10% waste** and a **pre-wash shrinkage (3–5%)** allowance as configurable options. (A49, A56, A57)

## Open decisions for the maintainer

- **4-at-a-time HST formula.** Options: (a) geometric exact (finished + 1/2)·√2 (recommended — provably correct); (b) reproduce the common +1¼" chart for familiarity (under-cuts, needs a warning); (c) omit 4-at-a-time entirely. Evidence A9, A10, A11 + script derivation.
- **WOF default.** 40" (safest, Stitchin' Heaven/StitchLogic) vs 42" (Quiltler, many calculators). Evidence A9, A34, A49.
- **Binding allowance.** +10" vs +12" vs +20". Evidence A12, A13, A67, A68.
- **Yardage rounding.** 1/8 yd (most shop-standard) vs 1/4 yd. Evidence A12, A13, A14, A15.
- **Metric.** Whether to offer a metric mode (6 mm seam, 110 cm WOF, metres) at all, or keep imperial-only like most patterns. Evidence A1–A8, A3.
- **Quilt/bed size table.** Which single authority to ship as presets (they disagree by up to 30"). Evidence A42–A47.
- **On-point with sashing.** Which "block + sashing" adjustment to adopt (Quilting Nook's cornerstone-inclusive form vs plain block+sashing). Evidence A41.
- **Optimisation.** Whether to do true 1D-CSP mixing of mixed-width pieces or greedy per-size strips (greedy is the industry default). Evidence A71–A73.

## Facts / Inferences / Unknowns

**Facts (sourced):** 1/4" seam; squares +1/2"; HST 2-at-a-time +7/8"; HST 8-at-a-time (F+7/8)×2; QST +1¼"; flying-geese w+1¼"/h+7/8" no-waste and +1/2" stitch-and-flip; on-point side B×1.414+1¼" and corner B÷1.414+7/8"; WOF 40–42"; yardage rounded to 1/8 yd; cotton shrinks 3–5%; longarm backing overhang 4", domestic 2–3"; binding allowance +10/+12/+20"; fat quarter 18×22"; metric fabric 110–112 cm sold per metre.

**Inferences:** The 4-at-a-time published formulas under-cut the unit (derived, not stated by any source); the 2-at-a-time +7/8 is a rounded-up form of F + 1/2 + 1/(2√2); the strip-then-subcut plan is a 1D-CSP that is trivial for uniform pieces.

**Unknowns:** Whether any metric-country quilter actually uses 0.75 cm / 7 mm as a seam allowance (no source found); a canonical single bed-size table; which WOF the incumbent tools actually assume internally; whether bias binding yardage needs a documented multiplier (not sourced this session).

## Evidence register

Access date for all rows: 2026-10-28. "not checked" = licence/terms not assessed.

| ID | URL | Licence / terms | Establishes | Sections |
|---|---|---|---|---|
| A1 | sewingwithease.com/sewing/seam-allowance-guide/ | not checked | 1/4" (0.6 cm) quilting SA | 1 |
| A2 | sewcalcs.uk/reference/seam-allowance-chart | not checked | ¼" = 6 mm "standard… UK and US" | 1 |
| A3 | tildasworld.com (Putting-Down-Roots / Paperbird PDFs) | not checked | "use only one system (preferably inches)"; usable 42in/107cm; fat eighth 10.5×18in | 1, 5 |
| A4 | unitplanet.com/crafts/fabric-yardage | not checked | UK/EU 110 cm; Japan 110 cm; Australia 112 cm | 1 |
| A5 | craftyfox.com.au (how-much-fabric) | not checked | 112 cm (44") quilting cotton | 1 |
| A6 | generations-quilt-patterns.com/setting-triangles.html | not checked | corner/side formulas; "round up to nearest 1/8 (rotary ruler)" | 1, 3 |
| A7 | sewhot.co.uk (Makower UK) | not checked | 110 cm, sold per metre, 5 cm cuts, 0.25 m min = 50×55 cm FQ | 1, 4 |
| A8 | busybeequiltshop.co.nz | not checked | 112 cm (44"), wide back 275 cm (108"), min 25 cm, 5 cm increments | 1, 4 |
| A9 | quiltler.com/half-square-triangle | not checked | HST 2-at-a-time +7/8; +1 oversized; 4-at-a-time "about +1¼", sew-perimeter-cut-X; 8-at-a-time (F×2)+1¾ | 2 |
| A10 | blog.treasurie.com/half-square-triangles | not checked | +7/8 (2.2cm); 4-patch F÷0.64; 8-patch (F+7/8)×2 | 2 |
| A11 | fabricmathtools.com/hst-size-chart | not checked | 2-at-a-time +7/8; 4-at-a-time +1¼; 8-at-a-time 2F+1½ | 2 |
| A12 | craftcalc.io/quilt-binding | not checked | binding perimeter+10, /40, strips×2½, round 1/8 yd; 60×72 example | 4, 7 |
| A13 | quiltler.com/quilt-binding-calculator | not checked | perimeter+10; round up 1/8 yd | 4 |
| A14 | calculatorcollection.org/en/calculators/sewing/fabric-yardage | not checked | round up to next 1/8 yd (4.5 in) smallest shop cut | 1, 4 |
| A15 | thecalculatorshub.com (fabric-calculator) | not checked | rounds to nearest quarter yard; directional option | 1, 4 |
| A16 | hcquilts.com (quilt-block-size-chart) | not checked | square/rectangle +1/2; cut sizes | 2, 3 |
| A17 | raevenfea.com/learning/how-to-cut-half-square-triangles | not checked | HST "cut 7/8 larger than finished" | 2 |
| A18 | quilterbydesign.com/lessons/square.triangles.html | not checked | HST +7/8; QST +1¼ | 2 |
| A19 | threadsmagazine.com (BERNINA Big Book, Half-Squares-and-Flying-Geese.pdf) | not checked | magic 8 = (finished+7/8)×2 | 2 |
| A20 | craftsy.com/post/how-to-make-half-square-triangles/ | not checked | magic 8: add 7/8 then ×2 | 2 |
| A21 | sjlinus.org (Magic 8 PDF) | not checked | magic 8 = (finished+7/8)×2 | 2 |
| A22 | pennyspoolquilts.com (8-at-a-time) | not checked | 8-at-a-time (finished+1)×2 | 2 |
| A23 | quiltplan.com (magic 8 PDF) | not checked | "Add 1 to finished, then double" | 2 |
| A24 | createwhimsy.com (quarter-square-triangle) | not checked | QST +1¼ | 2 |
| A25 | sugarstitchesquiltco.com (hourglass) | not checked | QST +1¼ (+1½ trim) | 2 |
| A26 | thecraftyquilter.com (quarter-square-triangle) | not checked | QST +1¼, oversize +1½ | 2 |
| A27 | quiltersguild.org.uk (B2B Q149 Flying Geese) | not checked | 1-at-a-time rect 2½×4½, 2 squares 2½ | 2, 4 |
| A28 | weallsew.com/no-waste-flying-geese | not checked | no-waste: width+1¼ large, height+7/8 small | 2, 7 |
| A29 | filesusr.com (Fast Flying Geese PDF) | not checked | no-waste width+1¼ / height+7/8 | 2 |
| A30 | modafabrics.com (Block Heads 3 PDFs) | not checked | stitch-and-flip corner; finished/cut sizes | 2, 5 |
| A31 | scissortailquilting.com (square-in-a-square) | not checked | quick-corner base +1/2, corner finished/2+1/2 | 2 |
| A32 | quiltingjetgirl.com (square-in-a-square) | not checked | 4" block: center 3⅜, corners 2⅞ | 2, 7 |
| A33 | (strip-set convention) | — | strip +1/2, subcut +1/2 (from A16, A30) | 2, 7 |
| A34 | stitchinheaven.com (how-much-fabric-for-a-quilt) | not checked | WOF 40–42 (plan 40); strip math; binding table | 4, 7 |
| A35 | snugglesquilts.com (on-point) | not checked | side B×1.414+1¼; corner B÷1.414+7/8 | 3 |
| A36 | reproquiltlover.com (on-point-quilt-setting) | not checked | side (B×1.414)+1.25; corner B+1 (variant) | 3 |
| A37 | quiltville.com/onpointmath.shtml | not checked | corner B÷1.414+7/8; side B×1.414 | 3, 7 |
| A38 | shadywoodquilts.com (side/corner cutting chart) | not checked | side B×1.41+1.25 cut twice (straight grain long side); corner cut once | 3 |
| A39 | lvqg.org (Timber Lane setting-triangle table) | not checked | 12" block → side 18¼, corner 9⅜ | 3, 7 |
| A40 | nationalquilterscircle.com (setting triangles) | not checked | corner B÷1.414+7/8; bias inside / grain outside | 3 |
| A41 | thequiltingnook.wordpress.com (on-point with sashing PDF) | not checked | sashing/cornerstone shift block term | 3 |
| A42 | stitchinheaven.com (quilt-sizes-chart) | not checked | bed/quilt size table (one variant) | 3 |
| A43 | missouriquiltco.mom (quilt-sizes-chart) | not checked | bed/quilt size table (one variant) | 3 |
| A44 | pieceandplenty.com (standard-size-chart) | not checked | bed/quilt size table (one variant) | 3 |
| A45 | img1.wsimg.com (Philanthropy quilt dimensions) | not checked | bed/quilt size table (one variant) | 3 |
| A46 | quiltler.com/quilt-sizes-guide | not checked | bed/quilt size table (one variant) | 3 |
| A47 | quiltingdaily.com (standard-bed-sizes) | not checked | mattress sizes | 3 |
| A48 | stitchlogic.app/blog (how-to-calculate-quilt-yardage) | not checked | WOF 40; pieces/strips/strips; +10% | 4 |
| A49 | (see A34/A48) | — | WOF 40 post-wash | 4 |
| A50 | thesprucecrafts.com (fat-quarter) | not checked | FQ 18×22 | 4 |
| A51 | blog.treasurie.com/what-is-a-fat-quarter | not checked | FQ 22×18 (18×21), FE 9×22/11×18 | 4 |
| A52 | bloomeriefabrics.com (pre-cut sizes) | not checked | FQ ~18×22 (varies 18×20–22) | 4 |
| A53 | stitchinheaven.com (what-is-a-fat-quarter) | not checked | FQ 18×22 (18×21/20 narrower bolts) | 4 |
| A54 | inspirepoint.com (size-of-a-fat-eighth) | not checked | FE 9×22 or 11×18 | 4 |
| A55 | hcquilts.com (how-to-calculate-fabric-yardage) | not checked | directional prints limit layout | 4 |
| A56 | madamsew.com (prewashing-debate) | not checked | Moda: cotton shrinks 3–5% | 4 |
| A57 | thefabriccalculator.com/blog/fabric-shrinkage-guide | not checked | cotton 2–5%; buy 10% extra | 4 |
| A58 | sewingtrip.com (quilting-fabrics) | not checked | 108" backing shrinks to ~104" | 4 |
| A59 | boneyardtools.com (quilt-backing-calculator) | not checked | 4" longarm / 2–3" domestic; 60×80→68×88, 2 widths ~4.9 yd | 4, 7 |
| A60 | myquiltmath.com/calculators/backing | not checked | 4" longarm, 2" domestic | 4 |
| A61 | harvestmoonquiltingco.com (longarm-quilting) | not checked | backing 4" larger all sides | 4 |
| A62 | missouriquiltco.com (machine-quilting-services) | not checked | 4" wider every side | 4 |
| A63 | thefabricmath.com/quilt-backing-calculator | not checked | backing widths, seam orientation | 4 |
| A64 | quilting.yardage-calc.com | not checked | compares vertical/horizontal piecing | 4 |
| A65 | stitchinheaven.com (quilt-sizes) | not checked | batting 3–4" beyond top | 4 |
| A66 | bindingcalculatorquilt.com/backing-batting | not checked | batting overhang | 4 |
| A67 | stichtale.com/calculators/quilt-binding | not checked | binding +10–12" | 4 |
| A68 | missouriquiltco.mom (how-to-figure-yardage-for-quilt-binding) | not checked | perimeter +20, /40; 2½" strips | 4 |
| A69 | mrsquilty.com (quilt-binding-yardage) | not checked | strips ×2.5 /36 + 0.25 margin; 2¼/2½ widths | 4 |
| A70 | modafabrics.com (Fp Atelier / Block Heads PDFs) | not checked | rotary cutting-chart structure; "cut twice on diagonal to make QST" | 5 |
| A71 | xlinux.nist.gov/dads/HTML/cuttingStock.html | n/a | cutting stock NP-complete | 6 |
| A72 | sciencedirect.com (guillotine strip packing) | not checked | guillotine packing NP-hard | 6 |
| A73 | miis.maths.ox.ac.uk (Optimal Cutting Problem) | not checked | 1D cutting stock formulation | 6 |
| A74 | github.com/TetonTopo/quiltblock | MIT | seam-allowance math, cutting lists (last push 2026-10-26) | 6 |
| A75 | github.com/ithinkitschad/QuiltingCalculator | none | yardage/binding/backing (last push 2025-04-02) | 6 |
| A76 | github.com/scottshamel-ctrl/quilt-calculators | none | free calculators (last push 2026-10-18) | 6 |
| A77 | github.com/william-pyle/QuiltDesigner | GPL-3.0 | fabric requirements stub (2026-05-22) | 6 |
| A78 | github.com/andrew-paul-thompson/half-square-triangle-quilts | MIT | generative HST (2023-10-24) | 6 |
