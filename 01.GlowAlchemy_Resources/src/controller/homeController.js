const router = require("express").Router();

const cosmeticsService = require("../services/cosmeticsServices");

router.get("/", async (req, res) => {
  let cosmetics = await cosmeticsService.findTheThree();
  cosmetics = cosmetics.slice(0, 3);
  res.render("home", { cosmetics });
});

router.get('/search', async (req, res) => {
    let cosmeticsText = req.query.search;
    let cosmetics = await cosmeticsService.search(cosmeticsText);

    if (cosmetics == undefined) {
        cosmetics = await cosmeticsService.getAll();
    }
    res.render('search', { cosmetics })
})

// router.get("/search", async (req, res) => {
//   const cosmeticsText = req.query.search;

//   const cosmetics = await cosmeticsService.search(cosmeticsText);

//   res.render("search", { cosmetics, searchText: cosmeticsText });
// });

module.exports = router;
