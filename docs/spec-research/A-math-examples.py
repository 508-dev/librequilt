#!/usr/bin/env python3
"""
A-math-examples.py — librequilt track A acceptance-test worked examples.

Quilting arithmetic for the specification: unit cut sizes, layout arithmetic,
yardage, backing/batting/binding. Every number here is computed by this script
(run: python3 .context/spec-research/A-math-examples.py). Each example notes the
public source used to cross-check at least one number.

Conventions (all evidenced in A-math-findings.md):
  * seam allowance = 1/4 inch
  * usable width of fabric (WOF) = 40 inches (42-44 in bolt, selvages trimmed)
  * cut sizes rounded UP to the nearest 1/8 inch (rotary rulers are marked in 1/8")
  * yardage rounded UP to the nearest 1/8 yard (4.5 in), the smallest shop cut
"""

import math

SA = 0.25          # seam allowance, inches
WOF = 40.0         # usable width of fabric, inches
SQRT2 = math.sqrt(2.0)  # 1.41421...


# ---------------------------------------------------------------- rounding ----
def up8(x):
    """Round UP to the nearest 1/8 inch."""
    return math.ceil(x * 8.0) / 8.0


def up8yd(x):
    """Round UP to the nearest 1/8 yard."""
    return math.ceil(x * 8.0) / 8.0


def f2(n, v):
    """Format a float to n decimals, trim trailing zeros."""
    return ("%." + str(n) + "f") % v


def inches_to_yards(inches):
    return inches / 36.0


# ---------------------------------------------------------- unit cut sizes ----
def square_cut(finished):
    """Plain square: finished + 1/2 seam allowance."""
    return finished + 0.5


def rect_cut(fw, fh):
    """Rectangle: finished + 1/2 on each dimension."""
    return (fw + 0.5, fh + 0.5)


def hst2_cut(finished):
    """Half-square triangle, 2-at-a-time: finished + 7/8. Yields 2 per pair."""
    return finished + 0.875


def hst4_cut(finished):
    """Half-square triangle, 4-at-a-time (sew perimeter, cut both diagonals).

    Reviewer correction (2026-10-28): the perimeter seam lies 1/4 in inside the
    square's edge, so the seam segment in each unit is S - 1/2 long and becomes
    the unit's diagonal: (finished + 1/2) * sqrt(2) = S - 1/2.  Hence
    S = (finished + 1/2) * sqrt(2) + 1/2, about finished * 1.414 + 1 1/4 -- the
    same as an on-point side setting triangle.  The agent's original
    (finished + 1/2) * sqrt(2) omitted the final 1/2 and under-cut the unit."""
    return (finished + 0.5) * SQRT2 + 0.5


def hst8_cut(finished):
    """Half-square triangle, 8-at-a-time (magic 8): (finished + 7/8) * 2.
    Yields 8 per pair."""
    return (finished + 0.875) * 2.0


def qst_cut(finished):
    """Quarter-square triangle / hourglass: finished + 1 1/4. 2 squares -> 2
    hourglass units (cross-HST method)."""
    return finished + 1.25


def fg1_rect(fw, fh):
    """Flying geese, one-at-a-time (stitch-and-flip): rectangle = finished
    width x height each + 1/2; corner squares = height + 1/2 (cut 2)."""
    return (fw + 0.5, fh + 0.5)


def fg1_sq(fw, fh):
    return fh + 0.5


def fg4_large(fw, fh):
    """Flying geese, four-at-a-time (no waste): large square = width + 1 1/4."""
    return fw + 1.25


def fg4_small(fw, fh):
    """Flying geese no-waste: small (sky) squares = height + 7/8 (cut 4)."""
    return fh + 0.875


def flip_sq(finished_corner):
    """Stitch-and-flip corner: corner square = finished corner + 1/2."""
    return finished_corner + 0.5


def sis_center(finished_center):
    """Square-in-a-square center square: finished + 1/2."""
    return finished_center + 0.5


def sis_corner_sq(finished_center):
    """Square-in-a-square corner triangles (triangle method): cut 2 squares at
    (finished_center / sqrt(2)) + 7/8, each sliced once diagonally -> 4 triangles."""
    return finished_center / SQRT2 + 0.875


def strip_cut(finished):
    """Strip-set strip width: finished + 1/2 (subcut segments at finished + 1/2)."""
    return finished + 0.5


# ----------------------------------------------------------- layout math -----
def quilt_size(block, blocks_w, blocks_h, sashing=0.0, cornerstone=0.0,
               borders=None):
    """Finished quilt size from blocks/sashing/cornerstones/borders.

    sashing: finished sashing strip width. cornerstone: finished cornerstone
    size (squares at sashing intersections). borders: list of finished widths.
    """
    w = blocks_w * block + (blocks_w - 1) * sashing
    h = blocks_h * block + (blocks_h - 1) * sashing
    # cornerstones sit at sashing intersections and are the same finished size
    # as the sashing width; they do not add to the total if sashing is uniform,
    # but if cornerstones are larger than sashing they add.  Here we treat the
    # finished grid as block + sashing only (standard).
    for b in (borders or []):
        w += 2 * b
        h += 2 * b
    return (w, h)


def side_setting_sq(finished_block):
    """On-point side setting triangles: (block x sqrt(2)) + 1 1/4, rounded up
    to 1/8", cut twice diagonally -> 4 quarter-square triangles."""
    return up8(finished_block * SQRT2 + 1.25)


def corner_setting_sq(finished_block):
    """On-point corner setting triangles: (block / sqrt(2)) + 7/8, rounded up
    to 1/8", cut once diagonally -> 2 half-square triangles."""
    return up8(finished_block / SQRT2 + 0.875)


# ------------------------------------------------------------- yardage -------
def pieces_per_strip(cut_width, wof=WOF):
    return int(wof // cut_width)


def yardage_for_pieces(cut_width, cut_height, qty, wof=WOF):
    """Strip-then-subcut yardage for qty identical pieces (cut w x h)."""
    pps = pieces_per_strip(cut_width, wof)
    strips = math.ceil(qty / pps)
    length = strips * cut_height
    yds = length / 36.0
    return {"pps": pps, "strips": strips, "length_in": length,
            "yards_exact": yds, "yards_up8": up8yd(yds)}


def binding(cut_width, cut_height, wof=WOF, allowance=10.0, strip_width=2.5):
    """Binding: perimeter + allowance -> strips -> yardage."""
    perim = 2 * (cut_width + cut_height)
    total = perim + allowance
    strips = math.ceil(total / wof)
    yds = strips * strip_width / 36.0
    return {"perimeter": perim, "total_len": total, "strips": strips,
            "yards_exact": yds, "yards_up8": up8yd(yds)}


def backing(cut_width, cut_height, overhang=4.0, wof=42.0):
    """Backing yardage: add overhang each side, piece widths if needed."""
    bw = cut_width + 2 * overhang
    bh = cut_height + 2 * overhang
    widths = math.ceil(bw / wof)
    yds = widths * bh / 36.0
    return {"backing_size": (bw, bh), "widths": widths,
            "yards_exact": yds, "yards_up8": up8yd(yds)}


# --------------------------------------------------------------- examples ----
def show(label, **kw):
    print("=" * 72)
    print(label)
    for k, v in kw.items():
        print("  %-16s %s" % (k, v))


def example1_squares_strip_set():
    # 5 x 5 grid of 4" finished squares, two fabrics, strip-then-subcut.
    finished = 4.0
    cut = square_cut(finished)
    total = 25
    per_fabric = 13 if False else 13  # 13 + 12 = 25
    qty = 13
    y = yardage_for_pieces(cut, cut, qty)
    show("EXAMPLE 1: plain squares, strip-then-subcut (13 pieces of one fabric)",
         finished_square=finished, cut_square=cut, qty=qty,
         pieces_per_strip=y["pps"], strips=y["strips"],
         strip_length_in=y["length_in"], yards=y["yards_up8"],
         crosscheck="Stitchin' Heaven: 6.5in squares, 40in WOF -> 6 per strip")


def example2_hst2():
    finished = 3.0
    cut = hst2_cut(finished)
    # 12 HSTs needed -> 6 pairs of squares (12 squares).
    pairs = 6
    show("EXAMPLE 2: HST 2-at-a-time (12 units @ 3in finished)",
         finished=finished, cut_square=cut, pairs=pairs,
         yield_=pairs * 2,
         crosscheck="Treasurie/Quiltler: 3in finished -> 3 7/8in cut")


def example3_hst48():
    # 8 identical HSTs @ 3in finished. Compare 4-at-a-time vs 8-at-a-time.
    finished = 3.0
    c4 = hst4_cut(finished)
    c8 = hst8_cut(finished)
    # 4-at-a-time: 2 pairs of squares = 4 squares -> 8 HSTs.
    # 8-at-a-time: 1 pair of squares = 2 squares -> 8 HSTs.
    show("EXAMPLE 3: HST 4- and 8-at-a-time (8 units @ 3in finished)",
         hst4_cut_square=round(c4, 4), hst4_rounded_up8=up8(c4),
         hst8_cut_square=round(c8, 4),
         hst8_crosscheck="Bernina/Craftsy: (3 + 7/8) x 2 = 7 3/4in",
         hst4_note="published charts say +1.25 (=4.25) or /0.64 (=4.69); "
                   "geometric exact is (F+1/2)*sqrt(2) + 1/2 = 5.4497")


def example4_qst():
    finished = 3.0
    cut = qst_cut(finished)
    show("EXAMPLE 4: QST / hourglass (Ohio Star) @ 3in finished",
         cut_square=cut,
         crosscheck="Create Whimsy/Craftsy: 3in finished -> 4 1/4in")


def example5_fg():
    fw, fh = 4.0, 2.0
    r = fg1_rect(fw, fh)
    sq = fg1_sq(fw, fh)
    big = fg4_large(fw, fh)
    small = fg4_small(fw, fh)
    show("EXAMPLE 5: flying geese @ 4x2in finished, both methods",
         one_rect=("(%s x %s)" % (r[0], r[1])), one_corner_sq=sq,
         four_large=big, four_small=small,
         crosscheck="WeAllSew: 4x2 -> large 5 1/4, small 2 7/8; "
                    "The Quilter B2B: rect 4 1/2 x 2 1/2, squares 2 1/2")


def example6_flip_sis():
    # Snowball block: 6" finished, 3" finished corner squares.
    snow_corner = flip_sq(3.0)
    # Square-in-a-square: 6" finished block, center square = 6/sqrt2 = 4.243.
    center = 6.0 / SQRT2
    cc = sis_center(center)
    corner = sis_corner_sq(center)
    show("EXAMPLE 6: stitch-and-flip + square-in-a-square @ 6in block",
         snowball_corner_sq=snow_corner,
         sis_center_finished=round(center, 4),
         sis_center_cut=round(cc, 4),
         sis_corner_sq=round(corner, 4), sis_corner_up8=up8(corner),
         crosscheck="Scissortail quick-corner: corner = finished/2 + 1/2")


def example7_strip_set():
    # Rail fence: 3-strip set, strips finish 2" wide; block 6" finished.
    strip = strip_cut(2.0)
    seg = strip_cut(6.0)
    show("EXAMPLE 7: strip set (rail fence)",
         strip_cut_width=strip, subcut_segment=seg,
         crosscheck="strip = finished + 1/2, subcut = finished + 1/2")


def example8_layout():
    # Task example: 20 nine-patch blocks @ 9in finished, 2in sashing with
    # cornerstones, one 4in border.  Grid 4 x 5.
    block = 9.0
    sashing = 2.0
    border = 4.0
    w, h = quilt_size(block, 4, 5, sashing=sashing, borders=[border])
    show("EXAMPLE 8: layout (20 nine-patch blocks 9in, 2in sashing, 4in border)",
         blocks_grid="4 x 5", sashing=sashing, border=border,
         finished_quilt=("(%s x %s)" % (w, h)),
         check="4*9 + 3*2 + 2*4 = 50 wide; 5*9 + 4*2 + 2*4 = 61 tall")


def example9_onpoint():
    block = 12.0
    side = side_setting_sq(block)
    corner = corner_setting_sq(block)
    show("EXAMPLE 9: on-point setting @ 12in block",
         side_setting_sq=side, corner_setting_sq=corner,
         crosscheck="Quiltville/Timber Lane: 12in block -> side 18 1/4, "
                    "corner 9 3/8")


def example10_backing_binding():
    # 60 x 80 throw.
    w, h = 60.0, 80.0
    b = binding(w, h)
    back42 = backing(w, h, overhang=4.0, wof=42.0)
    back108 = backing(w, h, overhang=4.0, wof=108.0)
    show("EXAMPLE 10: backing + binding for 60x80 throw",
         binding_strips=b["strips"], binding_yards=b["yards_up8"],
         binding_crosscheck="CraftCalc: 60x72 -> perimeter 264 + 10 = 274, "
                            "7 strips x 2.5 = 0.5 yd",
         back42_size=back42["backing_size"], back42_widths=back42["widths"],
         back42_yards=back42["yards_up8"],
         back42_crosscheck="Boneyard Tools: 68x88 backing, 2 widths, ~4.9 yd",
         back108_widths=back108["widths"], back108_yards=back108["yards_up8"])


def derivation_check():
    """Numeric sanity checks of the two 'mystery' formulas (see findings Q2)."""
    print("=" * 72)
    print("DERIVATION CHECK (printed for the record)")
    # 2-at-a-time exact: cut = F + 1/2 + 1/(2*sqrt(2))  ~= F + 0.8536 ~= F + 7/8
    for F in (2.0, 3.0, 4.0):
        exact = F + 0.5 + 1.0 / (2 * SQRT2)
        print("  2-at-a-time F=%s: exact %.4f -> 7/8 formula %.4f" %
              (F, exact, F + 0.875))
    # 4-at-a-time: what finished size results from the published +1.25 cut?
    for F in (2.0, 3.0, 4.0):
        s_pub = F + 1.25
        resulting_finished = (s_pub - 0.5) / SQRT2 - 0.5
        s_exact = (F + 0.5) * SQRT2 + 0.5
        print("  4-at-a-time F=%s: +1.25 cut=%.3f -> finished %.3f (UNDERSIZED);"
              " exact cut=%.4f" % (F, s_pub, resulting_finished, s_exact))
    # 8-at-a-time exact vs fabricmathtools' (2F + 1.5):
    for F in (2.0, 3.0, 4.0):
        print("  8-at-a-time F=%s: exact (F+7/8)*2 = %.3f ; fabricmathtools"
              " 2F+1.5 = %.3f" % (F, (F + 0.875) * 2, F * 2 + 1.5))


def main():
    example1_squares_strip_set()
    example2_hst2()
    example3_hst48()
    example4_qst()
    example5_fg()
    example6_flip_sis()
    example7_strip_set()
    example8_layout()
    example9_onpoint()
    example10_backing_binding()
    derivation_check()


if __name__ == "__main__":
    main()
