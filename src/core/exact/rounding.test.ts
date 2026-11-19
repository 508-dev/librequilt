// librequilt -- tests for G-02, the rounding sequence.
//
// Every expected value below is quoted from the output of
// `python3 docs/specification-fixtures.py`, the specification's synthetic
// fixture script. The unrounded inputs are written out here in the test rather
// than in `src`: this ticket implements the rounding rule only, not the unit,
// layout or yardage formulas that will supply those inputs later.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as L from './length';
import * as E from './quadratic';
import * as Q from './rational';
import * as R from './rounding';

const q = (numerator: number, denominator = 1): Q.Rational =>
  Q.rational(BigInt(numerator), BigInt(denominator));
const rationalInches = (numerator: number, denominator = 1): E.Exact =>
  E.fromFraction(BigInt(numerator), BigInt(denominator));
/** `rational + coefficient * sqrt(2)` inches. */
const withRootTwo = (
  rationalNumerator: number,
  rationalDenominator: number,
  rootTwoNumerator: number,
  rootTwoDenominator = 1,
): E.Exact =>
  E.exact(q(rationalNumerator, rationalDenominator), q(rootTwoNumerator, rootTwoDenominator));

const cut = (unrounded: E.Exact): string =>
  L.formatInches(R.roundCutUpToEighthInch(unrounded).rounded);
const purchase = (rawInches: E.Exact): string =>
  R.formatYards(R.roundPurchaseUpToEighthYard(rawInches).rounded);

describe('a cut rounds up to the next eighth of an inch', () => {
  test('an exact eighth stays unchanged', () => {
    // fixtures CUTS: "square / strip: 3 1/2", "HST 2 trim: 4",
    // "HST 8: 7 3/4", "HST 8 trim: 8", "QST trim: 4 1/2",
    // "FG one rect 4 x 2: 4 1/2 x 2 1/2", "FG four large: 5 1/4",
    // "FG four small: 2 7/8", "stitch flip corner 3: 3 1/2",
    // "square in square ... corner parents: 3 7/8",
    // "strip set width 2; subcut 6: 2 1/2 x 6 1/2".
    expect(cut(rationalInches(7, 2))).toBe('3 1/2');
    expect(cut(rationalInches(4))).toBe('4');
    expect(cut(rationalInches(31, 4))).toBe('7 3/4');
    expect(cut(rationalInches(8))).toBe('8');
    expect(cut(rationalInches(9, 2))).toBe('4 1/2');
    expect(cut(rationalInches(5, 2))).toBe('2 1/2');
    expect(cut(rationalInches(21, 4))).toBe('5 1/4');
    expect(cut(rationalInches(23, 8))).toBe('2 7/8');
    expect(cut(rationalInches(31, 8))).toBe('3 7/8');
    expect(cut(rationalInches(13, 2))).toBe('6 1/2');
  });

  test('a sixteenth over an eighth rounds up by a sixteenth', () => {
    expect(cut(rationalInches(49, 16))).toBe('3 1/8'); // 3 1/16 -> 3 1/8
    expect(cut(rationalInches(1, 16))).toBe('1/8');
    expect(cut(rationalInches(63, 16))).toBe('4'); // 3 15/16 -> 4
  });

  test('rounds the irrational geometry of a bias seam exactly', () => {
    // fixtures CUTS, for a 3-inch finished unit:
    //   "HST 2: 3 7/8"              from (3 + 1/2) + 1/(2 sqrt 2)
    //   "HST 4 corrected: 5 1/2"    from (3 + 1/2) sqrt 2 + 1/2
    //   "QST / hourglass: 4 1/4"    from (3 + 1/2) + 1/sqrt 2
    //   "square in square, 6 outer: centre: 4 3/4"  from 6/sqrt 2 + 1/2
    expect(cut(withRootTwo(7, 2, 1, 4))).toBe('3 7/8');
    expect(cut(withRootTwo(1, 2, 7, 2))).toBe('5 1/2');
    expect(cut(withRootTwo(7, 2, 1, 2))).toBe('4 1/4');
    expect(cut(withRootTwo(1, 2, 3))).toBe('4 3/4');
  });

  test('rounds an on-point parent square exactly', () => {
    // fixtures LAYOUTS:
    //   "on point B=12 sash=0: side 18 1/4; corner 9 3/8"
    //   "on point B=12 sash=2: side 21 1/8; corner 10 7/8"
    // from t sqrt(2) + 1 1/4 and t / sqrt(2) + 7/8, with t = 12 then 14.
    expect(cut(withRootTwo(5, 4, 12))).toBe('18 1/4');
    expect(cut(withRootTwo(7, 8, 6))).toBe('9 3/8');
    expect(cut(withRootTwo(5, 4, 14))).toBe('21 1/8');
    expect(cut(withRootTwo(7, 8, 7))).toBe('10 7/8');
  });

  test('never produces the published four-at-a-time shortcuts', () => {
    // G-05 and T-01: "A 3-inch four-at-a-time HST result of 4 1/4 or 4 3/4
    // inches is an explicit failure."
    const corrected = cut(withRootTwo(1, 2, 7, 2));
    expect(corrected).not.toBe('4 1/4');
    expect(corrected).not.toBe('4 3/4');
  });

  test('reports the unrounded geometry alongside the cut', () => {
    // G-02: the raw value and the rounded amount are both reported, and the
    // unrounded value is the one that may travel onward.
    const result = R.roundCutUpToEighthInch(withRootTwo(7, 2, 1, 4));
    expect(E.isRational(result.unrounded)).toBe(false);
    expect(E.format(result.unrounded)).toBe('7/2 + 1/4 sqrt2');
    expect(L.toSixteenthCount(result.rounded)).toBe(62);
  });

  test('always lands on a whole eighth, at or above the input', () => {
    for (let sixteenth = 0; sixteenth <= 200; sixteenth += 1) {
      const input = rationalInches(sixteenth, 16);
      const result = R.roundCutUpToEighthInch(input);
      const count = L.toSixteenthCount(result.rounded);
      expect(count % R.SIXTEENTHS_PER_EIGHTH).toBe(0);
      expect(count).toBeGreaterThanOrEqual(sixteenth);
      expect(count - sixteenth).toBeLessThan(R.SIXTEENTHS_PER_EIGHTH);
    }
  });

  test('refuses a negative cut', () => {
    expect(() => R.roundCutUpToEighthInch(rationalInches(-1, 8))).toThrow(RangeError);
  });
});

describe('a purchase rounds up to the next eighth of a yard', () => {
  test('matches every yardage figure in T-04', () => {
    // fixtures YARDAGE (an eighth of a yard is 4 1/2 inches):
    //   "13 squares 4.5: ... 9 in; 0 1/4 yd"
    //   "17 sash 2.5 x 12.5: ... 25 in; 0 3/4 yd"
    //   "12 cornerstones 2.5: ... 2 1/2 in; 0 1/8 yd"
    //   "17 sash ... non-directional: ... 15 in; 0 1/2 yd"
    //   "four 4 1/2 in borders, joined strips: ... 22 1/2 in; 0 5/8 yd"
    //   "four 4 1/2 in borders, one shared lengthwise cut: 44 1/2 in; 1 1/4 yd"
    //   "2 top borders lengthwise: ... 38 1/2 in; 1 1/8 yd"
    //   "WRONG (separate lengthwise cuts summed): 83 in; 2 3/8 yd"
    //   "sashes and cornerstones in one fabric: ... 17 1/2 in; 0 1/2 yd"
    expect(purchase(rationalInches(9))).toBe('1/4');
    expect(purchase(rationalInches(25))).toBe('3/4');
    expect(purchase(rationalInches(5, 2))).toBe('1/8');
    expect(purchase(rationalInches(15))).toBe('1/2');
    expect(purchase(rationalInches(45, 2))).toBe('5/8');
    expect(purchase(rationalInches(89, 2))).toBe('1 1/4');
    expect(purchase(rationalInches(77, 2))).toBe('1 1/8');
    expect(purchase(rationalInches(83))).toBe('2 3/8');
    expect(purchase(rationalInches(35, 2))).toBe('1/2');
  });

  test('matches the binding, backing and batting figures in T-05', () => {
    // fixtures BINDING AND BACKING:
    //   "binding 60x72 ... join10 ...: 7 strips, 35/2 in, 1/2 yd"
    //   "binding 60x72 ... join20 ...: 8 strips, 20 in, 5/8 yd"
    //   "backing 60x80 ... width 40 ...: lengthwise 176 in; 5 yd;
    //     turned 204 in; 5 3/4 yd"
    //   "backing 60x80 ... width 108 ...: lengthwise 88 in; 2 1/2 yd;
    //     turned 68 in; 2 yd"
    expect(purchase(rationalInches(35, 2))).toBe('1/2');
    expect(purchase(rationalInches(20))).toBe('5/8');
    expect(purchase(rationalInches(176))).toBe('5');
    expect(purchase(rationalInches(204))).toBe('5 3/4');
    expect(purchase(rationalInches(88))).toBe('2 1/2');
    expect(purchase(rationalInches(68))).toBe('2');
  });

  test('rounds a waste and shrinkage adjustment once, from the exact value', () => {
    // T-04: with w = 10% and s = 5%, raw 25 inches adjusts to 25 x 1.10 / 0.95
    // and rounds to 7/8 yard; the default zero factors give 3/4 yard.
    // fixtures: "25 in planned length, waste10%, shrink5%: 0 7/8 yd".
    const adjusted = E.fromRational(Q.divide(Q.multiply(q(25), q(11, 10)), q(95, 100)));
    expect(Q.format(adjusted.rationalPart)).toBe('550/19');
    expect(purchase(adjusted)).toBe('7/8');
    expect(purchase(rationalInches(25))).toBe('3/4');
  });

  test('an exact eighth of a yard stays unchanged', () => {
    expect(purchase(rationalInches(9, 2))).toBe('1/8'); // exactly 1/8 yard
    expect(purchase(rationalInches(9))).toBe('1/4'); // exactly 1/4 yard
    expect(purchase(rationalInches(45, 2))).toBe('5/8'); // exactly 5/8 yard
    expect(purchase(rationalInches(36))).toBe('1'); // exactly 1 yard
  });

  test('one sum rounded once buys less than two sums rounded separately', () => {
    // T-04 makes the separate-rounding mistake an explicit failure. Rounding
    // the two border lengths apart gives 1 1/4 + 1 1/8 = 2 3/8 yards; the plan
    // the chart actually uses needs 5/8.
    const separately =
      R.roundPurchaseUpToEighthYard(rationalInches(89, 2)).rounded +
      R.roundPurchaseUpToEighthYard(rationalInches(77, 2)).rounded;
    expect(R.formatYards(R.eighthYards(separately))).toBe('2 3/8');
    expect(purchase(rationalInches(45, 2))).toBe('5/8');
  });

  test('reports the raw planned length alongside the purchase', () => {
    const result = R.roundPurchaseUpToEighthYard(rationalInches(15));
    expect(E.format(result.unrounded)).toBe('15');
    expect(R.toEighthYardCount(result.rounded)).toBe(4);
    expect(R.formatYards(result.rounded)).toBe('1/2');
  });

  test('an eighth yard is exactly four and a half inches', () => {
    expect(E.equals(R.purchaseToExactInches(R.eighthYards(1)), rationalInches(9, 2))).toBe(true);
    expect(E.equals(R.purchaseToExactInches(R.eighthYards(8)), rationalInches(36))).toBe(true);
    expect(L.toSixteenthCount(L.sixteenths(72))).toBe(72); // 4 1/2 inches
  });

  test('zero buys nothing, and a negative length is refused', () => {
    expect(purchase(E.ZERO)).toBe('0');
    expect(() => R.roundPurchaseUpToEighthYard(rationalInches(-1))).toThrow(RangeError);
    expect(() => R.eighthYards(-1)).toThrow(RangeError);
    expect(() => R.eighthYards(1.5)).toThrow(RangeError);
  });

  test('always lands on a whole eighth yard, at or above the raw length', () => {
    for (let halfInch = 0; halfInch <= 420; halfInch += 1) {
      const raw = rationalInches(halfInch, 2);
      const result = R.roundPurchaseUpToEighthYard(raw);
      const boughtHalfInches = result.rounded * 9; // 4 1/2 inches = 9 half-inches
      expect(boughtHalfInches).toBeGreaterThanOrEqual(halfInch);
      expect(boughtHalfInches - halfInch).toBeLessThan(9);
    }
  });
});

describe('printing a purchase', () => {
  test('prints the mixed yard numbers a chart uses', () => {
    expect(R.formatYards(R.eighthYards(0))).toBe('0');
    expect(R.formatYards(R.eighthYards(1))).toBe('1/8');
    expect(R.formatYards(R.eighthYards(2))).toBe('1/4');
    expect(R.formatYards(R.eighthYards(6))).toBe('3/4');
    expect(R.formatYards(R.eighthYards(7))).toBe('7/8');
    expect(R.formatYards(R.eighthYards(8))).toBe('1');
    expect(R.formatYards(R.eighthYards(10))).toBe('1 1/4');
    expect(R.formatYards(R.eighthYards(19))).toBe('2 3/8');
    expect(R.formatYards(R.eighthYards(40))).toBe('5');
    expect(R.formatYards(R.eighthYards(46))).toBe('5 3/4');
  });
});
