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
    displayResults(formattedData);
}



/* 
function finalRecipeGenerator(recipes){
    remainingIngredients = CheckRemainingIngredients(apiRecipes, ingredients)
    finalRecipes = getMLOutputs(remainingIngredients, apiRecipes)
    // when checkOkayClick(buttonValue) is true :
    //  finalWeeklyList = checkIfRecipeSelected(checkboxValList, finalRecipes)
    // MakeFinalWeeklyList(finalWeeklyList)
}
*/


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
        const response = await fetch(`http://localhost:5000/recipes/${ingredientsList}`);
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


  

function checkOkayClick(buttonValue){
    return buttonValue === 'okay';
}

//if recipe is selected ie has a value of 1 in hashmap then add it to weeklyList 
    // return FinalWeeklyList

// Function to filter selected recipes for weekly planning
function checkIfRecipeSelected(checkboxValList, finalRecipes) {
    const selectedRecipes = [];
    finalRecipes.forEach((recipe, index) => {
        if (checkboxValList[index]) {
            selectedRecipes.push(recipe);
        }
    });
    return selectedRecipes;
}


// Function to create a final weekly list of recipes
function MakeFinalWeeklyList(finalWeeklyList) {
    const weeklyCalendar = {};
    finalWeeklyList.forEach((recipe, i) => {
        const day = `Day ${i + 1}`;
        weeklyCalendar[day] = recipe;
    });
    console.log("Weekly Calendar:", weeklyCalendar);
    return weeklyCalendar;
}



function displayResults(recipes) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
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
            <p><strong>Calories:</strong> ${recipe.calories}</p>
            <p><strong>Meal Type:</strong> ${recipe.mealType}</p>
            <p><strong>Directions:</strong> <a href="${recipe.url}" target="_blank">Recipe Link</a></p>
        `;
        resultsDiv.appendChild(recipeDiv);
    });
}


// Function to fetch and display random recipes
async function showRandomRecipes(count = 5) {
    const randomRecipesContainer = document.getElementById('random-recipes');
    randomRecipesContainer.innerHTML = ''; // Clear previous results

    try {
        const response = await fetch(`http://localhost:5000/random-recipes?count=${count}`);
        const recipes = await response.json();

        // Format random recipes to match frontend structure
        const formattedRecipes = recipes.map(recipe => ({
            label: recipe.label,
            image: recipe.image,
            calories: Math.round(recipe.calories),
            mealType: recipe.mealType.join(', '),
            ingredientLines: recipe.ingredientLines,
            url: recipe.url
        }));
        displayRandomRecipes(formattedRecipes);
    } catch (error) {
        console.error('Error fetching random recipes:', error);
    }
}
// Function to display random recipes in HTML format
function displayRandomRecipes(recipes) {
    const randomRecipesContainer = document.getElementById('random-recipes');
    randomRecipesContainer.innerHTML = ''; // Clear previous results

    const infoElement = document.createElement('div');
    infoElement.className = 'info';
    infoElement.innerHTML = `<p>Showing ${recipes.length} random recipes</p>`;
    randomRecipesContainer.appendChild(infoElement);

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
            <p><strong>Calories:</strong> ${recipe.calories}</p>
            <p><strong>Meal Type:</strong> ${recipe.mealType}</p>
            <p><strong>Directions:</strong> <a href="${recipe.url}" target="_blank">Recipe Link</a></p>
        `;
        randomRecipesContainer.appendChild(recipeDiv);
    });
}


module.exports = {
    CheckRemainingIngredients,
    getMLOutputs,
    checkOkayClick,
    checkIfRecipeSelected,
    MakeFinalWeeklyList

  };

  