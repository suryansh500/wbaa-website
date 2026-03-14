require('dotenv').config();
const express = require('express');
const app = express();
const resultsRoutes = require('./routes/results');
const adminRoutes = require('./routes/admin');
const upcomingRoutes = require('./routes/upcoming');
const HomeGallery = require('./models/homegallery');
const trainingRoutes = require('./routes/training');
const session = require('express-session');
require('dotenv').config();
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT || 3000;

// view engine
app.set('view engine', 'ejs');

// static files
app.use(express.static('public'));

// body parser
app.use(express.urlencoded({ extended: true }));

// session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{
    httpOnly:true,
    secure: false,
    maxAge:1000*60*60*2
  }
}));
const loginLimiter = rateLimit({
  windowMs: 15*60*1000,
  max: 20
});

app.use('/admin/login', loginLimiter);
// routes
app.use('/results', resultsRoutes);
app.use('/admin', adminRoutes);
app.use('/upcoming', upcomingRoutes);
app.use('/training-centre', trainingRoutes);
// home
app.get('/', async (req, res) => {
  try {
    const galleryDoc = await HomeGallery
      .findOne();

    const galleryImages = galleryDoc?.images?.map(img => img.url) || [];

    res.render('index', {
      adminError: req.query.adminError,
      galleryImages
    });

  } catch (err) {
    console.error(err);
    res.render('index', {
      adminError: req.query.adminError,
      galleryImages: []
    });
  }
});

// db
mongoose.connect(process.env.MONGO_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// start server (MUST BE LAST)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
