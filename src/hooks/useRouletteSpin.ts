import { useCallback, useState } from 'react';
import {
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import type { RouletteItem } from '../types/roulette';
import {
  computeSliceGeometry,
  weightedRandomSelect,
  calculateTargetRotation,
} from '../utils/math';

interface SpinResult {
  item: RouletteItem;
}

interface UseRouletteSpinReturn {
  /** Shared value driving the wheel rotation (degrees) */
  rotation: ReturnType<typeof useSharedValue<number>>;
  /** Whether the wheel is currently spinning */
  isSpinning: boolean;
  /** The result of the last spin, or null */
  result: SpinResult | null;
  /** Trigger a spin — returns false if not enough active items */
  spin: (items: RouletteItem[]) => boolean;
  /** Clear the result (e.g., after dismissing the modal) */
  clearResult: () => void;
}

const SPIN_DURATION_MS = 4000;

/**
 * Hook encapsulating the spin animation logic using Reanimated.
 *
 * - Performs a weighted random selection
 * - Animates the wheel rotation with a cubic ease-out for natural deceleration
 * - Reports the result when the animation completes
 */
export function useRouletteSpin(): UseRouletteSpinReturn {
  const rotation = useSharedValue(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);

  const onSpinComplete = useCallback((item: RouletteItem) => {
    setIsSpinning(false);
    setResult({ item });
  }, []);

  const spin = useCallback(
    (items: RouletteItem[]): boolean => {
      if (isSpinning) return false;

      const selection = weightedRandomSelect(items);
      if (!selection) return false;

      const geometries = computeSliceGeometry(items);
      const targetRotation = calculateTargetRotation(
        geometries,
        selection.item.id
      );

      setIsSpinning(true);
      setResult(null);

      // Normalize current rotation to avoid huge accumulated values
      const currentNormalized = rotation.value % 360;
      rotation.value = currentNormalized;

      rotation.value = withTiming(
        currentNormalized + targetRotation,
        {
          duration: SPIN_DURATION_MS,
          easing: Easing.out(Easing.cubic),
        },
        (finished) => {
          if (finished) {
            runOnJS(onSpinComplete)(selection.item);
          }
        }
      );

      return true;
    },
    [isSpinning, rotation, onSpinComplete]
  );

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return { rotation, isSpinning, result, spin, clearResult };
}
