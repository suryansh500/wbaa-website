const mongoose = require('mongoose');

const TrainingCentreSchema = new mongoose.Schema({
  district: { type: String, required: true },
  headName: { type: String, required: true },
  phone: String,
  address: String,
  centreName: String
}, { timestamps: true });

module.exports = mongoose.model('TrainingCentre', TrainingCentreSchema);