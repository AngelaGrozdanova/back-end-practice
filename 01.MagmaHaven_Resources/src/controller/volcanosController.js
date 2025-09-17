const router = require("express").Router();

const volcanosServices = require("../services/volcanosServices");
const { isAuth } = require("../middlewares/authMiddleware");

async function isOwner(req, res, next) {
  let volcanos = await volcanosServices.getOne(req.params.volcanosId);

  if (volcanos.owner == req.user._id) {
    res.redirect(`/volcanos/${req.params.volcanosId}/details`);
  } else {
    next();
  }
}

async function checkIsOwner(req, res, next) {
  let volcanos = await volcanosServices.getOne(req.params.volcanosId);

  if (volcanos.owner == req.user._id) {
    next();
  } else {
    res.redirect(`/volcanos/${req.params.volcanosId}/details`);
  }
}

router.get("/catalog", async (req, res) => {
  let volcanos = await volcanosServices.getAll();
  res.render("volcanos/catalog", { volcanos });
});

router.get("/create-offer", isAuth, async (req, res) => {
  res.render("volcanos/create");
});

router.post("/create-offer", isAuth, async (req, res) => {
  console.log(req.body);
  try {
    await volcanosServices.create({ ...req.body, owner: req.user });
    res.redirect("/volcanos/catalog");
  } catch (error) {
    console.log(error);
    res.render("volcanos/create", { error: getErrorMessage(error) });
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

router.get("/:volcanosId/details", async (req, res) => {
  const volcanos = await volcanosServices.getOne(req.params.volcanosId);

  if (!volcanos) {
    return res.redirect("/volcanos/catalog");
  }

  const volcanosData = volcanos.toObject();
  const isOwner =
    req.user && volcanosData.owner.toString() === req.user._id.toString();
  const volcanosOwner = volcanos.owner;
  const votes = volcanos.getVotes();
  const hasVoted =
    req.user && votes.some((u) => u.toString() === req.user._id.toString());

  res.render("volcanos/details", {
    ...volcanosData,
    isOwner,
    hasVoted,
    volcanosOwner,
  });
});

router.get("/:volcanosId/vote", isAuth, isOwner, async (req, res) => {
  const volcanosId = req.params.volcanosId;
  const volcanos = await volcanosServices.getOne(volcanosId);

  if (!volcanos) {
    return res.redirect("/volcanos/catalog");
  }

  if (
    !volcanos.voteList.some((id) => id.toString() === req.user._id.toString())
  ) {
    volcanos.voteList.push(req.user._id);
    await volcanos.save();
  }

  res.redirect(`/volcanos/${volcanosId}/details`);
});

router.get("/:volcanosId/edit", isAuth, checkIsOwner, async (req, res) => {
  const volcanosId = req.params.volcanosId;
  let volcanos = await volcanosServices.getOne(volcanosId);
  res.render("volcanos/edit", { ...volcanos.toObject() });
});

router.post("/:volcanosId/edit", isAuth, checkIsOwner, async (req, res) => {
  try {
    const volcanosId = req.params.volcanosId;
    const volcanosData = req.body;
    await volcanosServices.update(volcanosId, volcanosData);
    res.redirect(`/volcanos/${volcanosId}/details`);
  } catch (error) {
    res.render("volcanos/edit", { error: getErrorMessage(error) });
  }
});

router.get("/:volcanosId/delete", isAuth, checkIsOwner, async (req, res) => {
  const volcanosId = req.params.volcanosId;
  await volcanosServices.delete(volcanosId);
  res.redirect("/volcanos/catalog");
});

module.exports = router;
