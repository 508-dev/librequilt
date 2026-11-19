// librequilt -- tests for block assembly, measurements and placed copies.
//
// W-02: "The displayed finished block and its unfinished/cut measurements are
// distinct." W-03: "place independently rotated or mirrored copies without
// modifying the library definition." G-02: "Do not round ... a block before
// joining it to another." Every refusal is a value, never thrown (I5).
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as L from '../exact/length';
import type { Block } from './block';
import {
  assembleBlock,
  blockMeasurements,
  mirrorPlaced,
  placeBlock,
  placedGeometry,
  rotateQuarter,
  uncoveredCells,
} from './block';
import { divideGrid } from './grid';
import type { PlacedPieceInput } from './piece';
import type { BlockResult } from './refusal';

const planned = <T>(result: BlockResult<T>): T => {
  if (!result.ok) throw new Error(`expected a value, got the refusal ${result.refusal.kind}`);
  return result.value;
};
const refusalKind = (result: BlockResult<unknown>): string | undefined =>
  result.ok ? undefined : result.refusal.kind;

const square = (id: string, row: number, column: number): PlacedPieceInput => ({
  id,
  row,
  column,
  rowSpan: 1,
  columnSpan: 1,
  construction: { kind: 'square' },
});

describe('W-02 block assembly', () => {
  // A nine-patch grid: 12 finished inches in 3 by 3 cells of 4 inches.
  const grid = planned(divideGrid(192, 3, 3));

  test('a nine-patch assembles from nine placed squares', () => {
    const pieces: PlacedPieceInput[] = [];
    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        pieces.push(square(`p${row}${column}`, row, column));
      }
    }
    const block = planned(assembleBlock(grid, pieces));
    expect(block.pieces).toHaveLength(9);
    expect(block.grid).toBe(grid);
  });

  test('a piece that hangs off the grid is refused by name', () => {
    const outside = assembleBlock(grid, [square('over', 3, 0)]);
    expect(refusalKind(outside)).toBe('placement-outside-grid');
    if (!outside.ok && outside.refusal.kind === 'placement-outside-grid') {
      expect(outside.refusal.pieceId).toBe('over');
    }
    const wide = assembleBlock(grid, [
      {
        id: 'wide',
        row: 0,
        column: 2,
        rowSpan: 1,
        columnSpan: 2,
        construction: { kind: 'rectangle' },
      },
    ]);
    expect(refusalKind(wide)).toBe('placement-outside-grid');
  });

  test('two pieces cannot share a grid cell', () => {
    const result = assembleBlock(grid, [
      {
        id: 'left',
        row: 0,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
        construction: { kind: 'rectangle' },
      },
      {
        id: 'right',
        row: 0,
        column: 1,
        rowSpan: 1,
        columnSpan: 2,
        construction: { kind: 'rectangle' },
      },
    ]);
    expect(refusalKind(result)).toBe('overlapping-pieces');
    if (!result.ok && result.refusal.kind === 'overlapping-pieces') {
      expect(result.refusal.pieceId).toBe('right');
      expect(result.refusal.otherPieceId).toBe('left');
    }
  });

  test('a placement that is not whole grid cells is refused', () => {
    expect(refusalKind(assembleBlock(grid, [{ ...square('a', 0, 0), rowSpan: 0 }]))).toBe(
      'bad-placement',
    );
    expect(refusalKind(assembleBlock(grid, [{ ...square('a', 0, 0), column: 1.5 }]))).toBe(
      'bad-placement',
    );
    expect(refusalKind(assembleBlock(grid, [{ ...square('a', 0, 0), row: -1 }]))).toBe(
      'bad-placement',
    );
  });

  test('every piece needs its own name', () => {
    expect(refusalKind(assembleBlock(grid, [square('p', 0, 0), square('p', 1, 0)]))).toBe(
      'duplicate-piece-id',
    );
    expect(refusalKind(assembleBlock(grid, [{ ...square('a', 0, 0), id: ' ' }]))).toBe(
      'bad-piece-id',
    );
  });

  test('a turn count outside the four quarter turns is refused as a value', () => {
    const result = assembleBlock(grid, [
      { ...square('a', 0, 0), orientation: { turns: 4, mirrored: false } },
    ]);
    expect(refusalKind(result)).toBe('bad-orientation');
    if (!result.ok && result.refusal.kind === 'bad-orientation') {
      expect(result.refusal.turns).toBe(4);
    }
  });

  test('a placed piece keeps its own orientation, unrotated by default', () => {
    const block = planned(
      assembleBlock(grid, [
        square('plain', 0, 0),
        { ...square('turned', 1, 0), orientation: { turns: 1, mirrored: true } },
      ]),
    );
    expect(block.pieces[0]?.orientation).toEqual({ turns: 0, mirrored: false });
    expect(block.pieces[1]?.orientation).toEqual({ turns: 1, mirrored: true });
  });

  test('uncovered cells are reported for a block that does not yet tile its grid', () => {
    const block = planned(assembleBlock(grid, [square('p', 0, 0)]));
    const missing = uncoveredCells(block);
    expect(missing).toHaveLength(8);
    expect(missing[0]).toEqual({ row: 0, column: 1, rowSpan: 1, columnSpan: 1 });
  });
});

describe('W-02 finished, unfinished and cut measurements are distinct', () => {
  test('a 12-inch block is unfinished 12 1/2, never 12', () => {
    const grid = planned(divideGrid(192, 3, 3));
    const block = planned(assembleBlock(grid, [square('p', 0, 0)]));
    const measurements = planned(blockMeasurements(block));
    expect(L.formatInches(measurements.finishedSide)).toBe('12');
    expect(L.formatInches(measurements.unfinishedSide)).toBe('12 1/2');
    expect(measurements.finishedSide).not.toBe(measurements.unfinishedSide);
  });

  test('a block is never rounded before joining (G-02)', () => {
    // 3 1/16 finished is 49 sixteenths; the unfinished side is 3 9/16 (57),
    // not the next eighth, 3 5/8 (58) -- the distinction from a cut, which
    // does round up to the next eighth.
    const grid = planned(divideGrid(49, 1, 1));
    const block = planned(assembleBlock(grid, [square('p', 0, 0)]));
    const measurements = planned(blockMeasurements(block));
    expect(L.formatInches(measurements.finishedSide)).toBe('3 1/16');
    expect(L.toSixteenthCount(measurements.unfinishedSide)).toBe(57);
    expect(L.formatInches(measurements.unfinishedSide)).toBe('3 9/16');
  });
});

describe('W-03 placed copies are independent and alter nothing', () => {
  // A mixed block: a goose, two squares and a rectangle on a 4-inch grid.
  const grid = planned(divideGrid(128, 4, 4)); // 8 finished inches, 2-inch cells
  const definition: Block = planned(
    assembleBlock(
      grid,
      [
        {
          id: 'goose',
          row: 0,
          column: 0,
          rowSpan: 1,
          columnSpan: 2,
          construction: { kind: 'goose-one' },
        },
        square('a', 0, 2),
        square('b', 0, 3),
        {
          id: 'bar',
          row: 1,
          column: 0,
          rowSpan: 1,
          columnSpan: 4,
          construction: { kind: 'rectangle' },
        },
        { ...square('c', 2, 0), rowSpan: 2, columnSpan: 2, construction: { kind: 'rectangle' } },
        square('d', 2, 2),
        square('e', 2, 3),
        square('f', 3, 2),
        square('g', 3, 3),
      ],
      [{ id: 'seam-1', shape: 'straight' }],
    ),
  );
  const before = JSON.stringify(definition);

  test('rotateQuarter and mirrorPlaced move the copy, not the definition', () => {
    // Turn first, then mirror: M R = R^-1 M, so the pair is 270 degrees,
    // mirrored.
    const placed = mirrorPlaced(rotateQuarter(placeBlock(definition)));
    expect(placed.orientation).toEqual({ turns: 3, mirrored: true });
    expect(placed.definition).toBe(definition);
    expect(JSON.stringify(definition)).toBe(before);
  });

  test('each copy is oriented independently', () => {
    const plain = placeBlock(definition);
    const turned = rotateQuarter(placeBlock(definition));
    const flipped = mirrorPlaced(placeBlock(definition));
    expect(plain.orientation).toEqual({ turns: 0, mirrored: false });
    expect(turned.orientation).toEqual({ turns: 1, mirrored: false });
    expect(flipped.orientation).toEqual({ turns: 0, mirrored: true });
    expect(JSON.stringify(definition)).toBe(before);
  });

  test('the placed geometry transposes the grid and maps every region', () => {
    const placed = placedGeometry(placeBlock(definition, { turns: 1, mirrored: false }));
    expect(placed.grid.rows).toBe(4);
    expect(placed.grid.columns).toBe(4);
    expect(L.toSixteenthCount(placed.grid.cellHeight)).toBe(32);
    // The goose region (rows 0, columns 0-1) transposes to (row 0-1, column 3).
    const goose = placed.pieces.find((piece) => piece.id === 'goose');
    expect(goose?.rect).toEqual({ row: 0, column: 3, rowSpan: 2, columnSpan: 1 });
    // Its orientation is composed with the block's turn.
    expect(goose?.orientation).toEqual({ turns: 1, mirrored: false });
    // The definition's own piece is untouched.
    expect(definition.pieces[0]?.rect).toEqual({ row: 0, column: 0, rowSpan: 1, columnSpan: 2 });
  });

  test('a non-square grid transposes with the block', () => {
    const wide = planned(divideGrid(192, 2, 4)); // cells 6 x 3 inches
    const block = planned(assembleBlock(wide, [square('p', 0, 0)]));
    const placed = placedGeometry(placeBlock(block, { turns: 1, mirrored: false }));
    expect(placed.grid.rows).toBe(4);
    expect(placed.grid.columns).toBe(2);
    expect(L.formatInches(placed.grid.cellHeight)).toBe('3');
    expect(L.formatInches(placed.grid.cellWidth)).toBe('6');
  });
});
