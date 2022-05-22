const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
// midleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://mongodbUser:hSMFLPo6zrAqzr8w@cluster0.6plls.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
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
    //   get the all data
    app.get("/", async (req, res) => {
      const query = {};
      const cursor = allToolsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //get all user
    app.get("/user", async (req, res) => {
      let query = {};
      const cursor = usersCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // user added or replace on the database
    app.put("/user", async (req, res) => {
      let filter = { name: req.body.email };
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
    // get user all orrder
    app.get("/order", async (req, res) => {
      let email = req.query.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.put("/order/:id", async (req, res) => {
      let id = req.params.id;
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
      console.log(result);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
