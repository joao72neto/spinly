import Svg, { Polygon } from "react-native-svg";
import { FRAME_COLOR, POINTER_FILL } from "@/utils/colors";

export const POINTER_SCALE = 0.75;
export const getPointerOverhang = (size: number) => size * 0.06 * POINTER_SCALE;

interface PointerProps {
  size: number;
  overhang: number;
}

/**
 * Ponteiro triangular branco com borda preta e cantos arredondados.
 * Truque: O MESMO triângulo desenhado duas vezes, com stroke grosso e
 * strokeLinejoin="round". O stroke arredonda os cantos com raio = strokeWidth / 2.
 * Preto (stroke maior) por baixo, branco (stroke menor) por cima:
 * a diferença entre os dois vira a borda.
 */
export function Pointer({ size, overhang }: PointerProps) {
  const s = POINTER_SCALE;

  const width = size * 0.235 * s;
  const depth = size * 0.134 * s; // quanto a ponta desce a partir do topo do anel
  const border = size * 0.022 * s;
  const innerRadius = size * 0.012 * s;
  const d = border + innerRadius;

  const left = size / 2 - width / 2 + d;
  const right = size / 2 + width / 2 - d;
  const topY = d;
  const tipY = overhang + depth - d;
  const points = `${left},${topY} ${right},${topY} ${size / 2},${tipY}`;

  return (
    <Svg
      width={size}
      height={overhang + size * 0.14}
      style={{ position: "absolute", top: 0, left: 0 }}
      pointerEvents="none"
    >
      <Polygon
        points={points}
        fill={FRAME_COLOR}
        stroke={FRAME_COLOR}
        strokeWidth={d * 2}
        strokeLinejoin="round"
      />
      <Polygon
        points={points}
        fill={POINTER_FILL}
        stroke={POINTER_FILL}
        strokeWidth={innerRadius * 2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
