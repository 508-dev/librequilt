# IMPL-09 — Inch and metric readouts

**Ticket.** IMPL-09, "Inch and metric readouts" (`docs/implementation-plan.md`).
**Implements.** P-01 (display) and O-04 (metric display). **Tests.** T-04a.
**Branch.** `impl-09-readouts` (from `main`). **Date.** 2026-11-19.

## Scope delivered

A new `src/core/measure` module, pure (I4), that is the single place a chart asks
for every display spelling:

- `Measure.inches(length)` — mixed-number inches, the G-01 spelling from `core/exact`.
- `Measure.yards(purchase)` — mixed-number yards, the G-02 spelling from `core/exact`.
- `Measure.centimetres(inches)` / `Measure.centimetresOf(length)` — centimetres to two
  decimals, converted exactly (1 inch = 127/50 cm), labelled approximate.
- `Measure.metres(purchase)` — metres to three decimals, converted exactly
  (1 yard = 1143/1250 m) from the *rounded* `EighthYards` purchase, never the raw length.
- `Measure.describeMetric(readout)` — the `≈ 0.229 m` label.

Every metric readout carries its exact unrounded rational beside the rounded text, so the
derivation stays visible and the rounded figure can never re-enter a calculation (I3). The
metric formatting is half-up rounding over exact `bigint` rationals, never a binary float
(I1). Readouts only; no editing unit, so no stored value is ever written.

## Files changed

- `src/core/measure/measure.ts` (new) — the readouts.
- `src/core/measure/index.ts` (new) — `export * as Measure`.
- `src/core/measure/measure.test.ts` (new) — T-04a and the readout invariants.

No dependency, spec, plan or README change. No stored value changed.

## Commands and results

Run from the repository root on Linux 7.2.9-1-MANJARO with Bun 1.4.2, Node v22.23.3 and
Python 3.14.7.

| Check | Result |
| --- | --- |
| `bun install --frozen-lockfile` | 27 packages installed; lockfile unchanged |
| `bun run typecheck` | clean, no output |
| `bun run lint` | 34 files checked, no findings |
| `bun test` | 136 pass, 0 fail, 3684 expect() calls, 12 files |
| `bun run build` | `dist/index.html` 2.59 kB, CSS 1.40 kB, JS 0.72 kB (0.44 kB gzipped) |
| `python3 scripts/check-project.py` | "Project structure is valid." |

## Test count

10 new tests (was 126 across 11 files, now 136 across 12 files). Coverage, each quoted from
`python3 docs/specification-fixtures.py` where a number is asserted:

- T-04a: a ¼-yard purchase is exactly 0.2286 m and shows as about 0.229 m.
- T-04a: a 3½-inch cut shows as about 8.89 cm.
- The exact centimetre value is the rational 889/100, never a float.
- Half-up rounding to two decimals, including a `.005` tie.
- Exactly two decimals for centimetres, three for metres.
- Metres convert the rounded purchase (0.1143 m for an eighth yard), never a raw length.
- Whole and mixed purchases convert exactly (0.914 m, 1.143 m).
- Computing every readout leaves the stored inches and the ¼-yard purchase untouched.

## Doubts and assumptions

None material. Two points worth noting for review, neither contradicting the specification:

1. **Approximate label glyph.** O-04 and T-04a say the metric value is "labelled approximate"
   and T-04a writes "about 0.229 m". `Measure.describeMetric` renders `≈ 0.229 m`, with the
   `approximate: true` flag as the contract and the glyph left to the chart layer to word.
2. **Centimetre input is an exact rational.** `centimetres` accepts a `Rational` number of
   inches rather than only whole sixteenths, because a raw planned length can be a fraction
   (F-03's 550/19). An irrational on-point dimension is rounded to a sixteenth first (L-04)
   before it reaches this function; that is the caller's rule, not this module's.

## Clean-room record — files read

- `AGENTS.md`
- `docs/implementation-plan.md` (Architecture, module map, IMPL-09 section, clarifications)
- `docs/specification.md` (P-01, O-04, decided questions, T-04a)
- `docs/specification-fixtures.py`
- `docs/decisions.md`
- `docs/verification.md`
- `genairosity.json`
- `package.json`, `tsconfig.json`, `biome.json`, `bunfig.toml`
- `scripts/check-project.py`
- `src/core/exact/*` (index, length, rational, integer, quadratic, rounding, and their tests)
- `src/core/unit/*` (index, plan, plain, triangles, and their tests)
- `src/app/main.ts`

Not opened: `docs/research.md`, `docs/spec-research/`, `docs/observations/`, `.context/`.
No web search and no quilt-design product was consulted.
