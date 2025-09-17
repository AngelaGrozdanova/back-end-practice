const mongoose = require("mongoose");

let volcanosSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
    },
    location: {
      type: String,
      required: true,
      minLength: 3,
    },
    elevation: {
      type: Number,
      required: true,
      minValue: 0,
    },
    lastEruption: {
      type: Number,
      required: true,
      min: 0,
      max: 2024,
    },
    image: {
      type: String,
      required: true,
      validate: /^https?:\/\//i,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
    },
    typeVolcano: {
      type: String,
      required: true,
      enum: [
        "Supervolcanoes",
        "Submarine",
        "Subglacial",
        "Mud",
        "Stratovolcanoes",
        "Shield",
      ],
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    voteList: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

volcanosSchema.method("getVotes", function () {
  return this.voteList.map((x) => x._id);
});

let Volcanos = mongoose.model("Volcano", volcanosSchema);

module.exports = Volcanos;
