import Chat from "../Models/chatModel.js";

export const accessChat = async (req, res) => {
  console.log("inside access chat");
  const { userId, doctorId } = req.body;
  console.log(userId, doctorId);

  if (!userId) {
    console.log("User not found");
    return res.status(400);
  }

  try {
    // Find a chat where the doctor's ID matches doctorId and the user's ID matches userId
    let isChat = await Chat.findOne({
      "users.doctor": doctorId,
      "users.user": userId,
    })
      .populate("users.user", "-password") // Populate the "user" references
      .populate("users.doctor", "-password") // Populate the "doctor" references
      .populate("latestMessage");
    console.log(isChat);
    // If a chat exists, send it
    if (isChat) {
      console.log(isChat);
      res.status(200).json(isChat);
    } else {
      // If a chat doesn't exist, create a new one
      const chatData = {
        chatName: "sender",
        users: {
          doctor: doctorId,
          user: userId,
        },
      };

      const createdChat = await Chat.create(chatData);
      console.log(createdChat);

      // Populate the "users" field in the created chat

      const FullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("users.user", "-password")
        .populate("users.doctor", "-password")
        .populate("latestMessage")
        .populate({
          path: "latestMessage",
          populate: {
            path: "sender.doctor" ? "sender.doctor" : "sender.user",
            select: "-password",
          },
        });
      console.log(FullChat, "full");
      res.status(200).json(FullChat);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
