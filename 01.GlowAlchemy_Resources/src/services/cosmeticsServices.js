const Cosmetics = require("../models/Cosmetics");
const User = require("../models/User");

exports.create = (cosmeticsData) => Cosmetics.create(cosmeticsData);

exports.getAll = () => Cosmetics.find().lean();

exports.getOne = (cosmeticsId) =>
  Cosmetics.findById(cosmeticsId).populate("recommendList");

exports.delete = (cosmeticsId) => Cosmetics.findByIdAndDelete(cosmeticsId);

exports.update = (cosmeticsId, cosmeticsData) =>
  Cosmetics.findByIdAndUpdate(cosmeticsId, cosmeticsData);

exports.findOwner = (ownerId) => User.findById(ownerId);

exports.search = (cosmeticsText) => {
  if (cosmeticsText) {
    return Cosmetics.find({
      name: { $regex: cosmeticsText, $options: "i" },
    }).lean();
  }
};

exports.findTheThree = () => Cosmetics.find({}).sort({ createdAt: -1 }).lean();
