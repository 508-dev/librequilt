// librequilt -- the block-level refusals, and the result every block answer
// carries.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * W-02 and W-03 at block scale: a grid division that cannot be represented in
 * whole sixteenths, a placement the measured grid cannot hold, a seam
 * topology outside the supported rotary constructions, a piece kept as a
 * visual draft without a construction -- each is a typed refusal naming what
 * is wrong (I5), never a thrown error. A thrown error means a defect in
 * librequilt itself.
 *
 * The seam refusal is `core/unit`'s own `UnsupportedSeamRefusal`, so a block
 * and a unit refuse in the same words (`core/unit/seams`). The unit
 * constructors' refusals are composed in unchanged, so a piece group that
 * cannot be planned surfaces the reason the unit layer already gives.
 */

import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import { describeUnitRefusal, type UnitRefusal } from '../unit/plan';
import type { GridRect } from './grid';
import type { PieceConstructionKind } from './piece';

/** A grid region whose rotary construction is missing: a draft to finish. */
export interface MissingConstruction {
  /** The drawn piece that has no construction, when a piece is the gap. */
  readonly pieceId?: string;
  /** The grid region still needing a construction. */
  readonly rect: GridRect;
}

/** Why a block cannot answer its question. Each is a value a quilter can cause. */
export type BlockRefusal =
  | UnitRefusal
  | { readonly kind: 'bad-grid-count'; readonly value: number }
  | {
      readonly kind: 'grid-division-not-whole-sixteenths';
      readonly finishedSide: Sixteenths;
      readonly rows: number;
      readonly columns: number;
      readonly axis: 'rows' | 'columns';
    }
  | { readonly kind: 'bad-orientation'; readonly turns: number }
  | { readonly kind: 'bad-piece-id'; readonly pieceId: string }
  | { readonly kind: 'bad-placement'; readonly pieceId: string; readonly value: number }
  | { readonly kind: 'duplicate-piece-id'; readonly pieceId: string }
  | { readonly kind: 'placement-outside-grid'; readonly pieceId: string }
  | {
      readonly kind: 'overlapping-pieces';
      readonly pieceId: string;
      readonly otherPieceId: string;
    }
  | {
      readonly kind: 'construction-does-not-fit';
      readonly pieceId: string;
      readonly construction: PieceConstructionKind;
      readonly width: Sixteenths;
      readonly height: Sixteenths;
    }
  | { readonly kind: 'missing-construction'; readonly missing: readonly MissingConstruction[] };

/** The outcome of any block question: an answer, or a typed refusal (I5). */
export type BlockResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly refusal: BlockRefusal };

/** A successful result. */
export function ok<T>(value: T): BlockResult<T> {
  return { ok: true, value };
}

/** A refused result, as a value (I5). */
export function refused(refusal: BlockRefusal): BlockResult<never> {
  return { ok: false, refusal };
}

/** A sentence a quilter can act on (A-01 requires understandable errors). */
export function describeBlockRefusal(refusal: BlockRefusal): string {
  switch (refusal.kind) {
    case 'bad-grid-count':
      return `Rows and columns have to be whole numbers of at least one, not ${refusal.value}.`;
    case 'grid-division-not-whole-sixteenths': {
      const divisions = refusal.axis === 'rows' ? refusal.rows : refusal.columns;
      return `A ${L.formatInches(refusal.finishedSide)}-inch finished block cannot be divided into ${divisions} equal ${refusal.axis} in whole sixteenths of an inch.`;
    }
    case 'bad-orientation':
      return `A rotation has to be a quarter turn of 0, 1, 2 or 3, not ${refusal.turns}.`;
    case 'bad-piece-id':
      return 'A piece needs a name so the chart and its refusals can identify it.';
    case 'bad-placement':
      return `Piece "${refusal.pieceId}" needs a whole-grid-cell placement, not ${refusal.value}.`;
    case 'duplicate-piece-id':
      return `Two pieces are both named "${refusal.pieceId}"; each piece needs its own name.`;
    case 'placement-outside-grid':
      return `Piece "${refusal.pieceId}" hangs off the block grid. Every piece has to sit inside the grid.`;
    case 'overlapping-pieces':
      return `Pieces "${refusal.pieceId}" and "${refusal.otherPieceId}" overlap on the grid. Each grid cell belongs to one piece.`;
    case 'construction-does-not-fit':
      return describeFit(refusal);
    case 'missing-construction':
      return `Before this block can yield a cutting chart it still needs a rotary construction for: ${describeMissing(refusal.missing)}. Its material quantities are unavailable until then.`;
    default:
      return describeUnitRefusal(refusal);
  }
}

function describeFit(
  refusal: Extract<BlockRefusal, { kind: 'construction-does-not-fit' }>,
): string {
  const size = `${L.formatInches(refusal.width)} by ${L.formatInches(refusal.height)} inch`;
  const name = CONSTRUCTION_LABELS[refusal.construction];
  if (refusal.construction === 'goose-one' || refusal.construction === 'goose-four') {
    return `Piece "${refusal.pieceId}" is a ${name} in a ${size} region. A flying-geese unit needs a finished width twice its finished height, such as 4 by 2 inches.`;
  }
  return `Piece "${refusal.pieceId}" is a ${name} in a ${size} region. It needs a region with equal finished sides.`;
}

function describeMissing(missing: readonly MissingConstruction[]): string {
  return missing
    .map((entry) =>
      entry.pieceId !== undefined
        ? `piece "${entry.pieceId}"`
        : `the cell at row ${entry.rect.row + 1}, column ${entry.rect.column + 1}`,
    )
    .join(', ');
}

const CONSTRUCTION_LABELS: { readonly [K in PieceConstructionKind]: string } = {
  square: 'square unit',
  rectangle: 'rectangle unit',
  strip: 'straight strip',
  'hst-two': 'half-square-triangle unit',
  'hst-four': 'half-square-triangle unit',
  'hst-eight': 'half-square-triangle unit',
  'quarter-square': 'quarter-square-triangle unit',
  'goose-one': 'flying-geese unit',
  'goose-four': 'flying-geese unit',
  'square-in-square': 'square-in-a-square unit',
};
