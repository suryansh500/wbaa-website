const mongoose = require('mongoose');

const HomeGallerySchema = new mongoose.Schema({
  images: [
  {
    url: String,
    public_id: String
  }
]
}, { timestamps: true });

module.exports = mongoose.model('HomeGallery', HomeGallerySchema);