const mongoose = require("mongoose");

let mythsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
    },
    origin: {
      type: String,
      required: true,
      minLength: 3,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
    },
    role: {
      type: String,
      required: true,
      minLength: 2,
    },
    symbol: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 40,
    },
    era: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 15,
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
    likedList: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

mythsSchema.method("getLikes", function () {
  return this.likedList.map((x) => x._id);
});

let Myths = mongoose.model("Myths", mythsSchema);

module.exports = Myths;
