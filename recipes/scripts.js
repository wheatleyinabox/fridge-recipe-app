async function getAIOutput(ingredients, existingRecipes) {
    try {
        const response = await fetch('http://localhost:5000/ai-recipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients, recipes: existingRecipes }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch AI-generated recipes.');
        }

        const aiRecipes = await response.json();
        return aiRecipes;
    } catch (error) {
        console.error('Error fetching AI recipes:', error);
        return [];
    }
}

async function searchRecipes() {
    const ingredients = document.getElementById('ingredients').value.split(',').map(i => i.trim());
    try {
        const response = await fetch(`http://localhost:5000/recipes/${ingredients.join(',')}`);
        const data = await response.json();

        // Get AI-generated recipes and merge them
        const aiRecipes = await getAIOutput(ingredients, data);
        const finalRecipes = [...data, ...aiRecipes];

        // Display combined results
        displayResults(finalRecipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

function displayResults(recipes) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    recipes.forEach(recipeData => {
        const recipe = recipeData.recipe || recipeData; // Handle different formats
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
            <p><strong>Meal Type:</strong> ${Array.isArray(recipe.mealType) ? recipe.mealType.join(', ') : recipe.mealType}</p>
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