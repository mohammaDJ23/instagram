const { db } = require("../../utils/database-connection/database");

class LikesComments {
  constructor(postId) {
    this.like = { quantity: 0, likes: [] };
    this.comment = { quantity: 0, comments: [] };
    this.postId = postId;
  }

  save = () => {
    try {
      return db().collection("likes-comments").insertOne(this);
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

  static updateLikesComments = async (postId, userId, type, comment) => {
    const getCollection = db().collection("likes-comments");

    const addLike = {
      $inc: { "like.quantity": 1 },
      $push: { "like.likes": { userId, isActive: true } }
    };

    const removeLike = {
      $inc: { "like.quantity": -1 },
      $pull: { "like.likes": { userId } }
    };

    const addComment = {
      $inc: { "comment.quantity": 1 },
      $push: {
        "comment.comments": {
          userId,
          comment: comment && comment.trim()
        }
      }
    };

    try {
      const lc = await getCollection.findOne({ postId: postId });
      const likes = lc.like.likes.find(u => u.userId === userId);

      return await getCollection.findOneAndUpdate(
        { postId: postId },
        type === "likes" ? (!likes ? addLike : removeLike) : addComment,
        { returnOriginal: false }
      );
    } catch (error) {
      throw error;
    }
  };

  static deleteLikesComments = async (postId, session) => {
    try {
      return await db()
        .collection("likes-comments")
        .findOneAndDelete({ postId: postId }, session && session);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = LikesComments;
