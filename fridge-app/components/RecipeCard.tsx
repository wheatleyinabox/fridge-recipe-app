import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";

// Define the type for the recipe prop
interface Recipe {
  label: string;
  image: string; // Assuming the image is a URL or static path
  mealType: string;
  calories: number;
}

const RecipeCard: React.FC<{ recipe: Recipe; onPress: () => void }> = ({
  recipe,
  onPress,
}) => {
  // Dynamic image source
  const imageSource = { uri: recipe.image };

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.textTitle}>
          <Text style={styles.title}>{recipe.label}</Text>
        </View>
        <View style={styles.textDescription}>
          <Text style={styles.mealType}>{recipe.mealType}</Text>
          <Text style={styles.calories}>
            {recipe.calories.toFixed(0)} calories
          </Text>
        </View>
        <View style={styles.viewFullRecipe}>
          <Text style={styles.viewFullRecipeText}>View Full Recipe</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%", // Card takes full width of its parent
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden", // Ensure content doesn't spill
  },
  imageContainer: {
    width: "100%",
    height: 120,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    padding: 10,
    alignItems: "flex-start", // Ensure text aligns to the top
  },
  textTitle: {},
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  textDescription: {},
  mealType: {
    fontSize: 14,
    color: "#555",
  },
  calories: {
    fontSize: 14,
    color: "#555",
  },
  viewFullRecipe: {},
  viewFullRecipeText: {
    marginTop: 5,
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RecipeCard;
