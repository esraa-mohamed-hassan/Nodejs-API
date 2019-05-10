const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    url: { type: String, required: true },
    method: { type: String, required: true },
    userIp: { type: String, required: true },
    status: { type: String },
    message: { type: String },
    request_json:{ type: String },
    response_json:{ type: String },
},{timestamps: true} , {collection: "logs"});

module.exports = mongoose.model('Logs', logSchema);