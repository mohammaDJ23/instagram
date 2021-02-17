const mongodb = require("mongodb");

const { db } = require("../../utils/database-connection/database");

class Post {
  constructor(address, description, image, userId) {
    this.address = address;
    this.description = description;
    this.image = image;
    this.userId = userId;
  }

  save = session => {
    try {
      return db()
        .collection("posts")
        .insertOne(this, session && session);
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

  static updatePost = (postId, body, image) => {
    const { address, description } = body;

    try {
      return db()
        .collection("posts")
        .updateOne(
          { _id: new mongodb.ObjectId(postId) },
          {
            $set: {
              address: address,
              description: description,
              image: image
            }
          }
        );
    } catch (error) {
      throw error;
    }
  };

  static deletePost = async (postId, userId, session) => {
    try {
      return db()
        .collection("posts")
        .findOneAndDelete(
          {
            _id: new mongodb.ObjectId(postId),
            userId: userId
          },
          session && session
        );
    } catch (error) {
      throw error;
    }
  };
}

module.exports = Post;
