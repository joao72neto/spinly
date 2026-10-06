import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import type { RouletteItem } from "../../types/roulette";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

interface ItemListProps {
  items: RouletteItem[];
  onEdit: (item: RouletteItem) => void;
  onDelete: (itemId: string) => void;
  onToggleEnabled: (itemId: string) => void;
  onToggleHidden: (itemId: string) => void;
}

/**
 * List of roulette items for the edit screen, showing status badges
 * and actions for each item.
 */
export function ItemList({
  items,
  onEdit,
  onDelete,
  onToggleEnabled,
  onToggleHidden,
}: ItemListProps) {
  const renderItem = ({ item }: { item: RouletteItem }) => (
    <View style={styles.row}>
      <View
        style={[
          styles.colorDot,
          { backgroundColor: item.color },
          (!item.isEnabled || item.isHidden) && styles.colorDotInactive,
        ]}
      />
      <View style={styles.info}>
        <Text
          style={[
            styles.label,
            (!item.isEnabled || item.isHidden) && styles.labelInactive,
          ]}
          numberOfLines={1}
        >
          {item.label}
        </Text>
        <View style={styles.badges}>
          <Text style={styles.weight}>Peso: {item.weight}</Text>
          {!item.isEnabled && (
            <Text style={[styles.badge, styles.disabledBadge]}>
              Desabilitado
            </Text>
          )}
          {item.isHidden && (
            <Text style={[styles.badge, styles.hiddenBadge]}>Oculto</Text>
          )}
        </View>
      </View>
      <View style={styles.actions}>
        {item.isHidden && (
          <Pressable
            style={styles.actionButton}
            onPress={() => onToggleHidden(item.id)}
          >
            <Text style={styles.actionIcon}>
              <Feather name="eye" size={24} color="green" />
            </Text>
          </Pressable>
        )}

        {(!item.isEnabled ||
          items.some((i) => i.isEnabled && i.id !== item.id)) && (
          <Pressable
            style={styles.actionButton}
            onPress={() => onToggleEnabled(item.id)}
          >
            <Text style={styles.actionIcon}>
              {item.isEnabled ? (
                <AntDesign name="pause-circle" size={24} />
              ) : (
                <AntDesign name="play-circle" size={24} />
              )}
            </Text>
          </Pressable>
        )}
        <Pressable style={styles.actionButton} onPress={() => onEdit(item)}>
          <Text style={styles.actionIcon}>
            <Feather name="edit-3" size={24} />
          </Text>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.actionIcon}>
            <Feather name="trash-2" size={24} color="red" />
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 100,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  colorDotInactive: {
    opacity: 0.4,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  labelInactive: {
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  weight: {
    fontSize: 12,
    color: "#64748B",
  },
  badge: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  disabledBadge: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  hiddenBadge: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
  },
  actions: {
    flexDirection: "row",
    gap: 4,
  },
  actionButton: {
    padding: 6,
  },
  actionIcon: {
    fontSize: 18,
    color: "#475569",
  },
});
