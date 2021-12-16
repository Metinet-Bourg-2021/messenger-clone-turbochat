const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
            type: Object,
            required: false
        },
        typing: {
            type: Object,
            required: false
        }
}, { minimize: false });
conversationSchema.plugin(AutoIncrement, {inc_field: 'id'})

module.exports = mongoose.model('Conversation', conversationSchema);