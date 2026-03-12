const mongoose = require('mongoose');

const upcomingMatchSchema = new mongoose.Schema({
  name: String,
  location: String,
  date: Date,
  year: Number,

  poster: {
    url: String,
    public_id: String
  }
  },

  { timestamps: true });

module.exports = mongoose.model('UpcomingMatch', upcomingMatchSchema);