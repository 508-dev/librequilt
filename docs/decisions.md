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
WebAssembly remains the preference where it fits.
