const express = require('express');
const Login = require('../models/login')
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/',(req,res,next)=>{
    const login = new Login({
        email:req.body.email,
        password:req.body.password
    })
    Login.countDocuments({email:req.body.email},(err,count)=>{
        if(err){
            res.status(500);
        }
        else{
            if(count>0){
                Login.countDocuments({email:req.body.email,password:req.body.password}).exec((err,valid)=>{
                    if(valid>0){
                        Login.find({email:req.body.email},{password:0}).limit(1).exec((err,val)=>{
                            console.log(val)
                           const accessToken = jwt.sign({
                                data: val
                              }, 'secret', { expiresIn: '2h' });
                            //   console.log(val[0].role);
                              res.status(200).json([{'accessToken':accessToken},{'role':val[0]}]);
                        })
                    }
                    else
                        res.status(403).json('invalid credentials')
                })
            }
            else{
                res.status(401).json('not registered')
            }
        }
    }) 
    // res.send('got it');
})
module.exports = router;