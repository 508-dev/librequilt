// librequilt -- G-03, plain units: squares, rectangles, strips, strip sets.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  cutOrRefuse,
  ok,
  readFinishedSize,
  readUnitCount,
  type StripCut,
  type StripSetPlan,
  type UnitPlan,
  type UnitResult,
  withSeamMargins,
} from './plan';

/**
 * G-03: a square with finished side `F` is cut `F + 1/2`; a finished `W x H`
 * rectangle is cut `(W + 1/2) x (H + 1/2)`; a strip of finished width `F` is
 * cut `F + 1/2` wide; a strip-set segment of finished length `L` is subcut
 * `L + 1/2` long. Each finished exterior side gains a quarter-inch seam
 * margin at both ends. Mirroring, rotation and fabric-photo scale never
 * change these numbers -- which is why nothing here takes an orientation.
 *
 * Every cut is rounded up to the next eighth exactly once, at the end of its
 * parent-cut calculation (G-02). A plain square is its own parent cut.
 */

/** A finished square and the number of them the chart needs. */
export function plainSquare(finishedSide: number, unitsNeeded: number): UnitResult<UnitPlan> {
  const side = readFinishedSize(finishedSide);
  if (!side.ok) return side;
  const count = readUnitCount(unitsNeeded);
  if (!count.ok) return count;
  const cut = cutOrRefuse(withSeamMargins(side.value));
  if (!cut.ok) return cut;
  return ok({
    kind: 'square',
    finishedWidth: side.value,
    finishedHeight: side.value,
    oversized: false,
    parents: [
      {
        shape: 'square',
        count: count.value,
        width: cut.value,
        height: cut.value,
        diagonalCuts: 0,
      },
    ],
    yieldPerBatch: 1,
    unitsNeeded: count.value,
    unitsYielded: count.value,
    excessUnits: 0,
    unusedTriangles: 0,
    statements: [],
  });
}

/** A finished rectangle and the number of them the chart needs. */
export function plainRectangle(
  finishedWidth: number,
  finishedHeight: number,
  unitsNeeded: number,
): UnitResult<UnitPlan> {
  const width = readFinishedSize(finishedWidth);
  if (!width.ok) return width;
  const height = readFinishedSize(finishedHeight);
  if (!height.ok) return height;
  const count = readUnitCount(unitsNeeded);
  if (!count.ok) return count;
  const cutWidth = cutOrRefuse(withSeamMargins(width.value));
  if (!cutWidth.ok) return cutWidth;
  const cutHeight = cutOrRefuse(withSeamMargins(height.value));
  if (!cutHeight.ok) return cutHeight;
  return ok({
    kind: 'rectangle',
    finishedWidth: width.value,
    finishedHeight: height.value,
    oversized: false,
    parents: [
      {
        shape: 'rectangle',
        count: count.value,
        width: cutWidth.value,
        height: cutHeight.value,
        diagonalCuts: 0,
      },
    ],
    yieldPerBatch: 1,
    unitsNeeded: count.value,
    unitsYielded: count.value,
    excessUnits: 0,
    unusedTriangles: 0,
    statements: [],
  });
}

/**
 * The cut width of a plain strip (G-03).
 *
 * A strip's length is not a unit calculation: it comes from the layout's
 * piece demand and the bolt plan in `core/plan` (F-02), so only the width is
 * decided here.
 */
export function stripCutWidth(finishedWidth: number): UnitResult<StripCut> {
  const width = readFinishedSize(finishedWidth);
  if (!width.ok) return width;
  const cut = cutOrRefuse(withSeamMargins(width.value));
  if (!cut.ok) return cut;
  return ok({
    kind: 'strip',
    finishedWidth: width.value,
    cutWidth: cut.value,
  });
}

/**
 * A strip set (G-03, G-08): the strip cut width and the subcut length are
 * reported separately, never as one parent rectangle, because the strip is
 * cut across the bolt and the segments are subcut from the sewn set. How many
 * strips a set needs is bolt planning (`core/plan`); here the chart gets the
 * two dimensions and the segment count.
 */
export function stripSet(
  finishedWidth: number,
  finishedSegmentLength: number,
  segmentsNeeded: number,
): UnitResult<StripSetPlan> {
  const width = readFinishedSize(finishedWidth);
  if (!width.ok) return width;
  const segment = readFinishedSize(finishedSegmentLength);
  if (!segment.ok) return segment;
  const count = readUnitCount(segmentsNeeded);
  if (!count.ok) return count;
  const cutWidth = cutOrRefuse(withSeamMargins(width.value));
  if (!cutWidth.ok) return cutWidth;
  const subcut = cutOrRefuse(withSeamMargins(segment.value));
  if (!subcut.ok) return subcut;
  return ok({
    kind: 'strip-set',
    finishedWidth: width.value,
    finishedSegmentLength: segment.value,
    stripCutWidth: cutWidth.value,
    segmentSubcutLength: subcut.value,
    segmentsNeeded: count.value,
  });
}
