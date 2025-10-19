const mongoose = require("mongoose");

let carsSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
      minLength: 2,
    },
    manufacturer: {
      type: String,
      required: true,
      minLength: 3,
    },
    engine: {
      type: String,
      required: true,
      minLength: 3,
    },
    topSpeed: {
      type: Number,
      required: true,
      min: 10,
    },
    description: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 500,
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
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

carsSchema.method("getLikes", function () {
  return this.recommendList.map((x) => x._id);
});

let Cars = mongoose.model("Cars", carsSchema);

module.exports = Cars;
