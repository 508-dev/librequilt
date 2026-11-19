# IMPL-04 verification — straight layout geometry

Branch `impl-04-straight-layout`, 2026-11-19. Run on Linux 7.2.9 (Manjaro) with Bun
1.4.2 and Python 3.14.7, from the repository root.

## Commands and actual results

| Check | Result |
| --- | --- |
| `bun install --frozen-lockfile` | "Checked 27 installs across 85 packages (no changes)"; `bun.lock` unmodified |
| `bun run typecheck` | clean, no output |
| `bun run lint` | 55 files checked, no findings |
| `bun test` | 235 pass, 0 fail, 4722 assertions, 21 files (39 pass, 154 assertions, 5 files in `src/core/layout`; 196 pass, 4568 assertions from IMPL-01 to IMPL-03 unchanged) |
| `bun run build` | `dist/index.html` 2.59 kB, CSS 1.40 kB, JS 0.72 kB (2.22 kB gzipped total) |
| `python3 scripts/check-project.py` | "Project structure is valid. Maintainer review of substance and licensing is still required." |

Expected values in the tests are quoted from `python3 docs/specification-fixtures.py`
with the fixture line named in each test comment.

## What the tests cover

Every T-02 value, as the plan's IMPL-04 verification method requires:

1. **30 × 44 inches before the border and 38 × 52 finished** (`plan.test.ts`,
   fixtures LAYOUTS "sampler: 30 x 44 inner; 38 x 52 finished"). The interior is
   L-01's `C·B + (C−1+o)S` by `R·B + (R−1+o)S`; the 4-inch border grows it per L-03.
2. **17 sash rectangles cut 2½ × 12½ and 12 cornerstones cut 2½ square**
   (`sashing.test.ts`, `plan.test.ts`, fixtures LAYOUTS "sampler: 17 sash
   rectangles; 12 cornerstones"). The 17 are L-02's `R(C+1)+C(R+1)` individual
   rectangles, split 9 vertical + 8 horizontal in the plan's run counts; the
   cornerstones are `(R+1)(C+1)`, cut 2½ square via G-03's rectangle rule.
3. **Borders two 4½ × 44½ then two 4½ × 38½** (`border.test.ts`, `plan.test.ts`,
   fixtures LAYOUTS "sampler border: sides 4 1/2 x 44 1/2; top/bottom 4 1/2 x
   38 1/2"). L-03's sides-first order is the order of the plan and of the demand
   list ("then"), and the `sides-first` statement the chart reads is asserted.
4. **26 × 40 without outer sashing or border** (`grid.test.ts`, `plan.test.ts`,
   fixtures LAYOUTS "sampler without outer sashing or border: 26 x 40 in"), the
   `o = 0` side of L-01's formula.
5. **Without cornerstones: nine 2½ × 12½ vertical sashes and four 2½ × 30½
   horizontal ones** (`sashing.test.ts`, `plan.test.ts`, fixtures "sampler without
   cornerstones: 9 vertical sashes 2 1/2 x 12 1/2; 4 horizontal sashes 2 1/2 x 30
   1/2"). The short vertical sashes join the blocks within each row including the
   row ends; the long horizontal sashes run the full 30-inch finished width
   (cut 30½) between rows and at top and bottom. T-02's "the 30 × 44-inch finished
   size stays; cornerstone count becomes zero" is asserted the same way.

Also covered: L-01's "a cornerstone replaces an equal-size sash intersection, so
it adds no length" and "plain positions keep the same block dimensions"; T-02's
"different block identities do not change these totals" (two placed copies, one
rotated and mirrored, one plain position, versus all plain); W-04's block
accounting (one demand per actual position, plain positions listed and demanding
nothing, copies keeping their own orientation); multiple borders folding L-03 in
application order; the O-12 statements (`individual-rectangles`/`continuous`,
`vertical-first`, `sides-first`); G-01's absent sash or border (omitted sashing
contributes zero, a zero border width is absent); and the refusals a quilter can
cause (I5): bad row/column counts, a zero block, T-01's 3.01-inch entry at layout
scale, a zero sash width, an interior past the stored range refused rather than
clamped, positions outside the grid or twice listed or fractional, and a placed
block that is not the layout's equal finished size — each with a sentence a
quilter can act on (A-01).

## Interpretations and limitations

- **One finished block side and one finished sash width.** L-01 writes `Bₓ/Bᵧ`
  and `Sₓ/Sᵧ`, but W-04 sets "equal finished-size square blocks" and "equal-size
  cornerstones", and L-02 gives "the selected finished sash width" (singular).
  The implementation takes one square block side and one sash width
  (`Sₓ = Sᵧ`), which is everything T-02 exercises. Unequal sash widths per axis
  are not offered; if they are wanted, L-01's formula takes them directly and
  the cornerstone becomes the `Sₓ × Sᵧ` intersection it replaces. Recorded here
  rather than guessed at either way.
- **L-02's counts are written with L-01's `o`.** The stated `R(C+1)+C(R+1)` and
  `(R+1)(C+1)` cover "between-and-around sashing"; the implementation uses
  `R(C−1+oₓ)+C(R−1+oᵧ)` and `(R−1+oᵧ)(C−1+oₓ)`, which reproduces those formulas
  at `o = 2` and drops the outer strips at `o = 0` (where T-02 checks the sizes
  but not the counts). The continuous scheme likewise: `R(C−1+oₓ)` short
  vertical sashes and `R−1+oᵧ` long horizontal sashes.
- **`vertical-first` is construction order.** O-12 pairs it with the border's
  `sides-first`, and `docs/decisions.md` records "Construction order: side
  borders first; short vertical sashes, long horizontal ones". The continuous
  sash plan therefore keeps the short vertical run first, the demand list orders
  vertical before horizontal, and the statement is emitted only for the
  continuous scheme (there are no continuous junctions with cornerstones).
- **The demand list merges identical sash rectangles and keeps border runs
  apart.** L-02 counts "individual sash rectangles" as one number (T-02's 17,
  even though 9 are vertical and 8 horizontal), so equal-cut sashes merge into
  one demand carrying its per-run split for the chart's labels. Border runs
  never merge: the chart must say which were sewn first (L-03, O-12).
- **T-02's "a 44½-inch border cannot appear as a single subcut across 40-inch
  usable fabric width" is not tested here.** Usable width is a fabric property
  (F-01, F-02) and fabric planning is `core/plan` (IMPL-07); `core/layout`
  demands the honest 4½ × 44½ piece and assumes no bolt width. The joined-strip
  default and lengthwise alternative of O-15 are IMPL-07's, as L-03 states. The
  undo half of T-02 is W-08's document commands (IMPL-11), per the ticket.
- **Blocks are demanded per position; their unit cuts are not planned here.**
  The chart (IMPL-10) expands each block demand through `core/block`'s
  `planBlock`. A block kept as a visual draft therefore does not refuse the
  layout plan: its finished size is still geometry, and its missing construction
  is reported where the chart withholds its yardage (P-03, `core/block`).
- **A zero border width is an absent border** (G-01: "Zero is valid only for an
  absent optional sash or border") and is dropped, not cut as a zero-width
  strip. A present sashing must name a width above zero; absent sashing is
  omitted from the input.

## Clean-room record

Read in this context: `AGENTS.md`, `docs/implementation-plan.md` (Architecture
and IMPL-04, plus Clarifications needed), `docs/specification.md` (approved at
`b358fef4ed8c3a0c3c0a9a0419ab408ab3831d8c`; L-01 to L-03, W-04, O-12, T-02),
`docs/specification-fixtures.py` (read and run), `docs/decisions.md`,
`docs/verification.md`, `docs/verification/IMPL-03.md`, `README.md`,
`CONTRIBUTING.md`, `docs/charter.md`, `genairosity.json`, GitHub issue #10
(read-only), and the existing code and tests under `src/core/exact`,
`src/core/unit` and `src/core/block`, plus `package.json`, `tsconfig.json`,
`biome.json`. Not opened: `docs/research.md`, `docs/spec-research/`,
`docs/observations/`, `.context/`; no quilt-design product was consulted and no
quilting web search was made. Doubts are stated above rather than guessed at.
