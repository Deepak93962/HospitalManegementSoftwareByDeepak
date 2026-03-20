const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, refPath: 'patientModel', required: true },
    patientModel: { type: String, required: true, enum: ['User', 'Patient'], default: 'User' },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    slot: { type: String, required: true, default:"Not Assigned"},
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
    createdByRole: { type: String, enum: ['patient', 'receptionist', 'admin'], default: 'patient' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
