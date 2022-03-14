const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const { MongoClient, ServerApiVersion } = require('mongodb');
const  ObjectID = require('mongodb').ObjectId;
const uri = "mongodb+srv://todo:todopassword@cluster0.ka9ky.mongodb.net/todolist?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


client.connect(err => {
    const collection = client.db("todolist").collection("todocollection");

    app.post("/posttodo",(req,res)=>{
        const todo = req.body
        collection.insertOne(todo)
        .then(function(result){
            res.send(result.insertedCount > 0)
        })
    })

    app.get("/gettodo",(req,res)=>{
        collection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

    app.delete("/deleteitem/:id",(req,res)=>{
        const id = req.params.id
        collection.deleteOne({_id:ObjectID(id)})
        .then(function(result){
            res.send(result.deletedCount > 0)
        })
    })

    app.get("/getupdateitem/:id",(req,res)=>{
        const id = req.params.id
        collection.find({_id:ObjectID(id)})
        .toArray((err,documents)=>{
            res.send(documents[0])
        })
    })

    app.patch("/updateitem/:id",(req,res)=>{
        const id = req.params.id
        const name = req.body.name
        console.log(id,name)
        collection.updateOne({_id:ObjectID(id)},{
            $set : { name : name }
        })
        .then(function(result){
            res.send(result.modifiedCount > 0)
        })
    })

    console.log("connected db")
  });
  
  
app.get('/', (req, res) => {
    res.send('todo operation')
})

const port = 4000
app.listen(process.env.PORT || port, console.log("running port 4000"))