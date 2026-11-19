// librequilt -- G-04, G-05, G-06: triangle units and their trim variants.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import type { Exact } from '../exact/quadratic';
import * as E from '../exact/quadratic';
import * as Q from '../exact/rational';
import type { Rounded } from '../exact/rounding';
import {
  batchesFor,
  cutOrRefuse,
  ok,
  type ParentCut,
  type PlanStatement,
  readFinishedSize,
  readUnitCount,
  trimTargetOrRefuse,
  type UnitPlan,
  type UnitResult,
  withSeamMargins,
} from './plan';

/**
 * O-06: the four-at-a-time method ships only if the sewn check in IMPL-29
 * passes -- two 5 1/2-inch parents sewn and cut into four units that trim to
 * 3 1/2 inches unfinished with the seam corner to corner. Until that check is
 * recorded, the construction is computed and tested here but its plan is
 * marked provisional and must not be offered to the quilter. IMPL-29 sets
 * this flag, or the method is removed entirely.
 */
export const FOUR_AT_A_TIME_SEWN_CHECK_PASSED = false;

/**
 * The quarter-inch seam offset of a bias seam projected onto a square side:
 * `1 / (2 sqrt 2) = sqrt 2 / 4`. G-04 states the term; the outer half inch of
 * the parent is `F + 1/2`, the unit's perimeter seams, added by the caller.
 */
function biasAllowance(): Exact {
  return E.exact(Q.ZERO, Q.rational(1n, 4n));
}

/** Options shared by the constructions with a trim variant (G-04, G-06). */
export interface TrimVariantOptions {
  /** Use the oversized parents and trim each unit to `F + 1/2`. */
  readonly oversized?: boolean;
}

/**
 * G-04, two at a time: two equal parent squares of side
 * `ceil1/8(F + 1/2 + 1 / (2 sqrt 2))` yield two units after two diagonal
 * seams and a diagonal cut. On ordinary eighth-inch inputs this is the
 * familiar `F + 7/8`. The optional oversized variant cuts `F + 1` parents and
 * trims each unit to unfinished side `F + 1/2`.
 */
export function halfSquareTriangleTwoAtATime(
  finishedSide: number,
  unitsNeeded: number,
  options: TrimVariantOptions = {},
): UnitResult<UnitPlan> {
  const side = readFinishedSize(finishedSide);
  if (!side.ok) return side;
  const count = readUnitCount(unitsNeeded);
  if (!count.ok) return count;
  const oversized = options.oversized === true;

  const unrounded: Exact = oversized
    ? E.add(withSeamMargins(side.value), E.fromFraction(1n, 2n)) // F + 1
    : E.add(withSeamMargins(side.value), biasAllowance()); // F + 1/2 + 1 / (2 sqrt 2)
  const cut = cutOrRefuse(unrounded);
  if (!cut.ok) return cut;

  return halfSquarePlan({
    kind: 'hst-two',
    side: side.value,
    oversized,
    cut: cut.value,
    parentsPerBatch: 2,
    yieldPerBatch: 2,
    unitsNeeded: count.value,
  });
}

/**
 * G-05, four at a time: two same-size squares are sewn a quarter inch inside
 * their four outer edges, then cut along both diagonals to yield four units.
 * A parent square of side `S` leaves seam segment `S - 1/2` as the unit
 * diagonal; that must equal `(F + 1/2) sqrt 2`, hence
 * `S = ceil1/8((F + 1/2) sqrt 2 + 1/2)`. For `F = 3` the cut is 5 1/2 inches.
 * The published shortcuts of 4 1/4 and 4 3/4 undercut that fixture and are
 * not acceptable (T-01). The specification gives no oversized variant for
 * this method, so there is none here.
 */
export function halfSquareTriangleFourAtATime(
  finishedSide: number,
  unitsNeeded: number,
): UnitResult<UnitPlan> {
  const side = readFinishedSize(finishedSide);
  if (!side.ok) return side;
  const count = readUnitCount(unitsNeeded);
  if (!count.ok) return count;

  const unrounded: Exact = E.add(
    E.scale(E.SQRT2, Q.add(L.toRational(side.value), Q.rational(1n, 2n))),
    E.fromFraction(1n, 2n),
  );
  const cut = cutOrRefuse(unrounded);
  if (!cut.ok) return cut;

  const statements: PlanStatement[] = [{ kind: 'bias-edge-caution' }];
  if (!FOUR_AT_A_TIME_SEWN_CHECK_PASSED) {
    statements.push({ kind: 'provisional-pending-sewn-check' });
  }
  return halfSquarePlan({
    kind: 'hst-four',
    side: side.value,
    oversized: false,
    cut: cut.value,
    parentsPerBatch: 2,
    yieldPerBatch: 4,
    unitsNeeded: count.value,
    statements,
  });
}

/**
 * G-04, eight at a time: two parents yield eight units. Per clarification
 * Q-01 the parent is the doubled *unrounded* two-at-a-time geometry,
 * `2 (F + 1/2 + 1 / (2 sqrt 2))`, rounded once at the end (G-02 forbids
 * rounding before joining); that agrees with the literal `2 (F + 7/8)` on
 * every eighth-inch input, including every `T-01` row. The optional oversized
 * variant cuts `2 (F + 1)` parents and trims each unit to `F + 1/2`.
 */
export function halfSquareTriangleEightAtATime(
  finishedSide: number,
  unitsNeeded: number,
  options: TrimVariantOptions = {},
): UnitResult<UnitPlan> {
  const side = readFinishedSize(finishedSide);
  if (!side.ok) return side;
  const count = readUnitCount(unitsNeeded);
  if (!count.ok) return count;
  const oversized = options.oversized === true;

  const unrounded: Exact = oversized
    ? E.scale(E.add(withSeamMargins(side.value), E.fromFraction(1n, 2n)), Q.fromInteger(2)) // 2 (F + 1)
    : E.scale(E.add(withSeamMargins(side.value), biasAllowance()), Q.fromInteger(2)); // 2 (F + 1/2 + 1 / (2 sqrt 2))
  const cut = cutOrRefuse(unrounded);
  if (!cut.ok) return cut;

  return halfSquarePlan({
    kind: 'hst-eight',
    side: side.value,
    oversized,
    cut: cut.value,
    parentsPerBatch: 2,
    yieldPerBatch: 8,
    unitsNeeded: count.value,
  });
}

/**
 * G-06, quarter-square triangles: for two finished hourglass units of side
 * `F`, cut two parent squares of side `ceil1/8(F + 1/2 + 1 / sqrt 2)` and cut
 * each twice diagonally. Each parent yields four triangles and an hourglass
 * unit assembles four, so a pair of parents yields two units. The diagonal
 * term accounts for the two bias seams and the half inch for the unit's
 * exterior seams. The chart reports the parent squares and yield, including
 * any unused triangles -- the triangles beyond those the demand assembles,
 * four per excess unit. The optional trim choice cuts `F + 1 1/2` parents and
 * trims each unit to unfinished side `F + 1/2`, as a trim variant does.
 */
export function quarterSquareTriangle(
  finishedSide: number,
  unitsNeeded: number,
  options: TrimVariantOptions = {},
): UnitResult<UnitPlan> {
  const side = readFinishedSize(finishedSide);
  if (!side.ok) return side;
  const count = readUnitCount(unitsNeeded);
  if (!count.ok) return count;
  const oversized = options.oversized === true;

  const unrounded: Exact = oversized
    ? E.add(withSeamMargins(side.value), E.ONE) // F + 3/2
    : E.add(withSeamMargins(side.value), E.divide(E.ONE, E.SQRT2)); // F + 1/2 + 1 / sqrt 2
  const cut = cutOrRefuse(unrounded);
  if (!cut.ok) return cut;

  const trim = oversized ? trimTargetOrRefuse(side.value) : undefined;
  if (trim !== undefined && !trim.ok) return trim;
  const trimTo = trim?.ok ? trim.value : undefined;

  const { batches, unitsYielded, excessUnits } = batchesFor(count.value, 2);
  const statements: PlanStatement[] = [];
  if (trimTo !== undefined) statements.push({ kind: 'trim-to-unfinished', size: trimTo });

  return ok({
    kind: 'quarter-square',
    finishedWidth: side.value,
    finishedHeight: side.value,
    oversized,
    parents: [
      {
        shape: 'square',
        count: 2 * batches,
        width: cut.value,
        height: cut.value,
        diagonalCuts: 2,
      },
    ],
    yieldPerBatch: 2,
    unitsNeeded: count.value,
    unitsYielded,
    excessUnits,
    unusedTriangles: 4 * excessUnits,
    ...(trimTo !== undefined ? { trimTo } : {}),
    statements,
  });
}

/** Shared assembly of a half-square-triangle plan from its batch numbers. */
function halfSquarePlan(input: {
  readonly kind: 'hst-two' | 'hst-four' | 'hst-eight';
  readonly side: Sixteenths;
  readonly oversized: boolean;
  readonly cut: Rounded<Sixteenths>;
  readonly parentsPerBatch: number;
  readonly yieldPerBatch: number;
  readonly unitsNeeded: number;
  readonly statements?: readonly PlanStatement[];
}): UnitResult<UnitPlan> {
  const { batches, unitsYielded, excessUnits } = batchesFor(input.unitsNeeded, input.yieldPerBatch);
  const trim = input.oversized ? trimTargetOrRefuse(input.side) : undefined;
  if (trim !== undefined && !trim.ok) return trim;
  const trimTo = trim?.ok ? trim.value : undefined;

  const parents: ParentCut[] = [
    {
      shape: 'square',
      count: input.parentsPerBatch * batches,
      width: input.cut,
      height: input.cut,
      diagonalCuts: input.kind === 'hst-four' ? 2 : 1,
    },
  ];
  const statements: PlanStatement[] = [...(input.statements ?? [])];
  if (trimTo !== undefined) statements.push({ kind: 'trim-to-unfinished', size: trimTo });

  return ok({
    kind: input.kind,
    finishedWidth: input.side,
    finishedHeight: input.side,
    oversized: input.oversized,
    parents,
    yieldPerBatch: input.yieldPerBatch,
    unitsNeeded: input.unitsNeeded,
    unitsYielded,
    excessUnits,
    unusedTriangles: 0,
    ...(trimTo !== undefined ? { trimTo } : {}),
    statements,
  });
}
