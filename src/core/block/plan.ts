// librequilt -- can this block yield a cutting chart, and what does it cut?
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * W-02's definite answer: "Only a geometry with supported straight seams and
 * a rotary construction method can yield a cutting chart." `planBlock` gives
 * that answer as a value, and when it refuses it names the offending seam
 * (W-02) or the missing construction of a block kept as a visual draft ("its
 * missing construction and material quantities must be identifiable before
 * export"), so nothing is ever silently guessed or silently included (P-03,
 * F-06).
 *
 * The plan's cut measurements come from `core/unit`, grouped so the chart gets
 * one row per method and size with the parent count and yield G-04 to G-08
 * require. They are planned from each piece's definition size, so a placed
 * copy's rotation or mirror changes nothing here (G-03). They stay distinct
 * from the block's finished and unfinished sides, which are `./block`'s.
 */

import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import type { Rounded } from '../exact/rounding';
import * as Geese from '../unit/geese';
import * as Plain from '../unit/plain';
import { cutOrRefuse, type UnitPlan, withSeamMargins } from '../unit/plan';
import { assessSeams } from '../unit/seams';
import * as SquareInASquare from '../unit/square-in-square';
import * as Triangles from '../unit/triangles';
import type { Block, BlockMeasurements } from './block';
import { blockMeasurementsOf, uncoveredCells } from './block';
import {
  constructionFits,
  groupKey,
  pieceDefinitionSize,
  stripSize,
  type UnitConstruction,
} from './piece';
import type { BlockResult, MissingConstruction } from './refusal';
import { ok, refused } from './refusal';

/** One chart group: one construction method and size, with its batched plan. */
export type PieceGroupPlan =
  | {
      readonly kind: 'unit';
      readonly construction: UnitConstruction;
      readonly count: number;
      readonly plan: UnitPlan;
    }
  | {
      readonly kind: 'strip';
      readonly count: number;
      readonly finishedWidth: Sixteenths;
      readonly finishedLength: Sixteenths;
      /** Cut width `F + 1/2`, rounded once (G-02, G-03). */
      readonly cutWidth: Rounded<Sixteenths>;
      /** Subcut length `L + 1/2`, rounded once (G-02, G-03). */
      readonly subcutLength: Rounded<Sixteenths>;
    };

/** What the block cuts: its two size vocabularies and its piece demands. */
export interface BlockPlan {
  /**
   * The finished and unfinished sides, kept together and kept distinct from
   * the cut measurements below (W-02: "The displayed finished block and its
   * unfinished/cut measurements are distinct").
   */
  readonly measurements: BlockMeasurements;
  /** One entry per construction method and size, with parent counts and yield. */
  readonly groups: readonly PieceGroupPlan[];
}

/**
 * The definite answer: the block's cutting plan, or a typed refusal naming
 * what stops it.
 *
 * The order is the specification's: W-02 names the unsupported seam first,
 * then the draft's missing construction ("before export"), then a piece whose
 * construction cannot fit its region, then whatever `core/unit` refuses in the
 * cut arithmetic itself. A refusal is a value (I5); a thrown error is a defect
 * in librequilt.
 */
export function planBlock(block: Block): BlockResult<BlockPlan> {
  const seams = assessSeams(block.seams);
  if (!seams.ok) return refused(seams.refusal);

  const missing = missingConstructions(block);
  if (missing.length > 0) return refused({ kind: 'missing-construction', missing });

  for (const piece of block.pieces) {
    const construction = piece.construction;
    if (construction === null) continue; // already reported above
    const size = pieceDefinitionSize(block.grid, piece);
    if (!constructionFits(construction, size.width, size.height)) {
      return refused({
        kind: 'construction-does-not-fit',
        pieceId: piece.id,
        construction: construction.kind,
        width: size.width,
        height: size.height,
      });
    }
  }

  const measurements = blockMeasurementsOf(block.grid);
  if (!measurements.ok) return measurements;

  const groups = planGroups(block);
  if (!groups.ok) return groups;
  return ok({
    measurements: measurements.value,
    groups: groups.value,
  });
}

/** The draft report: every region still missing a rotary construction. */
function missingConstructions(block: Block): readonly MissingConstruction[] {
  const missing: MissingConstruction[] = [];
  for (const piece of block.pieces) {
    if (piece.construction === null) {
      missing.push({ pieceId: piece.id, rect: piece.rect });
    }
  }
  for (const rect of uncoveredCells(block)) {
    missing.push({ rect });
  }
  return missing;
}

function planGroups(block: Block): BlockResult<readonly PieceGroupPlan[]> {
  const unitGroups = new Map<
    string,
    {
      readonly construction: UnitConstruction;
      readonly width: Sixteenths;
      readonly height: Sixteenths;
      readonly count: number;
    }
  >();
  const stripGroups = new Map<
    string,
    {
      readonly width: Sixteenths;
      readonly length: Sixteenths;
      readonly count: number;
    }
  >();

  for (const piece of block.pieces) {
    const construction = piece.construction;
    if (construction === null) continue;
    const size = pieceDefinitionSize(block.grid, piece);
    if (construction.kind === 'strip') {
      const strip = stripSize(size);
      const key = `strip|${strip.width}|${strip.length}`;
      const group = stripGroups.get(key);
      stripGroups.set(key, {
        width: strip.width,
        length: strip.length,
        count: (group?.count ?? 0) + 1,
      });
      continue;
    }
    const key = groupKey(construction, size.width, size.height);
    const group = unitGroups.get(key);
    unitGroups.set(key, {
      construction,
      width: size.width,
      height: size.height,
      count: (group?.count ?? 0) + 1,
    });
  }

  const groups: PieceGroupPlan[] = [];
  for (const group of unitGroups.values()) {
    const plan = planUnitGroup(group.construction, group.width, group.height, group.count);
    if (!plan.ok) return plan;
    groups.push({
      kind: 'unit',
      construction: group.construction,
      count: group.count,
      plan: plan.value,
    });
  }
  for (const group of stripGroups.values()) {
    const cutWidth = Plain.stripCutWidth(L.toSixteenthCount(group.width));
    if (!cutWidth.ok) return cutWidth;
    const subcutLength = cutOrRefuse(withSeamMargins(group.length));
    if (!subcutLength.ok) return subcutLength;
    groups.push({
      kind: 'strip',
      count: group.count,
      finishedWidth: group.width,
      finishedLength: group.length,
      cutWidth: cutWidth.value.cutWidth,
      subcutLength: subcutLength.value,
    });
  }
  return ok(groups);
}

function planUnitGroup(
  construction: UnitConstruction,
  width: Sixteenths,
  height: Sixteenths,
  count: number,
): BlockResult<UnitPlan> {
  const w = L.toSixteenthCount(width);
  const h = L.toSixteenthCount(height);
  switch (construction.kind) {
    case 'square':
      return Plain.plainSquare(w, count);
    case 'rectangle':
      return Plain.plainRectangle(w, h, count);
    case 'hst-two':
      return Triangles.halfSquareTriangleTwoAtATime(w, count, {
        oversized: construction.oversized,
      });
    case 'hst-four':
      return Triangles.halfSquareTriangleFourAtATime(w, count);
    case 'hst-eight':
      return Triangles.halfSquareTriangleEightAtATime(w, count, {
        oversized: construction.oversized,
      });
    case 'quarter-square':
      return Triangles.quarterSquareTriangle(w, count, { oversized: construction.oversized });
    case 'goose-one':
      return Geese.flyingGeeseOneAtATime(w, h, count);
    case 'goose-four':
      return Geese.flyingGeeseFourAtATime(w, h, count);
    case 'square-in-square':
      return SquareInASquare.squareInASquare(w, count);
  }
}
