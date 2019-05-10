const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ip = require("ip");

require('dotenv').config();
const userRoutes = require('./api/routes/user');
const patientRoutes = require('./api/routes/patient');
const visitRoutes = require('./api/routes/visit');
const TransactionLogs = require("./api/models/transaction_logs");

// connect to DB
mongoose.connect(
    "mongodb://localhost/medical_api"
);

mongoose.Promise = global.Promise;

 /* Start Middelware */
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
/* End Middelware */

/* Doc */
app.get('/doc', function(req,res){
    res.sendfile(__dirname + '/doc/index.html');
});
app.use('/', express.static('doc'));
/* End:Doc */

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        // return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use("/user", userRoutes);
app.use("/patient", patientRoutes);
app.use("/visit", visitRoutes);

/* Start Handle errors */

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    const TransactLog = new TransactionLogs({
        _id: new mongoose.Types.ObjectId(),
        url: req.originalUrl,
        method: req.method,
        userIp: ip.address(),
        status: error.status || 500,
        message: error.message
    });
    TransactLog.save();

    res.json({
        error: {
            messages: error.message,
        }
    });
});
/* End Handle errors */

module.exports = app;