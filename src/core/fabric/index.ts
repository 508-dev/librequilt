// librequilt -- the fabric core.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * F-01: fabric identity -- a named solid colour or a photo with a retained
 * pixels-per-inch scale and repeat offset -- and the arithmetic that gives a
 * photo its physical scale.
 *
 * Nothing in here decodes an image or touches the DOM, the network, storage or
 * a clock (I4); the photo is a count of pixels, which is all the calibration
 * and tiling arithmetic reads. Refusals a quilter can cause are values, never
 * exceptions (I5).
 */

export * as Fabric from './fabric';
export * as Scale from './scale';
