import express from "express";
const router = express.Router();
import passport from "passport";
import User from "../models/user";
import bcrypt from "bcryptjs";

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

router.post("/signup", async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "fields cannot be empty" });
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    const result = await user.save();
    res.redirect("/");
  } catch (error) {
    return next(error);
  }
});

export default router;
