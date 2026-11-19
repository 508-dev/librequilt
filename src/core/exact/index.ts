// librequilt -- the exact-measurement core.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * G-01 and G-02: exact lengths and the rounding sequence.
 *
 * Nothing in here touches the DOM, the network, storage or a clock, so all of
 * it is unit-testable without a browser. Every other module that computes a
 * measurement is expected to build on these types rather than on `number`
 * arithmetic.
 */

export * as Integer from './integer';
export * as Length from './length';
export * as Exact from './quadratic';
export * as Rational from './rational';
export * as Rounding from './rounding';
