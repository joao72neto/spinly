import type { RouletteItem } from '../types/roulette';

/**
 * Minimum visual angle (in degrees) for a slice, ensuring it remains
 * tappable and legible even with extreme weight differences (EC05).
 */
export const MIN_SLICE_ANGLE = 15;

/**
 * Converts degrees to radians.
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Converts radians to degrees.
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Describes the computed geometry for a single slice.
 */
export interface SliceGeometry {
  item: RouletteItem;
  startAngle: number; // degrees
  endAngle: number;   // degrees
  sweepAngle: number; // degrees
  midAngle: number;   // degrees (center of the arc)
}

/**
 * Filters items that participate in the visual rendering of the wheel.
 * Visible items = not hidden. (Disabled items still render, but grayed out.)
 */
export function getVisibleItems(items: RouletteItem[]): RouletteItem[] {
  return items.filter((item) => !item.isHidden);
}

/**
 * Filters items eligible for the spin (enabled AND not hidden).
 */
export function getActiveItems(items: RouletteItem[]): RouletteItem[] {
  return items.filter((item) => item.isEnabled && !item.isHidden);
}

/**
 * Calculates the total weight of active items.
 */
export function getTotalWeight(items: RouletteItem[]): number {
  return getActiveItems(items).reduce((sum, item) => sum + item.weight, 0);
}

/**
 * Computes the angular geometry for each visible slice, applying
 * minimum angle enforcement (EC05) and proportional distribution.
 *
 * Disabled items still get a visual slice (grayed out) but their weight
 * is treated as a small baseline for layout purposes only — they do NOT
 * contribute to the spin probability.
 */
export function computeSliceGeometry(items: RouletteItem[]): SliceGeometry[] {
  const visible = getVisibleItems(items);
  if (visible.length === 0) return [];

  // For layout purposes, assign each visible item a "layout weight":
  //  - Enabled items use their actual weight
  //  - Disabled items use a baseline of 1 (just for visual representation)
  const layoutWeights = visible.map((item) =>
    item.isEnabled ? item.weight : 1
  );
  const totalLayoutWeight = layoutWeights.reduce((s, w) => s + w, 0);

  if (totalLayoutWeight === 0) return [];

  // First pass: compute raw angles
  const rawAngles = layoutWeights.map(
    (w) => (w / totalLayoutWeight) * 360
  );

  // Second pass: enforce minimum angle (EC05)
  // Items below MIN_SLICE_ANGLE get bumped up; excess is taken proportionally
  // from items above the minimum.
  const enforced = enforceMinAngles(rawAngles, MIN_SLICE_ANGLE);

  // Build geometry
  const geometries: SliceGeometry[] = [];
  let currentAngle = 0;

  for (let i = 0; i < visible.length; i++) {
    const sweep = enforced[i];
    geometries.push({
      item: visible[i],
      startAngle: currentAngle,
      endAngle: currentAngle + sweep,
      sweepAngle: sweep,
      midAngle: currentAngle + sweep / 2,
    });
    currentAngle += sweep;
  }

  return geometries;
}

/**
 * Enforces a minimum angle for all slices. Redistributes stolen angle
 * proportionally from larger slices.
 */
function enforceMinAngles(angles: number[], minAngle: number): number[] {
  const n = angles.length;
  // If all slices at minimum wouldn't fit in 360°, just distribute equally
  if (n * minAngle > 360) {
    return angles.map(() => 360 / n);
  }

  const result = [...angles];
  let deficit = 0;
  const largeIndices: number[] = [];

  // Identify small slices and compute total deficit
  for (let i = 0; i < n; i++) {
    if (result[i] < minAngle) {
      deficit += minAngle - result[i];
      result[i] = minAngle;
    } else {
      largeIndices.push(i);
    }
  }

  // Redistribute deficit from large slices proportionally
  if (deficit > 0 && largeIndices.length > 0) {
    const totalLarge = largeIndices.reduce((s, idx) => s + result[idx], 0);
    for (const idx of largeIndices) {
      const share = (result[idx] / totalLarge) * deficit;
      result[idx] -= share;
    }
  }

  return result;
}

/**
 * Generates an SVG arc path for a slice given center, radius, and angles.
 * Angles are in degrees, 0° = right (3 o'clock), clockwise.
 */
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const startRad = degreesToRadians(startAngle - 90); // Rotate so 0° = top
  const endRad = degreesToRadians(endAngle - 90);

  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${cx} ${cy}`,
    `L ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
    'Z',
  ].join(' ');
}

/**
 * Computes the position for a label along the midpoint angle of a slice,
 * placed at a given fraction of the radius from center.
 */
export function getLabelPosition(
  cx: number,
  cy: number,
  radius: number,
  midAngleDeg: number,
  radiusFraction: number = 0.65
): { x: number; y: number; rotation: number } {
  const angleRad = degreesToRadians(midAngleDeg - 90);
  const r = radius * radiusFraction;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
    rotation: midAngleDeg > 90 && midAngleDeg < 270
      ? midAngleDeg + 180  // flip text so it's not upside-down
      : midAngleDeg,
  };
}

/**
 * Performs a weighted random selection from active items.
 * Returns the selected item and its index within the active items array.
 */
export function weightedRandomSelect(
  items: RouletteItem[]
): { item: RouletteItem; activeIndex: number } | null {
  const active = getActiveItems(items);
  if (active.length < 2) return null;

  const totalWeight = active.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) return null;

  const random = Math.random() * totalWeight;
  let cumulative = 0;

  for (let i = 0; i < active.length; i++) {
    cumulative += active[i].weight;
    if (random < cumulative) {
      return { item: active[i], activeIndex: i };
    }
  }

  // Fallback (shouldn't reach here)
  return { item: active[active.length - 1], activeIndex: active.length - 1 };
}

/**
 * Calculates the final rotation angle for the wheel so that the selected
 * item's slice center aligns with the pointer at the top (0° / 360°).
 *
 * @param sliceGeometries - computed slice geometries
 * @param selectedItemId - id of the item that was selected
 * @param extraSpins - number of full rotations to add (default 5–8)
 * @returns target rotation in degrees
 */
export function calculateTargetRotation(
  sliceGeometries: SliceGeometry[],
  selectedItemId: string,
  extraSpins?: number
): number {
  const slice = sliceGeometries.find((s) => s.item.id === selectedItemId);
  if (!slice) return 0;

  const spins = extraSpins ?? Math.floor(Math.random() * 4) + 5; // 5–8 spins

  // The pointer is at the top (0°). We need the midpoint of the selected
  // slice to end up at 0° (top). The wheel rotates clockwise, so we need
  // to rotate by (360 - midAngle) to bring midAngle to 0°.
  const targetAngle = 360 - slice.midAngle;

  return spins * 360 + targetAngle;
}

/**
 * Generates a unique ID using timestamp and random suffix.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
