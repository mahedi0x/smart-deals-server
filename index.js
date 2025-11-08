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
        const bidsCollection = db.collection("bids");
        const usersCollection = db.collection("users");

        // app.post("/users", async(req, res)=>{
        //     const newUser = req.body;
        //     const result = await usersCollection.insertOne(newUser);
        //     res.send(result);
        // })

         // USERS APIs
         app.post('/users', async (req, res) => {
            const newUser = req.body;
            const email = req.body.email;
            const query = { email: email }
            const existingUser = await usersCollection.findOne(query);

            if (existingUser) {
                res.send({ message: 'user already exits. do not need to insert again' })
            }
            else {
                const result = await usersCollection.insertOne(newUser);
                res.send(result);
            }
        })


        // ======================== Get All Products  ========================
        app.get("/products", async (req, res) => {
            // const projectFields = {title: 1, price_min: 1, price_max: 1, image: 1};
            // const product = (await productCollection.find().sort({price_min: 1}).limit(5).project(projectFields).toArray());

            console.log(req.query);
            const email = req.query.email;
            const query = {};
            if(email){
                query.email = email;
            }

            const product = (await productCollection.find(query).toArray());
            res.send(product);
          });


        // ======================== Find  ========================
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
            const id = req.params.id; 
            const updatedProduct = req.body; 
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


        //======================== bid related api ======================

        app.get("/bids", async(req, res) =>{
            const email = req.query.email;
            const query = {};
            if(email){
                query.buyer_email = email;
            }
            const result = await bidsCollection.find(query).toArray();
            res.send(result);
        })



        app.post("/bids", async(req, res) =>{
            const newBid = req.body;
            const result = await bidsCollection.insertOne(newBid);
            res.send(result)
        })


        app.get("/bids/:id", async(req, res) =>{
            const id = req.params.id;
            console.log(id);
            // const query = {_id: new ObjectId(id)};
            const bid = await bidsCollection.findOne({ _id: id }); 
            res.send(bid)
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