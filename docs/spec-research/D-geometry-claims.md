> Agent research report for librequilt, written 2026-10-28 by a locally initiated agent (DeepSeek V4 Pro) following the brief in this folder's README. Mechanical check: 12 of 12 links resolve; 14 of 18 claim quotes found verbatim, the rest on a page that refuses automated requests or differing only in inch marks. The orchestrator reviewed it; no corrections. Its on-point formulas (round the diagonal, then add) give the same results as track A's (add, then round) because the added amounts are whole eighths. Everything marked **[proposal]** is a proposal, not an approved requirement. Corrections and the consolidated summary are in [research.md](../research.md#specification-research-2026-10-28).

# Track D — Geometry, FPP, fabric scale, true-scale printing: claims

The eight to twelve claims the proposals depend on most. For each: the claim in one sentence, the URL, and the exact supporting sentence, quoted. A reviewer will re-open every one. Access date for all: 2026-10-28.

1. **On-point setting triangles follow two fixed formulas.** A side triangle is cut from a square of `finished block × 1.414` (rounded up to 1/8″) `+ 1¼″`, and a corner triangle from `finished block ÷ 1.414` (rounded up to 1/8″) `+ 7/8″`.
   URL: https://snugglesquilts.com/quilt-block-settings-on-point
   “Side Triangles –  You take the finished size of your block x 1.414, then add 1 1/4″ to that number.” / “End Triangles –  You take the finished size of your block/(divided by) 1.414, then add 7/8″ to that number.”

2. **Sashing width is added to the block size before applying the on-point formula.**
   URL: https://snugglesquilts.com/quilt-block-settings-on-point
   “If you are adding in sashing, you would add the width of the sashing to the block size and use that number in the formula.”

3. **Butted and mitered border corners are defined by different seams and fabric needs.**
   URL: https://gequiltdesigns.com/blogs/the-quilters-toolkit/all-about-quilt-borders
   “Butted corners are the standard: top and bottom borders run the full width of the quilt, and side borders butt up against them.” / “Mitered corners join the borders at a 45-degree angle, like a picture frame.”

4. **A paper-pieceable pattern is exactly one whose dual hypergraph is acyclic, and the sewing order comes from leaf-plucking.**
   URL: https://mackenzieleake.com/projects/paperpiecing
   “We show that determining whether the pattern is paper pieceable is equivalent to checking whether this hypergraph is acyclic, and if it is acyclic, we can apply a leaf-plucking algorithm to the hypergraph to generate viable sewing orders for the pattern geometry.”

5. **Any design can be made foundation paper pieceable in at most two stages.**
   URL: https://research.tue.nl/en/publications/algorithms-to-construct-designs-for-foundation-paper-piecing-of-q
   “In particular, it is interesting that every design can be made foundation paper pieceable in at most two stages.”

6. **The FOSS SVG→FPP tool svg_quilter is MIT-licensed and was last pushed 2025-07-29.**
   URL: https://github.com/neonfuzz/svg_quilter (metadata via `gh api repos/neonfuzz/svg_quilter`)
   “A Python toolkit for turning SVG line drawings into Foundation Paper Piecing (FPP) quilt patterns—automatically grouping, labeling, and laying out your quilt pieces for easy printing.” (README; licence MIT and pushed_at 2025-07-29T23:39:14Z from the API response.)

7. **The finished FPP block is a mirror image of the printed paper.**
   URL: https://hcquilts.com/blogs/tips-and-tricks/foundation-paper-piecing-patterns
   “Because you stitch on the printed side and place fabric on the back, the finished block comes out as a mirror image of the paper.”

8. **A printable FPP pattern must carry a 1″ test square that is measured before cutting.**
   URL: https://villageboundquilts.com/blog/how-to-fpp
   “Measure the 1″ test block on each printed page.” / “all VBQ FPP templates have a 1″ test square to measure”

9. **Fabric-photo scale is calibrated by placing a ruler in the photo and typing its size.**
   URL: https://support.electricquilt.com/articles/getting-the-correct-fabric-scale
   “If you want to take a photo of fabric, place a ruler on the fabric before you take the photo.” / “Click the Scale Fabric tool in the palette. Type the size shown on the ruler in the photo into the entry in the palette.”

10. **Electric Quilt scans fabric at 72–75 dpi at 100 %, because its fabrics are only rendered on screen.**
    URL: https://support.electricquilt.com/articles/import-scanned-fabric
    “Be sure your resolution is set to 72-75dpi and you are scanning your fabric at 100%.”

11. **Templates must be printed at 100 %/"Actual size", never "Fit to page", and checked against a calibration square.**
    URL: https://quiltblockatlas.com/printing-quilt-patterns-at-100-percent
    “Print at 100% or "Actual size" — never "Fit to page", which shrinks every measurement on the sheet.” / “The calibration square is the only honest check: it must measure exactly 1″, and anything else means reprint.”

12. **PDF viewers and browsers default to scaling that shrinks the page: Acrobat Reader defaults to "Fit", and Edge offers "Fit to printable area" as distinct from "Actual size".**
    URL: https://community.adobe.com/questions-9/how-to-set-default-scaling-to-actual-size-in-print-dialog-1520586
    “Acrobat Reader sets the scaling to "Fit".”
    URL: https://support.microsoft.com/en-us/edge/print-in-microsoft-edge
    “Fit to printable area: This option will automatically adjust the size of the content to fit within the printable area of the paper. Actual size: This option prints the document in its original size without any scaling.”
