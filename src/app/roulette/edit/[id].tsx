import { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, Stack, useFocusEffect } from "expo-router";
import { useRouletteDetail } from "../../../hooks/useRouletteStorage";
import { ItemList } from "../../../components/items/ItemList";
import { ItemFormModal } from "../../../components/items/ItemFormModal";
import { EmptyState } from "../../../components/ui/EmptyState";
import type { RouletteItem } from "../../../types/roulette";

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
    Alert.alert("Excluir Item", `Excluir "${item?.label}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => removeItem(itemId),
      },
    ]);
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
              <Text style={styles.resetBarText}>
                🔄 Restaurar todos os itens
              </Text>
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
        <Text style={styles.addButtonText}>+ Adicionar Item</Text>
      </Pressable>

      {/* Add Item Modal */}
      <ItemFormModal
        visible={showForm}
        onSubmit={handleAdd}
        onCancel={() => setShowForm(false)}
      />

      {/* Edit Item Modal */}
      <ItemFormModal
        visible={!!editingItem}
        initialLabel={editingItem?.label}
        initialWeight={editingItem?.weight}
        initialColor={editingItem?.color}
        onSubmit={handleEditSubmit}
        onCancel={() => setEditingItem(null)}
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
  resetBarText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
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
  addButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
