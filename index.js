const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
// midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.6plls.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const allToolsCollection = client
      .db("valigaHardware")
      .collection("allTools");
    const usersCollection = client.db("valigaHardware").collection("user");
    const orderCollection = client.db("valigaHardware").collection("orders");
    const reviewCollection = client.db("valigaHardware").collection("review");
    //   get the all data
    app.get("/", async (req, res) => {
      const query = {};
      const cursor = allToolsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/", async (req, res) => {
      let product = req.body;
      // sendEmail(appoinment);
      const result = await allToolsCollection.insertOne(product);
      res.send({ success: true, result });
    });

    // remove single product  api
    app.delete("/:id", async (req, res) => {
      let id = req.params.id;
      let query = { _id: ObjectId(id) };
      const result = await allToolsCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send(result);
      }
    });
    //get all user
    app.get("/user", async (req, res) => {
      let query = {};
      const cursor = usersCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // make admin api request
    // user role change api
    app.put("/user/admin/:email", async (req, res) => {
      let email = req.params.email;
      let filter = { email: email };
      const updateDoc = {
        $set: { role: "admin" },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    // user added or replace on the database
    app.put("/user", async (req, res) => {
      let filter = { email: req.body.email };
      let data = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Post user all orders
    app.post("/order", async (req, res) => {
      let order = req.body;
      // sendEmail(appoinment);
      const result = await orderCollection.insertOne(order);
      res.send({ success: true, result });
    });
    // get user all order
    app.get("/order", async (req, res) => {
      let email = req.query.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // get  all orrder
    app.get("/allOrder", async (req, res) => {
      let query = {};
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // unpaid order status change api
    app.put("/allOrder/:id", async (req, res) => {
      let id = req.params.id;
      let query = { _id: ObjectId(id) };
      //  let email = req.params.email;
      //  let filter = { email: email };
      const updateDoc = {
        $set: { status: "Shipped" },
      };
      const result = await orderCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    //inserted user order if
    app.put("/order/:id", async (req, res) => {
      let id = req.params.id;
      let tnx = req.body;
      let filter = { _id: ObjectId(id) };
      let options = { upsert: true };
      const updateDoc = {
        $set: { paid: true },
      };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      // console.log(result);
      res.send(result);
    });

    // remove single item api
    app.delete("/order/:id", async (req, res) => {
      let id = req.params.id;
      let query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send(result);
      }
    });

    // insert review api
    // get all reviews
    app.get("/review", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // Post user all orders
    app.post("/review", async (req, res) => {
      let review = req.body;
      // sendEmail(appoinment);
      const result = await reviewCollection.insertOne(review);
      res.send({ success: true, result });
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
