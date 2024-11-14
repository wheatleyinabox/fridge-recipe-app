// components/RecipeSearchBar.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SearchBar } from "react-native-elements";

type RecipeSearchBarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedMealType: string;
  onMealTypeChange: (mealType: string) => void;
};

const RecipeSearchBar: React.FC<RecipeSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedMealType,
  onMealTypeChange,
}) => {
  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search recipes..."
        onChangeText={onSearchChange}
        value={searchQuery}
        platform="default"
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchInputContainer}
      />
      <View style={styles.mealTypeContainer}>
        {["Breakfast", "Lunch", "Dinner"].map((mealType) => (
          <TouchableOpacity
            key={mealType}
            onPress={() => onMealTypeChange(mealType)}
            style={[
              styles.mealTypeButton,
              selectedMealType === mealType && styles.selectedMealTypeButton,
            ]}
          >
            <Text
              style={[
                styles.mealTypeText,
                selectedMealType === mealType && styles.selectedMealTypeText,
              ]}
            >
              {mealType}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  searchBarContainer: {
    backgroundColor: "transparent",
    borderColor: "#f8f8f8",
  },
  searchInputContainer: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  mealTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  mealTypeButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  selectedMealTypeButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#A9DFA3",
  },
  mealTypeText: {
    fontSize: 16,
    color: "#1A1C1B",
  },
  selectedMealTypeText: {
    color: "#1A1C1B",
    fontWeight: "bold",
  },
});

export default RecipeSearchBar;
