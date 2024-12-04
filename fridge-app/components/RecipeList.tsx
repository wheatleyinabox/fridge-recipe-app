import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import RecipeCard from "./RecipeCard";
import recipesData from "../app/RecipeData.json";
import RecipeDetail from "./RecipeDetail";

const RecipeList: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const itemsPerPage = 10; // Number of recipes per page
  const [data, setData] = useState<any[]>([]); // State to store recipe data
  const [isLoading, setIsLoading] = useState(false); // Loading state for pagination
  const [page, setPage] = useState(1); // Current page for pagination
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null); // Selected recipe for modal

  // Function to fetch more data for pagination
  useEffect(() => {
    fetchMoreData();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Fetch more data (pagination logic)
  const fetchMoreData = () => {
    if (isLoading) return;
    setIsLoading(true);

    setTimeout(() => {
      const startIndex = (page - 1) * itemsPerPage;
      const newRecipes = recipesData.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      if (newRecipes.length > 0) {
        setData((prevData) => [...prevData, ...newRecipes]);
        setPage((prevPage) => prevPage + 1);
      }
      setIsLoading(false);
    }, 1500); // Simulate a delay to fetch more data
  };

  // Filter recipes based on the search query
  const filteredData = data.filter((item) => {
    const recipe = item.recipe;
    return (
      recipe.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredientLines.some((ingredient: string) =>
        ingredient.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      recipe.mealType.some((meal: string) =>
        meal.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  // Open the modal to show recipe details
  const openModal = (recipe: any) => {
    setSelectedRecipe(recipe);
    setIsModalVisible(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedRecipe(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.recipe.label} // Use the recipe label as the key
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item.recipe}
            onPress={() => openModal(item.recipe)}
          />
        )}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal to display RecipeDetail */}
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
    display: "flex",
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#f8f8f8",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default RecipeList;
