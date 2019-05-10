const mongoose = require("mongoose");
const passport = require('passport');
const passportConf = require('../../passport');
const Patient = require("../models/patient");
const Visit = require("../models/visit");
const FilesUploaded = require("../models/files_uploaded");
const helpers_log = require("../helpers/logsHelpers");
let arr = [];

// add patient
/**
 * @apiVersion 1.0.0
 * @api {post} /patient/addNewPatient Add Patient
 * @apiName Add Patient
 * @apiGroup Patient
 * @apiParam {String} patientName requried
 * @apiParam {String} email  unique and requried
 * @apiParam {String} surName  requried
 * @apiParam {Number} height  requried
 * @apiParam {Number} weight  requried
 * @apiParam {String} gender  requried
 * @apiParam {String} bloodType  requried
 * @apiParam {String} complaint  requried
 * @apiParam {Date} date  requried
 * @apiParam {Number} homeNo  requried
 * @apiParam {Number} mobileNo  requried
 * @apiParam {String} address  requried
 * @apiParam {String} contactName  optional
 * @apiParam {String} contactRelationship  optional
 * @apiParam {Number} contactPhoneNo  optional
 * @apiSuccess {Number} status "0"
 * @apiSuccess {String} message "Patient Added"
 * @apiSuccess {String} patientId
 * @apiSuccess {String} delete
 * @apiSuccess {String} _id
 * @apiSuccess {String} patientName
 * @apiSuccess {String} email
 * @apiSuccess {String} surName
 * @apiSuccess {Number} height
 * @apiSuccess {Number} weight
 * @apiSuccess {String} gender
 * @apiSuccess {String} bloodType
 * @apiSuccess {String} complaint
 * @apiSuccess {Date} date
 * @apiSuccess {Number} homeNo
 * @apiSuccess {Number} mobileNo
 * @apiSuccess {String} address
 * @apiSuccess {String} contactName
 * @apiSuccess {String} contactRelationship
 * @apiSuccess {Number} contactPhoneNo
 * @apiSuccess {Date} created_at
 * @apiSuccessExample Example data on success:
 * {
"status": "0",
"message": "Patient Added",
"patient": {
"patientId": 3,
"delete": "false",
"_id": "5b50692ad196681760cb5149",
"patientName": "Ali",
"email": "test2@test.com",
"surName": "Hassan",
"height": 170,
"weight": 70,
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
 "error": "Patients validation failed: patientName: Patient Name is required"
 }
 */
exports.add_new_patient = (req, res, next) => {
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
            var last_id;
            Patient.findOne().sort({created_at: -1}).exec(function (err, post) {
                if (post == null) {
                    last_id = 0;
                } else {
                    last_id = post['patientId'];
                }
                let req_patient = JSON.stringify({
                    patientName: req.body.patientName,
                    email: req.body.email,
                    surName: req.body.surName,
                    height: req.body.height,
                    weight: req.body.weight,
                    gender: req.body.gender,
                    bloodType: req.body.bloodType,
                    complaint: req.body.complaint,
                    date: req.body.date,
                    homeNo: req.body.homeNo,
                    mobileNo: req.body.mobileNo,
                    address: req.body.address,
                    contactName: req.body.contactName,
                    contactRelationship: req.body.contactRelationship,
                    contactPhoneNo: req.body.contactPhoneNo,
                });
                const patient = new Patient({
                    _id: new mongoose.Types.ObjectId(),
                    patientId: last_id + 1,
                    patientName: req.body.patientName,
                    email: req.body.email,
                    surName: req.body.surName,
                    height: req.body.height,
                    weight: req.body.weight,
                    gender: req.body.gender,
                    bloodType: req.body.bloodType,
                    complaint: req.body.complaint,
                    date: req.body.date,
                    homeNo: req.body.homeNo,
                    mobileNo: req.body.mobileNo,
                    address: req.body.address,
                    contactName: req.body.contactName,
                    contactRelationship: req.body.contactRelationship,
                    contactPhoneNo: req.body.contactPhoneNo,
                });
                patient
                    .save()
                    .then(result => {
                        helpers_log.TransactionLog(req, res, "Patient Added");
                        helpers_log.all_log(req, res, "0", "Patient Added", req_patient, patient);
                        res.status(200).json({
                            status: "0",
                            message: "Patient Added",
                            patient: patient
                        });
                    })
                    .catch(err => {
                        helpers_log.all_log(req, res, "2", err.message);
                        console.log(err.message);
                        res.status(500).json({
                            status: "2",
                            error: err.message
                        });
                    });
            });


    })(req, res, next);

};


// get one patient by id
/**
 * @apiVersion 1.0.0
 * @api {get} /patient/:id Get Patient
 * @apiName Get Patient
 * @apiGroup Patient
 * @apiSuccessExample Example data on success:
 * {
"status": "0",
"patient": {
"patientId": 3,
"delete": "false",
"_id": "5b50692ad196681760cb5149",
"patientName": "Ali",
"email": "test2@test.com",
"surName": "Hassan",
"height": 170,
"weight": 70,
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
},
"visits_info": []
}
 *@apiErrorExample Example Authorization error:
 {
 "status": "1",
 "message": "Authorization failed"
 }
 *@apiErrorExample Example validation error:
 {
 "status": "3",
 "message": "No found the Patient with ID : 5b50692ad196681760cb5166 "
 }
 */
exports.get_patient = (req, res, next) => {

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

        const id = req.params.patientId;

        Patient.findById(id)
            .exec()
            .then(doc => {

                if (doc.delete == 'true') {
                    helpers_log.all_log(req, res, "3", `No found the Patient with ID : ${doc._id} `, JSON.stringify({id: doc._id}));
                    res.status(200).json({
                        status: "3",
                        message: `No found the Patient with ID : ${doc._id} `
                    });
                } else {

                    helpers_log.TransactionLog(req, res);
                    const p = doc;

                    Visit.find({patient_id: p._id}).populate('image_id', 'path').exec().then(visits => {
                        let res_patient =
                            JSON.stringify({
                                status: "0",
                                patient: p,
                                visits_info: visits.map(doc => {
                                    return {
                                        _id: doc._id,
                                        visitorName: doc.visitorName,
                                        patient_id: doc.patient_id,
                                        date: doc.date,
                                        comment: doc.comment,
                                        image_info: doc.image_id,

                                    }
                                })
                            });
                        helpers_log.all_log(req, res, "0", `Patient with ID : ${doc._id} `, JSON.stringify({id: doc._id}), res_patient);
                        res.status(200).json({
                            status: "0",
                            patient: p,
                            visits_info: visits.map(doc => {
                                return {
                                    _id: doc._id,
                                    visitorName: doc.visitorName,
                                    patient_id: doc.patient_id,
                                    date: doc.date,
                                    comment: doc.comment,
                                    image_info: doc.image_id,
                                }
                            })
                        });
                    })
                }
            })
            .catch(err => {
                helpers_log.all_log(req, res, "2", err.message);
                res.status(500).json({status: "2", error: err.message});
            });
    })(req, res, next);
};


// get all patients
/**
 * @apiVersion 1.0.0
 * @api {get} /patient Get All Patient
 * @apiName Get All Patient
 * @apiGroup Patient
 * @apiSuccessExample Example data on success:
 * {
"status": "0",
"count": 2,
"patients": [
{
"_id": "5b2d2972873b8f107c588368",
"patientId": 1,
"patientName": "gggg",
"surName": "ggg",
"email": "ggg@fff.com",
"height": 44,
"weight": 44,
"gender": "male",
"bloodType": "A+",
"complaint": "sdfsdf",
"date": "2018-06-21T22:00:00.000Z",
"homeNo": 34234234234,
"mobileNo": 234234234234,
"address": "sdfsdfsd",
"contactName": "sdfdsf",
"contactRelationship": "sdfsdf",
"contactPhoneNo": 2555555555,
"delete": "false"
},
{
"_id": "5b50692ad196681760cb5149",
"patientId": 3,
"patientName": "Ali",
"surName": "Hassan",
"email": "test2@test.com",
"height": 170,
"weight": 70,
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
"delete": "false"
}
]
}
 }
 *@apiErrorExample Example Authorization error:
 {
 "status": "1",
 "message": "Authorization failed"
 }
 *@apiErrorExample Example validation error:
 {
 "status": "3",
 "message": "No Patients found"
 }
 */
exports.get_all_patient = (req, res, next) => {

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

        Patient.find({delete: {$ne: "true"}}).sort({created_at: 'descending'})
            .exec()
            .then(docs => {
                helpers_log.TransactionLog(req, res);
                const response = {
                    status: "0",
                    count: docs.length,
                    patients: docs.map(doc => {
                        return {
                            _id: doc._id,
                            patientId: doc.patientId,
                            patientName: doc.patientName,
                            surName: doc.surName,
                            email: doc.email,
                            height: doc.height,
                            weight: doc.weight,
                            gender: doc.gender,
                            bloodType: doc.bloodType,
                            complaint: doc.complaint,
                            date: doc.date,
                            homeNo: doc.homeNo,
                            mobileNo: doc.mobileNo,
                            address: doc.address,
                            contactName: doc.contactName,
                            contactRelationship: doc.contactRelationship,
                            contactPhoneNo: doc.contactPhoneNo,
                            delete: doc.delete
                        };
                    })
                };
                if (docs.length != []) {
                    helpers_log.all_log(req, res, "0", "Get all patients successfully", "", JSON.stringify(response));
                    res.status(200).json(response);
                } else {
                    helpers_log.all_log(req, res, "3", 'No Patients found');
                    res.status(200).json({
                        status: "3",
                        message: 'No Patients found'
                    });
                }
            })
            .catch(err => {
                helpers_log.all_log(req, res, "2", err.message);
                res.status(500).json({status: "2", error: err.message});
            });
    })(req, res, next);
};


// update one patient by id
/**
 * @apiVersion 1.0.0
 * @api {patch} /patient/:id Update Patient
 * @apiName Update Patient
 * @apiGroup Patient
 * @apiParam {String} patientName
 * @apiParam {String} email
 * @apiParam {String} surName
 * @apiParam {Number} height
 * @apiParam {Number} weight
 * @apiParam {String} gender
 * @apiParam {String} bloodType
 * @apiParam {String} complaint
 * @apiParam {Date} date
 * @apiParam {Number} homeNo
 * @apiParam {Number} mobileNo
 * @apiParam {String} address
 * @apiParam {String} contactName
 * @apiParam {String} contactRelationship
 * @apiParam {Number} contactPhoneNo
 * @apiSuccess {Number} status "0"
 * @apiSuccess {String} message "Patient updated"
 * @apiSuccess {String} patientId
 * @apiSuccess {String} delete
 * @apiSuccess {String} _id
 * @apiSuccess {String} patientName
 * @apiSuccess {String} email
 * @apiSuccess {String} surName
 * @apiSuccess {Number} height
 * @apiSuccess {Number} weight
 * @apiSuccess {String} gender
 * @apiSuccess {String} bloodType
 * @apiSuccess {String} complaint
 * @apiSuccess {Date} date
 * @apiSuccess {Number} homeNo
 * @apiSuccess {Number} mobileNo
 * @apiSuccess {String} address
 * @apiSuccess {String} contactName
 * @apiSuccess {String} contactRelationship
 * @apiSuccess {Number} contactPhoneNo
 * @apiSuccess {Date} created_at
 * @apiSuccess {Date} updated_at
 * @apiSuccessExample Example data on success:
 * {
"status": "0",
"message": "Patient updated",
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
"updated_at": "2018-07-19T14:12:35.985Z"
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
 "error": "Patients validation failed: patientName: Patient Name is required"
 }
 */
exports.update_patient = (req, res, next) => {
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
        const id = req.params.patientId;
        let update = req.body;
        update.updated_at = Date.now();
        let req_update_json = JSON.stringify({
            _id: id,
            update_data: update
        });

            Patient.updateMany({_id: id}, {$set: update})
                .exec()
                .then(result => {
                helpers_log.TransactionLog(req, res, 'Patient updated');
            Patient.findById(id).exec().then(result => {
                const patient = result;
            let res_upadte_json = JSON.stringify({
                status: "0",
                message: 'Patient updated',
                patient: patient
            });
            helpers_log.all_log(req, res, "0", "Patient updated", req_update_json, res_upadte_json);
            res.status(200).json({
                status: "0",
                message: 'Patient updated',
                patient: patient
            });
        });
        })
        .catch(err => {
                helpers_log.all_log(req, res, "2", err.message);
            res.status(500).json({status: "2", error: err.message});
        });

    })(req, res, next);
};


// delete one product by id
/**
 * @apiVersion 1.0.0
 * @api {delete} /patient/:id Delete Patient
 * @apiName Delete Patient
 * @apiGroup Patient
 * @apiSuccess {Number} status "0"
 * @apiSuccess {String} message "Patient deleted"
 * @apiSuccessExample Example data on success:
 * {
"status": "0",
"message": "Patient deleted"
}
 *@apiErrorExample Example Authorization error:
 {
 "status": "1",
 "message": "Authorization failed"
 }
 */
exports.delete_patient = (req, res, next) => {
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

        const id = req.params.patientId;
        updateOps = {delete: true, deleted_at: Date.now()};
        Patient.updateMany({_id: id}, {$set: updateOps})
            .exec()
            .then(result => {
                helpers_log.TransactionLog(req, res, 'Patient deleted');
                let req_delete_json = JSON.stringify({_id: id});
                let res_delete_json = JSON.stringify({
                    status: "0",
                    message: 'Patient deleted',
                });
                helpers_log.all_log(req, res, "0", "Patient deleted", req_delete_json, res_delete_json);
                res.status(200).json({
                    status: "0",
                    message: 'Patient deleted',
                });
            })
            .catch(err => {
                helpers_log.all_log(req, res, "2", err.message);
                res.status(500).json({status: "2", error: err.message});
            });
    })(req, res, next);
};
