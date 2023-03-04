const axios = require("axios");
const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "node_modules")));


dairyIngredients = ["Cream","Cheese","Milk","Butter","Creme","Ricotta","Mozzarella","Custard","Cream Cheese",];
glutenIngredients = ["Flour", "Bread", "spaghetti", "Biscuits", "Beer"];

const glutenDairyIngredients = []

dairyIngredients.forEach(d => {
  glutenDairyIngredients.push(d)
})

glutenIngredients.forEach(g => {
  glutenDairyIngredients.push(g)
})



app.get("/sanity", function (req, res) {
  res.send("OK");
});

app.get("/recipes/:ingredient", function (req, res) {
  const ingredient = req.params.ingredient;
  const glutenFree = req.query.gluten
  const diaryFree = req.query.diary

  axios
    .get(`https://recipes-goodness-elevation.herokuapp.com/recipes/ingredient/${ingredient}`)
    .then((recipes) => {
      const allRecipe = recipes.data.results.map((r) => {
        return {
          idMeal: r.idMeal,
          ingredients: r.ingredients,
          title: r.title,
          thumbnail: r.thumbnail,
          href: r.href,
        };
      });

      
      if(glutenFree == 'true' && diaryFree == 'true'){ 
      res.send(filterFunctions(allRecipe , glutenDairyIngredients));
      }

      else if(glutenFree == 'true' && diaryFree == 'false'){ 
        res.send(filterFunctions(allRecipe , glutenIngredients));
      }
      else if(diaryFree == 'true' && glutenFree == 'false'){ 
        res.send(filterFunctions(allRecipe , dairyIngredients));
      }
      else {
        res.send(allRecipe);
      }

    })

    .catch(function (error) {
      console.log(error);
    });
});



const filterFunctions = function (recipes , freeArray ) {
  const Filtered_Recipe = [];
  for (let recipe of recipes) {
    
    let isExist = false;
    let ingredients = recipe.ingredients;

    for (let ingredient of ingredients) {
      for (let gluten of freeArray) {
        if (ingredient.includes(gluten)) {
          isExist = true;
        }
      }
    }
    if (!isExist) {
      Filtered_Recipe.push(recipe);
    }
  }

  return Filtered_Recipe;
};


const port = 5000;
app.listen(port, function () {
  console.log(`Running server on port : ${port}`);
});





