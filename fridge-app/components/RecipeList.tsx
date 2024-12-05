import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Text,
  Dimensions,
} from "react-native";

import RecipeCard from "./RecipeCard";
import recipesData from "../app/RecipeData.json";
import RecipeDetail from "./RecipeDetail";
import MasonryList from "@danielprr-react-native/animated-scrollview-masonry-list"; // Import MasonryList

const { width } = Dimensions.get("window");

const RecipeList: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const itemsPerPage = 10; // Number of recipes per page
  const [data, setData] = useState<any[]>([]); // State to store recipe data
  const [isLoading, setIsLoading] = useState(false); // Loading state for pagination
  const [page, setPage] = useState(1); // Current page for pagination
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null); // Selected recipe for modal
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

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

  // Handle refresh (reset pagination and data)
  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setData([]); // Clear current data to simulate fetching fresh data
    fetchMoreData(); // Fetch new data after reset
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <MasonryList
        data={filteredData}
        keyExtractor={(item) => item.recipe.label}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <RecipeCard
              recipe={item.recipe}
              onPress={() => openModal(item.recipe)}
            />
          </View>
        )}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.5}
        numColumns={2} // 2 columns in the grid
        onRefresh={handleRefresh} // Handle pull-to-refresh
        refreshing={refreshing} // Show refresh indicator when refreshing
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No recipes found</Text>
          </View>
        }
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 20,
        }}
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
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#f8f8f8",
  },
  cardContainer: {
    width: (width - 30) / 2, // Adjust the card width dynamically to fit two items per row
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default RecipeList;
