// librequilt -- tests for L-03, butted borders with sides sewn first.
//
// Every expected value below is quoted from `python3
// docs/specification-fixtures.py` with the fixture line named in the test
// comment, or computed in whole sixteenths as the comment states.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as L from '../exact/length';
import { applyBorder, type BorderPieces, type BorderPlan } from './border';
import type { FinishedSize } from './grid';
import type { LayoutResult } from './refusal';

const planned = <T>(result: LayoutResult<T>): T => {
  if (!result.ok) throw new Error(`expected a plan, got the refusal ${result.refusal.kind}`);
  return result.value;
};

const inches = (width: number, height: number): FinishedSize => ({
  width: L.inches(width),
  height: L.inches(height),
});
const pieces = (run: BorderPieces): string =>
  `${run.count} cut ${L.formatInches(run.cutWidth.rounded)} x ${L.formatInches(run.cutLength.rounded)}`;
const size = (plan: BorderPlan): string =>
  `${L.formatInches(plan.after.width)} x ${L.formatInches(plan.after.height)}`;

describe('L-03 butted borders', () => {
  test('T-02: a 4-inch border is two 4 1/2 x 44 1/2 sides, then two 4 1/2 x 38 1/2', () => {
    // fixtures LAYOUTS: "sampler border: sides 4 1/2 x 44 1/2; top/bottom
    // 4 1/2 x 38 1/2". Sides sewn first: two side pieces cut (T+1/2) x (H+1/2),
    // then two top/bottom pieces cut (T+1/2) x (W+2T+1/2) (L-03, O-12).
    const plan = planned(applyBorder(inches(30, 44), L.inches(4), 0));
    expect(pieces(plan.side)).toBe('2 cut 4 1/2 x 44 1/2');
    expect(pieces(plan.topBottom)).toBe('2 cut 4 1/2 x 38 1/2');
    // The side pieces are first in the plan because they are sewn first.
    expect(plan.side.finishedLength).toBe(L.inches(44));
    expect(plan.topBottom.finishedLength).toBe(L.inches(38));
  });

  test('T-02: the border makes the finished top 38 x 52 inches', () => {
    // fixtures LAYOUTS: "sampler: 30 x 44 inner; 38 x 52 finished"
    const plan = planned(applyBorder(inches(30, 44), L.inches(4), 0));
    expect(size(plan)).toBe('38 x 52');
    expect(L.formatInches(plan.before.width)).toBe('30');
  });

  test('each end of a border piece gains a quarter-inch seam margin', () => {
    // G-03: finished 38 inches plus both margins is 38 1/2 (616 sixteenths),
    // and the cut rounds up to the next eighth exactly once (G-02).
    const plan = planned(applyBorder(inches(30, 44), L.inches(4), 0));
    expect(L.toSixteenthCount(plan.topBottom.cutLength.rounded)).toBe(616);
    expect(L.toSixteenthCount(plan.side.cutWidth.rounded)).toBe(72); // 4 1/2
  });

  test('one or more borders fold the same rule, in application order', () => {
    // W-04: "One or more plain borders". A 2-inch border on 30 x 44 makes
    // 34 x 48; a 4-inch border on that makes 42 x 56.
    const first = planned(applyBorder(inches(30, 44), L.inches(2), 0));
    expect(size(first)).toBe('34 x 48');
    expect(pieces(first.side)).toBe('2 cut 2 1/2 x 44 1/2');
    expect(pieces(first.topBottom)).toBe('2 cut 2 1/2 x 34 1/2');
    const second = planned(applyBorder(first.after, L.inches(4), 1));
    expect(second.index).toBe(1);
    expect(size(second)).toBe('42 x 56');
    expect(pieces(second.side)).toBe('2 cut 4 1/2 x 48 1/2');
    expect(pieces(second.topBottom)).toBe('2 cut 4 1/2 x 42 1/2');
  });

  test('a finished growth the project cannot store is refused, not clamped', () => {
    // 990 inches plus a 4-inch border on both sides is 998, still stored; a
    // 6-inch border reaches 1002 inches, past the 1000-inch maximum (Q-08).
    expect(L.formatInches(planned(applyBorder(inches(990, 990), L.inches(4), 0)).after.width)).toBe(
      '998',
    );
    const result = applyBorder(inches(990, 990), L.inches(6), 0);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.refusal.kind).toBe('out-of-range');
  });
});
