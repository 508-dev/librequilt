// librequilt -- butted borders, sides sewn first (L-03).
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * L-03: "A border of finished width T around a current finished W x H top
 * makes it (W+2T) x (H+2T). With sides sewn first, two side pieces cut
 * (T+1/2) x (H+1/2), then two top/bottom pieces cut (T+1/2) x (W+2T+1/2).
 * Each end has a quarter-inch seam margin. Side borders are sewn first (O-12),
 * and the chart says so."
 *
 * One border at a time, each around the top the previous borders made, so W-04
 *'s "one or more plain borders" is a fold of this one rule. The corners are
 * butted because the side pieces run the full finished height and the
 * top/bottom pieces run the full finished width across them; no corner is
 * mitered or pieced (W-07 excludes those, and `core/scope` refuses them).
 *
 * Cut dimensions gain the half-inch seam margin and round up to the next
 * eighth exactly once (G-02, G-03), through `core/unit`. A piece longer than
 * usable fabric width is still demanded at its honest length here; whether it
 * comes from joined strips or a lengthwise cut is O-15's plan in `core/plan`
 * (F-02), never an impossible width-of-fabric subcut.
 */

import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import type { Rounded } from '../exact/rounding';
import { cutOrRefuse, withSeamMargins } from '../unit/plan';
import type { FinishedSize } from './grid';
import type { LayoutResult } from './refusal';
import { ok, refused } from './refusal';

/** One run of two identical border pieces, and the cut the chart prints. */
export interface BorderPieces {
  /** Always two: the two sides, or the two top/bottom pieces. */
  readonly count: number;
  /** The finished border width `T`. */
  readonly finishedWidth: Sixteenths;
  /** The finished span: the top's height (sides) or `W + 2T` (top/bottom). */
  readonly finishedLength: Sixteenths;
  readonly cutWidth: Rounded<Sixteenths>;
  readonly cutLength: Rounded<Sixteenths>;
}

/** One butted border: the top before and after it, and its two runs of pieces. */
export interface BorderPlan {
  /** Which border this is, in application order, starting at zero. */
  readonly index: number;
  readonly finishedWidth: Sixteenths;
  readonly before: FinishedSize;
  readonly after: FinishedSize;
  /** Two side pieces, sewn first (O-12). */
  readonly side: BorderPieces;
  /** Two top/bottom pieces, cut across the attached sides. */
  readonly topBottom: BorderPieces;
}

/**
 * Add one butted border around a finished top (L-03).
 *
 * The side pieces come first in the plan because they are sewn first (O-12);
 * the chart reads that order and says so. The finished growth is whole
 * sixteenths (G-01), and a growth the project cannot store is refused rather
 * than clamped.
 */
export function applyBorder(
  before: FinishedSize,
  finishedWidth: Sixteenths,
  index: number,
): LayoutResult<BorderPlan> {
  const border = L.toSixteenthCount(finishedWidth);
  const width = L.toSixteenthCount(before.width) + 2 * border;
  const height = L.toSixteenthCount(before.height) + 2 * border;
  if (!L.isSixteenths(width) || !L.isSixteenths(height)) {
    return refused({
      kind: 'out-of-range',
      maximumInches: L.MAX_LENGTH_SIXTEENTHS / L.SIXTEENTHS_PER_INCH,
    });
  }
  const after: FinishedSize = { width: L.sixteenths(width), height: L.sixteenths(height) };

  const side = borderPieces(finishedWidth, before.height);
  if (!side.ok) return side;
  const topBottom = borderPieces(finishedWidth, after.width);
  if (!topBottom.ok) return topBottom;
  return ok({ index, finishedWidth, before, after, side: side.value, topBottom: topBottom.value });
}

function borderPieces(
  finishedWidth: Sixteenths,
  finishedLength: Sixteenths,
): LayoutResult<BorderPieces> {
  const cutWidth = cutOrRefuse(withSeamMargins(finishedWidth));
  if (!cutWidth.ok) return cutWidth;
  const cutLength = cutOrRefuse(withSeamMargins(finishedLength));
  if (!cutLength.ok) return cutLength;
  return ok({
    count: 2,
    finishedWidth,
    finishedLength,
    cutWidth: cutWidth.value,
    cutLength: cutLength.value,
  });
}
