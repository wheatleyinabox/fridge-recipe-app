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
  const itemsPerPage = 10;
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  useEffect(() => {
    fetchMoreData();
  }, []);

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
    }, 1500);
  };

  const filteredData = data.filter((recipe) =>
    recipe.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (recipe: any) => {
    setSelectedRecipe(recipe);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedRecipe(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} onPress={() => openModal(item)} />
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
    paddingHorizontal: 10,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    padding: 20,
  },
});

export default RecipeList;
