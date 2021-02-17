const mongodb = require("mongodb");

const { db } = require("../../utils/database-connection/database");

class User {
  constructor(name, fullName, email, password) {
    this.name = name;
    this.fullName = fullName;
    this.profile = { image: null, description: "" };
    this.email = email;
    this.password = password;
  }

  save = () => {
    try {
      return db().collection("users").insertOne(this);
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

  static editProfile = (userId, body, image) => {
    const { name, fullName, description } = body;

    try {
      return db()
        .collection("users")
        .findOneAndUpdate(
          { _id: new mongodb.ObjectId(userId) },
          {
            $set: {
              name: name,
              fullName: fullName,
              profile: { description, image }
            }
          },
          { returnOriginal: false }
        );
    } catch (error) {
      throw error;
    }
  };
}

module.exports = User;
