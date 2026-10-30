import { View } from "react-native";
import Svg, { Circle, Path, Polygon } from "react-native-svg";
import type { RouletteItem } from "@/types/roulette";
import { computeSliceGeometry, describeArc } from "@/utils/math";
import { FRAME_COLOR, POINTER_FILL, DISABLED_COLOR } from "@/utils/colors";

interface RoulettePreviewProps {
  items: RouletteItem[];
  size?: number;
}

/**
 * Static miniature preview of a roulette wheel.
 * Renders slices proportionally with real colors, outer rim, central hub, and pointer.
 */
export function RoulettePreview({ items, size = 64 }: RoulettePreviewProps) {
  const ringWidth = size * 0.06;
  const overhang = size * 0.06;
  const cx = size / 2;
  const cy = overhang + size / 2;
  const sliceRadius = size / 2 - ringWidth + 1; // 1px overlap beneath the ring
  const hubRadius = size * 0.1;

  const geometries = computeSliceGeometry(items);

  return (
    <View
      style={{
        width: size,
        height: size + overhang,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={size}
        height={size + overhang}
        viewBox={`0 0 ${size} ${size + overhang}`}
      >
        {/* Slices layer */}
        {geometries.length > 0 ? (
          geometries.map((geo) => (
            <Path
              key={geo.item.id}
              d={describeArc(cx, cy, sliceRadius, geo.startAngle, geo.endAngle)}
              fill={geo.item.isEnabled ? geo.item.color : DISABLED_COLOR}
              opacity={geo.item.isEnabled ? 1 : 0.45}
            />
          ))
        ) : (
          /* Empty roulette placeholder pattern */
          <>
            <Circle cx={cx} cy={cy} r={sliceRadius} fill="#F1F5F9" />
            <Path d={describeArc(cx, cy, sliceRadius, 0, 90)} fill="#E2E8F0" />
            <Path
              d={describeArc(cx, cy, sliceRadius, 180, 270)}
              fill="#E2E8F0"
            />
          </>
        )}

        {/* Outer frame ring */}
        <Circle
          cx={cx}
          cy={cy}
          r={size / 2 - ringWidth / 2}
          stroke={FRAME_COLOR}
          strokeWidth={ringWidth}
          fill="none"
        />

        {/* Central hub */}
        <Circle cx={cx} cy={cy} r={hubRadius} fill="#0D1C42" />
        <Circle cx={cx} cy={cy} r={hubRadius * 0.72} fill={FRAME_COLOR} />

        {/* Mini pointer at 12 o'clock */}
        <Polygon
          points={`${cx - size * 0.08},${overhang * 0.25} ${cx + size * 0.08},${overhang * 0.25} ${cx},${overhang + size * 0.12}`}
          fill={FRAME_COLOR}
          stroke={FRAME_COLOR}
          strokeWidth={1}
          strokeLinejoin="round"
        />
        <Polygon
          points={`${cx - size * 0.055},${overhang * 0.45} ${cx + size * 0.055},${overhang * 0.45} ${cx},${overhang + size * 0.095}`}
          fill={POINTER_FILL}
          stroke={POINTER_FILL}
          strokeWidth={0.5}
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
