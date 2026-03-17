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

    const { date } = req.query;

    let filter = {};

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      filter.date = { $gte: start, $lte: end };
    }

    const appointments = await Appointment.find(filter)
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

     const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;

    //await appointment.save();

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