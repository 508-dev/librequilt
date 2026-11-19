// librequilt -- tests for G-07: flying geese and stitch-and-flip corners.
//
// Every expected value below is quoted from the output of
// `python3 docs/specification-fixtures.py`, the specification's synthetic
// fixture script, and every row of T-01's table is its own test.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import type { Rounded } from '../exact/rounding';
import * as Geese from './geese';
import type { ParentCut, UnitPlan, UnitResult } from './plan';
import { describeUnitRefusal } from './plan';

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

describe('G-07 flying geese, one at a time', () => {
  test('T-01: one 4 x 2-inch goose gives a 4 1/2 x 2 1/2 rectangle and two 2 1/2 squares', () => {
    // fixtures CUTS: "FG one rect 4 x 2: 4 1/2 x 2 1/2 in", "FG one squares: 2 1/2 in"
    const plan = planned(Geese.flyingGeeseOneAtATime(64, 32, 1));
    expect(parent(plan, 0).shape).toBe('rectangle');
    expect(cutText(parent(plan, 0).width)).toBe('4 1/2');
    expect(cutText(parent(plan, 0).height)).toBe('2 1/2');
    expect(parent(plan, 0).count).toBe(1);
    expect(parent(plan, 1).shape).toBe('square');
    expect(cutText(parent(plan, 1).width)).toBe('2 1/2');
    expect(parent(plan, 1).count).toBe(2);
    expect(plan.yieldPerBatch).toBe(1); // "yield 1"
    expect(plan.unitsYielded).toBe(1);
    expect(plan.excessUnits).toBe(0);
  });

  test('one body and two corners per goose, with no excess', () => {
    const plan = planned(Geese.flyingGeeseOneAtATime(64, 32, 3));
    expect(parent(plan, 0).count).toBe(3);
    expect(parent(plan, 1).count).toBe(6);
    expect(plan.unitsYielded).toBe(3);
    expect(plan.excessUnits).toBe(0);
    expect(plan.unusedTriangles).toBe(0);
  });

  test('a sixteenth-inch size rounds once, at the end', () => {
    // W = 4 1/8 (4 x 2 1/16): 4 5/8 and 2 9/16 -> 2 5/8.
    const plan = planned(Geese.flyingGeeseOneAtATime(66, 33, 1));
    expect(cutText(parent(plan, 0).width)).toBe('4 5/8');
    expect(cutText(parent(plan, 0).height)).toBe('2 5/8');
    expect(cutText(parent(plan, 1).width)).toBe('2 5/8');
  });

  test('the smallest goose still cuts', () => {
    // W = 1/8, H = 1/16: both margins leave 5/8 and 9/16 -> 5/8.
    const plan = planned(Geese.flyingGeeseOneAtATime(2, 1, 1));
    expect(cutText(parent(plan, 0).width)).toBe('5/8');
    expect(cutText(parent(plan, 0).height)).toBe('5/8');
    expect(cutText(parent(plan, 1).width)).toBe('5/8');
  });
});

describe('G-07 flying geese, no waste, four at a time', () => {
  test('T-01: four 4 x 2-inch geese give one 5 1/4 square and four 2 7/8 squares', () => {
    // fixtures CUTS: "FG four large: 5 1/4 in", "FG four small: 2 7/8 in"
    const plan = planned(Geese.flyingGeeseFourAtATime(64, 32, 4));
    expect(parent(plan, 0).shape).toBe('square');
    expect(cutText(parent(plan, 0).width)).toBe('5 1/4');
    expect(parent(plan, 0).count).toBe(1); // "one 5 1/4-inch square"
    expect(parent(plan, 1).shape).toBe('square');
    expect(cutText(parent(plan, 1).width)).toBe('2 7/8');
    expect(parent(plan, 1).count).toBe(4); // "four 2 7/8-inch squares"
    expect(plan.yieldPerBatch).toBe(4); // "yield 4"
    expect(plan.unitsYielded).toBe(4);
    expect(plan.excessUnits).toBe(0);
  });

  test('a batch that exceeds demand states the excess and counts the fabric', () => {
    // G-07: "If a four-unit construction exceeds demand, the chart states
    // excess units and counts the parent fabric."
    const plan = planned(Geese.flyingGeeseFourAtATime(64, 32, 5));
    expect(parent(plan, 0).count).toBe(2); // whole batches only
    expect(parent(plan, 1).count).toBe(8);
    expect(plan.unitsYielded).toBe(8);
    expect(plan.excessUnits).toBe(3);
  });

  test('a sixteenth-inch size rounds once, at the end', () => {
    // W = 4 1/8 (4 x 2 1/16): W + 1 1/4 = 5 3/8 exactly; H + 7/8 = 2 15/16 -> 3.
    const plan = planned(Geese.flyingGeeseFourAtATime(66, 33, 4));
    expect(cutText(parent(plan, 0).width)).toBe('5 3/8');
    expect(cutText(parent(plan, 1).width)).toBe('3');
  });

  test('the smallest goose still cuts', () => {
    // W = 1/8, H = 1/16: W + 1 1/4 = 1 3/8; H + 7/8 = 15/16 -> 1.
    const plan = planned(Geese.flyingGeeseFourAtATime(2, 1, 4));
    expect(cutText(parent(plan, 0).width)).toBe('1 3/8');
    expect(cutText(parent(plan, 1).width)).toBe('1');
  });
});

describe('G-07 stitch-and-flip corners', () => {
  test('T-01: a 3-inch finished corner uses a 3 1/2-inch square', () => {
    // fixtures CUTS: "stitch flip corner 3: 3 1/2 in"
    const plan = planned(Geese.stitchAndFlipCorner(48, 1));
    expect(parent(plan, 0).shape).toBe('square');
    expect(cutText(parent(plan, 0).width)).toBe('3 1/2');
    expect(parent(plan, 0).count).toBe(1);
    expect(plan.yieldPerBatch).toBe(1);
    expect(plan.unitsYielded).toBe(1);
  });

  test('one square per corner', () => {
    const plan = planned(Geese.stitchAndFlipCorner(48, 7));
    expect(parent(plan, 0).count).toBe(7);
    expect(plan.excessUnits).toBe(0);
  });
});

describe('G-07 proportions', () => {
  test('a goose whose finished width is not twice its height is refused', () => {
    // G-07 defines the goose "with W = 2 H"; W-07 forbids silently
    // approximating anything else, so both constructions refuse.
    const one = Geese.flyingGeeseOneAtATime(80, 32, 1);
    expect(one.ok).toBe(false);
    if (!one.ok) {
      expect(one.refusal.kind).toBe('unsupported-proportions');
      expect(describeUnitRefusal(one.refusal)).toContain('twice');
    }
    const four = Geese.flyingGeeseFourAtATime(80, 32, 4);
    expect(four.ok).toBe(false);
    if (!four.ok) expect(four.refusal.kind).toBe('unsupported-proportions');
  });

  test('W = 2 H holds in whole sixteenths', () => {
    const plan = planned(Geese.flyingGeeseOneAtATime(66, 33, 1)); // 4 1/8 = 2 x 2 1/16
    expect(L.toSixteenthCount(plan.finishedWidth)).toBe(66);
    expect(L.toSixteenthCount(plan.finishedHeight)).toBe(33);
  });
});
