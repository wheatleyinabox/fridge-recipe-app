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

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://10.110.251.114:5000/random-recipes/?count=20");
        const json = await response.json();
        const recipes = json.map((item: any) => item.recipe);
        setData(recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredData = data.filter((recipe) => {
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
        data={filteredData}
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