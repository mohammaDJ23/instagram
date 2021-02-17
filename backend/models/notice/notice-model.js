const { db } = require("../../utils/database-connection/database");

class Notice {
  constructor(userId) {
    this.requestToFollow = [];
    this.userId = userId;
  }

  save = () => {
    try {
      return db().collection("notice").insertOne(this);
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

  static updateNotice = async (userId, targetUserId, session, typeOfNotice) => {
    const database = db().collection("notice");
    let updateNotice;

    if (typeOfNotice === "showUserOnTargetUserNotice") {
      updateNotice = [
        { userId: targetUserId },
        { $push: { requestToFollow: userId } }
      ];
    }

    if (typeOfNotice === "removeUserOnTargetNotice") {
      updateNotice = [
        { userId: targetUserId },
        { $pull: { requestToFollow: userId } }
      ];
    }

    let notice;

    try {
      notice = await database.updateOne(...updateNotice, session && session);
    } catch (error) {
      throw error;
    }

    return notice;
  };
}

module.exports = Notice;
