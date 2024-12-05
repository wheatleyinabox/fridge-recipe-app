import { Colors } from "@/constants/Colors";
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
        inputStyle={styles.searchInputText}
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
            accessibilityLabel={`Select ${mealType}`}
            accessibilityRole="button"
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
    marginBottom: 10,
  },
  searchBarContainer: {
    backgroundColor: "transparent",
    borderColor: "#f8f8f8",
  },
  searchInputContainer: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  searchInputText: {
    fontSize: 16,
  },
  mealTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  mealTypeButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20, // Adding rounded corners for a modern look
  },
  selectedMealTypeButton: {
    backgroundColor: "#A9DFA3", // Green background for the selected meal type
    borderRadius: 20,
  },
  mealTypeText: {
    fontSize: 16,
    color: "green",
  },
  selectedMealTypeText: {
    fontWeight: "bold",
    color: Colors.light.secondary, // White text for better contrast when selected
  },
});

export default RecipeSearchBar;