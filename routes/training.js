const express = require('express');
const router = express.Router();
const TrainingCentre = require('../models/trainingcentre');

// TRAINING CENTRES PAGE
router.get('/', async (req, res) => {
  try {
    const centres = await TrainingCentre.find().sort({ district: 1 });

    // group by district
    const grouped = {};

    centres.forEach(c => {
      if (!grouped[c.district]) {
        grouped[c.district] = [];
      }
      grouped[c.district].push(c);
    });

    res.render('training-centre', { grouped });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;