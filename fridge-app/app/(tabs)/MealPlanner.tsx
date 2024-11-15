import React, { useState } from "react";
import { View, FlatList, Text, Modal, StyleSheet } from "react-native";
import RecipeSearchBar from "../../components/RecipeSearchBar";
import RecipeCard from "../../components/RecipeCard";
import recipesData from "../RecipeData.json";
import RecipeDetail from "../../components/RecipeDetail"; // Assuming RecipeDetail is in this path

const MealPlanner: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("Breakfast");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  const filteredRecipes = recipesData.filter((recipe) => {
    const matchesSearch = recipe.label
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesMealType = recipe.mealType === selectedMealType;
    return matchesSearch && matchesMealType;
  });

  // Function to open the modal and set the selected recipe
  const openModal = (recipe: any) => {
    setSelectedRecipe(recipe);
    setIsModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedRecipe(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
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
        renderItem={({ item }) => (
          <RecipeCard recipe={item} onPress={() => openModal(item)} />
        )}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal for Recipe Details */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <RecipeDetail recipe={selectedRecipe} onClose={closeModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 10,
  },
  listContainer: {
    padding: 20,
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    padding: 20,
  },
});

export default MealPlanner;
