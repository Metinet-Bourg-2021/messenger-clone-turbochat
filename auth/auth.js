const jwt = require("jsonwebtoken");
const User = require("../models/User");

function checkAuth(token, callback) {
  if (!token) {
    return callback({ code: "NOT_AUTHENTICATED", data: {} });
  }
  try {
    const decodedToken = jwt.verify(token, "secret_key");
    const user = User.findById(decodedToken.userId);
    if (!user) {
      throw new error();
    } else {
      return user._id;
    }
  } catch {
    return callback({ code: "NOT_AUTHENTICATED", data: {} });
  }
}

module.exports = { checkAuth: checkAuth };
