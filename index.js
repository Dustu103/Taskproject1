
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { admin, db } = require("./firebaseAdmin");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const usersCollection = db.collection("users");

// POST /users
app.post("/users", async (req, res) => {
    // console.log("hi")
  try {
    const user = {
      ...req.body,
      createdAt: admin.firestore.Timestamp.now(),
    };
    const docRef = await usersCollection.add(user);
    res.status(201).send({ id: docRef.id, ...user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /users
app.get("/users", async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /users/:id
app.get("/users/:id", async (req, res) => {
  try {
    const doc = await usersCollection.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// PUT /users/:id
app.put("/users/:id", async (req, res) => {
  try {
    await usersCollection.doc(req.params.id).update(req.body);
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// DELETE /users/:id
app.delete("/users/:id", async (req, res) => {
  try {
    await usersCollection.doc(req.params.id).delete();
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
