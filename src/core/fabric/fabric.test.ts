// librequilt -- tests for F-01's fabric identity: a solid colour or a photo,
// its usable width, and its repeat offset.
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from 'bun:test';
import * as L from '../exact/length';
import * as Q from '../exact/rational';
import type { Fabric as FabricType, PhotoCalibrationResult } from './fabric';
import * as Fabric from './fabric';
import type * as Scale from './scale';

const calibrated = (result: PhotoCalibrationResult): Scale.PixelsPerInch => {
  if (!result.ok) throw new Error(`expected a scale, got the refusal ${result.refusal.kind}`);
  return result.value;
};

describe('F-01 fabric identity', () => {
  test('a solid fabric is a named solid colour, 40 inches wide by default', () => {
    const fabric = Fabric.solidFabric('navy');
    expect(fabric.name).toBe('navy');
    expect(fabric.source.kind).toBe('solid');
    if (fabric.source.kind === 'solid') expect(fabric.source.name).toBe('navy');
    expect(L.toSixteenthCount(fabric.usableWidth)).toBe(L.toSixteenthCount(L.inches(40)));
  });

  test('a photo fabric keeps its photo, scale and offset', () => {
    const photo = { pixelWidth: 600, pixelHeight: 400 };
    const scale = Q.rational(100n);
    const fabric = Fabric.photoFabric('floral', photo, scale);
    expect(fabric.source.kind).toBe('photo');
    if (fabric.source.kind !== 'photo') throw new Error('expected a photo');
    expect(fabric.source.photo).toEqual(photo);
    expect(Q.equals(fabric.source.scale, scale)).toBe(true);
    expect(fabric.source.offset).toEqual({ x: 0, y: 0 });
    expect(L.toSixteenthCount(fabric.usableWidth)).toBe(L.toSixteenthCount(L.inches(40)));
  });

  test('F-02: the usable width is editable in sixteenths', () => {
    const fabric = Fabric.solidFabric('navy', L.inches(42));
    expect(L.toSixteenthCount(fabric.usableWidth)).toBe(L.toSixteenthCount(L.inches(42)));
    const widened = Fabric.withUsableWidth(fabric, L.inches(44));
    expect(L.toSixteenthCount(widened.usableWidth)).toBe(L.toSixteenthCount(L.inches(44)));
    // The original is unchanged: fabrics are immutable values.
    expect(L.toSixteenthCount(fabric.usableWidth)).toBe(L.toSixteenthCount(L.inches(42)));
  });

  test('T-06: changing the offset leaves the scale and usable width untouched', () => {
    // Cuts come from finished geometry and the usable width; yardage from the
    // summed raw lengths. Neither reads the photo's scale or offset, so a motif
    // change cannot move a single cut or yardage number (W-05).
    const fabric = Fabric.photoFabric(
      'floral',
      { pixelWidth: 600, pixelHeight: 400 },
      Q.rational(100n),
    );
    const moved = Fabric.withOffset(fabric, { x: 12, y: -5 });
    if (fabric.source.kind !== 'photo' || moved.source.kind !== 'photo') {
      throw new Error('expected a photo');
    }
    expect(Q.equals(fabric.source.scale, moved.source.scale)).toBe(true);
    expect(L.toSixteenthCount(fabric.usableWidth)).toBe(L.toSixteenthCount(moved.usableWidth));
    expect(moved.source.offset).toEqual({ x: 12, y: -5 });
  });

  test('F-01: a missing photo is refused, by either route', () => {
    const solid = Fabric.solidFabric('navy');
    const byRepeat = Fabric.calibrateByRepeat(solid, 600, 96);
    expect(byRepeat.ok).toBe(false);
    if (!byRepeat.ok) expect(byRepeat.refusal.kind).toBe('missing-photo');
    const byRuler = Fabric.calibrateByMarkedPoints(solid, 300, 48);
    expect(byRuler.ok).toBe(false);
    if (!byRuler.ok) expect(byRuler.refusal.kind).toBe('missing-photo');
  });

  test('calibrating a photo fabric delegates to the numeric scale', () => {
    const fabric = Fabric.photoFabric(
      'floral',
      { pixelWidth: 600, pixelHeight: 400 },
      Q.rational(100n),
    );
    const scale = calibrated(
      Fabric.calibrateByRepeat(fabric, 600, L.toSixteenthCount(L.inches(6))),
    );
    expect(Q.format(scale)).toBe('100');
  });

  test('the missing-photo refusal has a sentence a quilter can act on', () => {
    const sentence = Fabric.describePhotoCalibrationRefusal({ kind: 'missing-photo' });
    expect(sentence.length).toBeGreaterThan(10);
    expect(sentence.endsWith('.')).toBe(true);
    expect(sentence).toContain('no photo');
  });

  test('a solid colour has no motif to offset, and that is a defect', () => {
    const solid: FabricType = Fabric.solidFabric('navy');
    expect(() => Fabric.withOffset(solid, { x: 1, y: 1 })).toThrow();
  });
});
