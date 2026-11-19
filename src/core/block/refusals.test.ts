// librequilt -- tests for the block-level refusals a quilter can cause (I5).
//
// W-02: "An unsupported free polygon, curve or set-in seam is refused as a
// cuttable block, with the affected seam identified." The edge cases name
// "a grid division that cannot be represented in whole sixteenths" and a
// draft's "missing construction" as refusals with specific, understandable
// reasons. Every one is a value with a sentence a quilter can act on (A-01).
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as L from '../exact/length';
import type { BlockRefusal } from './refusal';
import { describeBlockRefusal } from './refusal';

const refusals: readonly BlockRefusal[] = [
  { kind: 'not-a-whole-sixteenth', value: 48.16 },
  { kind: 'negative-size', value: -16 },
  { kind: 'zero-size' },
  { kind: 'out-of-range', maximumInches: 1000 },
  { kind: 'unsupported-proportions', width: L.sixteenths(80), height: L.sixteenths(32) },
  { kind: 'unsupported-seam', seamId: 'curve-2', shape: 'curve' },
  {
    kind: 'bad-grid-count',
    value: 0,
  },
  {
    kind: 'grid-division-not-whole-sixteenths',
    finishedSide: L.sixteenths(192),
    rows: 5,
    columns: 5,
    axis: 'rows',
  },
  { kind: 'bad-orientation', turns: 4 },
  { kind: 'bad-piece-id', pieceId: '' },
  { kind: 'bad-placement', pieceId: 'p1', value: 1.5 },
  { kind: 'duplicate-piece-id', pieceId: 'p1' },
  { kind: 'placement-outside-grid', pieceId: 'p1' },
  { kind: 'overlapping-pieces', pieceId: 'p1', otherPieceId: 'p2' },
  {
    kind: 'construction-does-not-fit',
    pieceId: 'p1',
    construction: 'square',
    width: L.sixteenths(96),
    height: L.sixteenths(48),
  },
  {
    kind: 'construction-does-not-fit',
    pieceId: 'g1',
    construction: 'goose-one',
    width: L.sixteenths(96),
    height: L.sixteenths(64),
  },
  {
    kind: 'missing-construction',
    missing: [
      { pieceId: 'drawn', rect: { row: 0, column: 0, rowSpan: 1, columnSpan: 2 } },
      { rect: { row: 1, column: 2, rowSpan: 1, columnSpan: 1 } },
    ],
  },
];

describe('I5 block refusals are values with sentences', () => {
  test('every refusal has a sentence a quilter can act on', () => {
    for (const refusal of refusals) {
      const sentence = describeBlockRefusal(refusal);
      expect(sentence.length).toBeGreaterThan(10);
      expect(sentence.endsWith('.')).toBe(true);
    }
  });

  test('the seam refusal names the seam and the supported seams', () => {
    const sentence = describeBlockRefusal(refusals[5] as BlockRefusal);
    expect(sentence).toContain('curve-2');
    expect(sentence).toContain('straight');
    expect(sentence).toContain('cutting chart');
  });

  test('the grid-division refusal names the size and the division', () => {
    const sentence = describeBlockRefusal(refusals[7] as BlockRefusal);
    expect(sentence).toContain('12');
    expect(sentence).toContain('5 equal rows');
    expect(sentence).toContain('whole sixteenths');
  });

  test('the draft refusal names every missing region and withholds the yardage', () => {
    const sentence = describeBlockRefusal(refusals[16] as BlockRefusal);
    expect(sentence).toContain('drawn');
    expect(sentence).toContain('row 2, column 3');
    expect(sentence).toContain('unavailable');
  });

  test('the fit refusal states the shape the construction needs', () => {
    const square = describeBlockRefusal(refusals[14] as BlockRefusal);
    expect(square).toContain('p1');
    expect(square).toContain('6 by 3');
    expect(square).toContain('equal finished sides');
    const goose = describeBlockRefusal(refusals[15] as BlockRefusal);
    expect(goose).toContain('twice');
    expect(goose).toContain('4 by 2');
  });

  test('the overlap refusal names both pieces', () => {
    const sentence = describeBlockRefusal(refusals[13] as BlockRefusal);
    expect(sentence).toContain('p1');
    expect(sentence).toContain('p2');
    expect(sentence).toContain('one piece');
  });
});
