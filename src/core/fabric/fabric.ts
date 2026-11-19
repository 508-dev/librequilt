// librequilt -- F-01, fabric identity: a named solid colour or a photo, its
// usable width, and its calibration and repeat offset.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import type { CalibrationRefusal, PixelsPerInch } from './scale';
import * as Scale from './scale';

/** F-02: the default usable width, 40 inches. */
export const DEFAULT_USABLE_WIDTH_INCHES = 40;
/** The default usable width in sixteenths: 40 inches (F-02). */
export const DEFAULT_USABLE_WIDTH: Sixteenths = L.inches(DEFAULT_USABLE_WIDTH_INCHES);

/**
 * A photo, described by its whole-pixel dimensions.
 *
 * The image bytes behind these counts, their decoding and their normalisation
 * are IMPL-21's concern (F-01, O-08); this module only needs the dimensions
 * the calibration and tiling arithmetic reads (I4: no browser, no decode).
 */
export interface Photo {
  readonly pixelWidth: number;
  readonly pixelHeight: number;
}

/** A motif offset in whole image pixels, along the two axes. */
export interface PixelOffset {
  readonly x: number;
  readonly y: number;
}

/** A named solid colour (F-01). */
export interface SolidColour {
  readonly kind: 'solid';
  /** The colour's name, such as "navy" or "rust". */
  readonly name: string;
}

/** A quilter's own fabric photo, at a known physical scale and motif offset. */
export interface PhotoFabric {
  readonly kind: 'photo';
  readonly photo: Photo;
  /** The retained physical scale in pixels per inch, exact (F-01). */
  readonly scale: PixelsPerInch;
  /** The motif offset; changing it never changes a cut or a yardage (W-05). */
  readonly offset: PixelOffset;
}

/** The two things a fabric can be: a solid colour or a photo (F-01). */
export type FabricSource = SolidColour | PhotoFabric;

/** A fabric: a name, a usable width, and a solid colour or a photo. */
export interface Fabric {
  readonly name: string;
  /** Usable width in sixteenths, default 40 inches (F-02). */
  readonly usableWidth: Sixteenths;
  readonly source: FabricSource;
}

/**
 * Why a fabric's photo cannot be calibrated. F-01's "missing photo" refusal
 * sits here, above the numeric refusals of `core/fabric/scale`.
 */
export type PhotoCalibrationRefusal = { readonly kind: 'missing-photo' } | CalibrationRefusal;

/** The outcome of calibrating a fabric's photo. */
export type PhotoCalibrationResult =
  | { readonly ok: true; readonly value: PixelsPerInch }
  | { readonly ok: false; readonly refusal: PhotoCalibrationRefusal };

/** A named solid-colour fabric, 40 inches wide by default (F-01, F-02). */
export function solidFabric(name: string, usableWidth: Sixteenths = DEFAULT_USABLE_WIDTH): Fabric {
  return { name, usableWidth, source: { kind: 'solid', name } };
}

/**
 * A fabric made from the quilter's own photo, at a known physical scale.
 *
 * `scale` comes from `Scale.calibrateByMarkedPoints` or
 * `Scale.calibrateByRepeat`; the offset defaults to the photo's origin.
 */
export function photoFabric(
  name: string,
  photo: Photo,
  scale: PixelsPerInch,
  offset: PixelOffset = { x: 0, y: 0 },
  usableWidth: Sixteenths = DEFAULT_USABLE_WIDTH,
): Fabric {
  return { name, usableWidth, source: { kind: 'photo', photo, scale, offset } };
}

/**
 * Change a photo fabric's motif offset (W-05).
 *
 * Only the photo's source carries the offset, and neither the cut arithmetic
 * (`core/unit`) nor the yardage arithmetic (`core/plan`) ever reads it, so
 * changing it leaves every cut and yardage number identical (T-06). A solid
 * colour has no motif to offset; reaching this function with one is a defect
 * in librequilt, not something a quilter can cause, so it throws (I5).
 */
export function withOffset(fabric: Fabric, offset: PixelOffset): Fabric {
  if (fabric.source.kind !== 'photo') {
    throw new Error('a solid colour has no motif offset to change');
  }
  return { ...fabric, source: { ...fabric.source, offset } };
}

/** Change a fabric's usable width (F-02). Pass a validated `Sixteenths`. */
export function withUsableWidth(fabric: Fabric, usableWidth: Sixteenths): Fabric {
  return { ...fabric, usableWidth };
}

/**
 * F-01, repeat route, at the fabric level: refuse a fabric with no photo, then
 * delegate the numeric calibration to `core/fabric/scale`.
 */
export function calibrateByRepeat(
  fabric: Fabric,
  cropPixels: number,
  repeatInches: number,
): PhotoCalibrationResult {
  if (fabric.source.kind !== 'photo') return { ok: false, refusal: { kind: 'missing-photo' } };
  return Scale.calibrateByRepeat(cropPixels, repeatInches);
}

/**
 * F-01, marked-points route, at the fabric level: refuse a fabric with no
 * photo, then delegate the numeric calibration.
 */
export function calibrateByMarkedPoints(
  fabric: Fabric,
  pixelDistance: number,
  enteredInches: number,
): PhotoCalibrationResult {
  if (fabric.source.kind !== 'photo') return { ok: false, refusal: { kind: 'missing-photo' } };
  return Scale.calibrateByMarkedPoints(pixelDistance, enteredInches);
}

/** A sentence a quilter can act on (A-01). */
export function describePhotoCalibrationRefusal(refusal: PhotoCalibrationRefusal): string {
  if (refusal.kind === 'missing-photo') {
    return 'This fabric has no photo to calibrate. Assign a photo first.';
  }
  return Scale.describeCalibrationRefusal(refusal);
}
