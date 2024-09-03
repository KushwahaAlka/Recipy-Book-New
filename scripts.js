document.addEventListener("DOMContentLoaded", () => {
    const recipeList = document.getElementById("recipeList");
    const recipeForm = document.getElementById("recipeForm");
    const searchInput = document.getElementById("searchInput");
    const favoritesBtn = document.getElementById("favoritesBtn");
    let currentCategory = 'All';
    let editIndex = null; // To keep track of the recipe being edited

    // Load recipes from local storage
    const loadRecipes = () => {
        return JSON.parse(localStorage.getItem("recipes")) || [];
    };

    // Save recipes to local storage
    const saveRecipes = (recipes) => {
        localStorage.setItem("recipes", JSON.stringify(recipes));
    };

    // Display recipes
    const displayRecipes = (recipes) => {
        recipeList.innerHTML = "";
        recipes.forEach((recipe, index) => {
            if (currentCategory === 'All' || recipe.category === currentCategory) {
                const recipeCard = document.createElement("div");
                recipeCard.classList.add("recipe-card");

                recipeCard.innerHTML = `
                    <img src="${recipe.imageUrl}" alt="${recipe.name}">
                    <h3>${recipe.name}</h3>
                    <p><strong>Category:</strong> ${recipe.category}</p>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
                    <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                    <p class="nutrition"><strong>Nutrition:</strong> ${recipe.nutrition}</p>
                    <div class="card-buttons">
                        <button onclick="toggleFavorite(${index})">
                            ${recipe.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                        <button onclick="editRecipe(${index})">Edit</button>
                        <button onclick="deleteRecipe(${index})">Delete</button>
                    </div>
                `;

                recipeList.appendChild(recipeCard);
            }
        });
    };

    // Add or update a recipe
    recipeForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const recipeName = document.getElementById("recipeName").value.trim();
        const ingredients = document.getElementById("ingredients").value.split(",").map(ing => ing.trim());
        const instructions = document.getElementById("instructions").value.trim();
        const imageUrl = document.getElementById("imageUrl").value.trim() || "default-image.jpg";
        const category = document.getElementById("category").value.trim() || "Others";
        const nutrition = document.getElementById("nutrition").value.trim();

        if (!recipeName || !ingredients || !instructions) {
            alert("Please fill out all required fields.");
            return;
        }

        const newRecipe = {
            name: recipeName,
            ingredients,
            instructions,
            imageUrl,
            category,
            nutrition,
            isFavorite: false
        };

        const recipes = loadRecipes();

        if (editIndex !== null) {
            // Update existing recipe
            recipes[editIndex] = { ...recipes[editIndex], ...newRecipe };
            editIndex = null;
            alert("Recipe updated successfully!");
        } else {
            // Add new recipe
            recipes.push(newRecipe);
            alert("Recipe added successfully!");
        }

        saveRecipes(recipes);
        displayRecipes(recipes);
        recipeForm.reset();
    });

    // Search for recipes
    searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const recipes = loadRecipes();
        const filteredRecipes = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(searchTerm) ||
            recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
        );
        displayRecipes(filteredRecipes);
    });

    // Toggle favorite
    window.toggleFavorite = (index) => {
        const recipes = loadRecipes();
        recipes[index].isFavorite = !recipes[index].isFavorite;
        saveRecipes(recipes);
        displayRecipes(recipes);
    };

    // Edit recipe
    window.editRecipe = (index) => {
        const recipes = loadRecipes();
        const recipe = recipes[index];
        document.getElementById("recipeName").value = recipe.name;
        document.getElementById("ingredients").value = recipe.ingredients.join(", ");
        document.getElementById("instructions").value = recipe.instructions;
        document.getElementById("imageUrl").value = recipe.imageUrl;
        document.getElementById("category").value = recipe.category;
        document.getElementById("nutrition").value = recipe.nutrition;
        editIndex = index;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Delete recipe
    window.deleteRecipe = (index) => {
        if (confirm("Are you sure you want to delete this recipe?")) {
            const recipes = loadRecipes();
            recipes.splice(index, 1);
            saveRecipes(recipes);
            displayRecipes(recipes);
            alert("Recipe deleted successfully!");
        }
    };

    // Filter recipes by category
    document.querySelectorAll('nav button[data-category]').forEach(button => {
        button.addEventListener('click', () => {
            currentCategory = button.getAttribute('data-category');
            displayRecipes(loadRecipes());
        });
    });

    // Display favorite recipes
    favoritesBtn.addEventListener('click', () => {
        const recipes = loadRecipes();
        const favoriteRecipes = recipes.filter(recipe => recipe.isFavorite);
        displayRecipes(favoriteRecipes);
    });

    // Initial display of recipes
    displayRecipes(loadRecipes());
});
