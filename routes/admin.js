
const express = require('express');
const router = express.Router();
const Tournament = require('../models/tournaments');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const UpcomingMatch = require('../models/upcomingMatches');
const HomeGallery = require('../models/homegallery');
const TrainingCentre=require('../models/trainingcentre');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
console.log('Cloudinary config check:', cloudinary.config());

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'wbaa/others';

    if (file.fieldname === 'poster') folder = 'wbaa/posters';
    if (file.fieldname === 'images') folder = 'wbaa/gallery/images';
    if (file.fieldname === 'videos') folder = 'wbaa/gallery/videos';

    return {
      folder,
      resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
      public_id: Date.now() + '-' + file.originalname.replace(/\s+/g, '_')
    };
  }
});

const upload = multer({ storage });


router.get('/dashboard', (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect('/');
  }

  res.render('admin/dashboard', {
    success: req.query.success,
    error: req.query.error
  });
});
// ===============================
// ADMIN — LIST ALL TOURNAMENTS
// ===============================
router.get('/manage-results', async (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect('/');
  }

  try {
    const tournaments = await Tournament.find().sort({ date: -1 });

    res.render('admin/manage-results', { tournaments });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard?error=1');
  }
});
router.post('/tournaments/:id/delete', async (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/');

  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.redirect('/admin/manage-results');

    // =========================
    // DELETE POSTER
    // =========================
    if (tournament.poster?.public_id) {
      await cloudinary.uploader.destroy(tournament.poster.public_id);
    }

    // =========================
    // DELETE GALLERY IMAGES
    // =========================
    if (tournament.gallery?.images?.length > 0) {
      for (const img of tournament.gallery.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    // =========================
    // DELETE GALLERY VIDEOS
    // =========================
    if (tournament.gallery?.videos?.length > 0) {
      for (const vid of tournament.gallery.videos) {
        if (vid.public_id) {
          await cloudinary.uploader.destroy(vid.public_id, {
            resource_type: 'video'
          });
        }
      }
    }

    // =========================
    // DELETE FROM MONGO
    // =========================
    await Tournament.findByIdAndDelete(req.params.id);

    res.redirect('/admin/manage-results');

  } catch (err) {
    console.error(err);
    res.redirect('/admin/manage-results');
  }
});
// EDIT TOURNAMENT PAGE
router.get('/tournaments/:id/edit', async (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/');

  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.redirect('/admin/manage-results');

    res.render('admin/add-tournament', {
      tournament,
      isEdit: true
    });

  } catch (err) {
    console.error(err);
    res.redirect('/admin/manage-results');
  }
});

// show add tournament form
router.get('/tournaments/new', (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect('/');
  }

  res.render('admin/add-tournament', {
    isEdit: false,
    tournament: null
  });
});


// login
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.redirect('/admin/dashboard');
  }

  res.redirect('/?adminError=1');
});

// logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});
// save tournament
router.post('/tournaments',upload.fields([{ name: 'poster', maxCount: 1 },{ name: 'images' },{ name: 'videos' }]), async (req, res) => {
  console.log('BODY:', req.body);
  console.log('FILES:', req.files);
  if (!req.session.isAdmin) {
    return res.redirect('/');
  }

  try {
    const {
      name,
      location,
      date,
      gender,
      division,
      hand,
      weight,
      first,
      second,
      third,
      fourth,
      fifth
    } = req.body;

    let categories = [];

if (Array.isArray(gender)) {
  categories = gender.map((_, i) => ({
    gender: gender[i],
    division: division[i],
    hand: hand[i],
    weight: weight[i],
    results: {
      first: first[i],
      second: second[i],
      third: third[i],
      fourth: fourth[i],
      fifth: fifth[i]
    }
  }));
}
const posterData = req.files?.poster
  ? {
      url: req.files.poster[0].path,
      public_id: req.files.poster[0].filename
    }
  : undefined;

const imageData = req.files?.images
  ? req.files.images.map(file => ({
      url: file.path,
      public_id: file.filename
    }))
  : [];

const videoData = req.files?.videos
  ? req.files.videos.map(file => ({
      url: file.path,
      public_id: file.filename
    }))
  : [];

  const tournament = new Tournament({
  name,
  location,
  date,
  year: new Date(date).getFullYear(),

poster: posterData,

gallery: {
  images: imageData,
  videos: videoData
},


  categories // can be empty
});

    await tournament.save();

    res.redirect('/admin/dashboard?success=1');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard?error=1');
  }
});
// UPDATE TOURNAMENT
router.post('/tournaments/:id/update',
  upload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'images' },
    { name: 'videos' }
  ]),
  async (req, res) => {

    if (!req.session.isAdmin) return res.redirect('/');

    try {
      const tournament = await Tournament.findById(req.params.id);
      if (!tournament) return res.redirect('/admin/manage-results');

      const {
        name,
        location,
        date,
        gender,
        division,
        hand,
        weight,
        first,
        second,
        third,
        fourth,
        fifth,
        removeImages,
        removeVideos,
        removePoster
      } = req.body;

      // =========================
      // BASIC UPDATE
      // =========================
      tournament.name = name;
      tournament.location = location;
      tournament.date = date;
      tournament.year = new Date(date).getFullYear();

      // =========================
      // REMOVE POSTER IF REQUESTED
      // =========================
      if (removePoster && tournament.poster?.public_id) {
        await cloudinary.uploader.destroy(tournament.poster.public_id);
        tournament.poster = null;
      }

      // =========================
      // NEW POSTER UPLOAD
      // =========================
      if (req.files?.poster) {
        if (tournament.poster?.public_id) {
          await cloudinary.uploader.destroy(tournament.poster.public_id);
        }

        tournament.poster = {
          url: req.files.poster[0].path,
          public_id: req.files.poster[0].filename
        };
      }

      // =========================
      // REMOVE SELECTED IMAGES
      // =========================
      if (removeImages) {
        const removeList = Array.isArray(removeImages)
          ? removeImages
          : [removeImages];

        tournament.gallery.images = tournament.gallery.images.filter(img => {
          if (removeList.includes(img.public_id)) {
            cloudinary.uploader.destroy(img.public_id);
            return false;
          }
          return true;
        });
      }

      // =========================
      // REMOVE SELECTED VIDEOS
      // =========================
      if (removeVideos) {
        const removeList = Array.isArray(removeVideos)
          ? removeVideos
          : [removeVideos];

        tournament.gallery.videos = tournament.gallery.videos.filter(vid => {
          if (removeList.includes(vid.public_id)) {
            cloudinary.uploader.destroy(vid.public_id, { resource_type: 'video' });
            return false;
          }
          return true;
        });
      }

      // =========================
      // ADD NEW IMAGES
      // =========================
      if (req.files?.images) {
        req.files.images.forEach(file => {
          tournament.gallery.images.push({
            url: file.path,
            public_id: file.filename
          });
        });
      }

      // =========================
      // ADD NEW VIDEOS
      // =========================
      if (req.files?.videos) {
        req.files.videos.forEach(file => {
          tournament.gallery.videos.push({
            url: file.path,
            public_id: file.filename
          });
        });
      }

      // =========================
      // RESULTS REBUILD
      // =========================
      let categories = [];

      if (Array.isArray(gender)) {
        categories = gender.map((_, i) => ({
          gender: gender[i],
          division: division[i],
          hand: hand[i],
          weight: weight[i],
          results: {
            first: first[i],
            second: second[i],
            third: third[i],
            fourth: fourth[i],
            fifth: fifth[i]
          }
        }));
      }

      tournament.categories = categories;

      await tournament.save();

      res.redirect('/admin/manage-results');

    } catch (err) {
      console.error(err);
      res.redirect('/admin/manage-results');
    }
});
// ===============================
// ADMIN — MANAGE UPCOMING MATCHES
// ===============================
router.get('/manage-upcoming', async (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/');

  try {
    const matches = await UpcomingMatch.find().sort({ date: 1 });

    res.render('admin/manage-upcoming', { matches });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard?error=1');
  }
});
// ===============================
// SAVE UPCOMING MATCH
// ===============================
router.post(
  '/upcoming',
  upload.fields([{ name: 'poster', maxCount: 1 }]),
  async (req, res) => {

    if (!req.session.isAdmin) return res.redirect('/');

    try {
      const { name, location, date } = req.body;

      // poster processing
      const posterData = req.files?.poster
        ? {
            url: req.files.poster[0].path,
            public_id: req.files.poster[0].filename
          }
        : null;

      const match = new UpcomingMatch({
        name,
        location,
        date,
        poster: posterData
      });

      await match.save();

      res.redirect('/admin/manage-upcoming');

    } catch (err) {
      console.error(err);
      res.redirect('/admin/manage-upcoming');
    }
  }
);
// ===============================
// DELETE UPCOMING MATCH
// ===============================
router.post('/upcoming/:id/delete', async (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/');

  try {
    const match = await UpcomingMatch.findById(req.params.id);
    if (!match) return res.redirect('/admin/manage-upcoming');

    // delete poster from cloudinary
    if (match.poster?.public_id) {
      await cloudinary.uploader.destroy(match.poster.public_id);
    }

    await UpcomingMatch.findByIdAndDelete(req.params.id);

    res.redirect('/admin/manage-upcoming');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/manage-upcoming');
  }
});
// ===============================
// ADD UPCOMING MATCH FORM
// ===============================
router.get('/upcoming/new', (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/');

  res.render('admin/add-upcoming');
});
// ===============================
// ADMIN — HOME GALLERY PAGE
// ===============================
router.get('/home-gallery', async (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/');

  try {
    const gallery = await HomeGallery.findOne();

    res.render('admin/home-gallery', {
      images: gallery?.images || []
    });

  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard?error=1');
  }
});
router.post('/home-gallery/update',
  upload.array('images'),
  async (req, res) => {

    if (!req.session.isAdmin) return res.redirect('/');

    try {
      let gallery = await HomeGallery.findOne();

      // create doc if not exists
      if (!gallery) {
        gallery = new HomeGallery({ images: [] });
      }

      const { removeImages } = req.body;

      // 🔴 REMOVE SELECTED
      if (removeImages) {
        const removeList = Array.isArray(removeImages)
          ? removeImages
          : [removeImages];

        gallery.images = gallery.images.filter(img => {
          if (removeList.includes(img.public_id)) {
            cloudinary.uploader.destroy(img.public_id);
            return false;
          }
          return true;
        });
      }

      // 🟢 ADD NEW IMAGES
      if (req.files?.length) {
        req.files.forEach(file => {
          gallery.images.push({
            url: file.path,
            public_id: file.filename
          });
        });
      }

      await gallery.save();

      res.redirect('/admin/home-gallery');

    } catch (err) {
      console.error(err);
      res.redirect('/admin/home-gallery');
    }
});
// ===============================
// ADMIN — LIST TRAINING CENTRES
// ===============================
router.get('/training-centre', async (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/');

  try {
    const centres = await TrainingCentre.find().sort({ district: 1 });
    res.render('admin/training-centre', { centres });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard?error=1');
  }
});


// ===============================
// ADMIN — ADD TRAINING CENTRE
// ===============================
router.post('/training-centre/add', async (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/');

  try {
    const { district, centreName, headName, phone, address } = req.body;

    await TrainingCentre.create({
      district,
      centreName,
      headName,
      phone,
      address
    });

    res.redirect('/admin/training-centre');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/training-centre');
  }
});


// ===============================
// ADMIN — DELETE TRAINING CENTRE
// ===============================
router.post('/training-centre/:id/delete', async (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/');

  try {
    await TrainingCentre.findByIdAndDelete(req.params.id);
    res.redirect('/admin/training-centre');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/training-centre');
  }
});
module.exports = router;
