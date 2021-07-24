let mongo = require('mongodb')
let express = require('express')
let bodyParser = require('body-parser')
let app = express()
let f = require('util').format
let user = encodeURIComponent('usertest');
let password = encodeURIComponent('passtest');
let authMechanism = 'DEFAULT';
let dbhost = '10.100.1.4'

let Sec = require('./security/sec')
let s = new Sec()

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
    let signature = s.sign( JSON.stringify(req.body) ) 
    let data = JSON.parse(JSON.stringify(req.body))
    data.signature = signature
    
    db.collection("collection_tutorial").insertOne(data, (err, result) => {
        if(err) throw err
        let success = {"rc":"document success"}
        res.send(success)
    })
})

app.get('/byname/:name', (req, res) => {
    let query = {nama: req.params.name} 
    db.collection("collection_tutorial").find(query).toArray((err, result) => {
        if(err) throw err
        
        if(result === null) {
            let rd = JSON.parse( JSON.stringify(result[0]) )
            let signature = rd.signature
            delete rd.signature
            delete rd['_id']
            let log_validation = s.ver(JSON.stringify( rd ), signature)   // verify data
            let rdata = JSON.parse(JSON.stringify(result[0]))
            rdata.verfiy = log_validation
            res.send(rdata)
        } else {
            res.send({"RC":"DATA NOT FOUND"})
        }
        
    })
})