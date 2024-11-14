import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import RecipeCard from "./RecipeCard"; // Adjust path based on where RecipeCard is located
import recipesData from "../app/RecipeData.json"; // Import recipes data

const RecipeList: React.FC = ({ searchQuery }) => {
  const itemsPerPage = 10; // Number of recipes to load per scroll
  const [data, setData] = useState<any[]>([]); // The data to display in the list
  const [isLoading, setIsLoading] = useState(false); // Loading state for pagination
  const [page, setPage] = useState(1); // Current page for loading more data

  // Fetch the initial set of data when the component mounts
  useEffect(() => {
    fetchMoreData();
  }, []);

  // Function to fetch more data when the user reaches the end of the list
  const fetchMoreData = () => {
    if (isLoading) return; // Prevent fetching if data is already loading

    setIsLoading(true);

    // Simulate loading data with a timeout (replace with actual API fetch if needed)
    setTimeout(() => {
      const startIndex = (page - 1) * itemsPerPage;
      const newRecipes = recipesData.slice(
        startIndex,
        startIndex + itemsPerPage
      ); // Get the next chunk of recipes

      if (newRecipes.length > 0) {
        console.log("New Recipes Loaded:", newRecipes); // Debugging line
        setData((prevData) => [...prevData, ...newRecipes]); // Append new recipes
        setPage((prevPage) => prevPage + 1); // Increment the page number for next data load
      }
      setIsLoading(false); // Stop loading spinner
    }, 1500); // Simulate loading delay
  };

  // Filter recipes based on the search query
  const filteredData = data.filter((recipe) =>
    recipe.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredData} // List of recipes
        keyExtractor={(item) => item.label} // Unique key for each recipe
        renderItem={({ item }) => <RecipeCard recipe={item} />} // Render each recipe card
        onEndReached={fetchMoreData} // Trigger when the user reaches the end
        onEndReachedThreshold={0.5} // Trigger when 50% of the list is visible
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        } // Show loading spinner when fetching more data
        // Added this style for testing scrollable area
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    paddingHorizontal: 10, // Optional: Add padding on sides as well
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
});

export default RecipeList;
