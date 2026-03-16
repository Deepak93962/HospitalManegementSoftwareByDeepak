const Appointment = require("../models/Appointment");

const createAppointment = async (req, res) => {
  try {

    const appointment = await Appointment.create({
      patient: req.user._id,   // auto patient
      doctor: req.body.doctor,
      date: req.body.date,
      reason: req.body.reason
    });

    res.status(201).json(appointment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

module.exports = { createAppointment, getAppointments };