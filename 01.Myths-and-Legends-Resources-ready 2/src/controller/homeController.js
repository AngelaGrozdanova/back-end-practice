const router = require("express").Router();

const mythsService = require("../services/mythsServices");

router.get("/", async (req, res) => {
  let myths = await mythsService.findTheThree();
  myths = myths.slice(0, 3);
  res.render("home", { myths });
});

router.get("/report", async (req, res) => {
  try {
    let myths = await mythsService.findTheThreeWithOwner();
    myths = myths.slice(0, 3).map((m) => ({
      ...m,
      createdAtFormatted: new Date(m.createdAt).toLocaleDateString("en-GB"),
      ownerEmail: m.owner?.email || "Unknown",
    }));
    res.render("report", { myths });
  } catch (error) {
    console.error(error);
    res.render("report", { myths: [], error: "Error loading report!" });
  }
});
module.exports = router;
