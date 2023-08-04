const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ax6qyiu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db("aircncDb").collection("users");
    const roomsCollection = client.db("aircncDb").collection("rooms");

    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;

      const user = req.body;
      console.log(user);
      const query = { email: email };

      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      console.log(result);
      res.send(result);
    });

    // get users role
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // Save a room in database
    app.post("/rooms", async (req, res) => {
      const room = req.body;

      const result = await roomsCollection.insertOne(room);
      res.send(result);
    });

    // get all rooms
    app.get("/rooms", async (req, res) => {
      const result = await roomsCollection.find().toArray();
      res.send(result);
    });
    // get single single room
    app.get("/room/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roomsCollection.findOne(query);
      res.send(result);
    });
    // Save a bookin in database
    app.post("/bookings", async (req, res) => {
      const booking = req.body;

      const result = await roomsCollection.insertOne(booking);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello aircnc is running ");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
