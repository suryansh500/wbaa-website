const express = require('express');
const router = express.Router();
const Tournament = require('../models/tournaments');

/*
  RESULTS PAGE
  Groups tournaments by year (newest first)
*/
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({date: -1});

    // Group by year and KEEP ORDER
const groupedResults = [];

tournaments.forEach(t => {
  let group = groupedResults.find(g => g.year === t.year);

  if (!group) {
    group = { year: t.year, tournaments: [] };
    groupedResults.push(group);
  }

  group.tournaments.push(t);
});
  res.render('results', { groupedResults });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

/*
  SINGLE TOURNAMENT PAGE
*/
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).send('Tournament not found');
    }

    res.render('tournament', { tournament });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
