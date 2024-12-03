

// Function to search recipes based on ingredients
async function searchRecipes() {
    const ingredients = document.getElementById('ingredients').value;
    const response = await fetch(`http://localhost:5000/recipes/${ingredients}`);
    const data = await response.json();

    // Format data for frontend without altering original backend logic
    const formattedData = data.map(recipe => ({
        label: recipe.label,
        image: recipe.image,
        calories: Math.round(recipe.calories),
        mealType: recipe.mealType.join(', '),
        ingredientLines: recipe.ingredientLines,
        url: recipe.url
    }));
    finalList = finalRecipeGenerator(formattedData);
    displayResults(finalList);
}

//modify just this function first 
function displayResults(recipes) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    // Ensure the data is in the expected format before rendering
    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';
        recipeDiv.innerHTML = `
            <h3>${recipe.label}</h3>
            <img src="${recipe.image}" alt="${recipe.label}" style="width: 100px; height: 100px;">
            <p><strong>Ingredients:</strong></p>
            <ul>
                ${recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <p><strong>Calories:</strong> ${Math.round(recipe.calories)}</p>
            <p><strong>Meal Type:</strong> ${recipe.mealType}</p>
            <p><strong>Directions:</strong> <a href="${recipe.url}" target="_blank">Recipe Link</a></p>
        `;
        resultsDiv.appendChild(recipeDiv);
    });
}



async function showRandomRecipes(count = 5) {
    const randomRecipesContainer = document.getElementById('random-recipes');
    randomRecipesContainer.innerHTML = ''; // Clear previous results

    try {
        const response = await fetch(`http://localhost:5000/random-recipes?count=${count}`);
        const recipes = await response.json();
        displayRandomRecipes(recipes);
    } catch (error) {
        console.error('Error fetching random recipes:', error);
    }
}

function displayRandomRecipes(recipes) {
    const randomRecipesContainer = document.getElementById('random-recipes');
    randomRecipesContainer.innerHTML = ''; // Clear previous results

    const infoElement = document.createElement('div');
    infoElement.className = 'info';
    infoElement.innerHTML = `<p>Showing ${recipes.length} random recipes</p>`;
    randomRecipesContainer.appendChild(infoElement);

    recipes.forEach(recipeData => {
        const recipe = recipeData.recipe;
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';
        recipeDiv.innerHTML = `
            <h3>${recipe.label}</h3>
            <img src="${recipe.image}" alt="${recipe.label}" style="width: 100px; height: 100px;">
            <p><strong>Ingredients:</strong></p>
            <ul>
                ${recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <p><strong>Calories:</strong> ${Math.round(recipe.calories)}</p>
            <p><strong>Meal Type:</strong> ${recipe.mealType.join(', ')}</p>
            <p><strong>Directions:</strong> <a href="${recipe.url}" target="_blank">Recipe Link</a></p>
        `;
        randomRecipesContainer.appendChild(recipeDiv);
    });
}

function finalRecipeGenerator(apiRecipes){
    const remainingIngredients = CheckRemainingIngredients(apiRecipes, ingredients);
    finalRecipes = getMLOutputs(remainingIngredients, apiRecipes);
    return finalRecipes;
}

//Scanner for the image 
async function scanImage() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image file.');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('http://localhost:5000/scanner', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        // Use the result to search for recipes
        const ingredients = parseIngredients(data.result);

        document.getElementById('ingredients').value = ingredients;

    } catch (error) {
        console.error('Error scanning image:', error);
    }
}

function parseIngredients(result) {
    // Assuming the result is in the format "count;item"
    const lines = result.trim().split('\n');
    const ingredients = lines.map(line => {
        const parts = line.split(';');
        return parts[1] ? parts[1].trim() : '';
    });
    return ingredients.filter(ingredient => ingredient).join(',');
}

// Function to check remaining ingredients based on user's input
function CheckRemainingIngredients(apiRecipes, ingredients) {
    const userIngredients = ingredients.toLowerCase().split(',').map(ing => ing.trim());
    // For each recipe, determine missing ingredients without changing original check logic
    return apiRecipes.map(recipe => {
        const missingIngredients = recipe.ingredientLines.filter(
            ingredient => !userIngredients.some(userIng => ingredient.toLowerCase().includes(userIng))
        );
        return { recipe, missingIngredients };
    });
}

async function getMLOutputs(remainingIngredients, apiRecipes) {
    try {
        // Convert remaining ingredients to a query string
        const ingredientsList = remainingIngredients.map(ri => ri.ingredient).join(', ');

        // Call the ML model to suggest recipes
        const response = await fetch(`http://localhost:5000/recipes/${ingredientsList}apiRecipes=${apiRecipes}`);

        const data = await response.json();

        // Assuming data contains the recipe suggestions from the ML model
        const generatedRecipes = data.recipe;

        // Further process if needed to integrate with `apiRecipes`
        console.log("ML-generated Recipes:", generatedRecipes);
        return generatedRecipes;
    } catch (error) {
        console.error("Error generating ML-based recipes:", error);
        return [];
    }
}