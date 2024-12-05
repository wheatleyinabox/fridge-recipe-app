import React, { useState } from "react";
import { View, FlatList, Text, Modal, StyleSheet, Button } from "react-native";
import RecipeSearchBar from "../../components/RecipeSearchBar";
import RecipeCard from "../../components/RecipeCard";
import recipesData from "../RecipeData.json";
import RecipeDetail from "../../components/RecipeDetail"; // Assuming RecipeDetail is in this path

const MealPlanner: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("Breakfast");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [selectedRecipes, setSelectedRecipes] = useState<any[]>([]);

  // Filter recipes based on search query and meal type
  const filteredRecipes = recipesData.filter((item) => {
    const recipe = item.recipe; // Access the recipe object
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

  // Function to handle meal selection (up to 7)
  const selectMeal = (recipe: any) => {
    if (selectedRecipes.length < 7) {
      setSelectedRecipes((prev) => [...prev, recipe]);
    } else {
      alert("You can only select up to 7 meals.");
    }
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
        keyExtractor={(item) => item.recipe.label} // Access the recipe's label for the key
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item.recipe} // Pass the recipe object to RecipeCard
            onPress={() => openModal(item.recipe)} // Pass the recipe object to the modal
            onSelect={() => selectMeal(item.recipe)} // Pass the recipe object to the selectMeal function
          />
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
          <Button title="Close" onPress={closeModal} />
        </View>
      </Modal>

      {/* Selected Meals Section */}
      <View style={styles.selectedMealsContainer}>
        <Text style={styles.selectedMealsHeader}>Selected Meals:</Text>
        {selectedRecipes.length > 0 ? (
          selectedRecipes.map((recipe, index) => (
            <Text key={index} style={styles.selectedMeal}>
              {recipe.label}
            </Text>
          ))
        ) : (
          <Text style={styles.selectedMeal}>No meals selected yet.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  headerText: {
    fontSize: 24,
    textAlign: "center",
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
  selectedMealsContainer: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    marginTop: 20,
  },
  selectedMealsHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  selectedMeal: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default MealPlanner;
