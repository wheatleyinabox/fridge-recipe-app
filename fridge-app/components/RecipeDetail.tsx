import React from "react";
import { Dimensions } from "react-native";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Button,
} from "react-native";

const RecipeDetail: React.FC<{ recipe: any; onClose: () => void }> = ({
  recipe,
  onClose,
}) => {
  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Recipe details not available.</Text>
        <Button title="Close" onPress={onClose} />
      </View>
    );
  }

  const imageSource = require("../assets/images/turkey_picacata.png");

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
      <Button title="Close" onPress={onClose} />
    </ScrollView>
  );
};
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#f8f8f8", // A soft background color that is easy on the eyes
    justifyContent: "center", // Centers content vertically and horizontally
  },
  image: {
    width: "100%",
    height: 300, // Larger image for better visual impact
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: "cover", // Ensures the image covers the space without distortion
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5, // Gives a nice elevation effect for Android
  },
  title: {
    fontSize: 28, // Large title to capture attention
    fontWeight: "700", // Bold title for better prominence
    color: "#333", // Dark text for good contrast
    textAlign: "center", // Centers the title
    marginVertical: 15,
  },
  calories: {
    fontSize: 18,
    color: "#555", // Slightly lighter color to differentiate it from the title
    textAlign: "center", // Centers the calories text
    marginBottom: 10,
  },
  mealType: {
    fontSize: 16,
    color: "#777", // Lighter gray for less important text
    textAlign: "center",
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600", // Slightly bold for sections
    color: "#333",
    marginVertical: 15,
    paddingLeft: 10, // Gives a nice margin from the left
  },
  ingredient: {
    fontSize: 16,
    color: "#555",
    marginVertical: 6,
    lineHeight: 24, // More space between lines for readability
    paddingLeft: 20, // Indented to show it's a list
  },
  url: {
    fontSize: 16,
    color: "#007BFF", // A clickable blue color for URLs
    marginTop: 20,
    textDecorationLine: "underline", // Underlines the URL for clarity
    textAlign: "center", // Centers the URL for a clean look
  },
  error: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold", // Makes the error message stand out more
  },
  button: {
    backgroundColor: "#007BFF", // Bright blue background for visibility
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4, // Shadow effect for a raised button on Android
  },
  buttonText: {
    color: "#fff", // White text for contrast
    fontSize: 16,
    fontWeight: "600", // Medium bold text for better readability
  },
});
// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 10, backgroundColor: "#fff" },
//   image: { width: "100%", height: 250, borderRadius: 10, marginBottom: 10 },
//   title: { fontSize: 22, fontWeight: "bold", marginVertical: 10 },
//   calories: { fontSize: 18, color: "#666" },
//   mealType: { fontSize: 16, color: "#888" },
//   sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
//   ingredient: { fontSize: 16, color: "#555", marginVertical: 2 },
//   url: { fontSize: 14, color: "blue", marginTop: 10 },
//   error: { fontSize: 18, color: "red", textAlign: "center", marginTop: 20 },
// });

export default RecipeDetail;
