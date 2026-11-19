// librequilt -- the piece demand list: every actual piece a straight-set top
// needs.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * W-04: "The resulting chart counts every actual block, sash, cornerstone,
 * border and setting-triangle parent cut." This module is that count for the
 * straight setting (setting triangles are IMPL-05's): one demand per actual
 * block position, and one demand per group of identical cut rectangles for
 * the sashes, cornerstones and borders. Demands are pieces, not fabric plans
 * -- `core/plan` turns them into strips and yardage (F-02, F-03).
 *
 * L-02 counts "R(C+1) + C(R+1) individual sash rectangles" as one number even
 * when the vertical and horizontal runs cut the same rectangle (T-02's
 * seventeen), so identical sash rectangles merge into one demand and keep
 * their per-run split for the chart's labels. Border runs never merge: the
 * chart says which were sewn first, and the side pieces are sewn first (O-12).
 * The order of the list is W-04's: blocks, then sashes with the vertical run
 * first (O-12), then cornerstones, then borders with each border's sides
 * before its top and bottom.
 */

import type { PlacedBlock } from '../block/block';
import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import type { Rounded } from '../exact/rounding';
import type { BorderPieces, BorderPlan } from './border';
import type { Position } from './grid';
import type { SashingPlan, SashPieces } from './sashing';

/** One actual block the top needs: a position that is not plain (W-04). */
export interface BlockDemand {
  readonly kind: 'block';
  readonly row: number;
  readonly column: number;
  readonly block: PlacedBlock;
}

/** One group of identical sash rectangles (L-02). */
export interface SashDemand {
  readonly kind: 'sash';
  readonly count: number;
  /** How the count splits across the runs, for the chart's labels (L-02). */
  readonly runs: { readonly vertical: number; readonly horizontal: number };
  readonly finishedWidth: Sixteenths;
  readonly finishedLength: Sixteenths;
  readonly cutWidth: Rounded<Sixteenths>;
  readonly cutLength: Rounded<Sixteenths>;
}

/** One group of equal-size cornerstones (L-02). */
export interface CornerstoneDemand {
  readonly kind: 'cornerstone';
  readonly count: number;
  readonly finishedWidth: Sixteenths;
  readonly finishedHeight: Sixteenths;
  readonly cutWidth: Rounded<Sixteenths>;
  readonly cutHeight: Rounded<Sixteenths>;
}

/** One run of one butted border's pieces (L-03). */
export interface BorderDemand {
  readonly kind: 'border';
  /** Which border this is, in application order, starting at zero. */
  readonly index: number;
  /** Which run of that border: `side` is sewn before `top-bottom` (O-12). */
  readonly run: 'side' | 'top-bottom';
  readonly count: number;
  readonly finishedWidth: Sixteenths;
  readonly finishedLength: Sixteenths;
  readonly cutWidth: Rounded<Sixteenths>;
  readonly cutLength: Rounded<Sixteenths>;
}

/** Every actual piece the top needs, grouped where the cuts are identical. */
export type PieceDemand = BlockDemand | SashDemand | CornerstoneDemand | BorderDemand;

/**
 * The piece demand list of a straight-set top.
 *
 * Infallible by construction: every cut dimension was computed and rounded
 * exactly once in `./sashing` and `./border`, whose plans arrive here already
 * refused or valid. Zero-piece groups (a grid too small for the run) demand
 * nothing rather than a zero-count row.
 */
export function pieceDemands(
  positions: readonly Position[],
  sashing: SashingPlan,
  borders: readonly BorderPlan[],
): readonly PieceDemand[] {
  const demands: PieceDemand[] = [];

  for (const position of positions) {
    if (position.kind === 'block') {
      demands.push({
        kind: 'block',
        row: position.row,
        column: position.column,
        block: position.block,
      });
    }
  }

  demands.push(...sashDemands(sashing));
  if (sashing.kind === 'cornerstones' && sashing.cornerstones.count > 0) {
    demands.push({ kind: 'cornerstone', ...sashing.cornerstones });
  }

  for (const border of borders) {
    demands.push(...borderDemands(border));
  }
  return demands;
}

function sashDemands(sashing: SashingPlan): readonly SashDemand[] {
  if (sashing.kind === 'none') return [];
  // Vertical run first: O-12's vertical-first order is what the chart says.
  const groups = new Map<string, SashDemand>();
  addSashRun(groups, sashing.vertical, 'vertical');
  addSashRun(groups, sashing.horizontal, 'horizontal');
  return [...groups.values()];
}

function addSashRun(
  groups: Map<string, SashDemand>,
  pieces: SashPieces,
  run: 'vertical' | 'horizontal',
): void {
  if (pieces.count === 0) return;
  const key = `${L.toSixteenthCount(pieces.finishedWidth)}|${L.toSixteenthCount(pieces.finishedLength)}`;
  const existing = groups.get(key);
  const vertical = (run === 'vertical' ? pieces.count : 0) + (existing?.runs.vertical ?? 0);
  const horizontal = (run === 'horizontal' ? pieces.count : 0) + (existing?.runs.horizontal ?? 0);
  groups.set(key, {
    kind: 'sash',
    count: (existing?.count ?? 0) + pieces.count,
    runs: { vertical, horizontal },
    finishedWidth: pieces.finishedWidth,
    finishedLength: pieces.finishedLength,
    cutWidth: pieces.cutWidth,
    cutLength: pieces.cutLength,
  });
}

function borderDemands(border: BorderPlan): readonly BorderDemand[] {
  const demands: BorderDemand[] = [];
  const side = borderPieceDemand(border.index, 'side', border.side);
  if (side !== null) demands.push(side);
  const topBottom = borderPieceDemand(border.index, 'top-bottom', border.topBottom);
  if (topBottom !== null) demands.push(topBottom);
  return demands;
}

function borderPieceDemand(
  index: number,
  run: 'side' | 'top-bottom',
  pieces: BorderPieces,
): BorderDemand | null {
  if (pieces.count === 0) return null;
  return {
    kind: 'border',
    index,
    run,
    count: pieces.count,
    finishedWidth: pieces.finishedWidth,
    finishedLength: pieces.finishedLength,
    cutWidth: pieces.cutWidth,
    cutLength: pieces.cutLength,
  };
}
