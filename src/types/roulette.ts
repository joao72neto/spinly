/**
 * Represents a single item/slice in a roulette wheel.
 */
export interface RouletteItem {
  id: string;
  label: string;
  /** Relative weight for probability calculation (minimum 1) */
  weight: number;
  /** Toggled by tapping the slice — disabled items render grayed out */
  isEnabled: boolean;
  /** Hidden after a spin result — item doesn't render but stays persisted */
  isHidden: boolean;
  /** Hex color for the slice */
  color: string;
}

/**
 * Represents a named roulette containing multiple items.
 */
export interface Roulette {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  items: RouletteItem[];
}
