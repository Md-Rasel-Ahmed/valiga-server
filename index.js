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

    //   get the all data
    app.get("/", async (req, res) => {
      const query = {};
      const cursor = allToolsCollection.find(query);
      const result = await cursor.toArray();
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
