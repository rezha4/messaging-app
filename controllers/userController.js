import "dotenv/config";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const exist = await User.findOne({ username });
    if (!exist) {
      bcrypt.hash(password, 10, async (error, hashedPassword) => {
        if (!error) {
          const user = new User({
            username,
            password: hashedPassword,
          });
          await user.save();
          return res.status(200).json({ message: "signed up succesfully" });
        } else {
          return res.status(500).json(error);
        }
      });
    } else {
      return res.status(401).json("username already exist");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "username doesn't exist" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "wrong password" });
    }
    const opts = {};
    opts.expiresIn = "1d";
    const secret = process.env.SECRET;
    const token = jwt.sign({ user: user._id }, secret, opts);
    return res.status(200).json({ user, token });
  } catch (error) {
    return next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (error) {
    return next(error);
  }
};
