const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String,},
    password: { type: String}
},{collection: "users"} );

module.exports = mongoose.model('User', userSchema);