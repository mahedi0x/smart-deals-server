const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// smartdbUser
// b7evcn9VSLdRMf8u

const uri = "mongodb+srv://smartdbUser:b7evcn9VSLdRMf8u@cluster0.xtjchvv.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });


  async function run() {
    try{
        await client.connect();
        await client.db("admin").command({ ping: 1});
        console.log("Pinged your deployment..Successful ")
    }
    finally{
    }
  }
  run().catch(console.dir);



app.get("/", (req, res) =>{
    res.send("Hello From server!!");
})

app.listen(port, () =>{
    console.log(`Example app port ${port}`)
})