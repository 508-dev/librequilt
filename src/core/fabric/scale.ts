// librequilt -- F-01, photo calibration: the arithmetic that gives a photo a
// physical scale, in pixels per inch.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import type { Rational } from '../exact/rational';
import * as Q from '../exact/rational';

/**
 * Pixels per inch, exact.
 *
 * F-01's two calibration routes both end at the same number: the physical
 * scale of a photo. It is kept as an exact rational so a photo's scale never
 * becomes a binary floating-point value (I1) and serialises exactly in the
 * manifest (D-01). A pixel span times a sixteenth length stays exact too:
 * `(pixels / inch) * (sixteenths / 16)` is a rational in the same field.
 */
export type PixelsPerInch = Rational;

/** Sixteenths of an inch in one inch, as an integer for the exact ratio. */
const SIXTEEN = 16n;

/**
 * Why a photo cannot be given a physical scale. F-01 names three of these --
 * a missing photo (added at the fabric level), a zero-point distance and a
 * nonpositive repeat -- and each is a returned value, never a thrown error
 * (I5), because a quilter can cause any of them.
 */
export type CalibrationRefusal =
  | { readonly kind: 'zero-distance' }
  | { readonly kind: 'nonpositive-repeat'; readonly value: number }
  | { readonly kind: 'negative'; readonly value: number }
  | { readonly kind: 'not-a-whole-pixel-count'; readonly value: number }
  | { readonly kind: 'not-a-whole-sixteenth'; readonly value: number }
  | { readonly kind: 'out-of-range'; readonly maximumInches: number };

/** The outcome of a calibration: an exact scale, or a typed refusal. */
export type CalibrationResult =
  | { readonly ok: true; readonly value: PixelsPerInch }
  | { readonly ok: false; readonly refusal: CalibrationRefusal };

/** The exact pixels-per-inch ratio: `pixelSpan / (inches / 16)`. */
function ratio(pixelSpan: number, inchesSixteenths: number): PixelsPerInch {
  return Q.rational(BigInt(pixelSpan) * SIXTEEN, BigInt(inchesSixteenths));
}

/** A whole-pixel span, with the route's own refusal for a zero one. */
function readPixelSpan(
  value: number,
  zeroRefusal: 'zero-distance' | 'nonpositive-repeat',
):
  | { readonly ok: true; readonly value: number }
  | { readonly ok: false; readonly refusal: CalibrationRefusal } {
  if (!Number.isSafeInteger(value)) {
    return refused({ kind: 'not-a-whole-pixel-count', value });
  }
  if (value < 0) return refused({ kind: 'negative', value });
  if (value === 0) {
    return zeroRefusal === 'zero-distance'
      ? refused({ kind: 'zero-distance' })
      : refused({ kind: 'nonpositive-repeat', value });
  }
  return ok(value);
}

/** A positive physical span, as whole sixteenths of an inch. */
function readInchSpan(
  value: number,
):
  | { readonly ok: true; readonly value: Sixteenths }
  | { readonly ok: false; readonly refusal: CalibrationRefusal } {
  if (!Number.isInteger(value)) return refused({ kind: 'not-a-whole-sixteenth', value });
  if (value < 0) return refused({ kind: 'negative', value });
  if (value === 0) return refused({ kind: 'nonpositive-repeat', value });
  if (value > L.MAX_LENGTH_SIXTEENTHS) {
    return refused({
      kind: 'out-of-range',
      maximumInches: L.MAX_LENGTH_SIXTEENTHS / L.SIXTEENTHS_PER_INCH,
    });
  }
  return ok(L.sixteenths(value));
}

/**
 * F-01, route one: two marked points a known physical distance apart.
 *
 * `pixelDistance` is the straight-line distance in whole pixels between the two
 * marked points; `enteredInches` is the known physical distance as a whole
 * number of sixteenths. A pair of points in the same place -- a zero pixel
 * distance -- is refused, because it yields no scale.
 */
export function calibrateByMarkedPoints(
  pixelDistance: number,
  enteredInches: number,
): CalibrationResult {
  const distance = readPixelSpan(pixelDistance, 'zero-distance');
  if (!distance.ok) return distance;
  const inches = readInchSpan(enteredInches);
  if (!inches.ok) return inches;
  return ok(ratio(distance.value, L.toSixteenthCount(inches.value)));
}

/**
 * F-01, route two: the real-world size of a photographed repeat.
 *
 * `cropPixels` is the repeat's extent in whole pixels along the measured
 * dimension (for a 600 by 400-pixel image of a 6 by 4-inch repeat, 600 and 6,
 * or 400 and 4, both give 100); `repeatInches` is its real-world extent as
 * whole sixteenths. A nonpositive repeat is refused.
 */
export function calibrateByRepeat(cropPixels: number, repeatInches: number): CalibrationResult {
  const crop = readPixelSpan(cropPixels, 'nonpositive-repeat');
  if (!crop.ok) return crop;
  const inches = readInchSpan(repeatInches);
  if (!inches.ok) return inches;
  return ok(ratio(crop.value, L.toSixteenthCount(inches.value)));
}

/**
 * The number of image pixels a physical length spans at a given scale.
 *
 * Exact: `scale * lengthInches`. The result is a rational; a screen rounds it
 * to a whole pixel for drawing, and that display value never re-enters a cut
 * or a yardage calculation (I3), which is exactly why changing a motif offset
 * cannot change a cut or a yardage.
 */
export function pixelsAtPhysicalScale(scale: PixelsPerInch, length: Sixteenths): Rational {
  return Q.multiply(scale, L.toRational(length));
}

/** A successful result. */
function ok<T>(value: T): { readonly ok: true; readonly value: T } {
  return { ok: true, value };
}

/** A refused result, as a value (I5). */
function refused(refusal: CalibrationRefusal): {
  readonly ok: false;
  readonly refusal: CalibrationRefusal;
} {
  return { ok: false, refusal };
}

/** A sentence a quilter can act on (A-01 requires understandable errors). */
export function describeCalibrationRefusal(refusal: CalibrationRefusal): string {
  switch (refusal.kind) {
    case 'zero-distance':
      return 'The two marked points are in the same place. Mark two points a known distance apart, such as the ends of a 3-inch ruler in the photo.';
    case 'nonpositive-repeat':
      return 'The repeat size has to be more than zero. Enter the real-world size of the repeat in inches.';
    case 'negative':
      return 'A measurement cannot be negative.';
    case 'not-a-whole-pixel-count':
      return 'A pixel count has to be a whole number.';
    case 'not-a-whole-sixteenth':
      return 'A measurement has to be a whole number of sixteenths of an inch, such as 3 1/16 or 48.';
    case 'out-of-range':
      return `A measurement has to be between zero and ${refusal.maximumInches} inches.`;
  }
}
