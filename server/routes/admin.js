const express = require('express');
const Login = require('../models/login');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const mongoose = require('mongoose');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});
const gc = new Storage({
  projectId: 'splitwise-ee7',
  keyFilename: path.join(__dirname, '../splitwise-f8589669d23c.json')
});
const bucket = gc.bucket('splitwise-ee7.appspot.com');

//mongoose model
let uploadFile = mongoose.Schema({
  uploadedByUserId: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});
let uploadFileToGoogle = mongoose.model('uploadFile', uploadFile, 'files');

// router.get('/',(req,res,next)=>{
//     res.json({
//         'a':'fs'
//     })
// })
router.post('/', upload.single('file'), (req, res, next) => {
  var decoded = jwt.decode(req.body.accessKey);
  console.log(decoded);
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }
  const blob = bucket.file(req.file.originalname.replace(/ /g, ''));
  const blobStream = blob.createWriteStream();
  blobStream.on('error', err => {
    next(err);
  });
  blobStream.on('finish', () => {
    let name = blob.name.split('.');
    let link = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    console.log(link, name);
    let fileUpload = new uploadFileToGoogle({
      uploadedByUserId: decoded.data[0]._id,
      link: link
    });
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    fileUpload.save(function(err, book) {
      if (err) return console.error(err);
      console.log(book + ' saved to bookstore collection.');
    });
    res.status(200).send(publicUrl);
  });
  blobStream.end(req.file.buffer);
});
module.exports = router;
