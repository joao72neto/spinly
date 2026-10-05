import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { getColorPalette } from "../../utils/colors";

interface ItemFormModalProps {
  visible: boolean;
  /** If provided, the modal is in "edit" mode with pre-filled values */
  initialLabel?: string;
  initialWeight?: number;
  initialColor?: string;
  onSubmit: (label: string, weight: number, color: string) => void;
  onCancel: () => void;
}

/**
 * Modal form for creating or editing a roulette item.
 * Includes label input, weight input, and a color picker.
 */
export function ItemFormModal({
  visible,
  initialLabel = "",
  initialWeight = 1,
  initialColor,
  onSubmit,
  onCancel,
}: ItemFormModalProps) {
  const [label, setLabel] = useState(initialLabel);
  const [weightText, setWeightText] = useState(String(initialWeight));
  const colors = getColorPalette();
  const [selectedColor, setSelectedColor] = useState(initialColor ?? colors[0]);

  const isEditing = initialLabel !== "";

  // Reset form when opened
  useEffect(() => {
    if (visible) {
      setLabel(initialLabel);
      setWeightText(String(initialWeight));
      setSelectedColor(
        initialColor ?? colors[Math.floor(Math.random() * colors.length)],
      );
    }
  }, [visible, initialLabel, initialWeight, initialColor]);

  const handleSubmit = () => {
    const trimmed = label.trim();
    if (!trimmed) return;
    const weight = Math.max(1, parseInt(weightText, 10) || 1);
    onSubmit(trimmed, weight, selectedColor);
    setLabel("");
    setWeightText("1");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={styles.card}>
          <Text style={styles.title}>
            {isEditing ? "Editar Item" : "Novo Item"}
          </Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={label}
            onChangeText={setLabel}
            placeholder="Ex: Pizza, João, Estudar..."
            placeholderTextColor="#94A3B8"
            maxLength={50}
            autoFocus
          />

          <Text style={styles.label}>Peso</Text>
          <TextInput
            style={[styles.input, styles.weightInput]}
            value={weightText}
            onChangeText={setWeightText}
            placeholder="1"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            maxLength={4}
          />

          <Text style={styles.label}>Cor</Text>
          <View style={styles.colorForm}>
            {colors.map((color) => (
              <Pressable
                key={color}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[
                styles.submitButton,
                !label.trim() && styles.submitDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!label.trim()}
            >
              <Text style={styles.submitText}>
                {isEditing ? "Salvar" : "Adicionar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1E293B",
  },
  weightInput: {
    width: 100,
  },
  colorForm: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: "#1E293B",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
  submitButton: {
    backgroundColor: "#4ECDC4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
