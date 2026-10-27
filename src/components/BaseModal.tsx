import { isValidElement, type ReactNode } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  type ModalProps,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export type BaseModalIconType =
  "warning" | "delete" | "danger" | "success" | "info";

export interface BaseModalProps {
  /** Controls modal visibility */
  visible: boolean;

  /** Title displayed at the top of the modal. Defaults to "Atenção" */
  title?: string;

  /**
   * Custom icon displayed next to the title.
   * Can be a predefined preset ("warning" | "delete" | "danger" | "success" | "info")
   * or a custom React component (e.g. from @expo/vector-icons).
   * Defaults to "warning"
   */
  icon?: BaseModalIconType | ReactNode;

  /** Optional custom color for preset icons */
  iconColor?: string;

  /** Optional text message for simple dialogs */
  message?: string;

  /** Custom content rendered inside the modal body */
  children?: ReactNode;

  /** Action called when confirming */
  onConfirm?: () => void;

  /** Action called when cancelling or dismissing the modal */
  onCancel?: () => void;

  /** Text displayed inside the confirm button. Defaults to "Confirmar" */
  confirmText?: string;

  /** Text displayed inside the cancel button. Defaults to "Cancelar" */
  cancelText?: string;

  /** Visual variant of the confirm button. Defaults to "primary" */
  confirmVariant?: "primary" | "danger";

  /** Whether to show the confirm button. Defaults to true */
  showConfirmButton?: boolean;

  /** Whether to show the cancel button. Defaults to true */
  showCancelButton?: boolean;

  /** Disables the confirm button */
  isConfirmDisabled?: boolean;

  /** Displays a loading spinner on the confirm button and disables clicks */
  isConfirmLoading?: boolean;

  /** Dismisses modal when tapping the backdrop overlay. Defaults to true */
  closeOnBackdropPress?: boolean;

  /** Shows a close (X) icon at the top right of the modal. Defaults to false */
  showCloseButton?: boolean;

  /** Animation type for the modal. Defaults to "fade" */
  animationType?: ModalProps["animationType"];
}

const renderHeaderIcon = (
  icon: BaseModalIconType | ReactNode,
  iconColorOverride?: string,
) => {
  if (!icon) return null;

  if (isValidElement(icon)) {
    return icon;
  }

  const iconSize = 24;

  switch (icon) {
    case "warning":
      return (
        <Ionicons
          name="warning-outline"
          size={iconSize}
          color={iconColorOverride || "#F59E0B"}
        />
      );
    case "delete":
    case "danger":
      return (
        <Ionicons
          name="trash-outline"
          size={iconSize}
          color={iconColorOverride || "#EF4444"}
        />
      );
    case "success":
      return (
        <Ionicons
          name="checkmark-circle-outline"
          size={iconSize}
          color={iconColorOverride || "#10B981"}
        />
      );
    case "info":
      return (
        <Ionicons
          name="information-circle-outline"
          size={iconSize}
          color={iconColorOverride || "#3B82F6"}
        />
      );
    default:
      return null;
  }
};

export function BaseModal({
  visible,
  title = "Atenção",
  icon = "warning",
  iconColor,
  message,
  children,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "primary",
  showConfirmButton = true,
  showCancelButton = true,
  isConfirmDisabled = false,
  isConfirmLoading = false,
  closeOnBackdropPress = true,
  showCloseButton = false,
  animationType = "fade",
}: BaseModalProps) {
  const handleBackdropPress = () => {
    if (closeOnBackdropPress && onCancel) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    if (!isConfirmDisabled && !isConfirmLoading && onConfirm) {
      onConfirm();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.overlay} onPress={handleBackdropPress}>
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                {renderHeaderIcon(icon, iconColor)}
                <Text style={styles.title}>{title}</Text>
              </View>

              {showCloseButton && (
                <Pressable
                  onPress={onCancel}
                  style={styles.closeButton}
                  hitSlop={8}
                >
                  <Ionicons name="close" size={22} color="#64748B" />
                </Pressable>
              )}
            </View>

            {(message || children) && (
              <View style={styles.body}>
                {message ? <Text style={styles.message}>{message}</Text> : null}
                {children}
              </View>
            )}

            {(showCancelButton || showConfirmButton) && (
              <View style={styles.actions}>
                {showCancelButton && (
                  <Pressable
                    style={styles.cancelButton}
                    onPress={onCancel}
                    disabled={isConfirmLoading}
                  >
                    <Text style={styles.cancelButtonText}>{cancelText}</Text>
                  </Pressable>
                )}

                {showConfirmButton && (
                  <Pressable
                    style={[
                      styles.confirmButton,
                      confirmVariant === "danger"
                        ? styles.dangerButton
                        : styles.primaryButton,
                      (isConfirmDisabled || isConfirmLoading) &&
                        styles.disabledButton,
                    ]}
                    onPress={handleConfirm}
                    disabled={isConfirmDisabled || isConfirmLoading}
                  >
                    {isConfirmLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.confirmButtonText}>
                        {confirmText}
                      </Text>
                    )}
                  </Pressable>
                )}
              </View>
            )}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 380,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    flexShrink: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  body: {
    marginVertical: 10,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748B",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    marginTop: 18,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#4ECDC4",
  },
  dangerButton: {
    backgroundColor: "#EF4444",
  },
  disabledButton: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default BaseModal;
