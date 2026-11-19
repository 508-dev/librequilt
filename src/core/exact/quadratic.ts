// librequilt -- exact arithmetic in Q(sqrt 2), the field quilt geometry needs.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { floorDiv, isqrt, lcm, signum } from './integer';
import type { Rational } from './rational';
import * as Q from './rational';

/**
 * An exact real number of the form `a + b * sqrt(2)`, with `a` and `b` exact
 * rationals.
 *
 * Every diagonal in the specification is a rational multiple of `sqrt(2)`: a
 * square's diagonal (`s * sqrt 2`), an on-point pitch (`t * sqrt 2`), an
 * on-point corner (`t / sqrt 2`), a quarter-inch seam projected onto a bias
 * edge (`1 / (2 * sqrt 2)`). Rationals and `sqrt(2)` together are closed under
 * +, -, * and /, so the whole of G-02's "unrounded finished geometry" stays
 * exact until the single rounding step.
 *
 * G-01 therefore holds without compromise: a theoretical on-point dimension
 * involving sqrt(2) is never persisted as a rounded sixteenth, because it is
 * never rounded until an output asks for a cut.
 */
export interface Exact {
  /** The rational part. */
  readonly rationalPart: Rational;
  /** The coefficient of sqrt(2). */
  readonly rootTwoPart: Rational;
}

/** Build `a + b * sqrt(2)`. */
export function exact(rationalPart: Rational, rootTwoPart: Rational = Q.ZERO): Exact {
  return { rationalPart, rootTwoPart };
}

export const ZERO: Exact = exact(Q.ZERO);
export const ONE: Exact = exact(Q.ONE);
/** `sqrt(2)` itself. */
export const SQRT2: Exact = exact(Q.ZERO, Q.ONE);

/** Lift an exact rational. */
export function fromRational(value: Rational): Exact {
  return exact(value);
}

/** Lift a safe integer. */
export function fromInteger(value: number): Exact {
  return exact(Q.fromInteger(value));
}

/** Lift the fraction `numerator / denominator`. */
export function fromFraction(numerator: bigint, denominator: bigint = 1n): Exact {
  return exact(Q.rational(numerator, denominator));
}

/** True when the value has no `sqrt(2)` component, so it is an exact rational. */
export function isRational(value: Exact): boolean {
  return Q.isZero(value.rootTwoPart);
}

export function add(left: Exact, right: Exact): Exact {
  return exact(
    Q.add(left.rationalPart, right.rationalPart),
    Q.add(left.rootTwoPart, right.rootTwoPart),
  );
}

export function subtract(left: Exact, right: Exact): Exact {
  return exact(
    Q.subtract(left.rationalPart, right.rationalPart),
    Q.subtract(left.rootTwoPart, right.rootTwoPart),
  );
}

/** `(a1 + b1 r)(a2 + b2 r) = (a1 a2 + 2 b1 b2) + (a1 b2 + a2 b1) r`, with `r = sqrt 2`. */
export function multiply(left: Exact, right: Exact): Exact {
  const two = Q.fromInteger(2);
  return exact(
    Q.add(
      Q.multiply(left.rationalPart, right.rationalPart),
      Q.multiply(two, Q.multiply(left.rootTwoPart, right.rootTwoPart)),
    ),
    Q.add(
      Q.multiply(left.rationalPart, right.rootTwoPart),
      Q.multiply(right.rationalPart, left.rootTwoPart),
    ),
  );
}

/**
 * Exact division, by multiplying with the conjugate:
 * `1 / (a + b r) = (a - b r) / (a^2 - 2 b^2)`.
 *
 * The norm `a^2 - 2 b^2` vanishes only at zero, because `sqrt(2)` is
 * irrational, so a non-zero divisor is always invertible.
 */
export function divide(left: Exact, right: Exact): Exact {
  const norm = Q.subtract(
    Q.multiply(right.rationalPart, right.rationalPart),
    Q.multiply(Q.fromInteger(2), Q.multiply(right.rootTwoPart, right.rootTwoPart)),
  );
  if (Q.isZero(norm)) throw new RangeError('division of an exact value by zero');
  const conjugate = exact(right.rationalPart, Q.negate(right.rootTwoPart));
  const product = multiply(left, conjugate);
  return exact(Q.divide(product.rationalPart, norm), Q.divide(product.rootTwoPart, norm));
}

export function negate(value: Exact): Exact {
  return exact(Q.negate(value.rationalPart), Q.negate(value.rootTwoPart));
}

/** Multiply by an exact rational. */
export function scale(value: Exact, factor: Rational): Exact {
  return exact(Q.multiply(value.rationalPart, factor), Q.multiply(value.rootTwoPart, factor));
}

/**
 * Sign of `a + b * sqrt(2)`, decided with integer arithmetic alone.
 *
 * Over a common positive denominator the value is `(p + q * sqrt 2) / d`. When
 * `p` and `q` share a sign the answer is immediate; when they oppose, compare
 * `p^2` with `2 q^2`, which is an exact integer comparison.
 */
export function signOf(value: Exact): -1 | 0 | 1 {
  const { p, q } = overCommonDenominator(value);
  if (q === 0n) return signum(p);
  if (p === 0n) return signum(q);
  if (p > 0n && q > 0n) return 1;
  if (p < 0n && q < 0n) return -1;
  // One term is positive and the other negative, so the larger magnitude wins.
  // `p * p === 2 * q * q` would make sqrt(2) rational, so it cannot happen.
  const compared = signum(p * p - 2n * q * q);
  if (compared === 0) throw new Error('unreachable: sqrt(2) is irrational');
  if (p > 0n) return compared > 0 ? 1 : -1;
  return compared > 0 ? -1 : 1;
}

export function compare(left: Exact, right: Exact): -1 | 0 | 1 {
  return signOf(subtract(left, right));
}

export function equals(left: Exact, right: Exact): boolean {
  return (
    Q.equals(left.rationalPart, right.rationalPart) && Q.equals(left.rootTwoPart, right.rootTwoPart)
  );
}

/**
 * The greatest integer not greater than the value, computed exactly.
 *
 * Writing the value as `(p + q * sqrt 2) / d` with integer `p`, `q` and
 * positive integer `d`:
 *
 * - `floor(p + q sqrt 2)` is `p + isqrt(2 q^2)` for `q >= 0`, because
 *   `isqrt(2 q^2) = floor(q sqrt 2)` and `p` is an integer;
 * - for `q < 0` it is `p - (isqrt(2 q^2) + 1)`, since `|q| sqrt 2` is
 *   irrational, so `ceil(|q| sqrt 2) = floor(|q| sqrt 2) + 1`;
 * - and `floor(x / d) = floor(floor(x) / d)` for a positive integer `d`.
 */
export function floorOf(value: Exact): bigint {
  const { p, q, d } = overCommonDenominator(value);
  const root = isqrt(2n * q * q);
  const floorNumerator = q >= 0n ? p + root : p - (root + 1n);
  return floorDiv(floorNumerator, d);
}

/**
 * The least integer not less than the value, computed exactly.
 *
 * With a non-zero `sqrt(2)` component the value is irrational, so it is never
 * an integer and the ceiling is one above the floor.
 */
export function ceilOf(value: Exact): bigint {
  if (isRational(value)) return Q.ceilOf(value.rationalPart);
  return floorOf(value) + 1n;
}

/** `3`, `7/2`, `1/4 sqrt2` or `5/4 + 12 sqrt2`. */
export function format(value: Exact): string {
  if (isRational(value)) return Q.format(value.rationalPart);
  const root = `${Q.format(value.rootTwoPart)} sqrt2`;
  if (Q.isZero(value.rationalPart)) return root;
  const sign = Q.signOf(value.rootTwoPart) < 0 ? '-' : '+';
  const magnitude =
    Q.signOf(value.rootTwoPart) < 0 ? Q.negate(value.rootTwoPart) : value.rootTwoPart;
  return `${Q.format(value.rationalPart)} ${sign} ${Q.format(magnitude)} sqrt2`;
}

/**
 * An approximation, for display and for diagnostics only.
 *
 * L-04 shows an irrational on-point dimension to the nearest sixteenth and
 * marks it approximate; that display value must never re-enter cut arithmetic.
 */
export function toApproximateNumber(value: Exact): number {
  return (
    Q.toApproximateNumber(value.rationalPart) +
    Q.toApproximateNumber(value.rootTwoPart) * Math.SQRT2
  );
}

/** Rewrite `a + b sqrt 2` as `(p + q sqrt 2) / d` with integer p, q and d > 0. */
function overCommonDenominator(value: Exact): { p: bigint; q: bigint; d: bigint } {
  const d = lcm(value.rationalPart.denominator, value.rootTwoPart.denominator);
  return {
    p: value.rationalPart.numerator * (d / value.rationalPart.denominator),
    q: value.rootTwoPart.numerator * (d / value.rootTwoPart.denominator),
    d,
  };
}
