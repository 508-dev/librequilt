// librequilt -- tests for exact rational arithmetic.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as Q from './rational';

const q = (numerator: number, denominator = 1): Q.Rational =>
  Q.rational(BigInt(numerator), BigInt(denominator));

describe('construction', () => {
  test('normalises to lowest terms with a positive denominator', () => {
    expect(q(6, 8)).toEqual({ numerator: 3n, denominator: 4n });
    expect(q(2, -4)).toEqual({ numerator: -1n, denominator: 2n });
    expect(q(0, 5)).toEqual({ numerator: 0n, denominator: 1n });
  });

  test('refuses a zero denominator', () => {
    expect(() => q(1, 0)).toThrow(RangeError);
  });

  test('refuses an unsafe integer', () => {
    expect(() => Q.fromInteger(0.5)).toThrow(RangeError);
    expect(() => Q.fromInteger(Number.MAX_SAFE_INTEGER + 2)).toThrow(RangeError);
  });
});

describe('arithmetic is exact where floating point is not', () => {
  test('a tenth added ten times is exactly one', () => {
    // 0.1 * 10 !== 1 in binary floating point; the measurement core cannot
    // afford that kind of drift before G-02's single rounding step.
    let total = Q.ZERO;
    for (let i = 0; i < 10; i += 1) total = Q.add(total, q(1, 10));
    expect(Q.equals(total, Q.ONE)).toBe(true);
  });

  test('an eighth of a yard times eight is exactly thirty-six inches', () => {
    const eighthYard = q(9, 2);
    expect(Q.equals(Q.multiply(eighthYard, q(8)), q(36))).toBe(true);
  });

  test('add, subtract, multiply, divide and negate', () => {
    expect(Q.add(q(1, 4), q(1, 8))).toEqual(q(3, 8));
    expect(Q.subtract(q(1, 4), q(1, 8))).toEqual(q(1, 8));
    expect(Q.multiply(q(3, 4), q(2, 3))).toEqual(q(1, 2));
    expect(Q.divide(q(3, 4), q(2, 3))).toEqual(q(9, 8));
    expect(Q.negate(q(3, 4))).toEqual(q(-3, 4));
    expect(() => Q.divide(q(1), Q.ZERO)).toThrow(RangeError);
  });

  test('the waste and shrinkage adjustment of T-04 stays exact', () => {
    // 25 inches at 10% waste over a 5% length shrink is exactly 550/19 inches,
    // which no decimal spelling represents.
    const adjusted = Q.divide(Q.multiply(q(25), q(11, 10)), q(95, 100));
    expect(adjusted).toEqual(q(550, 19));
  });
});

describe('comparison and rounding', () => {
  test('compare, sign and zero', () => {
    expect(Q.compare(q(1, 3), q(1, 2))).toBe(-1);
    expect(Q.compare(q(1, 2), q(1, 2))).toBe(0);
    expect(Q.compare(q(1, 2), q(1, 3))).toBe(1);
    expect(Q.signOf(q(-1, 3))).toBe(-1);
    expect(Q.isZero(Q.subtract(q(1, 2), q(2, 4)))).toBe(true);
  });

  test('floor and ceil go to minus and plus infinity', () => {
    expect(Q.floorOf(q(7, 2))).toBe(3n);
    expect(Q.ceilOf(q(7, 2))).toBe(4n);
    expect(Q.floorOf(q(-7, 2))).toBe(-4n);
    expect(Q.ceilOf(q(-7, 2))).toBe(-3n);
    expect(Q.ceilOf(q(4))).toBe(4n);
  });
});

describe('display', () => {
  test('prints as a fraction or a bare integer', () => {
    expect(Q.format(q(3, 4))).toBe('3/4');
    expect(Q.format(q(8, 2))).toBe('4');
    expect(Q.toApproximateNumber(q(1, 4))).toBe(0.25);
  });
});
