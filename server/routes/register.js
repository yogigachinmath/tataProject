const express = require('express');
const router = express.Router();
const Register = require('../models/register');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

let roleSchema = new mongoose.Schema({
    role:{
        type:String,
        required:true
    }
})
let roleModel = new mongoose.model('role',roleSchema,'roles');
router.post('/', async (req,res) => {
  const register = new Register({
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    role: req.body.role
  });
  const role = new roleModel({
      role:req.body.role
  })
  roleModel.countDocuments({role:req.body.role},(err,c)=>{
      console.log(c,'cc');
      if(c<1){
        role.save();  
      }
  })
      Register.countDocuments({ email: req.body.email }, async (err,c) => {
        if (c > 0) { 
            res.status(409).json('user already Exists');
        } else {
          try {       
            const registerNew = await register.save((err,data)=>{
            const accessToken = jwt.sign({
                data: { _id : data._id,
                    email: req.body.email,
                    username: req.body.username,
                    role: req.body.role }
              }, 'secret', { expiresIn: '2h' });
              res.status(200).json({'accessToken':accessToken});
            });
          } catch (err) {
            console.log(err);
            res.status(400);
          }
        }
      });
    })

module.exports = router;
