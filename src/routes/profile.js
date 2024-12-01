const express = require("express");
const { adminAuth } = require("../middleware/auth");
const profileRouter = express.Router();

// Profile Page
profileRouter.get("/profile", adminAuth, async (req, res) => {
  try {
    const userProfile = req.user;
    res.send(userProfile);
  } catch (err) {
    res.status(401).send("invalid credentials ");
  }
});

module.exports = profileRouter;
