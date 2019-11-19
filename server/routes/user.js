const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

const getLinksSchema = new mongoose.Schema({});
const getLinkmodel = new mongoose.model('getLink',getLinksSchema,'files')
router.get('/',(req,res)=>{
    const getLink = new getLinkmodel({})
    getLinkmodel.find({},(err,links)=>{
       res.status(200).json(links);
    })
})
module.exports =router;