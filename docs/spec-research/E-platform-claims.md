> Agent research report for librequilt, written 2026-10-28 by a locally initiated agent (GPT-6-Sol through Codex) following the brief in this folder's README. Mechanical check: 76 of 76 links resolve; 9 of 12 claim quotes found verbatim, the rest differing only in code formatting. The orchestrator reviewed it; no corrections. GitHub reports no licence for bodoni/svg; its Cargo.toml declares "Apache-2.0 OR MIT". The maintainer chose browser first while this agent was running, and it adjusted its scope. Everything marked **[proposal]** is a proposal, not an approved requirement. Corrections and the consolidated summary are in [research.md](../research.md#specification-research-2026-10-28).

# E — Claims for reviewer re-check

Accessed 2026-10-28. Each quotation is an exact sentence from the linked public page; the sentence above it is the claim it supports.

1. **iPad users can install a PWA from the browser Share menu.**  
   URL: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable  
   “On iOS 16.4 and later, PWAs can be installed from the Share menu in Safari, Chrome, Edge, Firefox, and Orion.”

2. **A service worker enables an app to operate offline.**  
   URL: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation  
   “Offline operation allows a PWA to provide a good user experience even when the device does not have network connectivity.”

3. **Browser storage may be evicted even when a site has room under its quota.**  
   URL: https://webkit.org/blog/14403/updates-to-storage-policy/  
   “By default, all origins use a best-effort mode, which means their persistence is not guaranteed and their data can be evicted.”

4. **Home Screen web apps have different data-retention behavior from ordinary Safari tabs under WebKit's seven-day rule.**  
   URL: https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/  
   “Web applications added to the home screen are not part of Safari and thus have their own counter of days of use.”

5. **OPFS files are not reliably accessible as normal user documents outside the browser.**  
   URL: https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/  
   “That means a file or directory created via the File System API may not be easily retrieved from outside of the browser.”

6. **A Slint web UI cannot currently rely on screen-reader support.**  
   URL: https://docs.slint.dev/latest/docs/slint/guide/platforms/web/  
   “Accessibility features (such as screen readers) are not available.”

7. **Inline SVG can carry an accessible text description.**  
   URL: https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_in_HTML  
   “A `<title>` within an SVG provides the accessible, short-text description of the graphic.”

8. **Tauri's native webview print method has a macOS-specific implementation limit.**  
   URL: https://docs.rs/tauri/latest/tauri/webview/struct.WebviewWindow.html  
   “Currently only supported on macOS on `wry`.”

9. **Ink/Stitch documents craft-specific metadata and attributes for its SVG files.**  
   URL: https://inkstitch.org/de/developers/inkstitch/namespace/  
   “This page contains a description of all metadata tags and embroidery attributes.”

10. **The `resvg` project explicitly states WebAssembly portability.**  
    URL: https://github.com/linebender/resvg  
    “`resvg` is guaranteed to work everywhere where you can compile the Rust itself, including WASM.”

11. **OpenRaster demonstrates a documented ZIP-container image format.**  
    URL: https://www.openraster.org/baseline/file-layout-spec.html  
    “The data is stored within a Zip file wrapper.”

12. **A client-only build can be published as static files on GitHub Pages.**  
    URL: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site  
    “GitHub Pages publishes any static files that you push to your repository.”
