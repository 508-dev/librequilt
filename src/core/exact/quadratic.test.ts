// librequilt -- tests for exact arithmetic in Q(sqrt 2).
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as E from './quadratic';
import * as Q from './rational';

const q = (numerator: number, denominator = 1): Q.Rational =>
  Q.rational(BigInt(numerator), BigInt(denominator));
const x = (rationalPart: Q.Rational, rootTwoPart: Q.Rational = Q.ZERO): E.Exact =>
  E.exact(rationalPart, rootTwoPart);

describe('the field', () => {
  test('sqrt(2) squared is exactly two', () => {
    expect(E.equals(E.multiply(E.SQRT2, E.SQRT2), E.fromInteger(2))).toBe(true);
  });

  test('division by sqrt(2) is multiplication by sqrt(2)/2', () => {
    // 12 / sqrt(2) = 6 sqrt(2): the on-point corner relation of L-05.
    const quotient = E.divide(E.fromInteger(12), E.SQRT2);
    expect(E.equals(quotient, x(Q.ZERO, q(6)))).toBe(true);
  });

  test('a quarter-inch seam projected onto a bias edge is sqrt(2)/4', () => {
    // 1 / (2 sqrt 2), the term G-04 adds to a half-square-triangle parent.
    const projected = E.divide(E.fromInteger(1), E.scale(E.SQRT2, q(2)));
    expect(E.equals(projected, x(Q.ZERO, q(1, 4)))).toBe(true);
  });

  test('add, subtract, negate and scale', () => {
    const left = x(q(5, 4), q(12));
    const right = x(q(1, 2), q(-2));
    expect(E.add(left, right)).toEqual(x(q(7, 4), q(10)));
    expect(E.subtract(left, right)).toEqual(x(q(3, 4), q(14)));
    expect(E.negate(left)).toEqual(x(q(-5, 4), q(-12)));
    expect(E.scale(left, q(8))).toEqual(x(q(10), q(96)));
  });

  test('refuses division by zero', () => {
    expect(() => E.divide(E.ONE, E.ZERO)).toThrow(RangeError);
  });

  test('knows whether a value is rational', () => {
    expect(E.isRational(E.fromFraction(7n, 2n))).toBe(true);
    expect(E.isRational(E.SQRT2)).toBe(false);
    // sqrt(2) * sqrt(2) leaves the irrational part behind.
    expect(E.isRational(E.multiply(E.SQRT2, E.SQRT2))).toBe(true);
  });
});

describe('sign and comparison', () => {
  test('decides mixed signs without floating point', () => {
    // 1.4142... compared with 1.4 and 1.5, exactly.
    expect(E.compare(E.SQRT2, E.fromFraction(14n, 10n))).toBe(1);
    expect(E.compare(E.SQRT2, E.fromFraction(15n, 10n))).toBe(-1);
    // 99/70 is a famous near-miss: 99/70 > sqrt(2) by about 7e-5.
    expect(E.compare(E.SQRT2, E.fromFraction(99n, 70n))).toBe(-1);
    // 239/169 approaches from below.
    expect(E.compare(E.SQRT2, E.fromFraction(239n, 169n))).toBe(1);
  });

  test('reports zero, positive and negative', () => {
    expect(E.signOf(E.ZERO)).toBe(0);
    expect(E.signOf(x(q(-5), q(4)))).toBe(1); // 4 sqrt2 = 5.656... > 5
    expect(E.signOf(x(q(-6), q(4)))).toBe(-1); // 5.656... < 6
    expect(E.signOf(x(q(5), q(-4)))).toBe(-1);
    expect(E.signOf(x(q(6), q(-4)))).toBe(1);
    expect(E.signOf(E.subtract(E.SQRT2, E.SQRT2))).toBe(0);
  });
});

describe('exact floor and ceiling', () => {
  test('agree with the integers around sqrt(2) multiples', () => {
    for (let n = 1; n <= 60; n += 1) {
      const value = E.scale(E.SQRT2, q(n));
      const floor = E.floorOf(value);
      const ceil = E.ceilOf(value);
      expect(ceil).toBe(floor + 1n); // n sqrt(2) is never an integer
      // floor^2 <= 2 n^2 < (floor + 1)^2, checked in integers.
      expect(floor * floor <= 2n * BigInt(n) * BigInt(n)).toBe(true);
      expect((floor + 1n) * (floor + 1n) > 2n * BigInt(n) * BigInt(n)).toBe(true);
    }
  });

  test('handle a negative sqrt(2) coefficient', () => {
    // 10 - 7 sqrt(2) = 0.100505...
    const value = x(q(10), q(-7));
    expect(E.floorOf(value)).toBe(0n);
    expect(E.ceilOf(value)).toBe(1n);
    // -sqrt(2) = -1.41421...
    expect(E.floorOf(E.negate(E.SQRT2))).toBe(-2n);
    expect(E.ceilOf(E.negate(E.SQRT2))).toBe(-1n);
  });

  test('leave an exact integer alone', () => {
    expect(E.ceilOf(E.fromInteger(4))).toBe(4n);
    expect(E.floorOf(E.fromInteger(4))).toBe(4n);
    expect(E.ceilOf(E.multiply(E.SQRT2, E.SQRT2))).toBe(2n);
  });

  test('divide a common denominator correctly', () => {
    // (10 + 96 sqrt 2) / 8 = 1.25 + 12 sqrt 2 = 18.2426...
    const value = x(q(5, 4), q(12));
    expect(E.floorOf(value)).toBe(18n);
    expect(E.ceilOf(value)).toBe(19n);
  });

  test('stay exact where a double would round the wrong way', () => {
    // 665857/470832 is the next convergent above sqrt(2); it differs by about
    // 1.6e-12, which a double can still see, but the comparison must not rely
    // on that. Scaled up, the margin leaves double precision entirely.
    const scaled = Q.rational(665857n, 470832n);
    const nearlyRootTwo = E.fromRational(scaled);
    expect(E.compare(nearlyRootTwo, E.SQRT2)).toBe(1);
    const huge = q(10 ** 15);
    expect(E.signOf(E.subtract(E.scale(nearlyRootTwo, huge), E.scale(E.SQRT2, huge)))).toBe(1);
  });
});

describe('display', () => {
  test('prints the two parts', () => {
    expect(E.format(E.fromFraction(7n, 2n))).toBe('7/2');
    expect(E.format(E.SQRT2)).toBe('1 sqrt2');
    expect(E.format(x(q(5, 4), q(12)))).toBe('5/4 + 12 sqrt2');
    expect(E.format(x(q(10), q(-7)))).toBe('10 - 7 sqrt2');
  });

  test('approximates only for display', () => {
    expect(E.toApproximateNumber(E.SQRT2)).toBeCloseTo(Math.SQRT2, 15);
    // L-04's on-point envelope: 24 sqrt(2) by 36 sqrt(2) inches.
    expect(E.toApproximateNumber(E.scale(E.SQRT2, q(24)))).toBeCloseTo(33.941125, 6);
    expect(E.toApproximateNumber(E.scale(E.SQRT2, q(36)))).toBeCloseTo(50.911688, 6);
  });
});
