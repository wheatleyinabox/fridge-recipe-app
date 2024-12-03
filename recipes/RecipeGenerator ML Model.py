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

def generate_recipe(ingredients):
    """
    Generate a recipe based on a list of ingredients using the Gemini AI model.
    Returns a recipe string containing the recipe name, ingredients, and instructions.
    """
    prompt = f"Based on these ingredients: {ingredients}, suggest a recipe including the recipe name, ingredients, and instructions."
    response = model.generate_content(prompt)
    return response.text.strip() if response else None

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
    Flask route to return a recipe based on provided ingredients.
    """
    try:
        recipe_data = generate_recipe(ingredients)
        if recipe_data:
            return jsonify({"recipe": recipe_data})
        else:
            return jsonify({"error": "No recipe generated."})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/random-recipes', methods=['GET'])
def random_recipes():
    """
    Flask route to return 5 random recipes.
    """
    try:
        recipe_data = generate_random_recipes()
        if recipe_data:
            return jsonify({"recipes": recipe_data})
        else:
            return jsonify({"error": "No recipes generated."})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
