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
    createdAt:{
        tyep:Date,
        default: Date.now
    }

});

WebtoonSchema.index({ title: 'text' });

module.exports = mongoose.model('webtoons', WebtoonSchema);