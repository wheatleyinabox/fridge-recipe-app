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
import RecipeDetail from "./RecipeDetail";
import MasonryList from "@danielprr-react-native/animated-scrollview-masonry-list";

const { width } = Dimensions.get("window");

const RecipeList: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  const fetchRecipes = async (endpoint: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoint);
      const json = await response.json();
      const recipes = json.map((item: any) => item.recipe);
      setData(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch random recipes initially
    fetchRecipes("http://192.168.1.225:5000/random-recipes/?count=20");
  }, []);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      if (searchQuery.trim() === "") {
        // Fetch random recipes if search query is empty
        fetchRecipes("http://192.168.1.225:5000/random-recipes/?count=20");
      } else {
        // Fetch recipes matching the search query
        fetchRecipes(
          `http://192.168.1.225:5000/recipes/${encodeURIComponent(
            searchQuery
          )}`
        );
      }
    }, 500); // Debounce time in milliseconds

    return () => clearTimeout(debounceFetch); // Cleanup debounce
  }, [searchQuery]);

  const openModal = (recipe: any) => {
    setSelectedRecipe(recipe);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedRecipe(null);
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MasonryList
        data={data}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <RecipeCard recipe={item} onPress={() => openModal(item)} />
          </View>
        )}
        numColumns={2}
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
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flex: 1,
    margin: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecipeList;
