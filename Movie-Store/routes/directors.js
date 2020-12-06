const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Director, validate} = require('../models/director');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
router.use(
  express.urlencoded({
    extended: true
  })
);
router.use(express.json());

router.get('/get', async (req, res) => {
  const Directors = await Director.find().sort('name');
  res.send(Directors);
});
router.get('/get/:startWithfilter', async (req, res) => {
  const filter = req.params.startWithfilter;
  const Directors = await Director.find({name:{$regex : "^"+filter}})
  .sort('name');
  res.send(Directors);
});
router.post('/add', [auth, admin],upload.single('file'), async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  let path="";
  if (req.file) 
   path = req.file.path;
  let director = new Director({ name: req.body.name, Image:path });
  director = await director.save();
  
  res.send(director);
});

router.delete('/delete/:id', [auth, admin], async (req, res) => {
  const director = await Director.findByIdAndRemove(req.params.id);

  if (!director) return res.status(404).send('The director with the given ID was not found.');

  res.send(director);
});

router.get('/getById/:id', async (req, res) => {
  const director = await Director.findById(req.params.id);
  if (!director) return res.status(404).send('The director with the given ID was not found.');

  res.send(director);
});

module.exports = router;