const { db } = require("../../utils/database-connection/database");

class Messages {
  constructor(userId, target, room) {
    this.room = room;
    this.users = [userId, target];
    this.messages = [];
  }

  save = () => {
    try {
      return db().collection("messages").insertOne(this);
    } catch (error) {
      throw error;
    }
  };

  static getCollection = collection => {
    try {
      return db().collection(collection);
    } catch (error) {
      throw error;
    }
  };

  static uppdateMessages = async (userId, message, room, date) => {
    const database = db().collection("messages");

    try {
      const findedMessages = await database.findOne({ room: room });

      if (!findedMessages) {
        return { exist: false };
      }

      return await database.updateOne(
        { room: room },
        { $push: { messages: { id: userId, message: message, date } } }
      );
    } catch (error) {
      throw error;
    }
  };
}

module.exports = Messages;
