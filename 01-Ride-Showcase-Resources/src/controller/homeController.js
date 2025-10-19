const router = require("express").Router();
const carsService = require("../services/carsServices");
const { isAuth } = require("../middlewares/authMiddleware");

router.get("/", async (req, res) => {
  let cars = await carsService.findTheThree();
  cars = cars.slice(0, 3);
  res.render("home", { cars });
});

router.get("/my-posts", isAuth, async (req, res) => {
  const userId = req.user._id;

  const myCars = await carsService.getByOwner(userId);

  res.render("my-posts", { myCars });
});

module.exports = router;
