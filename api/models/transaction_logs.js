const mongoose = require('mongoose');

const transactionLogSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    url: { type: String, required: true },
    method: { type: String, required: true },
    userIp: { type: String,},
    status: { type: String },
    message: { type: String },

},{timestamps: true}  , {collection: "transactionlogs"});

module.exports = mongoose.model('TransactionLogs', transactionLogSchema);