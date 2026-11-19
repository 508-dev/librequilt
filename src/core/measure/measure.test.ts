// librequilt -- tests for P-01 and O-04: inch and metric readouts.
//
// Every expected metric value below is quoted from the output of
// `python3 docs/specification-fixtures.py`, the specification's synthetic
// fixture script, and from T-04a:
//   "quarter yard in metres: 0.2286 m; shown 0.229 m"
//   "3 1/2 in in centimetres: shown 8.89 cm"
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as L from '../exact/length';
import * as Q from '../exact/rational';
import * as R from '../exact/rounding';
import * as Measure from './measure';

describe('inch and yard readouts', () => {
  test('print the mixed-number spellings a chart uses', () => {
    // The same spellings `core/exact` prints (G-01, G-02), gathered here so a
    // chart has one place to ask for any display value.
    expect(Measure.inches(L.sixteenths(56))).toBe('3 1/2');
    expect(Measure.inches(L.sixteenths(62))).toBe('3 7/8');
    expect(Measure.inches(L.sixteenths(48))).toBe('3');
    expect(Measure.inches(L.sixteenths(8))).toBe('1/2');
    expect(Measure.inches(L.sixteenths(0))).toBe('0');
    expect(Measure.yards(R.eighthYards(2))).toBe('1/4');
    expect(Measure.yards(R.eighthYards(10))).toBe('1 1/4');
    expect(Measure.yards(R.eighthYards(0))).toBe('0');
  });
});

describe('centimetre readouts', () => {
  test('T-04a: a 3 1/2-inch cut shows as about 8.89 cm', () => {
    // fixtures: "3 1/2 in in centimetres: shown 8.89 cm"
    const readout = Measure.centimetresOf(L.sixteenths(56));
    expect(readout.text).toBe('8.89');
    expect(readout.unit).toBe('cm');
    expect(readout.approximate).toBe(true);
    expect(Measure.describeMetric(readout)).toBe('≈ 8.89 cm');
  });

  test('the exact centimetre value is a rational, never a float', () => {
    // 3 1/2 inches * 127/50 = 889/100, exactly. A binary float could not hold
    // this any more than it can hold 0.2286; the readout carries the rational.
    const readout = Measure.centimetres(Q.rational(7n, 2n));
    expect(Q.equals(readout.exact, Q.rational(889n, 100n))).toBe(true);
    expect(readout.text).toBe('8.89');
  });

  test('rounds half-up to two decimals, from the exact value', () => {
    // 1/8 inch = 0.3175 cm -> 0.32; 1 inch = 2.54 exactly -> 2.54.
    expect(Measure.centimetres(Q.rational(1n, 8n)).text).toBe('0.32');
    expect(Measure.centimetres(Q.rational(1n)).text).toBe('2.54');
    // A half-up tie: 1/508 inch is exactly 0.005 cm, which rounds up to 0.01.
    expect(Measure.centimetres(Q.rational(1n, 508n)).text).toBe('0.01');
  });

  test('always writes exactly two decimals', () => {
    expect(Measure.centimetres(Q.rational(1n)).text).toBe('2.54');
    expect(Measure.centimetresOf(L.inches(10)).text).toBe('25.40');
  });
});

describe('metre readouts', () => {
  test('T-04a: a quarter-yard purchase is exactly 0.2286 m, shown about 0.229 m', () => {
    // fixtures: "quarter yard in metres: 0.2286 m; shown 0.229 m"
    const readout = Measure.metres(R.eighthYards(2));
    expect(readout.text).toBe('0.229');
    expect(readout.unit).toBe('m');
    expect(readout.approximate).toBe(true);
    expect(Measure.describeMetric(readout)).toBe('≈ 0.229 m');
    // The exact metre value before display rounding is 0.2286 = 1143/5000.
    expect(Q.equals(readout.exact, Q.rational(1143n, 5000n))).toBe(true);
  });

  test('converts the rounded purchase, never the raw length', () => {
    // P-01: metre totals convert the rounded purchasable yards. The function
    // takes an EighthYards purchase, so a raw length cannot reach it by
    // mistake: one eighth of a yard is exactly 0.1143 m, shown 0.114.
    const readout = Measure.metres(R.eighthYards(1));
    expect(readout.text).toBe('0.114');
    expect(Q.equals(readout.exact, Q.rational(1143n, 10000n))).toBe(true);
  });

  test('whole and mixed purchases convert exactly', () => {
    // 1 yard = 0.9144 m -> 0.914; 1 1/4 yard = 1.143 m -> 1.143.
    expect(Measure.metres(R.eighthYards(8)).text).toBe('0.914');
    expect(Measure.metres(R.eighthYards(10)).text).toBe('1.143');
  });

  test('always writes exactly three decimals', () => {
    expect(Measure.metres(R.eighthYards(8)).text).toBe('0.914');
    expect(Measure.metres(R.eighthYards(16)).text).toBe('1.829');
  });
});

describe('readouts never change a stored value', () => {
  test('computing every readout leaves the stored inches and purchase untouched', () => {
    // T-04a: "Changing the display unit ... cannot change the stored inch
    // measurements or the 1/4-yard purchase." Readouts are pure functions of
    // the stored values, so no readout -- inch, yard or metric -- mutates them.
    const length = L.sixteenths(56); // 3 1/2 inches
    const purchase = R.eighthYards(2); // 1/4 yard

    Measure.inches(length);
    Measure.yards(purchase);
    Measure.centimetresOf(length);
    Measure.metres(purchase);

    expect(L.toSixteenthCount(length)).toBe(56);
    expect(R.toEighthYardCount(purchase)).toBe(2);
    expect(Measure.inches(length)).toBe('3 1/2');
    expect(Measure.yards(purchase)).toBe('1/4');
    expect(Measure.centimetresOf(length).text).toBe('8.89');
    expect(Measure.metres(purchase).text).toBe('0.229');
  });
});
