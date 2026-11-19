// librequilt -- units placed on the block grid (W-02, W-03).
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * W-02's drawn units: squares, rectangles, right-isosceles half-square
 * triangles, quarter-square triangles, flying-geese units and straight strips.
 * The square-in-a-square construction is here too because G-08 defines it "so
 * that it fits the block grid" and W-03's library blocks need it; per
 * clarification Q-03 the drawing surface (IMPL-19) does not offer it as a
 * drawing tool. A stitch-and-flip corner (G-07) is deliberately absent: it is
 * a corner treatment on another piece, not a region of the grid, and the
 * specification does not say how it attaches to a placed piece.
 *
 * A placed piece is a region of cells plus the construction that cuts it. Its
 * finished size is derived from the region through its orientation -- the
 * measured grid is the only source of a measurement (I6) -- so a piece's
 * definition size and its grid footprint are the same fact seen from two
 * sides, and G-03's "rotation and mirroring do not change these numbers" is
 * true by construction: planning always uses the definition size.
 *
 * `construction: null` keeps a piece as a visual draft: drawn, but with no
 * rotary construction identified yet. The block keeps it and reports it before
 * export (W-02, P-03); it is never guessed at.
 */

import type { Sixteenths } from '../exact/length';
import type { BlockGrid, GridRect } from './grid';
import { rectFinishedSize } from './grid';
import { definitionSize, type Orientation } from './orientation';

/**
 * The rotary construction method chosen for a piece (G-03 to G-08). The
 * finished sizes are not carried here: they come from the piece's grid region
 * and its orientation, so a construction cannot disagree with the drawing.
 */
export type PieceConstruction =
  | { readonly kind: 'square' }
  | { readonly kind: 'rectangle' }
  | { readonly kind: 'strip' }
  | { readonly kind: 'hst-two'; readonly oversized: boolean }
  | { readonly kind: 'hst-four' }
  | { readonly kind: 'hst-eight'; readonly oversized: boolean }
  | { readonly kind: 'quarter-square'; readonly oversized: boolean }
  | { readonly kind: 'goose-one' }
  | { readonly kind: 'goose-four' }
  | { readonly kind: 'square-in-square' };

export type PieceConstructionKind = PieceConstruction['kind'];

/** A construction planned as a unit group: everything but the straight strip. */
export type UnitConstruction = Exclude<PieceConstruction, { readonly kind: 'strip' }>;

/** A piece as a caller supplies it, before placement validation. */
export interface PlacedPieceInput {
  /** A name the chart and every refusal use to identify the piece. */
  readonly id: string;
  readonly row: number;
  readonly column: number;
  readonly rowSpan: number;
  readonly columnSpan: number;
  /** `null` keeps the piece as a visual draft with no construction yet. */
  readonly construction: PieceConstruction | null;
  /**
   * How this placed copy is turned or mirrored; unrotated by default. Plain
   * values, so a turn count outside the four quarter turns is refused as a
   * value rather than trusted (I5).
   */
  readonly orientation?: { readonly turns: number; readonly mirrored: boolean };
}

/** A piece placed on the measured grid, in whole cells. */
export interface PlacedPiece {
  readonly id: string;
  readonly rect: GridRect;
  readonly construction: PieceConstruction | null;
  readonly orientation: Orientation;
}

/**
 * The piece's finished size in its own definition orientation: the grid
 * region's finished size seen through the inverse of the piece's orientation.
 */
export function pieceDefinitionSize(
  grid: BlockGrid,
  piece: PlacedPiece,
): { readonly width: Sixteenths; readonly height: Sixteenths } {
  const footprint = rectFinishedSize(grid, piece.rect);
  return definitionSize(piece.orientation, footprint.width, footprint.height);
}

/**
 * The finished width and length of a straight strip piece (G-03).
 *
 * A strip is long and narrow: its finished width is the shorter finished side
 * of its region and its finished length is the longer one, whichever way the
 * strip runs across the block.
 */
export function stripSize(size: { readonly width: Sixteenths; readonly height: Sixteenths }): {
  readonly width: Sixteenths;
  readonly length: Sixteenths;
} {
  return size.width <= size.height
    ? { width: size.width, length: size.height }
    : { width: size.height, length: size.width };
}

/**
 * Whether a construction can produce this finished size.
 *
 * The square family (G-03's square, the triangle units and G-08) needs equal
 * sides; the flying-geese family (G-07) needs a finished width twice its
 * height. A rectangle and a straight strip fit any region. The cut formulas
 * themselves stay `core/unit`'s: this only decides whether a piece's region
 * and its claimed method can describe the same unit at all.
 */
export function constructionFits(
  construction: PieceConstruction,
  width: Sixteenths,
  height: Sixteenths,
): boolean {
  switch (construction.kind) {
    case 'rectangle':
    case 'strip':
      return true;
    case 'goose-one':
    case 'goose-four':
      return width === height * 2;
    default:
      return width === height;
  }
}

/** The pieces that plan to one unit group: same method, options and size. */
export function groupKey(
  construction: PieceConstruction,
  width: Sixteenths,
  height: Sixteenths,
): string {
  const oversized = 'oversized' in construction ? String(construction.oversized) : '';
  return `${construction.kind}|${oversized}|${width}|${height}`;
}
