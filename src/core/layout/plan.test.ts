// librequilt -- tests for the straight-set layout plan: T-02, the straight
// sampler (L-01 through L-03).
//
// T-02: "Use two columns and three rows of 12-inch blocks, 2-inch sashing
// between and around every block, 2-inch cornerstones and one 4-inch plain
// border. Different block identities do not change these totals." Every
// expected value below is quoted from `python3
// docs/specification-fixtures.py` with the fixture line named in the test
// comment. The undo half of T-02 is W-08's and lives in IMPL-11's document
// commands, not here.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import {
  assembleBlock,
  mirrorPlaced,
  type PlacedBlock,
  placeBlock,
  rotateQuarter,
} from '../block/block';
import { divideGrid } from '../block/grid';
import * as L from '../exact/length';
import type { BlockDemand, BorderDemand, PieceDemand, SashDemand } from './demand';
import type { Position } from './grid';
import type { StraightLayoutPlan } from './plan';
import { planStraightLayout } from './plan';

const planned = <T>(
  result:
    | { readonly ok: true; readonly value: T }
    | { readonly ok: false; readonly refusal: { readonly kind: string } },
): T => {
  if (!result.ok) throw new Error(`expected a plan, got the refusal ${result.refusal.kind}`);
  return result.value;
};

const blockOf = (finishedSide: number): PlacedBlock => {
  const grid = planned(divideGrid(finishedSide, 1, 1));
  const block = planned(
    assembleBlock(grid, [
      { id: 'p', row: 0, column: 0, rowSpan: 1, columnSpan: 1, construction: { kind: 'square' } },
    ]),
  );
  return placeBlock(block);
};

const cut = (
  demand: SashDemand | BorderDemand | Extract<PieceDemand, { kind: 'cornerstone' }>,
): string =>
  `${L.formatInches(demand.cutWidth.rounded)} x ${L.formatInches(
    'cutLength' in demand ? demand.cutLength.rounded : demand.cutHeight.rounded,
  )}`;

const nonBlockDemands = (plan: StraightLayoutPlan): readonly PieceDemand[] =>
  plan.demands.filter((demand) => demand.kind !== 'block');

describe('T-02 straight sampler (L-01 to L-03)', () => {
  // The sampler design: two columns, three rows, 12-inch blocks, 2-inch
  // sashing between and around, 2-inch cornerstones, one 4-inch plain border.
  const sampler = (
    options: {
      readonly cornerstones?: boolean;
      readonly outer?: boolean;
      readonly border?: boolean;
      readonly positions?: readonly Position[];
    } = {},
  ): StraightLayoutPlan =>
    planned(
      planStraightLayout({
        rows: 3,
        columns: 2,
        blockSide: 192,
        sashing: {
          width: 32,
          cornerstones: options.cornerstones ?? true,
          outer: options.outer ?? true,
        },
        positions: options.positions,
        borders: options.border === false ? undefined : [{ finishedWidth: 64 }],
      }),
    );

  test('T-02: the top is 30 x 44 inches before the border and 38 x 52 finished', () => {
    // fixtures LAYOUTS: "sampler: 30 x 44 inner; 38 x 52 finished"
    const plan = sampler();
    expect(L.formatInches(plan.interior.width)).toBe('30');
    expect(L.formatInches(plan.interior.height)).toBe('44');
    expect(L.formatInches(plan.finished.width)).toBe('38');
    expect(L.formatInches(plan.finished.height)).toBe('52');
  });

  test('T-02: the demand list is 17 sashes, 12 cornerstones, then the borders sides first', () => {
    // fixtures LAYOUTS: "sampler: 17 sash rectangles; 12 cornerstones" and
    // "sampler border: sides 4 1/2 x 44 1/2; top/bottom 4 1/2 x 38 1/2".
    const demands = nonBlockDemands(sampler());
    expect(demands.map((demand) => demand.kind)).toEqual([
      'sash',
      'cornerstone',
      'border',
      'border',
    ]);

    const sash = demands[0] as SashDemand;
    expect(sash.count).toBe(17);
    expect(sash.runs).toEqual({ vertical: 9, horizontal: 8 });
    expect(cut(sash)).toBe('2 1/2 x 12 1/2');

    const cornerstone = demands[1] as Extract<PieceDemand, { kind: 'cornerstone' }>;
    expect(cornerstone.count).toBe(12);
    expect(cut(cornerstone)).toBe('2 1/2 x 2 1/2');

    const sides = demands[2] as BorderDemand;
    expect(sides.run).toBe('side');
    expect(sides.count).toBe(2);
    expect(cut(sides)).toBe('4 1/2 x 44 1/2');
    const topBottom = demands[3] as BorderDemand;
    expect(topBottom.run).toBe('top-bottom');
    expect(topBottom.count).toBe(2);
    expect(cut(topBottom)).toBe('4 1/2 x 38 1/2');
  });

  test('T-02: without cornerstones the size stays and the sashes are 9 vertical and 4 horizontal', () => {
    // fixtures: "sampler without cornerstones: 9 vertical sashes 2 1/2 x 12 1/2;
    // 4 horizontal sashes 2 1/2 x 30 1/2". T-02: "the 30 x 44-inch finished
    // size stays; cornerstone count becomes zero".
    const plan = sampler({ cornerstones: false, border: false });
    expect(L.formatInches(plan.finished.width)).toBe('30');
    expect(L.formatInches(plan.finished.height)).toBe('44');

    const demands = nonBlockDemands(plan);
    expect(demands.map((demand) => demand.kind)).toEqual(['sash', 'sash']);
    const vertical = demands[0] as SashDemand;
    expect(vertical.count).toBe(9);
    expect(vertical.runs).toEqual({ vertical: 9, horizontal: 0 });
    expect(cut(vertical)).toBe('2 1/2 x 12 1/2');
    const horizontal = demands[1] as SashDemand;
    expect(horizontal.count).toBe(4);
    expect(horizontal.runs).toEqual({ vertical: 0, horizontal: 4 });
    expect(cut(horizontal)).toBe('2 1/2 x 30 1/2');
    expect(demands.some((demand) => demand.kind === 'cornerstone')).toBe(false);
  });

  test('T-02: without outer sashing and without border the top is 26 x 40 inches', () => {
    // fixtures LAYOUTS: "sampler without outer sashing or border: 26 x 40 in"
    const plan = sampler({ outer: false, border: false });
    expect(L.formatInches(plan.finished.width)).toBe('26');
    expect(L.formatInches(plan.finished.height)).toBe('40');
  });

  test('different block identities and plain positions do not change these totals', () => {
    // T-02's own sentence. Two blocks (one rotated and mirrored), one plain,
    // and three unlisted positions: the sizes and every non-block demand are
    // the all-plain design's.
    const design = sampler({
      positions: [
        { row: 0, column: 0, kind: 'block', block: blockOf(192) },
        {
          row: 1,
          column: 1,
          kind: 'block',
          block: rotateQuarter(mirrorPlaced(blockOf(192))),
        },
        { row: 2, column: 1, kind: 'plain' },
      ],
    });
    const plain = sampler({ positions: [] });
    expect(design.interior).toEqual(plain.interior);
    expect(design.finished).toEqual(plain.finished);
    expect(nonBlockDemands(design)).toEqual(nonBlockDemands(plain));
  });

  test('every actual block is one demand, blocks first (W-04)', () => {
    const plan = sampler({
      positions: [
        { row: 2, column: 1, kind: 'block', block: blockOf(192) },
        { row: 0, column: 0, kind: 'block', block: blockOf(192) },
      ],
    });
    const blocks = plan.demands.filter((demand): demand is BlockDemand => demand.kind === 'block');
    expect(blocks.map((demand) => [demand.row, demand.column])).toEqual([
      [0, 0],
      [2, 1],
    ]);
    expect(plan.demands[0]?.kind).toBe('block');
    expect(plan.positions).toHaveLength(6);
  });

  test('the chart statements say which sash pieces and which construction order', () => {
    // L-02: "The chart says which pieces it used"; O-12: vertical-first and
    // sides-first, "disclosed in the chart".
    expect(sampler().statements).toEqual([
      { kind: 'sash-pieces', pieces: 'individual-rectangles' },
      { kind: 'border-construction-order', order: 'sides-first' },
    ]);
    expect(sampler({ cornerstones: false, border: false }).statements).toEqual([
      { kind: 'sash-pieces', pieces: 'continuous' },
      { kind: 'sash-construction-order', order: 'vertical-first' },
    ]);
    expect(sampler({ outer: false, border: false }).statements).toEqual([
      { kind: 'sash-pieces', pieces: 'individual-rectangles' },
    ]);
  });

  test('a zero border width is an absent border (G-01)', () => {
    const plan = planned(
      planStraightLayout({
        rows: 3,
        columns: 2,
        blockSide: 192,
        sashing: { width: 32, cornerstones: true, outer: true },
        borders: [{ finishedWidth: 0 }, { finishedWidth: 64 }],
      }),
    );
    expect(plan.borders).toHaveLength(1);
    expect(plan.borders[0]?.index).toBe(0);
    expect(L.formatInches(plan.finished.width)).toBe('38');
    expect(plan.demands.filter((demand) => demand.kind === 'border')).toHaveLength(2);
  });
});
