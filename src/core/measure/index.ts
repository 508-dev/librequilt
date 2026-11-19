// librequilt -- the readout core.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * P-01: the display spellings a chart prints -- mixed-number inches and yards,
 * and the approximate metric readouts beside them.
 *
 * Readouts only, never an editing unit: O-04 keeps metric display approximate
 * and W-07 excludes full metric editing, so nothing here reads or writes a
 * stored measurement.
 */

export * as Measure from './measure';
