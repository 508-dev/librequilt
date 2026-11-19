// librequilt -- the layout core: straight-set geometry, sashing, borders and
// the piece demand list.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * L-01 to L-05: positions, sashing, cornerstones, borders, on-point setting
 * and setting triangles; finished sizes and every actual piece the top needs.
 * This module produces piece demands, not fabric plans (`core/plan` plans
 * strips and yardage from them).
 *
 * IMPL-04 delivers the straight setting (L-01 to L-03); on-point (L-04,
 * L-05) arrives with IMPL-05. Nothing in here touches the DOM, the network,
 * storage or a clock (I4); refusals a quilter can cause are values, never
 * exceptions (I5); and every measurement is a whole sixteenth of an inch
 * (G-01, I1) cut with `core/unit`'s single rounding (G-02, I2).
 */

export * as Border from './border';
export * as Demand from './demand';
export * as Grid from './grid';
export * as OnPoint from './on-point';
export * as Plan from './plan';
export * as Refusal from './refusal';
export * as Sashing from './sashing';
