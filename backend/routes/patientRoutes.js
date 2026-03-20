const express = require("express");
const router = express.Router();
const { getPatients } = require("../controllers/patientController");
const { protect } = require("../middleware/auth");

// Admin / Receptionist can get all created patients
router.get("/", protect, getPatients);

module.exports = router;
