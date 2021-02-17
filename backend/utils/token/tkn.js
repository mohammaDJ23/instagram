const jwt = require("jsonwebtoken");

module.exports.tkn = ({ token, from, req }, next) => {
  if (!token) {
    throw new Error("authentication failed");
  }

  const decodedToken = jwt.verify(token, "iuSiosIUSG275678SJDFGJAG");

  if (from === "rest") {
    req.userId = decodedToken.userId;
  }

  return next();
};
