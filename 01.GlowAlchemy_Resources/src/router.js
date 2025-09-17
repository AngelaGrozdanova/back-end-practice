const router = require("express").Router();

const homeController = require("./controller/homeController");
const authController = require("./controller/authController");
const cosmeticsController = require("./controller/cosmeticsController");

router.use("/", homeController);
router.use("/auth", authController);
router.use("/cosmetics", cosmeticsController);

router.use((req, res) => {
  res.status(404).render("404");
});

module.exports = router;
