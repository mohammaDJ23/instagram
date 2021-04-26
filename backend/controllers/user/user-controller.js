const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongodb = require("mongodb");
const randomString = require("randomstring");

const User = require("../../models/user/user-model");
const HttpError = require("../../models/error/http-error-model");
const FollowersFollowing = require("../../models/followers-following/followers-following-models");
const Notice = require("../../models/notice/notice-model");
const Post = require("../../models/post/post-model");
const Saved = require("../../models/saved/saved-model");
const UsChat = require("../../models/usChat/usChat");
const Messages = require("../../models/messages/messages-model");

const {
  assignUsersIsFollowing,
  getFollow,
  getSuggestions,
  checkFollowersFollowing,
  getUser
} = require("../../utils/controllers-utils/controllers-utils");

const db = require("../../utils/database-connection/database");

exports.signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError("invalid inputs passed, please check your data", 422));
  }

  const { name, fullName, email, password } = req.body;
  let findUser;

  try {
    findUser = await User.getCollection("users").findOne({ email: email });
  } catch (error) {
    return next(new HttpError("signing up failed, please try againg later", 500));
  }

  if (findUser) {
    return next(new HttpError("user already exist in the database.", 409));
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("could not be create.", 500));
  }

  const user = new User(name, fullName, email, hashedPassword);

  try {
    await user.save();
  } catch (error) {
    return next(new HttpError("could not be create.", 500));
  }

  res.status(201).json({
    message: "regestered.",
    user: user
  });
};

exports.login = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError("invalid inputs passed, please check your data", 422));
  }

  const { email, password } = req.body;
  let user;

  try {
    user = await User.getCollection("users").findOne({ email: email });
  } catch (error) {
    return next(new HttpError("logging failed, please try againg later", 500));
  }

  if (!user) {
    return next(new HttpError("your email is incorrect please try again.", 403));
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (error) {
    return next(
      new HttpError("could not log you in, please check your credentials and try again", 500)
    );
  }

  if (!isValidPassword) {
    return next(new HttpError("your password is incorrect please try again", 403));
  }

  let token;

  try {
    token = await jwt.sign(
      { userId: user._id.toString(), email: user.email },
      "iuSiosIUSG275678SJDFGJAG",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("could not able to create token, please try again", 500));
  }

  res.status(200).json({
    email: user.email,
    userId: user._id.toString(),
    token: token,
    profile: user.profile.image,
    name: user.name
  });
};

exports.editProfile = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError("invalid inputs passed, please check your data", 422));
  }

  const { userId } = req.params;

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  let profile;

  try {
    const user = await User.getCollection("users").findOne({
      _id: new mongodb.ObjectId(userId)
    });

    if (!user) {
      throw new HttpError("could not find user.");
    }

    if (user.profile.image && user.profile.image !== req.file.path) {
      fs.unlink(path.join(__dirname, "../..", user.profile.image), err => {
        if (err) {
          throw new Error(err);
        }
      });
    }

    profile = await User.editProfile(userId, req.body, req.file.path);
  } catch (error) {
    return next(new HttpError("could not edit profile, something went wrong.", 500));
  }

  res.status(200).json({ message: "profile edited.", profile: profile.value.profile.image });
};

exports.updateFollowersFollowing = async (req, res, next) => {
  const { t } = req.query;
  const { userId, targetUserId } = req.params;

  if (!["FOLLOW", "UNFOLLOW_FOLLOWING", "UNFOLLOW_FOLLOWERS"].includes(t)) {
    return next(new HttpError("could not find a valid query, something went wrong.", 500));
  }

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  let findedUser;

  try {
    findedUser = await User.getCollection("users").findOne({
      _id: new mongodb.ObjectId(targetUserId)
    });
  } catch (error) {
    return next(new HttpError("could not find the target user, something went wrong.", 500));
  }

  if (!findedUser) {
    return next(new HttpError("there is no user with this id in the database.", 403));
  }

  try {
    await checkFollowersFollowing(targetUserId);
  } catch (error) {
    return next(error);
  }

  try {
    const findedUser = await Notice.getCollection("notice").findOne({
      userId: targetUserId
    });

    if (!findedUser) {
      const notice = new Notice(targetUserId);

      try {
        await notice.save();
      } catch (error) {
        throw error;
      }
    }
  } catch (error) {
    return next(
      new HttpError("could not create notice document for the target, please try again.", 500)
    );
  }

  const session = db.client().startSession();

  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" }
  };

  switch (t) {
    case "FOLLOW": {
      let whoFollowed;

      try {
        await session.withTransaction(async () => {
          whoFollowed = await FollowersFollowing.updateFollow(
            userId,
            targetUserId,
            { session },
            "follow"
          );

          await Notice.updateNotice(
            userId,
            targetUserId,
            { session },
            "showUserOnTargetUserNotice"
          );
        }, transactionOptions);
      } catch (error) {
        return next(new HttpError("could not follow the user, please try again.", 500));
      } finally {
        await session.endSession();
      }

      res.status(200).json({ whoFollowed, message: "the target followed" });
      break;
    }
    case "UNFOLLOW_FOLLOWING": {
      let whoUnfollowed;

      try {
        await session.withTransaction(async () => {
          whoUnfollowed = await FollowersFollowing.updateFollow(
            userId,
            targetUserId,
            { session },
            "unfollowFromFollowing"
          );

          await Notice.updateNotice(userId, targetUserId, { session }, "removeUserOnTargetNotice");
        }, transactionOptions);
      } catch (error) {
        return next(new HttpError("could not unfollow the user, please try again.", 500));
      } finally {
        await session.endSession();
      }

      res.status(200).json({ whoUnfollowed, message: "the user unfollowed" });
      break;
    }
    case "UNFOLLOW_FOLLOWERS": {
      let whoUnfollowed;

      try {
        whoUnfollowed = await FollowersFollowing.updateFollow(
          userId,
          targetUserId,
          null,
          "unfollowFromFollowers"
        );
      } catch (error) {
        return next(new HttpError("could not unfollow the user, please try again.", 500));
      }

      res.status(200).json({ whoUnfollowed, message: "the user unfollowed" });
      break;
    }
    default:
      return next(new HttpError("could not found a valid query", 500));
  }
};

exports.profile = async (req, res, next) => {
  const { userId, target } = req.params;

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  let tg;

  try {
    tg = await User.getCollection("users").findOne({
      _id: new mongodb.ObjectId(target)
    });
  } catch (error) {
    return next(new HttpError("could not found user id, please try again", 500));
  }

  if (!tg) {
    return next(new HttpError("there is no user with this id, something went wrong", 403));
  }

  let user;
  let followers;
  let following;
  let svd;
  let psts;
  let postC;
  let followC;
  let isFollowing;

  try {
    isFollowing = await FollowersFollowing.getCollection("followers-following")
      .aggregate([
        { $match: { userId: userId } },
        {
          $project: {
            _id: 0,
            user: {
              $indexOfArray: ["$following.following", target, 0]
            }
          }
        }
      ])
      .toArray();

    user = await User.getCollection("users")
      .aggregate([
        { $match: { _id: new mongodb.ObjectId(target) } },
        {
          $project: {
            _id: 0,
            userId: { $toString: "$_id" },
            name: "$name",
            profile: "$profile.image",
            fullName: "$fullName",
            description: "$profile.description"
          }
        }
      ])
      .toArray();

    const followInfo = {
      $project: {
        _id: 0,
        userId: { $toString: "$additionInfo._id" },
        profile: "$additionInfo.profile.image",
        name: "$additionInfo.name"
      }
    };

    followers = await FollowersFollowing.getCollection("followers-following")
      .aggregate([
        { $match: { userId: target } },
        {
          $addFields: {
            newField: {
              $map: {
                input: "$followers.followers",
                in: {
                  $toObjectId: "$$this"
                }
              }
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "newField",
            foreignField: "_id",
            as: "additionInfo"
          }
        },
        { $unwind: "$additionInfo" },
        followInfo
      ])
      .toArray();

    following = await FollowersFollowing.getCollection("followers-following")
      .aggregate([
        { $match: { userId: target } },
        {
          $addFields: {
            newField: {
              $map: {
                input: "$following.following",
                in: {
                  $toObjectId: "$$this"
                }
              }
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "newField",
            foreignField: "_id",
            as: "additionInfo"
          }
        },
        { $unwind: "$additionInfo" },
        followInfo
      ])
      .toArray();

    const lookupLCC = [
      {
        $lookup: {
          from: "likes-comments",
          localField: "postId",
          foreignField: "postId",
          as: "posts"
        }
      },
      { $unwind: "$posts" },
      {
        $project: {
          postId: 1,
          image: 1,
          likesC: { $size: "$posts.like.likes" },
          commentsC: { $size: "$posts.comment.comments" }
        }
      },
      {
        $sort: {
          postId: -1
        }
      }
    ];

    svd = await Saved.getCollection("saved")
      .aggregate([
        { $match: { userId: target } },
        {
          $addFields: {
            newField: {
              $map: {
                input: "$posts",
                in: {
                  $toObjectId: "$$this.postId"
                }
              }
            }
          }
        },
        {
          $lookup: {
            from: "posts",
            localField: "newField",
            foreignField: "_id",
            as: "additionInfo"
          }
        },
        { $unwind: "$additionInfo" },
        {
          $project: {
            _id: 0,
            postId: { $toString: "$additionInfo._id" },
            image: "$additionInfo.image"
          }
        },
        ...lookupLCC
      ])
      .toArray();

    psts = await Post.getCollection("posts")
      .aggregate([
        { $match: { userId: target } },
        {
          $project: {
            _id: 0,
            postId: { $toString: "$_id" },
            image: "$image"
          }
        },
        ...lookupLCC
      ])
      .toArray();

    postC = await Post.getCollection("posts")
      .aggregate([{ $match: { userId: target } }, { $count: "posts" }])
      .toArray();

    followC = await FollowersFollowing.getCollection("followers-following")
      .aggregate([
        { $match: { userId: target } },
        {
          $project: {
            _id: 0,
            followers: { $size: "$followers.followers" },
            following: { $size: "$following.following" }
          }
        }
      ])
      .toArray();
  } catch (error) {
    return next(
      new HttpError("could not found any information about user, please try agian.", 500)
    );
  }

  let newFollow;

  try {
    newFollow = await assignUsersIsFollowing({ posts: [], following, followers, sug: [] }, userId);
  } catch (error) {
    return next(
      new HttpError("could not compare some information about the user, please try again", 500)
    );
  }

  if (isFollowing[0].user === -1) {
    isFollowing = false;
  } else {
    isFollowing = true;
  }

  const posts = { userId: target, posts: psts };
  const saved = { userId: target, saved: svd };

  const usr = {
    ...user[0],
    posts: postC.length > 0 ? postC[0].posts : 0,
    followers: followC.length > 0 ? followC[0].followers : 0,
    following: followC.length > 0 ? followC[0].following : 0
  };

  const data = {
    saved,
    posts,
    user: usr,
    followers: newFollow.followers,
    following: newFollow.following,
    isFollowing
  };

  res.status(200).json({ ...data, message: "all information fetched" });
};

exports.suggestions = async (req, res, next) => {
  const { userId } = req.params;

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  let follow;
  let sug;

  try {
    follow = await getFollow(userId);
    follow[0].users.push(userId);
    follow = [...new Set(follow[0].users)].map(u => new mongodb.ObjectId(u));

    sug = await User.getCollection("users")
      .aggregate([...getSuggestions(follow)])
      .toArray();
  } catch (error) {
    return next(new HttpError("could not found any suggestions, please try again", 500));
  }

  let newSuggestions;

  try {
    newSuggestions = await assignUsersIsFollowing(
      { posts: [], following: [], followers: [], sug },
      userId
    );
  } catch (error) {
    return next(
      new HttpError("could not compare some information about the user, please try again", 500)
    );
  }

  res.status(200).json({
    suggestions: newSuggestions.sug,
    message: "all suggestions fetched"
  });
};

exports.notice = async (req, res, next) => {
  const { userId } = req.params;

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  let notice;

  try {
    notice = await Notice.getCollection("notice")
      .aggregate([
        { $match: { userId: userId } },
        {
          $project: {
            _id: 0,
            users: "$requestToFollow"
          }
        },
        {
          $project: {
            users: {
              $map: {
                input: "$users",
                as: "item",
                in: { $toObjectId: "$$item" }
              }
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "users",
            foreignField: "_id",
            as: "usersInfo"
          }
        },
        { $unwind: "$usersInfo" },
        {
          $project: {
            name: "$usersInfo.name",
            profile: "$usersInfo.profile.image",
            userId: { $toString: "$usersInfo._id" }
          }
        },
        {
          $sort: {
            userId: -1
          }
        }
      ])
      .toArray();
  } catch (error) {
    return next(new HttpError("could not found any notice, please try again", 500));
  }

  let newNotice;

  try {
    newNotice = await assignUsersIsFollowing(
      { posts: [], following: [], followers: [], sug: notice },
      userId
    );
  } catch (error) {
    return next(
      new HttpError("could not compare some information about the user, please try again", 500)
    );
  }

  res.status(200).json({ users: newNotice.sug, message: "all notice fetched" });
};

exports.users = async (req, res, next) => {
  const { userId } = req.params;
  const { equalTo } = req.query;

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  let indexes;
  let users;

  try {
    indexes = await User.getCollection("users").indexes();

    if (indexes.length <= 1) {
      try {
        await User.getCollection("users").createIndex({ name: "text" });
      } catch (error) {
        throw error;
      }
    }

    users = await User.getCollection("users")
      .aggregate([
        {
          $match: {
            $text: {
              $search: equalTo.toString().trim().toLowerCase()
            }
          }
        },
        {
          $project: {
            userId: {
              $toString: "$_id"
            },
            name: "$name",
            profile: "$profile.image"
          }
        },
        {
          $sort: {
            userId: -1
          }
        },
        { $limit: 50 }
      ])
      .toArray();
  } catch (error) {
    return next(new HttpError("could not found any users, please try again", 500));
  }

  res.status(200).json({ users, message: "users fetched" });
};

exports.chat = async (req, res, next) => {
  const { userId } = req.params;

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  let usChatUsers;

  try {
    usChatUsers = await UsChat.getCollection("us-chat").findOne({
      userId: userId
    });

    if (!usChatUsers) {
      usChatUsers = new UsChat(userId);

      try {
        await usChatUsers.save();
      } catch (error) {
        throw error;
      }
    }

    usChatUsers = usChatUsers.users.map(user => new mongodb.ObjectId(user));

    usChatUsers = await User.getCollection("users")
      .aggregate([
        { $match: { _id: { $in: usChatUsers } } },
        {
          $project: {
            _id: 0,
            userId: { $toString: "$_id" },
            name: "$name",
            profile: "$profile.image"
          }
        }
      ])
      .toArray();
  } catch (error) {
    return next(new HttpError("could not found any users, please try again.", 500));
  }

  res.status(200).json({ users: usChatUsers, message: "all users fetched." });
};

exports.startChat = async (req, res, next) => {
  const { userId, target } = req.params;

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  let findedUser;

  try {
    findedUser = await User.getCollection("users").findOne({
      _id: new mongodb.ObjectId(target)
    });
  } catch (error) {
    return next(new HttpError("could not found the target, please try again.", 500));
  }

  if (!findedUser) {
    return next(new HttpError("target not exist in the database, something went wrong.", 403));
  }

  let user;
  let trgt;

  try {
    user = await getUser(userId);
    trgt = await getUser(target);
  } catch (error) {
    return next(new HttpError("could not found information about users, please try again.", 50));
  }

  if (target === req.userId) {
    return res.status(200).json({
      message: "you can't chat with yourself",
      user: {},
      target: {},
      messages: [],
      room: ""
    });
  }

  try {
    await UsChat.updateUsChat(userId, target);
  } catch (error) {
    return next(new HttpError("could not update chat-list document, please try again.", 500));
  }

  let msgs;
  let room;

  try {
    const messages = await Messages.getCollection("messages").findOne({
      users: { $all: [userId.toString(), target.toString()] }
    });

    msgs = messages ? messages.messages : null;
    room = messages ? messages.room : null;
  } catch (error) {
    return next(new HttpError("could not create message collection, something went wrong.", 500));
  }

  if (!msgs) {
    room = randomString.generate();
    const message = new Messages(userId, target, room);
    msgs = message.messages;

    try {
      await message.save();
    } catch (error) {
      return next(new HttpError("could not create message collection, something went wrong.", 500));
    }
  }

  res.status(200).json({ messages: msgs, room, user: user[0], target: trgt[0] });
};
