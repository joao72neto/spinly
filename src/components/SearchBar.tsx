import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

export interface SearchBarProps extends Omit<TextInputProps, "style"> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

/**
 * Reusable SearchBar component with search icon and clear button.
 */
export function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar...",
  onClear,
  containerStyle,
  inputStyle,
  ...rest
}: SearchBarProps) {
  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Feather
        name="search"
        size={18}
        color="#94A3B8"
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
        {...rest}
      />
      {value.length > 0 && (
        <Pressable
          onPress={handleClear}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.clearButtonPressed,
          ]}
          hitSlop={8}
          accessibilityLabel="Limpar busca"
          accessibilityRole="button"
        >
          <Feather name="x" size={16} color="#64748B" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    height: 44,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    marginLeft: 6,
  },
  clearButtonPressed: {
    opacity: 0.7,
  },
});

export default SearchBar;
