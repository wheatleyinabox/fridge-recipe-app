require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const apiKey1 = process.env.THEIR_API_KEY;
const appId1 = process.env.THEIR_APP_ID;

app.get('/recipes', async (req, res) => {
    const fetch = (await import('node-fetch')).default;
    const ingredient = req.query.ingredient; // Expecting ?ingredient=chicken
    const url = `https://api.edamam.com/search?q=${ingredient}&app_id=${appId1}&app_key=${apiKey1}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.hits); // Send the list of recipes as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching recipes');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

/*
Note: from data.hits get shareAs,
url, and label, image too if necessary but all details are on shareAs.

*/