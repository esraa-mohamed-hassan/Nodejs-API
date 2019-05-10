const mongoose = require('mongoose');
const filesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fileId: {type: Number,default:1},
    originalname : { type: String , required: true },
    filename: { type: String , required: true},
    mimetype:{type: String,required: true},
    destination: { type: String , required: true},
    path: { type: String , required: true},
    size: { type: Number , required: true},
    created_at  : { type: Date, required: true, default: Date.now },


},{collection: "files"} );
module.exports = mongoose.model('FilesUploaded', filesSchema);



