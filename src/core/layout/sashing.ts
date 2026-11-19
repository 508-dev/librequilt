// librequilt -- sashing pieces with cornerstones, and the continuous sash
// without them (L-02).
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * L-02: "With between-and-around sashing in an R x C straight grid, count
 * R(C+1) + C(R+1) individual sash rectangles and (R+1)(C+1) cornerstones. A
 * sash neighboring a block has the block's finished length and the selected
 * finished sash width; both cut dimensions gain half an inch. Without
 * cornerstones, the actual continuous sash lengths and counts replace those
 * individual pieces. Without cornerstones, short vertical sashes join the
 * blocks within each row, including at the row ends when there is outer
 * sashing, and long horizontal sashes run the full width between rows and,
 * with outer sashing, at top and bottom (O-12). The chart says which pieces it
 * used."
 *
 * The counts are written with L-01's `o` (two with outer sashing, zero
 * without), which reproduces the literal `R(C+1) + C(R+1)` and `(R+1)(C+1)`
 * of the between-and-around case and drops the outer strips when the quilter
 * leaves them off. The cornerstones replace equal-size sash intersections, so
 * they add no length (L-01) and appear here only as pieces.
 *
 * Cut dimensions are G-03's rectangle rule -- both finished dimensions gain
 * the half-inch seam margin, rounded up to the next eighth exactly once (G-02)
 * -- through `core/unit`, never re-derived here.
 */

import type { Sixteenths } from '../exact/length';
import type { Rounded } from '../exact/rounding';
import { cutOrRefuse, withSeamMargins } from '../unit/plan';
import type { Sashing, StraightGrid } from './grid';
import { interiorFinishedSize } from './grid';
import type { LayoutResult } from './refusal';
import { ok } from './refusal';

/** One run of identical sash rectangles, and the cut the chart prints. */
export interface SashPieces {
  readonly count: number;
  /** The finished sash width (L-02's "selected finished sash width"). */
  readonly finishedWidth: Sixteenths;
  /** The finished length: the block's side, or the full width when continuous. */
  readonly finishedLength: Sixteenths;
  readonly cutWidth: Rounded<Sixteenths>;
  readonly cutLength: Rounded<Sixteenths>;
}

/** The equal-size cornerstone squares of one sash scheme. */
export interface CornerstonePieces {
  readonly count: number;
  readonly finishedWidth: Sixteenths;
  readonly finishedHeight: Sixteenths;
  readonly cutWidth: Rounded<Sixteenths>;
  readonly cutHeight: Rounded<Sixteenths>;
}

/**
 * The sash pieces the top actually needs (L-02).
 *
 * `cornerstones` holds the individual sash rectangles of the cornerstone
 * scheme; `continuous` holds the short vertical and long horizontal sashes
 * that replace them, vertical run first per O-12's vertical-first order.
 * `none` is the grid with no sashing at all (L-01: width and contribution
 * zero).
 */
export type SashingPlan =
  | { readonly kind: 'none' }
  | {
      readonly kind: 'cornerstones';
      readonly vertical: SashPieces;
      readonly horizontal: SashPieces;
      readonly cornerstones: CornerstonePieces;
    }
  | {
      readonly kind: 'continuous';
      readonly vertical: SashPieces;
      readonly horizontal: SashPieces;
    };

/** The sash pieces of one grid, with their cut dimensions. */
export function planSashing(grid: StraightGrid): LayoutResult<SashingPlan> {
  const sashing = grid.sashing;
  if (sashing === null) return ok({ kind: 'none' });

  const outer = sashing.outer ? 2 : 0;
  const verticalCount = grid.rows * (grid.columns - 1 + outer);
  // L-02's R(C+1) + C(R+1) splits into these two runs: one vertical segment
  // beside every block of every row, and one horizontal segment per sash row
  // per block column. Without cornerstones the horizontal run is continuous:
  // one long sash per sash row, "between rows and, with outer sashing, at top
  // and bottom" (L-02).
  const horizontalCount = sashing.cornerstones
    ? (grid.rows - 1 + outer) * grid.columns
    : grid.rows - 1 + outer;
  const cornerstoneCount = (grid.rows - 1 + outer) * (grid.columns - 1 + outer);

  const vertical = sashPieces(sashing, verticalCount, grid.blockSide);
  if (!vertical.ok) return vertical;
  const horizontalLength = sashing.cornerstones ? grid.blockSide : interiorFinishedSize(grid).width;
  const horizontal = sashPieces(sashing, horizontalCount, horizontalLength);
  if (!horizontal.ok) return horizontal;

  if (!sashing.cornerstones) {
    return ok({ kind: 'continuous', vertical: vertical.value, horizontal: horizontal.value });
  }
  const cornerstones = cornerstonePieces(sashing, cornerstoneCount);
  if (!cornerstones.ok) return cornerstones;
  return ok({
    kind: 'cornerstones',
    vertical: vertical.value,
    horizontal: horizontal.value,
    cornerstones: cornerstones.value,
  });
}

function sashPieces(
  sashing: Sashing,
  count: number,
  finishedLength: Sixteenths,
): LayoutResult<SashPieces> {
  const cutWidth = cutOrRefuse(withSeamMargins(sashing.width));
  if (!cutWidth.ok) return cutWidth;
  const cutLength = cutOrRefuse(withSeamMargins(finishedLength));
  if (!cutLength.ok) return cutLength;
  return ok({
    count,
    finishedWidth: sashing.width,
    finishedLength,
    cutWidth: cutWidth.value,
    cutLength: cutLength.value,
  });
}

function cornerstonePieces(sashing: Sashing, count: number): LayoutResult<CornerstonePieces> {
  const cutWidth = cutOrRefuse(withSeamMargins(sashing.width));
  if (!cutWidth.ok) return cutWidth;
  return ok({
    count,
    finishedWidth: sashing.width,
    finishedHeight: sashing.width,
    cutWidth: cutWidth.value,
    cutHeight: cutWidth.value,
  });
}
