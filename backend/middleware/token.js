const HttpError = require("../models/error/http-error-model");

const { tkn } = require("../utils/token/tkn");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    tkn({ token, from: "rest", req }, next);
  } catch (error) {
    return next(new HttpError("authentication failed", 403));
  }
};
