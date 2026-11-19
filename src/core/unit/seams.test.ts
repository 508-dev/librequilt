// librequilt -- tests for the seam-topology refusals of W-02 at unit scale.
//
// T-01: "Reject ... a curve, and a set-in seam as cuttable geometry."
// W-02: "An unsupported free polygon, curve or set-in seam is refused as a
// cuttable block, with the affected seam identified."
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import { describeUnitRefusal } from './plan';
import { assessSeams, type Seam } from './seams';

const straight = (id: string): Seam => ({ id, shape: 'straight' });

describe('W-02 seam cuttability', () => {
  test('a straight-seam topology is cuttable', () => {
    const result = assessSeams([straight('a'), straight('b'), straight('c')]);
    expect(result.ok).toBe(true);
  });

  test('an empty seam list is cuttable', () => {
    expect(assessSeams([]).ok).toBe(true);
  });

  test('T-01: a curve is refused with the affected seam identified', () => {
    const result = assessSeams([straight('seam-1'), { id: 'seam-2', shape: 'curve' }]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.refusal.kind).toBe('unsupported-seam');
      expect(result.refusal.seamId).toBe('seam-2');
      expect(result.refusal.shape).toBe('curve');
    }
  });

  test('T-01: a set-in seam is refused with the affected seam identified', () => {
    const result = assessSeams([{ id: 'y-seam', shape: 'set-in' }]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.refusal.kind).toBe('unsupported-seam');
      expect(result.refusal.seamId).toBe('y-seam');
      expect(result.refusal.shape).toBe('set-in');
    }
  });

  test('an unsupported free polygon is refused the same way', () => {
    const result = assessSeams([{ id: 'free', shape: 'free-polygon' }]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.refusal.kind).toBe('unsupported-seam');
      expect(result.refusal.shape).toBe('free-polygon');
    }
  });

  test('the first offending seam is the one named', () => {
    const result = assessSeams([
      straight('ok-1'),
      { id: 'first-bad', shape: 'curve' },
      { id: 'second-bad', shape: 'set-in' },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.refusal.seamId).toBe('first-bad');
  });

  test('every seam refusal has a sentence a quilter can act on', () => {
    const result = assessSeams([{ id: 'seam-2', shape: 'curve' }]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const sentence = describeUnitRefusal(result.refusal);
      expect(sentence).toContain('seam-2');
      expect(sentence).toContain('straight');
      expect(sentence.endsWith('.')).toBe(true);
    }
  });
});
