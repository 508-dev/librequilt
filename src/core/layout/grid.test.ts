// librequilt -- tests for L-01, the straight grid: finished size and positions.
//
// Every expected value below is quoted from `python3
// docs/specification-fixtures.py` with the fixture line named in the test
// comment, or computed in whole sixteenths as the comment states.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import {
  assembleBlock,
  mirrorPlaced,
  type PlacedBlock,
  placeBlock,
  rotateQuarter,
} from '../block/block';
import { divideGrid } from '../block/grid';
import * as L from '../exact/length';
import type { GridInput, Position, StraightGrid } from './grid';
import {
  interiorFinishedSize,
  readOptionalFinishedSize,
  resolvePositions,
  straightGrid,
} from './grid';
import type { LayoutResult } from './refusal';

const planned = <T>(
  result:
    | { readonly ok: true; readonly value: T }
    | { readonly ok: false; readonly refusal: { readonly kind: string } },
): T => {
  if (!result.ok) throw new Error(`expected a plan, got the refusal ${result.refusal.kind}`);
  return result.value;
};
const refusalKind = (result: LayoutResult<unknown>): string | undefined =>
  result.ok ? undefined : result.refusal.kind;

// The T-02 sampler's numbers: 12-inch blocks (192 sixteenths), 2-inch sashing
// (32 sixteenths), three rows and two columns.
const sampler = (sashing: GridInput['sashing']): StraightGrid =>
  planned(straightGrid({ rows: 3, columns: 2, blockSide: 192, sashing }));

const blockOf = (finishedSide: number): PlacedBlock => {
  const grid = planned(divideGrid(finishedSide, 1, 1));
  const block = planned(
    assembleBlock(grid, [
      { id: 'p', row: 0, column: 0, rowSpan: 1, columnSpan: 1, construction: { kind: 'square' } },
    ]),
  );
  return placeBlock(block);
};

const size = (grid: StraightGrid): string => {
  const interior = interiorFinishedSize(grid);
  return `${L.formatInches(interior.width)} x ${L.formatInches(interior.height)}`;
};

describe('L-01 straight grid size', () => {
  test('T-02: the sampler interior is 30 x 44 inches with sashing between and around', () => {
    // fixtures LAYOUTS: "sampler: 30 x 44 inner; 38 x 52 finished"
    // 2*12 + (2-1+2)*2 = 30 across; 3*12 + (3-1+2)*2 = 44 down.
    expect(size(sampler({ width: 32, cornerstones: true, outer: true }))).toBe('30 x 44');
  });

  test('T-02: without outer sashing the interior is 26 x 40 inches', () => {
    // fixtures LAYOUTS: "sampler without outer sashing or border: 26 x 40 in"
    // 2*12 + (2-1)*2 = 26 across; 3*12 + (3-1)*2 = 40 down.
    expect(size(sampler({ width: 32, cornerstones: true, outer: false }))).toBe('26 x 40');
  });

  test('L-01: a cornerstone replaces an equal-size sash intersection and adds no length', () => {
    const withCornerstones = sampler({ width: 32, cornerstones: true, outer: true });
    const withoutCornerstones = sampler({ width: 32, cornerstones: false, outer: true });
    expect(size(withoutCornerstones)).toBe('30 x 44');
    expect(size(withoutCornerstones)).toBe(size(withCornerstones));
  });

  test('L-01: plain positions keep the same block dimensions', () => {
    // Positions are pieces, not geometry: one block, two blocks or all plain,
    // the interior is the same 30 x 44.
    const grid = sampler({ width: 32, cornerstones: true, outer: true });
    const plain = planned(resolvePositions(grid));
    expect(plain).toHaveLength(6);
    expect(plain.every((position) => position.kind === 'plain')).toBe(true);
    const oneBlock = planned(
      resolvePositions(grid, [{ row: 0, column: 0, kind: 'block', block: blockOf(192) }]),
    );
    expect(oneBlock.filter((position) => position.kind === 'block')).toHaveLength(1);
    expect(size(grid)).toBe('30 x 44');
  });

  test('L-01: with sashing absent its width and contribution are zero', () => {
    // 2*12 and 3*12 with no sash terms at all.
    expect(size(sampler(undefined))).toBe('24 x 36');
  });

  test('the 1 by 1 grid shows the o term alone', () => {
    // With outer sashing: 12 + 2*2 = 16 each way; without: the block alone.
    const outer = planned(
      straightGrid({
        rows: 1,
        columns: 1,
        blockSide: 192,
        sashing: { width: 32, cornerstones: true, outer: true },
      }),
    );
    expect(size(outer)).toBe('16 x 16');
    const inner = planned(
      straightGrid({
        rows: 1,
        columns: 1,
        blockSide: 192,
        sashing: { width: 32, cornerstones: true, outer: false },
      }),
    );
    expect(size(inner)).toBe('12 x 12');
  });
});

describe('L-01 grid refusals and positions', () => {
  test('a row or column count the grid cannot hold is refused', () => {
    expect(refusalKind(straightGrid({ rows: 0, columns: 2, blockSide: 192 }))).toBe(
      'bad-grid-count',
    );
    expect(refusalKind(straightGrid({ rows: 3, columns: 1.5, blockSide: 192 }))).toBe(
      'bad-grid-count',
    );
    const rows = straightGrid({ rows: -1, columns: 2, blockSide: 192 });
    if (!rows.ok && rows.refusal.kind === 'bad-grid-count') {
      expect(rows.refusal.axis).toBe('rows');
      expect(rows.refusal.value).toBe(-1);
    }
  });

  test('T-01 at layout scale: a zero block, a 3.01-inch entry and a zero sash are refused', () => {
    // T-01: "Reject a 3.01-inch entered length, a zero finished block".
    expect(refusalKind(straightGrid({ rows: 3, columns: 2, blockSide: 0 }))).toBe('zero-size');
    expect(refusalKind(straightGrid({ rows: 3, columns: 2, blockSide: 48.16 }))).toBe(
      'not-a-whole-sixteenth',
    );
    // A present sashing names a width above zero; absent sashing is omitted.
    expect(
      refusalKind(
        straightGrid({
          rows: 3,
          columns: 2,
          blockSide: 192,
          sashing: { width: 0, cornerstones: false, outer: true },
        }),
      ),
    ).toBe('zero-size');
  });

  test('an interior size the project cannot store is refused, not clamped', () => {
    // 84 rows of 12 inches is 1008 inches, past the stored maximum of 1000.
    const result = straightGrid({ rows: 84, columns: 1, blockSide: 192 });
    expect(refusalKind(result)).toBe('out-of-range');
  });

  test('an absent optional size reads as zero (G-01)', () => {
    expect(L.toSixteenthCount(planned(readOptionalFinishedSize(0)))).toBe(0);
    expect(refusalKind(readOptionalFinishedSize(-16))).toBe('negative-size');
  });

  test('every position resolves: listed ones fill their cell, the rest are plain', () => {
    const grid = sampler({ width: 32, cornerstones: true, outer: true });
    const positions = planned(
      resolvePositions(grid, [
        { row: 2, column: 1, kind: 'block', block: blockOf(192) },
        { row: 0, column: 0, kind: 'block', block: blockOf(192) },
        { row: 1, column: 1, kind: 'plain' },
      ]),
    );
    expect(positions).toHaveLength(6);
    expect(positions.map((position) => `${position.row},${position.column}`)).toEqual([
      '0,0',
      '0,1',
      '1,0',
      '1,1',
      '2,0',
      '2,1',
    ]);
    const kinds = positions.map((position) => position.kind);
    expect(kinds).toEqual(['block', 'plain', 'plain', 'plain', 'plain', 'block']);
  });

  test('a position outside the grid, twice listed, or fractional is refused', () => {
    const grid = planned(straightGrid({ rows: 3, columns: 2, blockSide: 192 }));
    expect(refusalKind(resolvePositions(grid, [{ row: 3, column: 0, kind: 'plain' }]))).toBe(
      'position-outside-grid',
    );
    expect(
      refusalKind(
        resolvePositions(grid, [
          { row: 1, column: 1, kind: 'plain' },
          { row: 1, column: 1, kind: 'block', block: blockOf(192) },
        ]),
      ),
    ).toBe('duplicate-position');
    expect(refusalKind(resolvePositions(grid, [{ row: 1.5, column: 0, kind: 'plain' }]))).toBe(
      'bad-position',
    );
    const outside = resolvePositions(grid, [{ row: 0, column: 2, kind: 'plain' }]);
    if (!outside.ok && outside.refusal.kind === 'position-outside-grid') {
      expect(outside.refusal.columns).toBe(2);
    }
  });

  test('a block that is not the layout’s equal finished size is refused', () => {
    const grid = planned(straightGrid({ rows: 3, columns: 2, blockSide: 192 }));
    const result = resolvePositions(grid, [
      { row: 0, column: 1, kind: 'block', block: blockOf(120) },
    ]);
    expect(refusalKind(result)).toBe('block-finished-size-mismatch');
    if (!result.ok && result.refusal.kind === 'block-finished-size-mismatch') {
      expect(L.toSixteenthCount(result.refusal.expected)).toBe(192);
      expect(L.toSixteenthCount(result.refusal.actual)).toBe(120);
    }
  });

  test('placed copies keep their own orientation in the resolved positions', () => {
    // W-04: "orient a position independently" -- the copy's orientation, not
    // the definition's, is what the position carries.
    const grid = planned(straightGrid({ rows: 1, columns: 1, blockSide: 192 }));
    const placed = mirrorPlaced(rotateQuarter(blockOf(192)));
    const positions = planned(
      resolvePositions(grid, [{ row: 0, column: 0, kind: 'block', block: placed }]),
    );
    const position = positions[0] as Position;
    if (position.kind !== 'block') throw new Error('expected a block position');
    expect(position.block.orientation).toEqual(placed.orientation);
    expect(position.block.definition).toBe(placed.definition);
  });
});
