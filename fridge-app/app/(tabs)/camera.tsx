import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [savedImageUri, setSavedImageUri] = useState("");

  const selectImage = async () => {
    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!image.canceled) {
      const uri = image.assets[0].uri;
      setSavedImageUri(uri);
      openModal();

      // Call the upload function here
      await uploadImage(uri);
    } else {
      setModalTitle("Failure");
      openModal();
    }
  };

  const mapMealType = (originalMealTypes: string[]): string[] => {
    return originalMealTypes.map((meal) => {
      switch (meal.toLowerCase()) {
        case 'breakfast':
        case 'brunch':
          return 'Breakfast';
        case 'snack':
        case 'teatime':
          return 'Lunch';
        case 'lunch/dinner':
          return Math.random() < 0.5 ? 'Lunch' : 'Dinner';
        default:
          return 'Lunch'; // Default to 'Lunch' if mealType is unrecognized
      }
    });
  };

  const saveRecipesToDatabase = async (recipes) => {
    for (const recipeData of recipes) {
      const recipe = recipeData.recipe || recipeData;
      const mappedMealTypes = mapMealType(recipe.mealType || ['lunch/dinner']);

      const recipeToSave = {
        label: recipe.label,
        image: recipe.image,
        url: recipe.url,
        ingredientLines: recipe.ingredientLines,
        calories: recipe.calories,
        mealType: mappedMealTypes[0],
      };

      try {
        const response = await fetch(`http://10.110.251.114:5000/recipesAdd`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recipeToSave),
        });

        if (!response.ok) {
          console.error('Error saving recipe:', response.statusText);
        }
      } catch (error) {
        console.error('Error saving recipe:', error);
      }
    }
  };

  // Function to upload image to backend
  const uploadImage = async (uri: string) => {
    try {
      const fileName = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(fileName || '');
      const fileType = match ? `image/${match[1]}` : `image`;

      // Create a new FormData object
      const formData = new FormData();
      formData.append('image', {
        uri,
        name: fileName,
        type: fileType,
      });

      // Send POST request to backend
      const ingredientsRaw = await fetch('http://10.110.251.114:5000/scanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const ingredientsJson = await ingredientsRaw.json();
      console.log('Response from backend:', ingredientsJson);

      const parsedIngredients = parseIngredients(ingredientsJson.result);
      console.log('Parsed Ingredients:', parsedIngredients);

      const recipesRaw = await fetch(`http://10.110.251.114:5000/recipes/${parsedIngredients}`);
      const recipesJson = await recipesRaw.json();

      console.log('Returned Ingredients', recipesJson);

      await saveRecipesToDatabase(recipesJson);

      console.log('Saved to Database');

      setModalTitle("Success");
    } catch (error) {
      console.error("Error uploading image:", error);
      setModalTitle("Failure");
    }
  };

  // copied over from scripts.js lol
  const parseIngredients = (result) => {
    // Assuming the result is in the format "count;item"
    const lines = result.trim().split('\n');
    const ingredients = lines.map(line => {
      const parts = line.split(';');
      return parts[1] ? parts[1].trim() : '';
    });
    return ingredients.filter(ingredient => ingredient).join(',');
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.title}>Need to scan something?</Text>
      </View>

      <Text style={styles.text}>
        Upload your image here and we'll do the rest!
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={selectImage}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </Pressable>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalText}>
              {modalTitle === "Success"
                ? "Image uploaded successfully!"
                : "Loading..."}
            </Text>

            {savedImageUri ? (
              <Image source={{ uri: savedImageUri }} style={styles.image} />
            ) : null}

            <TouchableOpacity onPress={closeModal} style={styles.button}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "25%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  banner: {
    width: '100%',
    padding: 20,
    backgroundColor: "#5B795D",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  text: {
    margin: 20,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#5B795D",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});