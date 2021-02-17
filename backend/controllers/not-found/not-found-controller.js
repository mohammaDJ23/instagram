const HttpError = require("../../models/error/http-error-model");

module.exports.notFound = (req, res, next) => {
  throw new HttpError("could not found this url", 404);
};
