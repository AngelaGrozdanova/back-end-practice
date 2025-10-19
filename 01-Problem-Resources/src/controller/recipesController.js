const router = require("express").Router();

const recipesServices = require("../services/recipesServices");
const { isAuth } = require("../middlewares/authMiddleware");

async function isOwner(req, res, next) {
  const recipe = await recipesServices.getOne(req.params.recipesId);

  if (!recipe || !req.user) {
    return res.redirect("/auth/login");
  }

  if (recipe.owner._id.toString() === req.user._id.toString()) {
    return res.redirect(`/recipes/${req.params.recipesId}/details`);
  }
  next();
}

async function checkIsOwner(req, res, next) {
  const recipe = await recipesServices.getOne(req.params.recipesId);

  if (!recipe || !req.user) {
    return res.redirect("/auth/login");
  }

  if (recipe.owner._id.toString() !== req.user._id.toString()) {
    return res.redirect(`/recipes/${req.params.recipesId}/details`);
  }

  next();
}

router.get("/catalog", async (req, res) => {
  let recipes = await recipesServices.getAll();
  res.render("recipes/catalog", { recipes });
});

router.get("/create-offer", isAuth, async (req, res) => {
  res.render("recipes/create");
});

router.post("/create-offer", isAuth, async (req, res) => {
  console.log(req.body);
  try {
    await recipesServices.create({ ...req.body, owner: req.user });
    res.redirect("/recipes/catalog");
  } catch (error) {
    console.log(error);
    res.render("recipes/create", {
      error: getErrorMessage(error),
      ...req.body,
    });
  }
});

function getErrorMessage(error) {
  let errorsArr = Object.keys(error.errors);

  if (errorsArr.length > 0) {
    return error.errors[errorsArr[0]];
  } else {
    return error.message;
  }
}

router.get("/:recipesId/details", async (req, res) => {
  let recipe = await recipesServices.getOne(req.params.recipesId);
  if (!recipe) {
    return res.redirect("/recipes/catalog");
  }
  let recipeData = recipe.toObject();
  let isOwner =
    req.user && recipeData.owner._id.toString() === req.user._id.toString();
  let hasRecommended =
    req.user &&
    recipeData.recommendList.some(
      (u) => u._id.toString() === req.user._id.toString()
    );
  res.render("recipes/details", {
    ...recipeData,
    isOwner,
    hasRecommended,
    recommendCount: recipeData.recommendList.length,
    recommendUsers: recipeData.recommendList,
    user: req.user,
  });
});

router.get("/:recipesId/recommend", isAuth, isOwner, async (req, res) => {
  const recipesId = req.params.recipesId;
  const recipe = await recipesServices.getOne(recipesId);
  if (!recipe) {
    return res.redirect("/recipes/catalog");
  }
  const alreadyRecommended = recipe.recommendList.some(
    (u) => u._id.toString() === req.user._id.toString()
  );
  if (!alreadyRecommended) {
    recipe.recommendList.push(req.user._id);
    await recipe.save();
  }
  res.redirect(`/recipes/${recipesId}/details`);
});

router.get("/:recipesId/edit", isAuth, checkIsOwner, async (req, res) => {
  const recipesId = req.params.recipesId;
  let recipes = await recipesServices.getOne(recipesId);
  res.render("recipes/edit", { ...recipes.toObject() });
});

router.post("/:recipesId/edit", isAuth, checkIsOwner, async (req, res) => {
  const recipesId = req.params.recipesId;
  const recipeData = req.body;

  try {
    await recipesServices.update(recipesId, recipeData);
    res.redirect(`/recipes/${recipesId}/details`);
  } catch (error) {
    res.render("recipes/edit", {
      error: getErrorMessage(error),
      ...recipeData,
      _id: recipesId,
    });
  }
});

router.get("/:recipesId/delete", isAuth, checkIsOwner, async (req, res) => {
  const recipesId = req.params.recipesId;
  await recipesServices.delete(recipesId);
  res.redirect("/recipes/catalog");
});

module.exports = router;
