const router = require("express").Router();

const cosmeticsServices = require("../services/cosmeticsServices");
const { isAuth } = require("../middlewares/authMiddleware");

async function isOwner(req, res, next) {
  let cosmetics = await cosmeticsServices.getOne(req.params.cosmeticsId);

  if (cosmetics.owner == req.user._id) {
    res.redirect(`/cosmetics/${req.params.cosmeticsId}/details`);
  } else {
    next();
  }
}

async function checkIsOwner(req, res, next) {
  let cosmetics = await cosmeticsServices.getOne(req.params.cosmeticsId);

  if (cosmetics.owner == req.user._id) {
    next();
  } else {
    res.redirect(`/cosmetics/${req.params.cosmeticsId}/details`);
  }
}

router.get("/catalog", async (req, res) => {
  let cosmetics = await cosmeticsServices.getAll();
  res.render("cosmetics/catalog", { cosmetics });
});

router.get("/create-offer", isAuth, async (req, res) => {
  res.render("cosmetics/create");
});

router.post("/create-offer", isAuth, async (req, res) => {
  console.log(req.body);
  try {
    await cosmeticsServices.create({ ...req.body, owner: req.user });
    res.redirect("/cosmetics/catalog");
  } catch (error) {
    console.log(error);
    res.render("cosmetics/create", { error: getErrorMessage(error) });
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

router.get("/:cosmeticsId/details", async (req, res) => {
  let cosmetics = await cosmeticsServices.getOne(req.params.cosmeticsId);

  let cosmeticsData = cosmetics.toObject();

  let isOwner =
    req.user && cosmeticsData.owner.toString() === req.user._id.toString();

  let cosmeticsOwner = await cosmeticsServices
    .findOwner(cosmetics.owner)
    .lean();

  let hasRecommended =
    req.user &&
    cosmetics.recommendList.some(
      (u) => u._id.toString() === req.user._id.toString()
    );

  res.render("cosmetics/details", {
    ...cosmeticsData,
    isOwner,
    hasRecommended,
    cosmeticsOwner,
  });
});

router.get("/:cosmeticsId/recommend", isAuth, isOwner, async (req, res) => {
  const cosmetics = await cosmeticsServices.getOne(req.params.cosmeticsId);

  if (
    cosmetics.recommendList.some(
      (u) => u.toString() === req.user._id.toString()
    )
  ) {
    return res.redirect(`/cosmetics/${req.params.cosmeticsId}/details`);
  }

  cosmetics.recommendList.push(req.user._id);
  await cosmetics.save();

  res.redirect(`/cosmetics/${req.params.cosmeticsId}/details`);
});

router.get("/:cosmeticsId/edit", isAuth, checkIsOwner, async (req, res) => {
  const cosmeticsId = req.params.cosmeticsId;
  let cosmetics = await cosmeticsServices.getOne(cosmeticsId);
  res.render("cosmetics/edit", { ...cosmetics.toObject() });
});

router.post("/:cosmeticsId/edit", isAuth, checkIsOwner, async (req, res) => {
  try {
    const cosmeticsId = req.params.cosmeticsId;
    const cosmeticsData = req.body;
    await cosmeticsServices.update(cosmeticsId, cosmeticsData);
    res.redirect(`/cosmetics/${cosmeticsId}/details`);
  } catch (error) {
    res.render("cosmetics/edit", { error: getErrorMessage(error) });
  }
});

router.get("/:cosmeticsId/delete", isAuth, checkIsOwner, async (req, res) => {
  const cosmeticsId = req.params.cosmeticsId;
  await cosmeticsServices.delete(cosmeticsId);
  res.redirect("/cosmetics/catalog");
});

module.exports = router;
