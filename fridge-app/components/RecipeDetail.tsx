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

  const saveRecipe = () => {
    if (selectedMealType) {
      recipe.userSelectedMealType = selectedMealType;

      // Simulate updating the JSON file (replace with actual update logic)
      Alert.alert(
        "Success",
        `${recipe.label} saved as ${selectedMealType} meal.`,
        [{ text: "OK", onPress: () => setModalVisible(false) }]
      );
    } else {
      // If no meal type is selected, prompt the user to select one
      setModalVisible(true);
      Alert.alert("Select Meal Type", "Please select a meal type to proceed.");
    }
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL", err)
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.title}>{recipe.label}</Text>
      <View style={styles.subInfo}>
        <Text style={styles.calories}>
          {recipe.calories.toFixed(0)} calories
        </Text>
        <Text style={styles.mealType}>Meal Type: {recipe.mealType}</Text>
      </View>
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
            <HoverableButton
              title="Breakfast"
              onPress={() => setSelectedMealType("Breakfast")}
            />

            <HoverableButton
              title="Lunch"
              onPress={() => setSelectedMealType("Lunch")}
            />
            <HoverableButton
              title="Dinner"
              onPress={() => setSelectedMealType("Dinner")}
            />
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
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  subInfo: { flexDirection: "row-reverse", justifyContent: "space-evenly" },
  calories: {
    fontSize: 18,
    color: "#555", // Slightly lighter color to differentiate it from the title
    textAlign: "center", // Centers the calories text
    marginBottom: 10,
  },
  mealType: {
    fontSize: 18,
    color: "#555", // Slightly lighter color to differentiate it from the title
    textAlign: "center", // Centers the calories text
    marginBottom: 10,
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
    marginVertical: 3,
    lineHeight: 24, // More space between lines for readability
    paddingLeft: 20, // Indented to show it's a list
  },
  url: {
    fontSize: 16,
    color: "#007BFF", // A clickable blue color for URLs
    margin: 20,
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
