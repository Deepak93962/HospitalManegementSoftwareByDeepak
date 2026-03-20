const Patient = require("../models/Pateint");

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate("createdBy", "name email");
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPatients };
