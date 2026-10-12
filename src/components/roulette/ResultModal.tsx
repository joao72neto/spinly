import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import type { RouletteItem } from "../../types/roulette";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

interface ResultModalProps {
  visible: boolean;
  item: RouletteItem | null;
  onSpinAgain: () => void;
  onHideItem?: (itemId: string) => void;
  onClose: () => void;
}

/**
 * Modal displayed after a spin, showing the selected item and offering
 * actions: spin again, hide the item from the next round, or close.
 */
export function ResultModal({
  visible,
  item,
  onSpinAgain,
  onHideItem,
  onClose,
}: ResultModalProps) {
  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <AntDesign name="close-circle" size={24} />
          </Pressable>

          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Resultado</Text>
          <View style={[styles.resultBadge, { backgroundColor: item.color }]}>
            <Text style={styles.resultText}>{item.label}</Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.primaryButton]}
              onPress={onSpinAgain}
            >
              <Text style={styles.buttonText}>
                <Fontisto name="spinner-rotate-forward" size={18} />
                Girar novamente
              </Text>
            </Pressable>

            {onHideItem && (
              <Pressable
                style={[styles.button, styles.secondaryButton]}
                onPress={() => onHideItem(item.id)}
              >
                <Text style={styles.buttonText}>
                  <Feather name="eye-off" size={18} />
                  Esconder item
                </Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 28,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },

  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,

    color: "#475569",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  resultBadge: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 24,
    minWidth: 160,
    alignItems: "center",

    boxShadow: "2px 2px 20px #D1D1D1",
  },
  resultText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  actions: {
    display: "flex",

    borderTopColor: "#EBEBEB",
    borderTopWidth: 1.8,
    paddingTop: 20,

    width: "100%",
    gap: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#4ECDC4",
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: "#4E56CD",
    flex: 1,
  },

  buttonText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
