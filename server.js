require("dotenv/config");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const userController = require("./controllers/userController");
const conversationController = require("./controllers/conversationController");
const messageController = require("./controllers/messageController");

const io = new Server(server, { cors: { origin: "*" } });

app.get("/", (req, res) => {
  res.send("A utiliser pour du debug si vous avez besoin...");
});

mongoose.connect(process.env.DB_USER, { useNewUrlParser: true }, () =>
  console.log("Connected to DB!")
);

server.listen(3000, () => {
  console.log("Server is listening");
});

io.on("connection", (socket) => {
  //Penser a conserver le socket pour pouvoir s'en servir plus tard
  //Remplacer les callbacks par des fonctions dans d'autres fichiers.

  socket.on("@authenticate", userController.authenticate);

  socket.on("@getUsers", userController.getUsers);

  socket.on("@getOrCreateOneToOneConversation", conversationController.getOrCreateOneToOneConversation);

  socket.on("@createManyToManyConversation", conversationController.getOrCreateManyToManyConversation);

  socket.on("@getConversations", conversationController.getConversations);

  socket.on("@postMessage", messageController.postMessage);

  socket.on("@seeConversation", conversationController.seeConversation);
  
  socket.on("@replyMessage", messageController.replyMessage);

  socket.on("@editMessage", messageController.editMessage);

  socket.on("@reactMessage", messageController.reactMessage);

  socket.on("@deleteMessage", messageController.deleteMessage);

  socket.on("disconnect", (reason) => {});

  //ceci est un test
});

// Addresse du serveur démo: wss://teach-vue-chat-server.glitch.me
