// librequilt -- tests for G-08, square-in-a-square and the strip set.
//
// Every expected value below is quoted from the output of
// `python3 docs/specification-fixtures.py`, the specification's synthetic
// fixture script, and every row of T-01's table is its own test. The strip-set
// row lives in plain.test.ts with the other G-03 cuts.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import * as E from '../exact/quadratic';
import type { Rounded } from '../exact/rounding';
import type { ParentCut, UnitPlan, UnitResult } from './plan';
import * as SquareInASquare from './square-in-square';

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
const trimTarget = (plan: UnitPlan): Sixteenths => {
  if (plan.trimTo === undefined) throw new Error('plan has no trim target');
  return plan.trimTo;
};

describe('G-08 square-in-a-square', () => {
  test('T-01: a 6-inch finished outer side cuts a 4 3/4 centre and two 3 7/8 corner parents', () => {
    // fixtures CUTS:
    //   "square in square, 6 outer: centre (trim unit to 6 1/2): 4 3/4 in"
    //   "square in square, 6 outer: corner parents, cut once: 3 7/8 in"
    const plan = planned(SquareInASquare.squareInASquare(96, 1));
    expect(parent(plan, 0).shape).toBe('square');
    expect(cutText(parent(plan, 0).width)).toBe('4 3/4');
    expect(parent(plan, 0).count).toBe(1);
    expect(parent(plan, 0).diagonalCuts).toBe(0); // the centre is cut square
    expect(parent(plan, 1).shape).toBe('square');
    expect(cutText(parent(plan, 1).width)).toBe('3 7/8');
    expect(parent(plan, 1).count).toBe(2); // "two corner-parent squares"
    expect(parent(plan, 1).diagonalCuts).toBe(1); // "each is cut once diagonally"
    expect(plan.unitsYielded).toBe(1); // four corners for one unit
  });

  test('T-01: the unit is trimmed to 6 1/2 inches unfinished', () => {
    // G-08: "Because the centre cut is rounded up, the sewn unit is trimmed
    // to unfinished side F + 1/2, and the chart says so."
    const plan = planned(SquareInASquare.squareInASquare(96, 1));
    expect(L.toSixteenthCount(trimTarget(plan))).toBe(104);
    expect(L.formatInches(trimTarget(plan))).toBe('6 1/2');
    expect(plan.statements).toContainEqual({ kind: 'trim-to-unfinished', size: L.sixteenths(104) });
  });

  test('the centre cut is F / sqrt 2 + 1/2 and the corner cut is F / 2 + 7/8, exactly', () => {
    const plan = planned(SquareInASquare.squareInASquare(96, 1));
    expect(E.format(parent(plan, 0).width.unrounded)).toBe('1/2 + 3 sqrt2');
    expect(E.format(parent(plan, 1).width.unrounded)).toBe('31/8');
  });

  test('counts follow the demand, one centre and two corner parents per unit', () => {
    const plan = planned(SquareInASquare.squareInASquare(96, 3));
    expect(parent(plan, 0).count).toBe(3);
    expect(parent(plan, 1).count).toBe(6);
    expect(plan.unitsNeeded).toBe(3);
    expect(plan.unitsYielded).toBe(3);
    expect(plan.excessUnits).toBe(0);
    expect(plan.unusedTriangles).toBe(0);
  });

  test('the trim target is exactly F + 1/2, a whole sixteenth, never rounded', () => {
    // Rounding the trim target up would make the sewn unit finish larger than
    // F; G-01 stores it as a sixteenth and the seam allowances do the rest.
    const plan = planned(SquareInASquare.squareInASquare(57, 1)); // F = 3 9/16
    expect(L.toSixteenthCount(trimTarget(plan))).toBe(65);
    expect(L.formatInches(trimTarget(plan))).toBe('4 1/16');
  });

  test('a sixteenth-inch size rounds once, at the end', () => {
    // F = 3 9/16: centre F / sqrt 2 + 1/2 is irrational just above 3 -> 3 1/8;
    // corner F / 2 + 7/8 = 85/32 -> 2 3/4.
    const plan = planned(SquareInASquare.squareInASquare(57, 1));
    expect(cutText(parent(plan, 0).width)).toBe('3 1/8');
    expect(cutText(parent(plan, 1).width)).toBe('2 3/4');

    // F = 3 1/16: centre just above 2 21/32 -> 2 3/4; corner 77/32 -> 2 1/2.
    const finer = planned(SquareInASquare.squareInASquare(49, 1));
    expect(cutText(parent(finer, 0).width)).toBe('2 3/4');
    expect(cutText(parent(finer, 1).width)).toBe('2 1/2');
    expect(L.formatInches(trimTarget(finer))).toBe('3 9/16');
  });

  test('the smallest finished outer side still cuts', () => {
    // F = 1/16: centre -> 5/8; corner 29/32 -> 1.
    const plan = planned(SquareInASquare.squareInASquare(1, 1));
    expect(cutText(parent(plan, 0).width)).toBe('5/8');
    expect(cutText(parent(plan, 1).width)).toBe('1');
    expect(L.formatInches(trimTarget(plan))).toBe('9/16');
  });
});
