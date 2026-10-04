import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import type { RouletteItem } from "../../types/roulette";

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
              <Text style={styles.buttonText}>Girar Novamente</Text>
            </Pressable>

            {onHideItem && (
              <Pressable
                style={[styles.button, styles.warningButton]}
                onPress={() => onHideItem(item.id)}
              >
                <Text style={styles.buttonText}>Esconder Item</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.secondaryText]}>
                Fechar
              </Text>
            </Pressable>
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
  },
  resultText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  actions: {
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
  },
  warningButton: {
    backgroundColor: "#FF9671",
  },
  secondaryButton: {
    backgroundColor: "#F1F5F9",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#64748B",
  },
});
