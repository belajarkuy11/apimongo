let mongo = require('mongodb')
let express = require('express')
let bodyParser = require('body-parser')
let app = express()
let f = require('util').format
let user = encodeURIComponent('usertest');
let password = encodeURIComponent('passtest');
let authMechanism = 'DEFAULT';
let dbhost = '10.100.1.4'

app.use(express.json())

let mongoclient = mongo.MongoClient    

let urlDb = f('mongodb://%s:%s@%s:27018/dbtest?authMechanism=%s',
  user, password, dbhost, authMechanism);

let db

mongoclient.connect(urlDb, (err, database) => {
    db = database.db('dbtest')
    app.listen(3000, () =>{
        console.log('server nyala lah!!!')
    })
})

app.post('/save', (req, res) => {
    db.collection("collection_tutorial").insertOne(req.body, (err, result) => {
        if(err) throw err
        let success = {"rc":"document success"}
        res.send(success)
    })
})

app.get('/all', (req, res) => {
    db.collection("collection_tutorial").find({}).toArray((err, result) => {
        if(err) throw err
        res.send(result)
    })
})

app.get('/byname/:name', (req, res) => {
  let query = {nama: req.params.name}  
  db.collection("collection_tutorial").find(query).toArray((err, result) => {
      if(err) throw err
      res.send(result)
  })
})

app.get('/byalamat/:alamat', (req, res) => {
    let query = {alamat: req.params.alamat}  
  db.collection("collection_tutorial").find(query).toArray((err, result) => {
      if(err) throw err
      res.send(result)
  })
})

// url
app.put('/update/nama/:namalama/:namabaru', (req, res) => {
    let query = {nama: req.params.namalama}
    let newValues = {$set: {nama: req.params.namabaru}}
    db.collection("collection_tutorial").updateOne(query, newValues, (err, result) => {
        if(err) throw err
        let success = {"rc":"document success"}
        res.send(success)
    })
})

// body json
app.put('/update/nama/:namalama', (req, res) => {
    let query = {nama: req.params.namalama}
    let newValues = {$set: {nama: req.body.nama}}
    db.collection("collection_tutorial").updateOne(query, newValues, (err, result) => {
        if(err) throw err
        let success = {"rc":"document success"}
        res.send(success)
    })
})

app.delete('/delete/bynama/:nama', (req, res) => {
    let query = {nama: req.params.nama}
    db.collection("collection_tutorial").deleteOne(query, (err, result) => {
        if(err) throw err
        let success = {"rc":"delete document success"}
        res.send(success)
    })
})