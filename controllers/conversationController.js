const Conversation = require("../models/Conversation");
const { checkAuth } = require("../auth/auth");
const User = require("../models/User");

async function getConversations({ token }, callback) {
  checkAuth(token, callback);
  const user = await User.findById(token.userId);
  if (!user) {
    callback({ code: "NOT_AUTHENTICATED", data: {} });
  } else {
    const conversations = Conversation.find().where();
  }
}

module.exports = {
  getConversations: getConversations,
};
