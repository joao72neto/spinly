import { useCallback, useState } from "react";
import {
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import type { RouletteItem } from "../types/roulette";
import {
  computeSliceGeometry,
  weightedRandomSelect,
  calculateTargetRotation,
} from "../utils/math";

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
  /** Trigger a spin — returns false if no active items or already spinning */
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

      // ângulo (0-360) em que a fatia fica sob o pointer, assumindo rotação = 0
      const pointerAlignmentAngle = calculateTargetRotation(
        geometries,
        selection.item.id,
      );

      const currentNormalized = ((rotation.value % 360) + 360) % 360;

      // quanto girar a partir da posição atual pra chegar no ângulo certo
      const angleDelta =
        (((pointerAlignmentAngle - currentNormalized) % 360) + 360) % 360;

      const EXTRA_SPINS = 5; // voltas extras só de efeito visual
      const totalDelta = angleDelta + EXTRA_SPINS * 360;

      setIsSpinning(true);
      setResult(null);

      rotation.value = withTiming(
        rotation.value + totalDelta,
        {
          duration: SPIN_DURATION_MS,
          easing: Easing.out(Easing.cubic),
        },
        (finished) => {
          if (finished) {
            runOnJS(onSpinComplete)(selection.item);
          }
        },
      );

      return true;
    },
    [isSpinning, rotation, onSpinComplete],
  );

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return { rotation, isSpinning, result, spin, clearResult };
}
