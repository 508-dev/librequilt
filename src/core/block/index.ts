// librequilt -- the block core: a measured grid of units (W-02, W-03).
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * W-02 and W-03: a square finished block built from units on a measured grid,
 * with rotation and mirroring of placed copies, and a definite answer to
 * whether the block can yield a cutting chart.
 *
 * Nothing in here knows about layouts, fabrics or charts; it computes in
 * `core/exact` and `core/unit` and never touches the DOM, the network,
 * storage or a clock (I4). Refusals a quilter can cause are values, never
 * exceptions (I5): a grid division that cannot be represented in whole
 * sixteenths, an unsupported seam (named), and a block kept as a visual draft
 * (its missing construction named) all come back as typed refusals.
 */

export * as Block from './block';
export * as Grid from './grid';
export * as Orientation from './orientation';
export * as Piece from './piece';
export * as Plan from './plan';
export * as Refusal from './refusal';
