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
              
        }
    ]
})