const { db } = require("../../utils/database-connection/database");

class FollowersFollowing {
  constructor(userId) {
    this.following = { quantity: 0, following: [] };
    this.followers = { quantity: 0, followers: [] };
    this.userId = userId;
  }

  save = () => {
    try {
      return db().collection("followers-following").insertOne(this);
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

  static updateFollow = async (userId, targetUserId, session, typeOfFollow) => {
    const database = db().collection("followers-following");
    let updateUserFollow;
    let updateTargetFollow;

    if (typeOfFollow === "follow") {
      updateUserFollow = {
        $inc: { "following.quantity": 1 },
        $push: { "following.following": targetUserId }
      };

      updateTargetFollow = {
        $inc: { "followers.quantity": 1 },
        $push: { "followers.followers": userId }
      };
    }

    if (typeOfFollow === "unfollowFromFollowing") {
      updateUserFollow = {
        $inc: { "following.quantity": -1 },
        $pull: { "following.following": targetUserId }
      };

      updateTargetFollow = {
        $inc: { "followers.quantity": -1 },
        $pull: { "followers.followers": userId }
      };
    }

    if (typeOfFollow === "unfollowFromFollowers") {
      updateUserFollow = {
        $inc: { "following.quantity": -1 },
        $pull: { "following.following": targetUserId }
      };

      updateTargetFollow = {
        $inc: { "followers.quantity": -1 },
        $pull: { "followers.followers": userId }
      };
    }

    let user;
    let target;

    try {
      user = await database.findOneAndUpdate(
        { userId: userId },
        updateUserFollow,
        session
      );

      target = await database.findOneAndUpdate(
        { userId: targetUserId },
        updateTargetFollow,
        session
      );
    } catch (error) {
      throw error;
    }

    return { user, target };
  };
}

module.exports = FollowersFollowing;
