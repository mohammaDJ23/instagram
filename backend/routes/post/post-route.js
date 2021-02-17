const express = require("express");
const { check } = require("express-validator");

const tokenChecker = require("../../middleware/token");

const postController = require("../../controllers/post/post-controller");

const router = express.Router();

router.get("/:userId/posts", tokenChecker, postController.getPosts);

router.post(
  "/:userId/create-post",
  tokenChecker,
  [
    check("address").trim().isLowercase().isLength({ min: 5, max: 30 }),
    check("description").trim().isLength({ min: 5 })
  ],
  postController.createPost
);

router.get("/:userId/explore", tokenChecker, postController.explore);

router.put(
  "/:postId/:userId/edit-post",
  tokenChecker,
  [
    check("address").trim().isLowercase().isLength({ min: 5, max: 30 }),
    check("description").trim().isLength({ min: 5, max: 30 })
  ],
  postController.editPost
);

router.delete(
  "/:postId/:userId/delete-post",
  tokenChecker,
  postController.deletePost
);

router.patch(
  "/:postId/:userId/update-likes-comments",
  tokenChecker,
  postController.updateLikesComments
);

router.post("/:postId/:userId/saved", tokenChecker, postController.saved);

router.get("/:postId/:userId/post", tokenChecker, postController.getPost);

module.exports = router;
