import { View, StyleSheet } from "react-native";

interface PointerProps {
  size: number;
}

/**
 * A triangular pointer fixed at the top center of the wheel,
 * indicating which slice is selected.
 */
export function Pointer({ size }: PointerProps) {
  const pointerSize = 20;

  return (
    <View
      style={[
        styles.pointer,
        {
          left: size / 2 - pointerSize / 2,
          top: -pointerSize / 2 + 4,
          borderLeftWidth: pointerSize / 2,
          borderRightWidth: pointerSize / 2,
          borderTopWidth: pointerSize,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  pointer: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#1E293B",
    zIndex: 10,
  },
});
