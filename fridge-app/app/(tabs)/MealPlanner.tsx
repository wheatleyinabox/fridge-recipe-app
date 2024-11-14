// MealPlanner.tsx
import React, { useState } from "react";
import { View, FlatList, Text } from "react-native";
import RecipeSearchBar from "../../components/RecipeSearchBar";
import RecipeCard from "../../components/RecipeCard";
import recipesData from "../RecipeData.json";

const MealPlanner: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("Breakfast");

  const filteredRecipes = recipesData.filter((recipe) => {
    const matchesSearch = recipe.label
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesMealType = recipe.mealType === selectedMealType;
    return matchesSearch && matchesMealType;
  });

  return (
    <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: "#fff" }}>
      <Text
        style={{
          fontSize: 24,
          textAlign: "center",
          marginVertical: 10,
        }}
      >
        Select up to 7 {selectedMealType.toLowerCase()} meals for your
        planner...
      </Text>
      <RecipeSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedMealType={selectedMealType}
        onMealTypeChange={setSelectedMealType}
      />
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        contentContainerStyle={{ padding: 20, alignSelf: "center" }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MealPlanner;
