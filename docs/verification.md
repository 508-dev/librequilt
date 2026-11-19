# Verification

## Research-stage check

```sh
python3 scripts/check-project.py
```

This validates required files and metadata. It does not judge source permissions,
research completeness, license compatibility, or specification approval authenticity.
Maintainers review the actual content before registration and implementation.

## Research deliverables

For each ticket, identify the question, sources, observations versus inference,
unknowns, and acceptance evidence. A reviewer should be able to follow the evidence.

## Implementation checks

The stack is a web-only TypeScript application, built with Bun and Vite
([decisions](decisions.md)). Requires Bun 1.4 or later and Python 3. Run every command from the
repository root; each must exit zero.

```sh
bun install --frozen-lockfile      # install exactly the committed lockfile
bun run typecheck                  # tsc --noEmit, strict
bun run lint                       # biome check . (lint and format)
bun test                           # unit tests
bun run build                      # static site into dist/
python3 scripts/check-project.py   # project contract check
```

These are the six steps `.github/workflows/ci.yml` runs, in this order, with both GitHub Actions
pinned to full commit SHAs. `bun run format` applies Biome's fixes; `bun run dev` and
`bun run preview` serve the application locally.

### Recorded results, 2026-11-19

Run on Linux 7.2.9 (Manjaro) with Bun 1.4.2, Node 22.23.3 and Python 3.14.7.

| Check | Result |
| --- | --- |
| `bun install --frozen-lockfile` | 27 installs across 85 packages, no changes; `bun.lock` unmodified |
| `bun run typecheck` | clean, no output |
| `bun run lint` | 18 files checked, no findings |
| `bun test` | 62 pass, 0 fail, 2787 assertions, 5 files |
| `bun run build` | `dist/index.html` 2.59 kB, CSS 1.40 kB, JS 0.72 kB (2.22 kB gzipped total) |
| `python3 scripts/check-project.py` | "Project structure is valid." |

Additional checks made by hand at the same revision:

- **The release-age cooldown is enforced, not merely configured.** Requesting a release four days
  old in a scratch project carrying the same `bunfig.toml` fails with
  `error: No version matching "@biomejs/biome" found for specifier "2.6.8" (blocked by
  minimum-release-age: 604800 seconds)`.
- **The build works from any folder on a static host.** `dist/` copied into
  `some/deep/sub folder/` and served over HTTP: the page returns 200 and both hashed assets
  resolve relative to that folder (200, 728 and 1403 bytes), while the same asset path at the
  server root returns 404, confirming no root-path assumption.
- **The built page requests nothing third-party.** `dist/` contains no absolute or remote URL and
  no inline script, and the page carries a `default-src 'none'` Content-Security-Policy.
- **Not verified:** opening `dist/index.html` directly from the filesystem. Browsers refuse ES
  modules over `file://`; the page renders but the script does not run. Offline support will
  require a service worker, which also needs a real origin.

### Acceptance tests

`T-01` to `T-13` in [the specification](specification.md) are the acceptance criteria. Expected
numbers come from `python3 docs/specification-fixtures.py`. Current coverage:

| Test | State |
| --- | --- |
| `T-01` | rounding and length refusals covered by `bun test`; the unit constructions are IMPL-02 and the sewn four-at-a-time check is IMPL-29 |
| `T-02` to `T-07`, `T-04a` | not started; IMPL-04 to IMPL-13 |
| `T-08` to `T-13`, `T-12` | not started; need a browser, a printer, devices or quilters — see [the implementation plan](implementation-plan.md#tickets-that-need-a-physical-or-human-check) |

### Standing requirements

Commit the dependency lock, use frozen installs in CI, and keep the package manager's seven-day
minimum release age (Bun: `minimumReleaseAge = 604800`; pnpm: `minimumReleaseAge: 10080`). Never
add model runners, telemetry, analytics or a third-party runtime request. Record each new
dependency's licence and maintenance in [decisions](decisions.md).

## Release evidence

Before declaring the scope usable, document reproducible checks, limitations, supported
platforms, source/build instructions, license notices, and a private security-reporting route.
