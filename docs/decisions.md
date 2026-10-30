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
