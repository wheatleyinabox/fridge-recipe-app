import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  Modal,
  TouchableOpacity,
  Linking, // Import Linking
  Dimensions,
} from "react-native";
import HoverableButton from "./HoverButton";
import axios from "axios"
const { width } = Dimensions.get("window");

const RecipeDetail: React.FC<{ recipe: any; onClose: () => void }> = ({
  recipe,
  onClose,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("");

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Recipe details not available.</Text>
        <Button title="Close" onPress={onClose} />
      </View>
    );
  }

  const imageSource = { uri: recipe.image };

  const saveRecipe = async () => {
    if (selectedMealType) {
      const recipeToSave = {
        label: recipe.label,
        image: recipe.image,
        url: recipe.url,
        ingredientLines: recipe.ingredientLines,
        calories: recipe.calories,
        mealType: selectedMealType,
      };

      try {
        const response = await axios.post(
          "http://192.168.1.225:5000/recipesAdd",
          recipeToSave
        );

        if (response.status === 200) {
          Alert.alert(
            "Success",
            `${recipe.label} saved as ${selectedMealType} meal.`,
            [{ text: "OK", onPress: () => setModalVisible(false) }]
          );
        }
      } catch (error) {
        console.error("Error saving recipe:", error.message);
        Alert.alert("Error", "Failed to save the recipe. Please try again.");
      }
    } else {
      setModalVisible(true);
      Alert.alert("Select Meal Type", "Please select a meal type to proceed.");
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.title}>{recipe.label}</Text>
      <Text style={styles.calories}>{recipe.calories.toFixed(0)} calories</Text>
      <Text style={styles.mealType}>Meal Type: {recipe.mealType}</Text>
      <Text style={styles.sectionTitle}>Ingredients:</Text>
      {recipe.ingredientLines.map((ingredient: string, index: number) => (
        <Text key={index} style={styles.ingredient}>
          • {ingredient}
        </Text>
      ))}
      <TouchableOpacity onPress={() => handleLinkPress(recipe.url)}>
        <Text style={styles.url}>View Full Recipe</Text>
      </TouchableOpacity>
      <HoverableButton title="Close" onPress={onClose} />
      <HoverableButton
        title="Save Recipe!"
        onPress={() => setModalVisible(true)}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Meal Type</Text>
            <TouchableOpacity
              style={styles.mealTypeButton}
              onPress={() => setSelectedMealType("Breakfast")}
            >
              <Text style={styles.mealTypeText}>Breakfast</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mealTypeButton}
              onPress={() => setSelectedMealType("Lunch")}
            >
              <Text style={styles.mealTypeText}>Lunch</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mealTypeButton}
              onPress={() => setSelectedMealType("Dinner")}
            >
              <Text style={styles.mealTypeText}>Dinner</Text>
            </TouchableOpacity>
            <View style={styles.modalButtons}>
              <Button title="Save" onPress={saveRecipe} color="green" />
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color="red"
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: "#f8f8f8", // A soft background color that is easy on the eyes
  },
  image: {
    width: "95%",
    height: 300, // Larger image for better visual impact
    borderRadius: 15,
    padding: 20,
    alignSelf: "center",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  mealTypeButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  mealTypeText: { fontSize: 16, fontWeight: "bold" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
});

export default RecipeDetail;
