import express from "express"
import axios from "axios"
import cors from "cors"
import "dotenv/config"


// Add these imports at the top
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())

app.get('/', (req, res) => {
    res.send('Welcome to the Recipe API')
})

app.get('/recipes/:query', async (req, res) => {
    console.log(req.params.query);
    try {
        let ingredients = req.params.query.split(',');
        let recipes = [];
        let subsetCount = 1;

        // Keep splitting until recipes are found or max 4 subsets
        while (recipes.length === 0 && subsetCount <= 4) {
            const subsets = [];
            const subsetSize = Math.ceil(ingredients.length / subsetCount);

            for (let i = 0; i < ingredients.length; i += subsetSize) {
                subsets.push(ingredients.slice(i, i + subsetSize));
            }

            // Query the API with each subset
            const promises = subsets.map(subset => {
                const query = subset.join(',');
                return axios.get(
                    `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(query)}&app_id=${process.env.THEIR_APP_ID}&app_key=${process.env.THEIR_API_KEY}&field=label&field=image&field=url&field=ingredients&field=ingredientLines&field=calories&field=mealType`
                );
            });

            const responses = await Promise.all(promises);
            recipes = responses.flatMap(r => r.data.hits);

            // If no recipes found, increase the subset count
            if (recipes.length === 0) {
                subsetCount++;
            } else {
                break;
            }
        }

        res.json(recipes);
        console.log("Amount returned: " + recipes.length);
        console.log("Subset count: " + subsetCount)
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching recipes');
    }
});

app.get('/random-recipes', async (req, res) => {
    try {
        const { count = 3 } = req.query; // Defaults to 3 if no count is specified
        const response = await axios.get(
            `https://api.edamam.com/api/recipes/v2?type=public&q=chicken,beef&random=true&app_id=${process.env.THEIR_APP_ID}&app_key=${process.env.THEIR_API_KEY}&field=label&field=image&field=url&field=ingredients&field=ingredientLines&field=calories&field=mealType`
        )
        const recipes = response.data.hits.slice(0, parseInt(count, 10));
        // console.log(recipes)
        res.json(recipes)
        console.log()
        console.log("Random amount returned: " + response.data.count)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error fetching random recipes')
    }
})


function fileToGenerativePart(filePath, mimeType) {
    return {
        inlineData: {
            data: fs.readFileSync(filePath).toString('base64'),
            mimeType,
        },
    };
}

app.post('/scanner', upload.single('image'), async (req, res) => {
    try {
        const prompt = "As a list with only the root words, give everything that is in my fridge in the following format and only in that format:\n count;item";
        const imagePath = req.file.path;
        const mimeType = req.file.mimetype;

        const imagePart = fileToGenerativePart(imagePath, mimeType);

        const result = await model.generateContent([prompt, imagePart]);

        fs.unlinkSync(imagePath); // delete file after

        res.json({ result: await result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the image');
    }
});
// Function to generate a recipe based on ingredients and recipes
async function generateRecipe(ingredients, recipes) {
    const prompt = `
        Based on these ingredients: ${ingredients}, and these recipes with the most already utilized ingredients: ${recipes}, 
        suggest a few recipes (which should also include at least a few recipes that I already gave in the final returned output) 
        that focus on using the remaining unused ingredients from the fridge. 
        Customize the recipes based on dietary preferences if keywords like 'vegetarian' or 'eggless' are mentioned. 
        For each recipe, include the following details in the response: 
        - Recipe name (label),
        - An image URL of the dish (image),
        - Approximate calorie count (calories),
        - Meal type (e.g., breakfast, lunch, dinner) (mealType),
        - A list of ingredients (ingredientLines),
        - A URL for detailed instructions (url),
        - The difficulty level (difficulty), and
        - The approximate cooking time (cookingTime). 
        Ensure the response is formatted consistently and is user-friendly.
    `;

    try {
        const response = await axios.post(
            `${API_ENDPOINT}/generate-content`, // Update with the actual endpoint
            {
                prompt: prompt,
                model: 'gemini-1.5-flash', // Update as per your API's model configuration
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GOOGLE_API_KEY}`,
                },
            }
        );

        return response.data?.text?.trim();
    } catch (error) {
        console.error('Error generating recipe:', error.message);
        throw new Error('Could not generate recipe. Please try again.');
    }
}

// Function to generate random recipes
async function generateRandomRecipes() {
    const prompt = "Generate 5 random recipes with ingredients and instructions.";
    try {
        const response = await axios.post(
            `${API_ENDPOINT}/generate-content`, // Update with the actual endpoint
            {
                prompt: prompt,
                model: 'gemini-1.5-flash',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GOOGLE_API_KEY}`,
                },
            }
        );

        return response.data?.text?.trim();
    } catch (error) {
        console.error('Error generating random recipes:', error.message);
        throw new Error('Could not generate random recipes. Please try again.');
    }
}

// Route to get recipes based on ingredients
app.get('/recipes/:ingredients', async (req, res) => {
    const ingredients = req.params.ingredients;
    const recipes = "[]"; // Placeholder for existing recipes

    try {
        const recipeData = await generateRecipe(ingredients, recipes);
        if (recipeData) {
            res.json({ recipes: JSON.parse(recipeData) });
        } else {
            res.status(404).json({ error: 'No recipes generated.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})