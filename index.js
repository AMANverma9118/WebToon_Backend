require("dotenv").config();

const express = require('express');
const app  = express();
const Mongoconnect = require('./db')
const rateLimit = require('express-rate-limit');
port = 5000||process.env.PORT

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, 
    max: 10, 
    message: 'Register krle, ye main sikha dunga'
});

Mongoconnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/',function(req,res){
    res.send('hello world')
})

app.use('/api/Webtoon', require('./Routes/Routes'))
app.use('/api/user', require('./Routes/User'))

app.listen(port,()=>{
   console.log(`Server is running on http://localhost:${port}`)
})