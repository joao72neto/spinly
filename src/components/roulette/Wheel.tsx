import { View, StyleSheet } from "react-native";
import Svg from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import type { RouletteItem } from "../../types/roulette";
import { computeSliceGeometry } from "../../utils/math";
import { WheelSlice } from "./WheelSlice";
import { Pointer } from "./Pointer";

interface WheelProps {
  items: RouletteItem[];
  rotation: SharedValue<number>;
  size?: number;
  onSlicePress: (itemId: string) => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * The main roulette wheel component.
 * Renders all visible slices inside a rotating SVG and a fixed pointer on top.
 */
export function Wheel({
  items,
  rotation,
  size = 300,
  onSlicePress,
}: WheelProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 4; // small padding for stroke

  const geometries = computeSliceGeometry(items);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <AnimatedView style={[styles.wheelWrapper, animatedStyle]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {geometries.map((geo) => (
            <WheelSlice
              key={geo.item.id}
              geometry={geo}
              cx={cx}
              cy={cy}
              radius={radius}
              onPress={onSlicePress}
            />
          ))}
        </Svg>
      </AnimatedView>
      <Pointer size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  wheelWrapper: {
    width: "100%",
    height: "100%",
  },
});
