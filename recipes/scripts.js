async function searchRecipes() {
    const ingredients = document.getElementById('ingredients').value;
    const response = await fetch(`http://localhost:5000/recipes/${ingredients}`);
    const data = await response.json();
    displayResults(data);
}

function cleanRecipes(recipes) {

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
            <p><strong>Directions:</strong> <a href="${recipe.url}" target="_blank">Recipe Link</a></p>
        `;
        resultsDiv.appendChild(recipeDiv);
    });
}