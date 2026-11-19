# Project decisions

The initial baseline is stack-neutral and in research. New project code defaults to
AGPL-3.0-or-later. Any different FOSS license needs a linked maintainer decision in
metadata, a matching license text, and preservation of inherited notices.

Record dated decisions here as scope, stack, platforms, dependencies, and architecture
become clear. Include evidence, owner, tradeoffs, and consequences. Do not substitute
this file for the hub's canonical membership or project status.

## 2026-10-28: Browser first

**Decision.** librequilt is a browser application first. Decided by the maintainer
(caleb@508.dev) in a local session; recorded by the session's agent.

**Evidence.** The surveyed audience designs on Windows and macOS computers and,
increasingly, iPads, not on Linux or Android ([research](research.md), sections 1, 5 and 9).
The incumbent's weaknesses are price, its learning curve, and being desktop-only. Its competitors
with the widest reach run in a browser or on an iPad.

**Tradeoffs.** This departs from the hub's general preference for Linux-first desktop and
Android-first mobile. Linux users are still served, through any current browser. It also
leaves the design subject to browser limits on file access, storage and printing, which
the specification must address.

**Consequences.** The specification targets current browsers on Windows, macOS, iPadOS,
ChromeOS and Linux, with offline use and no server. A desktop wrapper is a possible later
addition, not part of the first version. The stack is still open; Rust compiled to
WebAssembly remains the preference where it fits. (Superseded 2026-10-30: TypeScript; see below.)

## 2026-10-30: Stack is TypeScript, web only

**Decision.** librequilt is a web-only application written in TypeScript. Decided by the
maintainer in the specification-research decisions table ([research](research.md), commit
3c6d46f); recorded by an agent.

**Evidence.** The hub's devkit 0.1.1 makes web-only software a fully valid choice and Rust
preferred but not mandatory, including for web projects; another language needs no policy
exception. Track E ([platform research](spec-research/E-platform-findings.md), sections 2 and
5) found that TypeScript uses the browser's APIs directly. Those are the APIs this tool leans
on: file input, downloads and the share sheet on iPad, printing, and an SVG editing surface
with HTML controls. A TypeScript build also avoids a WebAssembly boundary and bundle. The
geometry and arithmetic are small and exact in integer sixteenths of an inch.

**Tradeoffs.** This gives up the hub's general preference for Rust and the stronger typing and
performance a Rust core could bring. The comparison of prototypes that the research recommended
was not run. Performance on iPads has not been measured either way, and the specification
needs targets that a prototype can check.

**Consequences.** The project adopts devkit 0.1.1's wording in AGENTS.md. Dependencies are
locked, with frozen installs and a seven-day minimum release age ([verification](verification.md)).
A desktop wrapper remains a possible later addition.

## 2026-10-30: Scope and calculation choices for the specification

Decided by the maintainer in the same table, which holds the options and evidence for each:
foundation paper piecing excluded from the first version, with "the quilter marks sections and
order, the tool prints" as the first addition; on-point setting included; medallion, row, mitered
and pieced-border layouts deferred; about 40 straight-seam blocks without set-in seams from
pre-1931 sources; inches with metric totals and A4 printing, full metric editing later; fabric
photo scale set by a ruler in the photo or a typed repeat size; WCAG 2.2 AA with 44-pixel touch
targets as the design goal; 40-inch default usable fabric width, changeable; yardage rounded up
to 1/8 yard; no bed-size presets in the first version; greedy strip cutting plans; an SVG editing
surface with HTML controls; and a single ZIP project file holding versioned JSON and embedded
fabric photos.

## 2026-11-19: Open questions in the specification draft

**Decision.** The maintainer approved every recommendation in the specification draft's
question table (O-01 to O-16); recorded by an agent. In brief:
- **Defaults, all editable:** binding join allowance 10 inches and strips 2½ inches; backing
  overhang 4 inches and batting 3 inches; waste and shrinkage zero; tiled-template overlap ½ inch.
- **Backing:** lengthwise and turned plans are shown side by side and the quilter chooses.
- **Metric:** shown to two decimals in centimetres and three in metres, labelled approximate.
- **Four-at-a-time half-square triangles:** offered only if a sewn test validates the corrected
  formula.
- **Block library:** only blocks matched to a pre-1931 illustration, fewer rather than guessed.
- **Fabric photos:** normalized copies of at most 24 megapixels.
- **Browsers:** the latest and previous stable Safari, Chromium-based and Firefox releases.
- **Performance:** the specification's performance targets are adopted, revisable after an
  iPad prototype.
- **On-point sashing:** a proof quilt is sewn and measured before the tool claims the outer size.
- **Construction order:** side borders first; short vertical sashes, long horizontal ones.
- **Project file:** a `.lqzip` file with an integer format version.
- **Long pieces:** joined width-of-fabric strips by default, a lengthwise cut offered;
  same-width pieces of one fabric share strips.
- **Undo and redo:** included.

**Set in review.** The backing join seam allowance had no recommendation; the specification
sets ½ inch, editable, without a cited source. The extension `.lqzip` is the example the
draft named for "a distinctive extension".

**Thresholds.** The maintainer also accepted, as written, the print-scale tolerance in T-08
(1/32 inch or 1 mm) and the usability pass mark in T-11 (at least 4 of 5 or 6 of 8 quilters
unaided, every printed square within tolerance, no severe blocker).

**Not decided here.** The specification itself is not approved until the maintainer approves an
exact commit and it is recorded in `genairosity.json`.

## 2026-11-19: Specification approved

The maintainer (GitHub `komali2`, caleb@508.dev) approved the functional specification in
[a comment on PR 3](https://github.com/508-dev/librequilt/pull/3#issuecomment-7002479585), posted
after that PR's last commit, `b358fef4ed8c3a0c3c0a9a0419ab408ab3831d8c`, and merged it with a
merge commit that keeps that commit in `main`. Recorded by an agent in
`genairosity.json.specificationApproval`. Implementation starts in a separate context from that
revision of `docs/specification.md`; material changes to it need fresh approval.

## 2026-11-19: Implementation toolchain

**Decision.** The implementation skeleton uses Bun as package manager and test runner, Vite for
the static build, TypeScript in strict mode, and Biome for lint and format. Chosen by the
implementation agent in the first implementation context, within the stack already decided on
2026-10-30 (TypeScript, web only); recorded here for maintainer review. Four development
dependencies, no runtime dependency.

**Package manager: Bun.** Its `bunfig.toml` takes `[install] minimumReleaseAge = 604800`, the
seven-day cooldown [verification](verification.md) requires, and it was verified to enforce it
rather than merely accept it: requesting a four-day-old release fails with
`blocked by minimum-release-age: 604800 seconds`. The lockfile `bun.lock` is committed and is
plain text, so a reviewer can read a dependency change in a diff; CI installs with
`bun install --frozen-lockfile`. `exact = true` keeps a caret out of the manifest, so the
installed version is the recorded one.

*Tradeoff against pnpm.* pnpm would do the same job with `minimumReleaseAge: 10080` and is the
more widely deployed tool. Bun was chosen because it is also the test runner and the TypeScript
runtime, which removes two dependencies and one transform configuration. The cost is that one
young tool now sits under both installing and testing. It is contained: the lockfile is portable,
nothing in `src` depends on a Bun API, and the release artifact is built by Vite, not by Bun, so
moving to pnpm later would touch configuration and CI only.

**Test runner: `bun test`.** Built in, so no dependency; runs TypeScript directly; Jest-compatible
`expect`. It gives the pure core no DOM, which is what enforces the architecture's rule that
`core/`, `draw/` and `file/` never reach for a browser. Browser-bound tests are a separate runner,
deferred to its own ticket, which matches the pure/browser-bound split in
[the implementation plan](implementation-plan.md).

**Build tool: Vite.** `base: './'` emits relative asset URLs, so `dist/` runs from a site root,
from any subfolder and from a static host with no rewrite rules; this was verified by serving the
build from a nested path containing a space. Vite also provides the development server the SVG
editing surface will need, and content-addressed asset names the service worker will precache.
`modulePreload.polyfill` is off because the polyfill is an inline script, which the project's
Content-Security-Policy refuses.

*Tradeoff against building with Bun.* `bun build` would remove a dependency. Vite was chosen
because the relative-base guarantee is documented and stable, because the release artifact should
not depend on the same young toolchain as the package manager, and because its ecosystem is the
better-maintained option for a project that will later need offline precaching. The cost is a
larger development dependency tree: 26 installed packages rather than none.

*A limit worth stating.* Relative paths make the build work from any folder on a static **host**.
Opening `dist/index.html` directly from the filesystem will not run the application, because
browsers refuse ES modules over `file://`. This is a browser security rule, not a build setting,
and it is moot for the finished product: `X-01`'s offline requirement needs a service worker,
which also requires a real origin.

**Lint and format: Biome.** One dependency replaces ESLint and Prettier, covers TypeScript, CSS
and JSON, and formats and lints in one command. `bun run lint` is the check and
`bun run format` writes. *Tradeoff:* a smaller rule ecosystem than ESLint. Nothing the project
needs today is missing.

**Typecheck: TypeScript 7, strict.** `strict` plus `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `noImplicitReturns`, `noUnusedLocals`, `noUnusedParameters`,
`noPropertyAccessFromIndexSignature`, `verbatimModuleSyntax` and `erasableSyntaxOnly`. The last
keeps the source free of syntax that needs a transform beyond type erasure, so Bun and Vite agree
on what the code means. *Tradeoff:* TypeScript 7 is the native compiler and newer than the 6.x
line; it was verified to typecheck this project cleanly, and reverting is a version change in one
file.

**Licences.** Every installed package is compatible with AGPL-3.0-or-later, and every one is a
development dependency: the built site contains only this project's own code, so none of them is
distributed.

| Direct dependency | Version | Licence | Maintained |
| --- | --- | --- | --- |
| `@biomejs/biome` | 2.6.6 | MIT OR Apache-2.0 | yes; 2.6.x released through November 2026 |
| `@types/bun` | 1.4.4 | MIT | yes; tracks Bun releases |
| `typescript` | 7.0.2 | Apache-2.0 | yes; Microsoft |
| `vite` | 8.3.7 | MIT | yes; 8.3.x released through November 2026 |

The full installed set is 26 packages: 15 MIT, 3 MIT OR Apache-2.0, 3 Apache-2.0, 3 MPL-2.0
(`lightningcss`, Vite's CSS transformer, and its two platform binaries), 1 ISC (`picocolors`) and
1 BSD-3-Clause (`source-map-js`). All are permissive or, for MPL-2.0, explicitly compatible with
the GNU licences through its secondary-licence clause; none ships in the output.

**Deferred.** The ZIP, PDF, browser-test and accessibility-audit libraries are chosen at the
tickets that need them, with their licences recorded then. The candidates and the current leaning
are in [the implementation plan](implementation-plan.md#dependencies-chosen-and-deferred). No
font is downloaded at runtime.

**Consequences.** `docs/verification.md` now lists executable commands. CI runs the frozen
install, typecheck, lint, tests, build and `scripts/check-project.py`, with both GitHub Actions
pinned to full commit SHAs. The skeleton adds no telemetry, analytics, third-party runtime
request or model runner, and the built page carries a `default-src 'none'`
Content-Security-Policy as the enforcement behind that.

## 2026-11-19: Specification revision 2 and ticket tracking

**Decision.** The maintainer approved resolving the specification gaps raised by the first
implementation work, and asked for the implementation tickets to be tracked as GitHub issues.
Specification revision 2 folds in the provisional answers to Q-01 to Q-10 from
`docs/implementation-plan.md`, the trim-size readings from IMPL-02, and the cutting sequences for
eight-at-a-time half-square triangles and no-waste flying geese. It changes no scope. Because the
approval in `genairosity.json` names an exact commit, the revised specification needs the
maintainer's approval of its new commit before the record is updated.

**Tracking.** Issues #7 to #39 correspond to IMPL-01 to IMPL-33, created from the plan with the
repository's work-ticket fields; #7 and #8 are closed as done by PRs 5 and 6. The eight tickets
that need a person, real device, printer or sewing carry the `needs human` label. Each ticket now
records its verification in `docs/verification/IMPL-NN.md`, so parallel tickets do not edit the
same table.
