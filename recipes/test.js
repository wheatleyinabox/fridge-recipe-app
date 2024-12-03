const APP_ID = 'ebf10032';
const APP_KEY = '29824b3239d06e87e823b7448fa383aa';

async function testCheckRemainingIngredients() {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<p>Running CheckRemainingIngredients test...</p>';

    try {
        const ingredients = 'eggs, milk';
        const response = await fetch('http://localhost:5001/recipes/' + ingredients);
        const apiRecipes = await response.json();

        const result = CheckRemainingIngredients(apiRecipes, ingredients);
        outputDiv.innerHTML = '<h2>CheckRemainingIngredients Results</h2>' +
            result.map(({ recipe, missingIngredients }) => `
                <div class="recipe">
                    <h3>${recipe.label}</h3>
                    <p><strong>Missing Ingredients:</strong> ${missingIngredients.join(', ')}</p>
                </div>
            `).join('');
    } catch (error) {
        console.error('Error:', error);
        outputDiv.innerHTML = `<p>Error running test: ${error.message}</p>`;
    }
}

async function testFinalRecipeGenerator() {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<p>Running FinalRecipeGenerator test...</p>';

    try {
        const ingredients = 'eggs, milk';
        const response = await fetch('http://localhost:5001/recipes/' + ingredients);
        const apiRecipes = await response.json();

        const remainingIngredients = CheckRemainingIngredients(apiRecipes, ingredients);
        const finalRecipes = finalRecipeGenerator(apiRecipes);

        outputDiv.innerHTML = '<h2>FinalRecipeGenerator Results</h2>' +
            finalRecipes.map(recipe => `
                <div class="recipe">
                    <h3>${recipe.label}</h3>
                    <p><strong>Calories:</strong> ${recipe.calories}</p>
                </div>
            `).join('');
    } catch (error) {
        console.error('Error:', error);
        outputDiv.innerHTML = `<p>Error running test: ${error.message}</p>`;
    }
}

async function testGetMLOutputs() {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<p>Running GetMLOutputs test...</p>';

    try {
        const ingredients = 'eggs, milk';
        const response = await fetch('http://localhost:5001/recipes/' + ingredients);
        const apiRecipes = await response.json();

        const remainingIngredients = CheckRemainingIngredients(apiRecipes, ingredients);
        const mlRecipes = await getMLOutputs(remainingIngredients, apiRecipes);

        outputDiv.innerHTML = '<h2>GetMLOutputs Results</h2>' +
            mlRecipes.map(recipe => `
                <div class="recipe">
                    <h3>${recipe.label}</h3>
                    <p><strong>Calories:</strong> ${recipe.calories}</p>
                </div>
            `).join('');
    } catch (error) {
        console.error('Error:', error);
        outputDiv.innerHTML = `<p>Error running test: ${error.message}</p>`;
    }
}

document.getElementById('testCheckRemainingIngredients').addEventListener('click', testCheckRemainingIngredients);
document.getElementById('testFinalRecipeGenerator').addEventListener('click', testFinalRecipeGenerator);
document.getElementById('testGetMLOutputs').addEventListener('click', testGetMLOutputs);
