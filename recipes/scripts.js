async function searchRecipes() {
    const ingredients = document.getElementById('ingredients').value;
    const response = await fetch(`http://localhost:5000/recipes/${ingredients}`);
    const apiRecipes = await response.json();

    // Format data for frontend without altering original backend logic
    const formattedData = apiRecipes.map(recipe => ({
        label: recipe.label,
        image: recipe.image,
        calories: Math.round(recipe.calories),
        mealType: recipe.mealType.join(', '),
        ingredientLines: recipe.ingredientLines,
        url: recipe.url
    }));

    const remainingIngredients = CheckRemainingIngredients(formattedData, ingredients);

    const finalList = await getMLOutputs(remainingIngredients, formattedData);
    displayResults(finalList);
}

function displayResults(recipes) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
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

// Function to get ML outputs based on remaining ingredients
async function getMLOutputs(remainingIngredients, apiRecipes) {
    try {
        // Convert remaining ingredients to a query string
        const ingredientsList = remainingIngredients
            .map(ri => ri.missingIngredients.join(', '))
            .join(', ');

        // Call the ML model to suggest recipes
        const response = await fetch(`http://localhost:5001/recipes?ingredients=${ingredientsList}`);
        const mlData = await response.json();

        // Combine original API recipes with ML-based suggestions
        const mlRecipes = mlData.map(mlRecipe => ({
            label: mlRecipe.label,
            image: mlRecipe.image,
            calories: Math.round(mlRecipe.calories),
            mealType: mlRecipe.mealType.join(', '),
            ingredientLines: mlRecipe.ingredientLines,
            url: mlRecipe.url
        }));

        return [...apiRecipes, ...mlRecipes];
    } catch (error) {
        console.error("Error generating ML-based recipes:", error);
        return apiRecipes; // Fallback to original recipes if ML API fails
    }
}
