// librequilt -- exact integer helpers for the measurement core.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Integer helpers over `bigint`. The measurement core never uses a binary
 * floating-point value in a computation whose result reaches a cut dimension or
 * a purchase quantity (G-02), so every primitive here is exact.
 */

/** Absolute value. */
export function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

/** Sign of an integer, as -1, 0 or 1. */
export function signum(value: bigint): -1 | 0 | 1 {
  if (value > 0n) return 1;
  if (value < 0n) return -1;
  return 0;
}

/** Greatest common divisor of two integers, always non-negative. */
export function gcd(left: bigint, right: bigint): bigint {
  let a = abs(left);
  let b = abs(right);
  while (b !== 0n) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a;
}

/** Least common multiple of two non-zero integers, always positive. */
export function lcm(left: bigint, right: bigint): bigint {
  if (left === 0n || right === 0n) throw new RangeError('lcm of zero is undefined');
  return abs(left / gcd(left, right)) * abs(right);
}

/** Floor division by a positive divisor. */
export function floorDiv(dividend: bigint, divisor: bigint): bigint {
  if (divisor <= 0n) throw new RangeError('floorDiv needs a positive divisor');
  const quotient = dividend / divisor;
  return dividend % divisor !== 0n && dividend < 0n ? quotient - 1n : quotient;
}

/** Ceiling division by a positive divisor. */
export function ceilDiv(dividend: bigint, divisor: bigint): bigint {
  if (divisor <= 0n) throw new RangeError('ceilDiv needs a positive divisor');
  const quotient = dividend / divisor;
  return dividend % divisor !== 0n && dividend > 0n ? quotient + 1n : quotient;
}

/**
 * Integer square root: the largest `r` with `r * r <= value`.
 *
 * Newton's method from an over-estimate, so the sequence decreases
 * monotonically to the floor. Used to decide `n >= q * sqrt(2)` exactly, which
 * is how a diagonal is rounded without ever becoming a float (G-02).
 */
export function isqrt(value: bigint): bigint {
  if (value < 0n) throw new RangeError('isqrt of a negative integer');
  if (value < 2n) return value;
  const bits = value.toString(2).length;
  let estimate = 1n << BigInt((bits >> 1) + 1);
  for (;;) {
    const next = (estimate + value / estimate) >> 1n;
    if (next >= estimate) return estimate;
    estimate = next;
  }
}
