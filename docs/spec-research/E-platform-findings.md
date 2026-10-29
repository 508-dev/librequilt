> Agent research report for librequilt, written 2026-10-28 by a locally initiated agent (GPT-6-Sol through Codex) following the brief in this folder's README. Mechanical check: 76 of 76 links resolve; 9 of 12 claim quotes found verbatim, the rest differing only in code formatting. The orchestrator reviewed it; no corrections. GitHub reports no licence for bodoni/svg; its Cargo.toml declares "Apache-2.0 OR MIT". The maintainer chose browser first while this agent was running, and it adjusted its scope. Everything marked **[proposal]** is a proposal, not an approved requirement. Corrections and the consolidated summary are in [research.md](../research.md#specification-research-2026-10-28).

# E — Platform reach, technology stack, and open file format

## Summary

- With browser-first delivery selected, a PWA can reach iPad, Mac, Windows and Chromebook from one static site; iPad installation uses the Share menu, and offline use needs a service worker [E1, E2].
- Safari/OPFS storage can be evicted; a user-visible exported project file is needed as the durable copy [E3–E5].
- User-file open/save pickers are Chromium-specific. File input, download and share flows need to work on iPad Safari [E6–E9].
- DOM-based Rust frameworks offer a clearer path to accessible controls and inline SVG than canvas-only UI toolkits, but complete-app Wasm size and iPad performance remain unmeasured [E13–E18].
- Tauri 2 is a possible later desktop wrapper; native file access helps, while printing and distribution retain platform-specific work [E19–E25].
- Permissively licensed Rust crates cover geometry, PDF, SVG, images and colour, with several browser-build questions still open [E26–E37].
- A versioned JSON, ZIP or SVG project format can stay open. Embedded photos improve portability; explicit migrations and unknown-version behavior must be specified [E40–E44].
- Static hosting needs no design server or telemetry, but HTTPS and a stable origin matter for offline installation [E45–E49].

## 1. Browser on iPad, Mac, Windows, and Chromebook in 2026

An installable web app can run through Safari on iPad and Mac and Chromium browsers on Windows, Mac, Linux, and Chromebook. On iPadOS 16.4+, MDN says installation from the Share menu works in Safari and several other browsers; an in-page `beforeinstallprompt` button is unavailable on iOS. Safari on Mac supports Add to Dock. A service worker can cache the application shell for offline use, but first load and updates need network access [E1, E2].

Browser storage is not a safe sole copy of a quilt. WebKit says Safari 17+ browser origins can receive up to 60% of device disk space, but quota is an upper bound and storage can be evicted under pressure or inactivity; `persist()` is heuristic. Separately, WebKit's Intelligent Tracking Prevention deletes Safari script-writable storage after seven days of Safari use without site interaction. Home Screen apps in standalone mode are exempt from that particular seven-day rule, but remain subject to quota and pressure. OPFS is available in Safari; it is origin-private browser storage, not a user-visible document in Files [E3, E4, E5].

The File System Access user-file picker API is not a cross-browser foundation: Chromium exposes open/save pickers, while Safari and Firefox do not support those pickers. OPFS is a different capability. A portable design can read a user-selected project or fabric photo with `<input type=file>`, then export a downloadable Blob; on iPad Safari, the user can save a PDF to Files or use the Web Share sheet where supported. Browser file association is desktop Chromium only. Apple documents AirPrint from iPad, though the exact generated-PDF workflow needs an iPad device check [E6, E7, E8, E9, E50, E51].

Pointer Events cover mouse, touch, and pen. WebKit added Apple Pencil altitude/azimuth and coalesced/predicted events in Safari 18.2, with further coordinate precision in 26.2. The editor still needs touch-sized targets and keyboard equivalents. Large photos should be decoded once, downsampled for previews, and released when unused. As a scale check, an 8000 × 6000 RGBA bitmap occupies 192 MB before copies or export buffers (checked with a Python script); `createImageBitmap` supports crop/resize options but memory behavior needs testing on real iPads [E10, E11].

## 2. Rust in the browser

| Framework | Licence and activity (`gh api`, 2026-10-28) | Browser renderer and fit |
| --- | --- | --- |
| Leptos | MIT; 21,443 stars; pushed 2026-10-28 [E12] | DOM, reactive updates; good candidate for semantic controls and inline SVG. Client-only mode needs no application server [E13]. |
| Dioxus | MIT/Apache-2.0; 39,524 stars; pushed 2026-10-27 [E12] | Web target renders DOM; desktop/mobile webview sharing may reduce UI duplication, but webview behavior still needs platform testing [E14]. |
| Yew | MIT/Apache-2.0; 32,840 stars; pushed 2026-10-25 [E12] | Browser DOM/virtual DOM; mature web-specific choice, with less built-in cross-platform ambition [E15]. |
| egui/eframe | MIT/Apache-2.0; 31,816 stars; pushed 2026-10-26 [E12] | Draws into canvas on web. Native AccessKit is supported, but web screen-reader support is experimental, so an accessible editor would need extra work [E16]. |
| Slint | GPLv3 option plus royalty-free/commercial terms; 24,302 stars; pushed 2026-10-28 [E12] | WebGL canvas, no DOM/CSS UI; its own docs say web screen readers are unavailable and advise against general-purpose web apps [E17]. GPLv3/AGPL compatibility needs maintainer/legal review; the royalty-free licence is a separate option, not presumed suitable. |

For a quilt editor, DOM-based controls inherit browser focus, text scaling and screen-reader semantics when actual HTML controls are used; custom gestures and SVG shapes still need labels, keyboard operations and focus management. An inline SVG editing surface exposes shape nodes in the DOM and can scale sharply; a canvas is pixels and needs a separate semantic interaction layer. MDN explicitly says inline SVG markup is available to the accessibility object model, while canvas needs explicit labeling. Pointer Events can drive either surface [E18, E10].

No defensible **typical complete app** Wasm sizes were established. Dioxus's documentation calls a small web build roughly 70 kB, but it does not represent this app with image/PDF/geometry crates. Leptos documentation says Wasm is generally larger than equivalent JavaScript, recommends release size optimization and compression, and notes binary splitting added in 2025. A fair comparison requires the same small prototype, release/profile settings, and compressed JS+Wasm+assets measured on each candidate; initial-load performance on iPad should be measured too [E14, E52].

## 3. Possible later desktop wrapper

Tauri 2 has been stable since 2024, is MIT/Apache-2.0, and packages an HTML/CSS/JS frontend in an OS webview with a Rust core for Windows, macOS and Linux; it also targets iOS and Android [E19, E20]. A later wrapper could add scoped native file access and offline installers, but printing still needs platform checks: Tauri's native webview print method is documented as macOS-only in `wry`, while `window.print()` is the suggested cross-platform path [E21, E22]. Linux can reuse source but needs WebKitGTK and package QA; macOS requires signing/notarization for direct distribution. Mobile stores add release work and account fees (Apple US$99 yearly; Google Play US$25 once), so a wrapper should follow a demonstrated browser need [E23–E25].

## 4. Rust libraries needed by the core

The licence column reports each **published crate version** from the crates.io API, not a legal compatibility conclusion. All listed licences are permissive candidates for this AGPL project; transitive dependency licences and notices still need review. Repository push dates came from `gh api repos/OWNER/REPO` on 2026-10-28 [E26]. “Wasm unverified” means no browser build was run or explicit upstream guarantee found.

| Area / crate | Licence; last repo push | Role and browser status |
| --- | --- | --- |
| `kurbo` | MIT OR Apache-2.0; 2026-10-08 | Bézier/path geometry, transforms; Wasm unverified [E27]. |
| `lyon` | MIT OR Apache-2.0; 2026-10-23 | Path tessellation for GPU/canvas rendering, not itself boolean polygon editing; Wasm unverified [E28]. |
| `geo` | MIT OR Apache-2.0; 2026-10-27 | Polygons, boolean operations, offsets; Wasm unverified [E29]. |
| `i_overlay` | MIT OR Apache-2.0; 2026-10-14 | Focused polygon union/intersection/difference/XOR; Wasm unverified [E30]. |
| `num-rational` | MIT OR Apache-2.0; 2026-07-07 | Exact `Ratio<T>` for eighth-inch dimensions and conversion boundaries; Wasm unverified [E31]. |
| `printpdf` | MIT; 2026-10-19 | Higher-level PDF composition, SVG/images; upstream provides a WASM32 demo [E32]. |
| `krilla` | MIT OR Apache-2.0; 2026-10-26 | Higher-level PDF drawing atop `pdf-writer`; browser build unverified [E33]. |
| `pdf-writer` | MIT OR Apache-2.0; 2026-10-27 | Low-level PDF object writer; a more manual path, Wasm unverified [E34]. |
| `svg` | Apache-2.0 OR MIT; 2025-01-09 | SVG composing/parsing; repository less recently pushed, Wasm unverified [E35]. |
| `usvg` / `resvg` | Apache-2.0 OR MIT; 2026-10-26 | SVG parsing/normalization and raster rendering; upstream explicitly states Wasm portability, with font-loading caveats [E36]. |
| `image` | MIT OR Apache-2.0; 2026-09-15 | Image decoding and resize; upstream warns default `rayon`/format features can trouble single-thread Wasm, so select only needed codecs [E37]. |
| `palette` | MIT OR Apache-2.0; 2026-09-05 | Colour conversion/manipulation; Wasm unverified [E26]. |

The geometry libraries solve different problems; none proves the full quilt math or handles arbitrary malformed geometry by itself. A small browser compile/prototype should verify target support, final binary size, import limits, colour handling and printed output before any stack commitment. The crates.io API and GitHub activity are maintenance signals, not release or security guarantees [E26–E37].

## 5. Non-Rust baseline: TypeScript

TypeScript gives direct access to DOM, SVG and browser file/share/print APIs with no Rust-to-JavaScript binding layer, a simpler static-site build, and likely quicker UI iteration for a browser-first editor. Its types are checked before runtime and erased for browser JavaScript. It would give up direct reuse of the Rust geometry/PDF crates above and Rust's single core across browser and Tauri native code; exact fractions and robust polygon operations would need independently evaluated TypeScript libraries or original code. Rust/Wasm itself cannot directly access the DOM and uses JavaScript bindings. Those are engineering trade-offs, not measured performance claims. A same-feature prototype is needed before choosing either stack [E38, E39].

## 6. Open, documented file format

Precedents show both opportunity and caution. Seamly2D's older `.val`/`.vit` formats have versioned XML schemas, but a current project-forum discussion says newer patterns use `.sm2d` and asks for a formal schema; a named extension alone does not make interchange easy. Ink/Stitch documents SVG namespaced attributes so editable vector art and craft metadata coexist. OpenRaster specifies a ZIP with `stack.xml` and image members. Krita's `.kra` is ZIP-based too, but Krita calls it an internal format that other applications mostly cannot open. JSON Schema gives schema identifiers and validation structure; the project document still needs its own explicit `formatVersion` and migration rules [E40–E44].

| Option | Design | Advantages | Costs / upgrade path |
| --- | --- | --- | --- |
| A. Single versioned JSON | One UTF-8 project document, geometry, palettes, layout, and optionally small photo data URLs | Easiest to inspect, diff and validate with JSON Schema | Embedded photos inflate file and memory; references can break. Migrate old versions through documented pure transformations, preserving a backup. |
| B. Versioned ZIP package | `manifest.json` with `formatVersion`, geometry, units and asset IDs; `assets/` with original or normalized fabric photos; optional `preview.svg` | Self-contained portable file; readable by generic ZIP tools; suited to fabric photos | ZIP parsing, bounds checking and package validation add complexity. Migrate manifest and member layout version by version, then write a new package, leaving original untouched. |
| C. SVG with project namespace | Visible quilt in SVG plus namespaced metadata for blocks, dimensions, sashing and fabrics | Opens as a useful vector image in generic viewers; follows Ink/Stitch precedent | Quilt semantics, exact fractions and photo references are awkward; generic SVG editors may strip metadata. Import old namespace revisions into an internal model and export a current SVG copy. |

For A or C, linked photos keep files small but are brittle on iPad and when sharing; embedded copies improve portability at the cost of storage. For B, embedded photos are natural, with an explicit option to omit them only if the document reports missing assets on reopen. Whichever option is chosen, the published spec should define units and exact rational encoding, asset hashes/paths, maximum import sizes, unknown-field behavior, migration from each supported version, and a user-visible refusal path for future versions. A schema validates structure; it does not by itself define behavior or compatibility [E41–E44].

## 7. Hosting and privacy

A client-only build can be published as static files on GitHub Pages or Codeberg Pages, or self-hosted from one directory over HTTPS. This does not require a design server. Service workers require a secure origin (HTTPS or localhost); opening `index.html` directly as `file://` is not a reliable PWA distribution path. Deploy under a stable origin and test subpath scope for project Pages [E45–E47].

An offline-first build caches only versioned application assets. A newly deployed service worker installs in the background and normally waits until old app tabs close before activating; an update prompt can protect an unsaved editing session. Designs and fabric photos can remain in memory, OPFS/IndexedDB and explicit user-exported files. No account, upload endpoint, analytics SDK, third-party font/image/CDN calls, crash reporter, or telemetry is needed for the stated workflow. Audit network requests and restrict them with a content security policy; the hosting provider can still observe app-page requests, so “no telemetry” should mean **the app sends no design/photo/usage data**. An explicit exported file remains necessary because browser storage can be removed [E2–E5, E48, E49].

## Candidate requirements

1. **[proposal]** On current iPad Safari and desktop Safari/Chromium, a user can launch the app after one online visit and reopen its editor with network disabled; the app reports when offline content is unavailable [E1–E5, E47].
2. **[proposal]** The app lets a user open a project and fabric photo through a standard file input and export a complete project file on iPad Safari without `showOpenFilePicker()` or `showSaveFilePicker()` [E5–E9].
3. **[proposal]** After every save, the app provides a downloadable or shareable project copy and clearly labels any browser-only autosave as recoverable but not guaranteed [E3–E5, E9].
4. **[proposal]** A user can select and edit every block with touch, pen, mouse and keyboard; controls expose accessible names, focus order and text enlargement without losing content [E10, E16–E18].
5. **[proposal]** An imported fabric photo above the configured pixel/byte limits is rejected with a clear message; accepted photos are resized for editor previews while export preserves the chosen original or normalized copy [E11, E37].
6. **[proposal]** The tool exports a PDF and SVG cutting chart locally; an iPad user can save the PDF to Files and print it through the system print flow, with physical dimensions checked on paper [E8, E22, E32–E36, E51].
7. **[proposal]** Every project document declares a format version and exact units; an older supported version is upgraded into a new copy, unknown future versions are refused without modifying the original, and a published schema/example validates each supported version [E40–E44].
8. **[proposal]** With network available, editing, saving/exporting and printing a quilt send no design, photo or usage data to any server; the distributed app includes no telemetry or third-party runtime asset request [E2, E45–E49].
9. **[proposal]** Before stack approval, the same representative block-plus-photo prototype is measured for compressed transfer size, first interactive time, peak memory and screen-reader/keyboard behavior on iPad Safari and desktop browsers [E13–E18, E37–E39].

## Open decisions for the maintainer

1. **UI and core stack:** Leptos, Dioxus and Yew use browser DOM [E12–E15]; TypeScript directly uses web APIs and may simplify iteration [E38–E39]; egui/Slint offer drawn cross-platform UI but have web accessibility constraints [E16–E18]. Compare a prototype rather than a claimed generic Wasm size.
2. **Editor surface:** inline SVG gives inspectable shape nodes and vector scaling [E18]; canvas may favor dense drawn content but needs a separate semantic layer [E16, E17]. A hybrid SVG surface with HTML controls is another option.
3. **Project format:** JSON is simple; ZIP+JSON is self-contained for fabric images; SVG+namespace is visually interoperable but metadata is fragile in generic editors [E40–E44]. Decide whether project files must be single-file portable by default.
4. **Fabric photo policy:** embed originals, embed downsampled/normalized copies, or link external photos. Embedding favors sharing and iPad reopen; links save space but can break. Set explicit size and colour handling rules [E3, E11, E37, E42, E43].

## Facts / Inferences / Unknowns

**Facts:** WebKit supports OPFS but distinguishes it from user files; Safari and Firefox lack the user-file picker API [E5, E6]. Slint's browser renderer has no screen-reader support [E17]. Tauri 2 targets five OS families and has a desktop-only print method with a macOS limitation [E19, E22].

**Inferences:** A portable exported file should be treated as the durable project copy; inline SVG plus semantic HTML may be simpler to make accessible than a canvas-only UI. These are design judgments from the cited platform behavior, not maintainer decisions.

**Unknowns:** Actual iPad Safari memory ceiling and generated-PDF print path; real Wasm bundle sizes and load time; browser builds and full transitive licences of several crates; whether an SVG project survives edits in generic vector tools; how much Linux distribution costs this project in practice.

## Evidence register

Access date for every row: **2026-10-28**. “Not checked” means documentation page terms were not assessed. Repository metadata and crate-version licence data were read directly; they are snapshots, not endorsements.

| ID | URL | Licence or terms | What it establishes | Sections |
| --- | --- | --- | --- | --- |
| E1 | https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable | not checked | iOS Share-menu installation, Safari Add to Dock, install prompt limits | 1 |
| E2 | https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation | not checked | Service worker offline cache | 1, 7 |
| E3 | https://webkit.org/blog/14403/updates-to-storage-policy/ | not checked | Safari quota, eviction, persistence heuristics | 1, 7 |
| E4 | https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/ ; https://webkit.org/tracking-prevention/ | not checked | Seven-day Safari script-storage cap and current Home Screen exemption statement | 1 |
| E5 | https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/ | not checked | Safari OPFS and user-file separation | 1 |
| E6 | https://caniuse.com/mdn-api_window_showopenfilepicker | not checked | Chromium supports picker; Safari/Firefox do not | 1 |
| E7 | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept | not checked | Standard file input for photos/project files | 1 |
| E8 | https://support.apple.com/en-gb/guide/ipad/ipade2917f90/ipados | not checked | iPad Safari PDF to Files | 1 |
| E9 | https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API | not checked | User-initiated file sharing where supported | 1 |
| E10 | https://webkit.org/blog/16301/webkit-features-in-safari-18-2/ ; https://webkit.org/blog/17640/webkit-features-for-safari-26-2/ | not checked | Pen properties and pointer coordinate improvements | 1 |
| E11 | https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap | not checked | Bitmap crop/resize capability | 1 |
| E12 | `gh api repos/leptos-rs/leptos`, `DioxusLabs/dioxus`, `yewstack/yew`, `emilk/egui`, `slint-ui/slint`; https://github.com/DioxusLabs/dioxus ; https://github.com/yewstack/yew ; https://github.com/emilk/egui ; https://github.com/slint-ui/slint/blob/master/LICENSE.md | repository licences as table | Framework stars, last push, licence | 2 |
| E13 | https://www.leptos.dev/ ; https://book.leptos.dev/getting_started/index.html | not checked | Leptos DOM and CSR | 2 |
| E14 | https://dioxuslabs.com/learn/0.7/guides/platforms/web/ ; https://dioxuslabs.com/learn/0.7/guides/platforms/ | not checked | Dioxus web DOM, claimed small-build size, platform targets | 2 |
| E15 | https://yew.rs/docs/next/advanced-topics/server-side-rendering | not checked | Yew client rendering | 2 |
| E16 | https://github.com/emilk/egui ; https://docs.rs/eframe/latest/eframe/ | MIT OR Apache-2.0 | Canvas integration and web accessibility caveat | 2 |
| E17 | https://docs.slint.dev/latest/docs/slint/guide/platforms/web/ ; https://github.com/slint-ui/slint/blob/master/LICENSE.md | GPLv3 / royalty-free / commercial alternatives | Canvas-only web renderer and licensing | 2 |
| E18 | https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_in_HTML ; https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Text_labels_and_names | not checked | Inline SVG accessibility and need to label canvas | 2 |
| E19 | https://v2.tauri.app/blog/tauri-20/ | not checked | Tauri 2 stable date, target platforms | 3 |
| E20 | https://tauri.app/concept/architecture/ ; `gh api repos/tauri-apps/tauri` | MIT OR Apache-2.0 | Webview/Rust architecture, activity, licence | 3 |
| E21 | https://v2.tauri.app/plugin/file-system/ | not checked | Native file plugin and mobile folder limits | 3 |
| E22 | https://docs.rs/tauri/latest/tauri/webview/struct.WebviewWindow.html | not checked | Tauri print API limitations | 3 |
| E23 | https://v2.tauri.app/distribute/ ; https://v2.tauri.app/start/prerequisites/ | not checked | Desktop/mobile packaging and Linux WebKitGTK prerequisites | 3 |
| E24 | https://developer.apple.com/help/account/membership/program-enrollment | not checked | Apple developer membership fee | 3 |
| E25 | https://support.google.com/googleplay/android-developer/answer/6112435 | not checked | Play Console registration fee and verification | 3 |
| E26 | Crates.io API: https://crates.io/api/v1/crates/kurbo/0.13.1 ; https://crates.io/api/v1/crates/lyon/1.0.19 ; https://crates.io/api/v1/crates/geo/0.33.1 ; https://crates.io/api/v1/crates/i_overlay/9.1.0 ; https://crates.io/api/v1/crates/num-rational/0.4.2 ; https://crates.io/api/v1/crates/printpdf/0.12.8 ; https://crates.io/api/v1/crates/krilla/0.8.2 ; https://crates.io/api/v1/crates/pdf-writer/0.15.0 ; https://crates.io/api/v1/crates/svg/0.18.0 ; https://crates.io/api/v1/crates/usvg/0.49.0 ; https://crates.io/api/v1/crates/resvg/0.49.0 ; https://crates.io/api/v1/crates/image/0.25.10 ; https://crates.io/api/v1/crates/palette/0.7.7 . Repository activity: `gh api repos/OWNER/REPO` for the corresponding repository URLs in each API response. | version-specific MIT / Apache-2.0 / MIT OR Apache-2.0 as table | Published licence, version/date; repository last push | 4 |
| E27 | https://docs.rs/kurbo/latest/kurbo/struct.BezPath.html | not checked | Path geometry | 4 |
| E28 | https://docs.rs/lyon/latest/lyon/ | not checked | Path tessellation | 4 |
| E29 | https://docs.rs/geo/latest/geo/algorithm/bool_ops/trait.BooleanOps.html | not checked | Polygon boolean operations | 4 |
| E30 | https://docs.rs/i_overlay/latest/i_overlay/core/overlay/index.html | not checked | Focused polygon overlay | 4 |
| E31 | https://docs.rs/num/latest/num/rational/struct.Ratio.html | not checked | Exact rational arithmetic API | 4 |
| E32 | https://docs.rs/crate/printpdf/0.12.8 | MIT (API) | PDF features and WASM32 demo | 4 |
| E33 | https://docs.rs/krilla/latest/krilla/ ; https://github.com/LaurenzV/krilla | MIT OR Apache-2.0 | High-level PDF over pdf-writer | 4 |
| E34 | https://docs.rs/pdf-writer/latest/pdf_writer/ | MIT OR Apache-2.0 | Low-level PDF writer | 4 |
| E35 | https://docs.rs/svg/latest/svg/ ; https://github.com/bodoni/svg | Apache-2.0 OR MIT | SVG composition/parser, older activity | 4 |
| E36 | https://github.com/linebender/resvg | Apache-2.0 OR MIT | usvg/resvg roles and explicit Wasm portability | 4 |
| E37 | https://github.com/image-rs/image | MIT OR Apache-2.0 | Image formats, resize, Wasm feature warning | 4 |
| E38 | https://www.typescriptlang.org/docs/handbook/intro.html | not checked | TypeScript static typechecking | 5 |
| E39 | https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Concepts | not checked | Wasm-to-DOM binding requirement | 5 |
| E40 | https://forum.seamly.io/t/looking-for-official-documentation-or-xml-schema-for-sm2d-files/15403 ; https://github.com/FashionFreedom/Seamly2D/issues/15 | not checked | Seamly format change and documentation gap | 6 |
| E41 | https://inkstitch.org/de/developers/inkstitch/namespace/ | not checked | SVG namespace/attribute precedent | 6 |
| E42 | https://www.openraster.org/baseline/file-layout-spec.html | not checked | ZIP/XML/image package precedent | 6 |
| E43 | https://docs.krita.org/en/general_concepts/file_formats/file_kra.html | not checked | Krita ZIP internal file precedent and limits | 6 |
| E44 | https://json-schema.org/understanding-json-schema/structuring | not checked | Schema `$id`/`$schema` identifiers | 6 |
| E45 | https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site | not checked | GitHub Pages static files | 7 |
| E46 | https://docs.codeberg.org/codeberg-pages/ | not checked | Codeberg Pages static publishing | 7 |
| E47 | https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API | not checked | HTTPS/localhost service worker requirement | 7 |
| E48 | https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers. | not checked | Service worker update lifecycle | 7 |
| E49 | https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/connect-src | not checked | Restricting scripted outbound connections | 7 |
| E50 | https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Associate_files_with_your_PWA | not checked | Desktop Chromium-only file association | 1 |
| E51 | https://support.apple.com/en-au/109349 | not checked | iPad AirPrint workflow and app caveat | 1 |
| E52 | https://book.leptos.dev/deployment/binary_size.html | not checked | Rust/Wasm size guidance and 2025 binary splitting | 2 |
