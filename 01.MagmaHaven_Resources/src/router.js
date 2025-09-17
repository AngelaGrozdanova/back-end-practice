const router = require("express").Router();

const homeController = require("./controller/homeController");
const authController = require("./controller/authController");
const volcanosController = require("./controller/volcanosController");

router.use("/", homeController);
router.use("/auth", authController);
router.use("/volcanos", volcanosController);

router.use((req, res) => {
  res.status(404).render("404");
});

module.exports = router;
