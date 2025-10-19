const router = require("express").Router();

const carsServices = require("../services/carsServices");
const { isAuth } = require("../middlewares/authMiddleware");

async function isOwner(req, res, next) {
  const cars = await carsServices.getOne(req.params.carsId);

  if (!req.user || !cars) {
    return res.redirect("/cars/catalog");
  }
  if (cars.owner._id.toString() === req.user._id.toString()) {
    return res.redirect(`/cars/${req.params.carsId}/details`);
  }
  next();
}

async function checkIsOwner(req, res, next) {
  const cars = await carsServices.getOne(req.params.carsId);
  if (!req.user || !cars) {
    return res.redirect("/cars/catalog");
  }
  if (cars.owner._id.toString() !== req.user._id.toString()) {
    return res.redirect(`/cars/${req.params.carsId}/details`);
  }
  next();
}

router.get("/catalog", async (req, res) => {
  let cars = await carsServices.getAll();
  res.render("cars/catalog", { cars });
});

router.get("/create-offer", isAuth, async (req, res) => {
  res.render("cars/create");
});

router.post("/create-offer", isAuth, async (req, res) => {
  console.log(req.body);
  try {
    await carsServices.create({ ...req.body, owner: req.user._id });
    res.redirect("/cars/catalog");
  } catch (error) {
    console.log(error);
    res.render("cars/create", { error: getErrorMessage(error), ...req.body });
  }
});

function getErrorMessage(error) {
  let errorsArr = Object.keys(error.errors);

  if (errorsArr.length > 0) {
    return error.errors[errorsArr[0]];
  } else {
    return error.message;
  }
}

router.get("/:carsId/details", async (req, res) => {
  let cars = await carsServices.getOne(req.params.carsId);

  if (!cars) return res.redirect("/cars/catalog");
  let carsData = cars.toObject();
  let isOwner =
    req.user && carsData.owner._id.toString() === req.user._id.toString();
  let carsOwner = await carsServices.findOwner(carsData.owner);
  let hasLiked =
    req.user &&
    cars.likes.some((u) => u._id.toString() === req.user._id.toString());
  let likedUsers = cars.likes.map((u) => ({ email: u.email }));

  res.render("cars/details", {
    ...carsData,
    isOwner,
    hasLiked,
    carsOwner,
    likedUsers,
    likesCount: cars.likes.length,
    user: req.user,
  });
});

router.get("/:carsId/like", isAuth, isOwner, async (req, res) => {
  let carsId = req.params.carsId;
  let cars = await carsServices.getOne(carsId);

  if (!cars) {
    return res.redirect("/cars/catalog");
  }
  if (cars.owner._id.toString() === req.user._id.toString()) {
    return res.redirect(`/cars/${carsId}/details`);
  }
  let alreadyLiked = cars.likes.some(
    (u) => u._id.toString() === req.user._id.toString()
  );
  if (!alreadyLiked) {
    cars.likes.push(req.user._id);
    await cars.save();
  }
  res.redirect(`/cars/${carsId}/details`);
});

router.get("/:carsId/edit", isAuth, checkIsOwner, async (req, res) => {
  const carsId = req.params.carsId;
  let cars = await carsServices.getOne(carsId);
  res.render("cars/edit", { ...cars.toObject() });
});

router.post("/:carsId/edit", isAuth, checkIsOwner, async (req, res) => {
  const carsId = req.params.carsId;
  const carsData = req.body;

  try {
    await carsServices.update(carsId, carsData);
    res.redirect(`/cars/${carsId}/details`);
  } catch (error) {
    res.render("cars/edit", {
      error: getErrorMessage(error),
      ...carsData,
      _id: carsId,
    });
  }
});

router.get("/:carsId/delete", isAuth, checkIsOwner, async (req, res) => {
  const carsId = req.params.carsId;
  await carsServices.delete(carsId);
  res.redirect("/cars/catalog");
});

module.exports = router;
