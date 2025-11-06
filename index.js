const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

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

        const db = client.db("smart_db");
        const productCollection = db.collection("products");

        // ======================== Get All Products  ========================
        app.get("/products", async (req, res) => {
            const product = await productCollection.find().toArray();
            res.send(product);
          });


        // ======================== Get specific Product by id ========================
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = await productCollection.findOne(query);
            res.send(user);
          });

        // ============================ Post ==========================
        app.post("/products", async(req, res) =>{
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

         // ======================= Update ====================
        app.patch("/products/:id", async (req, res) => {
            const id = req.params.id; // URL থেকে id নেওয়া
            const updatedProduct = req.body; // ক্লায়েন্ট থেকে আপডেট ডেটা
            const query = { _id: new ObjectId(id) };
            const updateDoc = {
              $set: {
                name: updatedProduct.name,
                price: updatedProduct.price,
              },
            };
            const result = await productCollection.updateOne(query, updateDoc);
            res.send(result);
          });


        // ======================= Delete ===================
        app.delete("/products/:id", async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })



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