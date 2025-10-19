const router = require("express").Router();

const recipesService = require("../services/recipesServices");

router.get("/", async (req, res) => {
  let recipes = await recipesService.findTheThree();
  recipes = recipes.slice(0, 3);
  res.render("home", { recipes });
});

router.get("/search", async (req, res) => {
  const searchText = req.query.search;
  let recipes = await recipesService.search(searchText);

  res.render("search", {
    recipes,
    searchText,
  });
});

// router.get("/search", async (req, res) => {
//   const cosmeticsText = req.query.search;

//   const cosmetics = await cosmeticsService.search(cosmeticsText);

//   res.render("search", { cosmetics, searchText: cosmeticsText });
// });

module.exports = router;
