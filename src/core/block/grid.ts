// librequilt -- the measured grid a block is drawn on (W-02, W-03).
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * W-02: "A quilter can draw a square finished block on a measured grid"; W-03:
 * the quilter "set[s] an eligible finished size". The eligibility is this
 * module's rule: the finished side divided into the grid's rows and columns
 * must land on whole sixteenths of an inch (G-01), or the division is refused.
 * A grid that would need half a sixteenth is never drawn and never rounded --
 * "A grid division that cannot be represented in whole sixteenths" is one of
 * the specification's named refusals.
 *
 * Everything a piece measures comes from the grid, never from a number typed
 * beside it: a placed unit's finished size is its span of cells. That is what
 * makes the block a *measured* grid and keeps I1 and I6 true at block scale.
 */

import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import { readFinishedSize } from '../unit/plan';
import type { BlockResult } from './refusal';
import { ok, refused } from './refusal';

/** A rectangular region of grid cells, in cells (a count, not a length). */
export interface GridRect {
  readonly row: number;
  readonly column: number;
  readonly rowSpan: number;
  readonly columnSpan: number;
}

/** A square finished block divided into a measured grid of cells. */
export interface BlockGrid {
  /** The square finished side of the block (G-01's stored input). */
  readonly finishedSide: Sixteenths;
  readonly rows: number;
  readonly columns: number;
  /** Finished height of one cell; a whole number of sixteenths. */
  readonly cellHeight: Sixteenths;
  /** Finished width of one cell; a whole number of sixteenths. */
  readonly cellWidth: Sixteenths;
}

/**
 * Divide a square finished block into `rows` by `columns` cells.
 *
 * The finished side is read as a stored length: a whole number of sixteenths
 * above zero and inside the stored range, or the unit layer's refusal (T-01
 * rejects a zero finished block and a 3.01-inch entry here). The row and
 * column counts have to be whole numbers of at least one. Then each division
 * of the finished side has to land on whole sixteenths; the first that does
 * not is refused with the axis named, because a quilter can fix it by choosing
 * a different division or a different finished size.
 */
export function divideGrid(
  finishedSide: number,
  rows: number,
  columns: number,
): BlockResult<BlockGrid> {
  const side = readFinishedSize(finishedSide);
  if (!side.ok) return side;
  const row = readGridCount(rows);
  if (!row.ok) return row;
  const column = readGridCount(columns);
  if (!column.ok) return column;

  const cellHeight = divideOrRefuse(side.value, rows, columns, 'rows');
  if (!cellHeight.ok) return cellHeight;
  const cellWidth = divideOrRefuse(side.value, rows, columns, 'columns');
  if (!cellWidth.ok) return cellWidth;

  return ok({
    finishedSide: side.value,
    rows,
    columns,
    cellHeight: cellHeight.value,
    cellWidth: cellWidth.value,
  });
}

function readGridCount(value: number): BlockResult<number> {
  if (!Number.isInteger(value) || value < 1) {
    return refused({ kind: 'bad-grid-count', value });
  }
  return ok(value);
}

function divideOrRefuse(
  finishedSide: Sixteenths,
  rows: number,
  columns: number,
  axis: 'rows' | 'columns',
): BlockResult<Sixteenths> {
  const count = L.toSixteenthCount(finishedSide);
  const divisions = axis === 'rows' ? rows : columns;
  if (count % divisions !== 0) {
    return refused({
      kind: 'grid-division-not-whole-sixteenths',
      finishedSide,
      rows,
      columns,
      axis,
    });
  }
  return ok(L.sixteenths(count / divisions));
}

/** The finished size of a grid region: its span of cells. */
export function rectFinishedSize(
  grid: BlockGrid,
  rect: GridRect,
): { readonly width: Sixteenths; readonly height: Sixteenths } {
  return {
    width: L.sixteenths(L.toSixteenthCount(grid.cellWidth) * rect.columnSpan),
    height: L.sixteenths(L.toSixteenthCount(grid.cellHeight) * rect.rowSpan),
  };
}

/** True when the region sits wholly inside the grid. */
export function rectWithinGrid(grid: BlockGrid, rect: GridRect): boolean {
  return (
    rect.row >= 0 &&
    rect.column >= 0 &&
    rect.row + rect.rowSpan <= grid.rows &&
    rect.column + rect.columnSpan <= grid.columns
  );
}

/** True when two regions share at least one grid cell. */
export function rectsOverlap(left: GridRect, right: GridRect): boolean {
  return (
    left.row < right.row + right.rowSpan &&
    right.row < left.row + left.rowSpan &&
    left.column < right.column + right.columnSpan &&
    right.column < left.column + left.columnSpan
  );
}

/** Every cell of a region, row by row. */
export function rectCells(rect: GridRect): readonly GridRect[] {
  const cells: GridRect[] = [];
  for (let row = rect.row; row < rect.row + rect.rowSpan; row += 1) {
    for (let column = rect.column; column < rect.column + rect.columnSpan; column += 1) {
      cells.push({ row, column, rowSpan: 1, columnSpan: 1 });
    }
  }
  return cells;
}
