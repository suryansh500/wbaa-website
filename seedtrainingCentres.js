const mongoose = require('mongoose');
const TrainingCentre = require('./models/trainingcentre');

mongoose.connect('mongodb://127.0.0.1:27017/wbaa')
  .then(() => console.log('Mongo connected'));

async function seed() {
  await TrainingCentre.deleteMany({});

  await TrainingCentre.insertMany([

    // =========================
    // NORTH 24 PARGANAS
    // =========================
    {
      district: "North 24 Parganas",
      centreName: "Dum Dum Sporting Club",
      headName: "Smritimay Das",
      phone: "8240241535",
      address: "P.K Guha Road (Lichubagan), Kolkata-700028"
    },
    {
      district: "North 24 Parganas",
      centreName: "Beast Mantra Academy",
      headName: "Prasenjit Patra",
      phone: "8961672311",
      address: "36, K.P Ghosal Road, Belgharia, Kolkata-700056"
    },
    {
      district: "North 24 Parganas",
      centreName: "Shyamnagar Armwrestling Academy",
      headName: "Amit Roy",
      phone: "9062533209",
      address: "21, Lelin Nagar, Garulia, Pin-743133"
    },

    // =========================
    // SOUTH 24 PARGANAS
    // =========================
    {
      district: "South 24 Parganas",
      centreName: "Pravati Sangha",
      headName: "Nitai Dey",
      phone: "9836903169",
      address: "1, Poddar Nagar, Jadavpore, Kolkata-700068"
    },
    {
      district: "South 24 Parganas",
      centreName: "S S I Fitness Gym",
      headName: "Smriti Mondal",
      phone: "",
      address: "60/A, Ramkrishna Pally, Behala"
    },
    // =========================
// KOLKATA
// =========================
{
  district: "Kolkata",
  centreName: "Freedom Armwrestling Training Centre",
  headName: "Elton Mc.Dormott",
  phone: "8910221420",
  address: "20/1 McLeod Street, Kolkata-700017"
},
{
  district: "Kolkata",
  centreName: "Stamina Unleased Gym",
  headName: "Devid Khan",
  phone: "8910115782",
  address: "289-D Darga Road, Kolkata-700017"
},

// =========================
// HOOGHLY
// =========================
{
  district: "Hooghly",
  centreName: "Serampore Wrest Hunter’s",
  headName: "Nandan Das",
  phone: "9330955414",
  address: "Dostipukur Park, Maniktala, Serampore-712201"
},
{
  district: "Hooghly",
  centreName: "Singur Armwrestling Academy",
  headName: "Debopriyo Bhattacharji",
  phone: "9748606578",
  address: "Green Park, Singur-712409"
},

// =========================
// BURDWAN
// =========================
{
  district: "Burdwan",
  centreName: "Asansol Armwrestling Training Centre",
  headName: "Punit Sharma",
  phone: "7001449215",
  address: "Mohishila Boys School Ground, Asansol-713303"
},
{
  district: "Burdwan",
  centreName: "Bamakali Fitness Centre",
  headName: "Indrajit Karmokar",
  phone: "8016739068",
  address: "Andal North Bazar, Andal-713321"
},

// =========================
// EAST MEDINIPORE
// =========================
{
  district: "East Medinipore",
  centreName: "Flame Strikers Martial Academy",
  headName: "Bidhan Jana",
  phone: "9434380964",
  address: "Mahishadal Hospital More, Haldia-721628"
},
{
  district: "East Medinipore",
  centreName: "Haldia Armwrestling Train Centre",
  headName: "Somsubhro Kuity",
  phone: "8900200698",
  address: "Kuity Para, Khanjanchak, Haldia-721601"
},

// =========================
// WEST MEDINIPORE
// =========================
{
  district: "West Medinipore",
  centreName: "Fighter Boys Club",
  headName: "Subhendu Chatterjee",
  phone: "9609779886",
  address: "Subhas Pally, Giri Maidan-721301"
},
{
  district: "West Medinipore",
  centreName: "Mahabir Multi Gym",
  headName: "Gopinath Gorai",
  phone: "6295283093",
  address: "Nutan Bazar, Danton-721426"
},

// =========================
// MURSHIDABAD
// =========================
{
  district: "Murshidabad",
  centreName: "Arm Beast Fitness Centre",
  headName: "Ripon Pal",
  phone: "7001097672",
  address: "Khargram, Kandi-742157"
},
{
  district: "Murshidabad",
  centreName: "Beast Fitness Centre",
  headName: "Mir Sanaul Ishlam",
  phone: "7550809789",
  address: "Arjunpore, Farakka-742212"
},

// =========================
// COOCHBEHAR
// =========================
{
  district: "Coochbehar",
  centreName: "The Health Institute",
  headName: "Sandipan Dey",
  phone: "8637806314",
  address: "Nutan Bazar, B.S Road-736101"
},
{
  district: "Coochbehar",
  centreName: "Coochbehar District Physical Culture Association",
  headName: "Bapi Das",
  phone: "9932920175",
  address: "Ganjabari More, Ward No.1-736101"
},

// =========================
// HOWRAH
// =========================
{
  district: "Howrah",
  centreName: "Spartan Arms",
  headName: "Sujal Sonkar",
  phone: "7980585600",
  address: "39/1 Tinkari Nath Bose Lane, Howrah-711106"
},

// =========================
// MALDA
// =========================
{
  district: "Malda",
  centreName: "Tarun Sangha Ground",
  headName: "Subroto Das",
  phone: "9614253340",
  address: "Dutta Para, Balia Nawabgunj, Old Malda-732128"
},

// =========================
// PURULIA
// =========================
{
  district: "Purulia",
  centreName: "Purulia Armwrestling Warriors",
  headName: "Abhishek Karmokar",
  phone: "8637569395",
  address: "Begunkoar, Jhalda-723202"
}
  ]);

  console.log("✅ Training centres inserted");
  process.exit();
}

seed();