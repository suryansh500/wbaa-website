const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  date: { type: Date, required: true },
  year: { type: Number, required: true },

  poster: {
  url: String,
  public_id: String
},

gallery: {
  images: [
    {
      url: String,
      public_id: String
    }
  ],
  videos: [
    {
      url: String,
      public_id: String
    }
  ]
},

  categories: [
    {
      gender: String,
      division: String,
      hand: String,
      weight: String,
      results: {
        first: String,
        second: String,
        third: String,
        fourth: String,
        fifth: String
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Tournament', TournamentSchema);
