const mongoose = require("mongoose");

let cosmeticsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
    },
    skin: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      minLength: 20,
      maxLength: 200,
    },
    ingredients: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    benefits: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

cosmeticsSchema.method("getRecommends", function () {
  return this.recommendList.map((x) => x._id);
});

let Cosmetics = mongoose.model("Cosmetics", cosmeticsSchema);

module.exports = Cosmetics;
