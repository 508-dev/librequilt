# IMPL-03 verification — the block as a measured grid

Branch `impl-03-block-grid`, 2026-11-19. Run on Linux 7.2.9 (Manjaro) with Bun
1.4.2 and Python 3.14.7, from the repository root.

## Commands and actual results

| Check | Result |
| --- | --- |
| `bun install --frozen-lockfile` | "Checked 27 installs across 85 packages (no changes)"; `bun.lock` unmodified |
| `bun run typecheck` | clean, no output |
| `bun run lint` | 43 files checked, no findings |
| `bun test` | 196 pass, 0 fail, 4568 assertions, 16 files (70 pass, 920 assertions, 5 files in `src/core/block`; 126 pass from IMPL-01/IMPL-02 unchanged) |
| `bun run build` | `dist/index.html` 2.59 kB, CSS 1.40 kB, JS 0.72 kB (2.22 kB gzipped total) |
| `python3 scripts/check-project.py` | "Project structure is valid. Maintainer review of substance and licensing is still required." |

Expected values in the tests are quoted from `python3 docs/specification-fixtures.py`
with the fixture line named in each test comment.

## What the tests cover

The three verification points of `docs/implementation-plan.md` § IMPL-03:

1. **A grid division that cannot be represented in whole sixteenths is
   refused.** `grid.test.ts`: 12 inches into 5 rows (192 / 5 = 38.4 sixteenths)
   refuses `grid-division-not-whole-sixteenths` with the axis named; 12 inches
   into 3 by 3 (cells 4 inches) and 10 inches into 5 by 5 (cells 2 inches)
   divide; cells may be whole sixteenths without whole inches (3 1/16 into 7
   gives 7/16-inch cells). T-01's rejections at block scale: a zero finished
   block and a 3.01-inch entry are refused as values, never rounded.
2. **Mirroring and rotation leave every cut dimension unchanged (G-03).**
   `orientation.test.ts` proves the size identity over all eight orientations
   composed pairwise; `plan.test.ts` plans a mixed block (goose, squares, a
   bar, oversized and trim HSTs, a rectangle, strips) through all eight placed
   orientations and asserts the sorted cut dimensions are identical, and that
   the definition is not altered by any placed copy; a quarter-turned goose in
   a transposed region cuts the same 4 1/2 x 2 1/2-inch body and 2 1/2-inch
   corners as the unturned one.
3. **A block kept as a visual draft reports its missing construction before
   export.** `plan.test.ts`: a drawn piece without a construction and every
   uncovered cell are listed in one `missing-construction` refusal (P-03: the
   yardage is withheld, never silently included), while the draft keeps its
   finished and unfinished measurements.

Also covered: W-02's cuttability answer with the offending seam named (T-01's
curve and set-in seam rows, plus the free polygon, at block scale, first bad
seam named); the finished/unfinished/cut distinction (a 12-inch block is
unfinished 12 1/2 and never 12; a 3 1/16-inch block is unfinished 3 9/16,
never rounded to an eighth per G-02; a 3-inch HST block shows finished 6,
unfinished 6 1/2 and 3 7/8-inch parents as three distinct numbers); placement
rules (whole cells, inside the grid, no shared cell, named pieces, refused bad
turn counts); grouping with parent counts, yields and excess (G-07); and T-01's
unit table through block plans: the 3 1/2-inch square, 3 7/8- and 4-inch HST
parents with the trim statement, 7 3/4-inch eight-at-a-time parents, 4 1/4-inch
hourglass parents, the 4 x 2-inch goose rows, the square-in-a-square rows and
the 2 1/2 x 6 1/2-inch strip row. `refusals.test.ts` checks a sentence a quilter
can act on for every refusal kind.

## Interpretations and limitations

- **Rotation and mirroring exist at both scales.** The scope sentence "independent
  rotation and mirroring of a placed copy without altering a library definition"
  is W-03's placement rule (a placed copy of a block definition), and W-02 also
  lets the quilter "rotate or mirror it" per drawn piece. Both use one
  `Orientation` value: `PlacedBlock` for block copies, `PlacedPiece.orientation`
  for units on the grid (which the drawing surface will need for seam
  direction). If only block copies were intended, the piece-level field is the
  one to drop; nothing else depends on the choice.
- **A stitch-and-flip corner is not a placement kind.** G-07 defines its cut,
  but as a corner treatment on another piece it would overlap its host region;
  the specification does not say how it attaches to a drawn piece. It is left
  to IMPL-17/IMPL-19 with the drawing semantics. Square-in-a-square *is*
  planned (G-08 defines it "so that it fits the block grid", and W-03's library
  blocks need it) although, per Q-03, IMPL-19 must not offer it as a drawing
  tool.
- **A cutting chart needs the whole grid covered.** Uncovered cells are
  reported as regions still missing a construction, so a partially drawn block
  is a draft and refuses export. This follows P-03's "marked incomplete
  design ... cannot silently include its yardage"; if incomplete export is ever
  meant to succeed with a marker, that is a plan-level change.
- **A straight strip's finished width is the shorter side of its region** and
  its length the longer one, whichever way the strip runs. The cut numbers are
  G-03's `F + 1/2` width and `L + 1/2` subcut.
- **The four-at-a-time HST plan passes through** with its
  `provisional-pending-sewn-check` statement while O-06 is undecided: the block
  core does not offer or gate methods, IMPL-29 sets or removes the method and
  the drawing surface (IMPL-19) is what must not offer it meanwhile.
- **Construction-fit is checked in `core/block`** (square units need a square
  region, geese need `W = 2H`) so every mismatch refuses in the same words;
  the cut formulas themselves remain `core/unit`'s alone.

## Clean-room record

Read in this context: `AGENTS.md`, `docs/implementation-plan.md`,
`docs/specification.md`, `docs/specification-fixtures.py` (read and run),
`docs/decisions.md`, `docs/verification.md`, GitHub issue #9 (read-only), and
the existing code and tests under `src/core/exact` and `src/core/unit`, plus
`package.json`, `tsconfig.json`, `biome.json`. Not opened:
`docs/research.md`, `docs/spec-research/`, `docs/observations/`, `.context/`,
and no quilt-design product or quilting web search was used. Doubts are stated
above rather than guessed at.
