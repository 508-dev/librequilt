// librequilt -- G-01, the stored length: an exact whole number of sixteenths.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { gcd } from './integer';
import type { Exact } from './quadratic';
import * as E from './quadratic';
import type { Rational } from './rational';
import * as Q from './rational';

/** Sixteenths of an inch in one inch. */
export const SIXTEENTHS_PER_INCH = 16;

/**
 * The largest length the project stores, in sixteenths: 1000 inches.
 *
 * D-02 requires an out-of-range length to be refused, but the specification
 * states no range. This bound is provisional, documented here and raised as a
 * clarification in `docs/implementation-plan.md`; it is far above any bed quilt
 * and far below the point where sixteenths stop being exact in a JSON number.
 */
export const MAX_LENGTH_SIXTEENTHS = 1000 * SIXTEENTHS_PER_INCH;

declare const lengthBrand: unique symbol;

/**
 * A stored length, as a whole number of sixteenths of an inch (G-01).
 *
 * The value is a JavaScript number constrained to a non-negative integer, so
 * it serialises to JSON as the integer sixteenth count D-01 requires. It is a
 * count, never a fraction of an inch: no stored length is ever a binary
 * floating-point approximation of a measurement. Arithmetic that produces
 * fractions happens in `Rational` and `Exact`, which are exact.
 *
 * Zero is representable because G-01 allows it for an absent optional sash or
 * border. Every other field must reject it; `parseLength` does so unless
 * `allowZero` is set.
 */
export type Sixteenths = number & { readonly [lengthBrand]: 'Sixteenths' };

/** True when the number is a legal stored length. */
export function isSixteenths(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_LENGTH_SIXTEENTHS;
}

/**
 * Assert a sixteenth count and brand it.
 *
 * Throws on an invalid count: reaching here with one is a defect in the
 * caller, not quilter input. Use `parseLength` for anything a quilter typed.
 */
export function sixteenths(value: number): Sixteenths {
  if (!isSixteenths(value)) {
    throw new RangeError(`not a stored length in sixteenths of an inch: ${value}`);
  }
  return value as Sixteenths;
}

/** A length of whole inches. */
export function inches(count: number): Sixteenths {
  return sixteenths(count * SIXTEENTHS_PER_INCH);
}

/** The length as an exact rational number of inches. */
export function toRational(length: Sixteenths): Rational {
  return Q.rational(BigInt(length), BigInt(SIXTEENTHS_PER_INCH));
}

/** The length as an exact value, ready to combine with diagonals. */
export function toExact(length: Sixteenths): Exact {
  return E.fromRational(toRational(length));
}

/** The underlying sixteenth count, for serialisation and for tests. */
export function toSixteenthCount(length: Sixteenths): number {
  return length;
}

/**
 * The length as a mixed number of inches: `3`, `3 1/2`, `3 7/8`, `1/2`, `0`.
 *
 * This is the form a cutting chart prints, and the form the specification's
 * fixtures use.
 */
export function formatInches(length: Sixteenths): string {
  const whole = Math.floor(length / SIXTEENTHS_PER_INCH);
  const remainder = length % SIXTEENTHS_PER_INCH;
  if (remainder === 0) return String(whole);
  const divisor = Number(gcd(BigInt(remainder), BigInt(SIXTEENTHS_PER_INCH)));
  const fraction = `${remainder / divisor}/${SIXTEENTHS_PER_INCH / divisor}`;
  return whole === 0 ? fraction : `${whole} ${fraction}`;
}

/** Why an entered length was refused. */
export type LengthProblem =
  | { readonly kind: 'empty' }
  | { readonly kind: 'not-a-length'; readonly text: string }
  | { readonly kind: 'negative' }
  | { readonly kind: 'zero-not-allowed' }
  | { readonly kind: 'finer-than-a-sixteenth'; readonly text: string }
  | { readonly kind: 'out-of-range'; readonly maximumInches: number };

/** The outcome of reading a length a quilter typed. */
export type ParsedLength =
  | { readonly ok: true; readonly value: Sixteenths }
  | { readonly ok: false; readonly problem: LengthProblem };

/** How a length may be entered. */
export interface ParseLengthOptions {
  /** Permit zero, for an optional sash or border that is absent (G-01). */
  readonly allowZero?: boolean;
}

const MIXED_NUMBER = /^(\d+)[\s-]+(\d+)\/(\d+)$/;
const FRACTION = /^(\d+)\/(\d+)$/;
const DECIMAL = /^(\d*)(?:\.(\d+))?$/;

/**
 * Read a length a quilter typed, in inches (G-01).
 *
 * Accepts a whole number (`3`), a mixed number (`3 1/2` or `3-1/2`), a bare
 * fraction (`1/2`) and a decimal (`3.5`, `3.0625`). A value between sixteenth
 * marks is refused rather than silently rounded, which is what G-01 requires
 * and what T-01 checks with `3.01`.
 *
 * The decimal route is parsed from its digits as an exact fraction, not through
 * `parseFloat`, so `3.0625` is recognised as exactly `49/16` and `3.01` as
 * exactly `301/100`, which is not a whole number of sixteenths.
 */
export function parseLength(text: string, options: ParseLengthOptions = {}): ParsedLength {
  const trimmed = text.trim();
  if (trimmed === '') return { ok: false, problem: { kind: 'empty' } };
  if (trimmed.startsWith('-')) return { ok: false, problem: { kind: 'negative' } };

  const value = readInches(trimmed);
  if (value === null) return { ok: false, problem: { kind: 'not-a-length', text: trimmed } };

  const scaled = Q.multiply(value, Q.fromInteger(SIXTEENTHS_PER_INCH));
  if (scaled.denominator !== 1n) {
    return { ok: false, problem: { kind: 'finer-than-a-sixteenth', text: trimmed } };
  }
  const count = Number(scaled.numerator);
  if (count === 0 && options.allowZero !== true) {
    return { ok: false, problem: { kind: 'zero-not-allowed' } };
  }
  if (!isSixteenths(count)) {
    return {
      ok: false,
      problem: { kind: 'out-of-range', maximumInches: MAX_LENGTH_SIXTEENTHS / SIXTEENTHS_PER_INCH },
    };
  }
  return { ok: true, value: count as Sixteenths };
}

/** A sentence a quilter can act on (A-01 requires understandable errors). */
export function describeLengthProblem(problem: LengthProblem): string {
  switch (problem.kind) {
    case 'empty':
      return 'Enter a measurement in inches.';
    case 'not-a-length':
      return `"${problem.text}" is not a measurement. Enter inches, such as 12, 2 1/2 or 3.75.`;
    case 'negative':
      return 'A measurement cannot be negative.';
    case 'zero-not-allowed':
      return 'This measurement has to be more than zero.';
    case 'finer-than-a-sixteenth':
      return `"${problem.text}" is finer than a sixteenth of an inch. Enter a measurement in sixteenths, such as 3 1/16, 3 1/8 or 3.0625.`;
    case 'out-of-range':
      return `A measurement has to be between zero and ${problem.maximumInches} inches.`;
  }
}

/** Parse the accepted spellings into an exact rational number of inches. */
function readInches(text: string): Rational | null {
  const mixed = MIXED_NUMBER.exec(text);
  if (mixed) {
    const [, whole, numerator, denominator] = mixed;
    if (denominator === '0') return null;
    return Q.add(
      Q.rational(BigInt(whole as string)),
      Q.rational(BigInt(numerator as string), BigInt(denominator as string)),
    );
  }
  const fraction = FRACTION.exec(text);
  if (fraction) {
    const [, numerator, denominator] = fraction;
    if (denominator === '0') return null;
    return Q.rational(BigInt(numerator as string), BigInt(denominator as string));
  }
  const decimal = DECIMAL.exec(text);
  if (decimal) {
    const [, whole, fractionalDigits] = decimal;
    if ((whole ?? '') === '' && fractionalDigits === undefined) return null;
    const digits = fractionalDigits ?? '';
    const scale = 10n ** BigInt(digits.length);
    const numerator = BigInt((whole ?? '') === '' ? '0' : (whole as string)) * scale;
    return Q.rational(numerator + BigInt(digits === '' ? '0' : digits), scale);
  }
  return null;
}
