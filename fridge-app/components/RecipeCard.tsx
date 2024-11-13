import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
// Assuming the image is imported correctly

const RecipeCard: React.FC<{ recipe: any }> = ({ recipe }) => {
  const imageSource = require("../assets/images/turkey_picacata.png");

  return (
    <Link
      href={{
        pathname: "/RecipeDetail",
        params: { recipe: JSON.stringify(recipe) },
      }}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{recipe.label}</Text>
          <Text style={styles.calories}>{recipe.calories} calories</Text>
          <Text style={styles.mealType}>{recipe.mealType}</Text>
        </View>
      </View>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "row",
    width: 315,
    height: 115,
    backgroundColor: "green",
    marginBottom: 20,
  },

  imageContainer: { flex: 1, margin: 10 },
  image: {
    width: "100%",
    height: 100,
    padding: 10,
  },
  textContainer: {
    display: "flex",
    alignItems: "flex-end",
    flex: 2,
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  calories: {
    fontSize: 16,
    color: "#555",
  },
  mealType: { fontSize: 13 },
});

export default RecipeCard;
