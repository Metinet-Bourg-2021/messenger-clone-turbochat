const jwt = require("jsonwebtoken");

function checkAuth(token, callback) {
  if (!token) {
    return callback({ code: "NOT_AUTHENTICATED", data: {} });
  }
  const decodedToken = jwt.verify(token, "secret_key");
  const userId = decodedToken.userId;
  if (token.userId && token.userId !== userId) {
    return callback({ code: "NOT_AUTHENTICATED", data: {} });
  }
}

module.exports = { checkAuth: checkAuth };
