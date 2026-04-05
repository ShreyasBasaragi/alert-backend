const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Firebase Admin setup
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🚨 ALERT API
app.post("/send-alert", async (req, res) => {
  try {
    const message = {
      topic: "group_123",
      data: {
        title: "ALERT 🚨",
        body: "Someone triggered alert",
      },
    };

    await admin.messaging().send(message);

    res.send("Alert sent");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
