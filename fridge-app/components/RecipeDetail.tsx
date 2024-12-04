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
} from "react-native";

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

  const imageSource = require("../assets/images/turkey_picacata.png");

  const saveRecipe = () => {
    if (selectedMealType) {
      // Update the recipe object
      recipe.userSelectedMealType = selectedMealType;

      // Simulate updating the JSON file (replace with actual update logic)
      Alert.alert(
        "Success",
        `${recipe.label} saved as ${selectedMealType} meal.`,
        [{ text: "OK", onPress: () => setModalVisible(false) }]
      );
    } else {
      Alert.alert("Error", "Please select a meal type.");
    }
  };

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
      <Button title="Save Recipe!" onPress={() => setModalVisible(true)} />

      {/* Modal for selecting meal type */}
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
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  image: { width: "100%", height: 250, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 10 },
  calories: { fontSize: 18, color: "#666" },
  mealType: { fontSize: 16, color: "#888" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  ingredient: { fontSize: 16, color: "#555", marginVertical: 2 },
  url: { fontSize: 14, color: "blue", marginTop: 10 },
  error: { fontSize: 18, color: "red", textAlign: "center", marginTop: 20 },
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
