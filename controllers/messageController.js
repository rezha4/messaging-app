import mongoose from "mongoose";
import Message from "../models/message";

export const postMessages = async (req, res, next) => {
  try {
    const { sender, receiver, message } = req.body;
    const newMessage = new Message({
      sender,
      receiver,
      message,
    });
    await newMessage.save();
    return res.status(200).json({ message: "message sent" });
  } catch (error) {
    return next(error);
  }
};

export const getMessages = async (req, res, next) => {
  const { sender, receiver } = req.query;
  try {
    const messages = await Message.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    });
    return res.status(200).json({ messages });
  } catch (error) {
    return next(error);
  }
};
