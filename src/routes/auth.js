const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(401).send("invalid error " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    // console.log(user)
    if (!user) {
      throw new Error("User is invalid");
    }
    const compareHashedPassword = await user.validatePassword(password);
    const token = await user.getJWT();
    console.log(token);
    if (!compareHashedPassword) {
      throw new Error("Password is invalid");
    } else {
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("user login successfully " + user.firstName);
    }
  } catch (err) {
    res.status(401).send("invalid credentials " + err.message);
  }
});
module.exports = authRouter;
