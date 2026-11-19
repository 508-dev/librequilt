// librequilt -- the straight-set grid: positions and the finished interior size
// (L-01).
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * L-01: "For C columns of finished block width Bx and R rows of finished block
 * height By, finished interior size is C*Bx + (C-1+ox)Sx by
 * R*By + (R-1+oy)Sy, where each o is zero without outer sashing or two with
 * outer sashing. If sashing is absent, its width and contribution are zero. A
 * cornerstone replaces an equal-size sash intersection, so it adds no length.
 * Plain positions keep the same block dimensions."
 *
 * W-04 places "equal finished-size square blocks", so one finished block side
 * stands for Bx and By, and L-02's "the selected finished sash width" is one
 * width standing for Sx and Sy (see docs/verification/IMPL-04.md for that
 * reading). Everything here is whole sixteenths (G-01, I1): the interior size
 * is integer arithmetic, and a size the project cannot store is refused rather
 * than clamped.
 *
 * Every `StraightGrid` comes from `straightGrid`, which validates the counts
 * and sizes and proves the interior fits the stored range, so the geometry
 * helpers below cannot overflow it. Positions carry `core/block`'s placed
 * copies (W-03: oriented independently of the library definition); a plain
 * position occupies the same finished block dimensions and demands no piece.
 */

import type { PlacedBlock } from '../block/block';
import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import { readFinishedSize } from '../unit/plan';
import type { LayoutResult } from './refusal';
import { ok, refused } from './refusal';

/** The finished size of a rectangle of the top: L-01's W by H. */
export interface FinishedSize {
  readonly width: Sixteenths;
  readonly height: Sixteenths;
}

/** How sashing runs across the grid (L-01, L-02, W-04). */
export interface Sashing {
  /**
   * The selected finished sash width, always more than zero. G-01 allows a
   * zero width only for an *absent* sash, and absent sashing is `null` below,
   * never a zero-width strip.
   */
  readonly width: Sixteenths;
  /** Each sash intersection becomes an equal-size cornerstone (L-02). */
  readonly cornerstones: boolean;
  /** Sashing also runs around the outside: `o = 2` in L-01, not `o = 0`. */
  readonly outer: boolean;
}

/**
 * The straight-set grid: R by C equal finished-size square block positions
 * (W-04, L-01). Sashing is either absent (`null`, the zero of G-01) or present
 * at one finished width.
 */
export interface StraightGrid {
  readonly rows: number;
  readonly columns: number;
  /** The equal square finished side of every block position (W-04). */
  readonly blockSide: Sixteenths;
  readonly sashing: Sashing | null;
}

/** A grid as the quilter sets it up, before validation. */
export interface GridInput {
  readonly rows: number;
  readonly columns: number;
  /** The finished block side in sixteenths (G-01). */
  readonly blockSide: number;
  /**
   * Omit (or pass undefined) for no sashing at all: its width and contribution
   * are zero (L-01). A present sashing names one finished width above zero.
   */
  readonly sashing?:
    | {
        readonly width: number;
        readonly cornerstones: boolean;
        readonly outer: boolean;
      }
    | undefined;
}

/**
 * One position of the straight grid, in grid cells.
 *
 * A position is plain or holds one placed block copy. The same value reads a
 * position the quilter set and describes the resolved grid: unlisted positions
 * resolve to plain, because leaving a position plain is a state, not a piece
 * (W-04: "leave a position plain").
 */
export type Position =
  | {
      readonly row: number;
      readonly column: number;
      readonly kind: 'plain';
    }
  | {
      readonly row: number;
      readonly column: number;
      readonly kind: 'block';
      readonly block: PlacedBlock;
    };

/**
 * Read a straight grid from what the quilter set.
 *
 * The row and column counts have to be whole numbers of at least one. The
 * finished block side is read as a stored length (G-01): a whole number of
 * sixteenths above zero and inside the stored range, or the unit layer's
 * refusal. A present sashing names one finished width above zero -- zero
 * means absent, and absent means omit the sashing. Then the finished interior
 * size (L-01) itself has to fit the stored range, or the grid is refused with
 * the same out-of-range message a measurement gets.
 */
export function straightGrid(input: GridInput): LayoutResult<StraightGrid> {
  const rows = readGridCount(input.rows, 'rows');
  if (!rows.ok) return rows;
  const columns = readGridCount(input.columns, 'columns');
  if (!columns.ok) return columns;
  const blockSide = readFinishedSize(input.blockSide);
  if (!blockSide.ok) return refused(blockSide.refusal);

  let sashing: Sashing | null = null;
  if (input.sashing !== undefined) {
    const width = readFinishedSize(input.sashing.width);
    if (!width.ok) return refused(width.refusal);
    sashing = {
      width: width.value,
      cornerstones: input.sashing.cornerstones,
      outer: input.sashing.outer,
    };
  }

  const grid: StraightGrid = {
    rows: rows.value,
    columns: columns.value,
    blockSide: blockSide.value,
    sashing,
  };
  const counts = interiorCounts(grid);
  if (!L.isSixteenths(counts.width) || !L.isSixteenths(counts.height)) {
    return refused({
      kind: 'out-of-range',
      maximumInches: L.MAX_LENGTH_SIXTEENTHS / L.SIXTEENTHS_PER_INCH,
    });
  }
  return ok(grid);
}

/**
 * The finished interior size of the grid, before any border (L-01):
 * `C*B + (C-1+o)S` by `R*B + (R-1+o)S`, with `o` zero or two.
 *
 * Infallible: `straightGrid` has already proved both dimensions fit the
 * stored range, so the brands below cannot throw.
 */
export function interiorFinishedSize(grid: StraightGrid): FinishedSize {
  const counts = interiorCounts(grid);
  return { width: L.sixteenths(counts.width), height: L.sixteenths(counts.height) };
}

/**
 * Resolve every position of the grid, row by row.
 *
 * Listed positions are validated (whole cells, inside the grid, one block per
 * position, every block at the layout's equal finished size) and fill their
 * cell; every unlisted cell resolves to plain. A plain position keeps the same
 * block dimensions (L-01) and appears in the result so the editing surface and
 * the chart can count positions without re-deriving the grid.
 */
export function resolvePositions(
  grid: StraightGrid,
  inputs: readonly Position[] = [],
): LayoutResult<readonly Position[]> {
  const given = new Map<number, Position>();
  for (const input of inputs) {
    if (!Number.isInteger(input.row) || input.row < 0) {
      return refused({ kind: 'bad-position', axis: 'rows', value: input.row });
    }
    if (!Number.isInteger(input.column) || input.column < 0) {
      return refused({ kind: 'bad-position', axis: 'columns', value: input.column });
    }
    if (input.row >= grid.rows || input.column >= grid.columns) {
      return refused({
        kind: 'position-outside-grid',
        row: input.row,
        column: input.column,
        rows: grid.rows,
        columns: grid.columns,
      });
    }
    const key = input.row * grid.columns + input.column;
    if (given.has(key)) {
      return refused({ kind: 'duplicate-position', row: input.row, column: input.column });
    }
    if (input.kind === 'block') {
      const actual = input.block.definition.grid.finishedSide;
      if (actual !== grid.blockSide) {
        return refused({
          kind: 'block-finished-size-mismatch',
          row: input.row,
          column: input.column,
          expected: grid.blockSide,
          actual,
        });
      }
    }
    given.set(key, input);
  }

  const positions: Position[] = [];
  for (let row = 0; row < grid.rows; row += 1) {
    for (let column = 0; column < grid.columns; column += 1) {
      positions.push(given.get(row * grid.columns + column) ?? { row, column, kind: 'plain' });
    }
  }
  return ok(positions);
}

/**
 * Read an optional finished size: zero is the absent sash or border G-01
 * allows, and every other value is read as a stored length. Callers that need
 * a present size use `core/unit`'s `readFinishedSize`, which refuses zero.
 */
export function readOptionalFinishedSize(value: number): LayoutResult<Sixteenths> {
  if (value === 0) return ok(L.sixteenths(0));
  const read = readFinishedSize(value);
  if (!read.ok) return refused(read.refusal);
  return ok(read.value);
}

function readGridCount(value: number, axis: 'rows' | 'columns'): LayoutResult<number> {
  if (!Number.isInteger(value) || value < 1) {
    return refused({ kind: 'bad-grid-count', axis, value });
  }
  return ok(value);
}

/** L-01's formula as raw sixteenth counts, before the stored-range check. */
function interiorCounts(grid: StraightGrid): { readonly width: number; readonly height: number } {
  const sash = grid.sashing === null ? 0 : L.toSixteenthCount(grid.sashing.width);
  const outer = grid.sashing?.outer ? 2 : 0;
  const block = L.toSixteenthCount(grid.blockSide);
  return {
    width: grid.columns * block + (grid.columns - 1 + outer) * sash,
    height: grid.rows * block + (grid.rows - 1 + outer) * sash,
  };
}
