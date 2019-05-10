const express = require("express");
const router = express.Router();
const VisitController = require('../controllers/visits');
const multer = require("multer");


/* Start upload */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().getSeconds() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

/* End upload */


router.post("/addVisit", upload.single('image'), VisitController.add_visit);

router.get("/:visitId", VisitController.get_visit);

module.exports = router;