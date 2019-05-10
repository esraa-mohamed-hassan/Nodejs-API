const express = require("express");
const router = express.Router();
const PatientController = require('../controllers/patients');


router.post("/addNewPatient", PatientController.add_new_patient);

router.get("/:patientId", PatientController.get_patient);

router.get("/", PatientController.get_all_patient);

router.patch("/:patientId", PatientController.update_patient);

router.delete("/:patientId", PatientController.delete_patient);

module.exports = router;