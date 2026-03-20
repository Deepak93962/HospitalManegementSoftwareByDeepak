const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  age: Number,

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },

  contact: {
    type: String,
    required: true
  },

  email: String,

  address: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // receptionist
  }

}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);