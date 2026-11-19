// librequilt -- tests for rotation and mirroring of placed copies (W-02, W-03).
//
// W-03: "place independently rotated or mirrored copies without modifying the
// library definition." G-03: "Mirroring, rotation and fabric-photo scale do
// not change these numbers" -- the cut dimensions. The size identity at the
// end is that invariance at the algebra level: a definition size recovered
// through any composed orientation is the same pair of whole sixteenths.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as L from '../exact/length';
import type { Orientation } from './orientation';
import {
  compose,
  definitionSize,
  gridSize,
  IDENTITY,
  MIRROR,
  mapRect,
  QUARTER_TURN,
  readOrientation,
  swapsAxes,
} from './orientation';

const allOrientations: Orientation[] = [];
for (const turns of [0, 1, 2, 3]) {
  for (const mirrored of [false, true]) {
    allOrientations.push({ turns: turns as Orientation['turns'], mirrored });
  }
}

describe('W-03 orientation algebra', () => {
  test('a quarter turn and a mirror compose exactly', () => {
    expect(compose(IDENTITY, IDENTITY)).toEqual(IDENTITY);
    expect(compose(MIRROR, MIRROR)).toEqual(IDENTITY);
    expect(compose(QUARTER_TURN, { turns: 1, mirrored: false })).toEqual({
      turns: 2,
      mirrored: false,
    });
    // M R = R^-1 M: a mirror outside a turn points the other way.
    expect(compose(MIRROR, QUARTER_TURN)).toEqual({ turns: 3, mirrored: true });
    expect(compose(QUARTER_TURN, MIRROR)).toEqual({ turns: 1, mirrored: true });
  });

  test('composition is associative', () => {
    for (const a of allOrientations) {
      for (const b of allOrientations) {
        for (const c of allOrientations) {
          expect(compose(compose(a, b), c)).toEqual(compose(a, compose(b, c)));
        }
      }
    }
  });

  test('four quarter turns return to the identity', () => {
    let turned = IDENTITY;
    for (let step = 0; step < 4; step += 1) turned = compose(QUARTER_TURN, turned);
    expect(turned).toEqual(IDENTITY);
    expect(compose(MIRROR, compose(MIRROR, IDENTITY))).toEqual(IDENTITY);
  });

  test('only an odd quarter turn swaps the axes', () => {
    expect(swapsAxes(IDENTITY)).toBe(false);
    expect(swapsAxes({ turns: 1, mirrored: false })).toBe(true);
    expect(swapsAxes({ turns: 2, mirrored: true })).toBe(false);
    expect(swapsAxes({ turns: 3, mirrored: true })).toBe(true);
  });

  test('an orientation is read as a value and a bad turn count is refused', () => {
    const read = readOrientation(1, true);
    expect(read.ok).toBe(true);
    if (read.ok) expect(read.value).toEqual({ turns: 1, mirrored: true });
    for (const bad of [-1, 4, 1.5, Number.NaN]) {
      const refused = readOrientation(bad, false);
      expect(refused.ok).toBe(false);
      if (!refused.ok) expect(refused.refusal.kind).toBe('bad-orientation');
    }
  });
});

describe('W-03 region mapping', () => {
  // A 3 by 4 grid (3 rows, 4 columns) and a region covering two cells.
  const rows = 3;
  const columns = 4;
  const rect = { row: 0, column: 0, rowSpan: 1, columnSpan: 2 };

  test('a quarter turn transposes the region into the transposed grid', () => {
    expect(mapRect({ turns: 1, mirrored: false }, rows, columns, rect)).toEqual({
      row: 0,
      column: 2,
      rowSpan: 2,
      columnSpan: 1,
    });
  });

  test('a mirror flips the region across the vertical axis', () => {
    expect(mapRect(MIRROR, rows, columns, rect)).toEqual({
      row: 0,
      column: 2,
      rowSpan: 1,
      columnSpan: 2,
    });
  });

  test('a half turn keeps the spans and flips both ways', () => {
    expect(mapRect({ turns: 2, mirrored: false }, rows, columns, rect)).toEqual({
      row: 2,
      column: 2,
      rowSpan: 1,
      columnSpan: 2,
    });
  });

  test('every mapped region stays inside the mapped grid', () => {
    for (const orientation of allOrientations) {
      const mapped = mapRect(orientation, rows, columns, {
        row: 1,
        column: 2,
        rowSpan: 2,
        columnSpan: 1,
      });
      const height = orientation.turns % 2 === 1 ? columns : rows;
      const width = orientation.turns % 2 === 1 ? rows : columns;
      expect(mapped.row).toBeGreaterThanOrEqual(0);
      expect(mapped.column).toBeGreaterThanOrEqual(0);
      expect(mapped.row + mapped.rowSpan).toBeLessThanOrEqual(height);
      expect(mapped.column + mapped.columnSpan).toBeLessThanOrEqual(width);
    }
  });
});

describe('G-03 rotation and mirroring leave sizes unchanged', () => {
  // A piece 8 by 4 sixteenths in its own definition orientation.
  const definitionWidth = L.sixteenths(8);
  const definitionHeight = L.sixteenths(4);

  test('the definition size is recovered through any composed orientation', () => {
    for (const blockOrientation of allOrientations) {
      for (const pieceOrientation of allOrientations) {
        const inBlock = gridSize(pieceOrientation, definitionWidth, definitionHeight);
        const inPlaced = gridSize(blockOrientation, inBlock.width, inBlock.height);
        const placedOrientation = compose(blockOrientation, pieceOrientation);
        const recovered = definitionSize(placedOrientation, inPlaced.width, inPlaced.height);
        expect(L.toSixteenthCount(recovered.width)).toBe(8);
        expect(L.toSixteenthCount(recovered.height)).toBe(4);
      }
    }
  });

  test('a mirror never changes a size and a turn only swaps it', () => {
    const mirrored = definitionSize(MIRROR, definitionWidth, definitionHeight);
    expect(L.toSixteenthCount(mirrored.width)).toBe(8);
    expect(L.toSixteenthCount(mirrored.height)).toBe(4);
    const turned = definitionSize(QUARTER_TURN, definitionWidth, definitionHeight);
    expect(L.toSixteenthCount(turned.width)).toBe(4);
    expect(L.toSixteenthCount(turned.height)).toBe(8);
  });
});
