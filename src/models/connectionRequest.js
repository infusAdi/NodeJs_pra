const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref : "User"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref : "User"
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepeted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);
ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
ConnectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("cannot send request to self");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "connectionRequest",
  ConnectionRequestSchema
);

module.exports = ConnectionRequestModel;
