// librequilt -- cuttability of a seam topology, and the seam at fault.
// Copyright (C) 2026 librequilt contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * W-02 at unit scale: only a geometry with supported straight seams and a
 * rotary construction method can yield a cutting chart. An unsupported free
 * polygon, curve or set-in seam is refused as cuttable geometry, with the
 * affected seam identified -- the refusal is a value, never a thrown error
 * (I5), because a quilter can draw any of these.
 *
 * The block-level answer ("is this block cuttable?") is `core/block`'s job
 * (IMPL-03); this module owns the seam vocabulary and the typed refusal it
 * produces, so both layers refuse in the same words.
 */

/** How one seam of a drawn geometry runs. */
export type SeamShape = 'straight' | 'curve' | 'set-in' | 'free-polygon';

/** A seam of a drawn geometry, named so a refusal can identify it. */
export interface Seam {
  /** A name the quilter's drawing can point at, such as `seam-3`. */
  readonly id: string;
  readonly shape: SeamShape;
}

/** Seam shapes outside the supported rotary construction methods (W-02). */
export type UnsupportedSeamShape = 'curve' | 'set-in' | 'free-polygon';

/** The typed refusal for an unsupported seam, naming the seam at fault. */
export interface UnsupportedSeamRefusal {
  readonly kind: 'unsupported-seam';
  readonly seamId: string;
  readonly shape: UnsupportedSeamShape;
}

/** The outcome of asking whether a seam topology is cuttable. */
export type SeamAssessment =
  | { readonly ok: true }
  | { readonly ok: false; readonly refusal: UnsupportedSeamRefusal };

/** `null` when the shape is supported, otherwise the unsupported shape. */
function unsupportedShape(shape: SeamShape): UnsupportedSeamShape | null {
  return shape === 'straight' ? null : shape;
}

/**
 * Assess a seam topology, identifying the first unsupported seam.
 *
 * Straight seams pass. Any other shape refuses, so a drawn geometry never
 * becomes a guessed cutting chart (W-02, `T-01`'s rejection row).
 */
export function assessSeams(seams: readonly Seam[]): SeamAssessment {
  for (const seam of seams) {
    const shape = unsupportedShape(seam.shape);
    if (shape !== null) {
      return {
        ok: false,
        refusal: { kind: 'unsupported-seam', seamId: seam.id, shape },
      };
    }
  }
  return { ok: true };
}
