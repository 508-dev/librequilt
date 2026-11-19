// librequilt -- the cuttable-unit core.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * G-03 to G-08: one cuttable unit, from a finished size to its parent cuts,
 * its counts, its yield, its trim variant and its refusal when a seam
 * topology is unsupported.
 *
 * Nothing in here knows about blocks, layouts, fabric or charts; it computes
 * in `core/exact` and never touches the DOM, the network, storage or a clock
 * (I4). Refusals a quilter can cause are values, never exceptions (I5).
 */

export * as Geese from './geese';
export * as Plain from './plain';
export * as Plan from './plan';
export * as Seams from './seams';
export * as SquareInASquare from './square-in-square';
export * as Triangles from './triangles';
