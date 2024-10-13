const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WebtoonSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    characters: [
        {
            name: {
                type: String,
                required: true
            },
            role: {
                type: String,
                required: true
            }
        }
    ],
    imageUrl: {
        type: String,
        required: false 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {  // Creator ID (without reference to User model)
        type: Schema.Types.ObjectId,
        required: false
    }
});

WebtoonSchema.index({ title: 'text' });

module.exports = mongoose.model('webtoons', WebtoonSchema);
