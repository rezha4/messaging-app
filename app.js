import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";

mongoose.connect(process.env.MONGODB);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

app.use(cors());
app.use(express.json());

import { signup, login, getUsers } from "./controllers/userController";
import { verifyToken } from "./authorization/verifyToken";
import { postMessages, getMessages } from "./controllers/messageController";

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

app.listen(process.env.PORT, () => {
  console.log(`App is listening on port: ${process.env.PORT}`);
});
