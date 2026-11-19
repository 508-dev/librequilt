// librequilt -- rotation and mirroring of a placed copy (W-02, W-03).
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * W-02 lets a quilter rotate or mirror a block; W-03 lets them "place
 * independently rotated or mirrored copies without modifying the library
 * definition". This module is that mechanism: a pure `Orientation` value --
 * whole quarter turns and an optional mirror -- that transforms where a copy
 * sits on the measured grid while the definition it came from is never touched.
 *
 * G-03's promise is the invariant underneath it: "Mirroring, rotation and
 * fabric-photo scale do not change these numbers." An orientation changes
 * positions and which way a seam runs, never a cut dimension, so a piece's
 * finished geometry is recovered from its orientation exactly and no rounding
 * is involved anywhere in here.
 */

import type { Sixteenths } from '../exact/length';
import type { BlockResult } from './refusal';
import { ok, refused } from './refusal';

/** Whole quarter turns clockwise: 0, 90, 180 or 270 degrees. */
export type QuarterTurn = 0 | 1 | 2 | 3;

/**
 * How a placed copy is oriented: quarter turns clockwise, then an optional
 * mirror across the copy's vertical axis. The transform is `R^turns . M^mirrored`
 * -- the mirror is applied first -- which makes composition below exact.
 */
export interface Orientation {
  readonly turns: QuarterTurn;
  readonly mirrored: boolean;
}

/** The unrotated, unmirrored orientation. */
export const IDENTITY: Orientation = { turns: 0, mirrored: false };

/** One quarter turn clockwise. */
export const QUARTER_TURN: Orientation = { turns: 1, mirrored: false };

/** A mirror across the vertical axis. */
export const MIRROR: Orientation = { turns: 0, mirrored: true };

/**
 * Read an orientation a caller supplies as plain values, refusing a turn count
 * that is not one of the four quarter turns (I5: a refusal is a value).
 */
export function readOrientation(turns: number, mirrored: boolean): BlockResult<Orientation> {
  if (!Number.isInteger(turns) || turns < 0 || turns > 3) {
    return refused({ kind: 'bad-orientation', turns });
  }
  return ok({ turns: turns as QuarterTurn, mirrored });
}

/**
 * Compose two orientations: `compose(outer, inner)` applies `inner` first,
 * then `outer`.
 *
 * With `M R = R^-1 M`, the product `R^t2 M^m2 . R^t1 M^m1` is
 * `R^(t2 + (-1)^m2 t1) M^(m2 xor m1)`, so a placed copy's orientation under a
 * block rotation is exact integer arithmetic, never a float.
 */
export function compose(outer: Orientation, inner: Orientation): Orientation {
  const step = outer.mirrored ? -inner.turns : inner.turns;
  return {
    turns: ((((outer.turns + step) % 4) + 4) % 4) as QuarterTurn,
    mirrored: outer.mirrored !== inner.mirrored,
  };
}

/** True when the orientation swaps the width and the height of a footprint. */
export function swapsAxes(orientation: Orientation): boolean {
  return orientation.turns % 2 === 1;
}

/**
 * The finished size of a piece in its own definition orientation, from the
 * finished size of the grid region it covers.
 *
 * A mirror never changes a size and a quarter turn swaps the two, so this is
 * its own inverse: definition size and grid footprint map to each other
 * exactly, which is how G-03's "rotation and mirroring leave every cut
 * dimension unchanged" holds by construction -- the cut is planned from the
 * definition size whatever the orientation.
 */
export function definitionSize(
  orientation: Orientation,
  gridWidth: Sixteenths,
  gridHeight: Sixteenths,
): { readonly width: Sixteenths; readonly height: Sixteenths } {
  return swapsAxes(orientation)
    ? { width: gridHeight, height: gridWidth }
    : { width: gridWidth, height: gridHeight };
}

/** The finished grid footprint a definition-sized piece covers. Its own inverse. */
export function gridSize(
  orientation: Orientation,
  definitionWidth: Sixteenths,
  definitionHeight: Sixteenths,
): { readonly width: Sixteenths; readonly height: Sixteenths } {
  return definitionSize(orientation, definitionWidth, definitionHeight);
}
/**
 * Where a grid region lands under an orientation of the whole block.
 *
 * The block is square but its grid may divide it differently across and down,
 * so a quarter turn transposes the grid: the result lives in a grid with the
 * rows and columns exchanged. The mirror is applied first, matching the
 * `R^turns . M^mirrored` order of {@link compose}.
 */
export function mapRect(
  orientation: Orientation,
  rows: number,
  columns: number,
  rect: {
    readonly row: number;
    readonly column: number;
    readonly rowSpan: number;
    readonly columnSpan: number;
  },
): {
  readonly row: number;
  readonly column: number;
  readonly rowSpan: number;
  readonly columnSpan: number;
} {
  let { row, column, rowSpan, columnSpan } = rect;
  let height = rows;
  let width = columns;
  if (orientation.mirrored) {
    column = width - (column + columnSpan);
  }
  for (let turn = 0; turn < orientation.turns; turn += 1) {
    const nextRow = column;
    const nextColumn = height - (row + rowSpan);
    const nextRowSpan = columnSpan;
    const nextColumnSpan = rowSpan;
    row = nextRow;
    column = nextColumn;
    rowSpan = nextRowSpan;
    columnSpan = nextColumnSpan;
    const nextHeight = width;
    width = height;
    height = nextHeight;
  }
  return { row, column, rowSpan, columnSpan };
}
