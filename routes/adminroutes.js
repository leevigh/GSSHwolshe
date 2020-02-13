const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isUserAuthenticated } = require("../config/customFunctions");
const { admin, details, users } = require("../controllers/admincontroller");
const passport = require("passport");

router.all("/*", isUserAuthenticated, (req, res, next) => {
  req.app.locals.layout = "admin";

  next();
});

router.route("/admin").get(adminController.admin);

router.route("/details").get(adminController.details);

router.route("/users").get(adminController.users);

module.exports = router;
