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
  const { sender, receiver } = req.body;
  try {
    const messages = await Message.find({ sender, receiver });
    return res.status(200).json({ messages });
  } catch (error) {
    return next(error);
  }
};
