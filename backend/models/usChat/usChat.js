const { db } = require("../../utils/database-connection/database");

class UsChat {
  constructor(userId) {
    this.users = [];
    this.userId = userId;
  }

  save = () => {
    try {
      return db().collection("us-chat").insertOne(this);
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

  static updateUsChat = async (userId, target) => {
    try {
      const findedUser = await db()
        .collection("us-chat")
        .findOne({ userId: userId });

      const targetInUsChat = findedUser.users.findIndex(u => u === target);

      if (targetInUsChat > -1) {
        return { exist: true };
      }

      return await db()
        .collection("us-chat")
        .updateOne({ userId: userId }, { $addToSet: { users: target } });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = UsChat;
