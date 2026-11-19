// librequilt -- tests for the exact integer helpers.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import { ceilDiv, floorDiv, gcd, isqrt, lcm, signum } from './integer';

describe('gcd and lcm', () => {
  test('gcd is non-negative and sign-insensitive', () => {
    expect(gcd(12n, 18n)).toBe(6n);
    expect(gcd(-12n, 18n)).toBe(6n);
    expect(gcd(14n, 16n)).toBe(2n);
    expect(gcd(0n, 7n)).toBe(7n);
    expect(gcd(0n, 0n)).toBe(0n);
  });

  test('lcm is positive', () => {
    expect(lcm(4n, 6n)).toBe(12n);
    expect(lcm(-4n, 6n)).toBe(12n);
    expect(lcm(16n, 8n)).toBe(16n);
    expect(() => lcm(0n, 5n)).toThrow(RangeError);
  });
});

describe('floorDiv and ceilDiv', () => {
  test('round toward minus and plus infinity, not toward zero', () => {
    expect(floorDiv(7n, 2n)).toBe(3n);
    expect(floorDiv(-7n, 2n)).toBe(-4n);
    expect(floorDiv(-8n, 2n)).toBe(-4n);
    expect(ceilDiv(7n, 2n)).toBe(4n);
    expect(ceilDiv(8n, 2n)).toBe(4n);
    expect(ceilDiv(-7n, 2n)).toBe(-3n);
  });

  test('refuse a non-positive divisor', () => {
    expect(() => floorDiv(1n, 0n)).toThrow(RangeError);
    expect(() => ceilDiv(1n, -2n)).toThrow(RangeError);
  });
});

describe('isqrt', () => {
  test('is the floor of the square root', () => {
    // These are the comparisons the sqrt(2) ceiling needs: isqrt(2 q^2).
    expect(isqrt(0n)).toBe(0n);
    expect(isqrt(1n)).toBe(1n);
    expect(isqrt(2n)).toBe(1n);
    expect(isqrt(8n)).toBe(2n);
    expect(isqrt(1568n)).toBe(39n);
    expect(isqrt(4608n)).toBe(67n);
    expect(isqrt(18432n)).toBe(135n);
    expect(isqrt(25088n)).toBe(158n);
  });

  test('is exact well past the range of a double', () => {
    const root = 10n ** 30n + 7n;
    expect(isqrt(root * root)).toBe(root);
    expect(isqrt(root * root - 1n)).toBe(root - 1n);
    expect(isqrt(root * root + 2n * root)).toBe(root);
  });

  test('holds the defining inequality over a wide sweep', () => {
    for (let n = 0n; n < 400n; n += 1n) {
      const r = isqrt(n);
      expect(r * r <= n).toBe(true);
      expect((r + 1n) * (r + 1n) > n).toBe(true);
    }
  });

  test('refuses a negative input', () => {
    expect(() => isqrt(-1n)).toThrow(RangeError);
  });
});

describe('signum', () => {
  test('reports -1, 0 or 1', () => {
    expect(signum(-9n)).toBe(-1);
    expect(signum(0n)).toBe(0);
    expect(signum(9n)).toBe(1);
  });
});
