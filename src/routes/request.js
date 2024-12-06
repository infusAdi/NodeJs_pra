// const express = require("express");
// const { adminAuth } = require("../middleware/auth");
// const requestRouter = express.Router();
// const ConnectionRequestModel = require("../models/connectionRequest");
// const User = require("../models/user");
// // ConnectionRequest Page
// requestRouter.post(
//   "/request/send/:status/:toUserId",
//   adminAuth,
//   async (req, res) => {
//     try {
//       const fromUserId = req.user._id;
//       const toUserId = req.params.toUserId.toString();
//       console.log(fromUserId);
//       const status = req.params.status;
//       const isAllowed = ["interested", "ignored"];
//       // for checking proper status is passed
//       if (!isAllowed.includes(status)) {
//         return res
//           .status(404)
//           .json({ message: "invalid status type " + status });
//       }
//       // checking to userid exist or not

//       const toUserIdCheck = await User.findById(toUserId);
//       if (!toUserIdCheck) {
//         return res.status(404).json({ message: "user not found" });
//       }

//       // for checking that same req is not repeated
//       const connectionRequestCheck = await ConnectionRequestModel.findOne({
//         $or: [
//           { fromUserId, toUserId },
//           {
//             fromUserId: toUserId,
//             toUserId: fromUserId,
//           },
//         ],
//       });
//       if (connectionRequestCheck) {
//         return res
//           .status(404)
//           .json({ message: "connection request already existed" });
//       }
//       const ConnectionRequest = new ConnectionRequestModel({
//         fromUserId,
//         toUserId,
//         status,
//       });
//       const data = await ConnectionRequest.save();
//       res.json({
//         message: "Connection request is send by " + req.user.firstName,
//         data,
//       });
//     } catch (err) {
//       res.status(400).send("Error " + err.message);
//     }
//   }
// );

// requestRouter.post(
//   "/request/review/:status/:requestId",
//   adminAuth,
//   async (req, res) => {
//     try {
//       const loggedInUser = req.user;
//       const { status, requestId } = req.params;

//       const allowedStatus = ["accepted", "ignored"];
//       if (!allowedStatus.includes(status)) {
//         return res.status(401).send("Invalid Status Provided");
//       }

//       const validRequestId = await ConnectionRequestModel.findOne({ requestId });
//       if (!validRequestId) {
//         res.status(404).send({ message: "Invalid User request id" });
//       }

//       const connectionRequest = await ConnectionRequestModel.findOne({
//         _id: requestId,
//         toUserId: loggedInUser._id,
//         status: "interested",
//       });
//       connectionRequest.status = status;
//       const data = connectionRequest.save();

//       res.json({ message: "Status" }, data);
//     } catch (err) {
//       res.status(404).send("Error" + err.message);
//     }
//   }
// );

// module.exports = requestRouter;
const express = require("express");
const { adminAuth } = require("../middleware/auth");
const requestRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

// ConnectionRequest Page
requestRouter.post(
  "/request/send/:status/:toUserId",
  adminAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId.toString();
      const status = req.params.status;

      const isAllowed = ["interested", "ignored"];
      if (!isAllowed.includes(status)) {
        return res.status(400).json({ message: `Invalid status type: ${status}` });
      }

      // Check if the target user exists
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check for duplicate connection requests
      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).json({ message: "Connection request already exists" });
      }

      // Create a new connection request
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const savedRequest = await connectionRequest.save();
      res.json({
        message: `Connection request sent by ${req.user.firstName}`,
        data: savedRequest,
      });
    } catch (err) {
      res.status(500).send({ message: `Error: ${err.message}` });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  adminAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepeted", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send({ message: "Invalid status provided" });
      }

      // Validate request ID and check ownership
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).send({ message: "Connection request not found" });
      }

      // Update the status
      connectionRequest.status = status;
      const updatedRequest = await connectionRequest.save();

      res.json({
        message: "Status updated successfully",
        data: updatedRequest,
      });
    } catch (err) {
      res.status(500).send({ message: `Error: ${err.message}` });
    }
  }
);

module.exports = requestRouter;
