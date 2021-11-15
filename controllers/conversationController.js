const Conversation = require("../models/Conversation");
const { checkAuth } = require("../auth/auth");
const User = require("../models/User");

async function getConversations({ token }, callback) {
  const userId = await checkAuth(token, callback);
  if (userId) {
    const user = await User.findById(userId);
    if (!user) {
      callback({ code: "NOT_AUTHENTICATED", data: {} });
    } else {
      const conversations = await Conversation.find()
        .where("participants")
        .in(user.username);
      console.log(conversations);
      callback({ code: "SUCCESS", data: { conversations } });
    }
  }
}

module.exports = {
  getConversations: getConversations,
};
