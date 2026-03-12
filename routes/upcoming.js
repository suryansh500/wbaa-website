const express = require('express');
const router = express.Router();
const UpcomingMatch = require('../models/upcomingMatches');

router.get('/', async (req, res) => {
  try {
    const matches = await UpcomingMatch.find().sort({ date: 1 });
    res.render('upcoming', { matches });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;