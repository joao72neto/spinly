import { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useRouletteList } from "../hooks/useRouletteStorage";
import { EmptyState } from "../components/ui/EmptyState";
import type { Roulette } from "../types/roulette";
import { Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import BaseModal from "@/components/BaseModal";
import { RoulettePreview } from "../components/roulette/RoulettePreview";
import { SearchBar } from "../components/SearchBar";
import { normalizeText } from "../utils/string";

export default function HomeScreen() {
  const router = useRouter();
  const {
    roulettes,
    isLoading,
    reload,
    createRoulette,
    removeRoulette,
    updateRoulette,
  } = useRouletteList();

  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [updatingItem, setUpdatingItem] = useState<Roulette | null>(null);
  const [deletingRoulette, setDeletingRoulette] = useState<Roulette | null>(
    null,
  );
  const [rouletteTitle, setRouletteTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoulettes = useMemo(() => {
    const query = normalizeText(searchQuery.trim());
    if (!query) return roulettes;
    return roulettes.filter((roulette) =>
      normalizeText(roulette.title).includes(query),
    );
  }, [roulettes, searchQuery]);

  // Reload data whenever the screen gains focus
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const handleCreate = async () => {
    const trimmed = rouletteTitle.trim();
    if (!trimmed) return;
    const created = await createRoulette(trimmed);
    setShowCreateEditModal(false);
    setRouletteTitle("");
    router.push({
      pathname: "/roulette/[id]",
      params: { id: created.id },
    });
  };

  const handleEdit = async (roulette: Roulette) => {
    setRouletteTitle(roulette.title);
    setShowCreateEditModal(true);
    setUpdatingItem(roulette);
  };

  const handleConfirmEdit = async (title: string) => {
    if (!updatingItem) return;
    await updateRoulette({
      title,
      newRoulette: updatingItem,
    });
    handleCloseModal();
  };

  const handleDelete = (roulette: Roulette) => {
    setDeletingRoulette(roulette);
  };

  const handleConfirmDelete = async () => {
    if (!deletingRoulette) return;
    await removeRoulette(deletingRoulette.id);
    setDeletingRoulette(null);
  };

  const handleCloseModal = () => {
    setUpdatingItem(null);
    setShowCreateEditModal(false);
    setRouletteTitle("");
  };

  const renderItem = ({ item }: { item: Roulette }) => {
    const activeCount = item.items.filter(
      (i) => i.isEnabled && !i.isHidden,
    ).length;
    const totalCount = item.items.length;

    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() =>
          router.push({
            pathname: "/roulette/[id]",
            params: { id: item.id },
          })
        }
      >
        <View style={styles.cardContent}>
          {/* Wheel preview avatar */}
          <View style={styles.previewContainer}>
            <RoulettePreview items={item.items} size={64} />
          </View>

          {/* Details & Actions */}
          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
            </View>

            <View style={styles.cardMeta}>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {activeCount}/{totalCount}{" "}
                  {totalCount === 1 ? "item" : "itens"}
                </Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.cardHint}>Toque para abrir</Text>
              <View style={styles.cardActions}>
                <Pressable
                  onPress={() => handleEdit(item)}
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.editButton,
                    pressed && styles.actionButtonPressed,
                  ]}
                  hitSlop={8}
                  accessibilityLabel="Editar título da roleta"
                >
                  <Feather name="edit-3" size={15} color="#0284C7" />
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(item)}
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.deleteButton,
                    pressed && styles.actionButtonPressed,
                  ]}
                  hitSlop={8}
                  accessibilityLabel="Excluir roleta"
                >
                  <Feather name="trash-2" size={15} color="#DC2626" />
                </Pressable>
              </View>
            </View>
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
              source={require("../../assets/images/spinly-adaptive-foreground.png")}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      {roulettes.length > 0 && (
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Pesquisar roletas..."
          />
        </View>
      )}

      {roulettes.length === 0 ? (
        <EmptyState
          icon="🎰"
          title="Nenhuma roleta criada"
          message="Crie sua primeira roleta para começar a sortear!"
        />
      ) : filteredRoulettes.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Nenhuma roleta encontrada"
          message={`Nenhum resultado para "${searchQuery}". Tente outro termo.`}
        />
      ) : (
        <FlatList
          data={filteredRoulettes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => setShowCreateEditModal(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <Modal
        visible={showCreateEditModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
          <Pressable
            style={styles.modalCard}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>
              {updatingItem ? "Editar Roleta" : "Nova Roleta"}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={rouletteTitle}
              onChangeText={setRouletteTitle}
              placeholder="Ex: O que comer hoje?"
              placeholderTextColor="#94A3B8"
              autoFocus
              maxLength={40}
              onSubmitEditing={
                updatingItem
                  ? () => handleConfirmEdit(rouletteTitle)
                  : handleCreate
              }
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={handleCloseModal}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalSubmit,
                  !rouletteTitle.trim() && styles.modalSubmitDisabled,
                ]}
                onPress={
                  updatingItem
                    ? () => handleConfirmEdit(rouletteTitle)
                    : handleCreate
                }
                disabled={!rouletteTitle.trim()}
              >
                <Text style={styles.modalSubmitText}>
                  {updatingItem ? "Confirmar" : "Criar"}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <BaseModal
        visible={!!deletingRoulette}
        title="Excluir Roleta"
        icon="delete"
        confirmVariant="danger"
        confirmText="Excluir"
        cancelText="Cancelar"
        message={`Tem certeza que deseja excluir "${deletingRoulette?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingRoulette(null)}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  previewContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  countBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  countBadgeText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cardHint: {
    color: "#94A3B8",
    fontSize: 11,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  editButton: {
    backgroundColor: "#E0F2FE",
    borderColor: "#BAE6FD",
  },
  deleteButton: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FECACA",
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
