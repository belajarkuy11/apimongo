let mongo = require('mongodb')
let express = require('express')
let bodyParser = require('body-parser')
let app = express()

app.use(bodyParser.json())

let mongoclient = mongo.MongoClient

let urlDb = 'mongodb://192.168.78.18:27017'

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