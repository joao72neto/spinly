import { useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from "react-native";
import {
  useLocalSearchParams,
  useRouter,
  Stack,
  useFocusEffect,
} from "expo-router";
import { useRouletteDetail } from "../../hooks/useRouletteStorage";
import { useRouletteSpin } from "../../hooks/useRouletteSpin";
import { getActiveItems } from "../../utils/math";
import { Wheel } from "../../components/roulette/Wheel";
import { ResultModal } from "../../components/roulette/ResultModal";
import { EmptyState } from "../../components/ui/EmptyState";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import Spin from "@/components/Spin";

export default function RouletteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  const {
    roulette,
    isLoading,
    reload,
    toggleEnabled,
    hideItem,
    resetAllVisibility,
  } = useRouletteDetail(id!);

  const { rotation, isSpinning, result, spin, clearResult } = useRouletteSpin();

  // Reload data when returning from the edit screen
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const wheelSize = Math.min(screenWidth - 48, 340);

  const handleSpin = () => {
    if (!roulette) return;
    const success = spin(roulette.items);
    if (!success) {
      Alert.alert(
        "Itens insuficientes",
        "Ative pelo menos 1 item para girar a roleta.",
      );
    }
  };

  const handleSlicePress = (itemId: string) => {
    if (isSpinning) return; // Ignore taps during spin
    toggleEnabled(itemId);
  };

  const handleHideItem = (itemId: string) => {
    hideItem(itemId);
    clearResult();
  };

  const handleSpinAgain = () => {
    clearResult();
    // Small delay so the modal closes before spinning
    setTimeout(() => handleSpin(), 300);
  };

  if (isLoading || !roulette) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  const activeItems = getActiveItems(roulette.items);
  const canSpin = activeItems.length >= 1;
  const hasHiddenItems = roulette.items.some((i) => i.isHidden);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: roulette.title }} />

      {roulette.items.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="Roleta vazia"
          message="Adicione itens para começar a girar!"
        />
      ) : (
        <View style={styles.wheelContainer}>
          <Wheel
            items={roulette.items}
            rotation={rotation}
            size={wheelSize}
            onSlicePress={handleSlicePress}
          />

          {!canSpin && roulette.items.length > 0 && (
            <Text style={styles.warningText}>
              ⚠️ Ative pelo menos 1 item para girar
            </Text>
          )}
        </View>
      )}

      <View style={styles.bottomBar}>
        {hasHiddenItems && !isSpinning && (
          <Pressable style={styles.resetButton} onPress={resetAllVisibility}>
            <View style={styles.resetButtonContent}>
              <MaterialIcons name="restore" size={24} />
              <Text>Restaurar Todos</Text>
            </View>
          </Pressable>
        )}

        <View style={styles.mainActions}>
          {!isSpinning && (
            <Pressable
              style={styles.editButton}
              onPress={() =>
                router.push({
                  pathname: "/roulette/edit/[id]",
                  params: { id: roulette.id },
                })
              }
            >
              <Text style={styles.editButtonText}>
                <FontAwesome6 name="edit" size={20} /> Editar
              </Text>
            </Pressable>
          )}

          <Pressable
            style={[
              styles.spinButton,
              (!canSpin || isSpinning) && styles.spinButtonDisabled,
            ]}
            onPress={handleSpin}
            disabled={!canSpin || isSpinning}
          >
            {isSpinning ? (
              <View style={styles.spinButtonContent}>
                <Spin>
                  <FontAwesome6 color="white" name="arrows-spin" size={24} />
                </Spin>
                <Text style={styles.spinButtonText}>Girando...</Text>
              </View>
            ) : (
              <View style={styles.spinButtonContent}>
                <FontAwesome6 color="white" name="arrows-spin" size={24} />
                <Text style={styles.spinButtonText}>Girar!</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <ResultModal
        visible={!!result}
        item={result?.item ?? null}
        onSpinAgain={handleSpinAgain}
        onHideItem={activeItems.length > 1 ? handleHideItem : undefined}
        onClose={clearResult}
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
  wheelContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 24,
  },
  warningText: {
    marginTop: 16,
    fontSize: 14,
    color: "#F59E0B",
    fontWeight: "600",
    textAlign: "center",
  },
  bottomBar: {
    padding: 20,
    paddingBottom: 36,
    gap: 12,
  },
  resetButton: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resetButtonContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  mainActions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },
  spinButton: {
    flex: 2,
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
  spinButtonContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  spinButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: 800,
  },
  spinButtonDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
    elevation: 0,
  },
});
