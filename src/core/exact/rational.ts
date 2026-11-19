// librequilt -- exact rational numbers for the measurement core.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ceilDiv, floorDiv, gcd, signum } from './integer';

/**
 * An exact rational, always in lowest terms with a positive denominator.
 *
 * Fabric arithmetic mixes halves, eighths, sixteenths, ninths (an eighth of a
 * yard is 4 1/2 inches, so a yard count divides by 9/2) and percentages for
 * waste and shrinkage. None of those is exact in binary floating point, and
 * G-02 rounds exactly once, at the end, so the intermediate value has to be
 * exact.
 */
export interface Rational {
  readonly numerator: bigint;
  readonly denominator: bigint;
}

/** Build a rational in lowest terms. The denominator may not be zero. */
export function rational(numerator: bigint, denominator: bigint = 1n): Rational {
  if (denominator === 0n) throw new RangeError('a rational cannot have a zero denominator');
  const sign = denominator < 0n ? -1n : 1n;
  const n = numerator * sign;
  const d = denominator * sign;
  const divisor = gcd(n, d);
  if (divisor === 0n) return { numerator: 0n, denominator: 1n };
  return { numerator: n / divisor, denominator: d / divisor };
}

export const ZERO: Rational = { numerator: 0n, denominator: 1n };
export const ONE: Rational = { numerator: 1n, denominator: 1n };

/** Build a rational from a safe integer. */
export function fromInteger(value: number): Rational {
  if (!Number.isSafeInteger(value)) throw new RangeError(`not a safe integer: ${value}`);
  return { numerator: BigInt(value), denominator: 1n };
}

export function add(left: Rational, right: Rational): Rational {
  return rational(
    left.numerator * right.denominator + right.numerator * left.denominator,
    left.denominator * right.denominator,
  );
}

export function subtract(left: Rational, right: Rational): Rational {
  return rational(
    left.numerator * right.denominator - right.numerator * left.denominator,
    left.denominator * right.denominator,
  );
}

export function multiply(left: Rational, right: Rational): Rational {
  return rational(left.numerator * right.numerator, left.denominator * right.denominator);
}

export function divide(left: Rational, right: Rational): Rational {
  if (right.numerator === 0n) throw new RangeError('division of a rational by zero');
  return rational(left.numerator * right.denominator, left.denominator * right.numerator);
}

export function negate(value: Rational): Rational {
  return { numerator: -value.numerator, denominator: value.denominator };
}

export function signOf(value: Rational): -1 | 0 | 1 {
  return signum(value.numerator);
}

export function isZero(value: Rational): boolean {
  return value.numerator === 0n;
}

export function compare(left: Rational, right: Rational): -1 | 0 | 1 {
  return signum(left.numerator * right.denominator - right.numerator * left.denominator);
}

export function equals(left: Rational, right: Rational): boolean {
  return left.numerator === right.numerator && left.denominator === right.denominator;
}

/** The greatest integer not greater than the value. */
export function floorOf(value: Rational): bigint {
  return floorDiv(value.numerator, value.denominator);
}

/** The least integer not less than the value. */
export function ceilOf(value: Rational): bigint {
  return ceilDiv(value.numerator, value.denominator);
}

/** `3/4` or `-7/2`, or a bare integer when the denominator is one. */
export function format(value: Rational): string {
  return value.denominator === 1n
    ? value.numerator.toString()
    : `${value.numerator}/${value.denominator}`;
}

/**
 * An approximation, for display and for diagnostics only.
 *
 * Never feed the result back into a cut or purchase calculation: that is the
 * rounding mistake G-02 exists to prevent.
 */
export function toApproximateNumber(value: Rational): number {
  return Number(value.numerator) / Number(value.denominator);
}
