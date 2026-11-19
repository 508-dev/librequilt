# IMPL-06 verification — Fabric identity and photo calibration

Implements `F-01` in `core/fabric`, the pure half of `T-06`. Branch
`impl-06-fabric-calibration`, from `main`.

## What was added

- `src/core/fabric/scale.ts` — the exact pixels-per-inch arithmetic. Both of
  `F-01`'s calibration routes (`calibrateByMarkedPoints` and
  `calibrateByRepeat`) reduce to one exact rational `pixel span / (inches / 16)`;
  the result is never a float (I1). `pixelsAtPhysicalScale` turns a stored
  sixteenth length into the exact image-pixel span a photo shows at that scale.
- `src/core/fabric/fabric.ts` — fabric identity: a named solid colour or a photo
  with a retained scale and motif offset; the default 40-inch usable width;
  `withOffset` (a motif change leaves scale and usable width, hence every cut and
  yardage, untouched); and the fabric-level `missing-photo` refusal for either
  calibration route on a solid fabric.
- `src/core/fabric/index.ts` — the module's public surface.
- `src/core/fabric/scale.test.ts`, `src/core/fabric/fabric.test.ts` — the tests.

No new dependencies. No image decoding, no browser API (I4): the photo is a pair
of whole-pixel counts.

## Commands and recorded results

Run on Linux 7.2.9 (Manjaro) with Bun 1.4.2, Node 22.23.3 and Python 3.14.7.

| Check | Result |
| --- | --- |
| `bun install --frozen-lockfile` | 27 packages installed, `bun.lock` unmodified |
| `bun run typecheck` | clean, no output |
| `bun run lint` | 36 files checked, no findings |
| `bun test` | 145 pass, 0 fail, 3699 assertions, 13 files |
| `bun run build` | `dist/index.html` 2.59 kB, CSS 1.40 kB, JS 0.72 kB |
| `python3 scripts/check-project.py` | "Project structure is valid." |

`bun run format` was applied to bring the new files into Biome's form.

## Coverage of the acceptance points

- **`T-06` pure numbers.** A 600 × 400-pixel image of a 6 × 4-inch repeat gives
  100 pixels per inch by either route (`600/6` and `400/4` both 100), and by the
  marked-points route (300 pixels apart, entered 3 inches). A 2-inch finished
  square spans 200 image pixels. Every expected value is quoted from
  `python3 docs/specification-fixtures.py` ("photo scale from repeat: 100
  pixels/in; from ruler: 100 pixels/in; 2-in span: 200 pixels").
- **Offset.** `withOffset` changes the photo's motif offset and provably leaves
  the scale and usable width identical, which is the only thing cut and yardage
  arithmetic can read; there is a test asserting the scale and usable width are
  unchanged.
- **Refusals, as returned values (I5).** Zero pixel distance (`zero-distance`),
  a nonpositive repeat (`nonpositive-repeat`), a missing photo
  (`missing-photo`), and the defensive non-whole/negative/out-of-range cases.

## Notes and doubts

- **Marked-point distance is a scalar.** `calibrateByMarkedPoints` takes the
  pixel distance as a whole number of pixels rather than two point coordinates.
  The two-points-to-distance measurement is browser geometry (IMPL-21); a
  diagonal pair of points has an irrational Euclidean length that cannot be an
  exact rational scale, so the pure core accepts the measured scalar span.
- **Repeat width and height are independent.** `calibrateByRepeat` is one
  dimension; a width and a height are entered by calling it for each. It does
  not cross-check that the two give the same scale (the specification does not
  say what a mismatch means). For a square-pixel photo they agree.
- **Offset units are whole image pixels.** The specification says "repeat
  offset" without units; this module stores an `{ x, y }` whole-pixel offset,
  negative allowed, and the screen tiling in IMPL-22 will consume it.
- **DPI metadata.** "Image DPI metadata alone is not a physical calibration"
  holds by construction here: the pure core has no DPI input at all, and the
  rule against trusting DPI is enforced where an image is actually decoded
  (IMPL-21).
- The provisional 1000-inch stored-length bound of `core/exact` (clarification
  Q-08) applies to the entered physical spans here, since they are sixteenths.

## Files read (clean-room record)

`AGENTS.md`, `README.md`, `CONTRIBUTING.md`, `genairosity.json`,
`docs/implementation-plan.md`, `docs/specification.md`,
`docs/specification-fixtures.py`, `docs/decisions.md`, `docs/verification.md`,
`package.json`, `tsconfig.json`, `biome.json`, `vite.config.ts`,
`scripts/check-project.py`, `src/app/main.ts`, `src/core/exact/*`
(integer, length, quadratic, rational, rounding and their tests),
`src/core/unit/*` (index, plan, plain, triangles, geese, square-in-square,
seams and their tests). GitHub issue #12 (read, not written).
