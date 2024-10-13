const mongoose = require('mongoose');

const mongoURI = process.env.URI;
const connect = async () => {
    try {
        await mongoose.connect(mongoURI)
        console.log("Connected to mongodb successfully")
    } catch (error) {
        console.log("Not connected to mongodb")
    }

}

module.exports = connect;