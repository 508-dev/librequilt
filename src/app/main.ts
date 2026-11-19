// librequilt -- app shell entry point.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Length, Rounding } from '../core/exact';
import './app.css';

/**
 * The shell has no quilt editor yet. It reports what the build actually
 * contains, which is how this page proves the toolchain end to end: if the
 * exact-measurement core did not bundle and run, this sentence never appears.
 *
 * Nothing here contacts the network, reads storage or records anything.
 */
function describeCore(): string {
  return [
    'The exact-measurement core is loaded.',
    `Stored measurements are whole sixteenths of an inch (${Length.SIXTEENTHS_PER_INCH} to the inch),`,
    `a cut rounds up once to the next eighth of an inch (${Rounding.EIGHTHS_PER_INCH} to the inch),`,
    'and a purchase rounds up once to the next eighth of a yard (4 1/2 inches).',
  ].join(' ');
}

function announceCore(): void {
  const status = document.getElementById('core-status');
  if (status === null) return;
  status.textContent = describeCore();
}

announceCore();
