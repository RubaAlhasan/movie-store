const {Movie, validate} = require('../models/movie'); 
const {Comment, validateComment} = require('../models/comment'); 

const {Genre} = require('../models/genre');
const {Actor} = require('../models/actor');
const {Director} = require('../models/director');
const mongoose = require('mongoose');
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();
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
router.use(
  express.urlencoded({
    extended: true
  })
);
router.use(express.json());

router.get('/get', async (req, res) => {
 const movies = await Movie.find().sort('name');
  res.send(movies);
});

router.get('/get/:filter', async (req, res) => {
  const filter = req.params.filter;
 if(filter.indexOf("=") == -1)
 {
  res.send([]);
  return;
 }
 console.log(filter)
 const filterName = filter.split("=")[0]; 
  const filterValue = filter.split("=")[1]; 
   
  switch (filterName.toLowerCase())
  {
    case  "startwith":
    {
      const movies = await Movie.find({name:{$regex:"^"+filterValue}})  
      .sort('name');
      res.send(movies);
      break;
    }
    case "actor":
      {
      const movies = await Movie.find({'actors' :{$elemMatch:{name: {$regex:".*"+ filterValue + ".*"}}}})  
      .sort('name');
      res.send(movies);
      break;
      }
      case  "director":
      {
        const movies = await Movie.find( {'director.name' : {$regex:".*"+ filterValue + ".*"}})  
      .sort('name');
      res.send(movies);
      break;
      }
      case "name":
        {
          const movies = await Movie.find({name:{$regex:".*"+ filterValue + ".*"}})  
          .sort('name');
          res.send(movies);
          break;
        }
        case  "genre":
          {
            const movies = await Movie.find(
              {'genre.name' : {$regex:".*"+ filterValue + ".*"}})  
            .sort('name');
            res.send(movies);
            break;
          }
  }
 

  res.send(movies);
});

router.get('/getAverageRate/:movieId', async (req, res) => {

  if(!req.params.movieId) res.status(400).send('Invalid movie.');
else
{
 console.log(req.params.movieId);
let movie = await Movie.aggregate([
  {
    $match:{"_id": mongoose.Types.ObjectId(req.params.movieId.trimEnd()) }
  },
 
    {
      $unwind: "$rates"
    }  ,
    {
    $group: { 
    _id: '$_id', 
    total: {
      $avg : '$rates.value'    
    }
  }
    }
]);
console.log(movie);
res.send(movie);
}
 });

router.post('/add',[auth,admin], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');
 
  const actors = await Actor.find({_id :{$in:req.body.actors}});
  if (!actors) return res.status(400).send('Invalid actor.');

  const director = await Director.findById(req.body.directorId);
  if (!director) return res.status(400).send('Invalid director.');

  const movie = new Movie({ 
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    director: {
      _id: director._id,
      name: director.name
    },
    actors: actors,
    price:req.body.price,
    image:"",
    description:req.body.description
  });
  await movie.save();
  
  res.send(movie);
});

router.put('/update/:id',[auth,admin], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');
 
  const actors = await Actor.find({_id :{$in:req.body.actors}});
  if (!actors) return res.status(400).send('Invalid actor.');

  const director = await Director.findById(req.body.directorId);
  if (!director) return res.status(400).send('Invalid director.');

  const movie = await Movie.findByIdAndUpdate(req.params.id,
    { 
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      director: {
        _id: director._id,
        name: director.name
      },
      actors: actors,
      price:req.body.price,
      description:req.body.description
    }, { new: true });

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  
  res.send(movie);
});

router.delete('/delete/:id',[auth,admin], async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

//multipart/form-data
router.post('/uploadImage/:movieId',[auth,admin] ,upload.single('file'),async (req, res) => {
  console.log(req.file);
  if (!req.file) return res.status(404).send('No file uploaded.');

          //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
          let img = req.file;

          //Use the mv() method to place the file in upload directory (i.e. "uploads")
       //  var path='./uploads/MovieImages/' + req.params.movieId;      
        //  img.mv(path);
          const movie = await Movie.findByIdAndUpdate(req.params.movieId,
            { 
              Image:img.path
            }, { new: true });
        
          //send response
          res.send({
              status: true,
              message: 'File is uploaded',
              data: {
                  name: img.path,
                  mimetype: img.mimetype,
                  size: img.size
              }
          });
});

router.post("/AddRate/:movieId/:rate",[auth],async (req,res) =>{
  var userId=req.user._id;
  
 var rate = {user:userId,value:req.params.rate};
 let movie = await Movie.findOne({'_id':req.params.movieId.trim(),'rates':{$elemMatch:{user: userId}}});
 if( movie != null)
 {
  movie.rates.forEach(element => {
  
    if (element.user == userId)
    {
      element.value = rate.value ;
     return;
    }
    });

    movie= await movie.save();
 }
 
 else
   {
   movie = await Movie.findByIdAndUpdate(req.params.movieId,
       { $push: { rates: {user:userId.trim(),value:req.params.rate} } }, { new: true });
   }
       res.send(movie)
  });
 
  router.post("/AddComment/:movieId",[auth],async (req,res) =>{
 
    var text = req.body.text;
    var comment = new Comment(req.user.name,text,Date());
    const { error } = validateComment(comment); 
    if (error) return res.status(400).send(error.details[0].message);
    
    const movie = await Movie.findByIdAndUpdate(req.params.movieId,
       { $push: { comments: comment } }, { new: true });
       res.send(movie)
  
      });
      router.get("/Download/:movieId",[auth],async (req,res) =>{
        const movie = await Movie.findById(req.params.movieId)
        .select({Image:1});
        if (!movie) return res.status(400).send('Invalid movie.');
       console.log(movie);
       
        res.download(movie.Image);
      
          });
     
module.exports = router; 
 