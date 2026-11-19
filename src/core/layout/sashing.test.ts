// librequilt -- tests for L-02, the sash pieces: with cornerstones and the
// continuous sash without them.
//
// Every expected value below is quoted from `python3
// docs/specification-fixtures.py` with the fixture line named in the test
// comment, or computed in whole sixteenths as the comment states.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as L from '../exact/length';
import type { StraightGrid } from './grid';
import { straightGrid } from './grid';
import type { LayoutResult } from './refusal';
import type { SashPieces } from './sashing';
import { planSashing } from './sashing';

const planned = <T>(result: LayoutResult<T>): T => {
  if (!result.ok) throw new Error(`expected a plan, got the refusal ${result.refusal.kind}`);
  return result.value;
};

// The T-02 sampler's numbers: 12-inch blocks (192 sixteenths), 2-inch sashing
// (32 sixteenths), three rows and two columns.
const sampler = (
  sashing: { width: number; cornerstones: boolean; outer: boolean } | undefined,
): StraightGrid => planned(straightGrid({ rows: 3, columns: 2, blockSide: 192, sashing }));

const pieces = (run: SashPieces): string =>
  `${run.count} cut ${L.formatInches(run.cutWidth.rounded)} x ${L.formatInches(run.cutLength.rounded)}`;

describe('L-02 sashing counts and cuts', () => {
  test('T-02: 17 sash rectangles cut 2 1/2 x 12 1/2 and 12 cornerstones cut 2 1/2 square', () => {
    // fixtures LAYOUTS: "sampler: 17 sash rectangles; 12 cornerstones"
    // L-02: R(C+1) + C(R+1) = 3*3 + 2*4 = 17 individual sash rectangles,
    // (R+1)(C+1) = 4*3 = 12 cornerstones; 9 vertical + 8 horizontal = 17.
    const plan = planned(planSashing(sampler({ width: 32, cornerstones: true, outer: true })));
    if (plan.kind !== 'cornerstones') throw new Error('expected the cornerstone scheme');
    expect(plan.vertical.count + plan.horizontal.count).toBe(17);
    expect(plan.vertical.count).toBe(9);
    expect(plan.horizontal.count).toBe(8);
    expect(pieces(plan.vertical)).toBe('9 cut 2 1/2 x 12 1/2');
    expect(pieces(plan.horizontal)).toBe('8 cut 2 1/2 x 12 1/2');
    expect(plan.cornerstones.count).toBe(12);
    expect(L.formatInches(plan.cornerstones.cutWidth.rounded)).toBe('2 1/2');
    expect(L.formatInches(plan.cornerstones.cutHeight.rounded)).toBe('2 1/2');
  });

  test('T-02: without cornerstones, nine 2 1/2 x 12 1/2 vertical and four 2 1/2 x 30 1/2 horizontal', () => {
    // fixtures: "sampler without cornerstones: 9 vertical sashes 2 1/2 x 12 1/2;
    // 4 horizontal sashes 2 1/2 x 30 1/2". Short vertical sashes join the
    // blocks within each row (including the row ends, outer sashing); long
    // horizontal sashes run the full 30-inch width between rows and at top and
    // bottom (L-02, O-12).
    const plan = planned(planSashing(sampler({ width: 32, cornerstones: false, outer: true })));
    if (plan.kind !== 'continuous') throw new Error('expected the continuous scheme');
    expect(pieces(plan.vertical)).toBe('9 cut 2 1/2 x 12 1/2');
    expect(pieces(plan.horizontal)).toBe('4 cut 2 1/2 x 30 1/2');
  });

  test('the continuous horizontal sash runs the full finished width of the top', () => {
    // 30 finished inches cut 30 1/2 (G-03): 480 sixteenths before the margin.
    const plan = planned(planSashing(sampler({ width: 32, cornerstones: false, outer: true })));
    if (plan.kind !== 'continuous') throw new Error('expected the continuous scheme');
    expect(L.toSixteenthCount(plan.horizontal.finishedLength)).toBe(480);
    expect(L.toSixteenthCount(plan.vertical.finishedLength)).toBe(192);
  });

  test('without outer sashing the o term drops from every count', () => {
    // R(C-1) = 3 vertical, (R-1)C = 4 horizontal, (R-1)(C-1) = 2 cornerstones.
    const plan = planned(planSashing(sampler({ width: 32, cornerstones: true, outer: false })));
    if (plan.kind !== 'cornerstones') throw new Error('expected the cornerstone scheme');
    expect(plan.vertical.count).toBe(3);
    expect(plan.horizontal.count).toBe(4);
    expect(plan.cornerstones.count).toBe(2);
    expect(pieces(plan.vertical)).toBe('3 cut 2 1/2 x 12 1/2');

    const continuous = planned(
      planSashing(sampler({ width: 32, cornerstones: false, outer: false })),
    );
    if (continuous.kind !== 'continuous') throw new Error('expected the continuous scheme');
    expect(continuous.vertical.count).toBe(3);
    expect(continuous.horizontal.count).toBe(2);
    expect(pieces(continuous.horizontal)).toBe('2 cut 2 1/2 x 26 1/2');
  });

  test('with sashing absent there are no sash pieces at all', () => {
    const plan = planned(planSashing(sampler(undefined)));
    expect(plan.kind).toBe('none');
  });

  test('a grid too small for a run demands no zero-count pieces', () => {
    // 1 by 1 with sashing only between blocks: nothing sits between anything.
    const grid = planned(
      straightGrid({
        rows: 1,
        columns: 1,
        blockSide: 192,
        sashing: { width: 32, cornerstones: true, outer: false },
      }),
    );
    const plan = planned(planSashing(grid));
    if (plan.kind !== 'cornerstones') throw new Error('expected the cornerstone scheme');
    expect(plan.vertical.count).toBe(0);
    expect(plan.horizontal.count).toBe(0);
    expect(plan.cornerstones.count).toBe(0);
  });

  test('an equal-width sash and cornerstone cut gains half an inch on both dimensions', () => {
    // G-03: a finished 2 x 12 rectangle is cut 2 1/2 x 12 1/2; the unrounded
    // geometry travels beside the rounded cut (G-02, I2).
    const plan = planned(planSashing(sampler({ width: 32, cornerstones: true, outer: true })));
    if (plan.kind !== 'cornerstones') throw new Error('expected the cornerstone scheme');
    expect(L.toSixteenthCount(plan.vertical.cutWidth.rounded)).toBe(40);
    expect(L.toSixteenthCount(plan.vertical.cutLength.rounded)).toBe(200);
  });
});
