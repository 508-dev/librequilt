// librequilt -- tests for L-04 and L-05, the on-point setting: the envelope,
// its triangle counts and the setting-triangle parent cuts.
//
// Every expected value below is quoted from `python3
// docs/specification-fixtures.py` with the fixture line named in the test
// comment, or computed in whole sixteenths as the comment states.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as L from '../exact/length';
import * as E from '../exact/quadratic';
import type { OnPointPlan } from './on-point';
import { formatDisplayInches, planOnPoint } from './on-point';
import type { LayoutResult } from './refusal';

const planned = <T>(
  result:
    | { readonly ok: true; readonly value: T }
    | { readonly ok: false; readonly refusal: { readonly kind: string } },
): T => {
  if (!result.ok) throw new Error(`expected a plan, got the refusal ${result.refusal.kind}`);
  return result.value;
};
const refusalKind = (result: LayoutResult<unknown>): string | undefined =>
  result.ok ? undefined : result.refusal.kind;

// The T-03 sampler: two block diagonals across (C=2), three down (R=3), square
// 12-inch blocks (192 sixteenths), no sash or border.
const onPoint = (blockWidth = 192, blockHeight = 192, sashing?: number): OnPointPlan =>
  planned(
    planOnPoint({
      columns: 2,
      rows: 3,
      blockWidth,
      blockHeight,
      sashing,
    }),
  );

describe('T-03 on-point envelope (L-04, L-05)', () => {
  test('T-03: eight whole positions, six side and four corner triangles', () => {
    // fixtures LAYOUTS: "on point 2 x 3: 8 whole, 6 side, 4 corner".
    // L-04: 2CR−C−R+1 = 2·2·3−2−3+1 = 8 full positions (plain alternates
    // count); 2(C+R−2) = 2·3 = 6 side triangles; four corner triangles.
    const plan = onPoint();
    expect(plan.wholePositions).toBe(8);
    expect(plan.sideTriangles).toBe(6);
    expect(plan.cornerTriangles).toBe(4);
  });

  test('T-03: two side and two corner parent squares, with leftovers reported', () => {
    // fixtures LAYOUTS: "2 side parent squares, 2 corner parent squares".
    // Four side triangles per side parent (ceil 6/4 = 2, yielding 8, two
    // leftover); two corner triangles per corner parent (ceil 4/2 = 2, none
    // leftover) -- L-04: "with leftovers reported".
    const plan = onPoint();
    expect(plan.sideParentSquares.count).toBe(2);
    expect(plan.sideParentSquares.leftoverTriangles).toBe(2);
    expect(plan.cornerParentSquares.count).toBe(2);
    expect(plan.cornerParentSquares.leftoverTriangles).toBe(0);
  });

  test('T-03: the exact size is 24√2 by 36√2, shown 33 15/16 by 50 15/16, approximate', () => {
    // fixtures LAYOUTS: "on point theoretical finished: 33.941125 x 50.911688
    // in" and "on point shown to 1/16: 33 15/16 x 50 15/16 in". The exact
    // value stays ℚ(√2) (C·B√2 by R·B√2) and is never persisted as a rounded
    // sixteenth (G-01, I3); the display is a leaf marked approximate.
    const plan = onPoint();
    expect(E.format(plan.theoretical.width)).toBe('24 sqrt2');
    expect(E.format(plan.theoretical.height)).toBe('36 sqrt2');
    expect(plan.theoretical.display.width).toBe(543);
    expect(plan.theoretical.display.height).toBe(815);
    expect(formatDisplayInches(plan.theoretical.display.width)).toBe('33 15/16');
    expect(formatDisplayInches(plan.theoretical.display.height)).toBe('50 15/16');
  });

  test('T-03: side parents 18 1/4 cut twice diagonally, corner parents 9 3/8 cut once', () => {
    // fixtures LAYOUTS: "on point B=12 sash=0: side 18 1/4; corner 9 3/8".
    // L-05: the side parent is ceil⅛(T√2+1¼) cut twice diagonally (straight
    // grain on the long outside edge); the corner parent is ceil⅛(T/√2+⅞) cut
    // once diagonally (straight grain on the two outside legs).
    const plan = onPoint();
    expect(L.formatInches(plan.sideParentSquares.cut.rounded)).toBe('18 1/4');
    expect(plan.sideParentSquares.diagonalCuts).toBe(2);
    expect(plan.sideParentSquares.straightGrain).toBe('long-outside-edge');
    expect(L.formatInches(plan.cornerParentSquares.cut.rounded)).toBe('9 3/8');
    expect(plan.cornerParentSquares.diagonalCuts).toBe(1);
    expect(plan.cornerParentSquares.straightGrain).toBe('two-outside-legs');
  });

  test('T-03: with 2-inch on-point sashing the parents are 21 1/8 and 10 7/8, size unverified', () => {
    // fixtures LAYOUTS: "on point B=12 sash=2: side 21 1/8; corner 10 7/8".
    // T = B + S = 14 inches. L-05/O-11: the outer finished size of an on-point
    // top with sashing is unverified until the proof quilt is measured.
    const plan = onPoint(192, 192, 32);
    expect(L.formatInches(plan.sideParentSquares.cut.rounded)).toBe('21 1/8');
    expect(L.formatInches(plan.cornerParentSquares.cut.rounded)).toBe('10 7/8');
    expect(plan.outerSizeVerified).toBe(false);
  });

  test('T-03: without sashing the theoretical size is the verified outer size', () => {
    // L-04 gives the finished size for "no sashing/border"; the unverified
    // label (L-05) attaches only when sashing is present.
    expect(onPoint().outerSizeVerified).toBe(true);
  });

  test('the parent cut is rounded once, at the end, from the exact sqrt2 geometry', () => {
    // G-02/I2: the unrounded geometry carries the irrational diagonal
    // (T√2 + 1¼ for a side parent) and the cut is its ceiling to the next
    // eighth, computed exactly. 12√2 + 1¼ is 18.2206…, ceiled to 18 1/4.
    const plan = onPoint();
    expect(E.format(plan.sideParentSquares.cut.unrounded)).toBe('5/4 + 12 sqrt2');
    expect(E.format(plan.cornerParentSquares.cut.unrounded)).toBe('7/8 + 6 sqrt2');
    expect(L.toSixteenthCount(plan.sideParentSquares.cut.rounded) % 2).toBe(0);
    expect(L.toSixteenthCount(plan.cornerParentSquares.cut.rounded) % 2).toBe(0);
  });

  test('the nearest-sixteenth display never feeds the cut math (I3)', () => {
    // The display counts are plain numbers beside the exact value, and the
    // parent cuts are a function of T = B + S only: nothing reads the display
    // back. A leaf by construction, asserted here by independence.
    const plan = onPoint(192, 192, 32);
    expect(plan.theoretical.display.width).toBe(543);
    // With sashing the envelope's exact value is unchanged by the sash, while
    // the parent cuts grow with T: display and cuts travel on separate paths.
    expect(L.formatInches(plan.sideParentSquares.cut.rounded)).toBe('21 1/8');
    expect(formatDisplayInches(plan.theoretical.display.width)).toBe('33 15/16');
  });
});

describe('L-04/L-05 on-point refusals and edges', () => {
  test('a non-square block is refused', () => {
    // Edge cases: "an on-point block that is not square ... must produce a
    // specific refusal". The diagonal envelope needs equal sides.
    const result = planOnPoint({ columns: 2, rows: 3, blockWidth: 192, blockHeight: 96 });
    expect(refusalKind(result)).toBe('non-square-block');
    if (!result.ok && result.refusal.kind === 'non-square-block') {
      expect(L.toSixteenthCount(result.refusal.width)).toBe(192);
      expect(L.toSixteenthCount(result.refusal.height)).toBe(96);
    }
  });

  test('a diagonal count the envelope cannot hold is refused', () => {
    expect(
      refusalKind(planOnPoint({ columns: 0, rows: 3, blockWidth: 192, blockHeight: 192 })),
    ).toBe('bad-grid-count');
    expect(
      refusalKind(planOnPoint({ columns: 2, rows: 1.5, blockWidth: 192, blockHeight: 192 })),
    ).toBe('bad-grid-count');
  });

  test('a zero or fractional block side is refused as a measurement', () => {
    expect(refusalKind(planOnPoint({ columns: 2, rows: 3, blockWidth: 0, blockHeight: 0 }))).toBe(
      'zero-size',
    );
    expect(
      refusalKind(planOnPoint({ columns: 2, rows: 3, blockWidth: 48.16, blockHeight: 48.16 })),
    ).toBe('not-a-whole-sixteenth');
  });

  test('an absent on-point sashing reads as zero; a negative or fractional one is refused', () => {
    expect(onPoint(192, 192, 0).sashing).toBeNull();
    expect(onPoint(192, 192, undefined).sashing).toBeNull();
    expect(
      refusalKind(
        planOnPoint({ columns: 2, rows: 3, blockWidth: 192, blockHeight: 192, sashing: -16 }),
      ),
    ).toBe('negative-size');
    expect(
      refusalKind(
        planOnPoint({ columns: 2, rows: 3, blockWidth: 192, blockHeight: 192, sashing: 32.5 }),
      ),
    ).toBe('not-a-whole-sixteenth');
  });

  test('a parent cut the project cannot store is refused, not thrown', () => {
    // A 900-inch block with 200-inch sashing makes T = 1100 inches, whose side
    // parent (T√2 + 1¼) is past the 1000-inch stored maximum. It is refused as
    // a value (I5), never a thrown range error.
    const result = planOnPoint({
      columns: 2,
      rows: 3,
      blockWidth: 14400,
      blockHeight: 14400,
      sashing: 3200,
    });
    expect(refusalKind(result)).toBe('out-of-range');
  });

  test('the single-diamond envelope has one position, no sides, four corners', () => {
    // C = R = 1: 2·1·1−1−1+1 = 1 whole, 2·0 = 0 sides, four corners; two
    // corner parents and no side parents.
    const plan = planned(planOnPoint({ columns: 1, rows: 1, blockWidth: 192, blockHeight: 192 }));
    expect(plan.wholePositions).toBe(1);
    expect(plan.sideTriangles).toBe(0);
    expect(plan.cornerTriangles).toBe(4);
    expect(plan.sideParentSquares.count).toBe(0);
    expect(plan.sideParentSquares.leftoverTriangles).toBe(0);
    expect(plan.cornerParentSquares.count).toBe(2);
    expect(plan.cornerParentSquares.leftoverTriangles).toBe(0);
    expect(E.format(plan.theoretical.width)).toBe('12 sqrt2');
  });
});
