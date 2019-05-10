const mongoose = require("mongoose");
const passport = require('passport');
const passportConf = require('../../passport');
const Visit = require("../models/visit");
const Patient = require("../models/patient");
const FilesUploaded = require("../models/files_uploaded");
const helpers_log = require("../helpers/logsHelpers");

// add visit
/**
 * @apiVersion 1.0.0
 * @api {post} /visit/addVisit Add Visit
 * @apiName Add Visit
 * @apiGroup Visit
 * @apiParam {String} patient_id  requried
 * @apiParam {Date} date  requried
 * @apiParam {String} comment  requried
 * @apiParam {Number} image  requried
 * @apiSuccess {Number} status "0"
 * @apiSuccess {String} message "Visit Added"
 * @apiSuccess {Object} visit
 * @apiSuccess {Object} patient
 * @apiSuccessExample Example data on success:
 * {
    "status": "0",
    "message": "Visit Added",
    "data": {
        "visit": {
            "delete": "false",
            "_id": "5b509fc776f49d5bb003550b",
            "patient_id": "5b50692ad196681760cb5149",
            "date": "2018-07-16T22:00:00.000Z",
            "comment": "test",
            "image_id": "5b509fc776f49d5bb0035507",
            "image": "uploads\\19Keto_Fuel.png",
            "created_at": "2018-07-19T14:27:19.515Z",
            "__v": 0
        },
        "patient": {
            "patientId": 3,
            "delete": "false",
            "_id": "5b50692ad196681760cb5149",
            "patientName": "hussien",
            "email": "test2@test.com",
            "surName": "Hassan",
            "height": 170,
            "weight": 90,
            "gender": "male",
            "bloodType": "O+",
            "complaint": "fghfgh",
            "date": "2018-07-12T22:00:00.000Z",
            "homeNo": 123456789,
            "mobileNo": 123456789,
            "address": "Cairo ,Egypt",
            "contactName": "Ahmed",
            "contactRelationship": "Brother",
            "contactPhoneNo": 987654321,
            "created_at": "2018-07-19T10:34:18.849Z",
            "__v": 0,
            "updated_at": "2018-07-19T14:12:35.985Z"
        }
    }
}
 *@apiErrorExample Example Authorization error:
 {
   "status": "1",
   "message": "Authorization failed"
 }
 *@apiErrorExample Example validation error:
 {
    "status": "2",
    "error": "No Image uploaded"
}

 */
exports.add_visit = (req, res, next) => {
    passport.authenticate('jwt', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            helpers_log.all_log(req, res, "1", "Authorization failed");
            return res.json({
                status: "1",
                message: "Authorization failed"
            });
        }
        Patient.findOne({_id: req.body.patient_id})
            .exec()
            .then(patient => {
                if (!patient) {
                    helpers_log.all_log(req, res, "3", `No found the Patient with ID : ${patient._id} `);
                    return res.status(500).json({
                        status: "3",
                        message: `No found the Patient with ID : ${patient._id} `
                    });
                } else {

                    if(req.body.image === null){

                        const visit = new Visit({
                            _id: new mongoose.Types.ObjectId(),
                            patient_id: patient._id,
                            date: req.body.date,
                            comment: req.body.comment,
                        });
                        visit
                            .save()
                            .then(result => {
                                let req_visit_json = JSON.stringify({
                                    _id: new mongoose.Types.ObjectId(),
                                    patient_id: patient._id,
                                    date: req.body.date,
                                    comment: req.body.comment,
                                });
                                let res_visit_json = JSON.stringify({
                                    status: "0",
                                    message: "Visit Added",
                                    data: {visit, patient}
                                });
                                helpers_log.TransactionLog(req, res, "Visit Added");
                                helpers_log.all_log(req, res, "0", "Visit Added", req_visit_json, res_visit_json);
                                res.status(200).json({
                                    status: "0",
                                    message: "Visit Added",
                                    data: {visit, patient}
                                });
                            })
                            .catch(err => {
                                helpers_log.all_log(req, res, "2", err.message);
                                res.status(500).json({
                                    status: "2",
                                    error: err.message
                                });
                            });
                    }else {
                            const files = new FilesUploaded({
                                _id: new mongoose.Types.ObjectId(),
                                originalname: req.file.originalname,
                                filename: req.file.filename,
                                mimetype: req.file.mimetype,
                                destination: req.file.destination,
                                path: req.file.path,
                                size: req.file.size,
                            });

                            files.save();
                            let res_files = JSON.stringify({
                                _id: new mongoose.Types.ObjectId(),
                                originalname: req.file.originalname,
                                filename: req.file.filename,
                                mimetype: req.file.mimetype,
                                destination: req.file.destination,
                                path: req.file.path,
                                size: req.file.size
                            });
                            helpers_log.TransactionLog(req, res, "uploaded is Successfully");
                            helpers_log.all_log(req, res, "0", "uploaded is Successfully", "", res_files);
                            const visit = new Visit({
                                _id: new mongoose.Types.ObjectId(),
                                patient_id: patient._id,
                                date: req.body.date,
                                comment: req.body.comment,
                                image: files._id,
                                image_id: files._id,
                            });
                            visit
                                .save()
                                .then(result => {
                                    let req_visit_json = JSON.stringify({
                                        _id: new mongoose.Types.ObjectId(),
                                        patient_id: patient._id,
                                        date: req.body.date,
                                        comment: req.body.comment,
                                        image: files._id,

                                    });
                                    let res_visit_json = JSON.stringify({
                                        status: "0",
                                        message: "Visit Added",
                                        data: {visit, patient}
                                    });
                                    helpers_log.TransactionLog(req, res, "Visit Added");
                                    helpers_log.all_log(req, res, "0", "Visit Added", req_visit_json, res_visit_json);
                                    visit.image = files.path;
                                    res.status(200).json({
                                        status: "0",
                                        message: "Visit Added",
                                        data: {visit, patient}
                                    });
                                })
                                .catch(err => {
                                    helpers_log.all_log(req, res, "2", err.message);
                                    res.status(500).json({
                                        status: "2",
                                        error: err.message
                                    });
                                });
                        }
                }
            })
            .catch(err => {
                helpers_log.all_log(req, res, "2", err.message);
                res.status(500).json({
                    status: "2",
                    error: err.message
                });
            });
    })(req, res, next);
};


// get one visit by id
/**
 * @apiVersion 1.0.0
 * @api {get} /visit/:id Get Visit
 * @apiName Get Visit
 * @apiGroup Visit
 * @apiSuccess {Number} status "0"
 * @apiSuccess {Object} visitInfo
 * @apiSuccessExample Example data on success:
 * {
    "status": "0",
    "visitInfo": {
        "delete": "false",
        "_id": "5b509fc776f49d5bb003550b",
        "patient_id": "5b50692ad196681760cb5149",
        "date": "2018-07-16T22:00:00.000Z",
        "comment": "test",
        "image_id": "5b509fc776f49d5bb0035507",
        "image": "uploads\\19Keto_Fuel.png",
        "created_at": "2018-07-19T14:27:19.515Z",
    }
}
 *@apiErrorExample Example Authorization error:
 {
   "status": "1",
   "message": "Authorization failed"
 }
 */
exports.get_visit = (req, res, next) => {
    passport.authenticate('jwt', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            helpers_log.all_log(req, res, "1", "Authorization failed");
            return res.json({
                status: "1",
                message: "Authorization failed"
            });
        }
        Visit.findOne({_id: req.params.visitId})
            .exec()
            .then(visit => {
                FilesUploaded.findOne({_id: visit.image_id})
                    .exec()
                    .then(files => {
                        visit.image = files.path;
                        let res_getvisit = JSON.stringify({status: "0", visitInfo: visit});
                        let req_getvisit = JSON.stringify({_id: req.params.visitId});
                        helpers_log.TransactionLog(req, res);
                        helpers_log.all_log(req, res, "0",`Get visit the Visit ID : ${req.params.visitId} `,req_getvisit,res_getvisit );
                        res.status(200).json({
                            status: "0",
                            visitInfo: visit,
                        });
                    })
            })
            .catch(err => {
            helpers_log.all_log(req, res, "2",err.message);
            res.status(500).json({status: "2", error: err.message});
        })

    })(req, res, next);
};



