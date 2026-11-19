// librequilt -- tests for G-04, G-05 and G-06: triangle constructions.
//
// Every expected value below is quoted from the output of
// `python3 docs/specification-fixtures.py`, the specification's synthetic
// fixture script, and every row of T-01's table is its own test. The physical
// four-at-a-time check of T-01 is IMPL-29's sewing, not this ticket's.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import * as E from '../exact/quadratic';
import * as Q from '../exact/rational';
import type { Rounded } from '../exact/rounding';
import type { ParentCut, UnitPlan, UnitResult } from './plan';
import * as Triangles from './triangles';

const planned = <T>(result: UnitResult<T>): T => {
  if (!result.ok) throw new Error(`expected a plan, got the refusal ${result.refusal.kind}`);
  return result.value;
};
const parent = (plan: UnitPlan, index: number): ParentCut => {
  const cut = plan.parents[index];
  if (cut === undefined) throw new Error(`plan has no parent cut ${index}`);
  return cut;
};
const cutText = (cut: Rounded<Sixteenths>): string => L.formatInches(cut.rounded);
const parentSide = (plan: UnitPlan): string => cutText(parent(plan, 0).width);
const trimTarget = (plan: UnitPlan): Sixteenths => {
  if (plan.trimTo === undefined) throw new Error('plan has no trim target');
  return plan.trimTo;
};

describe('G-04 half-square triangles, two at a time', () => {
  test('T-01: a 3-inch HST cuts 3 7/8-inch parents, yield 2', () => {
    // fixtures CUTS: "HST 2: 3 7/8 in"
    const plan = planned(Triangles.halfSquareTriangleTwoAtATime(48, 2));
    expect(parentSide(plan)).toBe('3 7/8');
    expect(parent(plan, 0).count).toBe(2);
    expect(parent(plan, 0).diagonalCuts).toBe(1); // "a diagonal cut" (G-04)
    expect(plan.yieldPerBatch).toBe(2);
    expect(plan.unitsYielded).toBe(2);
    expect(plan.excessUnits).toBe(0);
    expect(plan.oversized).toBe(false);
    expect(plan.trimTo).toBeUndefined();
  });

  test('T-01: the optional trim variant cuts 4-inch parents, trim to 3 1/2 unfinished', () => {
    // fixtures CUTS: "HST 2 trim: 4 in"
    // G-04: "their chart explicitly says to trim each unit to unfinished side F+1/2"
    const plan = planned(Triangles.halfSquareTriangleTwoAtATime(48, 2, { oversized: true }));
    expect(parentSide(plan)).toBe('4');
    expect(plan.oversized).toBe(true);
    expect(L.toSixteenthCount(trimTarget(plan))).toBe(56);
    expect(L.formatInches(trimTarget(plan))).toBe('3 1/2');
    expect(plan.statements).toContainEqual({ kind: 'trim-to-unfinished', size: L.sixteenths(56) });
    expect(plan.unitsYielded).toBe(2);
  });

  test('the unrounded geometry is F + 1/2 + 1 / (2 sqrt 2)', () => {
    const plan = planned(Triangles.halfSquareTriangleTwoAtATime(48, 2));
    expect(E.format(parent(plan, 0).width.unrounded)).toBe('7/2 + 1/4 sqrt2');
    // 1 / (2 sqrt 2) = sqrt 2 / 4, the quarter-inch seam offset projected
    // onto a square side (G-04); the 1/2 is the unit's perimeter seams.
    expect(E.format(parent(plan, 0).width.unrounded)).toBe(
      E.format(
        E.add(
          E.add(E.fromFraction(3n), E.fromFraction(1n, 2n)),
          E.exact(Q.ZERO, Q.rational(1n, 4n)),
        ),
      ),
    );
  });

  test('at a sixteenth-inch size the parent rounds up once (Q-01)', () => {
    // F = 3 1/16: unrounded 3 25/32 + 1 / (2 sqrt 2) -> 4.
    expect(parentSide(planned(Triangles.halfSquareTriangleTwoAtATime(49, 2)))).toBe('4');
    // F = 3 9/16 -> 4 7/16 -> 4 1/2.
    expect(parentSide(planned(Triangles.halfSquareTriangleTwoAtATime(57, 2)))).toBe('4 1/2');
    // The trim parent F + 1 = 4 1/16 rounds to 4 1/8.
    expect(
      parentSide(planned(Triangles.halfSquareTriangleTwoAtATime(49, 2, { oversized: true }))),
    ).toBe('4 1/8');
  });

  test('the smallest and boundary sizes still cut', () => {
    // 1/16 and 1/8 finished: the parent lands just under one inch -> 1.
    expect(parentSide(planned(Triangles.halfSquareTriangleTwoAtATime(1, 2)))).toBe('1');
    expect(parentSide(planned(Triangles.halfSquareTriangleTwoAtATime(2, 2)))).toBe('1');
    // 2-inch finished -> 2 7/8, the familiar F + 7/8.
    expect(parentSide(planned(Triangles.halfSquareTriangleTwoAtATime(32, 2)))).toBe('2 7/8');
    // 2 1/16 finished lands just under a whole inch and rounds up to 3.
    expect(parentSide(planned(Triangles.halfSquareTriangleTwoAtATime(33, 2)))).toBe('3');
  });

  test('whole batches: the demand decides parents, yield and excess', () => {
    const plan = planned(Triangles.halfSquareTriangleTwoAtATime(48, 3));
    expect(parent(plan, 0).count).toBe(4); // two batches of two parents
    expect(plan.unitsYielded).toBe(4);
    expect(plan.excessUnits).toBe(1);
  });
});

describe('G-05 half-square triangles, four at a time', () => {
  test('T-01: a 3-inch HST cuts 5 1/2-inch parents, yield 4', () => {
    // fixtures CUTS: "HST 4 corrected: 5 1/2 in"
    const plan = planned(Triangles.halfSquareTriangleFourAtATime(48, 4));
    expect(parentSide(plan)).toBe('5 1/2');
    expect(parent(plan, 0).count).toBe(2);
    expect(parent(plan, 0).diagonalCuts).toBe(2); // "cut along both diagonals" (G-05)
    expect(plan.yieldPerBatch).toBe(4);
    expect(plan.unitsYielded).toBe(4);
    expect(plan.excessUnits).toBe(0);
    expect(plan.oversized).toBe(false); // G-05 defines no trim variant
  });

  test('T-01: a result of 4 1/4 or 4 3/4 inches is an explicit failure', () => {
    // "The published shortcuts of 4 1/4 and 4 3/4 inches undercut this
    // fixture and are not acceptable."
    const plan = planned(Triangles.halfSquareTriangleFourAtATime(48, 4));
    expect(parentSide(plan)).not.toBe('4 1/4');
    expect(parentSide(plan)).not.toBe('4 3/4');
    expect(parentSide(plan)).toBe('5 1/2');
  });

  test('the parent is exactly the diagonal equation of G-05', () => {
    // "A parent square of side S leaves seam segment S - 1/2 as the unit
    // diagonal. That must equal (F + 1/2) sqrt 2."
    const plan = planned(Triangles.halfSquareTriangleFourAtATime(48, 4));
    const seamSegment = E.subtract(parent(plan, 0).width.unrounded, E.fromFraction(1n, 2n));
    const unitDiagonal = E.scale(
      E.SQRT2,
      Q.add(L.toRational(L.sixteenths(48)), Q.rational(1n, 2n)),
    );
    expect(E.equals(seamSegment, unitDiagonal)).toBe(true);
  });

  test('the plan carries the bias caution and the provisional flag (O-06)', () => {
    const plan = planned(Triangles.halfSquareTriangleFourAtATime(48, 4));
    expect(plan.statements).toContainEqual({ kind: 'bias-edge-caution' });
    expect(plan.statements).toContainEqual({ kind: 'provisional-pending-sewn-check' });
    expect(Triangles.FOUR_AT_A_TIME_SEWN_CHECK_PASSED).toBe(false);
  });

  test('a sixteenth-inch size rounds once, at the end', () => {
    // F = 3 1/16: (F + 1/2) sqrt 2 + 1/2 -> 5 7/16 -> 5 5/8.
    expect(parentSide(planned(Triangles.halfSquareTriangleFourAtATime(49, 4)))).toBe('5 5/8');
    // F = 3 9/16 -> 6 1/4 exactly.
    expect(parentSide(planned(Triangles.halfSquareTriangleFourAtATime(57, 4)))).toBe('6 1/4');
  });

  test('whole batches: the demand decides parents, yield and excess', () => {
    const plan = planned(Triangles.halfSquareTriangleFourAtATime(48, 5));
    expect(parent(plan, 0).count).toBe(4); // two batches of two parents
    expect(plan.unitsYielded).toBe(8);
    expect(plan.excessUnits).toBe(3); // the chart states the excess (G-07)
  });
});

describe('G-04 half-square triangles, eight at a time', () => {
  test('T-01: a 3-inch HST cuts 7 3/4-inch parents, yield 8', () => {
    // fixtures CUTS: "HST 8: 7 3/4 in"
    const plan = planned(Triangles.halfSquareTriangleEightAtATime(48, 8));
    expect(parentSide(plan)).toBe('7 3/4');
    expect(parent(plan, 0).count).toBe(2);
    expect(plan.yieldPerBatch).toBe(8);
    expect(plan.unitsYielded).toBe(8);
    expect(plan.excessUnits).toBe(0);
  });

  test('T-01: the optional trim variant cuts 8-inch parents, trim to 3 1/2 unfinished', () => {
    // fixtures CUTS: "HST 8 trim: 8 in"
    const plan = planned(Triangles.halfSquareTriangleEightAtATime(48, 8, { oversized: true }));
    expect(parentSide(plan)).toBe('8');
    expect(L.toSixteenthCount(trimTarget(plan))).toBe(56);
    expect(plan.statements).toContainEqual({ kind: 'trim-to-unfinished', size: L.sixteenths(56) });
  });

  test('Q-01: at F = 3 1/16 the parent is the doubled unrounded geometry', () => {
    // 2 (F + 1/2 + 1 / (2 sqrt 2)) rounds to 7 7/8, which is what the
    // literal 2 (F + 7/8) gives here too. Doubling the already-rounded
    // two-at-a-time parent would give 8 -- the reading this rejects.
    const plan = planned(Triangles.halfSquareTriangleEightAtATime(49, 8));
    expect(parentSide(plan)).toBe('7 7/8');
    expect(parentSide(plan)).not.toBe('8');
  });

  test('the unrounded geometry is the doubled two-at-a-time parent', () => {
    const plan = planned(Triangles.halfSquareTriangleEightAtATime(48, 8));
    expect(E.format(parent(plan, 0).width.unrounded)).toBe('7 + 1/2 sqrt2');
  });

  test('a sixteenth-inch size rounds once, at the end', () => {
    // F = 3 9/16: doubled unrounded -> 8 7/8.
    expect(parentSide(planned(Triangles.halfSquareTriangleEightAtATime(57, 8)))).toBe('8 7/8');
    // The oversized parent 2 (F + 1) = 9 1/8 exactly.
    expect(
      parentSide(planned(Triangles.halfSquareTriangleEightAtATime(57, 8, { oversized: true }))),
    ).toBe('9 1/8');
  });

  test('whole batches: the demand decides parents, yield and excess', () => {
    const plan = planned(Triangles.halfSquareTriangleEightAtATime(48, 9));
    expect(parent(plan, 0).count).toBe(4); // two batches of two parents
    expect(plan.unitsYielded).toBe(16);
    expect(plan.excessUnits).toBe(7);
  });
});

describe('G-06 quarter-square triangles', () => {
  test('T-01: a 3-inch hourglass cuts 4 1/4-inch parents, yield 2 per pair', () => {
    // fixtures CUTS: "QST / hourglass: 4 1/4 in"
    const plan = planned(Triangles.quarterSquareTriangle(48, 2));
    expect(parentSide(plan)).toBe('4 1/4');
    expect(parent(plan, 0).count).toBe(2);
    expect(parent(plan, 0).diagonalCuts).toBe(2); // "cut each twice diagonally"
    expect(plan.yieldPerBatch).toBe(2); // "yield 2 hourglass units per pair"
    expect(plan.unitsYielded).toBe(2);
    expect(plan.excessUnits).toBe(0);
    expect(plan.unusedTriangles).toBe(0);
  });

  test('T-01: the optional trim choice cuts 4 1/2-inch parents', () => {
    // fixtures CUTS: "QST trim: 4 1/2 in"
    // G-06's "optional trim choice" trims each unit back to unfinished
    // F + 1/2, as every trim variant does (T-01's table preamble).
    const plan = planned(Triangles.quarterSquareTriangle(48, 2, { oversized: true }));
    expect(parentSide(plan)).toBe('4 1/2');
    expect(L.toSixteenthCount(trimTarget(plan))).toBe(56);
    expect(plan.statements).toContainEqual({ kind: 'trim-to-unfinished', size: L.sixteenths(56) });
  });

  test('the unrounded geometry is F + 1/2 + 1 / sqrt 2', () => {
    const plan = planned(Triangles.quarterSquareTriangle(48, 2));
    expect(E.format(parent(plan, 0).width.unrounded)).toBe('7/2 + 1/2 sqrt2');
  });

  test('unused triangles are the four per excess unit the demand leaves', () => {
    // A pair of parents cuts eight triangles; an hourglass assembles four.
    const one = planned(Triangles.quarterSquareTriangle(48, 1));
    expect(parent(one, 0).count).toBe(2);
    expect(one.unitsYielded).toBe(2);
    expect(one.excessUnits).toBe(1);
    expect(one.unusedTriangles).toBe(4); // four triangles beyond the demand

    const two = planned(Triangles.quarterSquareTriangle(48, 2));
    expect(two.excessUnits).toBe(0);
    expect(two.unusedTriangles).toBe(0);

    const three = planned(Triangles.quarterSquareTriangle(48, 3));
    expect(parent(three, 0).count).toBe(4); // two pairs
    expect(three.unitsYielded).toBe(4);
    expect(three.excessUnits).toBe(1);
    expect(three.unusedTriangles).toBe(4);
  });

  test('a sixteenth-inch size rounds once, at the end', () => {
    // F = 3 1/16 -> 4 5/16 -> 4 3/8.
    expect(parentSide(planned(Triangles.quarterSquareTriangle(49, 2)))).toBe('4 3/8');
    // F = 3 9/16 -> 4 13/16 -> 4 7/8.
    expect(parentSide(planned(Triangles.quarterSquareTriangle(57, 2)))).toBe('4 7/8');
    // The trim parents round too: F + 3/2 = 4 9/16 -> 4 5/8.
    expect(parentSide(planned(Triangles.quarterSquareTriangle(49, 2, { oversized: true })))).toBe(
      '4 5/8',
    );
  });

  test('the smallest finished size still cuts', () => {
    // 1/16 finished: F + 1/2 + 1 / sqrt 2 -> 1 3/8.
    expect(parentSide(planned(Triangles.quarterSquareTriangle(1, 2)))).toBe('1 3/8');
  });
});
