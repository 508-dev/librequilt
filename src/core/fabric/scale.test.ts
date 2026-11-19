// librequilt -- tests for F-01's calibration arithmetic, the pure numbers of
// T-06.
//
// Every expected value below is quoted from the output of
// `python3 docs/specification-fixtures.py`, the specification's synthetic
// fixture script: "photo scale from repeat: 100 pixels/in; from ruler:
// 100 pixels/in; 2-in span: 200 pixels".
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as L from '../exact/length';
import * as Q from '../exact/rational';
import type { CalibrationResult, PixelsPerInch } from './scale';
import * as Scale from './scale';

const calibrated = (result: CalibrationResult): PixelsPerInch => {
  if (!result.ok) throw new Error(`expected a scale, got the refusal ${result.refusal.kind}`);
  return result.value;
};

const refusalKind = (result: CalibrationResult): string | undefined =>
  result.ok ? undefined : result.refusal.kind;

describe('F-01 photo calibration', () => {
  test('T-06: a 600 x 400 image of a 6 x 4-inch repeat gives 100 pixels per inch', () => {
    // fixtures: "photo scale from repeat: 100 pixels/in". The repeat route is
    // one dimension: 600 px over 6 in, or 400 px over 4 in, both 100.
    const byWidth = calibrated(Scale.calibrateByRepeat(600, L.toSixteenthCount(L.inches(6))));
    expect(Q.format(byWidth)).toBe('100');
    const byHeight = calibrated(Scale.calibrateByRepeat(400, L.toSixteenthCount(L.inches(4))));
    expect(Q.format(byHeight)).toBe('100');
  });

  test('T-06: marking two points 300 pixels apart and entering 3 inches also gives 100', () => {
    // fixtures: "from ruler: 100 pixels/in".
    const scale = calibrated(Scale.calibrateByMarkedPoints(300, L.toSixteenthCount(L.inches(3))));
    expect(Q.format(scale)).toBe('100');
  });

  test('T-06: both routes produce the same pixels per inch', () => {
    const byRepeat = calibrated(Scale.calibrateByRepeat(600, L.toSixteenthCount(L.inches(6))));
    const byRuler = calibrated(Scale.calibrateByMarkedPoints(300, L.toSixteenthCount(L.inches(3))));
    expect(Q.equals(byRepeat, byRuler)).toBe(true);
  });

  test('T-06: a 2-inch finished square spans 200 image pixels at physical scale', () => {
    // fixtures: "2-in span: 200 pixels".
    const scale = calibrated(Scale.calibrateByRepeat(600, L.toSixteenthCount(L.inches(6))));
    const span = Scale.pixelsAtPhysicalScale(scale, L.inches(2));
    expect(Q.equals(span, Q.rational(200n))).toBe(true);
  });

  test('the scale is exact: a rational, never a float', () => {
    // A 300-pixel distance over 7 inches is 300/7 pixels per inch -- not a
    // round number, and it must stay exact (I1).
    const scale = calibrated(Scale.calibrateByMarkedPoints(300, L.toSixteenthCount(L.inches(7))));
    expect(Q.format(scale)).toBe('300/7'); // 300 * 16 / 112, reduced
  });

  test('T-06: a zero pixel distance is refused', () => {
    expect(refusalKind(Scale.calibrateByMarkedPoints(0, L.toSixteenthCount(L.inches(3))))).toBe(
      'zero-distance',
    );
  });

  test('F-01: a nonpositive repeat is refused', () => {
    expect(refusalKind(Scale.calibrateByRepeat(600, 0))).toBe('nonpositive-repeat');
    expect(refusalKind(Scale.calibrateByRepeat(0, L.toSixteenthCount(L.inches(6))))).toBe(
      'nonpositive-repeat',
    );
    expect(refusalKind(Scale.calibrateByRepeat(600, -96))).toBe('negative');
  });

  test('a negative pixel distance is refused', () => {
    expect(refusalKind(Scale.calibrateByMarkedPoints(-300, L.toSixteenthCount(L.inches(3))))).toBe(
      'negative',
    );
  });

  test('a pixel span or an inch span that is not whole is refused', () => {
    expect(refusalKind(Scale.calibrateByRepeat(600.5, 96))).toBe('not-a-whole-pixel-count');
    expect(refusalKind(Scale.calibrateByMarkedPoints(300, 48.5))).toBe('not-a-whole-sixteenth');
  });

  test('an inch span beyond the stored range is refused', () => {
    // The provisional 1000-inch bound of core/exact, one sixteenth past it.
    expect(refusalKind(Scale.calibrateByRepeat(600, 16001))).toBe('out-of-range');
  });

  test('every refusal has a sentence a quilter can act on', () => {
    const refusals = [
      { kind: 'zero-distance' },
      { kind: 'nonpositive-repeat', value: 0 },
      { kind: 'negative', value: -1 },
      { kind: 'not-a-whole-pixel-count', value: 600.5 },
      { kind: 'not-a-whole-sixteenth', value: 48.5 },
      { kind: 'out-of-range', maximumInches: 1000 },
    ] as const;
    for (const refusal of refusals) {
      const sentence = Scale.describeCalibrationRefusal(refusal);
      expect(sentence.length).toBeGreaterThan(10);
      expect(sentence.endsWith('.')).toBe(true);
    }
    expect(Scale.describeCalibrationRefusal({ kind: 'zero-distance' })).toContain('same place');
  });
});
