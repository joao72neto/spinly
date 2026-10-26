import Svg, { Circle } from "react-native-svg";
import { FRAME_COLOR } from "@/utils/colors";

interface WheelFrameProps {
  size: number;
  ringWidth: number;
  top: number;
}

/** Anel externo + hub central. Camada estática, não gira e não captura toque. */
export function WheelFrame({ size, ringWidth, top }: WheelFrameProps) {
  const c = size / 2;
  const ringRadius = size / 2 - ringWidth / 2; // o stroke é centrado no raio
  const hubRadius = size * 0.096;

  return (
    <Svg
      width={size}
      height={size}
      style={{ position: "absolute", top, left: 0 }}
      pointerEvents="none"
    >
      <Circle
        cx={c}
        cy={c}
        r={ringRadius}
        stroke={FRAME_COLOR}
        strokeWidth={ringWidth}
        fill="none"
      />
      <Circle cx={c} cy={c} r={hubRadius} fill="#0D1C42" />
      <Circle cx={c} cy={c} r={hubRadius * 0.78} fill={FRAME_COLOR} />
    </Svg>
  );
}
