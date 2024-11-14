// SearchBarComponent.tsx
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SearchBar } from "react-native-elements";

type Props = {
  placeholder: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedMealType: string;
  onMealTypeChange: (type: string) => void;
};

const SearchBarComponent: React.FC<Props> = ({
  placeholder,
  searchQuery,
  onSearchChange,
  selectedMealType,
  onMealTypeChange,
}) => {
  return (
    <View style={styles.container}>
      <SearchBar
        placeholder={placeholder}
        onChangeText={onSearchChange}
        value={searchQuery}
        platform="default"
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
      />
      <View style={styles.mealTypeButtons}>
        {["Breakfast", "Lunch", "Dinner"].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => onMealTypeChange(type)}
            style={[
              styles.button,
              selectedMealType === type && styles.activeButton,
            ]}
          >
            <Text style={styles.buttonText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  searchContainer: { backgroundColor: "white" },
  searchInputContainer: { backgroundColor: "#f8f8f8" },
  mealTypeButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#ccc",
  },
  activeButton: {
    backgroundColor: "#4CAF50", // Active button color
  },
  buttonText: { color: "white", fontWeight: "bold" },
});

export default SearchBarComponent;
