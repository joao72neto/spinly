import { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, Stack, useFocusEffect } from "expo-router";
import { useRouletteDetail } from "../../../hooks/useRouletteStorage";
import { ItemList } from "../../../components/items/ItemList";
import { ItemFormModal } from "../../../components/items/ItemFormModal";
import { BaseModal } from "../../../components/BaseModal";
import { EmptyState } from "../../../components/ui/EmptyState";
import type { RouletteItem } from "../../../types/roulette";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function EditRouletteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    roulette,
    isLoading,
    reload,
    addItem,
    removeItem,
    updateItem,
    toggleEnabled,
    unhideItem,
    resetAllVisibility,
  } = useRouletteDetail(id!);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<RouletteItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<RouletteItem | null>(null);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const handleAdd = (label: string, weight: number, color: string) => {
    addItem(label, weight, color);
    setShowForm(false);
  };

  const handleEdit = (item: RouletteItem) => {
    setEditingItem(item);
  };

  const handleEditSubmit = (label: string, weight: number, color: string) => {
    if (!editingItem) return;
    updateItem(editingItem.id, { label, weight, color });
    setEditingItem(null);
  };

  const handleDelete = (itemId: string) => {
    const item = roulette?.items.find((i) => i.id === itemId);
    if (item) {
      setDeletingItem(item);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    removeItem(deletingItem.id);
    setDeletingItem(null);
  };

  if (isLoading || !roulette) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  const hasHiddenOrDisabled = roulette.items.some(
    (i) => i.isHidden || !i.isEnabled,
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Editar: ${roulette.title}` }} />

      {roulette.items.length === 0 ? (
        <EmptyState
          icon="📝"
          title="Sem itens"
          message="Adicione itens à roleta usando o botão abaixo."
        />
      ) : (
        <View style={styles.listWrapper}>
          {hasHiddenOrDisabled && (
            <Pressable style={styles.resetBar} onPress={resetAllVisibility}>
              <View style={styles.resetBarContent}>
                <MaterialIcons color="#3B82F6" name="restore" size={24} />
                <Text style={styles.resetBarText}>
                  Restaurar todos os itens
                </Text>
              </View>
            </Pressable>
          )}
          <ItemList
            items={roulette.items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleEnabled={toggleEnabled}
            onToggleHidden={unhideItem}
          />
        </View>
      )}

      <Pressable style={styles.addButton} onPress={() => setShowForm(true)}>
        <View style={styles.addButtonContent}>
          <AntDesign color="#FFFFFF" name="plus" size={24} />
          <Text style={styles.addButtonText}>Adicionar Item</Text>
        </View>
      </Pressable>

      <ItemFormModal
        visible={showForm}
        onSubmit={handleAdd}
        onCancel={() => setShowForm(false)}
      />

      <ItemFormModal
        visible={!!editingItem}
        initialLabel={editingItem?.label}
        initialWeight={editingItem?.weight}
        initialColor={editingItem?.color}
        onSubmit={handleEditSubmit}
        onCancel={() => setEditingItem(null)}
      />

      <BaseModal
        visible={!!deletingItem}
        title="Excluir Item"
        icon="delete"
        confirmVariant="danger"
        confirmText="Excluir"
        cancelText="Cancelar"
        message={`Tem certeza que deseja excluir "${deletingItem?.label}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingItem(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  resetBar: {
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  resetBarContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  resetBarText: {
    color: "#3B82F6",
  },
  addButton: {
    margin: 16,
    marginBottom: 36,
    backgroundColor: "#4ECDC4",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    fontSize: 16,
    fontWeight: "700",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: 600,
  },
});
