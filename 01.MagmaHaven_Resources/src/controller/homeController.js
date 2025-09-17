const router = require("express").Router();

const volcanosService = require("../services/volcanosServices");

router.get("/", async (req, res) => {
  let volcanos = await volcanosService.findTheThree();
  volcanos = volcanos.slice(0, 3);
  res.render("home", { volcanos });
});

router.get("/search", async (req, res) => {
  const searchText = req.query.search || "";
  const typeVolcano = req.query.typeVolcano || "All";

  let volcanos = await volcanosService.search(searchText, typeVolcano);

  res.render("search", {
    volcanos,
    searchText,
    searchType: typeVolcano,
  });
});

module.exports = router;
