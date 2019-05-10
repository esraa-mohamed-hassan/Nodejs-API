const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Tokens = require("../models/tokens");
const helpers_log = require("../helpers/logsHelpers");
const tokenList = {};


signToken = user => {
    var now = Math.round(new Date().getTime() / 1000.0);
    var exp = now + (5256000 * 60);
    return jwt.sign({
        iss: 'Codersea_access_token',
        sub: user._id,
        iat: new Date().getTime(), // current time
        exp: exp // 15 min
    }, process.env.JWT_KEY);
};
refreshToken = user => {
    var now = Math.round(new Date().getTime() / 1000.0);
    var exp = now + (60 * 60 * 24) * 30;
    return jwt.sign({
        iss: 'Codersea_refresh_token',
        sub: user._id,
        iat: new Date().getTime(), // current time
        exp: exp // 30 days
    }, process.env.JWT_KEY);
};

/**
 * @apiVersion 1.0.0
 * @api {post} /signup Signup
 * @apiName Signup
 * @apiGroup User
 * @apiParam {email} email  unique and requried.
 * @apiParam {String} password  requried .
 * @apiSuccess {String} message "User created"
 * @apiSuccessExample Example data on success:
 * {
    "status": "0",
    "message": "User created"
}
 *@apiErrorExample Example validation error:
 {
    "status": "2",
    "message": "Mail exists"
}
 */
exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                helpers_log.all_log(req, res, "2", "Mail exists",JSON.stringify({email: req.body.email}));
                return res.status(200).json({
                    status: "2",
                    message: "Mail exists"
                });
            } else {
                if (req.body.password == '') {
                    helpers_log.all_log(req, res, "2", 'password is required');
                    return res.status(200).json({
                        status: "2",
                        error: 'password is required'
                    });
                }
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    let User_json_signup =JSON.stringify({email: req.body.email,password: hash});
                    if (err) {
                        helpers_log.all_log(req, res, "2", 'password is required',User_json_signup);
                        return res.status(200).json({
                            status: "2",
                            error: 'password is required'
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                helpers_log.TransactionLog(req, res, "User created");
                                helpers_log.all_log(req, res, "0", 'User created',User_json_signup,user)
                                res.status(200).json({
                                    status: "0",
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                helpers_log.all_log(req, res, "2", err.message,User_json_signup)
                                res.status(500).json({
                                    status: "2",
                                    error: err.message
                                });
                            });
                    }
                });
            }
        });
};

/**
 * @apiVersion 1.0.0
 * @api {post} /signin Signin
 * @apiName Signin
 * @apiGroup User
 * @apiParam {email} email  unique and requried.
 * @apiParam {password} password  requried .
 * @apiSuccess {String} message "Auth successfully"
 * @apiSuccess {String} token
 * @apiSuccess {String} expiresIn
 * @apiSuccess {String} userId
 * @apiSuccessExample Example data on success:
 * {
    "status": "0",
    "message": "Auth successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJDb2RlcnNlYV9hY2Nlc3NfdG9rZW4iLCJzdWIiOiI1YjRjZTAxMWZkODJjZjA3Nzg2N2MzZDIiLCJpYXQiOjE1MzE5OTYyMjI2NDIsImV4cCI6MTUzMTk5NzEyM30.bSjkxZ4mE7Ejzo1lzt7L8v6wxVg_6WMhfDXZ91sc9DY",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJDb2RlcnNlYV9yZWZyZXNoX3Rva2VuIiwic3ViIjoiNWI0Y2UwMTFmZDgyY2YwNzc4NjdjM2QyIiwiaWF0IjoxNTMxOTk2MjIyNjQzLCJleHAiOjE1MzQ1ODgyMjN9.hyl0Ym5C1Zqw2nu2UtUdm0b8c6Rz8ZernFMTkLdyHz0",
    "expiresIn": 1531997123,
    "userId": "5b4ce011fd82cf077867c3d2"
}
 *@apiErrorExample Example validation error:
 {
    "status": "2",
    "message": "You entered wrong password"
}
 */
exports.user_signin = (req, res, next) => {
    User.findOne({email: req.body.email})
        .exec()
        .then(user => {
            let User_json_signin = JSON.stringify({email: req.body.email,password: req.body.password});
            if (!user) {
                helpers_log.all_log(req, res, "3", "Sorry, You Are not A User",User_json_signin);
                return res.status(200).json({
                    status: "3",
                    message: "Sorry, you are not a user"
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (!result) {
                    helpers_log.all_log(req, res, "2", "You entered wrong password",User_json_signin);
                    res.status(200).json({
                        status: "2",
                        message: "You entered wrong password"
                    });
                } else {
                    var user_id = user._id;
                    const token = signToken(user);
                    const refreshtoken = refreshToken(user);
                    let update = {
                        "refreshToken": refreshtoken
                    };
                    User.updateMany({_id: user_id}, {$set: update})
                        .exec()
                        .then(result => {
                        })
                        .catch(err => {
                        });

                    const tokenDecode = jwt.decode(token);
                    const exp_date = tokenDecode.exp;
                    const Token = new Tokens({
                        _id: new mongoose.Types.ObjectId(),
                        token: token,
                        refreshToken: refreshtoken,
                        expiresIn: exp_date,
                        user_id: user._id
                    });
                    Token.save();
                    let response = JSON.stringify( {
                        status: "0",
                        message: "Auth successfully",
                        token: token,
                        refreshToken: refreshtoken,
                        expiresIn: exp_date,
                        userId: user._id
                    });
                    helpers_log.TransactionLog(req, res ,"Auth successfully");
                    helpers_log.all_log(req, res, "0", "Auth successfully",User_json_signin,response);
                    res.status(200).json({
                        status: "0",
                        message: "Auth successfully",
                        token: token,
                        refreshToken: refreshtoken,
                        expiresIn: exp_date,
                        userId: user._id
                    });

                }
            });
        })
        .catch(err => {
            helpers_log.all_log(req, res, "2", err.message,User_json_signin);
            res.status(500).json({
                status: "2",
                error: err.message
            });
        });
};
exports.refreshToken = (req, res, next) => {
    let refreshToken_json = JSON.stringify({refreshToken: req.body.refreshToken});
    if (req.body.refreshToken != null) {
        User.findOne({refreshToken: req.body.refreshToken})
            .exec()
            .then(user => {
                if (!user) {
                    helpers_log.all_log(req, res,"3", "Sorry, You Are not A User",refreshToken_json);
                    return res.status(200).json({
                        status: "3",
                        message: "Sorry, you are not a user"
                    });
                } else {
                    const token = signToken(user);
                    const tokenDecode = jwt.decode(token);
                    const exp_date = tokenDecode.exp;
                    const Token = new Tokens({
                        _id: new mongoose.Types.ObjectId(),
                        token: token,
                        expiresIn: exp_date,
                        refreshToken: req.body.refreshToken,
                        user_id: user._id
                    });
                    Token.save();
                    let response = JSON.stringify( {
                        status: "0",
                        message: "Auth successfully",
                        token: token,
                        expiresIn: exp_date,
                        userId: user._id
                    });
                    helpers_log.TransactionLog(req, res, "Auth successfully");
                    helpers_log.all_log(req, res,"0", "Auth successfully",refreshToken_json,response);
                    res.status(200).json({
                        status: "0",
                        message: "Auth successfully",
                        token: token,
                        expiresIn: exp_date,
                        userId: user._id
                    });
                }
            })
            .catch(err => {
                helpers_log.all_log(req, res,"1", err.message,refreshToken_json);
                res.status(500).json({
                    status: "1",
                    error: err.message
                });
            });
    } else {
        helpers_log.all_log(req, res,"1", "RefreshToken is reqired",refreshToken_json);
        res.status(200).json({
            status: "1",
            error: "RefreshToken is reqired"
        });
    }


};
exports.user_delete = (req, res, next) => {
    let user_delete_json = JSON.stringify({_id: req.params.userId});
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            helpers_log.TransactionLog(req, res, "User deleted");
            helpers_log.all_log(req, res,"0", "User deleted",user_delete_json);
            res.status(200).json({
                status:"0",
                message: "User deleted"
            });
        })
        .catch(err => {
            helpers_log.all_log(req, res,"2", err.message,user_delete_json);
            res.status(500).json({
                status:"2",
                error: err.message
            });
        });
};