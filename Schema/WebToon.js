const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WebtoonSchema = new Schema({
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
        type: Date,  // Corrected the typo here
        default: Date.now
    }
});

WebtoonSchema.index({ title: 'text' });

module.exports = mongoose.model('webtoons', WebtoonSchema);
