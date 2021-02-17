const mongodb = require("mongodb");
const { validationResult } = require("express-validator");

const User = require("../../models/user/user-model");
const Post = require("../../models/post/post-model");
const Saved = require("../../models/saved/saved-model");
const FollowersFollowing = require("../../models/followers-following/followers-following-models");
const HttpError = require("../../models/error/http-error-model");

const checkUserId = (userIdInReq, userId, next) => {
  if (userIdInReq.toString() !== userId.toString()) {
    return next(
      new HttpError(
        "you are not allow to do any operation on the server posts",
        401
      )
    );
  }
};

const checkInputs = (req, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(
      new HttpError("invalid inputs passed, please check your data", 422)
    );
  }
};

const assignUsersIsFollowing = async (data, userId) => {
  const { posts, following, followers, sug } = data;
  const follow = [...following, ...followers, ...sug];
  let usersOnfollowing;

  try {
    usersOnfollowing = await FollowersFollowing.getCollection(
      "followers-following"
    )
      .aggregate([
        { $match: { userId: userId } },
        { $project: { _id: 0, following: "$following.following" } }
      ])
      .toArray();
  } catch (error) {
    throw error;
  }

  const isUsersOnFollowing = usersOnfollowing[0].following;

  if (posts.length > 0) {
    posts.forEach(post => {
      post.likes.likes.forEach(user => {
        if (user.userId !== userId) {
          user["isFollowing"] = false;
        }

        for (let userOnFollowing of isUsersOnFollowing) {
          if (user.userId === userOnFollowing) {
            user["isFollowing"] = true;
          }
        }

        return user;
      });

      return post;
    });
  }

  if (following.length > 0 || followers.length > 0 || sug.length > 0) {
    follow.forEach(user => {
      if (user.userId !== userId) {
        user["isFollowing"] = false;
      }

      for (let userOnFollowing of isUsersOnFollowing) {
        if (user.userId === userOnFollowing) {
          user["isFollowing"] = true;
        }
      }

      return user;
    });
  }

  return {
    posts,
    following,
    followers,
    sug
  };
};

const checkFollowersFollowing = async (userId, next) => {
  let userFollowersFollowing;

  try {
    userFollowersFollowing = await FollowersFollowing.getCollection(
      "followers-following"
    ).findOne({
      userId: userId
    });
  } catch (error) {
    return next(
      new HttpError(
        "could not found the user's document, something went wrong.",
        500
      )
    );
  }

  if (!userFollowersFollowing) {
    const followerFollowing = new FollowersFollowing(userId);

    try {
      await followerFollowing.save();
    } catch (error) {
      return next(
        new HttpError(
          "could not create a collection in the database, please try again.",
          500
        )
      );
    }
  }
};

const getFollow = async userId => {
  try {
    return await FollowersFollowing.getCollection("followers-following")
      .aggregate([
        { $match: { userId: userId } },
        {
          $project: {
            _id: 0,
            users: {
              $concatArrays: ["$followers.followers", "$following.following"]
            }
          }
        }
      ])
      .toArray();
  } catch (error) {
    throw error;
  }
};

const getSuggestions = fllw => {
  return [
    {
      $match: {
        _id: {
          $not: {
            $in: fllw.map(u => u)
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        userId: {
          $toString: "$_id"
        },
        name: "$name",
        profile: "$profile.image"
      }
    },
    { $sort: { userId: -1 } }
  ];
};

const getUser = async userId => {
  try {
    return await User.getCollection("users")
      .aggregate([
        { $match: { _id: new mongodb.ObjectId(userId) } },
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
    throw error;
  }
};

const getName = async filter => {
  try {
    return await User.getCollection("users")
      .aggregate([
        {
          $match: {
            _id: new mongodb.ObjectId(filter)
          }
        },
        {
          $project: {
            _id: 0,
            name: "$name",
            profile: "$profile.image"
          }
        }
      ])
      .toArray();
  } catch (error) {
    throw error;
  }
};

const getPsts = async (filter, { postsOp, quantity, scrollNo }) => {
  let getInfoPerPage = [];

  if (postsOp) {
    getInfoPerPage = [
      { $skip: (+scrollNo - 1) * +quantity },
      { $limit: +quantity }
    ];
  }

  try {
    let posts = await Post.getCollection("posts")
      .aggregate([
        filter,
        {
          $project: {
            _id: 0,
            userId: { $toObjectId: "$userId" },
            postId: { $toString: "$_id" },
            location: "$address",
            description: "$description",
            image: "$image"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userInfo"
          }
        },
        { $unwind: "$userInfo" },
        {
          $project: {
            _id: 0,
            postId: 1,
            location: 1,
            description: 1,
            image: 1,
            userId: { $toString: "$userId" },
            name: "$userInfo.name",
            profile: "$userInfo.profile.image"
          }
        },
        {
          $lookup: {
            from: "likes-comments",
            let: { postId: "$postId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },
              {
                $lookup: {
                  from: "users",
                  let: {
                    likes: {
                      $map: {
                        input: "$like.likes",
                        as: "item",
                        in: {
                          $toObjectId: "$$item.userId"
                        }
                      }
                    }
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $in: ["$_id", "$$likes"]
                        }
                      }
                    },
                    {
                      $project: {
                        _id: 0,
                        userId: { $toString: "$_id" },
                        name: "$name",
                        profile: "$profile.image"
                      }
                    }
                  ],
                  as: "likes"
                }
              },
              {
                $lookup: {
                  from: "users",
                  let: {
                    comments: {
                      $map: {
                        input: "$comment.comments",
                        as: "item",
                        in: {
                          $toObjectId: "$$item.userId"
                        }
                      }
                    }
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $in: ["$_id", "$$comments"]
                        }
                      }
                    },
                    {
                      $project: {
                        _id: 0,
                        userId: { $toString: "$_id" },
                        name: "$name",
                        profile: "$profile.image"
                      }
                    }
                  ],
                  as: "comments"
                }
              }
            ],
            as: "likesComments"
          }
        },
        { $unwind: "$likesComments" },
        { $sort: { postId: -1 } },
        ...getInfoPerPage
      ])
      .toArray();

    posts = posts.map(post => {
      const likesQ = post.likesComments.like.quantity;
      const commentsQ = post.likesComments.comment.quantity;
      const likes = post.likesComments.like.likes;
      const newlikes = post.likesComments.likes;
      const comments = post.likesComments.comment.comments;
      const newComments = post.likesComments.comments;

      for (let like of likes) {
        for (let nLike of newlikes) {
          if (like.userId === nLike.userId && likes.length > 0) {
            nLike["isActive"] = !!like.isActive;
          }
        }
      }

      for (let comment of comments) {
        for (let nComment of newComments) {
          if (comment.userId === nComment.userId && comments.length > 0) {
            comment["profile"] = nComment.profile;
            comment["name"] = nComment.name;
          }
        }
      }

      const newPost = {
        ...post,
        likes: {
          quantity: likesQ,
          likes: [...newlikes]
        },
        comments: {
          quantity: commentsQ,
          comments: [...comments]
        }
      };

      delete newPost["likesComments"];
      return newPost;
    });

    return posts;
  } catch (error) {
    throw error;
  }
};

const getSaved = async userId => {
  try {
    return await Saved.getCollection("saved")
      .aggregate([
        { $match: { userId: userId } },
        {
          $project: {
            _id: 0,
            saved: "$posts"
          }
        }
      ])
      .toArray();
  } catch (error) {
    throw error;
  }
};

const findUser = async userId => {
  let user;

  try {
    user = await User.getCollection("users").findOne({
      _id: new mongodb.ObjectId(userId)
    });
  } catch (error) {
    throw error;
  }

  return user._id.toString();
};

module.exports = {
  assignUsersIsFollowing,
  getFollow,
  getSuggestions,
  checkUserId,
  checkInputs,
  checkFollowersFollowing,
  getUser,
  getName,
  getPsts,
  getSaved,
  findUser
};
