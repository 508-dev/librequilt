// librequilt -- the layout-level refusals, and the result every layout answer
// carries.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * L-01 to L-03 at layout scale: a row or column count the grid cannot hold, a
 * position outside the grid or given two blocks, a placed block whose finished
 * size is not the layout's equal finished size -- each is a typed refusal
 * naming what is wrong (I5), never a thrown error. A thrown error means a
 * defect in librequilt itself.
 *
 * The size refusals are `core/unit`'s own `UnitRefusal`, composed in
 * unchanged, so a layout and a unit refuse in the same words about a
 * measurement (the same way `core/block` composes them).
 */

import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import type { UnitRefusal } from '../unit/plan';
import { describeUnitRefusal } from '../unit/plan';

/** Why a layout cannot answer its question. Each is a value a quilter can cause. */
export type LayoutRefusal =
  | UnitRefusal
  | {
      readonly kind: 'bad-grid-count';
      readonly axis: 'rows' | 'columns';
      readonly value: number;
    }
  | {
      readonly kind: 'bad-position';
      readonly axis: 'rows' | 'columns';
      readonly value: number;
    }
  | {
      readonly kind: 'position-outside-grid';
      readonly row: number;
      readonly column: number;
      readonly rows: number;
      readonly columns: number;
    }
  | { readonly kind: 'duplicate-position'; readonly row: number; readonly column: number }
  | {
      readonly kind: 'block-finished-size-mismatch';
      readonly row: number;
      readonly column: number;
      readonly expected: Sixteenths;
      readonly actual: Sixteenths;
    };

/** The outcome of any layout question: an answer, or a typed refusal (I5). */
export type LayoutResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly refusal: LayoutRefusal };

/** A successful result. */
export function ok<T>(value: T): LayoutResult<T> {
  return { ok: true, value };
}

/** A refused result, as a value (I5). */
export function refused(refusal: LayoutRefusal): LayoutResult<never> {
  return { ok: false, refusal };
}

/** A sentence a quilter can act on (A-01 requires understandable errors). */
export function describeLayoutRefusal(refusal: LayoutRefusal): string {
  switch (refusal.kind) {
    case 'bad-grid-count':
      return `${refusal.axis === 'rows' ? 'Rows' : 'Columns'} have to be whole numbers of at least one, not ${refusal.value}.`;
    case 'bad-position':
      return `A position's ${refusal.axis === 'rows' ? 'row' : 'column'} has to be a whole grid cell number, not ${refusal.value}.`;
    case 'position-outside-grid':
      return `The position at row ${refusal.row + 1}, column ${refusal.column + 1} is outside this quilt's ${refusal.rows}-row by ${refusal.columns}-column grid.`;
    case 'duplicate-position':
      return `Row ${refusal.row + 1}, column ${refusal.column + 1} has been given two blocks. Each position holds one block or stays plain.`;
    case 'block-finished-size-mismatch':
      return `The block at row ${refusal.row + 1}, column ${refusal.column + 1} finishes at ${L.formatInches(refusal.actual)} inches, but this quilt's blocks finish at ${L.formatInches(refusal.expected)} inches. Every position needs the same finished size.`;
    default:
      return describeUnitRefusal(refusal);
  }
}
