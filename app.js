require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");

mongoose.connect(process.env.MONGODB);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

app.use(cors());
app.use(express.json());

const userController = require("./controllers/userController");
const { signup, login, getUsers } = userController;

const { verifyToken } = require("./authorization/verifyToken");
const messageController = require("./controllers/messageController");
const { postMessages, getMessages } = messageController;

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to the messaging-app API by Rezha" });
});
app.post("/signup", signup);
app.post("/login", login);
app.get("/users", getUsers);
app.post("/messages", postMessages);
app.get("/messages", getMessages);

// auth testing:
app.get("/protected", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET, (err, authData) => {
    if (err) {
      res.status(403).json({ messge: "unauthorized" });
    } else {
      res.json({
        message: "Congratz, this is a protected route",
        authData,
      });
    }
  });
});

const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
