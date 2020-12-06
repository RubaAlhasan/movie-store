const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Actor, validate} = require('../models/actor');
const mongoose = require('mongoose');
const express = require('express');

var multer  = require('multer')

const storage = multer.diskStorage({
  destination: './uploads/movieimages/',
  filename(req, file, cb) {
    var currentdate = new Date(); 
    var datetime =currentdate.getFullYear().toString()  +  (parseInt(currentdate.getMonth())    + 1).toString() 
       +   currentdate.getDate().toString() + 
      + currentdate.getHours().toString()  
      + currentdate.getMinutes().toString()  +  currentdate.getSeconds().toString() ; 
    cb(null, `${datetime}-${file.originalname}`);
   }
  
});

const upload = multer({ storage });


const router = express.Router();
router.use(
  express.urlencoded({
    extended: true
  })
);
router.use(express.json());

router.get('/get/', async (req, res) => {
    const Actors = await Actor.find().sort('name');
    res.send(Actors);

});

router.get('/get/:startWithfilter', async (req, res) => {
  const filter = req.params.startWithfilter;
  const Actors = await Actor.find({name:{$regex : "^" + filter}})
  .sort('name');
    res.send(Actors);
});


router.post('/add', [auth, admin],upload.single('file'), async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  let path="";
  if (req.file) 
   path = req.file.path;
  let actor = new Actor({ name: req.body.name,Image:path });
  actor = await actor.save();
  
  res.send(actor);
});

router.delete('/delete/:id', [auth, admin], async (req, res) => {
  const actor = await Actor.findByIdAndRemove(req.params.id);

  if (!actor) return res.status(404).send('The actor with the given ID was not found.');

  res.send(actor);
});

router.get('/getById/:id', async (req, res) => {
  const actor = await Actor.findById(req.params.id);
  if (!actor) return res.status(404).send('The actor with the given ID was not found.');

  res.send(actor);
});

module.exports = router;