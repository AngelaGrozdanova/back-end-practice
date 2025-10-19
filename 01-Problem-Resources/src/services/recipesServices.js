const Recipes = require("../models/Recipes");
const User = require("../models/User");

exports.create = (recipesData) => Recipes.create(recipesData);

exports.getAll = () => Recipes.find().lean();

exports.getOne = (recipesId) =>
  Recipes.findById(recipesId).populate("recommendList");

exports.delete = (recipesId) => Recipes.findByIdAndDelete(recipesId);

exports.update = (recipesId, recipesData) =>
  Recipes.findByIdAndUpdate(recipesId, recipesData, {
    runValidators: true,
  });

exports.findOwner = (ownerId) => User.findById(ownerId);

exports.search = async (recipesText) => {
  if (!recipesText || recipesText.trim() === "") {
    return Recipes.find().lean();
  }

  return Recipes.find({
    title: { $regex: recipesText, $options: "i" },
  }).lean();
};

exports.findTheThree = () => Recipes.find({}).sort({ createdAt: -1 }).lean();
