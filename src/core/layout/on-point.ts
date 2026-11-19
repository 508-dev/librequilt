// librequilt -- the on-point setting: envelope, setting triangles and their
// parent cuts (L-04, L-05).
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * L-04 and L-05: an on-point setting of square finished blocks, measured as
 * `C` block diagonals across and `R` down.
 *
 * L-04: "An on-point rectangle measured as `C` block diagonals across and `R`
 * down, with square finished block `B` and no sashing/border, has theoretical
 * finished size `C·B√2` by `R·B√2`. It contains `2CR−C−R+1` full diamond block
 * positions, `2(C+R−2)` side setting triangles and four corner triangles. A
 * plain alternate counts as a full block position. Four side triangles come
 * from each twice-diagonally-cut parent square; two corners come from each
 * once-diagonally-cut parent square, with leftovers reported. Show an
 * irrational finished dimension approximately to nearest sixteenth, marked
 * approximate, without feeding that display value into later cut math."
 *
 * L-05: "Let `T=B+S`, where `S` is finished on-point sashing width or zero.
 * The side parent-square cut is `ceil⅛(T√2+1¼)` and is cut twice diagonally,
 * putting straight grain on the long outside edge. The corner parent-square
 * cut is `ceil⅛(T/√2+⅞)` and is cut once diagonally, putting straight grain on
 * the two outside legs. ... The finished outer size of an on-point quilt with
 * sashing is not claimed until a proof quilt has been sewn and measured and
 * the rule recorded (O-11); until then the tool gives the parent cuts and
 * labels the outer size unverified."
 *
 * The theoretical size stays an exact `a + b√2` value (G-01: "A theoretical
 * on-point dimension involving √2 is not persisted as a rounded sixteenth")
 * and is never fed into cut arithmetic (I3); its nearest-sixteenth display is
 * a leaf. A non-square block is refused (the diagonal envelope needs equal
 * sides). Each parent cut is rounded once, at the end, up to the next eighth
 * (G-02) through `core/unit`. Refusals a quilter can cause are values, never
 * exceptions (I5).
 */

import { gcd } from '../exact/integer';
import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import type { Exact } from '../exact/quadratic';
import * as E from '../exact/quadratic';
import * as Q from '../exact/rational';
import type { Rounded } from '../exact/rounding';
import { cutOrRefuse, readFinishedSize } from '../unit/plan';
import { readOptionalFinishedSize } from './grid';
import type { LayoutResult } from './refusal';
import { ok, refused } from './refusal';

/** An on-point setting as the quilter sets it up, before validation. */
export interface OnPointInput {
  /** C: the number of block diagonals across. A whole number of at least one. */
  readonly columns: number;
  /** R: the number of block diagonals down. A whole number of at least one. */
  readonly rows: number;
  /** The finished block width in sixteenths (G-01). */
  readonly blockWidth: number;
  /**
   * The finished block height in sixteenths (G-01). On-point needs a square
   * block, so this must equal `blockWidth` (L-04's `B`).
   */
  readonly blockHeight: number;
  /**
   * The finished on-point sashing width (L-05's `S`), in sixteenths, or
   * omitted (or zero) for none. Zero is G-01's absent sash, not a zero-width
   * strip.
   */
  readonly sashing?: number | undefined;
}

/** The exact finished envelope and its approximate display (L-04). */
export interface OnPointExactSize {
  /** `C·B√2`, exact in ℚ(√2). Never persisted as a rounded sixteenth (I3). */
  readonly width: Exact;
  /** `R·B√2`, exact in ℚ(√2). */
  readonly height: Exact;
  /** The nearest-sixteenth display, marked approximate (L-04). */
  readonly display: OnPointDisplaySize;
}

/**
 * The nearest-sixteenth display of an irrational dimension, marked approximate
 * (L-04). The counts are plain numbers, not stored lengths: a leaf that never
 * re-enters cut arithmetic (I3), and it may exceed the stored range a real
 * measurement is held to.
 */
export interface OnPointDisplaySize {
  /** The nearest-sixteenth count of `width`. */
  readonly width: number;
  /** The nearest-sixteenth count of `height`. */
  readonly height: number;
}

/** The straight-grain edge a setting-triangle parent puts outside (L-05). */
export type OnPointStraightGrain = 'long-outside-edge' | 'two-outside-legs';

/** One group of identical on-point parent squares (L-05). */
export interface OnPointParentSquares {
  readonly count: number;
  /** The cut square side, rounded up to the next eighth exactly once (G-02). */
  readonly cut: Rounded<Sixteenths>;
  /** Diagonal cuts before sewing: two for a side parent, one for a corner. */
  readonly diagonalCuts: 1 | 2;
  /** Where the straight grain sits on the outside (L-05). */
  readonly straightGrain: OnPointStraightGrain;
  /** Triangles cut beyond those the envelope needs (L-04 "leftovers reported"). */
  readonly leftoverTriangles: number;
}

/** Everything an on-point setting is: the envelope, counts and parent cuts. */
export interface OnPointPlan {
  readonly columns: number;
  readonly rows: number;
  /** The square finished block side (L-04's `B`). */
  readonly blockSide: Sixteenths;
  /** The finished on-point sashing width, or `null` when absent (L-05's `S`). */
  readonly sashing: Sixteenths | null;
  /** L-04's full diamond positions: `2CR−C−R+1` (plain alternates count). */
  readonly wholePositions: number;
  /** L-04's side setting triangles: `2(C+R−2)`. */
  readonly sideTriangles: number;
  /** L-04's corner triangles: always four. */
  readonly cornerTriangles: number;
  readonly sideParentSquares: OnPointParentSquares;
  readonly cornerParentSquares: OnPointParentSquares;
  /** The exact no-sash envelope `C·B√2` by `R·B√2` (L-04). */
  readonly theoretical: OnPointExactSize;
  /**
   * True when the theoretical size is the claimed outer finished size (no
   * sashing, L-04). False whenever sashing is present: the outer size stays
   * unverified until the O-11 proof quilt is measured (L-05).
   */
  readonly outerSizeVerified: boolean;
}

/**
 * The on-point envelope, its position and triangle counts, and its parent
 * cuts (L-04, L-05).
 *
 * The answer, or a typed refusal naming what stops it (I5): a diagonal count
 * the envelope cannot hold, a finished block or sash width the unit layer
 * refuses, a non-square block, or a parent cut the project cannot store.
 */
export function planOnPoint(input: OnPointInput): LayoutResult<OnPointPlan> {
  if (!Number.isInteger(input.columns) || input.columns < 1) {
    return refused({ kind: 'bad-grid-count', axis: 'columns', value: input.columns });
  }
  if (!Number.isInteger(input.rows) || input.rows < 1) {
    return refused({ kind: 'bad-grid-count', axis: 'rows', value: input.rows });
  }

  const width = readFinishedSize(input.blockWidth);
  if (!width.ok) return refused(width.refusal);
  const height = readFinishedSize(input.blockHeight);
  if (!height.ok) return refused(height.refusal);
  if (width.value !== height.value) {
    return refused({ kind: 'non-square-block', width: width.value, height: height.value });
  }
  const blockSide = width.value;

  const sashing = readOptionalFinishedSize(input.sashing ?? 0);
  if (!sashing.ok) return sashing;
  const sashingWidth = L.toSixteenthCount(sashing.value) === 0 ? null : sashing.value;

  const columns = input.columns;
  const rows = input.rows;

  // L-04's counts. Plain alternates count as full positions, so the whole
  // count is pure C and R arithmetic, independent of sashing.
  const wholePositions = 2 * columns * rows - columns - rows + 1;
  const sideTriangles = 2 * (columns + rows - 2);
  const cornerTriangles = 4;

  // T = B + S in sixteenths (L-05). B and S are each whole sixteenths, so T is
  // a whole count; it is kept as a count, not a stored length, because B + S
  // may exceed the range a single stored measurement is held to.
  const t =
    L.toSixteenthCount(blockSide) + (sashingWidth === null ? 0 : L.toSixteenthCount(sashingWidth));

  const side = sideParentSquares(t, sideTriangles);
  if (!side.ok) return side;
  const corner = cornerParentSquares(t, cornerTriangles);
  if (!corner.ok) return corner;

  return ok({
    columns,
    rows,
    blockSide,
    sashing: sashingWidth,
    wholePositions,
    sideTriangles,
    cornerTriangles,
    sideParentSquares: side.value,
    cornerParentSquares: corner.value,
    theoretical: exactFinishedSize(columns, rows, blockSide),
    outerSizeVerified: sashingWidth === null,
  });
}

/**
 * The side parent squares (L-05): cut `ceil⅛(T√2+1¼)`, twice diagonally, four
 * side triangles each, straight grain on the long outside edge. `t` is the
 * `T = B + S` count in sixteenths.
 */
function sideParentSquares(t: number, sideTriangles: number): LayoutResult<OnPointParentSquares> {
  const unrounded = E.add(E.multiply(tInches(t), E.SQRT2), E.fromFraction(5n, 4n));
  const cut = cutOrRefuse(unrounded);
  if (!cut.ok) return cut;
  const count = Math.ceil(sideTriangles / 4);
  return ok({
    count,
    cut: cut.value,
    diagonalCuts: 2,
    straightGrain: 'long-outside-edge',
    leftoverTriangles: count * 4 - sideTriangles,
  });
}

/**
 * The corner parent squares (L-05): cut `ceil⅛(T/√2+⅞)`, once diagonally, two
 * corner triangles each, straight grain on the two outside legs.
 */
function cornerParentSquares(
  t: number,
  cornerTriangles: number,
): LayoutResult<OnPointParentSquares> {
  const unrounded = E.add(E.divide(tInches(t), E.SQRT2), E.fromFraction(7n, 8n));
  const cut = cutOrRefuse(unrounded);
  if (!cut.ok) return cut;
  const count = Math.ceil(cornerTriangles / 2);
  return ok({
    count,
    cut: cut.value,
    diagonalCuts: 1,
    straightGrain: 'two-outside-legs',
    leftoverTriangles: count * 2 - cornerTriangles,
  });
}

/** A sixteenth count as exact inches: `T = B + S` for the parent-cut formulas. */
function tInches(t: number): Exact {
  return E.fromRational(Q.rational(BigInt(t), 16n));
}

/** The exact no-sash envelope `C·B√2` by `R·B√2` (L-04). */
function exactFinishedSize(columns: number, rows: number, blockSide: Sixteenths): OnPointExactSize {
  const width = E.scale(
    E.SQRT2,
    Q.rational(BigInt(columns) * BigInt(L.toSixteenthCount(blockSide)), 16n),
  );
  const height = E.scale(
    E.SQRT2,
    Q.rational(BigInt(rows) * BigInt(L.toSixteenthCount(blockSide)), 16n),
  );
  return {
    width,
    height,
    display: { width: nearestSixteenth(width), height: nearestSixteenth(height) },
  };
}

/** Round an exact value to the nearest sixteenth, half up (L-04's display). */
function nearestSixteenth(value: Exact): number {
  return Number(E.floorOf(E.add(E.scale(value, Q.fromInteger(16)), E.fromFraction(1n, 2n))));
}

/**
 * Format a nearest-sixteenth display count as a mixed number of inches
 * (`33 15/16`). Mirrors `L.formatInches` for a plain count: a display leaf may
 * sit above the stored range, so it is not branded a `Sixteenths`.
 */
export function formatDisplayInches(count: number): string {
  const whole = Math.floor(count / L.SIXTEENTHS_PER_INCH);
  const remainder = count % L.SIXTEENTHS_PER_INCH;
  if (remainder === 0) return String(whole);
  const divisor = Number(gcd(BigInt(remainder), BigInt(L.SIXTEENTHS_PER_INCH)));
  const fraction = `${remainder / divisor}/${L.SIXTEENTHS_PER_INCH / divisor}`;
  return whole === 0 ? fraction : `${whole} ${fraction}`;
}
