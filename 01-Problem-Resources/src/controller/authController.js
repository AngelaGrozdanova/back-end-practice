const router = require("express").Router();
const authServices = require("../services/authServices");
const { isGuest, isAuth } = require("../middlewares/authMiddleware");
const { AUTH_COOKIE_NAME } = require("../constants");

router.get("/login", isGuest, (req, res) => {
  res.render("auth/login", { title: "Login Page" });
});

router.post("/login", isGuest, async (req, res) => {
  const { email, password } = req.body;

  try {
    let token = await authServices.login({ email, password });
    res.cookie(AUTH_COOKIE_NAME, token);
    res.redirect("/");
  } catch (error) {
    res.render("auth/login", {
      error: error.message,
      email,
    });
  }
});

router.get("/register", isGuest, (req, res) => {
  res.render("auth/register", { title: "Register Page" });
});

router.post("/register", isGuest, async (req, res) => {
  const { username, email, password, confirmPass } = req.body;

  if (password !== confirmPass) {
    return res.render("auth/register", {
      error: "Passwords do not match",
      username,
      email,
    });
  }
  try {
    await authServices.register({ username, email, password });
    let token = await authServices.login({ email, password });
    res.cookie(AUTH_COOKIE_NAME, token);
    res.redirect("/");
  } catch (error) {
    res.render("auth/register", {
      error: error.message,
      username,
      email,
    });
  }
});

router.get("/logout", isAuth, (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME);
  res.redirect("/");
});

module.exports = router;
