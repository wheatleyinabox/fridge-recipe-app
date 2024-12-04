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
const PORT = process.env.PORT || 5001

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

        while (recipes.length === 0 && subsetCount <= 4) {
            const subsets = [];
            const subsetSize = Math.ceil(ingredients.length / subsetCount);

            for (let i = 0; i < ingredients.length; i += subsetSize) {
                subsets.push(ingredients.slice(i, i + subsetSize));
            }

            const promises = subsets.map(subset => {
                const query = subset.join(',');
                console.log(`Requesting Edamam API with query: ${query}`);  // Log the query being sent
                return axios.get(
                    `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(query)}&app_id=${process.env.THEIR_APP_ID}&app_key=${process.env.THEIR_API_KEY}&field=label&field=image&field=url&field=ingredients&field=ingredientLines&field=calories&field=mealType`
                );
            });

            const responses = await Promise.all(promises);
            recipes = responses.flatMap(r => r.data.hits);

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
        console.error('Error occurred:', error);  // Log the error for better debugging
        res.status(500).send('Error fetching recipes');
    }
});

app.get('/remaining-ingredients/:query', async (req, res) => {
    try {
        const ingredients = req.params.query.split(',');  // Split ingredients into an array
        const remainingIngredients = ingredients.filter(ingredient => ingredient.trim().length > 0);
        
        res.json({ remainingIngredients });  // Return remaining ingredients or any necessary data
    } catch (error) {
        console.error('Error fetching remaining ingredients:', error);
        res.status(500).send('Error processing remaining ingredients');
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




app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
    console.log('Edamam API ID:', process.env.THEIR_APP_ID);
    console.log('Edamam API Key:', process.env.THEIR_API_KEY);

})