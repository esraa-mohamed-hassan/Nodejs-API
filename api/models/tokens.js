const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    token: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},{timestamps: true} , {collection: "tokens"});

module.exports = mongoose.model('Tokens', tokenSchema);