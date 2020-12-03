const winston = require('winston');
const express = require('express');
const app = express();
 var logger =require('./startup/logging');
require("./startup/cors")(app);
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')(); 

app.post("/tests",(req,res)=>{
  
    console.log(req.body.name);
    res.send("ruba alhasanfsdf");
})


const port = process.env.PORT ||2000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
