// librequilt -- G-08: square-in-a-square, defined by its finished outer side.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as L from '../exact/length';
import * as E from '../exact/quadratic';
import * as Q from '../exact/rational';
import {
  cutOrRefuse,
  HALF_INCH,
  ok,
  type PlanStatement,
  readFinishedSize,
  readUnitCount,
  trimTargetOrRefuse,
  type UnitPlan,
  type UnitResult,
} from './plan';

/**
 * G-08: a square-in-a-square unit is defined by its *finished outer side*
 * `F`, so that it fits the block grid. Its on-point centre square has finished
 * side `F / sqrt 2` and is cut `ceil1/8(F / sqrt 2 + 1/2)`; two corner-parent
 * squares are cut `F / 2 + 7/8` and each is cut *once* diagonally, giving
 * four corners with straight grain on the unit's outer edges. Because the
 * centre cut is rounded up, the sewn unit is trimmed to unfinished side
 * `F + 1/2`, and the plan says so in a chart statement (G-08, T-01).
 *
 * A block name by itself is never used to infer this construction (G-08):
 * the caller must ask for it explicitly, which is why there is no name-based
 * entry point here.
 */
export function squareInASquare(
  finishedOuterSide: number,
  unitsNeeded: number,
): UnitResult<UnitPlan> {
  const outer = readFinishedSize(finishedOuterSide);
  if (!outer.ok) return outer;
  const count = readUnitCount(unitsNeeded);
  if (!count.ok) return count;

  // The centre finishes on point at F / sqrt 2; the half inch is its two
  // quarter-inch seam margins. It rounds up once to the next eighth (G-02),
  // which is exactly why the sewn unit is trimmed back to F + 1/2.
  const centreUnrounded = E.add(E.divide(L.toExact(outer.value), E.SQRT2), HALF_INCH);
  const centre = cutOrRefuse(centreUnrounded);
  if (!centre.ok) return centre;

  // Corner parents are cut F / 2 + 7/8: F / 2 exactly, never a float.
  const cornerUnrounded = E.add(
    E.scale(L.toExact(outer.value), Q.rational(1n, 2n)),
    E.fromFraction(7n, 8n),
  );
  const corner = cutOrRefuse(cornerUnrounded);
  if (!corner.ok) return corner;

  const trim = trimTargetOrRefuse(outer.value);
  if (!trim.ok) return trim;

  const statements: PlanStatement[] = [{ kind: 'trim-to-unfinished', size: trim.value }];
  return ok({
    kind: 'square-in-square',
    finishedWidth: outer.value,
    finishedHeight: outer.value,
    oversized: false,
    parents: [
      {
        shape: 'square',
        count: count.value,
        width: centre.value,
        height: centre.value,
        diagonalCuts: 0,
      },
      {
        shape: 'square',
        count: 2 * count.value,
        width: corner.value,
        height: corner.value,
        diagonalCuts: 1,
      },
    ],
    yieldPerBatch: 1,
    unitsNeeded: count.value,
    unitsYielded: count.value,
    excessUnits: 0,
    unusedTriangles: 0,
    trimTo: trim.value,
    statements,
  });
}
