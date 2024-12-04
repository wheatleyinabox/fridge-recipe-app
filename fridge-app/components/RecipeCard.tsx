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
    display: "flex",
    flexDirection: "row",
    width: 315,
    height: 115,
    backgroundColor: Colors.light.primary,
    marginVertical: 8, // Optional: Add spacing between cards
    borderRadius: 10, // Optional: Rounded corners for cards
    shadowColor: "#000", // Optional: Adding shadow for better card visibility
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    flex: 1,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10, // Optional: Add border radius to image
  },
  textContainer: {
    display: "flex",
    flex: 2,
    margin: 10,
    justifyContent: "space-between",
  },
  textTitle: {
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333", // Optional: Set title color
  },
  textDescription: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 2,
  },
  calories: {
    fontSize: 16,
    color: "#555",
  },
  mealType: {
    fontSize: 16,
    color: "#555", // Optional: Adjust color for better readability
  },
  viewFullRecipe: {
    flex: 1,
    justifyContent: "flex-end",
  },
  viewFullRecipeText: {
    borderBottomColor: "#007BFF", // Color for the link effect
    borderBottomWidth: 1,
    color: "#007BFF", // Add color to text for link styling
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default RecipeCard;
