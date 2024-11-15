import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";

const RecipeCard: React.FC<{ recipe: any; onPress: () => void }> = ({
  recipe,
  onPress,
}) => {
  const imageSource = require("../assets/images/turkey_picacata.png");

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
          <Text style={styles.calories}>{recipe.calories} calories</Text>
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
  },
  imageContainer: { flex: 1, margin: 10 },
  image: { width: "100%", height: 100 },
  textContainer: {
    display: "flex",
    flex: 2,
    margin: 10,
  },
  textTitle: { alignItems: "flex-start", flex: 1 },
  title: { fontSize: 15, fontWeight: "bold" },
  textDescription: {
    display: "flex",
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  calories: { fontSize: 16, color: "#555" },
  mealType: { fontSize: 16 },
  viewFullRecipe: { flex: 1, justifyContent: "flex-end" },
  viewFullRecipeText: { borderBottomColor: "#000" },
});

export default RecipeCard;
