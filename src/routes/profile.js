const express = require("express");
const { adminAuth } = require("../middleware/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();

// Profile Page view
profileRouter.get("/profile/view", adminAuth, async (req, res) => {
  try {
    const userProfile = req.user;
    res.send(userProfile);
  } catch (err) {
    res.status(401).send("invalid credentials ");
  }
});
// Profile Page edit
profileRouter.patch("/profile/edit", adminAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid User validation");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile is updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = profileRouter;
