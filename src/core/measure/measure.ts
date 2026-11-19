// librequilt -- P-01 display readouts: mixed-number inches and yards, and the
// approximate metric readouts printed beside them.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import type { Rational } from '../exact/rational';
import * as Q from '../exact/rational';
import type { EighthYards } from '../exact/rounding';
import * as R from '../exact/rounding';

/**
 * P-01 (display) and O-04: the readouts a chart prints.
 *
 * A readout is a leaf of the derivation graph (I3): it is derived from a stored
 * value and never fed back into a cut or purchase calculation. The mixed-number
 * inch and yard spellings live in `core/exact` because they follow G-01 and
 * G-02; this module is the single place the chart turns to for every display
 * spelling, and it adds the metric readouts -- centimetres to two decimals and
 * metres to three, each labelled approximate (O-04).
 *
 * The metric conversions are exact rationals:
 *
 * - one inch is exactly 2.54 centimetres, `254/100 = 127/50`;
 * - one yard is exactly 0.9144 metres, `9144/10000 = 1143/1250`.
 *
 * A metric display value is rounded half-up to its stated number of decimals
 * from that exact rational, never through a binary floating-point value, so a
 * display can never drift (I1) and O-04's "stored inches never change" holds by
 * construction.
 */

/** One inch is exactly 2.54 centimetres: `254/100 = 127/50`. */
const CENTIMETRES_PER_INCH: Rational = Q.rational(127n, 50n);

/** One yard is exactly 0.9144 metres: `9144/10000 = 1143/1250`. */
const METRES_PER_YARD: Rational = Q.rational(1143n, 1250n);

/** Eighths of a yard in one yard (G-02). */
const EIGHTHS_PER_YARD = 8;

/**
 * A metric readout: a display value derived exactly, never an input (I3, O-04).
 *
 * `exact` is the unrounded rational in the metric unit, kept beside the rounded
 * `text` so the derivation stays visible and nothing downstream can reuse the
 * rounded figure as if it were exact.
 */
export interface MetricReadout {
  /** The exact value in the metric unit, before display rounding. */
  readonly exact: Rational;
  /** The rounded display text, without the unit: `8.89`, `0.229`. */
  readonly text: string;
  /** The metric unit. */
  readonly unit: 'cm' | 'm';
  /** Metric readouts are always approximate (O-04). */
  readonly approximate: true;
}

/**
 * The inch readout of a stored length: a mixed number like `3 1/2`, `1/2` or
 * `0` (P-01). This is the spelling `core/exact` defines for G-01.
 */
export function inches(length: Sixteenths): string {
  return L.formatInches(length);
}

/**
 * The yard readout of a purchase: a mixed number like `1/4` or `1 1/4` (P-01).
 * This is the spelling `core/exact` defines for G-02.
 */
export function yards(purchase: EighthYards): string {
  return R.formatYards(purchase);
}

/**
 * The centimetre readout of an exact length in inches, to two decimals (O-04).
 *
 * The input is an exact rational number of inches -- a stored cut, a raw
 * planned length, or an on-point dimension already rounded to a sixteenth for
 * display (L-04). The conversion is exact and the text is rounded half-up.
 */
export function centimetres(inches: Rational): MetricReadout {
  return toMetricReadout(Q.multiply(inches, CENTIMETRES_PER_INCH), 'cm', 2);
}

/** The centimetre readout of a stored length, whole sixteenths of an inch. */
export function centimetresOf(length: Sixteenths): MetricReadout {
  return centimetres(L.toRational(length));
}

/**
 * The metre readout of a purchase, to three decimals (O-04, P-01).
 *
 * P-01 is specific: metre totals convert the *rounded purchasable yards*, not
 * the raw planned length. This function therefore takes an `EighthYards`
 * purchase -- the rounded value -- and cannot be handed a raw length by mistake.
 */
export function metres(purchase: EighthYards): MetricReadout {
  const yards = Q.divide(Q.fromInteger(purchase), Q.fromInteger(EIGHTHS_PER_YARD));
  return toMetricReadout(Q.multiply(yards, METRES_PER_YARD), 'm', 3);
}

/**
 * The approximate label a chart prints, for example `≈ 0.229 m`.
 *
 * The `≈` marks the value approximate (O-04). A chart may word the label
 * differently -- T-04a writes "about 0.229 m" -- but the `approximate` flag,
 * not the glyph, is the contract.
 */
export function describeMetric(readout: MetricReadout): string {
  return `≈ ${readout.text} ${readout.unit}`;
}

/**
 * Round an exact non-negative rational to `places` decimals, half-up, and
 * format it with exactly `places` fractional digits, all in integer arithmetic,
 * so the display never passes through a binary float.
 */
function toMetricReadout(exact: Rational, unit: 'cm' | 'm', places: number): MetricReadout {
  if (Q.signOf(exact) < 0) {
    throw new RangeError(`a metric readout cannot be negative: ${Q.format(exact)}`);
  }
  const scale = 10n ** BigInt(places);
  // `floor(value * 10^places + 1/2)` is round-half-up, exactly, for `value >= 0`.
  const rounded = Q.floorOf(Q.add(Q.multiply(exact, Q.rational(scale)), Q.rational(1n, 2n)));
  const whole = rounded / scale;
  const fraction = (rounded % scale).toString().padStart(places, '0');
  return { exact, text: `${whole}.${fraction}`, unit, approximate: true };
}
