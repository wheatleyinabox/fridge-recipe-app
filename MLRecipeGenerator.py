from flask import Flask, jsonify, request
import google.generativeai as genai
import dotenv
import os

dotenv.load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure the API key
genai.configure(api_key = GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)
def generate_recipe(ingredients, recipes):
    """
    Generate a recipe based on a list of ingredients using the Gemini AI model.
    Returns a recipe string containing structured data with name, ingredients, instructions, difficulty, and time.
    """
    prompt = (
    f"Based on these ingredients: {ingredients}, and these recipes with the most already utilized ingredients: {recipes}, "
    "suggest a few recipes that focus on using the remaining unused ingredients from the fridge. "
    "Customize the recipes based on dietary preferences if keywords like 'vegetarian' or 'eggless' are mentioned. "
    "For each recipe, include the following details in the response: "
    "- Recipe name (label), "
    "- An image URL of the dish (image), "
    "- Approximate calorie count (calories), "
    "- Meal type (e.g., breakfast, lunch, dinner) (mealType), "
    "- A list of ingredients (ingredientLines), "
    "- A URL for detailed instructions (url), "
    "- The difficulty level (difficulty), and "
    "- The approximate cooking time (cookingTime). "
    "Ensure the response is formatted consistently and is user-friendly."
)

    response = model.generate_content(prompt)
    return response.text.strip() if response else None
#Extra random generate function
def generate_random_recipes():
    """
    Generate a list of 5 random recipes using the Gemini AI model.
    Returns a string with recipe names, ingredients, and instructions for each recipe.
    """
    prompt = "Generate 5 random recipes with ingredients and instructions."
    response = model.generate_content(prompt)
    return response.text.strip() if response else None


@app.route('/recipes/<ingredients>', methods=['GET'])
def get_recipes(ingredients):
    """
    Flask route to return recipes based on provided ingredients.
    """
    try:
        # Sample placeholder for recipes argument
        recipes = "[]"
        recipe_data = generate_recipe(ingredients, recipes)
        if recipe_data:
            return jsonify({"recipes": eval(recipe_data)})  # Parse the JSON string into Python list
        else:
            return jsonify({"error": "No recipes generated."})
    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)
