import Message from "../models/message";

export const postMessages = (req, res, next) => {
  res.status(200).json({ message: "message created" });
};

export const getMessages = (req, res, next) => {
  res.status(200).json({ message: "message fetched" });
};
