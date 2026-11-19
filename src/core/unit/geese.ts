// librequilt -- G-07: flying geese and stitch-and-flip corners.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import * as E from '../exact/quadratic';
import {
  batchesFor,
  cutOrRefuse,
  ok,
  type ParentCut,
  readFinishedSize,
  readUnitCount,
  refused,
  type UnitPlan,
  type UnitResult,
  withSeamMargins,
} from './plan';

/**
 * G-07: for a goose finished `W x H` with `W = 2 H`, the one-at-a-time
 * construction cuts a `(W + 1/2) x (H + 1/2)` rectangle and two `(H + 1/2)`
 * corner squares, yielding one goose. The no-waste four-at-a-time
 * construction cuts one large square `W + 1 1/4` and four small squares
 * `H + 7/8`, yielding four geese. A stitch-and-flip corner of finished leg
 * `C` uses a `(C + 1/2)` square. These allowances cover the exterior and
 * diagonal quarter-inch seams. If a four-unit construction exceeds demand the
 * chart states the excess units and still counts the parent fabric, which is
 * why the plan carries the full batched counts.
 *
 * G-07 defines the goose by its `W = 2 H` proportion, and W-07 forbids
 * silently approximating anything the specification excludes: any other
 * proportion is refused as a typed value rather than given guessed cuts.
 */

/** Check the `W = 2 H` finished proportion G-07 defines, in sixteenth counts. */
function checkProportions(width: Sixteenths, height: Sixteenths): UnitResult<null> {
  if (width !== height * 2) {
    return refused({ kind: 'unsupported-proportions', width, height });
  }
  return ok(null);
}

/** G-07, one at a time: one body rectangle and two corner squares per goose. */
export function flyingGeeseOneAtATime(
  finishedWidth: number,
  finishedHeight: number,
  geeseNeeded: number,
): UnitResult<UnitPlan> {
  const width = readFinishedSize(finishedWidth);
  if (!width.ok) return width;
  const height = readFinishedSize(finishedHeight);
  if (!height.ok) return height;
  const proportions = checkProportions(width.value, height.value);
  if (!proportions.ok) return proportions;
  const count = readUnitCount(geeseNeeded);
  if (!count.ok) return count;

  const body = cutOrRefuse(withSeamMargins(width.value));
  if (!body.ok) return body;
  const bodyHeight = cutOrRefuse(withSeamMargins(height.value));
  if (!bodyHeight.ok) return bodyHeight;

  const parents: ParentCut[] = [
    {
      shape: 'rectangle',
      count: count.value,
      width: body.value,
      height: bodyHeight.value,
    },
    {
      shape: 'square',
      count: 2 * count.value,
      width: bodyHeight.value,
      height: bodyHeight.value,
    },
  ];
  return ok({
    kind: 'goose-one',
    finishedWidth: width.value,
    finishedHeight: height.value,
    oversized: false,
    parents,
    yieldPerBatch: 1,
    unitsNeeded: count.value,
    unitsYielded: count.value,
    excessUnits: 0,
    unusedTriangles: 0,
    statements: [],
  });
}

/**
 * G-07, no waste, four at a time: one large square `W + 1 1/4` and four small
 * squares `H + 7/8` per batch of four geese.
 */
export function flyingGeeseFourAtATime(
  finishedWidth: number,
  finishedHeight: number,
  geeseNeeded: number,
): UnitResult<UnitPlan> {
  const width = readFinishedSize(finishedWidth);
  if (!width.ok) return width;
  const height = readFinishedSize(finishedHeight);
  if (!height.ok) return height;
  const proportions = checkProportions(width.value, height.value);
  if (!proportions.ok) return proportions;
  const count = readUnitCount(geeseNeeded);
  if (!count.ok) return count;

  const large = cutOrRefuse(E.add(L.toExact(width.value), E.fromFraction(5n, 4n)));
  if (!large.ok) return large;
  const small = cutOrRefuse(E.add(L.toExact(height.value), E.fromFraction(7n, 8n)));
  if (!small.ok) return small;

  const { batches, unitsYielded, excessUnits } = batchesFor(count.value, 4);
  const parents: ParentCut[] = [
    { shape: 'square', count: batches, width: large.value, height: large.value },
    { shape: 'square', count: 4 * batches, width: small.value, height: small.value },
  ];
  return ok({
    kind: 'goose-four',
    finishedWidth: width.value,
    finishedHeight: height.value,
    oversized: false,
    parents,
    yieldPerBatch: 4,
    unitsNeeded: count.value,
    unitsYielded,
    excessUnits,
    unusedTriangles: 0,
    statements: [],
  });
}

/** G-07: a stitch-and-flip corner of finished leg `C` uses a `(C + 1/2)` square. */
export function stitchAndFlipCorner(
  finishedLeg: number,
  cornersNeeded: number,
): UnitResult<UnitPlan> {
  const leg = readFinishedSize(finishedLeg);
  if (!leg.ok) return leg;
  const count = readUnitCount(cornersNeeded);
  if (!count.ok) return count;

  const cut = cutOrRefuse(withSeamMargins(leg.value));
  if (!cut.ok) return cut;
  return ok({
    kind: 'stitch-and-flip',
    finishedWidth: leg.value,
    finishedHeight: leg.value,
    oversized: false,
    parents: [
      {
        shape: 'square',
        count: count.value,
        width: cut.value,
        height: cut.value,
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
