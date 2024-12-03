const fetch = require('node-fetch'); // Use require instead of import
const { getMLOutputs, CheckRemainingIngredients, finalRecipeGenerator } = require('./scripts.js'); // Import the actual functions

// Mock recipes for testing
const mockRecipes = [
  {
    label: "Pancakes",
    ingredientLines: ["eggs", "milk", "flour", "sugar"],
  },
  {
    label: "Omelette",
    ingredientLines: ["eggs", "milk", "cheese"],
  },
];

// Define the real API tests
describe('Real API Tests', () => {

  it('should return missing ingredients from the real API', async () => {
    const ingredients = 'flour, eggs';  // Example user input
    const result = await CheckRemainingIngredients(mockRecipes, ingredients);
    
    console.log(result);
    
    expect(result).toHaveLength(2);
    expect(result[0].missingIngredients).toEqual(expect.arrayContaining(['milk', 'sugar']));
  });

  it('should return generated recipes from the ML API', async () => {
    const ingredients = 'flour, eggs';
    const remainingIngredients = mockRecipes.map(recipe => {
      return recipe.ingredientLines.filter(ingredient => !ingredients.includes(ingredient)).map(ingredient => ({ ingredient }));
    });

    const apiRecipes = mockRecipes;

    const ingredientsList = remainingIngredients.map(ri => ri.map(r => r.ingredient).join(', ')).join(', ');
    
    const apiUrl = `http://localhost:5001/recipes/${ingredientsList}?apiRecipes=${JSON.stringify(apiRecipes)}&apiKey=YOUR_API_KEY&appId=YOUR_APP_ID`;
    
    const response = await fetch(apiUrl, { method: 'GET' });
    const data = await response.json();
    
    console.log('ML Generated Recipes:', data);
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('recipe');
    expect(Array.isArray(data.recipe)).toBe(true);
  });

  it('should generate final recipes using the real API and check missing ingredients', async () => {
    const ingredients = 'flour, eggs';
    
    const finalRecipes = await finalRecipeGenerator(mockRecipes, ingredients);
    
    console.log('Final Recipes:', finalRecipes);
    
    expect(finalRecipes).toHaveLength(2);
    expect(finalRecipes[0]).toHaveProperty('recipe');
    expect(finalRecipes[0].remainingIngredients).toBeDefined();
  });
});
