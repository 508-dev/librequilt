# IMPL-05 verification — on-point layout geometry

Branch `impl-05-on-point-layout`, 2026-11-19. Run on Linux 7.2.9 (Manjaro) with
Bun 1.4.2 and Python 3.14.7, from the repository root.

## Commands and actual results

| Check | Result |
| --- | --- |
| `bun install --frozen-lockfile` | "Checked 27 installs across 85 packages (no changes)"; `bun.lock` unmodified |
| `bun run typecheck` | clean, no output |
| `bun run lint` | 57 files checked, no findings |
| `bun test` | 249 pass, 0 fail, 4774 assertions, 22 files (53 pass, 206 assertions, 6 files in `src/core/layout`; 196 pass, 4568 assertions from IMPL-01 to IMPL-04 unchanged) |
| `bun run build` | `dist/index.html` 2.59 kB, CSS 1.40 kB, JS 0.72 kB (2.22 kB gzipped total) |
| `python3 scripts/check-project.py` | "Project structure is valid. Maintainer review of substance and licensing is still required." |

Expected values in the tests are quoted from `python3 docs/specification-fixtures.py`
with the fixture line named in each test comment.

## What the tests cover

Every T-03 value, as the plan's IMPL-05 verification method requires
(`src/core/layout/on-point.test.ts`):

1. **Eight whole positions, six side and four corner triangles** (fixtures
   LAYOUTS "on point 2 x 3: 8 whole, 6 side, 4 corner"). L-04's `2CR−C−R+1 = 8`
   full diamond positions (plain alternates count) and `2(C+R−2) = 6` side
   triangles, plus four corner triangles.
2. **Two side and two corner parent squares, with leftovers reported**
   (fixtures "2 side parent squares, 2 corner parent squares"). Four side
   triangles per side parent (`ceil 6/4 = 2`, yielding eight, two leftover); two
   corner triangles per corner parent (`ceil 4/2 = 2`, none leftover).
3. **Exact size `24√2 × 36√2`, shown `33 15/16 × 50 15/16`, approximate**
   (fixtures "on point theoretical finished: 33.941125 x 50.911688 in" and
   "on point shown to 1/16: 33 15/16 x 50 15/16 in"). The exact value stays
   `a + b√2` (asserted via `E.format`), is never persisted as a rounded
   sixteenth (G-01, I3), and the display is a plain-number leaf marked
   approximate.
4. **Side parents 18¼ cut twice diagonally, corner parents 9⅜ cut once**
   (fixtures "on point B=12 sash=0: side 18 1/4; corner 9 3/8"). L-05's
   `ceil⅛(T√2+1¼)` side parent with `diagonalCuts: 2` and straight grain on the
   long outside edge; `ceil⅛(T/√2+⅞)` corner parent with `diagonalCuts: 1` and
   straight grain on the two outside legs (T-03: "Check the specified
   straight-grain outside edges").
5. **With 2-inch on-point sashing: 21⅛ and 10⅞, outer size unverified**
   (fixtures "on point B=12 sash=2: side 21 1/8; corner 10 7/8"). `T = B + S =
   14`, and L-05/O-11's unverified label is asserted via `outerSizeVerified =
   false`; without sashing the theoretical size is the verified outer size.

Also covered: the single rounding at the end (the side parent's unrounded
geometry is exactly `5/4 + 12√2`, ceiled once to the next eighth, G-02/I2);
the display's independence from cut arithmetic (I3, by construction: display
and cuts travel on separate paths); and the refusals a quilter can cause (I5):
a non-square block (`non-square-block`, the specification's "an on-point block
that is not square" edge case), a bad diagonal count (`bad-grid-count`), a zero
or fractional block side, a negative or fractional sash width (with an absent
sash reading as zero, G-01), a parent cut past the stored range refused rather
than thrown, and the single-diamond `1 × 1` envelope (one position, four
corners, no side parents).

## Interpretations and limitations

- **`T = B + S` is kept as a sixteenth count, not a stored length.** `B` and `S`
  are each bounded to 1000 inches, so their sum can exceed the stored range a
  single measurement is held to. `T` is carried as a count and lifted to exact
  inches only inside the parent-cut formulas, where `core/unit`'s `cutOrRefuse`
  already refuses any cut past the stored maximum. This keeps a `B + S` too
  large to store a refusal (I5) rather than a range error.
- **The non-square block is expressed as a width and a height.** The
  specification's edge case requires a refusal for "an on-point block that is
  not square", so the input carries `blockWidth` and `blockHeight` and refuses
  when they differ (L-04's `B` needs equal sides). In practice `core/block`'s
  grids are square, but the refusal is reachable and tested.
- **The display value is a plain number, not a stored `Sixteenths`.** A nearest-
  sixteenth display of a large envelope may sit above the 1000-inch stored
  maximum; it is a leaf that never re-enters cut arithmetic (I3), so it is not
  held to the stored range. `formatDisplayInches` mirrors `L.formatInches` for
  that plain count.
- **The proof quilt is not here.** IMPL-05 labels the outer size unverified when
  sashing is present and leaves the measured rule to IMPL-30 (O-11). The
  `outerSizeVerified` flag records exactly that state; a material change to the
  specification after the measurement needs fresh approval.
- **The whole-position count is pure `C`/`R` arithmetic.** L-04's `2CR−C−R+1`
  and `2(C+R−2)` depend only on the diagonal spans, so sashing changes the
  parent-cut sizes (`T`) but never the position or triangle counts.

## Clean-room record

Read in this context: `AGENTS.md`, `docs/implementation-plan.md` (Architecture
and IMPL-05, plus Clarifications needed), `docs/specification.md` (approved at
`b358fef4ed8c3a0c3c0a9a0419ab408ab3831d8c`; L-04, L-05, W-04, O-11, T-03),
`docs/specification-fixtures.py` (read and run), `docs/decisions.md`,
`docs/verification.md`, `docs/verification/IMPL-04.md`, GitHub issue #11
(read-only), and the existing code and tests under `src/core/exact`,
`src/core/unit`, `src/core/block` and `src/core/layout`, plus `package.json`,
`tsconfig.json`, `biome.json`. Not opened: `docs/research.md`,
`docs/spec-research/`, `docs/observations/`, `.context/`; no quilt-design
product was consulted and no quilting web search was made. Doubts are stated
above rather than guessed at.
