const Appointment = require("../models/Appointment");


// CREATE APPOINTMENT (Patient books)
const createAppointment = async (req, res) => {
  try {
    const { date } = req.body;

    // 🔥 Today date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);

    // ❌ Past date check
    if (selectedDate < today) {
      return res.status(400).json({
        message: "Cannot book appointment for past dates"
      });
    }

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
  end.setDate(end.getDate() + 1);

  filter.date = {
    $gte: start,
    $lt: end
  };
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
// GET WEEKLY STATS
const getWeeklyStats = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const appointments = await Appointment.find({
      date: { $gte: startOfWeek, $lt: endOfWeek }
    });
    console.log("Appointments 👉", appointments); // 🔥 DEBUG

    // Days array
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const data = days.map((day, index) => {
      const dayData = appointments.filter(a => {
        return new Date(a.date).getDay() === index;
      });

      return {
        day,
        noShow: dayData.filter(a => a.status === "Cancelled").length,
        reschedule: dayData.filter(a => a.status === "Pending").length,
        attended: dayData.filter(a => a.status === "Confirmed").length
      };
    });

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getDoctorAppointments,
  getWeeklyStats,
  updateAppointmentStatus
};