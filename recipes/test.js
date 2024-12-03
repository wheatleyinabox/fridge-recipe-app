// Mock data
const mockRecipes = [
    {
        label: "Pancakes",
        ingredientLines: ["eggs", "milk", "flour", "sugar"],
        calories: 500,
        mealType: ["Breakfast"],
        image: "pancake.jpg",
        url: "https://example.com/pancakes"
    },
    {
        label: "Omelette",
        ingredientLines: ["eggs", "milk", "cheese"],
        calories: 300,
        mealType: ["Breakfast"],
        image: "omelette.jpg",
        url: "https://example.com/omelette"
    }
];

// Function to check remaining ingredients (missing ingredients only)
function CheckRemainingIngredients(apiRecipes, ingredients) {
    const userIngredients = ingredients.toLowerCase().split(',').map(ing => ing.trim());
    return apiRecipes.map(recipe => {
        const missingIngredients = recipe.ingredientLines.filter(
            ingredient => !userIngredients.some(userIng => ingredient.toLowerCase().includes(userIng))
        );
        return { missingIngredients }; // Return only the missing ingredients
    });
}

// Mock function for getMLOutputs (for final recipe generation)
function getMLOutputs(remainingIngredients, apiRecipes) {
    return remainingIngredients.map((item, index) => {
        return {
            recipe: apiRecipes[index], // Include full recipe
            missingIngredients: item.missingIngredients // Missing ingredients
        };
    });
}

// Function to generate final recipes (full recipe + missing ingredients)
function finalRecipeGenerator(apiRecipes, ingredients) {
    const remainingIngredients = CheckRemainingIngredients(apiRecipes, ingredients);  // Get remaining ingredients
    // Return full recipes along with missing ingredients
    return getMLOutputs(remainingIngredients, apiRecipes);
}

// Testing Remaining Ingredients (Only missing ingredients)
document.getElementById('testRemainingIngredientsButton').addEventListener('click', () => {
    const ingredients = document.getElementById('ingredients').value;
    const result = CheckRemainingIngredients(mockRecipes, ingredients);  // Get missing ingredients for each recipe
    // Display only missing ingredients
    document.getElementById('remainingIngredients').innerText = JSON.stringify(result, null, 2);
});

// Testing Final Recipe Generator (Full recipe + missing ingredients)
document.getElementById('testFinalRecipeGeneratorButton').addEventListener('click', () => {
    const ingredients = document.getElementById('ingredients').value;
    const finalRecipes = finalRecipeGenerator(mockRecipes, ingredients);  // Generate final recipes with missing ingredients
    // Display the final recipes with both full ingredient list and missing ingredients
    document.getElementById('finalRecipes').innerText = JSON.stringify(finalRecipes, null, 2);
});
