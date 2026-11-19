// librequilt -- tests for the block's definite answer: cuttable or not (W-02).
//
// W-02: "Only a geometry with supported straight seams and a rotary
// construction method can yield a cutting chart. An unsupported free polygon,
// curve or set-in seam is refused as a cuttable block, with the affected seam
// identified." The edge cases: "If a block is kept visually as a draft, its
// missing construction and material quantities must be identifiable before
// export." G-03: "Mirroring, rotation and fabric-photo scale do not change
// these numbers." Every expected cut below is quoted from the output of
// `python3 docs/specification-fixtures.py`, the specification's synthetic
// fixture script, and covers T-01's unit table through a block plan.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import type { Sixteenths } from '../exact/length';
import * as L from '../exact/length';
import type { Rounded } from '../exact/rounding';
import type { ParentCut, UnitPlan } from '../unit/plan';
import type { Block } from './block';
import { assembleBlock, blockMeasurements, placeBlock, placedGeometry } from './block';
import type { BlockGrid } from './grid';
import { divideGrid } from './grid';
import type { PlacedPieceInput } from './piece';
import type { BlockPlan, PieceGroupPlan } from './plan';
import { planBlock } from './plan';
import type { BlockResult } from './refusal';

const planned = <T>(result: BlockResult<T>): T => {
  if (!result.ok) throw new Error(`expected a plan, got the refusal ${result.refusal.kind}`);
  return result.value;
};
const cutText = (cut: Rounded<Sixteenths>): string => L.formatInches(cut.rounded);
const unitGroup = (plan: BlockPlan, index: number): Extract<PieceGroupPlan, { kind: 'unit' }> => {
  const entry = plan.groups[index];
  if (entry === undefined || entry.kind !== 'unit') throw new Error(`no unit group ${index}`);
  return entry;
};
const stripGroup = (plan: BlockPlan, index: number): Extract<PieceGroupPlan, { kind: 'strip' }> => {
  const entry = plan.groups[index];
  if (entry === undefined || entry.kind !== 'strip') throw new Error(`no strip group ${index}`);
  return entry;
};
const parent = (plan: UnitPlan, index: number): ParentCut => {
  const cut = plan.parents[index];
  if (cut === undefined) throw new Error(`plan has no parent cut ${index}`);
  return cut;
};

/** Every rounded cut dimension of a plan, sorted, for invariance checks. */
const cutTexts = (plan: BlockPlan): string[] => {
  const texts: string[] = [];
  for (const entry of plan.groups) {
    if (entry.kind === 'strip') {
      texts.push(cutText(entry.cutWidth), cutText(entry.subcutLength));
      continue;
    }
    for (const cut of entry.plan.parents) {
      texts.push(cutText(cut.width), cutText(cut.height));
    }
  }
  return texts.sort();
};

const square = (id: string, row: number, column: number): PlacedPieceInput => ({
  id,
  row,
  column,
  rowSpan: 1,
  columnSpan: 1,
  construction: { kind: 'square' },
});

type SeamInput = {
  readonly id: string;
  readonly shape: 'straight' | 'curve' | 'set-in' | 'free-polygon';
};

const blockOf = (
  gridResult: BlockResult<BlockGrid>,
  pieces: readonly PlacedPieceInput[],
  seams: readonly SeamInput[] = [],
): Block => {
  const grid = planned(gridResult);
  return planned(assembleBlock(grid, pieces, seams));
};

const ninePatchPieces = (): PlacedPieceInput[] => {
  const pieces: PlacedPieceInput[] = [];
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1)
      pieces.push(square(`p${row}${column}`, row, column));
  }
  return pieces;
};

describe('W-02 cuttability, with the offending seam identified', () => {
  // T-01's rejection row at block scale: a nine-patch with a drawn seam the
  // rotary constructions cannot express.
  const grid = divideGrid(192, 3, 3);
  const pieces = ninePatchPieces();

  test('a straight-seam block yields a cutting chart', () => {
    const block = blockOf(grid, pieces, [{ id: 'seam-1', shape: 'straight' }]);
    expect(planBlock(block).ok).toBe(true);
  });

  test('T-01: a curve is refused as a cuttable block with the seam named', () => {
    // T-01: "Reject ... a curve ... as cuttable geometry." W-02: refused
    // "with the affected seam identified".
    const block = blockOf(grid, pieces, [
      { id: 'seam-1', shape: 'straight' },
      { id: 'curve-2', shape: 'curve' },
    ]);
    const result = planBlock(block);
    expect(result.ok).toBe(false);
    if (!result.ok && result.refusal.kind === 'unsupported-seam') {
      expect(result.refusal.seamId).toBe('curve-2');
      expect(result.refusal.shape).toBe('curve');
    } else {
      throw new Error('expected an unsupported-seam refusal');
    }
  });

  test('T-01: a set-in seam is refused as a cuttable block with the seam named', () => {
    const block = blockOf(grid, pieces, [{ id: 'y-seam', shape: 'set-in' }]);
    const result = planBlock(block);
    expect(result.ok).toBe(false);
    if (!result.ok && result.refusal.kind === 'unsupported-seam') {
      expect(result.refusal.seamId).toBe('y-seam');
      expect(result.refusal.shape).toBe('set-in');
    } else {
      throw new Error('expected an unsupported-seam refusal');
    }
  });

  test('an unsupported free polygon is refused the same way', () => {
    const block = blockOf(grid, pieces, [{ id: 'free', shape: 'free-polygon' }]);
    const result = planBlock(block);
    if (!result.ok && result.refusal.kind === 'unsupported-seam') {
      expect(result.refusal.seamId).toBe('free');
      expect(result.refusal.shape).toBe('free-polygon');
    } else {
      throw new Error('expected an unsupported-seam refusal');
    }
  });

  test('the seam refusal wins over a draft and names the first bad seam', () => {
    const block = blockOf(
      grid,
      [{ ...square('draft', 0, 0), construction: null }, ...pieces.slice(1)],
      [
        { id: 'ok', shape: 'straight' },
        { id: 'first-bad', shape: 'curve' },
        { id: 'second-bad', shape: 'set-in' },
      ],
    );
    const result = planBlock(block);
    if (!result.ok && result.refusal.kind === 'unsupported-seam') {
      expect(result.refusal.seamId).toBe('first-bad');
    } else {
      throw new Error('expected an unsupported-seam refusal');
    }
  });
});

describe('W-02 a block kept as a visual draft', () => {
  const grid = divideGrid(192, 3, 3);

  test('the draft reports its missing construction before export', () => {
    // The edge cases: "If a block is kept visually as a draft, its missing
    // construction and material quantities must be identifiable before
    // export." P-03: the chart "cannot silently include its yardage".
    const block = blockOf(grid, [
      square('p00', 0, 0),
      { id: 'drawn', row: 0, column: 1, rowSpan: 1, columnSpan: 2, construction: null },
      square('p10', 1, 0),
      square('p11', 1, 1),
      square('p12', 1, 2),
      square('p20', 2, 0),
      square('p21', 2, 1),
      square('p22', 2, 2),
    ]);
    const result = planBlock(block);
    expect(result.ok).toBe(false);
    if (!result.ok && result.refusal.kind === 'missing-construction') {
      expect(result.refusal.missing).toHaveLength(1);
      expect(result.refusal.missing[0]?.pieceId).toBe('drawn');
    } else {
      throw new Error('expected a missing-construction refusal');
    }
  });

  test('an uncovered cell is identified as a region still needing construction', () => {
    const block = blockOf(grid, [square('p00', 0, 0)]);
    const result = planBlock(block);
    expect(result.ok).toBe(false);
    if (!result.ok && result.refusal.kind === 'missing-construction') {
      // The 8 uncovered cells of the 3 by 3 grid, in row order.
      expect(result.refusal.missing).toHaveLength(8);
      expect(result.refusal.missing[0]?.pieceId).toBeUndefined();
      expect(result.refusal.missing[0]?.rect).toEqual({
        row: 0,
        column: 1,
        rowSpan: 1,
        columnSpan: 1,
      });
    } else {
      throw new Error('expected a missing-construction refusal');
    }
  });

  test('a draft keeps its finished and unfinished measurements, but no cuts', () => {
    const block = blockOf(grid, [
      { id: 'drawn', row: 0, column: 0, rowSpan: 1, columnSpan: 1, construction: null },
    ]);
    const measurements = planned(blockMeasurements(block));
    expect(L.formatInches(measurements.finishedSide)).toBe('12');
    expect(L.formatInches(measurements.unfinishedSide)).toBe('12 1/2');
    expect(planBlock(block).ok).toBe(false);
  });

  test('all missing constructions are listed at once', () => {
    const block = blockOf(grid, [
      { id: 'drawn-a', row: 0, column: 0, rowSpan: 1, columnSpan: 1, construction: null },
      square('p01', 0, 1),
    ]);
    const result = planBlock(block);
    if (!result.ok && result.refusal.kind === 'missing-construction') {
      // The draft piece plus the seven uncovered cells.
      expect(result.refusal.missing).toHaveLength(8);
      expect(result.refusal.missing[0]?.pieceId).toBe('drawn-a');
    } else {
      throw new Error('expected a missing-construction refusal');
    }
  });
});

describe('T-01 unit cuts through a block plan', () => {
  test('T-01: a 3-inch finished square is cut 3 1/2 inches', () => {
    // fixtures CUTS: "square / strip: 3 1/2 in"
    const plan = planned(planBlock(blockOf(divideGrid(48, 1, 1), [square('p', 0, 0)])));
    const entry = unitGroup(plan, 0);
    expect(entry.construction.kind).toBe('square');
    expect(entry.count).toBe(1);
    expect(cutText(parent(entry.plan, 0).width)).toBe('3 1/2');
    expect(cutText(parent(entry.plan, 0).height)).toBe('3 1/2');
  });

  test("T-01: a nine-patch's squares are cut 4 1/2 inches, counted once per piece", () => {
    const plan = planned(planBlock(blockOf(divideGrid(192, 3, 3), ninePatchPieces())));
    const entry = unitGroup(plan, 0);
    expect(entry.plan.unitsNeeded).toBe(9);
    expect(parent(entry.plan, 0).count).toBe(9);
    expect(cutText(parent(entry.plan, 0).width)).toBe('4 1/2');
  });

  test('T-01: 3-inch HSTs, two at a time, cut 3 7/8-inch parents', () => {
    // fixtures CUTS: "HST 2: 3 7/8 in". A 6-inch block is a 2 by 2 grid of
    // 3-inch cells; four HST pieces plan as one group.
    const pieces: PlacedPieceInput[] = [
      { ...square('a', 0, 0), construction: { kind: 'hst-two', oversized: false } },
      { ...square('b', 0, 1), construction: { kind: 'hst-two', oversized: false } },
      { ...square('c', 1, 0), construction: { kind: 'hst-two', oversized: false } },
      { ...square('d', 1, 1), construction: { kind: 'hst-two', oversized: false } },
    ];
    const plan = planned(planBlock(blockOf(divideGrid(96, 2, 2), pieces)));
    const entry = unitGroup(plan, 0);
    expect(entry.plan.unitsNeeded).toBe(4);
    expect(parent(entry.plan, 0).count).toBe(4); // two parents per batch, two batches
    expect(cutText(parent(entry.plan, 0).width)).toBe('3 7/8');
    expect(entry.plan.yieldPerBatch).toBe(2);
    expect(entry.plan.unitsYielded).toBe(4);
  });

  test('T-01: the trim variant cuts 4-inch parents and states the trim', () => {
    // fixtures CUTS: "HST 2 trim: 4 in"; T-01: "4-inch oversized parents,
    // trim to 3 1/2 inches unfinished".
    const pieces: PlacedPieceInput[] = [0, 1, 2, 3].map((index) => ({
      ...square(`t${index}`, Math.floor(index / 2), index % 2),
      construction: { kind: 'hst-two', oversized: true },
    }));
    const plan = planned(planBlock(blockOf(divideGrid(96, 2, 2), pieces)));
    const entry = unitGroup(plan, 0);
    expect(cutText(parent(entry.plan, 0).width)).toBe('4');
    expect(entry.plan.trimTo !== undefined ? L.formatInches(entry.plan.trimTo) : '').toBe('3 1/2');
    expect(entry.plan.statements).toContainEqual({
      kind: 'trim-to-unfinished',
      size: L.sixteenths(56),
    });
  });

  test('T-01: 3-inch HSTs, eight at a time, cut 7 3/4-inch parents', () => {
    // fixtures CUTS: "HST 8: 7 3/4 in". One batch yields eight units, so a
    // four-piece demand overshoots and the plan states the excess (G-07).
    const pieces: PlacedPieceInput[] = [0, 1, 2, 3].map((index) => ({
      ...square(`e${index}`, Math.floor(index / 2), index % 2),
      construction: { kind: 'hst-eight', oversized: false },
    }));
    const plan = planned(planBlock(blockOf(divideGrid(96, 2, 2), pieces)));
    const entry = unitGroup(plan, 0);
    expect(parent(entry.plan, 0).count).toBe(2); // two parents for the one batch
    expect(cutText(parent(entry.plan, 0).width)).toBe('7 3/4');
    expect(entry.plan.unitsYielded).toBe(8);
    expect(entry.plan.excessUnits).toBe(4);
  });

  test('T-01: 3-inch quarter-square triangles cut 4 1/4-inch parents', () => {
    // fixtures CUTS: "QST / hourglass: 4 1/4 in"
    const pieces: PlacedPieceInput[] = [0, 1, 2, 3].map((index) => ({
      ...square(`q${index}`, Math.floor(index / 2), index % 2),
      construction: { kind: 'quarter-square', oversized: false },
    }));
    const plan = planned(planBlock(blockOf(divideGrid(96, 2, 2), pieces)));
    const entry = unitGroup(plan, 0);
    expect(parent(entry.plan, 0).count).toBe(4);
    expect(cutText(parent(entry.plan, 0).width)).toBe('4 1/4');
  });

  test('T-01: a 4 x 2-inch goose, one at a time, matches the fixture cuts', () => {
    // fixtures CUTS: "FG one rect 4 x 2: 4 1/2 x 2 1/2 in" and
    // "FG one squares: 2 1/2 in". A 4-inch block is a 2 by 2 grid of
    // 2-inch cells: the goose spans two cells across and one down.
    const block = blockOf(divideGrid(64, 2, 2), [
      {
        id: 'goose',
        row: 0,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
        construction: { kind: 'goose-one' },
      },
      square('a', 1, 0),
      square('b', 1, 1),
    ]);
    const plan = planned(planBlock(block));
    const goose = unitGroup(plan, 0);
    expect(goose.construction.kind).toBe('goose-one');
    expect(cutText(parent(goose.plan, 0).width)).toBe('4 1/2');
    expect(cutText(parent(goose.plan, 0).height)).toBe('2 1/2');
    expect(cutText(parent(goose.plan, 1).width)).toBe('2 1/2');
    const squares = unitGroup(plan, 1);
    expect(cutText(parent(squares.plan, 0).width)).toBe('2 1/2');
  });

  test('T-01: four no-waste geese cut one 5 1/4 and four 2 7/8 squares', () => {
    // fixtures CUTS: "FG four large: 5 1/4 in", "FG four small: 2 7/8 in"
    const geese: PlacedPieceInput[] = [0, 1, 2, 3].map((index) => ({
      id: `g${index}`,
      row: Math.floor(index / 2),
      column: (index % 2) * 2,
      rowSpan: 1,
      columnSpan: 2,
      construction: { kind: 'goose-four' },
    }));
    const squares: PlacedPieceInput[] = [0, 1, 2, 3, 4, 5, 6, 7].map((index) =>
      square(`s${index}`, 2 + Math.floor(index / 4), index % 4),
    );
    const plan = planned(planBlock(blockOf(divideGrid(128, 4, 4), [...geese, ...squares])));
    const entry = unitGroup(plan, 0);
    expect(parent(entry.plan, 0).count).toBe(1);
    expect(cutText(parent(entry.plan, 0).width)).toBe('5 1/4');
    expect(parent(entry.plan, 1).count).toBe(4);
    expect(cutText(parent(entry.plan, 1).width)).toBe('2 7/8');
    expect(entry.plan.excessUnits).toBe(0);
  });

  test('a four-unit construction over demand states the excess and the parents', () => {
    // G-07: "If a four-unit construction exceeds demand, the chart states
    // excess units and counts the parent fabric."
    const block = blockOf(divideGrid(64, 2, 2), [
      {
        id: 'g0',
        row: 0,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
        construction: { kind: 'goose-four' },
      },
      square('a', 1, 0),
      square('b', 1, 1),
    ]);
    const entry = unitGroup(planned(planBlock(block)), 0);
    expect(entry.plan.unitsNeeded).toBe(1);
    expect(entry.plan.unitsYielded).toBe(4);
    expect(entry.plan.excessUnits).toBe(3);
    expect(parent(entry.plan, 0).count).toBe(1); // the parent fabric is still counted
    expect(parent(entry.plan, 1).count).toBe(4);
  });

  test('T-01: square-in-a-square by finished outer side, with its trim statement', () => {
    // fixtures CUTS: "square in square, 6 outer: centre (trim unit to 6 1/2):
    // 4 3/4 in" and "corner parents, cut once: 3 7/8 in". Per Q-03 the
    // drawing surface does not offer this construction; the block core plans
    // it because G-08 defines it to fit the block grid and W-03's blocks use
    // it.
    const block = blockOf(divideGrid(96, 1, 1), [
      {
        id: 'sis',
        row: 0,
        column: 0,
        rowSpan: 1,
        columnSpan: 1,
        construction: { kind: 'square-in-square' },
      },
    ]);
    const entry = unitGroup(planned(planBlock(block)), 0);
    expect(cutText(parent(entry.plan, 0).width)).toBe('4 3/4');
    expect(cutText(parent(entry.plan, 1).width)).toBe('3 7/8');
    expect(parent(entry.plan, 1).diagonalCuts).toBe(1);
    expect(L.formatInches(entry.plan.trimTo ?? L.sixteenths(0))).toBe('6 1/2');
  });

  test('T-01: a straight strip reports its cut width and subcut length', () => {
    // fixtures CUTS: "strip set width 2; subcut 6: 2 1/2 x 6 1/2 in". A
    // 6-inch block is a 3 by 1 grid of 2 by 6-inch cells; each strip piece
    // spans one cell and runs 6 inches along the block.
    const strips: PlacedPieceInput[] = [0, 1, 2].map((index) => ({
      id: `s${index}`,
      row: index,
      column: 0,
      rowSpan: 1,
      columnSpan: 1,
      construction: { kind: 'strip' },
    }));
    const plan = planned(planBlock(blockOf(divideGrid(96, 3, 1), strips)));
    const entry = stripGroup(plan, 0);
    expect(entry.count).toBe(3);
    expect(L.formatInches(entry.finishedWidth)).toBe('2');
    expect(L.formatInches(entry.finishedLength)).toBe('6');
    expect(cutText(entry.cutWidth)).toBe('2 1/2');
    expect(cutText(entry.subcutLength)).toBe('6 1/2');
  });

  test('the finished, unfinished and cut measurements stay distinct', () => {
    // W-02: "The displayed finished block and its unfinished/cut measurements
    // are distinct." The HST block: finished 6, unfinished 6 1/2, parents cut
    // 3 7/8 -- three different numbers, three vocabularies.
    const pieces: PlacedPieceInput[] = [0, 1, 2, 3].map((index) => ({
      ...square(`h${index}`, Math.floor(index / 2), index % 2),
      construction: { kind: 'hst-two', oversized: false },
    }));
    const plan = planned(planBlock(blockOf(divideGrid(96, 2, 2), pieces)));
    expect(L.formatInches(plan.measurements.finishedSide)).toBe('6');
    expect(L.formatInches(plan.measurements.unfinishedSide)).toBe('6 1/2');
    expect(cutText(parent(unitGroup(plan, 0).plan, 0).width)).toBe('3 7/8');
    expect(plan.measurements.finishedSide).not.toBe(plan.measurements.unfinishedSide);
  });

  test('the four-at-a-time HST plan stays marked provisional (O-06)', () => {
    // IMPL-29 either sews the check and sets the flag, or the method is
    // removed; until then the plan carries the provisional statement.
    const pieces: PlacedPieceInput[] = [0, 1, 2, 3].map((index) => ({
      ...square(`f${index}`, Math.floor(index / 2), index % 2),
      construction: { kind: 'hst-four' },
    }));
    const plan = planned(planBlock(blockOf(divideGrid(96, 2, 2), pieces)));
    const entry = unitGroup(plan, 0);
    expect(cutText(parent(entry.plan, 0).width)).toBe('5 1/2'); // fixtures: "HST 4 corrected: 5 1/2 in"
    expect(entry.plan.statements).toContainEqual({
      kind: 'provisional-pending-sewn-check',
    });
    expect(entry.plan.statements).toContainEqual({ kind: 'bias-edge-caution' });
  });
});

describe('W-02 a construction that cannot fit its region is refused', () => {
  test('a square unit needs a region with equal finished sides', () => {
    const block = blockOf(divideGrid(96, 2, 2), [
      {
        id: 'wide',
        row: 0,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
        construction: { kind: 'square' },
      },
      square('a', 1, 0),
      square('b', 1, 1),
    ]);
    const result = planBlock(block);
    expect(result.ok).toBe(false);
    if (!result.ok && result.refusal.kind === 'construction-does-not-fit') {
      expect(result.refusal.pieceId).toBe('wide');
      expect(result.refusal.construction).toBe('square');
      expect(L.formatInches(result.refusal.width)).toBe('6');
      expect(L.formatInches(result.refusal.height)).toBe('3');
    } else {
      throw new Error('expected a construction-does-not-fit refusal');
    }
  });

  test('a flying-geese unit needs a finished width twice its height', () => {
    const block = blockOf(divideGrid(96, 3, 3), [
      {
        id: 'goose',
        row: 0,
        column: 0,
        rowSpan: 2,
        columnSpan: 3,
        construction: { kind: 'goose-one' },
      },
      square('a', 2, 0),
      square('b', 2, 1),
      square('c', 2, 2),
    ]);
    const result = planBlock(block);
    expect(result.ok).toBe(false);
    if (!result.ok && result.refusal.kind === 'construction-does-not-fit') {
      expect(result.refusal.pieceId).toBe('goose');
      expect(result.refusal.construction).toBe('goose-one');
    } else {
      throw new Error('expected a construction-does-not-fit refusal');
    }
  });
});

describe('G-03 mirroring and rotation leave every cut dimension unchanged', () => {
  // A mixed block: a goose, squares, a bar, two HSTs, a rectangle and two
  // strips on an 8-inch grid of 2-inch cells.
  const definition = blockOf(divideGrid(128, 4, 4), [
    {
      id: 'goose',
      row: 0,
      column: 0,
      rowSpan: 1,
      columnSpan: 2,
      construction: { kind: 'goose-one' },
    },
    square('a', 0, 2),
    square('b', 0, 3),
    {
      id: 'bar',
      row: 1,
      column: 0,
      rowSpan: 1,
      columnSpan: 4,
      construction: { kind: 'rectangle' },
    },
    { ...square('h0', 2, 0), construction: { kind: 'hst-two', oversized: false } },
    { ...square('h1', 2, 1), construction: { kind: 'hst-two', oversized: true } },
    {
      id: 'box',
      row: 2,
      column: 2,
      rowSpan: 1,
      columnSpan: 2,
      construction: { kind: 'rectangle' },
    },
    { id: 's0', row: 3, column: 0, rowSpan: 1, columnSpan: 2, construction: { kind: 'strip' } },
    { id: 's1', row: 3, column: 2, rowSpan: 1, columnSpan: 2, construction: { kind: 'strip' } },
  ]);
  const expected = cutTexts(planned(planBlock(definition)));

  test('every oriented copy plans the same cut dimensions', () => {
    for (const turns of [0, 1, 2, 3]) {
      for (const mirrored of [false, true]) {
        const placed = placedGeometry(
          placeBlock(definition, { turns: turns as 0 | 1 | 2 | 3, mirrored }),
        );
        const plan = planned(planBlock(placed));
        expect(cutTexts(plan)).toEqual(expected);
      }
    }
  });

  test('the definition is not altered by any placed copy', () => {
    const before = JSON.stringify(definition);
    for (const turns of [0, 1, 2, 3]) {
      placedGeometry(placeBlock(definition, { turns: turns as 0 | 1 | 2 | 3, mirrored: true }));
    }
    expect(JSON.stringify(definition)).toBe(before);
  });

  test('a piece turned inside its region cuts the same as the unturned one', () => {
    // A goose spanning two cells down and one across, turned a quarter: its
    // definition size is 4 x 2 inches again, so G-03's cuts are identical to
    // the wide goose of the fixture row.
    const tall = blockOf(divideGrid(64, 2, 2), [
      {
        id: 'goose',
        row: 0,
        column: 0,
        rowSpan: 2,
        columnSpan: 1,
        construction: { kind: 'goose-one' },
        orientation: { turns: 1, mirrored: false },
      },
      square('a', 0, 1),
      square('b', 1, 1),
    ]);
    const goose = unitGroup(planned(planBlock(tall)), 0);
    expect(cutText(parent(goose.plan, 0).width)).toBe('4 1/2');
    expect(cutText(parent(goose.plan, 0).height)).toBe('2 1/2');
    expect(cutText(parent(goose.plan, 1).width)).toBe('2 1/2');
  });
});
