const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dhl2xpe.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('productDB').collection('amazon')

    app.get('/product', async(req, res)=> {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/product/:id', async(req, res)=> {
      const id = req.params.id;
      const query =  {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.put('/product/:id', async(req, res)=> {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id)}
      const options = {upsert: true}
      const updateProduct = req.body
      const updateProductDetails = {
          $set:{
            image:updateProduct.image, 
            name:updateProduct.name, 
            brand:updateProduct.brand, 
            type:updateProduct.type, 
            price:updateProduct.price, 
            description:updateProduct.description, 
            rating:updateProduct.rating
          }
      }
      const result = await productCollection.updateOne(filter, updateProductDetails, options)
      res.send(result)
    })



    app.post('/product', async(req, res)=> {
        const newProduct = req.body;
        console.log(newProduct)

        const result = await productCollection.insertOne(newProduct);
        res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=> {
    res.send('Myon Gadget server running...')
});

app.listen(port, ()=> {
    console.log(`Myon Gadget server running on port: ${port}`)
})