// librequilt -- the block as a measured grid of units (W-02, W-03).
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * W-02's square finished block: a measured grid, units placed on it, the
 * seam topology of the drawing, and the distinction between the finished
 * block and its unfinished and cut measurements. W-03's placement rule lives
 * here too: a placed copy carries its own rotation and mirroring and never
 * alters the definition it came from -- "place independently rotated or
 * mirrored copies without modifying the library definition".
 *
 * A `Block` value is the quilter's drawing, including a drawing kept as a
 * visual draft. Assembly validates only what the measured grid makes
 * structural: whole-cell placements, inside the grid, no two pieces sharing a
 * cell, each piece named. Whether the block can yield a cutting chart is
 * `planBlock`'s definite answer (`./plan`), which refuses with the offending
 * seam or the missing construction named.
 */

import type { Sixteenths } from '../exact/length';
import { trimTargetOrRefuse } from '../unit/plan';
import type { Seam } from '../unit/seams';
import type { BlockGrid, GridRect } from './grid';
import { rectCells, rectsOverlap, rectWithinGrid } from './grid';
import {
  compose,
  IDENTITY,
  MIRROR,
  mapRect,
  type Orientation,
  QUARTER_TURN,
  readOrientation,
} from './orientation';
import type { PlacedPiece, PlacedPieceInput } from './piece';
import type { BlockResult } from './refusal';
import { ok, refused } from './refusal';

/** A square finished block: its grid, its placed units, its drawn seams. */
export interface Block {
  readonly grid: BlockGrid;
  readonly pieces: readonly PlacedPiece[];
  /** The drawn seam topology, each seam named so a refusal can identify it. */
  readonly seams: readonly Seam[];
}

/** The block's two size vocabularies, always available and always distinct. */
export interface BlockMeasurements {
  /** The displayed finished side: what the block finishes at in the quilt. */
  readonly finishedSide: Sixteenths;
  /**
   * The unfinished sewn side, `F + 1/2` exactly (G-02 never rounds a block):
   * the quarter-inch seam margin of each exterior side. Not a cut size.
   */
  readonly unfinishedSide: Sixteenths;
}

/**
 * Assemble a block from its grid, its placed units and its drawn seams.
 *
 * Every placement is checked against the measured grid, and every refusal
 * names the piece at fault so the drawing surface can point at it. A piece may
 * carry `construction: null`: that is a visual draft, kept here and reported
 * by `planBlock` before any export, never guessed at.
 */
export function assembleBlock(
  grid: BlockGrid,
  pieces: readonly PlacedPieceInput[],
  seams: readonly Seam[] = [],
): BlockResult<Block> {
  const placed: PlacedPiece[] = [];
  for (const input of pieces) {
    const piece = readPiece(input);
    if (!piece.ok) return piece;
    if (placed.some((other) => other.id === piece.value.id)) {
      return refused({ kind: 'duplicate-piece-id', pieceId: piece.value.id });
    }
    if (!rectWithinGrid(grid, piece.value.rect)) {
      return refused({ kind: 'placement-outside-grid', pieceId: piece.value.id });
    }
    for (const other of placed) {
      if (rectsOverlap(other.rect, piece.value.rect)) {
        return refused({
          kind: 'overlapping-pieces',
          pieceId: piece.value.id,
          otherPieceId: other.id,
        });
      }
    }
    placed.push(piece.value);
  }
  return ok({ grid, pieces: placed, seams });
}

function readPiece(input: PlacedPieceInput): BlockResult<PlacedPiece> {
  if (typeof input.id !== 'string' || input.id.trim() === '') {
    return refused({ kind: 'bad-piece-id', pieceId: String(input.id) });
  }
  for (const value of [input.row, input.column]) {
    if (!Number.isInteger(value) || value < 0) {
      return refused({ kind: 'bad-placement', pieceId: input.id, value });
    }
  }
  for (const value of [input.rowSpan, input.columnSpan]) {
    if (!Number.isInteger(value) || value < 1) {
      return refused({ kind: 'bad-placement', pieceId: input.id, value });
    }
  }
  let orientation: Orientation = IDENTITY;
  if (input.orientation !== undefined) {
    const read = readOrientation(input.orientation.turns, input.orientation.mirrored);
    if (!read.ok) return read;
    orientation = read.value;
  }
  return ok({
    id: input.id,
    rect: {
      row: input.row,
      column: input.column,
      rowSpan: input.rowSpan,
      columnSpan: input.columnSpan,
    },
    construction: input.construction,
    orientation,
  });
}

/**
 * The finished and unfinished measurements of the block.
 *
 * These are distinct from every cut measurement: the finished side is what the
 * block contributes to the quilt, the unfinished side is what the sewn block
 * measures before joining (G-02: "Do not round ... a block before joining it
 * to another"), and the cut sizes live on the plans in `./plan`.
 */
export function blockMeasurements(block: Block): BlockResult<BlockMeasurements> {
  return blockMeasurementsOf(block.grid);
}

/** The same measurements from a grid alone, for a draft or a placed copy. */
export function blockMeasurementsOf(grid: BlockGrid): BlockResult<BlockMeasurements> {
  // `F + 1/2` exactly, never rounded; the shared helper also checks the
  // stored range, so a block at the top of the range refuses instead of
  // overflowing (the same rule as a trim target, which is the same number).
  const unfinished = trimTargetOrRefuse(grid.finishedSide);
  if (!unfinished.ok) return unfinished;
  return ok({ finishedSide: grid.finishedSide, unfinishedSide: unfinished.value });
}

/** A placed copy of a block definition, oriented independently (W-03). */
export interface PlacedBlock {
  /** The definition; a placed copy never modifies it. */
  readonly definition: Block;
  readonly orientation: Orientation;
}

/** Place a copy of a definition. The definition is shared, never altered. */
export function placeBlock(definition: Block, orientation: Orientation = IDENTITY): PlacedBlock {
  return { definition, orientation };
}

/** Rotate a placed copy one quarter turn clockwise, independently (W-03). */
export function rotateQuarter(placed: PlacedBlock): PlacedBlock {
  return { definition: placed.definition, orientation: compose(QUARTER_TURN, placed.orientation) };
}

/** Mirror a placed copy across its vertical axis, independently (W-03). */
export function mirrorPlaced(placed: PlacedBlock): PlacedBlock {
  return { definition: placed.definition, orientation: compose(MIRROR, placed.orientation) };
}

/**
 * The placed copy as a block: every region mapped through the orientation and
 * every piece's own orientation composed with the block's. A new value -- the
 * definition is untouched -- and its plans carry exactly the definition's cut
 * dimensions (G-03).
 */
export function placedGeometry(placed: PlacedBlock): Block {
  const { definition, orientation } = placed;
  const { rows, columns } = definition.grid;
  const transposed = orientation.turns % 2 === 1;
  return {
    grid: {
      ...definition.grid,
      rows: transposed ? columns : rows,
      columns: transposed ? rows : columns,
      cellHeight: transposed ? definition.grid.cellWidth : definition.grid.cellHeight,
      cellWidth: transposed ? definition.grid.cellHeight : definition.grid.cellWidth,
    },
    pieces: definition.pieces.map((piece) => ({
      ...piece,
      rect: mapRect(orientation, rows, columns, piece.rect),
      orientation: compose(orientation, piece.orientation),
    })),
    seams: definition.seams,
  };
}

/** Every cell of the grid that no piece covers, as 1x1 regions. */
export function uncoveredCells(block: Block): readonly GridRect[] {
  const covered = new Set<string>();
  for (const piece of block.pieces) {
    for (const cell of rectCells(piece.rect)) {
      covered.add(`${cell.row},${cell.column}`);
    }
  }
  const missing: GridRect[] = [];
  for (let row = 0; row < block.grid.rows; row += 1) {
    for (let column = 0; column < block.grid.columns; column += 1) {
      if (!covered.has(`${row},${column}`)) {
        missing.push({ row, column, rowSpan: 1, columnSpan: 1 });
      }
    }
  }
  return missing;
}
