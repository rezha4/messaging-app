import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

mongoose.connect(process.env.MONGODB);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

import User from "./models/user";
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(
  session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

import userRouter from "./routes/userRoute";
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.json({ message: "hello from index", user: req.user });
});

app.listen(process.env.PORT, () => {
  console.log(`App is listening on port: ${process.env.PORT}`);
});
