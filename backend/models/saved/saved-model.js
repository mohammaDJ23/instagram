const { db } = require("../../utils/database-connection/database");

class Saved {
  constructor(userId) {
    this.posts = [];
    this.userId = userId;
  }

  save = () => {
    try {
      return db().collection("saved").insertOne(this);
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

  static updateSaved = async (postId, userId) => {
    const save = {
      $push: {
        posts: {
          isActive: true,
          postId: postId
        }
      }
    };

    const remove = {
      $pull: {
        posts: {
          postId: postId
        }
      }
    };

    try {
      const posts = await db().collection("saved").findOne({ userId: userId });
      const p = posts.posts.find(pst => pst.postId === postId);

      return await db()
        .collection("saved")
        .findOneAndUpdate({ userId: userId }, !p ? save : remove, {
          returnOriginal: false
        });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

module.exports = Saved;
