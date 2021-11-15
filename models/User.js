const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    picture_url: {
        type: String,
        required: false
    },
    awake: {
        type: Boolean,
        required: false
    }
});

module.exports = mongoose.model('User', userSchema);