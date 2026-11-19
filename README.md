# librequilt

Free and open-source quilt design software: block drawing, quilt layout, and yardage and cutting
charts.

Repository: https://github.com/508-dev/librequilt

Maintainer: caleb@508.dev

Functional specification approved on 2026-11-19 (see `genairosity.json`). Implementation has
begun: the project has a toolchain, a static build, an app shell and the exact-measurement core.
There is **no quilt editor yet**. Registration in the Genairosity hub requires maintainer
approval. No release is promised.

## Platform and stack

A web-only application in TypeScript that runs in current browsers on Windows, macOS, iPadOS,
ChromeOS and Linux ([decisions](docs/decisions.md)). It needs no server and no account: designs
and fabric photographs stay on the quilter's device, and the application makes no third-party
runtime request.

| Part | Choice |
| --- | --- |
| Language | TypeScript, strict |
| Package manager | [Bun](https://bun.com), with a committed lockfile and a seven-day minimum release age |
| Test runner | `bun test` |
| Build | [Vite](https://vite.dev), producing a static site with relative asset paths |
| Lint and format | [Biome](https://biomejs.dev) |
| Runtime dependencies | none; the built site contains only this project's own code |

## Install, build, test and run

Requires [Bun](https://bun.com) 1.4 or later and Python 3 for the project check.

```sh
bun install --frozen-lockfile      # install exactly the committed lockfile
bun run typecheck                  # tsc --noEmit
bun run lint                       # Biome lint and format check
bun test                           # unit tests
bun run build                      # static site into dist/
python3 scripts/check-project.py   # project contract check
```

To work on it:

```sh
bun run dev        # development server on http://127.0.0.1:5173
bun run preview    # serve the built dist/ on http://127.0.0.1:4173
bun run format     # apply Biome's fixes
```

`dist/` is a static site with relative asset paths, so it can be served from a site root, from
any subfolder, or from any static host with no rewrite rules. Serve it over HTTP rather than
opening the file directly: browsers refuse ES modules over `file://`, and offline support will
need a service worker, which also requires a real origin.

Exact commands and their recorded results are in [verification](docs/verification.md).

## What is implemented

- The exact-measurement core (`src/core/exact`): lengths as whole sixteenths of an inch, exact
  rational and `a + b√2` arithmetic, and the two rounding rules — a cut up to the next eighth
  inch, a purchase up to the next eighth yard. Requirements `G-01` and `G-02`.
- The cuttable-unit core (`src/core/unit`): plain squares, rectangles, strips and strip sets;
  half-square triangles two, four and eight at a time with their oversized trim variants;
  quarter-square triangles; flying geese one and four at a time; stitch-and-flip corners;
  square-in-a-square by finished outer side; each with its parent cuts, counts, yield and trim,
  and typed refusals for a curve, a set-in seam, a zero size or a length finer than a sixteenth.
  Requirements `G-03` to `G-08`.
- A minimal accessible app shell and a static build with no telemetry and no third-party request.

Everything else is planned but not written. See
[the implementation plan](docs/implementation-plan.md) for the architecture, the sequenced
tickets, which ones need a physical or human check, and the questions the specification leaves
open.

## Start here

1. Read [the charter](docs/charter.md) and [contribution process](CONTRIBUTING.md).
2. For implementation, work from the approved [specification](docs/specification.md) and
   [the implementation plan](docs/implementation-plan.md). For research, record sources in
   [research](docs/research.md).
3. Choose a bounded ticket; work manually or with any locally initiated harness.
4. Run the commands above and the checks in [verification](docs/verification.md), and report
   actual results.

## License

AGPL-3.0-or-later; see [LICENSE](LICENSE). No warranty.
