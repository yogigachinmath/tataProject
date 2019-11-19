const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
var bodyParser = require('body-parser')

const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect('mongodb://localhost:27017/tataProject',{useNewUrlParser:true,useUnifiedTopology: true});
const db= mongoose.connection
db.once('open',()=> console.log('connected'))
app.get('/',(req,res) => {
    res.json('connd');
})
app.use('/register',require('./routes/register'))
app.use('/login',require('./routes/login'))
app.use('/check',require('./routes/check'))
app.use('/admin',require('./routes/admin'))
app.use('/user',require('./routes/user'))
app.listen(3000);