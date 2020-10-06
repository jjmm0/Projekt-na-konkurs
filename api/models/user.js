const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    Login: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: false,
    },
})

const User = mongoose.model("User", userSchema)

module.exports = User