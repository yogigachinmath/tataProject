const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017';

const checkUser = mongoose.Schema({
  id: {
    type: String,
    required: true
  }
});
const check = mongoose.model('checkUser', checkUser, 'registers');

const pagesSchema = mongoose.Schema({
  role: {
    type: String,
    required: true
  }
});
pagesSchema.set('toObject', { getters: true });
const pageModel = mongoose.model('pagesSchema', pagesSchema, 'pages');

router.post('/', (req, res, next) => {
  let Pathname = req.headers.referer.split('/');
  try {
    var decoded = jwt.verify(req.body.accessKey, 'secret');
    const id = decoded.data._id || decoded.data[0]._id;
    let roleOfUser = decoded.data.role || decoded.data[0].role;
    roleOfUser = roleOfUser.toLowerCase();
    if (Pathname[Pathname.length - 1] === 'control') {
      if (roleOfUser !== 'admin') {
        res.status(405).json('not allowed');
      }
    }
    let isValidUser = new check({
      id: id
    });
    check.find({ _id: id }, { password: 0 }, async (err, value) => {
      let page = new pageModel({
        role: roleOfUser
      });
      const val = await pageModel.find().exists(roleOfUser);
      value.push(val[0]);
      if (err) res.status(403).json('user not found');
      else {
        res.status(200).json(value);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(401).json('token expired');
  }
  // console.log(decoded);
});
const roleSchema = new mongoose.Schema({});
const roleModel = mongoose.model('roleSchema', roleSchema, 'pages');

router.get('/role', (req, res, next) => {
  const role = new roleModel({});
  roleModel.find({}, async (err, val) => {
    const data = {};
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db('tataProject');
      console.log(db.databaseName);
      const pages = await db.collection('category');
      const a = await pages.find({});
      const category = await a.toArray();
      const roles = await db.collection('roles');
      const allRoles = await roles.find({});
      const getroles = await allRoles.toArray();
      data['roles'] = getroles;
      data['category'] = category;
      data['pages'] = val;
      // console.log(role);
    } catch (err) {
      console.log(err, 'thisiserror');
    } finally {
      client.close();
    }
    if (err) console.log(err);
    res.status(200).json(data);
  });
  // var decoded = jwt.verify(req.body.token, 'secret');
});

const roleUpdateSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  role: {
    type: String,
    required: true,
    dashboard: Boolean,
    manageusers: Boolean,
    profile: Boolean,
    time: Boolean
  }
});
const roleUpdateModel = mongoose.model(
  'roleUpdateSchema',
  roleUpdateSchema,
  'pages'
);

router.post('/role', (req, res, next) => {
  req.body.forEach(async ele => {
    if (ele.toChange) {
      let path = ele.pathname;
      const roleOfUser = ele.role;
      const checked = ele.checked;
      let p = `${roleOfUser}.${path}`;
      const setValue = {};
      setValue[p] = ele.checked;
      const query = { $set: setValue };
      roleModel
        .find({})
        .exists(roleOfUser)
        .exec(async (err, a) => {
          console.log(a);
          let id = a[0]._id;
          const client = new MongoClient(url, { useUnifiedTopology: true });
          try {
            await client.connect();
            const db = client.db('tataProject');
            console.log(db.databaseName);
            const pages = await db.collection('pages');
            const a = await pages.findOneAndUpdate(
              { _id: ObjectId(id) },
              query
            );
            console.log(a);
          } catch (err) {
            console.log(err, 'thisiserror');
          } finally {
            client.close();
          }
        });
    }
  });
});
async function updateCategory(newurl,subcategory){
  const client = await new MongoClient(url, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db('tataProject');
    const category = await db.collection('category');
      if(subcategory === 'url'){
       let a = await category.update({'url':{$exists:true}},{$push:{'url':newurl}});
       console.log(a);
      }
      else{
        let a = await category.update({'setting':{$exists:true}},{$push:{'setting':newurl}});
        console.log(a);
      }
  } catch (err) {
    console.log(err, 'thisiserror');
  } finally {
    client.close();
  }
}
router.post('/addurl', (req, res, next) => {
  let url = req.body[0];
  let subcategory = req.body[1];
  updateCategory(url,subcategory);
  roleModel
  .find({})
  .exec((err, a) => {
   a.forEach((val) => {
     let id = val._id;
     val = val.toObject();
     let role = Object.keys(val)[1];
     let p = `${role}.${req.body[0]}`;
      const setValue = {};
      setValue[p] = false;
      const query = { $set: setValue };
      update(id,query);
   })
  })
});

async function update(id,query){
  const client = await new MongoClient(url, { useUnifiedTopology: true });
     try {
       await client.connect();
       const db = client.db('tataProject');
       const pages = await db.collection('pages');
       console.log(query);
       const b = await pages.updateOne(
         { _id: ObjectId(id)},query);
       console.log(b);
     } catch (err) {
       console.log(err, 'thisiserror');
     } finally {
       client.close();
     }
  }
  // let data = {};
  // let values = req.body[2].reduce((acc, val) => {
  //   console.log(val,acc);
  //  acc[val] = false; 
  //   return acc;     
  // }, {});
  // data[req.body[0]] = values;
  // console.log(data);

module.exports = router;
