// librequilt -- tests for G-03, plain units: squares, rectangles, strips.
//
// Every expected value below is quoted from the output of
// `python3 docs/specification-fixtures.py`, the specification's synthetic
// fixture script, and every row of T-01's table is its own test.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import * as E from '../exact/quadratic';
import type { Rounded } from '../exact/rounding';
import * as Plain from './plain';
import type { ParentCut, UnitPlan, UnitResult } from './plan';

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

describe('G-03 plain units', () => {
  test('T-01: a 3-inch finished square or strip width is cut 3 1/2 inches', () => {
    // fixtures CUTS: "square / strip: 3 1/2 in"
    const square = planned(Plain.plainSquare(48, 1));
    expect(cutText(parent(square, 0).width)).toBe('3 1/2');
    expect(cutText(parent(square, 0).height)).toBe('3 1/2');
    expect(parent(square, 0).count).toBe(1);
    expect(square.yieldPerBatch).toBe(1);

    const strip = planned(Plain.stripCutWidth(48));
    expect(cutText(strip.cutWidth)).toBe('3 1/2');
    expect(L.toSixteenthCount(strip.finishedWidth)).toBe(48);
  });

  test('a finished rectangle gains half an inch on both dimensions', () => {
    // fixtures CUTS: "FG one rect 4 x 2: 4 1/2 x 2 1/2 in" -- the same G-03
    // rectangle formula, quoted there for the one-at-a-time goose body.
    const rectangle = planned(Plain.plainRectangle(64, 32, 1));
    expect(cutText(parent(rectangle, 0).width)).toBe('4 1/2');
    expect(cutText(parent(rectangle, 0).height)).toBe('2 1/2');
    expect(L.toSixteenthCount(rectangle.finishedWidth)).toBe(64);
    expect(L.toSixteenthCount(rectangle.finishedHeight)).toBe(32);
    expect(parent(rectangle, 0).count).toBe(1);
    expect(rectangle.excessUnits).toBe(0);
  });

  test('T-01: a strip set reports its cut width and subcut length separately', () => {
    // fixtures CUTS: "strip set width 2; subcut 6: 2 1/2 x 6 1/2 in"
    // G-08: "A strip set reports its cut width and subcut length separately."
    const set = planned(Plain.stripSet(32, 96, 2));
    expect(cutText(set.stripCutWidth)).toBe('2 1/2');
    expect(cutText(set.segmentSubcutLength)).toBe('6 1/2');
    expect(L.toSixteenthCount(set.finishedWidth)).toBe(32);
    expect(L.toSixteenthCount(set.finishedSegmentLength)).toBe(96);
    expect(set.segmentsNeeded).toBe(2);
  });

  test('parent counts equal the demand and plain units have no excess', () => {
    const square = planned(Plain.plainSquare(48, 5));
    expect(parent(square, 0).count).toBe(5);
    expect(square.unitsNeeded).toBe(5);
    expect(square.unitsYielded).toBe(5);
    expect(square.excessUnits).toBe(0);
    expect(square.unusedTriangles).toBe(0);

    const rectangles = planned(Plain.plainRectangle(64, 32, 3));
    expect(parent(rectangles, 0).count).toBe(3);
    expect(rectangles.unitsYielded).toBe(3);
  });

  test('an exact eighth stays unchanged and a sixteenth over rounds up', () => {
    // G-02: "An exact eighth stays unchanged."
    expect(cutText(parent(planned(Plain.plainSquare(56, 1)), 0).width)).toBe('4');
    // 3 1/16 finished -> 3 9/16 -> the next eighth, 3 5/8.
    expect(cutText(parent(planned(Plain.plainSquare(49, 1)), 0).width)).toBe('3 5/8');
    // 3 9/16 finished -> 4 1/16 -> the next eighth, 4 1/8.
    expect(cutText(parent(planned(Plain.plainSquare(57, 1)), 0).width)).toBe('4 1/8');
    const set = planned(Plain.stripSet(32, 49, 1));
    expect(cutText(set.segmentSubcutLength)).toBe('3 5/8');
  });

  test('the smallest possible finished size still cuts', () => {
    // G-01's finest length: 1/16 finished -> 9/16 -> 5/8.
    expect(cutText(parent(planned(Plain.plainSquare(1, 1)), 0).width)).toBe('5/8');
  });

  test('the unrounded geometry travels beside the rounded cut (G-02, I2)', () => {
    const square = planned(Plain.plainSquare(49, 1));
    const cut = parent(square, 0).width;
    expect(E.format(cut.unrounded)).toBe('57/16'); // 3 9/16 before rounding
    expect(L.toSixteenthCount(cut.rounded)).toBe(58); // 3 5/8 after
  });

  test('every cut lands on a whole eighth at or above the input', () => {
    for (let sixteenth = 1; sixteenth <= 200; sixteenth += 1) {
      const plan = planned(Plain.plainSquare(sixteenth, 1));
      const count = L.toSixteenthCount(parent(plan, 0).width.rounded);
      expect(count % 2).toBe(0); // whole eighths are even sixteenth counts
      expect(count).toBeGreaterThanOrEqual(sixteenth + 8);
      expect(count - (sixteenth + 8)).toBeLessThan(2);
    }
  });
});
