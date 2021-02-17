const express = require("express");
const { check } = require("express-validator");

const userController = require("../../controllers/user/user-controller");

const tokenChecker = require("../../middleware/token");

const router = express.Router();

router.post(
  "/signup",
  [
    check("name").trim().isLowercase().isLength({ min: 5, max: 30 }),
    check("fullName").trim().isLength({ min: 5, max: 30 }),
    check("email").trim().normalizeEmail().isEmail(),
    check("password")
      .trim()
      .isLength({ min: 5, max: 30 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
  ],
  userController.signup
);

router.post("/login", userController.login);

router.put(
  "/:userId/edit-profile",
  tokenChecker,
  [
    check("name").trim().isLowercase().isLength({ min: 5, max: 30 }),
    check("fullName").trim().isLength({ min: 5, max: 30 }),
    check("name").trim().isLength({ min: 5 })
  ],
  userController.editProfile
);

router.get("/:userId/notice", tokenChecker, userController.notice);

router.get("/:userId/suggestions", tokenChecker, userController.suggestions);

router.get("/:userId/users", tokenChecker, userController.users);

router.get("/:userId/chat", tokenChecker, userController.chat);

router.post(
  "/:userId/:target/start-chat",
  tokenChecker,
  userController.startChat
);

router.get("/:userId/:target/profile", tokenChecker, userController.profile);

router.patch(
  "/:userId/:targetUserId/followers-following",
  tokenChecker,
  userController.updateFollowersFollowing
);

module.exports = router;
