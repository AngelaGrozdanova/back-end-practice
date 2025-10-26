const router = require("express").Router();

const mythsServices = require("../services/mythsServices");
const { isAuth } = require("../middlewares/authMiddleware");

async function isOwner(req, res, next) {
  let myths = await mythsServices.getOne(req.params.mythsId);

  if (myths.owner == req.user._id) {
    res.redirect(`/myths/${req.params.mythsId}/details`);
  } else {
    next();
  }
}

async function checkIsOwner(req, res, next) {
  let myths = await mythsServices.getOne(req.params.mythsId);

  if (myths.owner == req.user._id) {
    next();
  } else {
    res.redirect(`/myths/${req.params.mythsId}/details`);
  }
}

router.get("/catalog", async (req, res) => {
  let myths = await mythsServices.getAll();
  res.render("myths/catalog", { myths });
});

router.get("/create-offer", isAuth, async (req, res) => {
  res.render("myths/create");
});

router.post("/create-offer", isAuth, async (req, res) => {
  console.log(req.body);
  try {
    await mythsServices.create({ ...req.body, owner: req.user });
    res.redirect("/myths/catalog");
  } catch (error) {
    console.log(error);
    res.render("myths/create", { error: getErrorMessage(error), ...req.body });
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

router.get("/:mythsId/details", async (req, res) => {
  let myth = await mythsServices.getOne(req.params.mythsId);
  if (!myth) return res.redirect("/404");

  let mythData = myth.toObject();

  let isOwner = req.user?._id && myth.owner.equals(req.user._id);

  let hasLiked =
    req.user && myth.likedList.some((u) => u._id.equals(req.user._id));

  res.render("myths/details", {
    ...mythData,
    isOwner,
    hasLiked,
    user: req.user,
  });
});

router.get("/:mythsId/like", isAuth, isOwner, async (req, res) => {
  let myth = await mythsServices.getOne(req.params.mythsId);
  if (!myth) return res.redirect("/404");

  if (myth.owner.equals(req.user._id)) {
    return res.redirect(`/myths/${req.params.mythsId}/details`);
  }

  let alreadyLiked = myth.likedList.some((u) => u._id.equals(req.user._id));
  if (alreadyLiked) {
    return res.redirect(`/myths/${req.params.mythsId}/details`);
  }

  myth.likedList.push(req.user._id);
  await myth.save();
  res.redirect(`/myths/${req.params.mythsId}/details`);
});

router.get("/:mythsId/edit", isAuth, checkIsOwner, async (req, res) => {
  const mythsId = req.params.mythsId;
  let myths = await mythsServices.getOne(mythsId);
  res.render("myths/edit", { ...myths.toObject() });
});

router.post("/:mythsId/edit", isAuth, checkIsOwner, async (req, res) => {
  const mythsId = req.params.mythsId;
  const mythsData = req.body;

  try {
    await mythsServices.update(mythsId, mythsData);
    res.redirect(`/myths/${mythsId}/details`);
  } catch (error) {
    res.render("myths/edit", {
      error: getErrorMessage(error),
      ...mythsData,
      _id: mythsId,
    });
  }
});

router.get("/:mythsId/delete", isAuth, checkIsOwner, async (req, res) => {
  const mythsId = req.params.mythsId;
  await mythsServices.delete(mythsId);
  res.redirect("/myths/catalog");
});

module.exports = router;
