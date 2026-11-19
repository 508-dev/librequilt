// librequilt -- static build configuration.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { defineConfig, type Plugin } from 'vite';

/**
 * X-01 requires no runtime third-party request and nothing sent off the
 * device. This policy is the enforcement, not just the intent: with
 * `default-src 'none'` the page can reach nothing the build did not ship.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join('; ');

/**
 * Put the policy in the built page.
 *
 * A static host cannot be relied on to send the header, and the project has to
 * work from any folder on any static host, so the meta element travels with
 * the page. A host that also sends the header is welcome to; the stricter of
 * the two applies.
 */
function contentSecurityPolicy(): Plugin {
  return {
    name: 'librequilt:content-security-policy',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return {
          html,
          tags: [
            {
              tag: 'meta',
              attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY },
              injectTo: 'head-prepend',
            },
          ],
        };
      },
    },
  };
}

export default defineConfig({
  // Relative asset URLs, so `dist/` works from a site root, from any
  // subfolder, and from a plain static host with no rewrite rules.
  base: './',
  build: {
    target: 'es2022',
    sourcemap: true,
    // The polyfill is injected as an inline script, which the policy above
    // refuses. Every browser the specification targets (O-09) supports
    // modulepreload natively.
    modulePreload: { polyfill: false },
  },
  server: { host: '127.0.0.1', port: 5173 },
  preview: { host: '127.0.0.1', port: 4173 },
  plugins: [contentSecurityPolicy()],
});
