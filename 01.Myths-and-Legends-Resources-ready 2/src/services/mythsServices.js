const Myths = require("../models/Myths");
const User = require("../models/User");

exports.create = (mythsData) => Myths.create(mythsData);

exports.getAll = () => Myths.find().lean();

exports.getOne = (mythsId) => Myths.findById(mythsId).populate("likedList");

exports.delete = (mythsId) => Myths.findByIdAndDelete(mythsId);

exports.update = (mythsId, mythsData) =>
  Myths.findByIdAndUpdate(mythsId, mythsData, {
    runValidators: true,
  });

exports.findOwner = (ownerId) => User.findById(ownerId);

exports.findTheThree = () => Myths.find({}).sort({ createdAt: -1 }).lean();

exports.findTheThreeWithOwner = () =>
  Myths.find({}).sort({ createdAt: -1 }).populate("owner").lean();
