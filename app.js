/*
 * Package Imports
 */

const path = require("path");
require("dotenv").config();
const express = require("express");
const passport = require("passport");
const partials = require("express-partials");
const session = require("express-session");
require("./config/passport");
const app = express();
const PORT = 3000;

/*
 *  Express Project Setup
 */
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(partials());
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(
  session({
    secret: "codecademy",
    saveUninitialized: false,
    resave: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
/*
 * Routes
 */
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get("/account", ensureAuthenticated, (req, res) => {
  res.render("account", { user: req.user });
});

app.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user"],
  })
);
app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);
/*
 * Listener
 */

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

/*
 * ensureAuthenticated Callback Function
 */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
