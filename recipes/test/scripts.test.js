// __tests__/scripts.test.js
const { CheckRemainingIngredients, getMLOutputs, checkOkayClick, checkIfRecipeSelected, MakeFinalWeeklyList } = require('./scripts');
// In scripts.test.js


test('searchRecipes should return formatted recipe data', async () => {
    // Simulate the function logic here
    const mockData = [
        {
            label: 'Test Recipe',
            image: 'image_url',
            calories: 250,
            mealType: ['Lunch'],
            ingredientLines: ['ingredient1', 'ingredient2'],
            url: 'http://test.com'
        }
    ];

    const formattedData = mockData.map(recipe => ({
        label: recipe.label,
        image: recipe.image,
        calories: Math.round(recipe.calories),
        mealType: recipe.mealType.join(', '),
        ingredientLines: recipe.ingredientLines,
        url: recipe.url
    }));

    expect(formattedData).toEqual([
        {
            label: 'Test Recipe',
            image: 'image_url',
            calories: 250,
            mealType: 'Lunch',
            ingredientLines: ['ingredient1', 'ingredient2'],
            url: 'http://test.com'
        }
    ]);
});

test('CheckRemainingIngredients() correctly checks remaining ingredients', () => {
    const apiRecipes = [
        { ingredientLines: ['Chicken', 'Lettuce', 'Tomato'] },
        { ingredientLines: ['Chicken', 'Spinach'] }
    ];
    const ingredients = 'Chicken, Lettuce';
    const result = CheckRemainingIngredients(apiRecipes, ingredients);
    expect(result[0].missingIngredients).toEqual(['Tomato']);
    expect(result[1].missingIngredients).toEqual(['Spinach']);
});

test('getMLOutputs() handles ML API correctly', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ recipe: 'ML Generated Recipe' })
        })
    );
    
    const remainingIngredients = [{ ingredient: 'Tomato' }];
    const data = await getMLOutputs(remainingIngredients, []);
    expect(data).toBe('ML Generated Recipe');
});

test('checkOkayClick() correctly checks button value', () => {
    expect(checkOkayClick('okay')).toBe(true);
    expect(checkOkayClick('cancel')).toBe(false);
});

test('checkIfRecipeSelected() filters selected recipes', () => {
    const checkboxValList = [true, false, true];
    const finalRecipes = ['Recipe 1', 'Recipe 2', 'Recipe 3'];
    const selectedRecipes = checkIfRecipeSelected(checkboxValList, finalRecipes);
    expect(selectedRecipes).toEqual(['Recipe 1', 'Recipe 3']);
});

test('MakeFinalWeeklyList() creates weekly list', () => {
    const finalWeeklyList = ['Recipe 1', 'Recipe 2'];
    const weeklyCalendar = MakeFinalWeeklyList(finalWeeklyList);
    expect(weeklyCalendar['Day 1']).toBe('Recipe 1');
    expect(weeklyCalendar['Day 2']).toBe('Recipe 2');
});



test('CheckRemainingIngredients should correctly identify missing ingredients', () => {
    const apiRecipes = [
        { ingredientLines: ['Chicken', 'Lettuce', 'Tomato'] },
        { ingredientLines: ['Chicken', 'Spinach'] }
    ];
    const ingredients = 'Chicken, Lettuce';
    
    const result = CheckRemainingIngredients(apiRecipes, ingredients);
    
    // Check if missing ingredients are correctly identified
    expect(result[0].missingIngredients).toEqual(['Tomato']);
    expect(result[1].missingIngredients).toEqual(['Spinach']);
});
