const mongoose = require('mongoose');
require('mongoose-type-email');
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patientId: {type: Number,default:1},
    patientName: {type: String,required: [true, 'Patient Name is required']},
    surName: {type: String},
    email:{type:String},
    
    height:{
        type:Number,
        // required: true,
        maxlength:3,
    },
    weight:{
        type:Number,
        // required: true,
        maxlength:3,
    },
    gender:{
        type: String,
        // enum: ['male', 'female'],
        // required: true
    },
    bloodType:{
        type:String,
        maxlength:3,
        // required: true
    },
    complaint:{
        type:String,
        // required: true
    },
    date:{
        type:Date,
        // required: true
    },
    homeNo:{
        type:Number,
        maxlength:10,
        // required: true
    },
    mobileNo:{
        type:Number,
        minlength:10,
        maxlength:13,
        required: true
    },
    address:{
        type:String,
        // required: true
    },
    contactName :{
        type:String,
    },
    contactRelationship:{
        type:String,
    },
    contactPhoneNo:{
        type:Number,
        minlength:11,
        maxlength:13,
    },
    delete:{
        type: String,
        enum: ['false', 'true'],
        default: 'false'
    },
    created_at  : { type: Date, required: true, default: Date.now },
    updated_at  : { type: Date },
    deleted_at  : { type: Date },


},{collection: "patients"} );

module.exports = mongoose.model('Patients', userSchema);