const mongoose = require("mongoose");

let recipesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 2,
    },
    ingredients: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 850,
    },
    instructions: {
      type: String,
      required: true,
      minLength: 10,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 150,
    },
    image: {
      type: String,
      required: true,
      validate: /^https?:\/\//i,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    recommendList: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

recipesSchema.method("getRecommends", function () {
  return this.recommendList.map((x) => x._id);
});

let Recipes = mongoose.model("Cosmetics", recipesSchema);

module.exports = Recipes;
