const User = require("../models/User");

const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" })
      .select("-password");

    res.json(doctors);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOnlinePatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "Patient" })
      .select("-password");

    res.json(patients);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctors, getOnlinePatients };