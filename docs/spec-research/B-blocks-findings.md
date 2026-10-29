> Agent research report for librequilt, written 2026-10-28 by a locally initiated agent (DeepSeek V4 Pro; an earlier Kimi K3 run was cut off by a usage limit and left nothing) following the brief in this folder's README. Mechanical check: 26 of 26 links resolve; 11 of 11 claim quotes found verbatim. The orchestrator reviewed it; note that a block name found in Webster's 1915 name list attests the name only, not the geometry, and names varied by region; confirm each block's geometry against a public-domain illustration before shipping it. Works from 1931 to 1963 are in the public domain if their copyright was not renewed; the renewal checks are still open. Everything marked **[proposal]** is a proposal, not an approved requirement. Corrections and the consolidated summary are in [research.md](../research.md#specification-research-2026-10-28).

# Track B — Traditional block library, public-domain sources, naming and copyright

*Access date for all evidence: 2026-10-28. Track prefix `B`. Sources not actually opened this session are labelled; nothing here is legal advice.*

## Summary

- The US public-domain cutoff today is **works published 1930 and earlier** (Duke CSPD, "Public Domain Day 2026"; the Online Books Page confirms "copyrights from before 1931 … have now all expired, as of 2026, whether they were renewed or not"). This alone puts the **Ladies Art Company catalogues (c.1897–1928)**, **Marie Webster (1915)**, and **Ruth Finley (1929)** safely in the public domain.
- The two richest public-domain block *catalogues* I could actually open are **Webster (1915)** (Project Gutenberg #24682, full text incl. an alphabetical "List of Quilt Names") and the **Ladies Art Company catalogues** (reproduced item-by-item, with names and pattern numbers, in the Quilt Index's LAC special collection). Between them I can name and source 50–60 traditional blocks.
- The geometry needed for a straight-seam, no-set-in (Y-seam) first library is small: **squares, rectangles, right-isosceles triangles (HSTs), quarter-square triangles (QSTs), and flying-geese units**. Diamond-based 8-point stars, hexagons, and curved blocks (Drunkard's Path, Fan) each need a *separate* seam engine (set-in seams or curves) and should be deferred.
- US Copyright Office guidance is directly on point: the Compendium says common geometric shapes and familiar symbols are not protected (§906.1, §906.2), and that a pattern-book registration "does not extend to individual pattern pieces" (§920.1). *Feist* makes facts and the ideas of a compilation unprotected; only an *original selection/arrangement* is. This supports defining traditional blocks as geometry in our own words.
- The real legal risk is **naming, not geometry**: "DEAR JANE" is a live USPTO trademark (Reg. #2423565) covering quilt-making instruction, and the Dear Jane block *drawings* are sold as copyrighted content. A few other names are tied to living designers/books and need case-by-case checks.
- Openly licensed *block data* is thin: Wikimedia Commons has mostly photographs of quilts, and GitHub quilt-block repos are mostly MIT-licensed stubs or unlicensed. The geometry is best authored fresh from the public-domain catalogues.
- **Renewal checks for 1930–1963 works (Ruby McKim 1931; Hall & Kretsinger 1935; Nancy Cabot 1933) could not be completed programmatically this session** — the Stanford Copyright Renewal Database is behind a bot-check. These are listed as open items, not resolved.

## 1. Block families and geometry primitives

The traditional block families quilters use, with the shape primitives each needs and whether it needs set-in ("Y") seams. Descriptions are my own; block names are facts corroborated in the sources in §5.

| Family | Grid / form | Shape primitives | Set-in (Y) seams? |
| --- | --- | --- | --- |
| Four-patch | 2×2 | squares; HSTs; QSTs | No |
| Nine-patch | 3×3 | squares, rectangles, HSTs, QSTs, flying-geese | No |
| Five-patch | 5×5 | squares, rectangles, HSTs, four-patches | No |
| Seven-patch | 7×7 | squares, HSTs, QSTs (finer stars) | No |
| Eight-pointed star (45° diamond) | radial, 8 diamonds | squares, 45° diamonds, (triangles) | **Yes** (Y-seams at each diamond join) |
| Curved-seam (Drunkard's Path, Fan, Orange Peel) | 2×2 / 4×4 curve | concave + convex quarter-circle pieces | No Y-seams, but needs **curved** seams |
| Log cabin / strip | spiral or stepped | rectangles ("logs"), one centre square | No |
| Hexagon one-patch (Honeycomb) | hexagonal tiling | hexagons | **Yes** (Y-seams; usually English paper pieced) |
| Tumbling blocks (rhombi) | rhombic tiling | 60°/120° rhombi | **Yes** |

**Recommendation for a first version.** Five primitives cover the great majority of traditional blocks that sew with straight seams and no set-in seams: (1) **square**, (2) **rectangle**, (3) **half-square triangle** (right-isosceles, cut as a square + ⅞″), (4) **quarter-square triangle**, and (5) **flying-geese** (a rectangle flanked by two triangles; itself built from squares and HSTs). With these five you can build Four Patch, Nine Patch and their derivatives, Churn Dash, Shoo Fly, all the 3×3 and 5×5 star and chain blocks (Ohio/Texas star, Jacob's Ladder, Irish Chain, Bear's Paw), and the log-cabin family. I would **defer** (a) 45°-diamond eight-pointed stars, (b) hexagons/tumbling blocks, and (c) curved blocks, each of which needs its own sewing-order engine, until a later version or a paper-piecing path (see Track D for FPP).

## 2. Public-domain sources

**The cutoff (verified).** As of 2026-10-28, published works from **1930 and earlier** are in the US public domain [B1][B2]. For 1930–1963 works the 95-year term is conditional on a 28th-year renewal [B12]; the Online Books Page states the pre-1931 rule plainly [B12]. I checked the year arithmetic with a short python3 script: 1930 + 95 = 2025, so 1930 works entered PD on 2026-01-01; 1931 → 2027-01-01; 1935 → 2031-01-01; 1933 → 2029-01-01.

| Source | Year | Public scan (URL, not downloaded) | US copyright status evidence |
| --- | --- | --- | --- |
| Ladies Art Company catalogues (2nd ed. to "Quilt Patterns Patchwork and Applique") | c.1897–1928 | Quilt Index reproduces pages and lists names+numbers: https://quiltindex.org/collections/special-collections/12-91-513/ | Pre-1930 → public domain. The Quilt Index page lists the editions: "Second edition - c1897 - Pattern numbers to 400", several c1898 editions, and "Quilt Patterns Patchwork and Applique Copyright 1922 … Copyright 1928" [B15]. |
| Marie Webster, *Quilts: Their Story and How to Make Them* | 1915 | Project Gutenberg #24682: https://www.gutenberg.org/ebooks/24682 (text: …/24682-8.txt); scan https://archive.org/details/quiltstheirstory00webs | Gutenberg states "Public domain in the USA"; © 1915 Doubleday, Page & Co. Pre-1930 → PD [B6][B7]. |
| Ruth Finley, *Old Patchwork Quilts and the Women Who Made Them* | 1929 | HathiTrust record (Indiana U., search-only): https://catalog.hathitrust.org/Record/006807467 | 1929 + 95 = 2024 → entered PD 2025-01-01. No full-view scan was openable this session; the 1929 original is PD regardless [B8]. |
| Ruby Short McKim, *One Hundred and One Patchwork Patterns* | 1931 | 1962 Dover reprint on IA: https://archive.org/details/onehundredonepat0000mcki (the 1931 original was not located on IA) | 1931 + 95 → PD 2027-01-01 **if renewed**; if never renewed, PD since ~1959. **Renewal not verified this session** (Stanford DB behind bot-check) [B10][B11][B12]. The 1962 Dover reprint is a separate copyright. |
| Carrie A. Hall & Rose G. Kretsinger, *The Romance of the Patchwork Quilt in America* | 1935 | IA scan: https://archive.org/details/romanceofpatchwo0000hall_v0c2 (and several other copies) | 1935 + 95 → PD 2031-01-01 **if renewed**. Renewal not verified this session [B9][B11][B12]. |
| Kansas City Star weekly patterns | 1928–1961 | Library of Congress newspaper record: https://www.loc.gov/item/2019201731/ | The **1928–1930** patterns are pre-1931 → PD. Later patterns are 1930s–1961 and would need renewal/term analysis; modern compilations (e.g. Brackman's *Kansas City Star Quilts* sampler) are newly copyrighted [B16-adjacent: from search results, not opened]. |
| Nancy Cabot, *Chicago Tribune* (pen name of Loretta Leitner Rising) | from 1933 | Chicago Tribune archive (paywalled) via newspapers.com; no free full scan located | 1933 + 95 → PD 2029-01-01 **if renewed**. Newspaper patterns were rarely renewed, but this is **unverified** [B11][B12]. |

**On the two 1930–1963 works the charter names (McKim 1931, Hall & Kretsinger 1935):** their *drawings* should not be copied until the renewal status is checked (Stanford Copyright Renewal Database, https://exhibits.stanford.edu/copyrightrenewals, which returned a bot-check this session). Their **block names and the geometric facts** are not the protected part — see §3.

## 3. What the questions are, not answers

**Q3a — Is a traditional geometric block design protectable?** The US Copyright Office's Compendium (3rd ed.), Chapter 900, is the closest primary material: "The Copyright Act does not protect common geometric shapes, either in two- dimensional or three-dimensional form" and the Office "will not register a work that merely consists of common geometric shapes" (§906.1); "Familiar symbols and designs are not protected by the Copyright Act" (§906.2). On patterns specifically, §920.1 says "A registration for a pattern book generally does not extend to individual pattern pieces that may be used to create a useful article … because they have an intrinsic utilitarian function," and §920.2 says the Office "will refuse to register stencils consisting of common figures, symbols, or other uncopyrightable material, including any standard arrangements thereof" [B3]. I found **no** Copyright Office or court decision squarely on *quilt* patterns; the nearest published commentary is C&T Publishing's "Common Quilting Blocks" explainer [search result, not opened]. *Open question: does the §906/§920 reasoning mean an individual traditional block's line drawing is uncopyrightable, and where is the line between a geometric "fact" and a protectable drawing?*

**Q3b — Compilation copyright (Feist) applied to enumerating the same traditional blocks.** *Feist Publications v. Rural Telephone* (1991) holds that facts are not copyrightable, that "the sine qua non of copyright is originality," and that a factual compilation is protectable only in its **selection/arrangement**, never the underlying facts [B4]. Applied here: the *set* of traditional blocks and each block's geometry are facts/ideas; a book like Brackman's *Encyclopedia* is protected only in its particular selection, arrangement, numbering system, and drawings — not in the blocks themselves. *Open question: does independently re-enumerating 50 blocks from the pre-1930 catalogues (not from Brackman) leave the numbering/lookup system behind, and is the maintainer comfortable with the residual risk?* EQ itself ships "6,000+ copyright-free blocks" while selling Brackman's work separately as BlockBase+ (4,264 blocks), which is the industry's own working assumption that block *geometry* is free but Brackman's *compilation* is not [B14].

**Q3c — Trademarks on block/pattern names.** USPTO records confirm **"DEAR JANE" is a live registered trademark**, Reg. #2423565, owned by the Brenda M. Papadakis Living Trust, filed 2000-03-24, registered 2001-01-23, covering Class 041 "educational services, namely - providing instruction regarding quilt design quilt fabrics quilting supplies and tools, and quilt making" (plus Classes 014 and 018) [B13]. The Dear Jane *drawings* are separately sold as copyrighted content [B17/search result]. "Baby Jane" is also claimed registered [search result, not opened]. *Open question: which of the other traditional names (e.g. designer-tied names like "Judy Martin", "Karen Stone", or book-tied names) carry trademark or copyright baggage?* Most pre-1930 catalogue names (Log Cabin, Churn Dash, Shoo Fly, etc.) are generic and appear across many independent sources; the pattern I recommend is: prefer names attested in the pre-1930 catalogues, and screen any modern designer-tied name individually before shipping.

## 4. Existing openly licensed block data

**Wikimedia Commons / Wikipedia.** Commons has no "quilt blocks" diagram category; searching "quilt block"/"quilt pattern" returns mostly **photographs of quilts** (Category:Quilts by pattern type → Log cabin quilts, Double Irish Chain, Hexagon quilts, Star of Bethlehem, Tumbling block quilts, Album quilts) and a few mathematical tiling SVGs (Category:Rhombille tiling). These are usable as *illustrations*, not as reusable block definitions [B19].

**GitHub** (`gh search repos`, several queries, then `gh api repos/…` for licence + last push; all read-only):

| Repo | Licence | Stars | Last push | Notes |
| --- | --- | --- | --- | --- |
| TetonTopo/quiltblock | MIT | 0 | 2026-10-26 | "patterns generated from geometry: seam allowance…" |
| Andreas-Schoenefeldt/quilt-block-patterns | MIT | 0 | 2019-03-03 | pattern generator |
| isaacc2/Piecewise | MIT | 0 | 2026-10-17 | single-file web block designer |
| fiddlehead/quilt_blocks | MIT | 0 | 2014-07-07 | color a block |
| borodiychuk/patchwork | MIT | 1 | 2022-07-14 | patterns generator |
| neonfuzz/svg_quilter | MIT | 8 | 2025-07-29 | SVG→FPP (from charter research.md) |
| MCDAngelo/quilting-blocks | **none** | 0 | 2024-04-18 | no licence |
| veryrobert/tessera | **none** | 0 | 2026-10-18 | no licence |
| jochasinga/jiji | **none** | 3 | 2021-11-11 | nine-block generator |

AGPL-compatibility: **MIT, BSD, Apache-2.0, CC0, and public domain are AGPL-compatible** and reusable; the MIT repos above (TetonTopo/quiltblock, Andreas-Schoenefeldt, isaacc2/Piecewise, fiddlehead, borodiychuk, neonfuzz/svg_quilter) could be studied or code-reused under AGPL. **Unlicensed repos (MCDAngelo, veryrobert/tessera, jochasinga/jiji) should not be reused.** CC-BY and CC-BY-SA images are **not** code-reusable under AGPL (CC-BY-SA 4.0 is compatible only one-way with GPLv3, and CC-BY is non-copyleft-incompatible). *Conclusion: there is no ready-made, openly-licensed block-definition dataset to lift; author the geometry fresh from the pre-1930 catalogues.*

## 5. Candidate list

Favouring straight seams and no set-in seams. "Primitives": S=square, R=rectangle, HST=half-square triangle, QST=quarter-square triangle, FG=flying geese, D=45° diamond, C=curve, Hex=hexagon. "Source" = the earliest public-domain source I actually opened this session and saw the name in. W = Webster 1915 (Gutenberg #24682); LAC = Ladies Art Company catalogue (c.1897–1928, via Quilt Index, with pattern number). A `★` marks blocks needing curves or set-in seams (defer).

| Common name | Alt names (as seen) | Grid family / size | Primitives | One-line geometric description (own words) | Earliest PD source I opened | Naming risk |
| --- | --- | --- | --- | --- | --- | --- |
| Four Patch | "New Four Patch" | four-patch 2×2 | S | 2×2 grid of four equal squares | W (List of Quilt Names) | none |
| Pinwheel | "Pinwheel Square" | four-patch 2×2 | HST | four HSTs rotated so the seams spin | W; LAC 231 | none |
| Hourglass | "Hour Glass" | four-patch 2×2 | QST | four quarter-square triangles meeting at centre | W; LAC 196 | none |
| Broken Dishes | "Broken Dish" | four-patch 2×2 | HST | four HSTs pointing inward | W | none |
| Snowball | — | four-patch (octagon outline) | S, corner HST | a square with a triangle in each corner | W | none |
| Nine Patch | — | nine-patch 3×3 | S | 3×3 grid of nine equal squares | W | none |
| Double Nine Patch | — | nine-patch 3×3 | S | corner 4-patches + bars around a centre | W (illustration p.17) | none |
| Shoo Fly | — | nine-patch 3×3 | S, HST | centre square, 4 corner squares, 4 HST edge units | W; LAC 276 | none |
| Churn Dash | — | nine-patch 3×3 | S, R, HST | centre square, 4 corner squares, 4 HST+bar edge units | W | none |
| Sawtooth Star | "Evening Star" | nine-patch 3×3 | S, FG | centre square + 4 corner squares + 4 flying-geese edges | W ("Evening Star", "Sawtooth Patchwork"); LAC 271 | none |
| Puss-in-the-Corner | "Puss In The Corner" | nine-patch 3×3 | S, HST | 9-patch with corner HSTs framing a plain centre | W; LAC 137 | none |
| Jacob's Ladder | — | five-patch 5×5 | S, HST | four-patches and HSTs forming a diagonal chain | W (illustration p.28) | none |
| Double Irish Chain | — | five-patch 5×5 | S | two interlocking chains of squares | W | none |
| King's Crown | — | five-patch 5×5 | S, HST | corner squares + HST points around a centre square | W; LAC 181 | none |
| Maple Leaf | — | nine-patch 3×3 | S, HST, R | a stem + leaf built from HSTs and a bar | W | none |
| Bear's Paw | "Bear's Paws" | five-patch 5×5 | S, HST | four corner "paw" units (square + three HST toes) around a centre | W; LAC 162 | none |
| Grandmother's Choice | — | five-patch 5×5 | S, HST | alternating HSTs and squares | LAC 129 | none |
| Sister's Choice | — | nine-patch 3×3 | S, HST | 9-patch with HST corners | W; LAC 257 | none |
| Goose Tracks | — | nine-patch 3×3 | S, HST, FG | four geese meeting at centre | W; LAC 156 | none |
| Goose in the Pond | — | nine-patch 3×3 | S, HST | geese surrounded by a contrasting frame | W | none |
| Blazing Star | — | 8-point radial | D or HST | 8 points radiating from a centre | W | none (defer if D) |
| Star of the East | — | 8-point radial | D, S | large 8-point star with square corners | W (illustration p.42) | none (defer if D) |
| Diamond Star | — | 8-point radial | D, S | 8 diamonds around a centre | LAC 244 | none (defer if D) |
| Four Points | — | nine-patch 3×3 | HST | four HSTs creating a diamond cross | LAC 106 | none |
| Pin Cushion | "Pincushion" | 8-point radial | HST | 8 triangles forming a star ("pincushion") | W; LAC 133 | none |
| Log Cabin | "American Log Cabin" | strip / log | R, S | a centre square wrapped by bars added round-and-round | W; LAC 307 | none |
| Square Log Cabin | — | strip / log | R, S | logs added to make a square block | W | none |
| Pine Tree | — | strip / diagonal | HST, S | stacked triangles over a trunk | W | none |
| Brick Pile / Brickwork | "Brickwork Quilt" | strip / offset | R | offset rows of rectangles like bricks | W; LAC 293 | none |
| Roman Stripe | — | strip | R | offset diagonal stripes of fabric | W | none |
| Cross and Crown | — | five-patch 5×5 | S, HST | HST "crown" over a cross | W; LAC 151 | none |
| Greek Cross | — | five-patch 5×5 | S, HST | a cross with HST corners | W; LAC 173 | none |
| Cross Within Cross | — | five-patch 5×5 | S, R | a smaller cross inside a larger cross | W; LAC 313 | none |
| Double X | — | five-patch 5×5 | S, HST | two interlocked X diagonals | W | none |
| Four X Star | — | five-patch 5×5 | S, HST | four X-shaped arms around a centre | LAC 163 | none |
| Domino | — | four-patch 2×2 | S, HST | two-colour split like a domino | W; LAC 172 | none |
| Domino and Square | — | nine-patch 3×3 | S | domino bars alternating with squares | W; LAC 278 | none |
| Tick-Tack-Toe | — | nine-patch 3×3 | S, HST | a 3×3 grid like a noughts-and-crosses board | W; LAC 227 | none |
| Ocean Waves | — | nine-patch / diagonal | S, HST | many small HSTs forming a wave field | W; LAC 182 | none |
| Old Maid's Puzzle | — | nine-patch 3×3 | S, HST | large HSTs and a centre square | W | none |
| Dutchman's Puzzle | — | nine-patch 3×3 | FG | four flying-geese units meeting at centre | W | none |
| Yankee Puzzle | — | four-patch 2×2 | HST | four HSTs arranged in a pinwheel | W | none |
| Twin Sisters | — | four-patch 2×2 | HST | two mirrored HST pairs | W | none |
| Rising Sun | — | 8-point radial | HST | 8 triangles radiating like a sun | W; LAC 177 | none |
| Storm at Sea | — | nine-patch / diagonal | S, R, D | elongated diamonds, squares and rectangles in a wave | W; LAC 135 | none (defer if D) |
| Spools | — | nine-patch 3×3 | S, HST | a "thread spool" outline | W | none |
| Windmill | "Wind Mill" | four-patch 2×2 | HST, S | four HST "sails" around a centre | W; LAC 127 | none |
| Rolling Pinwheel | — | nine-patch 3×3 | HST | pinwheel with a centre square | W; LAC 253 | none |
| ★ Drunkard's Path | "Drunkard's Patchwork" | curved 2×2 | C | quarter-circles (concave/convex) in a wandering path | W (illustration p.39); LAC 243 | none |
| ★ Robbing Peter to Pay Paul | — | curved | C | interlocking concave/convex circles | W; LAC 154 | none |
| ★ Orange Peel | — | curved | C | four petal-like convex curves around a centre | W; LAC 107 | none |
| ★ Fan / Fanny's Fan | — | curved | C | quarter-circle fan wedges | W; LAC 143 / 131 | none |
| ★ Pickle Dish | — | curved | C | pointed oval "dish" units | W | none |
| ★ Eight-pointed Star | "Eight Pointed Star" | 8-point radial | D | eight 45° diamonds around a centre | W; LAC 261 | none |
| ★ Star of Bethlehem | — | 8-point radial | D | many diamonds forming a large star | W | none |
| ★ Spider's Web | — | 8-point radial | D, Hex | concentric rings of diamonds/hexagons | W; LAC 191 | none |
| ★ Honeycomb | "Honeycomb Patch" | hexagon tiling | Hex | one-patch hexagon field | W; LAC 197 | none |
| ★ Tumbling Blocks | "Cube Work", "Cube Lattice" | rhombic tiling | rhombi | rhombi shaded as 3-D cubes | W; LAC 228 | none |

**Traditional names I did not open a public-domain source for this session** (so they are omitted from the shippable list until sourced): Ohio Star (a.k.a. Texas/Eastern Star), Card Trick, Friendship Star, Monkey Wrench, Bow Tie, Rail Fence, Courthouse Steps, Flying Geese, Trip Around the World, Grandmother's Flower Garden, LeMoyne Star, Irish Chain (single). Each is unquestionably traditional, but per the rules I list them as unsourced rather than attribute a source I did not see.

## Candidate requirements

- **[proposal]** The first block library is authored as geometry (grid, piece polygons, seam topology) in the project's own words, from the pre-1930 catalogues (Webster 1915; LAC c.1897–1928), never from Brackman's *Encyclopedia* or any post-1930 compilation [B3][B4][B6][B15].
- **[proposal]** The first library ships only blocks that need straight seams and no set-in seams, using at most squares, rectangles, HSTs, QSTs, and flying-geese [B15].
- **[proposal]** Diamond stars, hexagons, and curved blocks are excluded from v1 (or routed through paper piecing) until a set-in/curved seam engine is specified [B15].
- **[proposal]** Every shipped block name is attested in at least one pre-1930 source recorded in the block's metadata; no name is shipped from memory alone [B6][B15].
- **[proposal]** Any name flagged as trademarked or designer-tied ("Dear Jane", "Baby Jane", and any designer surname) is screened against USPTO records before use, and excluded by default [B13].
- **[proposal]** Before referencing McKim 1931 or Hall & Kretsinger 1935 (even for names), a renewal check is run against the Stanford Copyright Renewal Database / CCE records and recorded [B11][B12].

## Open decisions for the maintainer

1. **How many blocks and which families for v1.** Option A (recommended): ~40 straight-seam, no-set-in blocks from the four-patch/nine-patch/five-patch/log families above. Option B: also include diamond stars/hexagons/curves, which forces a set-in/curved seam engine. Evidence: §1, §5.
2. **How to treat the 1930–1963 sources.** Option A: restrict the library to pre-1931 sources (Webster, LAC, Finley names) and skip McKim/Hall & Kretsinger until renewal is checked. Option B: commission a renewal search (Stanford DB / CCE; Copyright Office search costs ~$200/hr as of 2026) [B11][B12].
3. **Whether to reuse any existing open block data.** Evidence is that there is little to reuse; MIT repos exist but are stubs. Recommend authoring fresh [§4].
4. **The naming policy.** Prefer generic catalogue names; maintain a blocklist of trademarked/designer-tied names [B13].

## Facts / Inferences / Unknowns

**Facts (sourced):** (1) US PD cutoff is works published 1930 and earlier as of 2026 [B1][B2][B12]. (2) Webster 1915 is PD and its full text (incl. an alphabetical quilt-name list) is on Project Gutenberg [B6]. (3) The LAC catalogues span c.1897–1928, all pre-1930 [B15]. (4) The Compendium says common geometric shapes and familiar symbols are not protected (§906.1/906.2) and pattern-book registration does not extend to individual pattern pieces (§920.1) [B3]. (5) *Feist*: facts and the ideas of a compilation are unprotected; only original selection/arrangement is [B4]. (6) "DEAR JANE" is a live USPTO trademark, Reg. #2423565, incl. Class 041 quilt instruction [B13]. (7) EQ ships "6,000+ copyright-free blocks" and sells Brackman's work separately as BlockBase+ [B14].

**Inferences:** (a) Block *geometry* and *names* from the pre-1930 catalogues are safe to use; the protected thing is a specific modern *drawing/compilation*. (b) The pragmatic v1 is the straight-seam/no-set-in subset. (c) Naming risk is the main residual legal risk, not the geometry.

**Unknowns:** (i) Whether McKim 1931 and Hall & Kretsinger 1935 were renewed (Stanford DB not queryable this session). (ii) Whether Nancy Cabot and post-1930 Kansas City Star patterns were renewed. (iii) The full set of trademarked block/pattern names beyond Dear Jane. (iv) Whether any court/Office decision addresses quilt patterns specifically (none found).

## Evidence register

Access date for all rows: 2026-10-28.

| ID | URL | Licence / terms | Establishes | Sections |
| --- | --- | --- | --- | --- |
| B1 | https://cspd.law.duke.edu/publicdomainday/2026/ | CC BY 4.0 | 1930 works enter US PD 2026-01-01 | 2 |
| B2 | https://en.wikipedia.org/wiki/Public_domain_in_the_United_States | CC BY-SA | "As of January 1, 2026, all published works from 1930 and before … are in the public domain" | 2 |
| B3 | https://law.resource.org/pub/us/compendium/ch900.html (mirror of Copyright Office Compendium Ch. 900) | US govt work | §906.1 geometric shapes, §906.2 familiar symbols, §920.1/.2 patterns & stencils | 3 |
| B4 | https://www.law.cornell.edu/supremecourt/text/499/340 | public domain (govt) | *Feist*: originality, facts not copyrightable, compilation limited to selection/arrangement | 3 |
| B5 | https://www.copyright.gov/circs/circ33.pdf | US govt work | Circular 33: familiar symbols/designs, common symbols & shapes not protected | 3 |
| B6 | https://www.gutenberg.org/ebooks/24682 | PD (Gutenberg licence) | Webster 1915 full text + "List of Quilt Names, Arranged Alphabetically" | 2, 5 |
| B7 | https://archive.org/details/quiltstheirstory00webs | not checked (PD work) | Webster 1915 scan | 2 |
| B8 | https://catalog.hathitrust.org/Record/006807467 | n/a | Finley 1929 bibliographic record (Indiana U., search-only) | 2 |
| B9 | https://archive.org/details/romanceofpatchwo0000hall_v0c2 | not checked | Hall & Kretsinger 1935 scan (Caxton Printers) | 2 |
| B10 | https://archive.org/details/onehundredonepat0000mcki | not checked | McKim 1962 Dover reprint | 2 |
| B11 | https://exhibits.stanford.edu/copyrightrenewals | n/a (bot-check this session) | Stanford Copyright Renewal Database (books 1923–1963) | 2, 3 |
| B12 | https://onlinebooks.library.upenn.edu/renewals.html | not checked | Renewal rules; "copyrights from before 1931 … have now all expired" | 2 |
| B13 | https://www.trademarkia.com/dear-jane-76010949 | not checked | DEAR JANE trademark Reg. #2423565, Classes 014/018/041 | 3 |
| B14 | https://electricquilt.com/online-shop/electric-quilt-8/ | not checked | "6,000+ copyright-free blocks"; BlockBase+ 4,264 blocks from Brackman | 3 |
| B15 | https://quiltindex.org/collections/special-collections/12-91-513/ | not checked | LAC catalogue editions c.1897–1928 + names/numbers | 2, 5 |
| B16 | https://www.gutenberg.org/files/24682/24682-8.txt | PD | Webster plain text (opened, used for name list) | 5 |
| B17 | https://support.electricquilt.com/articles/copyright/ | not checked | Dear Jane add-on block designs "come from the Dear Jane book … and are copyrighted" (search snippet) | 3 |
| B18 | https://github.com/TetonTopo/quiltblock ; https://github.com/Andreas-Schoenefeldt/quilt-block-patterns ; https://github.com/isaacc2/Piecewise ; https://github.com/fiddlehead/quilt_blocks ; https://github.com/borodiychuk/patchwork ; https://github.com/neonfuzz/svg_quilter | MIT (each) | MIT-licensed block code (via `gh api`) | 4 |
| B19 | https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=quilt%20block (Category:Quilts by pattern type, etc.) | varies | Commons has quilt photos, few block diagrams | 4 |
