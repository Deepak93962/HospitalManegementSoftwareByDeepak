const Appointment = require("../models/Appointment");


// CREATE APPOINTMENT (Patient books)
const createAppointment = async (req, res) => {
  try {

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: req.body.doctor,
      date: req.body.date,
      slot: req.body.slot,
      reason: req.body.reason
    });

    res.status(201).json(appointment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL APPOINTMENTS (Admin / Receptionist)
const getAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name email");

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ⭐ GET DOCTOR APPOINTMENTS
const getDoctorAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find({
      doctor: req.user._id
    })
      .populate("patient", "name email");

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ⭐ UPDATE APPOINTMENT STATUS
const updateAppointmentStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;

    await appointment.save();

    res.json({ message: "Status updated", appointment });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createAppointment,
  getAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
};