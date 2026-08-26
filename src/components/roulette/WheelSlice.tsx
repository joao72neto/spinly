import { Path, Text as SvgText } from "react-native-svg";
import type { SliceGeometry } from "../../utils/math";
import { describeArc, getLabelPosition } from "../../utils/math";
import { DISABLED_COLOR } from "../../utils/colors";

interface WheelSliceProps {
  geometry: SliceGeometry;
  cx: number;
  cy: number;
  radius: number;
  onPress: (itemId: string) => void;
}

/**
 * A single SVG slice of the roulette wheel.
 * Renders the arc path and a label. Grayed out when disabled.
 */
export function WheelSlice({
  geometry,
  cx,
  cy,
  radius,
  onPress,
}: WheelSliceProps) {
  const { item, startAngle, endAngle, midAngle, sweepAngle } = geometry;
  const fillColor = item.isEnabled ? item.color : DISABLED_COLOR;
  const opacity = item.isEnabled ? 1 : 0.6;

  const path = describeArc(cx, cy, radius, startAngle, endAngle);
  const labelPos = getLabelPosition(cx, cy, radius, midAngle, 0.6);

  // Truncate label for small slices
  const maxLabelLength = sweepAngle < 30 ? 6 : sweepAngle < 50 ? 10 : 20;
  const displayLabel =
    item.label.length > maxLabelLength
      ? item.label.slice(0, maxLabelLength - 1) + "…"
      : item.label;

  // Font size based on slice size
  const fontSize = Math.max(8, Math.min(14, sweepAngle / 3));

  return (
    <>
      <Path
        d={path}
        fill={fillColor}
        opacity={opacity}
        stroke="#FFFFFF"
        strokeWidth={2}
        onPress={() => onPress(item.id)}
      />
      <SvgText
        x={labelPos.x}
        y={labelPos.y}
        fill="#FFFFFF"
        fontSize={fontSize}
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="central"
        rotation={labelPos.rotation}
        origin={`${labelPos.x}, ${labelPos.y}`}
        onPress={() => onPress(item.id)}
      >
        {displayLabel}
      </SvgText>
    </>
  );
}
