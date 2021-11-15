const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function checkAuth(token, callback) {
  if (!token) {
    callback({ code: "NOT_AUTHENTICATED", data: {} });
  }
  try {
    const decodedToken = jwt.verify(token, "secret_key");
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      throw "error";
    } else {
      return user.id;
    }
  } catch {
    callback({ code: "NOT_AUTHENTICATED", data: {} });
  }
}

module.exports = { checkAuth: checkAuth };
