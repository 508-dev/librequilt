// librequilt -- the straight-set layout: the finished size of a straight-set
// top and every actual piece it needs (L-01 to L-03).
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * W-04's straight setting as one pure answer: "A quilter can place equal
 * finished-size square blocks in a straight grid, leave a position plain,
 * replace its block, and orient a position independently. Sashing can run
 * between blocks and optionally around the outside. Sash intersections can
 * use equal-size cornerstones. One or more plain borders can be added with
 * butted corners." The finished sizes (L-01, L-03), the sash and cornerstone
 * pieces (L-02), the butted border pieces (L-03) and the piece demand list
 * all derive from the same design value, so W-01's "changes update the
 * finished size and material calculation from the design's actual geometry"
 * holds by construction (I6).
 *
 * What the chart must say travels as statements beside the numbers: which
 * sash pieces the design uses (L-02), that continuous sashes are sewn
 * vertical-first and that border sides are sewn first (O-12, L-03).
 * On-point setting (L-04, L-05) is IMPL-05's and nothing here pretends to
 * answer it.
 */

import * as L from '../exact/length';
import type { BorderPlan } from './border';
import { applyBorder } from './border';
import type { PieceDemand } from './demand';
import { pieceDemands } from './demand';
import type { FinishedSize, GridInput, Position, StraightGrid } from './grid';
import {
  interiorFinishedSize,
  readOptionalFinishedSize,
  resolvePositions,
  straightGrid,
} from './grid';
import type { LayoutResult } from './refusal';
import { ok } from './refusal';
import type { SashingPlan } from './sashing';
import { planSashing } from './sashing';

/** A straight-set layout as the quilter sets it up, before validation. */
export interface StraightLayoutInput extends GridInput {
  /**
   * The positions the quilter has set; every unlisted position is plain (W-04:
   * "leave a position plain"). Block copies carry their own orientation.
   */
  readonly positions?: readonly Position[] | undefined;
  /**
   * Plain butted borders in application order (W-04). A zero finished width is
   * an absent border (G-01), not a zero-width strip.
   */
  readonly borders?: readonly { readonly finishedWidth: number }[] | undefined;
}

/** What the chart must say about the layout (L-02, L-03, O-12). */
export type LayoutStatement =
  | {
      readonly kind: 'sash-pieces';
      readonly pieces: 'individual-rectangles' | 'continuous';
    }
  | { readonly kind: 'sash-construction-order'; readonly order: 'vertical-first' }
  | { readonly kind: 'border-construction-order'; readonly order: 'sides-first' };

/** Everything a straight-set top is: sizes, pieces and the chart's statements. */
export interface StraightLayoutPlan {
  readonly grid: StraightGrid;
  /** Every position of the grid, row by row: one block or plain each. */
  readonly positions: readonly Position[];
  /** The finished interior size, before any border (L-01). */
  readonly interior: FinishedSize;
  /** The finished size of the whole top, after every border (L-03). */
  readonly finished: FinishedSize;
  readonly sashing: SashingPlan;
  readonly borders: readonly BorderPlan[];
  /** Every actual piece the top needs (W-04), blocks first. */
  readonly demands: readonly PieceDemand[];
  readonly statements: readonly LayoutStatement[];
}

/**
 * The finished size of a straight-set top and every actual piece it needs.
 *
 * The answer, or a typed refusal naming what stops it (I5): a count the grid
 * cannot hold, a size outside the stored range, a position outside the grid or
 * given two blocks, a block that does not match the layout's equal finished
 * size, or whatever `core/unit` refuses in the cut arithmetic itself.
 */
export function planStraightLayout(input: StraightLayoutInput): LayoutResult<StraightLayoutPlan> {
  const grid = straightGrid(input);
  if (!grid.ok) return grid;
  const positions = resolvePositions(grid.value, input.positions ?? []);
  if (!positions.ok) return positions;
  const sashing = planSashing(grid.value);
  if (!sashing.ok) return sashing;

  const interior = interiorFinishedSize(grid.value);
  const borders: BorderPlan[] = [];
  let finished = interior;
  for (const border of input.borders ?? []) {
    const width = readOptionalFinishedSize(border.finishedWidth);
    if (!width.ok) return width;
    if (L.toSixteenthCount(width.value) === 0) continue; // an absent border (G-01)
    const plan = applyBorder(finished, width.value, borders.length);
    if (!plan.ok) return plan;
    borders.push(plan.value);
    finished = plan.value.after;
  }

  return ok({
    grid: grid.value,
    positions: positions.value,
    interior,
    finished,
    sashing: sashing.value,
    borders,
    demands: pieceDemands(positions.value, sashing.value, borders),
    statements: layoutStatements(sashing.value, borders),
  });
}

function layoutStatements(
  sashing: SashingPlan,
  borders: readonly BorderPlan[],
): readonly LayoutStatement[] {
  const statements: LayoutStatement[] = [];
  if (sashing.kind !== 'none') {
    statements.push({
      kind: 'sash-pieces',
      pieces: sashing.kind === 'cornerstones' ? 'individual-rectangles' : 'continuous',
    });
    if (sashing.kind === 'continuous') {
      statements.push({ kind: 'sash-construction-order', order: 'vertical-first' });
    }
  }
  if (borders.length > 0) {
    statements.push({ kind: 'border-construction-order', order: 'sides-first' });
  }
  return statements;
}
