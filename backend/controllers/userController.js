const User = require("../models/User");

const getDoctors = async (req, res) => {
  try {

    const doctors = await User.find({ role: "Doctor" })
      .select("name email");

    res.json(doctors);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctors };