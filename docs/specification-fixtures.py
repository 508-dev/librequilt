"""Synthetic arithmetic fixtures for the unapproved librequilt specification.

Run: python3 docs/specification-fixtures.py
Drafted by an agent; corrected in review on 2026-10-31 (square-in-a-square by outer
size, cutting orientation, long-border plans).
All editable lengths are sixteenths of an inch. Decimal sqrt is used only for
derived diagonals; cuts round once, upward, to one eighth of an inch.
"""
from decimal import Decimal, getcontext, ROUND_CEILING, ROUND_HALF_UP
from fractions import Fraction
from math import ceil

getcontext().prec = 40
R = Fraction
Q = R(1, 4)
SQ = Decimal(2).sqrt()


def dec(x):
    return Decimal(x.numerator) / Decimal(x.denominator) if isinstance(x, Fraction) else Decimal(x)


def cut(x):
    d = dec(x) * 8
    return R(int(d.to_integral_value(rounding=ROUND_CEILING)), 8)


def yards(length):
    return R(ceil(length * 2 / 9), 8)  # ceil(length / 4.5 inches) eighth-yards


def mixed(x):
    if isinstance(x, Decimal):
        x = R(x)
    n, rem = divmod(x.numerator, x.denominator)
    return f"{n} {rem}/{x.denominator}" if rem else str(n)


def strips(qty, across, along, width=R(40)):
    per = width // across
    if per < 1:
        return "does not fit"
    count = ceil(qty / per)
    return f"{int(per)} per strip; {count} strips; {mixed(count * along)} in; {mixed(yards(count * along))} yd"


def best(qty, a, b, width=R(40)):
    """Non-directional fabric: try both orientations, keep the shorter raw length."""
    options = []
    for across, along in ((a, b), (b, a)):
        per = width // across
        if per >= 1:
            count = ceil(qty / per)
            options.append((count * along, across, int(per), count))
    raw, across, per, count = min(options)
    return f"{mixed(across)} across; {per} per strip; {count} strips; {mixed(raw)} in; {mixed(yards(raw))} yd"


def joined(lengths, strip_width, width=R(40), join=R(1, 2)):
    """Width-of-fabric strips joined end to end with straight 1/4-inch seams."""
    total, n = sum(lengths), 1
    while n * width - (n - 1) * join < total:
        n += 1
    return f"{mixed(total)} in of strip; {n} strips; {mixed(n * strip_width)} in; {mixed(yards(n * strip_width))} yd"


def lengthwise(lengths, strip_width, width=R(40)):
    """One lengthwise cut as long as the longest piece; same-width pieces share it."""
    per = int(width // strip_width)
    cuts = ceil(len(lengths) / per)
    raw = cuts * max(lengths)
    return f"{per} strips per cut; {cuts} cut(s); {mixed(raw)} in; {mixed(yards(raw))} yd"


def onpoint(b, sash=R(0)):
    t = dec(b + sash)
    return cut(t * SQ + dec(R(5, 4))), cut(t / SQ + dec(R(7, 8)))


def backing(w, h, overhang, width):
    bw, bh = w + 2 * overhang, h + 2 * overhang
    count = ceil(bw / width)
    return bw, bh, count, count * bh, yards(count * bh)


def binding(w, h, width, join, strip_width):
    perimeter = 2 * (w + h)
    count = ceil((perimeter + join) / width)
    return perimeter, count, count * strip_width, yards(count * strip_width)


f = R(3)
rows = [
    ("square / strip", cut(f + 2 * Q)),
    ("HST 2", cut(dec(f + 2 * Q) + dec(R(1, 2)) / SQ)),
    ("HST 2 trim", cut(f + 1)),
    ("HST 4 corrected", cut(dec(f + 2 * Q) * SQ + dec(2 * Q))),
    ("HST 8", cut(2 * (f + R(7, 8)))),
    ("HST 8 trim", cut(2 * (f + 1))),
    ("QST / hourglass", cut(dec(f + 2 * Q) + Decimal(1) / SQ)),
    ("QST trim", cut(f + R(3, 2))),
    ("FG one rect 4 x 2", (cut(R(4) + 2 * Q), cut(R(2) + 2 * Q))),
    ("FG one squares", cut(R(2) + 2 * Q)),
    ("FG four large", cut(R(4) + R(5, 4))),
    ("FG four small", cut(R(2) + R(7, 8))),
    ("stitch flip corner 3", cut(f + 2 * Q)),
    ("square in square, 6 outer: centre (trim unit to 6 1/2)", cut(dec(R(6)) / SQ + dec(2 * Q))),
    ("square in square, 6 outer: corner parents, cut once", cut(R(6) / 2 + R(7, 8))),
    ("strip set width 2; subcut 6", (cut(R(2) + 2 * Q), cut(R(6) + 2 * Q))),
]
print("CUTS")
for label, value in rows:
    value = " x ".join(mixed(v) for v in value) if isinstance(value, tuple) else mixed(value)
    print(f"{label}: {value} in")

print("LAYOUTS")
b, c, r, s, border = R(12), 2, 3, R(2), R(4)
inner_w = c*b + (c+1)*s
inner_h = r*b + (r+1)*s
outer_w, outer_h = inner_w+2*border, inner_h+2*border
print(f"sampler: {mixed(inner_w)} x {mixed(inner_h)} inner; {mixed(outer_w)} x {mixed(outer_h)} finished")
print(f"sampler without outer sashing or border: {mixed(c*b+(c-1)*s)} x {mixed(r*b+(r-1)*s)} in")
print(f"sampler: {r*(c+1)+(r+1)*c} sash rectangles; {(c+1)*(r+1)} cornerstones")
print(f"sampler border: sides {mixed(border+2*Q)} x {mixed(inner_h+2*Q)}; top/bottom {mixed(border+2*Q)} x {mixed(outer_w+2*Q)}")
for b,s in [(R(12),R(0)),(R(12),R(2))]:
    side, corner = onpoint(b,s)
    print(f"on point B={mixed(b)} sash={mixed(s)}: side {mixed(side)}; corner {mixed(corner)}")
full = 2*c*r-c-r+1
side_count = 2*(c+r-2)
print(f"on point {c} x {r}: {full} whole, {side_count} side, 4 corner; {ceil(side_count/4)} side parent squares, 2 corner parent squares")
print(f"on point theoretical finished: {dec(c*b)*SQ:.6f} x {dec(r*b)*SQ:.6f} in")
print(f"on point shown to 1/16: {mixed(R(int((dec(c*b)*SQ*16).to_integral_value(rounding=ROUND_HALF_UP)),16))} x {mixed(R(int((dec(r*b)*SQ*16).to_integral_value(rounding=ROUND_HALF_UP)),16))} in")

print("YARDAGE")
for label, qty, across, along, width in [
    ("13 squares 4.5",13,R(9,2),R(9,2),R(40)),
    ("13 squares 4.5 WOF42",13,R(9,2),R(9,2),R(42)),
    ("17 sash 2.5 x 12.5",17,R(5,2),R(25,2),R(40)),
    ("12 cornerstones 2.5",12,R(5,2),R(5,2),R(40)),
    ("2 side borders lengthwise",2,R(9,2),R(89,2),R(40)),
    ("2 top borders lengthwise",2,R(9,2),R(77,2),R(40)),
]:
    print(f"{label}: {strips(qty,across,along,width)}")
print(f"17 sash 2.5 x 12.5, non-directional: {best(17, R(5,2), R(25,2))}")
borders = [R(89, 2)] * 2 + [R(77, 2)] * 2
print(f"four 4 1/2 in borders, joined strips: {joined(borders, R(9, 2))}")
print(f"four 4 1/2 in borders, one shared lengthwise cut: {lengthwise(borders, R(9, 2))}")
print(f"WRONG (separate lengthwise cuts summed): {mixed(R(89,2)+R(77,2))} in; {mixed(yards(R(89,2)+R(77,2)))} yd")

print("BINDING AND BACKING")
for join in [R(10),R(12),R(20)]:
    print(f"binding 60x80, WOF40, join{mixed(join)}, strip2.5: {binding(R(60),R(80),R(40),join,R(5,2))}")
for join in [R(10),R(20)]:
    print(f"binding 60x72, WOF40, join{mixed(join)}, strip2.5: {binding(R(60),R(72),R(40),join,R(5,2))}")
for width in [R(40),R(108)]:
    print(f"backing 60x80, overhang4, WOF{mixed(width)}, lengthwise: {backing(R(60),R(80),R(4),width)}")
print(f"backing 60x80, overhang4, WOF108, turned: {backing(R(80),R(60),R(4),R(108))}")
print(f"batting 60x80, overhang3: {mixed(R(60)+6)} x {mixed(R(80)+6)} in")
print(f"25 in planned length, waste10%, shrink5%: {mixed(yards(R(25)*R(11,10)/R(95,100)))} yd")
print("OTHER ACCEPTANCE NUMBERS")
print(f"photo scale from repeat: {600/6:g} pixels/in; from ruler: {300/3:g} pixels/in; 2-in span: {2*600/6:g} pixels")
print(f"file length counts: {12*16} sixteenths; {2*16} sixteenths")
print(f"97% print: 1-in square {R(97,100)} in; 3.5-in edge {dec(R(7,2)*R(97,100))} in")
print(f"quarter yard in metres: {dec(R(1,4)*R(9144,10000))} m")

# Fixed checks catch accidental changes to the fixture generator itself.
assert dict(rows)["HST 4 corrected"] == R(11,2)
assert (inner_w, inner_h, outer_w, outer_h) == (30,44,38,52)
assert onpoint(R(12)) == (R(73,4), R(75,8))
assert yards(R(83)) == R(19,8)
assert (c*b+(c-1)*s, r*b+(r-1)*s) == (26,40)
