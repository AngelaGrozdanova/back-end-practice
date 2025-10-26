const router = require("express").Router();

const homeController = require("./controller/homeController");
const authController = require("./controller/authController");
const mythsController = require("./controller/mythsController");

router.use("/", homeController);
router.use("/auth", authController);
router.use("/myths", mythsController);

router.use((req, res) => {
  res.status(404).render("404");
});

module.exports = router;
