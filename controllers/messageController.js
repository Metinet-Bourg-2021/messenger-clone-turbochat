const Logger = require("nodemon/lib/utils/log");
const { checkAuth } = require("../auth/auth");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const CSocket = require("../models/UserSocket");

async function postMessage({ token, conversation_id, content }, callback) {
  const userId = await checkAuth(token, callback);

  const user = await User.findById(userId);

  const conversation = await Conversation.findOne({ id: conversation_id });

  if (user && conversation) {
    const dateNow = new Date();

    let message = {
      id: conversation.messages ? conversation.messages.length + 1 : 1,
      from: user.username,
      content,
      posted_at: dateNow,
      reply_to: null,
      edited: null,
      deleted: false,
      reactions: {},
      picture_url: user.picture_url,
    };

    conversation.messages.push(message);

    conversation.save().then(() => {
      callback({ code: "SUCCESS", data: { message } });

      CSocket.emitEvent('@messagePosted', conversation.participants, {
        conversation_id,
        message
      })
    });
  }
}

async function replyMessage(
  { token, conversation_id, message_id, content },
  callback
) {
  const userId = await checkAuth(token, callback);
  const user = await User.findById(userId);

  const conversation = await Conversation.findOne({ id: conversation_id });

  const replyMessage = conversation.messages.find((m) => m.id === message_id);

  const dateNow = new Date();

  if (user && conversation) {
    let message = {
      id: conversation.messages ? conversation.messages.length + 1 : 1,
      from: user.username,
      content,
      posted_at: dateNow,
      reply_to: replyMessage,
      edited: null,
      deleted: false,
      reactions: {},
      picture_url: user.picture_url,
    };

    conversation.messages.push(message);

    conversation.save().then(() => {
      callback({ code: "SUCCESS", data: { message } });
    });
  } else {
    if (!user) {
      callback({ code: "NOT_FOUND_USER", data: {} });
    } else {
      callback({ code: "NOT_FOUND_CONVERSATION", data: {} });
    }
  }
}

async function editMessage(
  { token, conversation_id, message_id, content },
  callback
) {
  const userId = await checkAuth(token, callback);

  const conversation = await Conversation.findOne({ id: conversation_id });

  if (conversation) {
    if (conversation.messages) {
      let messagesArray = conversation.messages;

      messagesArray.find((m) => m.id === message_id).content = content;

      let messageEdited = messagesArray.find(m => m.id === message_id);

      await Conversation.updateOne(
        { id: conversation_id },
        { $set: { messages: messagesArray } }
      );

      CSocket.emitEvent('@messageEdited', conversation.participants, {
        conversation_id,
        message: messageEdited
      })

      return callback({ code: "SUCCESS", data: {} });
    } else {
      return callback({ code: "NOT_FOUND_MESSAGE", data: {} });
    }
  } else {
    return callback({ code: "NOT_FOUND_CONVERSATION", data: {} });
  }
}

async function reactMessage({token, conversation_id, message_id, reaction}, callback){
  const userId = await checkAuth(token, callback);

  const user = await User.findById(userId);

  const conversation = await Conversation.findOne({id: conversation_id});

  if(!conversation){
    return callback({code: "NOT_FOUND_CONVERSATION", data: {}});
  } else if(!user){
    return callback({code: "NOT_FOUND_USER", data: {}});
  } else {
    let messagesArray = conversation.messages;
    messagesArray.find(m => m.id === message_id).reactions[user.username] = reaction;

    let messageReacted = messagesArray.find(m => m.id === message_id);

    await Conversation.updateOne({id: conversation_id}, {$set : { messages: messagesArray}});
    callback({code: "SUCCESS", data: {}});

    CSocket.emitEvent('@messageReacted', conversation.participants, {
      conversation_id,
      message: messageReacted
    })
    
  }


}

async function deleteMessage({token, conversation_id, message_id, content}, callback){
  const userId = await checkAuth(token, callback);

  const conversation = await Conversation.findOne({id: conversation_id});

  if(!conversation){
    return callback({code: "NOT_FOUND_CONVERSATION", data: {}});
  } else {
    let messagesArray = conversation.messages;
    let messageDeleted = messagesArray.find(m => m.id === message_id);
    messageDeleted.deleted = true;
    messageDeleted.content = "";

    await Conversation.updateOne({id: conversation_id}, {$set : {messages: messagesArray }});

    CSocket.emitEvent('@mesageDeleted', conversation.participants, {
      conversation_id,
      message: messageDeleted
    })

    callback({code: "SUCCESS", data: {}});
  }
}

module.exports = {
  postMessage: postMessage,
  replyMessage: replyMessage,
  editMessage: editMessage,
  reactMessage: reactMessage,
  deleteMessage: deleteMessage,
};
