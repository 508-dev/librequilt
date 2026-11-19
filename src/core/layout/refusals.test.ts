// librequilt -- tests for the layout-level refusals a quilter can cause (I5).
//
// The edge cases: "a grid division that cannot be represented in whole
// sixteenths ... must produce a specific refusal", and every refusal carries
// "a sentence a quilter can act on" (A-01). The unit-level measurement
// refusals are composed in unchanged and describe in `core/unit`'s words.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as L from '../exact/length';
import type { LayoutRefusal } from './refusal';
import { describeLayoutRefusal } from './refusal';

const refusals: readonly LayoutRefusal[] = [
  { kind: 'not-a-whole-sixteenth', value: 48.16 },
  { kind: 'negative-size', value: -16 },
  { kind: 'zero-size' },
  { kind: 'out-of-range', maximumInches: 1000 },
  { kind: 'bad-unit-count', value: 0 },
  { kind: 'unsupported-proportions', width: L.sixteenths(80), height: L.sixteenths(32) },
  { kind: 'unsupported-seam', seamId: 'curve-2', shape: 'curve' },
  { kind: 'bad-grid-count', axis: 'rows', value: 0 },
  { kind: 'bad-position', axis: 'columns', value: 1.5 },
  { kind: 'position-outside-grid', row: 3, column: 0, rows: 3, columns: 2 },
  { kind: 'duplicate-position', row: 1, column: 1 },
  {
    kind: 'block-finished-size-mismatch',
    row: 0,
    column: 1,
    expected: L.sixteenths(192),
    actual: L.sixteenths(120),
  },
  { kind: 'non-square-block', width: L.sixteenths(192), height: L.sixteenths(96) },
];

describe('I5 layout refusals are values with sentences', () => {
  test('every refusal has a sentence a quilter can act on', () => {
    for (const refusal of refusals) {
      const sentence = describeLayoutRefusal(refusal);
      expect(sentence.length).toBeGreaterThan(10);
      expect(sentence.endsWith('.')).toBe(true);
    }
  });

  test('the grid-count refusal names the axis and the count', () => {
    const sentence = describeLayoutRefusal(refusals[7] as LayoutRefusal);
    expect(sentence).toContain('Rows');
    expect(sentence).toContain('at least one');
    expect(sentence).toContain('0');
  });

  test('the position refusals say where the position is and what to do', () => {
    const outside = describeLayoutRefusal(refusals[9] as LayoutRefusal);
    expect(outside).toContain('row 4, column 1');
    expect(outside).toContain('3-row by 2-column');
    const duplicate = describeLayoutRefusal(refusals[10] as LayoutRefusal);
    expect(duplicate).toContain('Row 2, column 2');
    expect(duplicate).toContain('one block or stays plain');
  });

  test('the size-mismatch refusal names both finished sizes', () => {
    const sentence = describeLayoutRefusal(refusals[11] as LayoutRefusal);
    expect(sentence).toContain('row 1, column 2');
    expect(sentence).toContain('7 1/2 inches');
    expect(sentence).toContain('12 inches');
    expect(sentence).toContain('same finished size');
  });

  test('measurement refusals describe in core/unit’s words', () => {
    const sentence = describeLayoutRefusal(refusals[2] as LayoutRefusal);
    expect(sentence).toContain('more than zero');
    expect(sentence).toContain('absent sash or border');
  });
});
