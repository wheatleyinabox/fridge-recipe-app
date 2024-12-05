import express from "express"
import axios from "axios"
import cors from "cors"
import "dotenv/config"
//import db from './db/sqlite.js';

// Add these imports at the top
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

//SQLite imports
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json());

//SQlite database setup
const db = new sqlite3.Database("./recipes.db", (err) => {
    if (err){
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
        db.run(
            `CREATE TABLE IF NOT EXISTS recipes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                label TEXT NOT NULL,
                image TEXT,
                url TEXT,
                ingredientLines TEXT,
                calories REAL,
                mealType TEXT
                
            )`
        );
    }
});

//Store in database
const storeRecipe = (recipe) => {
    const sql = `
        INSERT INTO recipes (label, image, url, ingredientLines, calories, mealType)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
        recipe.label,
        recipe.image,
        recipe.url,
        JSON.stringify(recipe.ingredientLines),
        recipe.calories,
        recipe.mealType,
    ];
    db.run(sql, params, function(err) {
        if (err) {
            console.error("Error storing recipe", err.messsage);
        } else {
            console.log(`Recipe added with ID: ${this.lastID}`);
        }
    });
};

//Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Recipe API')
})

//Fetch recipes from api
app.get('/recipes/:query', async (req, res) => {
    console.log(req.params.query);
    try {
        const query = req.params.query;
        if(!query){
            return res.status(400).json({ error: "Query parameter is missing" });
        }
        let ingredientLines = query.split(',');
        let recipes = [];
        let subsetCount = 1;

        // Keep splitting until recipes are found or max 4 subsets
        while (recipes.length === 0 && subsetCount <= 4) {
            const subsets = [];
            const subsetSize = Math.ceil(ingredientLines.length / subsetCount);

            for (let i = 0; i < ingredientLines.length; i += subsetSize) {
                subsets.push(ingredientLines.slice(i, i + subsetSize));
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

        //Store recipe
        //recipes.forEach((r) => storeRecipe(r.recipe));

        res.json(recipes);
        console.log("Amount returned: " + recipes.length);
        console.log("Subset count: " + subsetCount)
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching recipes');
    }
});

//get random recipe from api
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

//Added a Backend Endpoint to get whats in database
// Fetch all recipes
app.get('/getRecipes', (req, res) => {
    const sql = 'SELECT * FROM recipes';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching recipes:', err.message);
            return res.status(500).send('Error fetching recipes');
        }
        res.json(rows);  // Return the result rows from the query
    });
});

app.post('/ai-recipes', async (req, res) => {
    const { ingredients, recipes } = req.body;

    if (!ingredients || !Array.isArray(recipes)) {
        return res.status(400).json({ error: "Ingredients and recipes are required." });
    }

    const prompt = `
        Based on these ingredients: ${ingredients.join(', ')}, 
        and these recipes with the most already utilized ingredients: ${JSON.stringify(recipes)}, 
        suggest a few recipes that focus on using the remaining unused ingredients from the fridge. 
        Customize the recipes based on dietary preferences if keywords like 'vegetarian' or 'eggless' are mentioned. 
        Ensure the response is formatted consistently and user-friendly, including name, ingredients, instructions, difficulty, and time.
        Format the output as JSON to match the existing recipe data structure.
    `;

    try {
        const aiResponse = await model.generateText({
            prompt,
            temperature: 0.7,
            maxOutputTokens: 512,
        });

        const aiRecipes = JSON.parse(aiResponse.candidates[0].output);
        res.status(200).json(aiRecipes);
    } catch (error) {
        console.error("Error generating AI recipes:", error);
        res.status(500).json({ error: "Failed to generate AI recipes" });
    }
});

//Testing code to add a set recipe
app.post("/addRecipe", (req, res) => {
    const recipe = {
        label: "Shredded Chicken",
        image: "https://edamam-product-images.s3.amazonaws.com/web-img/f98/f98cb99f615f7cc0ec01c033e9ff72ec.jpg",
        url: "https://example.com/recipe/chicken-salad",
        ingredientLines: ["Chicken", "Spices", "Olive oil"],
        calories: 250,
        mealType: "Lunch"
    };
    storeRecipe(recipe);
    res.send("Recipe added successfully");
});

app.post("/recipesAdd", (req, res) => {
    const { label, image, url, ingredientLines, calories, mealType } = req.body;

    if(!label || !image || !url || !ingredientLines) {
        return res.status(400).send("Missing required fields");
    }

    const sql = `
        INSERT INTO recipes (label, image, url, ingredientLines, calories, mealType)
        VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [
        label,
        image,
        url,
        JSON.stringify(ingredientLines),
        calories,
        mealType,
    ];

    db.run(sql, params, (err) => {
        if (err){
            console.error("Error storing recipe:", err.message);
            return res.status(500).send("Error storing recipe");
        }
        res.status(200).send("Recipe stored sucessfully");
    })
})

// API Route: Fetch recipes by mealType
app.get("/mealType", (req, res) => {
    const { mealType } = req.query; // Get mealType from query parameter

    console.log("Recieved mealType:", mealType); //log meal type for debugging
  
    if (!mealType) {
      return res.status(400).json({ error: "Meal type is required" });
    }
  
    // SQL query to fetch recipes with the specified mealType
    const query = `SELECT * FROM recipes WHERE mealType = ?`;
  
    db.all(query, [mealType], (err, rows) => {
      if (err) {
        console.error("Error fetching recipes:", err.message);
        return res.status(500).json({ error: "Internal server error" });
      }
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "No recipes found for this meal type" });
      }
  
      res.status(200).json(rows); // Return recipes as JSON
    });
  });

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})