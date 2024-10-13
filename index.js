require("dotenv").config();

const express = require('express');
const app  = express();
const Mongoconnect = require('./db')
port = 5000||process.env.PORT


Mongoconnect();

app.get('/',function(req,res){
    res.send('hello world')
})

app.listen(port,()=>{
   console.log(`Server is running on http://localhost:${port}`)
})

