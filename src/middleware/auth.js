const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = async (req, res, next) => {
  try {
    console.log("admin auth checked");
    const { token } = req.cookies;
    console.log(token);
    const isValidAuthId = jwt.verify(token, "Aditya@0122");
    const user = await User.findById(isValidAuthId);
    console.log(user + "  User from middleware");

    if (!isValidAuthId) {
      res.status(401).send("Invalid User");
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(400).send("Err Message " + err);
  }
};

module.exports = { adminAuth };
