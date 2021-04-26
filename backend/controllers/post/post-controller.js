const fs = require("fs");
const path = require("path");

const mongodb = require("mongodb");

const Post = require("../../models/post/post-model");
const LikesComments = require("../../models/likes-comments/likes-comments-model");
const HttpError = require("../../models/error/http-error-model");
const Saved = require("../../models/saved/saved-model");
const User = require("../../models/user/user-model");
const FollowersFollowing = require("../../models/followers-following/followers-following-models");

const {
  getSuggestions,
  getFollow,
  assignUsersIsFollowing,
  checkFollowersFollowing,
  getName,
  getPsts,
  getSaved
} = require("../../utils/controllers-utils/controllers-utils");

const db = require("../../utils/database-connection/database");

exports.getPosts = async (req, res, next) => {
  const { userId } = req.params;

  if (!req.query.quantity && !req.query.scrollNo) {
    return next(new HttpError("could not found valid query, something went wrong."));
  }

  const { quantity, scrollNo } = req.query;

  if (quantity <= 0 || quantity >= 10) {
    return next(new HttpError("please enter standard quantity, something went wrong."));
  }

  if (scrollNo <= 0) {
    return next(new HttpError("please enter valid number to get posts, something went wrong."));
  }

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server.", 401));
  }

  try {
    await checkFollowersFollowing(userId);
  } catch (error) {
    return next(error);
  }

  let userSaved;

  try {
    userSaved = await Saved.getCollection("saved").findOne({ userId: userId });
  } catch (error) {
    return next(new HttpError("could not found posts you saved them, please try again.", 500));
  }

  if (!userSaved) {
    const saved = new Saved(userId);

    try {
      await saved.save();
    } catch (error) {
      return next(
        new HttpError("could not create a collection in the database, please try again", 500)
      );
    }
  }

  let user;
  let following;
  let posts;
  let follow;
  let fewSug;
  let saved;

  try {
    user = await User.getCollection("users")
      .aggregate([
        { $match: { _id: new mongodb.ObjectId(userId) } },
        {
          $project: {
            _id: 0,
            userId: { $convert: { input: "$_id", to: "string" } },
            profile: "$profile.image",
            name: "$name",
            fullName: "$fullName"
          }
        }
      ])
      .toArray();

    following = await FollowersFollowing.getCollection("followers-following")
      .aggregate([
        { $match: { userId: userId } },
        {
          $project: {
            _id: 0,
            following: "$following.following"
          }
        }
      ])
      .toArray();

    following[0].following.push(userId);

    posts = await getPsts(
      { $match: { userId: { $in: following[0].following.map(u => u) } } },
      { postsOp: true, quantity, scrollNo }
    );

    follow = await getFollow(userId);
    follow[0].users.push(userId);
    follow = [...new Set(follow[0].users)].map(u => new mongodb.ObjectId(u));

    fewSug = await User.getCollection("users")
      .aggregate([...getSuggestions(follow), { $limit: 5 }])
      .toArray();

    saved = await getSaved(userId);
  } catch (error) {
    return next(new HttpError("could not found any posts, please try again", 500));
  }

  const psts = posts.map(pi => {
    pi["isSaved"] = false;

    for (let si of saved[0].saved) {
      if (si.postId === pi.postId) {
        pi["isSaved"] = si.isActive;
      }
    }

    return pi;
  });

  let newPsts;

  try {
    newPsts = await assignUsersIsFollowing(
      { posts: psts, followers: [], following: [], sug: fewSug },
      userId
    );
  } catch (error) {
    return next(
      new HttpError("could not compare some information about the user, please try again", 500)
    );
  }

  const data = {
    user: user[0],
    data: newPsts.posts,
    suggestions: newPsts.sug,
    message: "all posts found"
  };

  if (data.data.length === 0) {
    data["isEmpty"] = true;
  } else {
    data["isEmpty"] = false;
  }

  res.status(200).json({ ...data });
};

exports.createPost = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError("invalid inputs passed, please check your data", 422));
  }

  const { address, description } = req.body;
  const userId = req.params.userId;

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  const post = new Post(address, description, req.file.path, userId);
  let findedSavedCollection;

  try {
    findedSavedCollection = await Saved.getCollection("saved").findOne({
      userId: userId
    });
  } catch (error) {
    return next(new HttpError("could not create post, something went wrong.", 500));
  }

  let saved;

  if (!findedSavedCollection) {
    saved = new Saved(userId);
  }

  try {
    const postId = await post.save();
    const likesComments = new LikesComments(postId.ops[0]._id.toString());
    await likesComments.save();

    if (!findedSavedCollection) {
      await saved.save();
    }
  } catch (error) {
    return next(new HttpError("could not create post, something went wrong", 500));
  }

  res.status(201).json({ message: "post created." });
};

exports.editPost = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError("invalid inputs passed, please check your data", 422));
  }

  const { userId } = req.params;

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  const postId = req.params.postId;

  try {
    const post = await Post.getCollection("posts").findOne({
      _id: new mongodb.ObjectId(postId)
    });

    if (post._id.toString() !== postId.toString()) {
      throw new HttpError("you are not allow to update the post");
    }

    if (post.image !== req.file.path) {
      fs.unlink(path.join(__dirname, "../..", post.image), err => {
        if (err) {
          throw new Error(err);
        }
      });
    }

    await Post.updatePost(postId, req.body, req.file.path);
  } catch (error) {
    return next(new HttpError("could not update the post, something went wrong.", 500));
  }

  res.status(200).json({ message: "post updated." });
};

exports.updateLikesComments = async (req, res, next) => {
  const { t } = req.query;
  const { postId, userId } = req.params;
  const { comment } = req.body;

  if (!["likes", "comments"].includes(t)) {
    return next(new HttpError("not found valid query, something went wrong.", 500));
  }

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  try {
    const likesComments = await LikesComments.getCollection("likes-comments").findOne({
      postId: postId
    });

    if (!likesComments) {
      throw new HttpError("could not find the post");
    }
  } catch (error) {
    return next(new HttpError("could not find the post, something went wrong.", 500));
  }

  if (t === "likes") {
    let like;
    let username;

    try {
      like = await LikesComments.updateLikesComments(postId, userId, "likes");

      if (like.value.like.likes.length > 0) {
        username = await getName(like.value.like.likes[like.value.like.likes.length - 1].userId);
      }
    } catch (error) {
      console.log(error);
      return next(new HttpError("you are not allow to like the post, something went wrong.", 500));
    }

    const newLike = like.value.like.likes.find(u => u.userId === userId);

    if (newLike) {
      newLike["postId"] = postId;
      newLike["name"] = username[0].name;
      newLike["profile"] = username[0].profile;
    }

    return res.status(200).json({
      message: "post updated",
      lastLike: newLike
    });
  }

  if (t === "comments") {
    let com;
    let username;

    try {
      com = await LikesComments.updateLikesComments(postId, userId, "comments", comment);

      if (com.value.comment.comments.length > 0) {
        username = await getName(
          com.value.comment.comments[com.value.comment.comments.length - 1].userId
        );
      }
    } catch (error) {
      return next(
        new HttpError("you not allow to write a comment for this post, something went wrong.", 500)
      );
    }

    const newComment = com.value.comment.comments.find(
      item => item.userId === userId && item.comment.trim() === comment.trim()
    );

    newComment["postId"] = postId;
    newComment["name"] = username[0].name;
    newComment["profile"] = username[0].profile;

    return res.status(200).json({
      message: "comment accepted",
      lastComment: newComment
    });
  }
};

exports.getPost = async (req, res, next) => {
  const { postId, userId } = req.params;

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  let post;

  try {
    post = await Post.getCollection("posts").findOne({
      _id: new mongodb.ObjectId(postId)
    });
  } catch (error) {
    return next(new HttpError("could not compare this id with the post id.", 403));
  }

  if (!post) {
    return next(new HttpError("could not found the post.", 403));
  }

  let pst;
  let saved;

  try {
    pst = await getPsts({ $match: { _id: new mongodb.ObjectId(postId) } }, { postsOp: false });
    saved = await getSaved(userId);
  } catch (error) {
    return next(new HttpError("could not found any posts, please try again", 500));
  }

  if (!pst) {
    return next(new HttpError("could not found any posts, please try again.", 403));
  }

  const ps = pst.map(pi => {
    pi["isSaved"] = false;

    for (let si of saved[0].saved) {
      if (si.postId === pi.postId) {
        pi["isSaved"] = si.isActive;
      }
    }

    return pi;
  });

  let newPs;

  try {
    newPs = await assignUsersIsFollowing(
      { posts: ps, followers: [], following: [], sug: [] },
      userId
    );
  } catch (error) {
    return next(
      new HttpError("could not compare some information about the user, please try again", 500)
    );
  }

  res.status(200).json({ post: newPs.posts[0], message: "post fetched" });
};

exports.saved = async (req, res, next) => {
  const { postId, userId } = req.params;

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  let post;

  try {
    post = await Post.getCollection("posts").findOne({
      _id: new mongodb.ObjectId(postId)
    });
  } catch (error) {
    return next(new HttpError("could not compare the id with the post.", 403));
  }

  if (!post) {
    return next(new HttpError("could not found the post.", 403));
  }

  let saved;
  let pst;

  try {
    saved = await Saved.updateSaved(postId, userId);

    pst = await Post.getCollection("posts")
      .aggregate([
        {
          $match: {
            _id: new mongodb.ObjectId(postId)
          }
        },
        {
          $project: {
            _id: 0,
            image: "$image",
            postId: { $toString: "$_id" }
          }
        },
        {
          $lookup: {
            from: "likes-comments",
            localField: "postId",
            foreignField: "postId",
            as: "likesComments"
          }
        },
        { $unwind: "$likesComments" },
        {
          $project: {
            image: 1,
            postId: 1,
            likesC: { $size: "$likesComments.like.likes" },
            commentsC: { $size: "$likesComments.comment.comments" }
          }
        }
      ])
      .toArray();
  } catch (error) {
    return next(new HttpError("could not save the post, something went wrong.", 500));
  }

  res.status(200).json({
    message: "post saved",
    saved: saved.value.posts.find(p => p.postId === postId.toString()),
    post: pst[0]
  });
};

exports.explore = async (req, res, next) => {
  const { userId } = req.params;

  if (!req.query.quantity && !req.query.scrollNo) {
    return next(new HttpError("could not found valid query, something went wrong."));
  }

  const { quantity, scrollNo } = req.query;

  if (quantity <= 0 || quantity >= 16) {
    return next(new HttpError("please enter standard quantity, something went wrong."));
  }

  if (scrollNo <= 0) {
    return next(new HttpError("please enter valid number to get photos, something went wrong."));
  }

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  let docC;
  let photos;

  try {
    docC = await Post.getCollection("posts")
      .aggregate([{ $count: "posts" }])
      .toArray();

    photos = await Post.getCollection("posts")
      .aggregate([
        {
          $project: {
            _id: 0,
            image: "$image",
            userId: "$userId",
            postId: {
              $toString: "$_id"
            }
          }
        },
        { $skip: (+scrollNo - 1) * +quantity },
        { $limit: +quantity },
        { $sample: { size: docC.length > 0 ? docC[0].posts : 0 } }
      ])
      .toArray();
  } catch (error) {
    return next(new HttpError("could not found any posts, please try again", 500));
  }

  const data = {
    data: photos,
    message: "all posts fetched"
  };

  if (data.data.length === 0) {
    data["isEmpty"] = true;
  } else {
    data["isEmpty"] = false;
  }

  res.status(200).json({ ...data });
};

exports.deletePost = async (req, res, next) => {
  const { postId, userId } = req.params;

  if (req.userId.toString() !== userId.toString()) {
    return next(new HttpError("you are not allow to do any operation on the server posts", 401));
  }

  let deletedPost;
  const session = db.client().startSession();

  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" }
  };

  try {
    await session.withTransaction(async () => {
      deletedPost = await Post.deletePost(postId, userId, { session });
      await LikesComments.deleteLikesComments(postId, { session });
    }, transactionOptions);
  } catch (error) {
    return next(new HttpError("could not delete the post, something went wrong.", 500));
  } finally {
    await session.endSession();
  }

  if (deletedPost) {
    fs.unlink(path.join(__dirname, "../..", deletedPost.value.image), err => {
      if (err) {
        throw new Error(err);
      }
    });
  }

  res.status(200).json({ message: "post deleted" });
};
