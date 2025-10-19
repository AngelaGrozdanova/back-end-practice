const router = require("express").Router();

const homeController = require("./controller/homeController");
const authController = require("./controller/authController");
const carsController = require("./controller/carsController");

router.use("/", homeController);
router.use("/auth", authController);
router.use("/cars", carsController);

router.use((req, res) => {
  res.status(404).render("404");
});

module.exports = router;
