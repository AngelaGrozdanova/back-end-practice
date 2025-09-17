const Volcanos = require("../models/Volcanos");

exports.create = (volcanosData) => Volcanos.create(volcanosData);

exports.getAll = () => Volcanos.find().lean();

exports.getOne = (volcanosId) =>
  Volcanos.findById(volcanosId).populate("voteList");

exports.delete = (volcanosId) => Volcanos.findByIdAndDelete(volcanosId);

exports.update = (volcanosId, volcanosData) =>
  Volcanos.findByIdAndUpdate(volcanosId, volcanosData);

exports.findOwner = (ownerId) => User.findById(ownerId);

exports.search = (searchText, typeVolcano) => {
  const query = {};

  if (searchText) {
    query.name = { $regex: searchText, $options: "i" }; 
  }

  if (typeVolcano && typeVolcano !== "All") {
    query.typeVolcano = typeVolcano;
  }

  return Volcanos.find(query).lean();
};

exports.findTheThree = () => Volcanos.find({}).sort({ createdAt: -1 }).lean();
