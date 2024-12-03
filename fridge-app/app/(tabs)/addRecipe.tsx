import React, { useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const AddRecipe: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // Sample recipe data with missing fields to match the backend schema
  const recipe = {
    label: "Shredded Chicken",
    image: "https://edamam-product-images.s3.amazonaws.com/web-img/f98/f98cb99f615f7cc0ec01c033e9ff72ec.jpg",
    url: "https://example.com/recipe-url", // Placeholder URL
    ingredients: [
      "chicken breast",
      "olive oil",
      "garlic powder",
    ],
    calories: 400, // Placeholder calories
    mealType: "Dinner" // Placeholder meal type
  };

  // Function to send POST request to add the recipe to the database
  const addRecipeToDatabase = async () => {
    setLoading(true);
    try {
      // Send the recipe data to the backend to store in the database
      const response = await axios.post('http://192.168.1.225/recipes', recipe);

      if (response.status === 200) {
        Alert.alert('Success', 'Recipe has been added to the database!');
      } else {
        Alert.alert('Error', 'Failed to add the recipe.');
      }
    } catch (err) {
      console.error('Error adding recipe:', err);
      Alert.alert('Error', 'There was an issue adding the recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Add Recipe</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Add Recipe to Database" onPress={addRecipeToDatabase} />
      )}
    </View>
  );
};

export default AddRecipe;