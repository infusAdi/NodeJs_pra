const express = require("express");
const userRouter = express.Router();
const { adminAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/user/requests/received", adminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const USER_SAFE_DATA =
      "firstName lastName photoUrl age gender about skills";

    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      USER_SAFE_DATA
    );

    res.json({ message: "Total recieved Request.", data: connectionRequest });
  } catch (err) {
    res.status(404).send("Error " + err.message);
  }
});

userRouter.get("/user/connections", adminAuth, async(req,res)=>{
 try{ const loginUser = req.user._id

  const connectionRequest = await ConnectionRequestModel.find({
    or : [
      {fromUserId : loginUser, status : "accepeted"}

    ]
  })}catch(err){
    res.status(400).send("ERR : " + err.message)
  }
})

module.exports = userRouter;
