const express = require("express");
const { adminAuth } = require("../middleware/auth");
const requestRouter = express.Router();

// ConnectionRequest Page
requestRouter.post("/sendConnectionRequest", adminAuth, async (req, res) => {
  try {
    const userProfile = req.user;
    res.send("Connection request is send by " + userProfile.firstName);
  } catch (err) {
    res.status(401).send("invalid credentials ");
  }
});

module.exports = requestRouter;
