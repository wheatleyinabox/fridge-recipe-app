import express from "express"
import axios from "axios"
import cors from "cors"
import "dotenv/config"

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())

app.get('/', (req, res) => {
    res.send('Welcome to the Recipe API')
})

app.get('/recipes/:query', async (req, res) => {
    try {
        const query = req.params.query; // Get query from URL
        const response = await axios.get(`https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${process.env.THEIR_APP_ID}&app_key=${process.env.THEIR_API_KEY}`);
        const recipes = response.data.hits;

        // Optional: Send the ingredients list for further processing by ML model
        const mlResults = await getMLOutputs(recipes); // Function to fetch ML-based recipes

        res.json({ recipes, mlResults });
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
        console.log("Random amount returned: " + response.data.count)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error fetching random recipes')
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})