const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
        type: {
            type: String,
            required: true
        },
        participants: {
            type: Array,
            required: true
        },
        messages: {
            type: Array,
            required: false
        },
        title: {
            type: String,
            required: false
        },
        theme: {
            type: String,
            required: false,
        },
        updated_at: {
            type: Date,
            required: false
        },
        seen: {
            type: Array,
            required: false
        },
        typing: {
            type: Array,
            required: false
        }
}, { minimize: false });

module.exports = mongoose.model('Conversation', conversationSchema);