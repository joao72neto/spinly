export const FRAME_COLOR = "#36415A";
export const POINTER_FILL = "#F8F3EE";

/**
 * Predefined color palette for roulette slices.
 * Visually distinct colors that work well on both light and dark backgrounds.
 */
const SLICE_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#FFE66D", // Yellow
  "#95E1D3", // Mint
  "#F38181", // Salmon
  "#AA96DA", // Lavender
  "#FCBAD3", // Pink
  "#A8D8EA", // Sky Blue
  "#FF9671", // Orange
  "#67E6DC", // Aqua
  "#C3AED6", // Purple
  "#FFD93D", // Gold
  "#6BCB77", // Green
  "#4D96FF", // Blue
  "#FF6F91", // Hot Pink
  "#845EC2", // Deep Purple
  "#FFC75F", // Amber
  "#00C9A7", // Emerald
  "#D65DB1", // Magenta
  "#0089BA", // Cerulean
];

/**
 * Returns a color from the palette based on index, cycling through if needed.
 */
export function getSliceColor(index: number): string {
  return SLICE_COLORS[index % SLICE_COLORS.length];
}

/**
 * Grayed-out color used for disabled slices.
 */
export const DISABLED_COLOR = "#B0B0B0";

/**
 * Returns the full palette for reference (e.g., color picker).
 */
export function getColorPalette(): string[] {
  return [...SLICE_COLORS];
}
