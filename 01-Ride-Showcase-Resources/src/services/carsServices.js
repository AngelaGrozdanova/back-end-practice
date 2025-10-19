const Cars = require("../models/Cars");
const User = require("../models/User");

exports.create = (carsData) => Cars.create(carsData);

exports.getAll = () => Cars.find().lean();

exports.getOne = (carsId) => Cars.findById(carsId).populate("likes");

exports.delete = (carsId) => Cars.findByIdAndDelete(carsId);

exports.update = (carsId, carsData) =>
  Cars.findByIdAndUpdate(carsId, carsData, {
    runValidators: true,
  });

exports.getByOwner = (ownerId) => Cars.find({ owner: ownerId }).lean();

exports.findOwner = (ownerId) => User.findById(ownerId);

exports.search = (carsText) => {
  if (carsText) {
    return Cars.find({
      name: { $regex: carsText, $options: "i" },
    }).lean();
  }
};

exports.findTheThree = () => Cars.find({}).sort({ createdAt: -1 }).lean();
