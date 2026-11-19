// librequilt -- tests for the unit-level refusals a quilter can cause (I5).
//
// T-01: "Reject a 3.01-inch entered length, a zero finished block, a curve,
// and a set-in seam as cuttable geometry." The curve and set-in seam are in
// seams.test.ts; this file covers the measurements and counts. Every refusal
// is returned as a value and none is thrown.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as L from '../exact/length';
import * as Geese from './geese';
import * as Plain from './plain';
import type { UnitRefusal, UnitResult } from './plan';
import { describeUnitRefusal } from './plan';
import * as SquareInASquare from './square-in-square';
import * as Triangles from './triangles';

const refusalKind = (result: UnitResult<unknown>): string | undefined =>
  result.ok ? undefined : result.refusal.kind;

describe('I5 refusals are values, not exceptions', () => {
  test('T-01: a 3.01-inch entered length is refused, never rounded', () => {
    // The quilter-typed route refuses at the parse (G-01, IMPL-01).
    const typed = L.parseLength('3.01');
    expect(typed.ok).toBe(false);
    if (!typed.ok) expect(typed.problem.kind).toBe('finer-than-a-sixteenth');
    // The unit route refuses the same value if it arrives unvalidated:
    // 3.01 inches is 48.16 sixteenths, not a whole one.
    expect(refusalKind(Plain.plainSquare(48.16, 1))).toBe('not-a-whole-sixteenth');
    expect(refusalKind(Triangles.halfSquareTriangleTwoAtATime(48.16, 2))).toBe(
      'not-a-whole-sixteenth',
    );
  });

  test('a zero finished size is refused everywhere', () => {
    // G-01: zero is valid only for an absent optional sash or border.
    // T-01 rejects "a zero finished block" as cuttable geometry.
    expect(refusalKind(Plain.plainSquare(0, 1))).toBe('zero-size');
    expect(refusalKind(Plain.plainRectangle(0, 32, 1))).toBe('zero-size');
    expect(refusalKind(Plain.plainRectangle(64, 0, 1))).toBe('zero-size');
    expect(refusalKind(Plain.stripCutWidth(0))).toBe('zero-size');
    expect(refusalKind(Plain.stripSet(0, 96, 1))).toBe('zero-size');
    expect(refusalKind(Plain.stripSet(32, 0, 1))).toBe('zero-size');
    expect(refusalKind(Triangles.halfSquareTriangleTwoAtATime(0, 2))).toBe('zero-size');
    expect(refusalKind(Triangles.halfSquareTriangleFourAtATime(0, 4))).toBe('zero-size');
    expect(refusalKind(Triangles.halfSquareTriangleEightAtATime(0, 8))).toBe('zero-size');
    expect(refusalKind(Triangles.quarterSquareTriangle(0, 2))).toBe('zero-size');
    expect(refusalKind(Geese.flyingGeeseOneAtATime(0, 0, 1))).toBe('zero-size');
    expect(refusalKind(Geese.flyingGeeseFourAtATime(0, 0, 4))).toBe('zero-size');
    expect(refusalKind(Geese.stitchAndFlipCorner(0, 1))).toBe('zero-size');
    expect(refusalKind(SquareInASquare.squareInASquare(0, 1))).toBe('zero-size');
  });

  test('a negative finished size is refused', () => {
    expect(refusalKind(Plain.plainSquare(-16, 1))).toBe('negative-size');
    expect(refusalKind(Triangles.quarterSquareTriangle(-16, 2))).toBe('negative-size');
  });

  test('a finished size beyond the stored range is refused', () => {
    // The provisional 1000-inch bound of core/exact, at both sides.
    expect(refusalKind(Plain.plainSquare(16016, 1))).toBe('out-of-range'); // 1001 inches
    // 1000 inches is storable, but its cut cannot be: F + 1/2 rounds out.
    expect(refusalKind(Plain.plainSquare(16000, 1))).toBe('out-of-range');
    // The eight-at-a-time parent is about twice the finished size.
    expect(refusalKind(Triangles.halfSquareTriangleEightAtATime(8000, 8))).toBe('out-of-range');
  });

  test('a unit count that is not a whole number of at least one is refused', () => {
    expect(refusalKind(Plain.plainSquare(48, 0))).toBe('bad-unit-count');
    expect(refusalKind(Plain.plainSquare(48, 1.5))).toBe('bad-unit-count');
    expect(refusalKind(Triangles.halfSquareTriangleFourAtATime(48, -4))).toBe('bad-unit-count');
    expect(refusalKind(Geese.flyingGeeseFourAtATime(64, 32, 2.5))).toBe('bad-unit-count');
    expect(refusalKind(Plain.stripSet(32, 96, 0))).toBe('bad-unit-count');
  });

  test('every refusal has a sentence a quilter can act on', () => {
    const refusals: UnitRefusal[] = [
      { kind: 'not-a-whole-sixteenth', value: 48.16 },
      { kind: 'negative-size', value: -16 },
      { kind: 'zero-size' },
      { kind: 'out-of-range', maximumInches: 1000 },
      { kind: 'bad-unit-count', value: 0 },
      { kind: 'unsupported-proportions', width: L.sixteenths(80), height: L.sixteenths(32) },
      { kind: 'unsupported-seam', seamId: 'seam-2', shape: 'curve' },
    ];
    for (const refusal of refusals) {
      const sentence = describeUnitRefusal(refusal);
      expect(sentence.length).toBeGreaterThan(10);
      expect(sentence.endsWith('.')).toBe(true);
    }
    expect(describeUnitRefusal({ kind: 'zero-size' })).toContain('more than zero');
  });
});
