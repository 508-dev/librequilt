// librequilt -- the plan one cuttable unit returns, and its typed refusals.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * G-03 to G-08: one cuttable unit, from a finished size to its parent cuts,
 * its counts, its yield and its trim variant -- or to a typed refusal.
 *
 * The invariants this module exists to hold (`docs/implementation-plan.md`):
 *
 * - I1: nothing stored is a float. Finished sizes arrive as whole sixteenths
 *   of an inch (G-01) and every cut is an exact value in Q(sqrt 2).
 * - I2: a cut dimension is rounded exactly once, at the end of its parent-cut
 *   calculation, by `roundCutUpToEighthInch` (G-02). The unrounded geometry
 *   travels beside the rounded cut, so a third rounding site would be visible
 *   in review.
 * - I5: a refusal a quilter can cause is a value, not an exception. A thrown
 *   error means a defect in librequilt itself.
 *
 * Counts: a construction has a batch -- two parent squares for a two-at-a-time
 * half-square triangle, one parent pair for an hourglass -- and the plan cuts
 * whole batches, reports what the whole demand yields, and counts the excess
 * the chart has to disclose (G-06, G-07).
 */

import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import type { Exact } from '../exact/quadratic';
import * as E from '../exact/quadratic';
import type { Rounded } from '../exact/rounding';
import * as R from '../exact/rounding';
import type { UnsupportedSeamRefusal } from './seams';

/** Which construction a plan came from. */
export type UnitKind =
  | 'square'
  | 'rectangle'
  | 'hst-two'
  | 'hst-four'
  | 'hst-eight'
  | 'quarter-square'
  | 'goose-one'
  | 'goose-four'
  | 'stitch-and-flip'
  | 'square-in-square';

/** One parent cut: what is cut from the bolt, and how it is cut apart. */
export interface ParentCut {
  readonly shape: 'square' | 'rectangle';
  /** How many to cut for the whole demand. */
  readonly count: number;
  /** The cut width, rounded up to the next eighth exactly once (G-02). */
  readonly width: Rounded<Sixteenths>;
  /** The cut height; equal to the width for a square. */
  readonly height: Rounded<Sixteenths>;
  /**
   * Diagonal cuts before sewing: 0, 1 or 2.
   *
   * Present only where the specification states how the parent is cut apart
   * (G-04's diagonal cut, G-05's two diagonals, G-06's two diagonals,
   * G-08's corner parents cut once). A construction the specification
   * describes only by name carries no cut count here.
   */
  readonly diagonalCuts?: 0 | 1 | 2;
}

/** A statement a chart must make about a plan. */
export type PlanStatement =
  | { readonly kind: 'trim-to-unfinished'; readonly size: Sixteenths }
  | { readonly kind: 'bias-edge-caution' }
  | { readonly kind: 'provisional-pending-sewn-check' };

/** The plan for a piece unit: parents, counts, yield, excess and trim. */
export interface UnitPlan {
  readonly kind: UnitKind;
  /** The finished geometry the quilter asked for (G-01's stored input). */
  readonly finishedWidth: Sixteenths;
  readonly finishedHeight: Sixteenths;
  /** True for the oversized parents of a trim variant (G-04, G-06). */
  readonly oversized: boolean;
  /** Every parent cut for the whole demand. */
  readonly parents: readonly ParentCut[];
  /** Units one construction batch yields. */
  readonly yieldPerBatch: number;
  readonly unitsNeeded: number;
  readonly unitsYielded: number;
  /** Units the batched construction overshoots the demand by (G-07). */
  readonly excessUnits: number;
  /**
   * Triangles cut beyond those the demand assembles (G-06), four per excess
   * unit of a quarter-square construction and zero elsewhere.
   */
  readonly unusedTriangles: number;
  /**
   * The unfinished side to trim each unit to, where a trim applies (G-04,
   * G-06, G-08). This is `F + 1/2` exactly, a whole sixteenth, and is never
   * rounded: rounding it up would make the sewn unit finish larger than `F`.
   */
  readonly trimTo?: Sixteenths;
  readonly statements: readonly PlanStatement[];
}

/** A plain strip: its cut width. Its length is planned in `core/plan`. */
export interface StripCut {
  readonly kind: 'strip';
  readonly finishedWidth: Sixteenths;
  readonly cutWidth: Rounded<Sixteenths>;
}

/** A strip set: the strip cut width and the subcut length, separately. */
export interface StripSetPlan {
  readonly kind: 'strip-set';
  readonly finishedWidth: Sixteenths;
  readonly finishedSegmentLength: Sixteenths;
  readonly stripCutWidth: Rounded<Sixteenths>;
  readonly segmentSubcutLength: Rounded<Sixteenths>;
  readonly segmentsNeeded: number;
}

/** Why a unit cannot yield a cutting chart. Each is a value a quilter can cause. */
export type UnitRefusal =
  | { readonly kind: 'not-a-whole-sixteenth'; readonly value: number }
  | { readonly kind: 'negative-size'; readonly value: number }
  | { readonly kind: 'zero-size' }
  | { readonly kind: 'out-of-range'; readonly maximumInches: number }
  | { readonly kind: 'bad-unit-count'; readonly value: number }
  | {
      readonly kind: 'unsupported-proportions';
      readonly width: Sixteenths;
      readonly height: Sixteenths;
    }
  | UnsupportedSeamRefusal;

/** The outcome of planning a unit: its plan, or a typed refusal (I5). */
export type UnitResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly refusal: UnitRefusal };

/** The unrounded half inch: a quarter-inch seam margin at both ends (G-03). */
export const HALF_INCH: Exact = E.fromFraction(1n, 2n);

/** Half an inch in sixteenths: the seam margin added to a finished size. */
const HALF_SIXTEENTHS: Sixteenths = L.sixteenths(8);

/** The largest completed cut that `roundCutUpToEighthInch` can hold. */
const MAX_CUT: Exact = L.toExact(L.sixteenths(L.MAX_LENGTH_SIXTEENTHS));

/**
 * Read a finished size a quilter (or a block grid) supplies.
 *
 * G-01 stores a length as a whole number of sixteenths; anything between the
 * marks is refused rather than silently rounded. Zero is refused too: G-01
 * allows it only for an absent optional sash or border, never for a unit.
 * A unit constructor takes a plain `number` so that a value which skipped
 * `parseLength` is still refused as a value (I5) instead of thrown.
 */
export function readFinishedSize(value: number): UnitResult<Sixteenths> {
  if (value < 0) return refused({ kind: 'negative-size', value });
  if (!Number.isInteger(value)) return refused({ kind: 'not-a-whole-sixteenth', value });
  if (value === 0) return refused({ kind: 'zero-size' });
  if (!L.isSixteenths(value)) {
    return refused({
      kind: 'out-of-range',
      maximumInches: L.MAX_LENGTH_SIXTEENTHS / L.SIXTEENTHS_PER_INCH,
    });
  }
  return ok(L.sixteenths(value));
}

/** Read how many units the chart needs: a whole count of at least one. */
export function readUnitCount(value: number): UnitResult<number> {
  if (!Number.isSafeInteger(value) || value < 1) {
    return refused({ kind: 'bad-unit-count', value });
  }
  return ok(value);
}

/**
 * Round one completed cut dimension up to the next eighth of an inch (G-02),
 * or refuse it when the quilter's size cannot produce a cut the project can
 * store. The rounding itself is `core/exact`'s and happens exactly once.
 */
export function cutOrRefuse(unrounded: Exact): UnitResult<Rounded<Sixteenths>> {
  if (E.signOf(E.subtract(unrounded, MAX_CUT)) > 0) {
    return refused({
      kind: 'out-of-range',
      maximumInches: L.MAX_LENGTH_SIXTEENTHS / L.SIXTEENTHS_PER_INCH,
    });
  }
  return ok(R.roundCutUpToEighthInch(unrounded));
}

/** The unrounded `F + 1/2` finished geometry of a plain cut (G-03). */
export function withSeamMargins(finishedSide: Sixteenths): Exact {
  return E.add(L.toExact(finishedSide), HALF_INCH);
}

/** The trim target `F + 1/2`, exactly, or a refusal if it cannot be stored. */
export function trimTargetOrRefuse(finishedSide: Sixteenths): UnitResult<Sixteenths> {
  const count = L.toSixteenthCount(finishedSide) + L.toSixteenthCount(HALF_SIXTEENTHS);
  if (!L.isSixteenths(count)) {
    return refused({
      kind: 'out-of-range',
      maximumInches: L.MAX_LENGTH_SIXTEENTHS / L.SIXTEENTHS_PER_INCH,
    });
  }
  return ok(L.sixteenths(count));
}

/** Build whole batches for a demand, and the yield and excess they give. */
export function batchesFor(
  unitsNeeded: number,
  yieldPerBatch: number,
): { readonly batches: number; readonly unitsYielded: number; readonly excessUnits: number } {
  const batches = Math.ceil(unitsNeeded / yieldPerBatch);
  const unitsYielded = batches * yieldPerBatch;
  return { batches, unitsYielded, excessUnits: unitsYielded - unitsNeeded };
}

/** A successful result. */
export function ok<T>(value: T): UnitResult<T> {
  return { ok: true, value };
}

/** A refused result, as a value (I5). */
export function refused(refusal: UnitRefusal): UnitResult<never> {
  return { ok: false, refusal };
}

/** A sentence a quilter can act on (A-01 requires understandable errors). */
export function describeUnitRefusal(refusal: UnitRefusal): string {
  switch (refusal.kind) {
    case 'not-a-whole-sixteenth':
      return 'A measurement has to be a whole number of sixteenths of an inch, such as 3 1/16 or 48.';
    case 'negative-size':
      return 'A measurement cannot be negative.';
    case 'zero-size':
      return 'A finished size has to be more than zero. Only an absent sash or border may be zero.';
    case 'out-of-range':
      return `A measurement has to be between zero and ${refusal.maximumInches} inches.`;
    case 'bad-unit-count':
      return 'The number of units has to be a whole number of at least one.';
    case 'unsupported-proportions':
      return 'A flying-geese unit needs a finished width twice its finished height, such as 4 by 2 inches.';
    case 'unsupported-seam':
      return `Seam "${refusal.seamId}" is a ${describeSeamShape(refusal.shape)} seam. Only straight seams can yield a cutting chart.`;
  }
}

function describeSeamShape(shape: UnsupportedSeamRefusal['shape']): string {
  switch (shape) {
    case 'curve':
      return 'curved';
    case 'set-in':
      return 'set-in';
    case 'free-polygon':
      return 'free-polygon';
  }
}
