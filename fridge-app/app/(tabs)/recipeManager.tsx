import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

interface Recipe {
  label: string;
  image: string;
  url: string;
  ingredients: string[];
  calories: number;
}

export default function RecipeManager() {
  const [query, setQuery] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRecipes = async () => {
    if (!query) {
      Alert.alert('Error', 'Please enter ingredients.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`http://192.168.1.225:5000/recipes/${query}`);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      Alert.alert('Error', 'Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveRecipesToDatabase = async () => {
    try {
      await axios.post('http://192.168.1.225:5000/recipes', recipes);
      Alert.alert('Success', 'Recipes saved to database successfully!');
    } catch (error) {
      console.error('Error saving recipes:', error);
      Alert.alert('Error', 'Failed to save recipes. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Manager</Text>

      {/* Input for ingredients */}
      <TextInput
        style={styles.input}
        placeholder="Enter ingredients (e.g., chicken, onion)"
        value={query}
        onChangeText={setQuery}
      />

      {/* Fetch Recipes Button */}
      <Button title="Fetch Recipes" onPress={fetchRecipes} />

      {/* Save Recipes Button */}
      {recipes.length > 0 && (
        <Button title="Save Recipes to Database" onPress={saveRecipesToDatabase} />
      )}

      {/* Loading Spinner */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {/* Recipe List */}
      {recipes.length > 0 && (
        <FlatList
          data={recipes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.recipe}>
              <Text style={styles.recipeTitle}>{item.label}</Text>
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
              
              <Text>Calories: {item.calories.toFixed(2)}</Text>
            </View>
          )}
        />
      )}

      {/* No Recipes Message */}
      {!loading && recipes.length === 0 && <Text style={styles.message}>No recipes found.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  recipe: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginVertical: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});