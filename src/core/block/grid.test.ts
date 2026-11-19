// librequilt -- tests for the measured grid and its division refusals (W-02).
//
// W-02: "A quilter can draw a square finished block on a measured grid"; the
// edge cases: "A grid division that cannot be represented in whole sixteenths"
// is one of the named refusals. T-01: "Reject a 3.01-inch entered length, a
// zero finished block ... as cuttable geometry." Every expected value below is
// quoted from `python3 docs/specification-fixtures.py` or computed in whole
// sixteenths as the comment states.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as L from '../exact/length';
import type { BlockGrid } from './grid';
import { divideGrid, rectCells, rectFinishedSize, rectsOverlap, rectWithinGrid } from './grid';
import type { BlockResult } from './refusal';

const planned = <T>(result: BlockResult<T>): T => {
  if (!result.ok) throw new Error(`expected a grid, got the refusal ${result.refusal.kind}`);
  return result.value;
};
const refusalKind = (result: BlockResult<unknown>): string | undefined =>
  result.ok ? undefined : result.refusal.kind;

describe('W-02 the measured grid', () => {
  test('a nine-patch divides 12 inches into 4-inch cells', () => {
    // 12 inches is 192 sixteenths; 192 / 3 = 64 sixteenths = 4 inches.
    const grid = planned(divideGrid(192, 3, 3));
    expect(L.toSixteenthCount(grid.finishedSide)).toBe(192);
    expect(L.toSixteenthCount(grid.cellHeight)).toBe(64);
    expect(L.toSixteenthCount(grid.cellWidth)).toBe(64);
    expect(L.formatInches(grid.cellWidth)).toBe('4');
  });

  test('a five-patch divides 10 inches but not 6', () => {
    // 160 / 5 = 32 sixteenths = 2 inches; 96 / 5 = 19.2 is not a sixteenth.
    const grid = planned(divideGrid(160, 5, 5));
    expect(L.formatInches(grid.cellWidth)).toBe('2');
    expect(refusalKind(divideGrid(96, 5, 5))).toBe('grid-division-not-whole-sixteenths');
  });

  test('a grid division that cannot be represented in whole sixteenths is refused', () => {
    // The verification point of IMPL-03. 192 / 5 = 38.4 sixteenths.
    const rows = divideGrid(192, 5, 5);
    expect(refusalKind(rows)).toBe('grid-division-not-whole-sixteenths');
    if (!rows.ok && rows.refusal.kind === 'grid-division-not-whole-sixteenths') {
      expect(rows.refusal.axis).toBe('rows');
      expect(L.toSixteenthCount(rows.refusal.finishedSide)).toBe(192);
    }
    // With the rows fine, the failing axis is the columns.
    const columns = divideGrid(192, 3, 5);
    expect(refusalKind(columns)).toBe('grid-division-not-whole-sixteenths');
    if (!columns.ok && columns.refusal.kind === 'grid-division-not-whole-sixteenths') {
      expect(columns.refusal.axis).toBe('columns');
    }
  });

  test('cells are whole sixteenths, not necessarily whole inches', () => {
    // 3 1/16 inches is 49 sixteenths; 49 / 7 = 7 sixteenths = 7/16 inch.
    const grid = planned(divideGrid(49, 7, 7));
    expect(L.toSixteenthCount(grid.cellWidth)).toBe(7);
    expect(L.formatInches(grid.cellWidth)).toBe('7/16');
  });

  test('T-01: a zero finished block is refused as cuttable geometry', () => {
    // T-01: "Reject ... a zero finished block ... as cuttable geometry."
    // G-01: zero is valid only for an absent optional sash or border.
    expect(refusalKind(divideGrid(0, 2, 2))).toBe('zero-size');
  });

  test('T-01: a 3.01-inch finished block is refused, never rounded', () => {
    // T-01: "Reject a 3.01-inch entered length ... as cuttable geometry."
    // The quilter-typed route refuses at the parse (G-01, IMPL-01).
    const typed = L.parseLength('3.01');
    expect(typed.ok).toBe(false);
    if (!typed.ok) expect(typed.problem.kind).toBe('finer-than-a-sixteenth');
    // The block route refuses the same value: 3.01 inches is 48.16 sixteenths.
    expect(refusalKind(divideGrid(48.16, 2, 2))).toBe('not-a-whole-sixteenth');
  });

  test('a negative or oversized finished block is refused', () => {
    expect(refusalKind(divideGrid(-16, 2, 2))).toBe('negative-size');
    expect(refusalKind(divideGrid(16016, 2, 2))).toBe('out-of-range'); // 1001 inches
  });

  test('grid counts have to be whole numbers of at least one', () => {
    expect(refusalKind(divideGrid(192, 0, 3))).toBe('bad-grid-count');
    expect(refusalKind(divideGrid(192, 3, -1))).toBe('bad-grid-count');
    expect(refusalKind(divideGrid(192, 2.5, 2))).toBe('bad-grid-count');
    // One cell is a whole block: one row and one column divide anything.
    expect(L.toSixteenthCount(planned(divideGrid(49, 1, 1)).cellWidth)).toBe(49);
  });
});

describe('W-02 grid regions', () => {
  const grid: BlockGrid = planned(divideGrid(192, 3, 4)); // 4 x 3-inch cells

  test('a region finished size is its span of cells', () => {
    // cellWidth 48 (3 inches), cellHeight 64 (4 inches).
    const size = rectFinishedSize(grid, { row: 0, column: 0, rowSpan: 1, columnSpan: 2 });
    expect(L.formatInches(size.width)).toBe('6');
    expect(L.formatInches(size.height)).toBe('4');
  });

  test('regions are inside the grid or not', () => {
    expect(rectWithinGrid(grid, { row: 2, column: 3, rowSpan: 1, columnSpan: 1 })).toBe(true);
    expect(rectWithinGrid(grid, { row: 2, column: 3, rowSpan: 2, columnSpan: 1 })).toBe(false);
    expect(rectWithinGrid(grid, { row: 0, column: 4, rowSpan: 1, columnSpan: 1 })).toBe(false);
  });

  test('overlap is about shared cells', () => {
    const left = { row: 0, column: 0, rowSpan: 1, columnSpan: 2 };
    const right = { row: 0, column: 1, rowSpan: 1, columnSpan: 2 };
    const below = { row: 1, column: 0, rowSpan: 1, columnSpan: 2 };
    expect(rectsOverlap(left, right)).toBe(true);
    expect(rectsOverlap(left, below)).toBe(false);
  });

  test('cells enumerate one region entry per grid cell', () => {
    const cells = rectCells({ row: 1, column: 1, rowSpan: 2, columnSpan: 2 });
    expect(cells).toHaveLength(4);
    expect(cells[0]).toEqual({ row: 1, column: 1, rowSpan: 1, columnSpan: 1 });
    expect(cells[3]).toEqual({ row: 2, column: 2, rowSpan: 1, columnSpan: 1 });
  });
});
