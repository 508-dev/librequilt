// librequilt -- G-02, the rounding sequence: a cut up to an eighth inch,
// a purchase up to an eighth yard, each rounded exactly once.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { gcd } from './integer';
import type { Sixteenths } from './length';
import { MAX_LENGTH_SIXTEENTHS, sixteenths } from './length';
import type { Exact } from './quadratic';
import * as E from './quadratic';
import * as Q from './rational';

/** Eighths of an inch in one inch. */
export const EIGHTHS_PER_INCH = 8;

/** Sixteenths of an inch in one eighth. */
export const SIXTEENTHS_PER_EIGHTH = 2;

/** An eighth of a yard is 4 1/2 inches (G-02). */
export const EIGHTH_YARD_INCHES = Q.rational(9n, 2n);

/** Eighths of a yard in one yard. */
export const EIGHTHS_PER_YARD = 8;

declare const purchaseBrand: unique symbol;

/**
 * A purchase quantity, as a whole number of eighths of a yard (G-02).
 *
 * Fabric is bought in eighths of a yard, so the quantity is a count, not a
 * length. Its inch equivalent is exact: an eighth yard is 4 1/2 inches, which
 * is 72 sixteenths.
 */
export type EighthYards = number & { readonly [purchaseBrand]: 'EighthYards' };

/**
 * A rounded result together with the unrounded value it came from.
 *
 * G-02 requires both to be reported: a chart states the raw planned length
 * beside the purchasable amount, and a cut row is only trustworthy if the
 * geometry behind it can still be shown. Keeping them together makes it hard
 * to round twice by accident, because the unrounded value is the one that
 * travels onward.
 */
export interface Rounded<T> {
  /** The exact geometry before rounding. Never a float, never persisted. */
  readonly unrounded: Exact;
  /** The rounded result. */
  readonly rounded: T;
}

/**
 * Round a completed cut dimension up to the next eighth of an inch (G-02).
 *
 * The argument must already be the *finished* geometry plus the quarter-inch
 * seam margins and any construction allowance: G-02 forbids rounding an
 * intermediate diagonal, or a block before it is joined to another. An exact
 * eighth is returned unchanged.
 *
 * The input may be irrational -- a half-square-triangle parent carries
 * `1 / (2 sqrt 2)`, an on-point parent carries `t * sqrt 2` -- and the ceiling
 * is still computed exactly, with integer arithmetic only.
 */
export function roundCutUpToEighthInch(unrounded: Exact): Rounded<Sixteenths> {
  if (E.signOf(unrounded) < 0) {
    throw new RangeError(`a cut dimension cannot be negative: ${E.format(unrounded)}`);
  }
  const eighths = E.ceilOf(E.scale(unrounded, Q.fromInteger(EIGHTHS_PER_INCH)));
  const count = Number(eighths) * SIXTEENTHS_PER_EIGHTH;
  if (count > MAX_LENGTH_SIXTEENTHS) {
    throw new RangeError(`cut dimension out of range: ${E.format(unrounded)} inches`);
  }
  return { unrounded, rounded: sixteenths(count) };
}

/**
 * Round one fabric's summed raw bolt length up to the next eighth of a yard
 * (G-02).
 *
 * Call this once per fabric, on the sum of every raw planned length and after
 * any waste and shrinkage adjustment. Rounding each piece group separately and
 * adding the results buys fabric the plan never uses, which T-04 makes an
 * explicit failure.
 */
export function roundPurchaseUpToEighthYard(rawInches: Exact): Rounded<EighthYards> {
  if (E.signOf(rawInches) < 0) {
    throw new RangeError(`a planned length cannot be negative: ${E.format(rawInches)}`);
  }
  const eighths = E.ceilOf(E.divide(rawInches, E.fromRational(EIGHTH_YARD_INCHES)));
  const count = Number(eighths);
  if (!Number.isSafeInteger(count)) {
    throw new RangeError(`planned length out of range: ${E.format(rawInches)} inches`);
  }
  return { unrounded: rawInches, rounded: count as EighthYards };
}

/** Assert an eighth-yard count and brand it. */
export function eighthYards(count: number): EighthYards {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError(`not a purchase quantity in eighths of a yard: ${count}`);
  }
  return count as EighthYards;
}

/** The underlying eighth-yard count, for serialisation and for tests. */
export function toEighthYardCount(purchase: EighthYards): number {
  return purchase;
}

/** The exact inch length of a purchase quantity: an eighth yard is 4 1/2 inches. */
export function purchaseToExactInches(purchase: EighthYards): Exact {
  return E.fromRational(Q.multiply(Q.fromInteger(purchase), EIGHTH_YARD_INCHES));
}

/**
 * The purchase quantity as a mixed number of yards: `1/8`, `1/4`, `1 1/4`, `5`.
 */
export function formatYards(purchase: EighthYards): string {
  const whole = Math.floor(purchase / EIGHTHS_PER_YARD);
  const remainder = purchase % EIGHTHS_PER_YARD;
  if (remainder === 0) return String(whole);
  const divisor = Number(gcd(BigInt(remainder), BigInt(EIGHTHS_PER_YARD)));
  const fraction = `${remainder / divisor}/${EIGHTHS_PER_YARD / divisor}`;
  return whole === 0 ? fraction : `${whole} ${fraction}`;
}
