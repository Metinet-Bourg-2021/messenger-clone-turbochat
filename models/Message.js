const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({

    from: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    posted_at: {
        type: Date,
        required: true
    },
    delivered_to: {
        type: Array,
        required: true
    },
    reply_to: {
        type: String,
        required: false
    },
    edited: {
        type: Boolean,
        required: false
    },
    deleted: {
        type: Boolean,
        required: false,
    },
    reactions: {
        type: Object,
        required: false
    }

}, { minimize: false });

module.exports = mongoose.model('Message', messageSchema);
