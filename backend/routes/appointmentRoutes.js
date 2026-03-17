const express = require("express");
const router = express.Router();
 
const {
  createAppointment,
  getAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  getWeeklyStats,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/auth");


// Patient books appointment
router.post("/", protect, createAppointment);


// Admin / Receptionist see all appointments
router.get("/", protect, getAppointments);


// ⭐ Doctor see only his appointments
router.get("/doctor", protect, getDoctorAppointments);


// ⭐ Doctor update appointment status
router.put("/:id/status", protect, updateAppointmentStatus);

router.get("/weekly", protect, getWeeklyStats);


module.exports = router;