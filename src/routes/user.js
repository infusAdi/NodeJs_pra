const express = require("express");
const userRouter = express.Router();
const { adminAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

userRouter.get("/user/requests/received", adminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId","firstName lastName photoUrl age gender about skills")
    

    res.json({ message: "Total recieved Request.", data: connectionRequest });
  } catch (err) {
    res.status(404).send("Error " + err.message);
  }
});

module.exports = userRouter;
