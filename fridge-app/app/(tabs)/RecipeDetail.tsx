import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
const RecipeDetail = () => {
  const { recipe: recipeParam } = useLocalSearchParams();

  // Ensure recipeParam is a string (in case it's an array, use the first element)
  const recipeString = Array.isArray(recipeParam)
    ? recipeParam[0]
    : recipeParam;

  // Initialize recipe as null in case there's an issue with the parameter
  let recipe = null;

  // Check if recipeString is valid and parse it
  try {
    if (recipeString) {
      recipe = JSON.parse(recipeString);
    }
  } catch (error) {
    console.error("Error parsing recipe data:", error);
    Alert.alert("Error", "There was a problem loading the recipe details.");
  }

  // If no recipe data is available, show an error message
  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Recipe details not available.</Text>
      </View>
    );
  }

  const imageSource = require("../../assets/images/turkey_picacata.png");

  return (
    <ScrollView style={styles.container}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.title}>{recipe.label}</Text>
      <Text style={styles.calories}>{recipe.calories} calories</Text>
      <Text style={styles.mealType}>Meal Type: {recipe.mealType}</Text>
      <Text style={styles.sectionTitle}>Ingredients:</Text>
      {recipe.ingredientLines.map((ingredient: string, index: number) => (
        <Text key={index} style={styles.ingredient}>
          • {ingredient}
        </Text>
      ))}
      <Text style={styles.sectionTitle}>Full Recipe:</Text>
      <Text style={styles.url}>{recipe.url}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  image: { width: "100%", height: 250, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 10 },
  calories: { fontSize: 18, color: "#666" },
  mealType: { fontSize: 16, color: "#888" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  ingredient: { fontSize: 16, color: "#555", marginVertical: 2 },
  url: { fontSize: 14, color: "blue", marginTop: 10 },
  error: { fontSize: 18, color: "red", textAlign: "center", marginTop: 20 },
});

export default RecipeDetail;
