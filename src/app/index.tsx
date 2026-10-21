import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useRouletteList } from "../hooks/useRouletteStorage";
import { EmptyState } from "../components/ui/EmptyState";
import type { Roulette } from "../types/roulette";
import { Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function HomeScreen() {
  const router = useRouter();
  const { roulettes, isLoading, reload, createRoulette, removeRoulette } =
    useRouletteList();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // Reload data whenever the screen gains focus
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const handleCreate = async () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    const created = await createRoulette(trimmed);
    setShowCreateModal(false);
    setNewTitle("");
    router.push({
      pathname: "/roulette/[id]",
      params: { id: created.id },
    });
  };

  const handleDelete = (roulette: Roulette) => {
    Alert.alert(
      "Excluir Roleta",
      `Tem certeza que deseja excluir "${roulette.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => removeRoulette(roulette.id),
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: Roulette }) => {
    const activeCount = item.items.filter(
      (i) => i.isEnabled && !i.isHidden,
    ).length;
    const totalCount = item.items.length;

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/roulette/[id]",
            params: { id: item.id },
          })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardCount}>
            {activeCount}/{totalCount} itens
          </Text>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardHint}>Toque para abrir</Text>
          <View style={styles.cardActions}>
            <Pressable style={styles.cardActionButton}>
              <Feather name="edit-3" size={12} />
              <Text>Editar</Text>
            </Pressable>
            <Pressable
              onPress={() => handleDelete(item)}
              style={styles.cardActionButton}
            >
              <Feather name="trash-2" size={12} />
              <Text>Excluir</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Spinly",
          headerLeft: () => (
            <Image
              source={require("../../assets/images/spinly-icon.png")}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {roulettes.length === 0 ? (
        <EmptyState
          icon="🎰"
          title="Nenhuma roleta criada"
          message="Crie sua primeira roleta para começar a sortear!"
        />
      ) : (
        <FlatList
          data={roulettes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => setShowCreateModal(true)}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      {/* Create Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCreateModal(false)}
        >
          <Pressable
            style={styles.modalCard}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Nova Roleta</Text>
            <TextInput
              style={styles.modalInput}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Ex: O que comer hoje?"
              placeholderTextColor="#94A3B8"
              autoFocus
              maxLength={40}
              onSubmitEditing={handleCreate}
            />
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewTitle("");
                }}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalSubmit,
                  !newTitle.trim() && styles.modalSubmitDisabled,
                ]}
                onPress={handleCreate}
                disabled={!newTitle.trim()}
              >
                <Text style={styles.modalSubmitText}>Criar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
  },
  cardCount: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
    marginLeft: 8,
  },
  cardFooter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHint: {
    color: "#64748B",
    fontSize: 12,
  },
  cardActions: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 8,
  },
  cardActionButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#CFCFCF",
    paddingLeft: 12,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 12,
    borderRadius: 10,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 32,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "300",
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1E293B",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
  },
  modalCancel: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
  modalSubmit: {
    backgroundColor: "#4ECDC4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  modalSubmitDisabled: {
    opacity: 0.5,
  },
  modalSubmitText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
