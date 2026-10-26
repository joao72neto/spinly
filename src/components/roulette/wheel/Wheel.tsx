import { View } from "react-native";
import Svg from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import type { RouletteItem } from "@/types/roulette";
import { computeSliceGeometry } from "@/utils/math";
import { WheelSlice } from "./WheelSlice";
import { WheelFrame } from "./WheelFrame";
import { Pointer, getPointerOverhang } from "./Pointer";

interface WheelProps {
  items: RouletteItem[];
  rotation: SharedValue<number>;
  size?: number; // diâmetro total da roleta, anel incluso
  onSlicePress: (itemId: string) => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function Wheel({
  items,
  rotation,
  size = 300,
  onSlicePress,
}: WheelProps) {
  const ringWidth = size * 0.05;
  const overhang = getPointerOverhang(size);
  const cx = size / 2;
  const cy = size / 2;
  const sliceRadius = size / 2 - ringWidth + 1; // +1px: sobrepõe sob o anel

  const geometries = computeSliceGeometry(items);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={{ width: size, height: size + overhang }}>
      <AnimatedView
        style={[
          { width: size, height: size, marginTop: overhang },
          animatedStyle,
        ]}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {geometries.map((geo) => (
            <WheelSlice
              key={geo.item.id}
              geometry={geo}
              cx={cx}
              cy={cy}
              radius={sliceRadius}
              onPress={onSlicePress}
            />
          ))}
        </Svg>
      </AnimatedView>

      <WheelFrame size={size} ringWidth={ringWidth} top={overhang} />
      <Pointer size={size} overhang={overhang} />
    </View>
  );
}
