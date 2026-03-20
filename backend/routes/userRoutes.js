const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const { getDoctors, getOnlinePatients } = require("../controllers/userController");

router.get("/doctors", protect, getDoctors);
router.get("/patients", protect, getOnlinePatients);

module.exports = router;