import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setError("");
    setLoading(true);
    setSelectedRecipe(null);
    setInstructions("");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/predict_and_suggest/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setIngredients(res.data.ingredients || []);
      setRecipes(res.data.recipes || []);
    } catch (err) {
      setError("Error fetching recipes");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeDetails = async (id) => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE_URL}/api/recipes/${id}/`);
      setSelectedRecipe(res.data);
      setInstructions(res.data.instructions || "No instructions available.");
    } catch (err) {
      setError("Failed to load recipe instructions.");
      setInstructions("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Recipe Suggestion System</h1>

      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={handleUpload}>Upload</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {ingredients.length > 0 && (
        <div>
          <h2>Detected Ingredients:</h2>
          <ul>
            {ingredients.map((ing, index) => (
              <li key={index}>{ing}</li>
            ))}
          </ul>
        </div>
      )}

      {recipes.length > 0 && (
        <div>
          <h2>Suggested Recipes:</h2>
          <div className="recipes">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="recipe-card"
                style={{ cursor: "pointer" }}
                onClick={() => fetchRecipeDetails(recipe.id)}
              >
                <img src={recipe.image} alt={recipe.title} />
                <h3>{recipe.title}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedRecipe && (
        <div className="instructions">
  <h2>{selectedRecipe.title} - How to Prepare</h2>
  <div
    style={{ whiteSpace: "normal" }}
    dangerouslySetInnerHTML={{ __html: instructions }}
  />
  {selectedRecipe.sourceUrl && (
    <a href={selectedRecipe.sourceUrl} target="_blank" rel="noreferrer">
      View full recipe source
    </a>
  )}
</div>

      )}
    </div>
  );
}

export default App;
