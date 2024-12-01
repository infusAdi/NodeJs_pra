const express = require("express");
const app = express();
const { a, port, connectDB } = require("./database/db");
const { adminAuth } = require("./middleware/auth");
const { validateSignUpData } = require("./utils/validation");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use(express.json()); // This is middleware used for parsing json format
app.use(cookieParser()); // This is middleware used for parsing Cookie format

app.use("/admin", adminAuth); // this is for auth jwt
app.use("/", authRouter); // this is handle all route of Auth
app.use("/", profileRouter); // this is handle all route of Profile
app.use("/", requestRouter); // this is handle all route of request

// Search by email
app.get("/email", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const userByEmail = await User.find({ emailId: emailId });
    if (userByEmail.length === 0) {
      res.status(404).send("User not found....");
    } else {
      res.send(userByEmail);
    }
  } catch (err) {
    res.status(404).send("User not found....");
  }
});
// Search by _Id
app.get("/id", async (req, res) => {
  const id = req.body._id;
  try {
    const userById = await User.find({ _id: id });
    if (userById.length === 0) {
      res.status(404).send("User not found....");
    } else {
      res.send(userById);
    }
  } catch (err) {
    res.status(404).send("User not found....");
  }
});
// delete by _Id
app.delete("/id", async (req, res) => {
  const id = req.body._id;
  try {
    const userById = await User.findByIdAndDelete(id);
    if (userById.length === 0) {
      res.status(404).send("User not found....");
    } else {
      res.send("user deleted successfully");
    }
  } catch (err) {
    res.status(404).send("User not found....");
  }
});
// update by _Id
app.patch("/id/:id", async (req, res) => {
  const id = req.params?.id;
  const body = req.body;

  try {
    // skills validation
    if (body?.skills.length > 10) {
      throw new Error("updating skills more than 10 is not allowed");
    }

    // Allowed fields for updating
    const ALLOWED_UPDATE = ["photoUrl", "age", "gender", "about", "skills"];

    // Validate request body keys
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).send("Request body is empty.");
    }

    const isAllowedUpdate = Object.keys(body).every((key) =>
      ALLOWED_UPDATE.includes(key)
    );

    if (!isAllowedUpdate) {
      return res.status(400).send("Update contains invalid fields.");
    }

    // Find user by ID and update
    const userById = await User.findByIdAndUpdate(id, body, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update against the schema
    });

    // Handle user not found
    if (!userById) {
      return res.status(404).send("User not found.");
    }

    // Success response
    res.status(200).send({
      message: "User updated successfully.",
      user: userById,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err + " An error occurred while updating the user.");
  }
});

// feed all data
app.get("/feed", async (req, res) => {
  try {
    const allData = await User.find({});
    res.send(allData);
  } catch (err) {
    res.send(404).send("User not Data found....");
  }
});

// middleware basic auth with mock token
app.get("/admin/getAllData", (req, res) => {
  try {
    // throw new Error("this is random error");
    res.send([
      { firstName: `${a}`, lastName: "sen" },
      {
        firstName: "priyanshi",
      },
      {
        firstName: "Bakul",
      },
    ]);
  } catch (err) {
    res.status(401).send("Some thing went wrong please contact support");
  }
});
app.get("/admin/data", (req, res) => {
  res.send([{ firstName: `${a}`, lastName: "sen" }]);
});

// Middleware to handle all error in end
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(401).send("something went wrong");
  }
});

// this is initial practice for params and query
app.use(
  "/home/:id",
  (req, res, next) => {
    const { keyword, page, limit } = req.query;
    console.log(keyword, page, limit + " These all are from query");
    res.send([
      { firstName: `${a}`, lastName: "sen" },
      {
        firstName: "priyanshi",
      },
      {
        firstName: "Bakul",
      },
    ]);
    next();
  },
  (req, res, next) => {
    const id = req.params.id;
    console.log(`this is after second call using next home from node ${id}`);
    next();
  },
  (req, res) => {
    console.log("last function call");
  }
);

// setting the connection with DB
connectDB()
  .then(() => {
    console.log("Database is connected successfully.");
    app.listen(port, () => {
      console.log(`The server is running on port ${port} `);
    });
  })
  .catch((err) => {
    console.log(err);
  });
