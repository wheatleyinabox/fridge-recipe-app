document.getElementById('testFinalRecipeGeneratorButton').addEventListener('click', function() {
    const ingredients = document.getElementById('ingredients').value;  // Get the ingredients from the input field
    const query = encodeURIComponent(ingredients); // Prepare the query string

    // Fetch data from the API
    fetch(`http://localhost:5001/recipes/${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();  // Assuming the response is JSON
        })
        .then(data => {
            console.log("API Response: ", data);  // Log the raw response for debugging

            if (Array.isArray(data)) {
                const finalRecipes = finalRecipeGenerator(data, ingredients); // Pass the recipes data and ingredients
                // Display the final recipes
                document.getElementById('finalRecipes').innerHTML = finalRecipes;
            } else {
                throw new Error('API response is not an array of recipes');
            }
        })
        .catch(error => {
            console.error('Error:', error);  // Log the error for debugging
            document.getElementById('finalRecipes').textContent = 'Error: ' + error.message;
        });
});

// Final Recipe Generator function to process API response
function finalRecipeGenerator(apiRecipes, ingredientsInput) {
    const ingredients = ingredientsInput.split(',').map(i => i.trim().toLowerCase());  // Normalize the input ingredients
    const remainingIngredients = CheckRemainingIngredients(apiRecipes, ingredients);
    return getMLOutputs(remainingIngredients, apiRecipes, ingredients);
}

// Check remaining ingredients function
function CheckRemainingIngredients(apiRecipes, ingredients) {
    return apiRecipes.filter(recipe => 
        recipe.ingredients && Array.isArray(recipe.ingredients) &&
        recipe.ingredients.some(ingredient => ingredients.includes(ingredient.food.toLowerCase()))
    );
}

function getMLOutputs(remainingIngredients, apiRecipes, inputIngredients) {
    // Process each recipe to find missing ingredients
    const missingIngredients = apiRecipes.map(recipe => {
        // Ensure recipe and ingredients exist
        if (!recipe || !recipe.recipe.ingredients) {
            console.log('Skipping recipe without ingredients:', recipe);
            return null;  // Skip recipes with no ingredients
        }

        // Convert recipe ingredients to lowercase for consistent comparison
        const recipeIngredients = recipe.recipe.ingredients.map(ingredient => ingredient.food.toLowerCase());

        // Find missing ingredients by filtering out those that are in the input ingredients
        const missing = recipeIngredients.filter(ingredient => 
            !inputIngredients.some(input => input.toLowerCase() === ingredient)
        );

        // Only return recipes with missing ingredients
        if (missing.length > 0) {
            return { 
                recipeTitle: recipe.recipe.label, 
                allIngredients: recipeIngredients, 
                missingIngredients: missing 
            };
        }

        return null;  // Return null if no ingredients are missing
    }).filter(recipe => recipe !== null);  // Remove null entries from the final list

    // Create a readable output listing all ingredients and the missing ones
    const formattedMissingIngredients = missingIngredients.map(recipe => {
        return `${recipe.recipeTitle}:\nAll Ingredients: ${recipe.allIngredients.join(', ')}\nMissing Ingredients: ${recipe.missingIngredients.join(', ')}\n`;
    }).join('\n');

    // Log and display the missing ingredients
    console.log("All Missing Ingredients: ", formattedMissingIngredients);
    document.getElementById('remainingIngredients').textContent = formattedMissingIngredients || "No missing ingredients.";
}



