const Conversation = require("../models/Conversation");
const { checkAuth } = require("../auth/auth");
const User = require("../models/User");
const Message = require("../models/Message");

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
      callback({ code: "SUCCESS", data: { conversations } });
    }
  }
}

async function postMessage({ token, conversation_id, content }, callback) {
  const userId = await checkAuth(token, callback);

  if (userId) {
    const conversation = await Conversation.findOne()
      .where("id")
      .equals(conversation_id);
    console.log(conversation);
    const date = Date.now();
    const from = await User.findById(userId);
    const deliveredTo = {};
    conversation.participants.forEach((user) => {
      deliveredTo[user] = date;
    });
    console.log("CONVERSATION_ID", conversation_id);
    const message = new Message({
      id: conversation_id,
      from: from.username,
      content,
      posted_at: date,
      delivered_to: deliveredTo,
      replyTo: null,
      edited: false,
      deleted: false,
      reactions: {},
    });
    conversation.messages.push(message);
    conversation.save();
    callback({ code: "SUCCESS", data: { message: message } });
  }
}

module.exports = {
  getConversations: getConversations,
  postMessage: postMessage,
};
