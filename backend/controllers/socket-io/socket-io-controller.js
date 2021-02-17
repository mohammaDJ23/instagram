const moment = require("moment");

const Messages = require("../../models/messages/messages-model");
const UsChat = require("../../models/usChat/usChat");

const { findUser } = require("../../utils/controllers-utils/controllers-utils");

const socketHandler = (socket, io) => {
  let user;
  let target;
  let room;

  socket.on("start-chat", async data => {
    const errorText = "could not get valid information, something went wrong.";

    try {
      user = await findUser(data.userId);
      target = await findUser(data.target);

      room = await Messages.getCollection("messages").findOne({
        room: data.room
      });

      room = room.room;
    } catch (error) {
      socket.emit("error", { message: errorText });
      return;
    }

    if (user && target && room) {
      socket.join(data.room);
    } else {
      socket.emit("error", { message: errorText });
    }
  });

  socket.on("send-message", async data => {
    if (room === data.room && user === data.userId && data.value) {
      const value = data.value.trim();
      const mnt = moment().format("llll");

      io.to(data.room).emit("read-chat", {
        message: value,
        id: data.userId,
        date: mnt
      });

      try {
        await Messages.uppdateMessages(data.userId, value, data.room, mnt);
      } catch (err) {
        socket.emit("error", {
          message:
            "could not save any messages in the database, please try again."
        });
      }
    } else {
      socket.emit("error", {
        message:
          "could not send any messages to the user, something went wrong."
      });
    }
  });

  socket.on("us-chat-target", async data => {
    const errorText =
      "could not send messages to target, something went wrong.";

    if (data.target !== target || data.userId !== user) {
      socket.emit("error", { message: errorText });
      return;
    }

    if (data.userId && data.target) {
      let usChatTarget;

      try {
        usChatTarget = await UsChat.getCollection("us-chat").findOne({
          userId: data.target
        });
      } catch (err) {
        socket.emit("error", { message: errorText });
        return;
      }

      if (!usChatTarget) {
        const usChat = new UsChat(data.target);

        try {
          await usChat.save();
        } catch (err) {
          socket.emit("error", {
            message: "could not create document for target, please try again."
          });

          return;
        }
      }

      try {
        await UsChat.updateUsChat(data.target, data.userId);
      } catch (err) {
        socket.emit("error", { message: errorText });
      }
    } else {
      socket.emit("error", { message: errorText });
    }
  });
};

module.exports = socketHandler;
