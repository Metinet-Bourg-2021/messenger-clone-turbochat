const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pictures = require("../pictures");
const { checkAuth } = require("../auth/auth");

async function authenticate({ username, password }, callback) {
  await User.findOne({ username: username }).then((user) => {
    if (user === null) {
      bcrypt.hash(password, 10).then((hash) => {
        const newUser = new User({
          username: username,
          password: hash,
          picture_url: pictures.getRandomURL(),
        });
        const token = jwt.sign({ userId: newUser._id }, "secret_key", {
          expiresIn: "1h",
        });
        newUser
          .save()
          .then((savedUser) =>
            callback({
              code: "SUCCESS",
              data: {
                username: savedUser.username,
                token: token,
                picture_url: savedUser.picture_url,
              },
            })
          )
          .catch((error) => callback({ code: "NOT_FOUND_USER", data: {} }));
      });
    } else {
      bcrypt
        .compare(password, user.password)
        .then((valid) => {
          if (!valid) {
            return callback({ code: "NOT_AUTHENTICATED", data: {} });
          }
          const token = jwt.sign({ userId: user._id }, "secret_key", {
            expiresIn: "1h",
          });
          callback({
            code: "SUCCESS",
            data: {
              username: user.username,
              token: token,
              picture_url: user.picture_url,
            },
          });
        })
        .catch((error) => console.log({ code: "NOT_AUTHENTICATED", error }));
    }
  });
}

async function getUsers({ token }, callback) {
  const userId = await checkAuth(token, callback);
  const users = await User.find();
  const resp = users.filter((user) => user._id !== userId).map((user) => {
    return {
      username: user.username,
      picture_url: user.picture_url,
      awake: user.awake != null ? user.awake : false,
    };
  });

  callback({ code: "SUCCESS", data: { users: resp } });
}

module.exports = {
  authenticate: authenticate,
  getUsers: getUsers,
};
