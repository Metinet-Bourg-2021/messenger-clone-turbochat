const Conversation = require("../models/Conversation");
const { checkAuth } = require("../auth/auth");
const User = require("../models/User");
const CSocket = require("../models/UserSocket");

async function getConversations({ token }, callback) {
  const userId = await checkAuth(token, callback);
  if (userId) {
    const user = await User.findById(userId);
    if (!user) {
      callback({ code: "NOT_AUTHENTICATED", data: {} });
    } else {
      let conversations = await Conversation.find()
        .where("participants")
        .in(user.username);
      
      callback({ code: "SUCCESS", data: { conversations } });
    }
  }
}

async function getOrCreateOneToOneConversation({ token, username }, callback) {
  const userId = await checkAuth(token, callback);

  const user = await User.findById(userId);  

  if (!user) {
    callback({ code: "NOT_AUTHENTICATED", data: {} });
  } else {
    const dateNow = new Date();

    let seenObject = {};

    seenObject[username] = -1;
    seenObject[user.username] = -1;

    let conversation = new Conversation({
      type: "one_to_one",
      participants: [user.username, username],
      messages: [],
      title: "Conversation",
      theme: "BLUE",
      updated_at: dateNow,
      seen: seenObject,
      typing: {},
    });

    conversation.save().then((conversation) => {
      callback({code: "SUCCESS", data: {conversation} });

      console.log(conversation);

      CSocket.emitAll('@conversationCreated', conversation)
    })
    
  }
}

async function getOrCreateManyToManyConversation(
  { token, usernames },
  callback
) {
  const userId = await checkAuth(token, callback);

  const user = await User.findById(userId);
   
  if (!user) {
    callback({ code: "NOT_AUTHENTICATED", data: {} });
  } else {
    const dateNow = new Date();

    let users = usernames;
    users.push(user.username);

    let seenObject = {};

    users.forEeach(u => {
      seenObject[u] = -1;
    });

    const conversation = new Conversation({
      type: "many_to_many",
      participants: users,
      messages: [],
      title: "Conversation",
      theme: "BLUE",
      updated_at: dateNow,
      seen: seenObject,
      typing: {},
    });

    conversation.save().then((conversationSaved) => {
      callback({code: "SUCCESS", data: {conversationSaved} });

      CSocket.emitAll('@conversationCreated', conversationSaved)
    })
  }
}

async function seeConversation({ token, conversation_id, message_id, content }, callback){
  const userId = await checkAuth(token, callback);
  const user = await User.findById(userId);

  if(!user){
    return callback({code: "NOT_FOUND_USER", data: {}});
  }

  const conversation = await Conversation.findOne({ id: conversation_id });

  if(!conversation){
    callback({code: "NOT_FOUND_CONVERSATION", data: {}})
  } else {

    let seenObject = conversation.seen;
    seenObject[user.username] = { message_id, time: new Date()};

    await Conversation.updateOne({id: conversation_id}, {$set: { seen: seenObject }});

    let saved = conversation;
    saved.seen = seenObject;

    CSocket.emitEvent('@conversationSeen', conversation.participants, saved);
      
      callback({code: "SUCCESS", data: {} });
  }

}

module.exports = {
  getConversations: getConversations,
  getOrCreateManyToManyConversation: getOrCreateManyToManyConversation,
  getOrCreateOneToOneConversation: getOrCreateOneToOneConversation,
  seeConversation: seeConversation,
};
