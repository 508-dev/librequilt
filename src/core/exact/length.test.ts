// librequilt -- tests for G-01, the stored length.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as L from './length';
import * as E from './quadratic';
import * as Q from './rational';

const parsed = (text: string, options?: L.ParseLengthOptions): number | string => {
  const result = L.parseLength(text, options);
  return result.ok ? L.toSixteenthCount(result.value) : result.problem.kind;
};

describe('a stored length is a whole number of sixteenths', () => {
  test('whole inches convert to the sixteenth counts D-01 stores', () => {
    // docs/specification-fixtures.py, OTHER ACCEPTANCE NUMBERS:
    //   "file length counts: 192 sixteenths; 32 sixteenths"
    // for the 12-inch block and 2-inch sash of T-02 and T-07.
    expect(L.toSixteenthCount(L.inches(12))).toBe(192);
    expect(L.toSixteenthCount(L.inches(2))).toBe(32);
  });

  test('refuses anything that is not a sixteenth count', () => {
    expect(() => L.sixteenths(3.5)).toThrow(RangeError);
    expect(() => L.sixteenths(-1)).toThrow(RangeError);
    expect(() => L.sixteenths(Number.NaN)).toThrow(RangeError);
    expect(() => L.sixteenths(L.MAX_LENGTH_SIXTEENTHS + 1)).toThrow(RangeError);
    expect(L.isSixteenths(0)).toBe(true);
    expect(L.isSixteenths(0.5)).toBe(false);
  });

  test('converts to exact inches for geometry', () => {
    expect(Q.equals(L.toRational(L.sixteenths(56)), Q.rational(7n, 2n))).toBe(true);
    expect(E.equals(L.toExact(L.sixteenths(56)), E.fromFraction(7n, 2n))).toBe(true);
  });
});

describe('reading a length a quilter typed', () => {
  test('accepts whole numbers, mixed numbers, fractions and decimals', () => {
    expect(parsed('3')).toBe(48);
    expect(parsed(' 12 ')).toBe(192);
    expect(parsed('3 1/2')).toBe(56);
    expect(parsed('3-1/2')).toBe(56);
    expect(parsed('1/2')).toBe(8);
    expect(parsed('7/8')).toBe(14);
    expect(parsed('3.5')).toBe(56);
    expect(parsed('.5')).toBe(8);
    expect(parsed('3.0625')).toBe(49); // 3 1/16, the finest length G-01 allows
    expect(parsed('40')).toBe(640); // F-02's default usable fabric width
  });

  test('refuses a value between the sixteenth marks instead of rounding it', () => {
    // T-01: "Reject a 3.01-inch entered length". G-01: an input between those
    // marks is rejected rather than silently rounded.
    expect(parsed('3.01')).toBe('finer-than-a-sixteenth');
    expect(parsed('3 1/3')).toBe('finer-than-a-sixteenth');
    expect(parsed('1/32')).toBe('finer-than-a-sixteenth');
    expect(parsed('3.06')).toBe('finer-than-a-sixteenth');
    expect(parsed('0.03125')).toBe('finer-than-a-sixteenth');
  });

  test('refuses zero unless an optional sash or border may be absent', () => {
    // G-01: zero is valid only for an absent optional sash or border.
    expect(parsed('0')).toBe('zero-not-allowed');
    expect(parsed('0/8')).toBe('zero-not-allowed');
    expect(parsed('0', { allowZero: true })).toBe(0);
    expect(parsed('0.0', { allowZero: true })).toBe(0);
  });

  test('refuses negatives, nonsense and out-of-range lengths', () => {
    expect(parsed('-2')).toBe('negative');
    expect(parsed('')).toBe('empty');
    expect(parsed('   ')).toBe('empty');
    expect(parsed('abc')).toBe('not-a-length');
    expect(parsed('1/0')).toBe('not-a-length');
    expect(parsed('1e2')).toBe('not-a-length');
    expect(parsed('3 1/2 1/4')).toBe('not-a-length');
    expect(parsed('12"')).toBe('not-a-length');
    expect(parsed('1001')).toBe('out-of-range');
  });

  test('every refusal has a sentence a quilter can act on', () => {
    const problems: L.LengthProblem[] = [
      { kind: 'empty' },
      { kind: 'not-a-length', text: 'abc' },
      { kind: 'negative' },
      { kind: 'zero-not-allowed' },
      { kind: 'finer-than-a-sixteenth', text: '3.01' },
      { kind: 'out-of-range', maximumInches: 1000 },
    ];
    for (const problem of problems) {
      const sentence = L.describeLengthProblem(problem);
      expect(sentence.length).toBeGreaterThan(10);
      expect(sentence.endsWith('.')).toBe(true);
    }
    expect(L.describeLengthProblem({ kind: 'finer-than-a-sixteenth', text: '3.01' })).toContain(
      'sixteenth',
    );
  });
});

describe('printing a length', () => {
  test('prints the mixed numbers a cutting chart uses', () => {
    // The spellings in docs/specification-fixtures.py, section CUTS.
    expect(L.formatInches(L.sixteenths(56))).toBe('3 1/2');
    expect(L.formatInches(L.sixteenths(62))).toBe('3 7/8');
    expect(L.formatInches(L.sixteenths(68))).toBe('4 1/4');
    expect(L.formatInches(L.sixteenths(46))).toBe('2 7/8');
    expect(L.formatInches(L.sixteenths(124))).toBe('7 3/4');
    expect(L.formatInches(L.sixteenths(292))).toBe('18 1/4');
    expect(L.formatInches(L.sixteenths(150))).toBe('9 3/8');
    expect(L.formatInches(L.sixteenths(48))).toBe('3');
    expect(L.formatInches(L.sixteenths(8))).toBe('1/2');
    expect(L.formatInches(L.sixteenths(49))).toBe('3 1/16');
    expect(L.formatInches(L.sixteenths(0))).toBe('0');
  });

  test('round-trips every sixteenth from zero to four inches', () => {
    for (let count = 0; count <= 64; count += 1) {
      const length = L.sixteenths(count);
      const text = L.formatInches(length);
      const back = L.parseLength(text, { allowZero: true });
      expect(back.ok).toBe(true);
      if (back.ok) expect(L.toSixteenthCount(back.value)).toBe(count);
    }
  });
});
